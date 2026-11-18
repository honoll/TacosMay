// Tacos a domicilio en Cabo San Lucas: versión de prueba (docs/diseno/domicilio.md).
// La página solo pinta el estado de flujo.js y solo habla con reparto.js (hoy, simulado). La lista de tacos se
// pinta una vez; después solo cambian números, el paso visible y el seguimiento (sin rehacer el DOM).
// Movimiento con GSAP; sin GSAP o con movimiento reducido, cada estado se ve quieto y completo.
import { money, esc } from '../js/api.js';
import { charola, picto } from '../js/barra.js';
import { iniciarCabecera } from '../js/cabecera.js';
import { toques } from '../js/toques.js';
import { MENU, MAX_POR_GUISO } from './menu.js';
import * as reparto from './reparto.js';
import { flujo } from './flujo.js';

iniciarCabecera();
toques();

const main = document.getElementById('domicilio');
const $ = (s) => main.querySelector(s);
const animador = () => (globalThis.matchMedia?.('(prefers-reduced-motion: no-preference)').matches ? globalThis.gsap ?? null : null);
const activa = () => main.isConnected && location.pathname.startsWith('/domicilio/');

// Para enseñar los estados de «cerrado» y de error: /domicilio/?demo=cerrado o ?demo=falla.
const demo = new URLSearchParams(location.search).get('demo');
reparto.demostrar({ cerrado: demo === 'cerrado', falla: demo === 'falla' });

const f = flujo(reparto);

// ---------- Paso 1: los tacos (se pintan una vez) ----------
const MAS = '<svg class="signo" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';
const MENOS = '<svg class="signo" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';
$('.tacos').innerHTML = MENU.map((g) => `
  <li class="taco" data-id="${g.id}">
    ${charola(g.nombre, '', { tag: 'div', cls: 'mini', titulo: false })}
    <div class="taco-datos">
      <h3>${esc(g.nombre)}</h3>
      <p class="meta"><b>${money(g.precio_centavos)}</b> el taco</p>
    </div>
    <div class="cuantos" role="group" aria-label="Tacos de ${esc(g.nombre)}">
      <button type="button" data-cambio="-1" aria-label="Uno menos de ${esc(g.nombre)}">${MENOS}</button>
      <output aria-live="polite">0</output>
      <button type="button" data-cambio="1" aria-label="Uno más de ${esc(g.nombre)}">${MAS}</button>
    </div>
  </li>`).join('');
$('.tacos').addEventListener('click', (e) => {
  const b = e.target.closest('[data-cambio]');
  if (!b) return;
  const li = b.closest('.taco');
  const antes = f.estado.cantidades[li.dataset.id] ?? 0;
  f.cambiar(li.dataset.id, Number(b.dataset.cambio));
  pintar();
  const ahora = f.estado.cantidades[li.dataset.id] ?? 0;
  if (ahora !== antes) animador()?.fromTo(li.querySelector('output'), { yPercent: ahora > antes ? 70 : -70, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.22, ease: 'back.out(2)' });
});

// ---------- Paso 2: a dónde ----------
const colonia = $('#d-colonia');
colonia.innerHTML = reparto.zonas().map((z) => `<option>${esc(z)}</option>`).join('') + '<option value="otra">Otra colonia</option>';
$('#form-destino').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  if (!form.reportValidity()) return;
  const d = Object.fromEntries(new FormData(form));
  const boton = form.querySelector('button[type="submit"]');
  boton.disabled = true;
  boton.classList.add('enviando');
  try {
    await f.cotizar({ calle: d.calle.trim(), colonia: d.colonia === 'otra' ? d.otra.trim() : d.colonia, referencias: d.referencias.trim(), nombre: d.nombre.trim(), telefono: d.telefono.trim() });
  } finally {
    boton.disabled = false;
    boton.classList.remove('enviando');
  }
  pintar();
  if (f.estado.paso === 'confirmar') enfocar('#paso-confirmar h2');
  else $('.problema')?.focus();
});
// «Otra colonia» pide cuál; mientras no se elige, su campo va apagado para que no detenga el formulario.
colonia.addEventListener('change', () => {
  const otra = colonia.value === 'otra';
  $('.otra-colonia').hidden = !otra;
  $('#d-otra').disabled = !otra;
});

// ---------- Paso 3: confirmar ----------
$('#confirmar').addEventListener('click', async () => {
  const pago = main.querySelector('input[name="pago"]:checked')?.value ?? 'al_recibir';
  await f.confirmar(pago);
  pintar();
  enfocar('#paso-seguimiento h2');
  seguir();
});

// ---------- Navegación entre pasos ----------
main.addEventListener('click', (e) => {
  const b = e.target.closest('[data-ir]');
  if (!b) return;
  f.ir(b.dataset.ir);
  pintar();
  enfocar(`#paso-${f.estado.paso} h2`);
});
$('#repetir').addEventListener('click', async () => {
  await f.repetir();
  $('#form-destino').reset();
  colonia.dispatchEvent(new Event('change'));
  pintar();
  enfocar('#paso-pedido h2');
});

function enfocar(sel) {
  const h = main.querySelector(sel);
  if (!h) return;
  h.setAttribute('tabindex', '-1');
  h.focus({ preventScroll: true });
  h.scrollIntoView({ block: 'nearest' });
}

// ---------- Pintar el estado (sin rehacer el DOM: solo números, textos y qué paso se ve) ----------
const MOTIVOS = {
  fuera_de_cobertura: 'Por ahora no llegamos a esa colonia. Puedes pedir guiso empacado, que se envía a todo el país.',
  cerrado: 'Ahorita la cocina está cerrada. La barra del centro cierra a las 4 a. m.; la hora de apertura está por confirmar.',
  error: 'No pudimos cotizar el envío. Dale otra vez en un momento.',
  pedido_vacio: 'Agrega al menos un taco.',
};
let pasoPintado = null;
let resumenPuesto = '';
function pintar() {
  const s = f.estado;
  const p = f.pedido();
  for (const li of main.querySelectorAll('.taco')) {
    const n = s.cantidades[li.dataset.id] ?? 0;
    li.querySelector('output').textContent = n;
    li.classList.toggle('lleva', n > 0);
    li.querySelector('[data-cambio="-1"]').disabled = !n || Boolean(s.entrega);
    li.querySelector('[data-cambio="1"]').disabled = n >= MAX_POR_GUISO || Boolean(s.entrega);
  }
  for (const sec of main.querySelectorAll('[data-paso]')) {
    if (sec.matches('section')) sec.hidden = sec.dataset.paso !== s.paso;
    else sec.setAttribute('aria-current', sec.dataset.paso === s.paso ? 'step' : 'false');
  }
  // La cuenta del pedido
  $('.c-piezas').textContent = `${p.piezas} ${p.piezas === 1 ? 'taco' : 'tacos'}`;
  $('.c-tacos').textContent = money(p.subtotal_centavos);
  $('.c-envio').textContent = s.cotizacion ? money(s.cotizacion.envio_centavos) : 'se cotiza con tu dirección';
  $('.c-total').textContent = money(f.total());
  const cont = $('#continuar');
  cont.hidden = s.paso !== 'pedido';
  cont.disabled = !p.piezas || !reparto.abierto();
  $('.vacio-dom').hidden = p.piezas > 0;
  $('.cerrado').hidden = reparto.abierto();
  // Problema al cotizar
  const prob = $('.problema');
  prob.hidden = !s.problema;
  prob.querySelector('.texto').textContent = MOTIVOS[s.problema] ?? '';
  prob.querySelector('.a-empacado').hidden = s.problema !== 'fuera_de_cobertura';
  // Resumen para confirmar
  if (s.paso === 'confirmar' || s.paso === 'seguimiento') {
    const html = `
      <ul>${p.items.map((i) => `<li><span>${esc(i.cantidad)} × ${esc(i.nombre)}</span><span>${money(i.cantidad * i.precio_centavos)}</span></li>`).join('')}</ul>
      <p class="a-donde">${picto('Lugar')} <span>${esc(s.destino?.calle ?? '')}, ${esc(s.destino?.colonia ?? '')}${s.destino?.referencias ? ` · ${esc(s.destino.referencias)}` : ''}<br>Recibe ${esc(s.destino?.nombre ?? '')} · Tel. ${esc(s.destino?.telefono ?? '')}</span></p>`;
    if (html !== resumenPuesto) for (const el of main.querySelectorAll('.resumen-pedido')) el.innerHTML = html;
    resumenPuesto = html;
  }
  if (s.paso !== pasoPintado) {
    animador()?.fromTo(`#paso-${s.paso}`, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.28, ease: 'power3.out', clearProps: 'transform,opacity,visibility' });
    pasoPintado = s.paso;
  }
}

// ---------- Paso 4: el seguimiento, que avanza solo ----------
const TEXTOS = {
  recibido: 'La taquería ya tiene tu pedido.',
  preparando: 'Se están sirviendo tus tacos.',
  asignado: 'Tu pedido va en su bolsa, con el repartidor.',
  en_camino: 'Va en camino a tu dirección.',
  entregado: '¡Entregado! Buen provecho.',
};
let mostrado = null;
let reloj = 0;
async function seguir() {
  clearTimeout(reloj);
  if (!f.estado.entrega || !activa()) return;
  const e = await f.seguir();
  const pasos = [...main.querySelectorAll('.linea li')];
  pasos.forEach((li, i) => {
    li.classList.toggle('hecho', i < e.indice);
    li.classList.toggle('ahora', i === e.indice);
    li.setAttribute('aria-current', i === e.indice ? 'step' : 'false');
  });
  $('.estado-texto').textContent = TEXTOS[e.paso] ?? '';
  $('.repartidor').hidden = !e.repartidor;
  if (e.paso !== mostrado) {
    escena(e.paso);
    mostrado = e.paso;
  }
  if (e.paso !== 'entregado' && e.paso !== 'cancelado') reloj = setTimeout(seguir, 500);
}

// La escena de cada paso: palomita, la charola que se sirve, la bolsa que se cierra, la moto que sale, el lugar.
function escena(paso) {
  for (const el of main.querySelectorAll('.escena > *')) el.hidden = el.dataset.escena !== paso;
  const el = main.querySelector(`.escena [data-escena="${paso}"]`);
  const gsap = animador();
  if (!gsap || !el) return;
  const tl = gsap.timeline();
  tl.fromTo(el, { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'back.out(2)' });
  if (paso === 'preparando') tl.fromTo(el.querySelectorAll('.vapor-linea'), { y: 6, autoAlpha: 0 }, { y: -6, autoAlpha: 1, duration: 0.8, stagger: 0.15, repeat: -1, yoyo: true, ease: 'sine.inOut' }, 0.2);
  if (paso === 'asignado') tl.fromTo(el.querySelector('.solapa'), { scaleY: -1 }, { scaleY: 1, transformOrigin: '50% 100%', duration: 0.4, ease: 'power2.inOut' }, 0.25);
  if (paso === 'en_camino') tl.fromTo(el.querySelector('.moto'), { x: -40 }, { x: 60, duration: 1.4, ease: 'power1.inOut', repeat: -1, yoyo: true }, 0.1);
  if (paso === 'entregado') tl.fromTo(el.querySelector('.palomita'), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35, ease: 'back.out(3)' }, 0.2);
}

// Al volver a esta página sin recargar (js/paginas.js), el seguimiento sigue donde iba.
addEventListener('tm:pagina', () => { if (activa()) { pintar(); seguir(); } });

pintar();
if (f.estado.entrega) seguir();
