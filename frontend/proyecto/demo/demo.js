// Pinta la demo guiada (guion.js) con las piezas de la tienda: a la izquierda lo que vería el cliente, a la
// derecha la petición, los comandos de Redis y la respuesta. Se avanza con → / espacio / clic; nada avanza solo.
import { api, esc, money } from '../../js/api.js';
import { charola, guisoDe } from '../../js/barra.js';
import { crearGuion } from './guion.js';

const $ = (s) => document.querySelector(s);
let guion;
let admin = null; // solo en memoria: ni se muestra ni se guarda
let i = -1; // paso a la vista (-1 = antes de empezar)
let listo = false;
let corriendo = false;
let fotos = []; // lo que se pintó en cada paso ya corrido: «Anterior» lo vuelve a enseñar sin repetir llamadas
let e = {}; // lo que la tienda tiene a la vista: guisos, carritos de A y B, pedido, guiso de admin
const fin = {}; // quien → hora en que expira su carrito
const TTL = 1800;

const fecha = (v) => new Date(isNaN(v) ? v : Number(v)).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });
const resumir = (v) => (Array.isArray(v) ? (v.length > 2 ? [...v.slice(0, 2).map(resumir), `… (${v.length} en total)`] : v.map(resumir))
  : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resumir(x)])) : v);

// ---------- Piezas de la tienda (mismo marcado que tienda/app.js, sin sus botones) ----------
function renglon(g, antes) {
  if (!g) return '';
  const tope = Math.max(1, ...Object.values(e.guisos).map((x) => Number(x.stock) || 0));
  const n = guisoDe(g.nombre).n;
  const quedan = antes != null && antes !== g.stock ? `quedan ${esc(antes)} → <b>${esc(g.stock)}</b>` : `quedan ${esc(g.stock)}`;
  return `<li class="renglon${g.stock > 0 ? '' : ' agotado'}">${charola(g.nombre, '', { tag: 'div', cls: 'mini', titulo: false, cargar: 'eager' })}<div class="datos">
    <h3>${n ? `${esc(n)} · ` : ''}${esc(g.nombre)}</h3>
    ${g.vendidos != null ? `<p class="tag">${esc(g.vendidos)} ${Number(g.vendidos) === 1 ? 'vendido' : 'vendidos'}</p>` : ''}
    <p class="meta"><b>${money(g.precio_centavos)}</b> · ${esc(g.porciones)} porciones · ${quedan}</p>
    ${g.stock > 0 ? `<p class="existencias${g.stock <= 5 ? ' pocas' : ''}" aria-hidden="true"><i style="--lleno:${(Math.min(g.stock, tope) / tope).toFixed(3)}"></i></p>` : '<p class="acabo">Se acabó por hoy</p>'}
  </div></li>`;
}

const anillo = (quien) => `<svg class="anillo" data-anillo="${quien}" viewBox="0 0 36 36" aria-hidden="true"><circle class="pista" cx="18" cy="18" r="15.915"/><circle class="avance" cx="18" cy="18" r="15.915"/></svg>`;

function pedido(p) {
  const piezas = p.items.reduce((t, x) => t + x.cantidad, 0);
  return `<ul class="pedidos"><li class="card nuevo"><details open><summary><h2>Pedido #${esc(p.id)}</h2>
    <span class="meta">${esc(fecha(p.creado))} · ${piezas} ${piezas === 1 ? 'guiso' : 'guisos'}</span><strong>${money(p.total_centavos)}</strong></summary>
    <ul>${p.items.map((x) => `<li><span>${esc(x.cantidad)} × ${esc(x.nombre)}</span><span>${money(x.precio_centavos * x.cantidad)}</span></li>`).join('')}</ul>
    <p class="total">Total: <strong>${money(p.total_centavos)}</strong></p></details></li></ul>`;
}

function cliente(quien) {
  const c = e.carrito[quien];
  const p = e.pedido[quien];
  let cuerpo;
  if (p) cuerpo = pedido(p);
  else if (c?.items.length) {
    cuerpo = `<p class="expira">${anillo(quien)} Expira en <strong data-ttl="${quien}"></strong></p>
      <ul class="lista">${c.items.map(({ guiso: g, cantidad }) => `<li><div class="crece"><strong>${esc(g.nombre)}</strong><br>${money(g.precio_centavos)} c/u</div>
        <span>${esc(cantidad)} ×</span><strong>${money(g.precio_centavos * cantidad)}</strong></li>`).join('')}</ul>
      <p class="total">Total: <strong>${money(c.total_centavos)}</strong></p>
      ${e.error[quien] ? `<p class="error-campo">${esc(e.error[quien])}</p>` : ''}`;
  } else cuerpo = `<p class="meta">${e.borrado[quien] ? 'Carrito vacío: se borró al confirmar.' : 'Carrito vacío.'}</p>`;
  return `<section class="cliente"><h2>${p ? 'Pedidos' : 'Carrito'} de ${quien}</h2>${cuerpo}</section>`;
}

function adminVista(r) {
  if (r.saltado) return `<div class="vacio"><h2>Administración</h2><p>${esc(r.saltado)}</p></div>`;
  const g = e.nuevo;
  if (e.eliminado) return `<ul class="lista"><li><div class="crece"><strong><s>${esc(g.nombre)}</s></strong><br>Eliminado: ya no está en el catálogo.</div></li></ul>`;
  const campo = (id, label, v) => `<label for="a-${id}">${label}</label><input id="a-${id}" value="${esc(v)}" readonly>`;
  return `<div class="dos"><form class="form"><h2>${e.editado ? `Editar «${esc(g.nombre)}»` : 'Nuevo guiso'}</h2>
      ${campo('nombre', 'Nombre', g.nombre)}${campo('precio', 'Precio (pesos)', g.precio_centavos / 100)}${campo('porciones', 'Porciones', g.porciones)}${campo('stock', 'Existencias', g.stock)}</form>
    <ul class="lista"><li class="guardado"><div class="crece"><strong>${esc(g.nombre)}</strong> <span class="palomita">✓ Guardado</span><br>
      ${money(g.precio_centavos)} · ${esc(g.porciones)} porciones · quedan ${esc(g.stock)}</div></li></ul></div>`;
}

// ---------- Lo que cada paso cambia en la tienda (con las respuestas reales) ----------
const guisoDelPaso = () => e.guisos[guion.contexto.eleccion.guiso.id];
function aplicar(id, r) {
  const res = (k) => r.log[k]?.respuesta;
  const { guiso, otro } = guion.contexto.eleccion;
  e.antes = null;
  const popular = (lista) => { const v = lista?.find((x) => x.id === guiso.id)?.vendidos; e.guisos[guiso.id].vendidos = v ?? 0; };
  if (id === 'catalogo') { for (const g of res(0)) e.guisos[g.id] = g; popular(res(1)); }
  if (id === 'a-agrega') e.carrito.A = res(0);
  if (id === 'a-renueva') e.carrito.A = res(1);
  if (id === 'b-agrega') e.carrito.B = res(0);
  if (id === 'a-confirma') {
    e.antes = e.guisos[guiso.id].stock;
    e.pedido.A = res(0); e.carrito.A = null; e.borrado.A = true;
    e.guisos[guiso.id] = { ...e.guisos[guiso.id], ...res(1) }; popular(res(2));
  }
  if (id === 'b-confirma') { if (r.log[0].status === 409) e.error.B = res(0).message; else { e.pedido.B = res(0); e.carrito.B = null; } }
  if (id === 'admin-crea' && !r.saltado) e.nuevo = res(1);
  if (id === 'admin-edita' && !r.saltado) { e.nuevo = res(0); e.editado = true; }
  if (id === 'admin-elimina' && !r.saltado) e.eliminado = true;
  if (id === 'persistencia') { const p = res(0).find((x) => x.id === e.pedido.A?.id); if (p) e.pedido.A = p; e.guisos[guiso.id] = { ...e.guisos[guiso.id], ...res(1) }; }
  if (r.ttl) fin[r.ttl.quien] = r.ttl.segundos ? Date.now() + r.ttl.segundos * 1000 : 0;
  return { otro };
}

function vista(id, r) {
  if (id.startsWith('admin')) return adminVista(r);
  const g = guisoDelPaso();
  const lista = `<ul class="renglones">${renglon(g, e.antes)}${id === 'catalogo' && guion.contexto.eleccion.otro ? renglon(e.guisos[guion.contexto.eleccion.otro.id]) : ''}</ul>`;
  if (id === 'catalogo') return lista;
  return `${lista}<div class="dos">${cliente('A')}${cliente('B')}</div>${r.aviso ? `<p class="error-campo">${esc(r.aviso)}</p>` : ''}`;
}

function tecnico(r) {
  const log = r?.log ?? [];
  const llamadas = log.map((n) => `<p class="http"><b>${esc(n.metodo)} ${esc(n.ruta)}</b>${n.cuerpo ? ` ${esc(JSON.stringify(n.cuerpo))}` : ''} <span class="status">→ ${n.status || 'sin respuesta'}</span></p>`).join('');
  const redis = r?.redis?.length ? `<h2>Redis</h2><pre class="redis">${esc(r.redis.join('\n'))}</pre>` : '';
  const principal = log.find((n) => n.ruta !== '/api/users/login') ?? log[0]; // la del paso, no la del login
  const resp = principal ? `<h2>Respuesta</h2><pre class="json">${esc(JSON.stringify(resumir(principal.respuesta), null, 1))}</pre>` : '';
  return log.length ? `<h2>Petición</h2>${llamadas}${redis}${resp}` : '';
}

// ---------- Control ----------
function mostrar(k) {
  i = k;
  const f = fotos[k];
  $('.titulo-paso').textContent = guion.pasos[k].titulo;
  $('.vista').innerHTML = f.vista;
  $('.tecnico').innerHTML = f.tecnico;
  $('#aviso').hidden = true;
  botones();
  tick();
}

async function correr(k) {
  const p = guion.pasos[k];
  corriendo = true;
  i = k;
  botones();
  $('.titulo-paso').textContent = p.titulo;
  $('.tecnico').innerHTML = '<p class="meta">Llamando a la API…</p>';
  $('#aviso').hidden = true;
  try {
    const r = await p.correr();
    aplicar(p.id, r);
    fotos[k] = { vista: vista(p.id, r), tecnico: tecnico(r) };
    corriendo = false;
    mostrar(k);
  } catch (err) {
    corriendo = false;
    fotos.length = k; // este paso no quedó: se reintenta o se sigue
    $('.tecnico').innerHTML = '';
    $('#aviso .texto').textContent = `Falló: ${err.status ? `${err.status} · ` : ''}${err.message}`;
    $('#aviso').hidden = false;
    botones();
  }
}

function botones() {
  $('#anterior').disabled = corriendo || i <= 0;
  $('#siguiente').disabled = corriendo || !listo || i + 1 >= (guion?.pasos.length ?? 0);
}

function avanzar() {
  if (corriendo || !listo || i + 1 >= guion.pasos.length) return;
  if (i === -1) { $('#preparar').hidden = true; $('#paso').hidden = false; }
  if (fotos[i + 1]) mostrar(i + 1); else correr(i + 1);
}
function retroceder() { if (!corriendo && i > 0) mostrar(i - 1); }

async function preparar() {
  guion = crearGuion({ api, admin });
  listo = false; i = -1; fotos = [];
  e = { guisos: {}, carrito: {}, pedido: {}, error: {}, borrado: {} };
  for (const k of Object.keys(fin)) delete fin[k];
  $('#preparar').hidden = false;
  $('#paso').hidden = true;
  $('#aviso').hidden = true;
  botones();
  const estado = $('.estado-preparar');
  estado.textContent = 'Registrando a A y B y leyendo el catálogo…';
  try {
    await guion.preparar();
    const { guiso, a, b } = guion.contexto.eleccion;
    listo = true;
    botones();
    $('#siguiente').focus();
    estado.textContent = `Listo. ${guiso.nombre}: quedan ${guiso.stock}; A pedirá ${a} y B ${b}. ${admin ? 'Con admin.' : 'Sin admin.'} Presiona → para empezar.`;
  } catch (err) {
    estado.textContent = `No se pudo preparar: ${err.status ? `${err.status} · ` : ''}${err.message} (si Render dormía, espera un minuto y vuelve a intentar).`;
  }
}

$('#form-preparar').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const f = ev.currentTarget.elements;
  admin = f.email.value.trim() && f.password.value ? { email: f.email.value.trim(), password: f.password.value } : null;
  f.password.value = ''; // fuera de la pantalla en cuanto se usa
  preparar();
});
$('#siguiente').addEventListener('click', avanzar);
$('#anterior').addEventListener('click', retroceder);
$('#reiniciar').addEventListener('click', () => { if (!corriendo) { guion = null; listo = false; i = -1; fotos = []; $('#preparar').hidden = false; $('#paso').hidden = true; $('.estado-preparar').textContent = ''; $('#aviso').hidden = true; botones(); } });
$('#reintentar').addEventListener('click', () => { if (!corriendo && i >= 0) correr(i); });

addEventListener('keydown', (ev) => {
  if (ev.target.closest?.('input, textarea')) return;
  if (ev.key === 'ArrowRight' || ev.key === 'PageDown' || (ev.key === ' ' && !ev.target.closest?.('button'))) { ev.preventDefault(); avanzar(); }
  if (ev.key === 'ArrowLeft' || ev.key === 'PageUp') { ev.preventDefault(); retroceder(); }
});
$('#demo').addEventListener('click', (ev) => { if (!ev.target.closest('button, input, label, a, form, summary')) avanzar(); });

// La cuenta regresiva de cada carrito (el TTL de Redis), con el anillo de la tienda.
function tick() {
  for (const el of document.querySelectorAll('[data-ttl]')) {
    const s = Math.max(0, Math.ceil(((fin[el.dataset.ttl] ?? 0) - Date.now()) / 1000));
    el.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }
  for (const a of document.querySelectorAll('[data-anillo]')) {
    a.style.setProperty('--resta', Math.min(1, Math.max(0, ((fin[a.dataset.anillo] ?? 0) - Date.now()) / 1000 / TTL)).toFixed(4));
  }
}
setInterval(tick, 1000);
