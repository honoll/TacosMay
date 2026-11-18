// Tacos a domicilio en Cabo San Lucas: versión de prueba (docs/diseno/domicilio.md).
// La página solo pinta el estado de flujo.js, en el orden del flujo de referencia (Toks): cómo lo quieres →
// menú (con detalle del taco) → tu orden → pagar → confirmación y seguimiento, más el historial de prueba.
// El menú, las barras y los pasos se pintan una vez; después solo cambian números, textos, la orden y qué
// vista se ve. Movimiento con GSAP; sin GSAP o con movimiento reducido cada estado se ve quieto y completo.
import { money, esc, session } from '../js/api.js';
import { charola, picto } from '../js/barra.js';
import { iniciarCabecera } from '../js/cabecera.js';
import { toques } from '../js/toques.js';
import { SECCIONES, guiso, MAX_POR_GUISO } from './menu.js';
import { SUCURSALES, sucursal, abierta, demostrarCerrada } from './sucursales.js';
import * as reparto from './reparto.js';
import { flujo, PROPINAS } from './flujo.js';

iniciarCabecera();
toques();

const main = document.getElementById('domicilio');
const $ = (sel) => main.querySelector(sel);
const $$ = (sel) => [...main.querySelectorAll(sel)];
const dialogo = (id) => document.getElementById(id);
const animador = () => (globalThis.matchMedia?.('(prefers-reduced-motion: no-preference)').matches ? globalThis.gsap ?? null : null);
const activa = () => main.isConnected && location.pathname.startsWith('/domicilio/');

// Para enseñar los estados de «cerrado» y de error: /domicilio/?demo=cerrado o ?demo=falla.
const demo = new URLSearchParams(location.search).get('demo');
demostrarCerrada(demo === 'cerrado');
reparto.demostrar({ falla: demo === 'falla' });

const f = flujo(reparto);
const hora = (ms) => new Date(ms).toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' });
const MAS = '<svg class="signo" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';
const MENOS = '<svg class="signo" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';

// ---------- Lo que se pinta una vez ----------
$('#d-colonia').innerHTML = reparto.zonas().map((z) => `<option>${esc(z)}</option>`).join('') + '<option value="otra">Otra colonia</option>';
$('.sucursales').innerHTML = SUCURSALES.map((x) => `
  <li class="sucursal">
    <h4>${esc(x.nombre)}</h4>
    <p><a href="${x.mapa}" rel="noopener">${picto('Lugar')} ${esc(x.direccion)}</a></p>
    <p class="nota-suave">Cierra a las ${esc(x.cierra)}; la hora de apertura está por confirmar.</p>
    <button type="button" class="primario" data-sucursal="${x.id}">Pedir aquí</button>
  </li>`).join('');
$('.secciones').innerHTML = SECCIONES.map((x) => `<a href="#sec-${x.id}">Tacos de ${money(x.precio_centavos)}</a>`).join('');
$('.menu-secciones').innerHTML = SECCIONES.map((x) => `
  <section class="seccion" id="sec-${x.id}" aria-labelledby="sec-${x.id}-t">
    <h3 id="sec-${x.id}-t">Tacos de ${money(x.precio_centavos)}</h3>
    <ul class="tacos">${x.guisos.map((g) => `
      <li class="taco" data-id="${g.id}">
        ${charola(g.nombre, '', { tag: 'div', cls: 'mini', titulo: false })}
        <div class="taco-datos">
          <h4>${esc(g.nombre)}</h4>
          <p class="meta"><b>${money(g.precio_centavos)}</b> el taco <span class="lleva-n"></span></p>
        </div>
        <button type="button" class="agregar" data-detalle="${g.id}" aria-label="Agregar ${esc(g.nombre)}">Agregar</button>
      </li>`).join('')}
    </ul>
  </section>`).join('');

// ---------- 1 · Cómo lo quieres ----------
main.addEventListener('change', (e) => {
  if (e.target.name === 'modo') { f.elegirModo(e.target.value); pintar(); }
  if (e.target.id === 'd-colonia') {
    const otra = e.target.value === 'otra';
    $('.otra-colonia').hidden = !otra;
    $('#d-otra').disabled = !otra; // apagado no detiene el formulario
  }
});
$('#form-destino').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  if (!form.reportValidity()) return;
  const d = Object.fromEntries(new FormData(form));
  await ocupado(form.querySelector('[type="submit"]'), () => f.cotizar({ calle: d.calle.trim(), colonia: d.colonia === 'otra' ? d.otra.trim() : d.colonia, referencias: d.referencias.trim() }));
  pintar();
  if (f.estado.cotizacion) $('#a-menu').focus(); else $('.problema').focus();
});
main.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.sucursal) { f.elegirSucursal(b.dataset.sucursal); pintar(); if (f.listoParaMenu()) irA('menu'); else $('.problema').focus(); }
  else if (b.dataset.modo) { f.elegirModo(b.dataset.modo); pintar(); $('input[name="modo"][value="recoger"]').focus(); }
  else if (b.dataset.ir) irA(b.dataset.ir);
  else if (b.dataset.detalle) abrirDetalle(b.dataset.detalle);
  else if (b.dataset.abrir === 'historial') abrirHistorial();
  else if (b.dataset.cambio) { f.cambiar(b.closest('[data-id]').dataset.id, Number(b.dataset.cambio)); pintar(); }
  else if (b.dataset.quitar) { f.quitar(b.dataset.quitar); pintar(); enfocar('#t-orden'); }
});

function irA(vista) {
  f.ir(vista);
  pintar();
  enfocar(`#vista-${f.estado.vista} h2`);
}
function enfocar(sel) {
  const h = main.querySelector(sel);
  if (!h) return;
  h.setAttribute('tabindex', '-1');
  h.focus({ preventScroll: true });
  h.scrollIntoView({ block: 'nearest' });
}
async function ocupado(boton, trabajo) {
  boton.disabled = true;
  boton.classList.add('enviando');
  try { return await trabajo(); } finally { boton.disabled = false; boton.classList.remove('enviando'); }
}

// ---------- 2 · Detalle del taco (cantidad, nota, complementos por confirmar) ----------
const det = dialogo('detalle');
let detId = null;
let detN = 1;
function abrirDetalle(id) {
  const g = guiso(id);
  if (!g || f.enCurso()) return;
  detId = id;
  const yaLleva = f.estado.cantidades[id] ?? 0;
  detN = yaLleva || 1;
  det.querySelector('.det-foto').innerHTML = charola(g.nombre, '', { tag: 'div', titulo: false, cargar: 'eager' });
  det.querySelector('#det-nombre').textContent = g.nombre;
  det.querySelector('.det-precio').textContent = `${money(g.precio_centavos)} el taco (precio de ejemplo)`;
  det.querySelector('#det-nota').value = f.estado.notas[id] ?? '';
  det.querySelector('.det-agregar').dataset.editar = yaLleva ? '1' : '';
  pintarDetalle();
  det.showModal();
}
function pintarDetalle() {
  const g = guiso(detId);
  det.querySelector('.det-n').textContent = String(detN);
  det.querySelector('[data-det="-1"]').disabled = detN <= 1;
  det.querySelector('[data-det="1"]').disabled = detN >= MAX_POR_GUISO;
  const editar = det.querySelector('.det-agregar').dataset.editar;
  det.querySelector('.det-agregar').textContent = `${editar ? 'Guardar' : 'Agregar'} · ${money(detN * g.precio_centavos)}`;
}
det.addEventListener('click', (e) => {
  const b = e.target.closest('[data-det]');
  if (b) { detN = Math.max(1, Math.min(MAX_POR_GUISO, detN + Number(b.dataset.det))); pintarDetalle(); }
});
det.addEventListener('close', () => {
  if (det.returnValue === 'agregar' && detId) {
    f.poner(detId, detN, det.querySelector('#det-nota').value);
    pintar();
    const li = main.querySelector(`.taco[data-id="${detId}"]`);
    if (li && f.estado.vista === 'menu') {
      animador()?.fromTo(li, { backgroundColor: '#fff4c7' }, { backgroundColor: '#ffffff', duration: 0.8, ease: 'power1.out', clearProps: 'backgroundColor' });
      li.querySelector('.agregar').focus();
    }
  }
  det.returnValue = '';
});

// ---------- 3 · Tu orden: propina ----------
$('.propina-opciones').innerHTML = PROPINAS.map((p) => `<label><input type="radio" name="propina" value="${p}"> <span class="p-texto"></span></label>`).join('');
$('.propina-opciones').addEventListener('change', (e) => { f.propina(Number(e.target.value)); pintar(); });

// ---------- 4 · Pagar ----------
$('#form-pagar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  if (!form.reportValidity()) return;
  const d = Object.fromEntries(new FormData(form));
  let r;
  try {
    r = await ocupado($('#confirmar'), () => f.confirmar({ contacto: { nombre: d.nombre, telefono: d.telefono, correo: d.correo }, pago: d.pago, horario: d.horario }));
  } catch (err) {
    r = { ok: false, texto: err.message };
  }
  pintar(r);
  if (r?.ok) { enfocar('#vista-seguimiento .confirmado'); seguir(); } else if (f.estado.vista === 'pagar') $('.problema-pagar').focus(); else enfocar('#vista-modo h2');
});

// ---------- 5 · Seguimiento ----------
$('#cancelar').addEventListener('click', async () => {
  const r = await f.cancelar();
  $('.aviso-cancelar').textContent = r.ok ? '' : NO_CANCELA[r.motivo] ?? ''; // si se canceló, lo dice el estado
  seguir();
});
$('#recogido').addEventListener('click', async () => { await f.recogido(); seguir(); });
$('#nuevo').addEventListener('click', () => { f.nuevo(); $('.aviso-cancelar').textContent = ''; pintar(); enfocar(`#vista-${f.estado.vista} h2`); });

// ---------- Historial ----------
const hist = dialogo('historial');
function abrirHistorial() {
  const lista = f.pedidos;
  hist.querySelector('.historial-vacio').hidden = lista.length > 0;
  hist.querySelector('.historial-lista').innerHTML = lista.map((p) => `
    <li>
      <p><b>${esc(p.numero)}</b> · ${new Date(p.creado).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}</p>
      <p>${p.modo === 'domicilio' ? 'A domicilio' : 'Recoger en la barra'} · ${p.piezas} ${p.piezas === 1 ? 'taco' : 'tacos'} · ${money(p.total_centavos)} · ${esc(ETIQUETAS[p.estado] ?? p.estado)}</p>
      <button type="button" data-repetir="${esc(p.numero)}" ${f.enCurso() ? 'disabled' : ''}>Pedir lo mismo</button>
    </li>`).join('');
  hist.showModal();
}
hist.addEventListener('click', async (e) => {
  const b = e.target.closest('button');
  if (b?.dataset.repetir) { f.repetir(b.dataset.repetir); hist.close(); pintar(); enfocar(`#vista-${f.estado.vista} h2`); }
  if (b?.id === 'reiniciar') { await f.reiniciar(); hist.close(); for (const form of main.querySelectorAll('form')) form.reset(); pintar(); enfocar('#vista-modo h2'); }
});

// ---------- Textos ----------
const MOTIVOS = {
  fuera_de_cobertura: 'Por ahora no llegamos a esa colonia. Puedes pasar por tus tacos a la barra o pedir guiso empacado, que se envía a todo el país.',
  cerrado: 'Ahorita la cocina está cerrada. La barra del centro cierra a las 4 a. m.; la hora de apertura está por confirmar.',
  error: 'No pudimos cotizar el envío. Dale otra vez en un momento.',
  envio_cambio: 'El envío cambió al volver a cotizarlo. Revisa el total y confirma otra vez.',
};
const NO_CANCELA = {
  ya_empezo: 'La cocina ya empezó a servir tus tacos: ya no se puede cancelar desde aquí.',
  ya_recogido: 'El repartidor ya lo recogió: ya no se puede cancelar.',
  terminado: 'Este pedido ya terminó.',
};
const ETIQUETAS = { recibido: 'Recibido', preparando: 'Preparando', asignado: 'Repartidor asignado', en_camino: 'En camino', listo: 'Listo para recoger', entregado: 'Entregado', cancelado: 'Cancelado' };
const TEXTOS = {
  domicilio: { recibido: 'La barra ya tiene tu pedido.', preparando: 'Se están sirviendo tus tacos.', asignado: 'Tu pedido va en su bolsa, con el repartidor.', en_camino: 'Va en camino a tu dirección.', entregado: '¡Entregado! Buen provecho.' },
  recoger: { recibido: 'La barra ya tiene tu pedido.', preparando: 'Se están sirviendo tus tacos.', listo: 'Listo: pasa por él a la barra del centro.', entregado: '¡Recogido! Buen provecho.' },
};
const ESCENA = { listo: 'asignado' }; // recoger: «listo» usa la bolsa cerrada

// ---------- Pintar el estado (sin rehacer el DOM: números, textos, la orden y qué vista se ve) ----------
let vistaPintada = null;
let ordenPuesta = '';
let resumenPuesto = '';
let lineaPuesta = '';
function pintar(resultado = null) {
  const s = f.estado;
  const p = f.pedido();
  const c = f.cuentas();
  const enCurso = f.enCurso();

  // Qué vista y qué paso
  for (const el of $$('section[data-vista]')) el.hidden = el.dataset.vista !== s.vista;
  for (const li of $$('.pasos-dom li')) li.setAttribute('aria-current', li.dataset.vista === s.vista ? 'step' : 'false');
  $('.cerrado').hidden = abierta();
  const n = f.pedidos.length;
  $('.n-pedidos').textContent = n ? `(${n})` : '';

  // 1 · Cómo lo quieres
  for (const r of $$('input[name="modo"]')) { r.checked = r.value === s.modo; r.disabled = enCurso; }
  $('.si-domicilio').hidden = s.modo !== 'domicilio';
  $('.si-recoger').hidden = s.modo !== 'recoger';
  if (s.destino) for (const k of ['calle', 'referencias']) if (!$(`#d-${k}`).value) $(`#d-${k}`).value = s.destino[k] ?? '';
  const ok = $('.cobertura-ok');
  ok.hidden = !(s.modo === 'domicilio' && s.cotizacion);
  if (!ok.hidden) ok.textContent = `Sí llegamos a ${s.destino.colonia}. Te los prepara la ${sucursal(s.sucursal)?.nombre.toLowerCase()} y el envío es de ${money(s.cotizacion.envio_centavos)} (de ejemplo; la cotización vale 10 minutos).`;
  for (const b of $$('[data-sucursal]')) { b.textContent = s.sucursal === b.dataset.sucursal ? 'Elegida' : 'Pedir aquí'; b.setAttribute('aria-pressed', String(s.sucursal === b.dataset.sucursal)); }
  const prob = $('.problema');
  const enModo = s.vista === 'modo' && s.problema && s.problema !== 'envio_cambio';
  prob.hidden = !enModo;
  prob.querySelector('.texto').textContent = enModo ? MOTIVOS[s.problema] ?? '' : '';
  prob.querySelector('.a-empacado').hidden = s.problema !== 'fuera_de_cobertura';
  prob.querySelector('.a-recoger').hidden = s.problema !== 'fuera_de_cobertura';
  $('#a-menu').disabled = !f.listoParaMenu();

  // 2 · Menú: cuántos lleva cada taco
  for (const li of $$('.taco')) {
    const k = s.cantidades[li.dataset.id] ?? 0;
    li.classList.toggle('lleva', k > 0);
    li.querySelector('.lleva-n').textContent = k ? `· ${k} en tu orden` : '';
    const b = li.querySelector('.agregar');
    b.textContent = k ? 'Cambiar' : 'Agregar';
    b.setAttribute('aria-label', `${k ? 'Cambiar' : 'Agregar'} ${guiso(li.dataset.id).nombre}`);
    b.disabled = enCurso;
  }

  // 3 · Tu orden (la lista se rehace solo si cambió)
  const orden = p.items.map((i) => `
    <li class="linea-orden" data-id="${i.id}">
      <div class="linea-nombre"><h3>${esc(i.nombre)}</h3><p class="meta">${money(i.precio_centavos)} el taco${i.nota ? ` · Nota: ${esc(i.nota)}` : ''}</p></div>
      <div class="cuantos" role="group" aria-label="Tacos de ${esc(i.nombre)}">
        <button type="button" data-cambio="-1" aria-label="Uno menos de ${esc(i.nombre)}" ${i.cantidad <= 1 ? 'disabled' : ''}>${MENOS}</button>
        <output>${i.cantidad}</output>
        <button type="button" data-cambio="1" aria-label="Uno más de ${esc(i.nombre)}" ${i.cantidad >= MAX_POR_GUISO ? 'disabled' : ''}>${MAS}</button>
      </div>
      <p class="linea-total">${money(i.cantidad * i.precio_centavos)}</p>
      <div class="linea-acciones"><button type="button" class="enlace-boton" data-detalle="${i.id}" aria-label="Editar ${esc(i.nombre)}">Editar</button><button type="button" class="enlace-boton" data-quitar="${i.id}" aria-label="Quitar ${esc(i.nombre)}">Quitar</button></div>
    </li>`).join('');
  if (orden !== ordenPuesta) { $('.orden-lineas').innerHTML = orden; ordenPuesta = orden; }
  $('.orden-vacia').hidden = p.piezas > 0;
  const suc = sucursal(s.sucursal);
  const entrega = s.modo === 'domicilio' && s.destino
    ? `A domicilio: ${s.destino.calle}, ${s.destino.colonia}${s.destino.referencias ? ` (${s.destino.referencias})` : ''}. Lo prepara la ${suc?.nombre.toLowerCase() ?? 'barra'}.`
    : s.modo === 'recoger' && suc ? `Recoger en la ${suc.nombre.toLowerCase()}: ${suc.direccion}` : 'Falta elegir cómo lo quieres.';
  $('.entrega-texto').textContent = entrega;
  for (const r of $$('input[name="propina"]')) {
    const pct = Number(r.value);
    r.checked = pct === s.propina_pct;
    r.disabled = enCurso;
    r.nextElementSibling.textContent = pct ? `${pct} % · ${money(Math.round(c.subtotal * pct / 100))}` : 'Sin propina';
  }

  // 4 · Pagar
  const u = session.get();
  $('.con-cuenta').hidden = !u;
  $('.invitado').hidden = Boolean(u);
  if (u) $('.con-cuenta').textContent = `Pides con tu cuenta de la tienda: ${u.nombre}.`;
  if (!$('#p-nombre').value) $('#p-nombre').value = s.contacto.nombre || u?.nombre || '';
  if (!$('#p-telefono').value) $('#p-telefono').value = s.contacto.telefono;
  if (!$('#p-correo').value) $('#p-correo').value = s.contacto.correo || u?.email || '';
  $('.pago-recibir').textContent = s.modo === 'recoger' ? 'Al recoger, en la barra' : 'Al recibir, al repartidor';
  const pp = $('.problema-pagar');
  const textoPagar = resultado?.texto ?? (s.vista === 'pagar' && s.problema ? MOTIVOS[s.problema] : '');
  pp.hidden = !textoPagar;
  pp.querySelector('.texto').textContent = textoPagar ?? '';

  // El resumen (pagar y seguimiento): del pedido hecho, o del que se está armando
  const hecho = s.pedido && s.vista === 'seguimiento';
  const items = hecho ? s.pedido.items : p.items;
  const cc = hecho ? s.pedido.cuentas : c;
  const resumen = `
    <ul>${items.map((i) => `<li><span>${esc(i.cantidad)} × ${esc(i.nombre)}${i.nota ? ` <small>(${esc(i.nota)})</small>` : ''}</span><span>${money(i.cantidad * i.precio_centavos)}</span></li>`).join('')}</ul>
    <p class="a-donde">${picto('Lugar')} <span>${esc(entrega)}</span></p>
    <dl class="desglose"><dt>Tacos</dt><dd>${money(cc.subtotal)}</dd>${s.modo === 'domicilio' ? `<dt>Envío</dt><dd>${cc.envio == null ? 'por cotizar' : money(cc.envio)}</dd>` : ''}<dt>Cuota de servicio</dt><dd>por definir</dd><dt>Propina</dt><dd>${money(cc.propina)}</dd><dt class="total">Total</dt><dd class="total">${money(cc.total)}</dd></dl>`;
  if (resumen !== resumenPuesto) { for (const el of $$('.resumen-pedido')) el.innerHTML = resumen; resumenPuesto = resumen; }

  // La cuenta de al lado (en menú y en tu orden)
  $('.c-piezas').textContent = `${c.piezas} ${c.piezas === 1 ? 'taco' : 'tacos'}`;
  $('.c-tacos').textContent = money(c.subtotal);
  $('.c-envio').textContent = s.modo === 'recoger' ? 'no aplica' : c.envio == null ? 'por cotizar' : money(c.envio);
  $('.c-propina').textContent = money(c.propina);
  $('.c-total').textContent = money(c.total);
  $('.vacio-dom').hidden = c.piezas > 0;
  const siguiente = { menu: ['orden', 'Ver tu orden'], orden: ['pagar', 'Ir a pagar'] }[s.vista];
  const cont = $('#continuar');
  $('.cuenta-dom').hidden = !siguiente;
  if (siguiente) { [cont.dataset.ir, cont.textContent] = siguiente; cont.disabled = !c.piezas; }

  // 5 · Confirmación
  if (s.pedido) $('.numero').textContent = s.pedido.numero;

  if (s.vista !== vistaPintada) {
    // Solo opacidad, no autoAlpha: con visibility oculta el título no puede recibir el foco.
    animador()?.fromTo(`#vista-${s.vista}`, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28, ease: 'power3.out', clearProps: 'transform,opacity' });
    vistaPintada = s.vista;
  }
}

// ---------- El seguimiento, que avanza solo ----------
let mostrado = null;
let escenaTl = null;
let reloj = 0;
async function seguir() {
  clearTimeout(reloj);
  if (!f.estado.pedido || !activa()) return;
  const e = await f.seguir();
  const modo = f.estado.pedido.modo;
  const linea = e.pasos.map((x) => `<li data-paso="${x}">${ETIQUETAS[x]}</li>`).join('');
  if (linea !== lineaPuesta) { $('.linea').innerHTML = linea; lineaPuesta = linea; }
  const i = e.pasos.indexOf(e.paso);
  $$('.linea li').forEach((li, k) => {
    li.classList.toggle('hecho', k < i);
    li.classList.toggle('ahora', k === i);
    li.setAttribute('aria-current', k === i ? 'step' : 'false');
  });
  $('.estado-texto').textContent = e.paso === 'cancelado' ? 'Pedido cancelado. No se cobró nada.' : TEXTOS[modo][e.paso] ?? '';
  const fin = e.paso === 'entregado' || e.paso === 'cancelado';
  $('.llega').textContent = fin || !e.llega ? '' : `${modo === 'domicilio' ? 'Llega' : 'Listo'} cerca de las ${hora(e.llega)} (hora de prueba).`;
  $('.repartidor').hidden = !e.repartidor || fin;
  $('#cancelar').hidden = !e.cancelable;
  $('#recogido').hidden = !(modo === 'recoger' && e.paso === 'listo');
  $('#nuevo').hidden = !fin;
  $('.n-pedidos').textContent = `(${f.pedidos.length})`;
  const escenaPaso = ESCENA[e.paso] ?? e.paso;
  if (escenaPaso !== mostrado) { escena(escenaPaso); mostrado = escenaPaso; }
  if (!fin) reloj = setTimeout(seguir, 500);
}

// La escena de cada paso: palomita, la charola que se sirve, la bolsa que se cierra, la moto que sale, el lugar.
function escena(paso) {
  // toggleAttribute y no .hidden: en un <svg> .hidden no existe y no esconde nada.
  for (const el of $$('.escena > *')) el.toggleAttribute('hidden', el.dataset.escena !== paso);
  const el = main.querySelector(`.escena [data-escena="${paso}"]`);
  escenaTl?.kill(); // el vapor y la moto se repiten: la escena anterior se detiene
  const gsap = animador();
  if (!gsap || !el) return;
  const tl = gsap.timeline();
  escenaTl = tl;
  tl.fromTo(el, { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'back.out(2)' });
  if (paso === 'preparando') tl.fromTo(el.querySelectorAll('.vapor-linea'), { y: 6, autoAlpha: 0 }, { y: -6, autoAlpha: 1, duration: 0.8, stagger: 0.15, repeat: -1, yoyo: true, ease: 'sine.inOut' }, 0.2);
  if (paso === 'asignado') tl.fromTo(el.querySelector('.solapa'), { scaleY: -1 }, { scaleY: 1, transformOrigin: '50% 100%', duration: 0.4, ease: 'power2.inOut' }, 0.25);
  if (paso === 'en_camino') tl.fromTo(el.querySelector('.moto'), { x: -16 }, { x: 16, duration: 1.4, ease: 'power1.inOut', repeat: -1, yoyo: true }, 0.1);
  if (paso === 'entregado') tl.fromTo(el.querySelector('.palomita'), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(3)' }, 0.2);
}

// Al volver a esta página sin recargar (js/paginas.js), todo sigue donde iba.
addEventListener('tm:pagina', () => { if (activa()) { pintar(); seguir(); } });

pintar();
if (f.estado.pedido) seguir();
