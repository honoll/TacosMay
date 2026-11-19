// Pinta la demo guiada (guion.js) y la controla con → / espacio / clic. Nada avanza solo: solo corren el
// cronómetro y la cuenta regresiva del TTL de cada carrito.
import { api, esc } from '../../js/api.js';
import { crearGuion } from './guion.js';

const $ = (s) => document.querySelector(s);
const META = 4 * 60;
let guion;
let admin = null; // solo en memoria: ni se muestra ni se guarda
let i = -1; // -1 = antes de empezar
let listo = false; // preparado (clientes registrados y catálogo leído)
let corriendo = false;
let inicio = 0;
const ttl = {}; // quien → hora en que expira su carrito (0 = borrado)

const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.max(0, Math.floor(s % 60))).padStart(2, '0')}`;

// Lo largo se resume: de una lista, los primeros dos y cuántos son.
const resumir = (v) => (Array.isArray(v) ? (v.length > 2 ? [...v.slice(0, 2).map(resumir), `… (${v.length} en total)`] : v.map(resumir))
  : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resumir(x)])) : v);

// La primera llamada es la del paso: con su respuesta completa. Las demás (lecturas de comprobación), en una línea.
function pintarLlamada(n, k) {
  const ok = n.status >= 200 && n.status < 300;
  return `<div class="llamada"><span class="linea-http">${esc(n.metodo)} ${esc(n.ruta)}</span>${n.cuerpo ? `\n${esc(JSON.stringify(n.cuerpo))}` : ''}${k ? '' : '\n'}<span class="status${ok ? '' : ' no'}">${n.status || 'sin respuesta'}</span>${k ? '' : `<span class="json">${esc(JSON.stringify(resumir(n.respuesta), null, 1))}</span>`}</div>`;
}

function pintarPaso(p, r, error) {
  $('.n-paso').textContent = `Paso ${i + 1} de ${guion.pasos.length}`;
  $('.titulo-paso').textContent = p.titulo;
  $('.decir').textContent = p.decir;
  $('.llamadas').innerHTML = (r?.log ?? []).map(pintarLlamada).join('') || (corriendo ? '<p>Llamando a la API…</p>' : '');
  $('.redis').textContent = (r?.redis ?? []).join('\n');
  $('.cambios').innerHTML = [...(r?.cambios ?? []), ...[r?.aviso, r?.saltado].filter(Boolean)].map((c) => `<li>${esc(c)}</li>`).join('');
  $('.problema').hidden = !error;
  $('.problema .texto').textContent = error ? `Falló: ${error.status ? `${error.status} · ` : ''}${error.message}` : '';
}

async function correr() {
  const p = guion.pasos[i];
  corriendo = true;
  pintarPaso(p, null, null);
  const sec = $('#paso');
  sec.classList.remove('entra');
  void sec.offsetWidth; // vuelve a arrancar la entrada del panel
  sec.classList.add('entra');
  let r = null;
  let error = null;
  try {
    r = await p.correr();
    if (r.ttl) ttl[r.ttl.quien] = r.ttl.segundos ? Date.now() + r.ttl.segundos * 1000 : 0;
  } catch (e) {
    error = e;
  }
  corriendo = false;
  pintarPaso(p, r, error);
}

function avanzar() {
  if (corriendo) return;
  if (i === -1) {
    if (!listo) return;
    $('#preparar').hidden = true;
    $('#paso').hidden = false;
    inicio = Date.now();
  }
  if (i + 1 >= guion.pasos.length) { fin(); return; }
  i += 1;
  correr();
}

function fin() {
  if (i === guion.pasos.length) return;
  i = guion.pasos.length;
  $('.n-paso').textContent = 'Fin';
  $('.titulo-paso').textContent = 'Flujo completo, conectado a Redis Cloud';
  $('#paso').hidden = true;
  inicio = -(Date.now() - inicio); // el cronómetro se detiene donde iba
}

async function preparar() {
  guion = crearGuion({ api, admin });
  listo = false;
  i = -1;
  inicio = 0;
  for (const k of Object.keys(ttl)) delete ttl[k];
  $('#preparar').hidden = false;
  $('#paso').hidden = true;
  $('.n-paso').textContent = 'Antes de empezar';
  $('.titulo-paso').textContent = 'Demo guiada';
  const estado = $('.estado-preparar');
  estado.textContent = 'Registrando a los clientes A y B y leyendo el catálogo…';
  try {
    await guion.preparar();
    const { guiso, a, b } = guion.contexto.eleccion;
    listo = true;
    $('.titulo-paso').focus(); // el foco fuera del botón: → y espacio ya avanzan
    estado.textContent = `Listo. ${guiso.nombre}: quedan ${guiso.stock}; A pedirá ${a} y B ${b}. ${admin ? 'Admin: en memoria.' : 'Sin admin: esos pasos se saltan.'} Proyecta y presiona → para empezar.`;
  } catch (e) {
    estado.textContent = `No se pudo preparar: ${e.status ? `${e.status} · ` : ''}${e.message} (si Render dormía, espera un minuto y vuelve a preparar).`;
  }
}

$('#form-preparar').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.currentTarget.elements;
  admin = f.email.value.trim() && f.password.value ? { email: f.email.value.trim(), password: f.password.value } : null;
  f.password.value = ''; // fuera de la pantalla en cuanto se usa
  preparar();
});
$('#reiniciar').addEventListener('click', () => { if (!corriendo) preparar(); });
$('#reintentar').addEventListener('click', (e) => { e.stopPropagation(); if (!corriendo) correr(); });

addEventListener('keydown', (e) => {
  if (e.target.closest?.('input, textarea')) return;
  // Espacio sobre un botón lo oprime (no avanza): así no se reinicia por accidente.
  if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !e.target.closest?.('button'))) { e.preventDefault(); avanzar(); }
});
$('#demo').addEventListener('click', (e) => { if (!e.target.closest('button, input, label, a, form')) avanzar(); });

// Cronómetro y TTL de los carritos (lo único que corre solo).
setInterval(() => {
  const s = inicio > 0 ? (Date.now() - inicio) / 1000 : inicio < 0 ? -inicio / 1000 : 0;
  $('.crono').textContent = mmss(s);
  $('.crono').classList.toggle('pasado', s > META);
  for (const el of document.querySelectorAll('.ttl')) {
    const fin = ttl[el.dataset.quien];
    el.hidden = fin === undefined;
    if (fin === undefined) continue;
    const r = (fin - Date.now()) / 1000;
    el.classList.toggle('borrado', fin === 0 || r <= 0);
    el.textContent = `Carrito ${el.dataset.quien} ${fin === 0 ? 'borrado' : r <= 0 ? 'expiró' : mmss(Math.ceil(r))}`;
  }
}, 250);
