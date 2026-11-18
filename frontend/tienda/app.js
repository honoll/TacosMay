import { api, session, money, esc, notice, transicion } from '../js/api.js';
import { charola, picto, guisoDe } from '../js/barra.js';
import { guardadoDe, traer } from '../js/datos.js';
import { empacar } from './empaque.js';
import { bolsa } from './bolsa.js';
import { toques } from '../js/toques.js';
import { enviar } from './envio.js';
import { cuenta, pintarCarrito, piezas, clock } from '../js/cabecera.js';

const view = document.getElementById('vista');
const nav = document.getElementById('nav');
const aviso = document.getElementById('aviso');
// La tienda está a la vista. Con js/paginas.js puede estar cargada mientras se ve la landing: entonces
// no atiende la cabecera, los # ni el reloj (la landing los lleva).
const activa = () => view.isConnected;

const EMPTY = { items: [], total_centavos: 0, expira_en_segundos: 0 };
let cart = EMPTY;
let deadline = 0;    // ms en que expira el carrito; 0 = sin cuenta regresiva
let guisos = [];     // último listado, para editar en admin sin volver a pedirlo
let editing = null;  // guiso en edición en el panel admin
let current = '';    // vista pintada (puede diferir del hash si un guard redirige)
let rendered = null; // hash ya pintado, para no repintar en el hashchange de go()
let renderId = 0;
let desde = 'catalogo'; // última dirección que no es de acceso: ahí se regresa después de entrar o registrarse
let nuevo = null;        // el pedido recién confirmado: llega resaltado a «Mis pedidos»
let guardado = null;     // el guiso que se acaba de guardar en administración
let borrando = null;     // el guiso cuyo renglón está preguntando «¿Eliminar?»
let ultimo = null;       // lo último que se quitó del carrito, para poder deshacerlo
let param = '';         // lo que sigue a la vista en la dirección: #guiso/3 → '3'

const user = () => session.get();
const isAdmin = () => user()?.rol === 'admin';

// ---------- Carrito y cuenta regresiva (el TTL de Redis, a la vista) ----------

function setCart(c) {
  cart = { ...EMPTY, ...c };
  deadline = cart.items.length && cart.expira_en_segundos > 0
    ? Date.now() + cart.expira_en_segundos * 1000 : 0;
  renderNav();
  if (panel.open) pintarPanel();
  if (bolsaUI?.conectada) bolsaUI.pintar(cart.items, cart.total_centavos);
  tick();
}

// La bolsa de la lista de guisos: se monta con cada pintada de la lista y se llena con el carrito.
function montarBolsa() {
  const raiz = view.querySelector('.bolsa-lado');
  bolsaUI = raiz ? bolsa(raiz) : null;
  bolsaUI?.pintar(cart.items, cart.total_centavos);
}

const loadCart = async () => setCart(await api('/carrito'));


function tick() {
  if (!activa()) return;
  const left = deadline ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000)) : 0;
  document.querySelectorAll('[data-countdown]').forEach((el) => {
    el.textContent = deadline ? clock(left) : '';
    // Umbrales: a 5 minutos avisa, a 1 minuto apura. La clase dispara un pulso una sola vez (CSS).
    el.classList.toggle('pronto', deadline > 0 && left <= 300 && left > 60);
    el.classList.toggle('urgente', deadline > 0 && left <= 60);
  });
  if (deadline && left === 0) {
    deadline = 0;
    // Redis redondea el TTL: un segundo de margen para no consultar antes de que borre la clave.
    setTimeout(() => run(async () => {
      await loadCart();
      if (!cart.items.length) notice('Tu carrito se vació por inactividad. Vuelve a agregar tus guisos.', 'error');
      if (current === 'carrito') await render();
    }), 1000);
  }
}
setInterval(tick, 1000);

async function setQty(id, cantidad) {
  setCart(await api(`/carrito/items/${id}`, { method: 'PUT', body: { cantidad } }));
  // Cada cambio renueva el TTL en Redis: el reloj lo enseña con un destello.
  for (const el of document.querySelectorAll('[data-countdown]')) {
    el.classList.remove('renovado');
    void el.offsetWidth;
    el.classList.add('renovado');
  }
}

// Repinta dentro de una transición del navegador cuando existe: los renglones que salen o entran se animan
// y los que se quedan se recorren. Sin soporte (o con movimiento reducido, vía CSS) el cambio es inmediato.
const cambiar = transicion;

// ---------- El carrito como panel lateral ----------
const panel = document.getElementById('panel-carrito');

function pintarPanel() {
  panel.innerHTML = `
    <div class="panel-caja">
      <header>
        <h2 id="panel-titulo">Tu carrito</h2>
        <button type="button" data-cierra aria-label="Cerrar el carrito">✕</button>
      </header>
      ${cart.items.length ? `
        <p class="expira">Expira en <strong data-countdown></strong></p>
        <ul class="panel-lista">${cart.items.map(({ guiso: g, cantidad }) => `
          <li><span>${esc(cantidad)} × ${esc(g.nombre)}</span><strong>${money(g.precio_centavos * cantidad)}</strong></li>`).join('')}</ul>
        <p class="total">Total: <strong>${money(cart.total_centavos)}</strong></p>` : '<p>Tu carrito está vacío. Las charolas, no.</p>'}
      <div class="acciones">
        ${cart.items.length ? '<a class="btn" href="#carrito" data-cierra>Ver carrito</a>' : ''}
        <button type="button" data-cierra>Seguir comprando</button>
      </div>
    </div>`;
  tick();
}

// Desde el catálogo o una ficha, el botón del carrito abre el panel en vez de cambiar de vista.
document.getElementById('nav-carrito').addEventListener('click', (e) => {
  if (!activa()) return;
  if (current === 'catalogo' && bolsaUI?.conectada) { e.preventDefault(); bolsaUI.mostrar(); return; }
  if (!user() || current !== 'guiso' || !panel.showModal) return;
  e.preventDefault();
  pintarPanel();
  panel.showModal();
});
// Se cierra con ✕, con «Seguir comprando», al ir al carrito, con Esc (lo da el navegador) o tocando fuera.
panel.addEventListener('click', (e) => { if (e.target === panel || e.target.closest('[data-cierra]')) panel.close(); });

// ---------- Piezas de HTML reusadas ----------

const field = (prefix, name, label, value = '', attrs = '') => `
  <label for="${prefix}-${name}">${label}</label>
  <input id="${prefix}-${name}" name="${name}" value="${esc(value)}" required ${attrs}>`;

const enCarrito = (id) => cart.items.find((i) => String(i.guiso.id) === String(id))?.cantidad || 0;

// Lo que se hace con un guiso desde su charola: agregarlo o, si ya va en el carrito, cambiar cuántos.
// Sin existencias no hay botón. `cambio` ('sube' o 'baja') hace rodar el número cuando acaba de cambiar.
// lista: en un renglón del catálogo el agregar es «+» (nombre accesible «Agregar <guiso>»).
function control(g, cambio = '', lista = false) {
  const n = enCarrito(g.id);
  const datos = `data-id="${esc(g.id)}" data-nombre="${esc(g.nombre)}"`;
  if (g.stock <= 0) return '<p class="acabo">Se acabó por hoy</p>';
  if (!n && lista) return `<button type="button" class="primario mas" data-click="add" ${datos} aria-label="Agregar ${esc(g.nombre)}"><svg class="signo" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>`;
  if (!n) return `<button type="button" class="primario" data-click="add" ${datos}>Agregar<span class="sr"> ${esc(g.nombre)} al carrito</span></button>`;
  return `
    <div class="cantidad" role="group" aria-label="${esc(g.nombre)} en tu carrito">
      <button type="button" data-click="menos" ${datos} aria-label="Quitar uno"><svg class="signo" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>
      <output class="cant ${cambio}" aria-live="polite">${n}</output>
      <button type="button" data-click="add" ${datos} aria-label="Agregar uno" ${n >= g.stock ? 'disabled' : ''}><svg class="signo" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>
    </div>`;
}

// Tarjeta de guiso: una charola del sistema (color, número y foto según el nombre; ver ../js/barra.js).
// La descripción solo se muestra si dice algo propio de ese guiso (conDescripcion lo decide).
// Cada tarjeta lleva su clave (el guiso) y la firma de lo que muestra: si la firma no cambió, no se toca.
const cuerpoDe = (g, mostrarDescripcion) => `
    ${g.vendidos != null ? `<p class="tag">${esc(g.vendidos)} ${Number(g.vendidos) === 1 ? 'vendido' : 'vendidos'}</p>` : ''}
    ${mostrarDescripcion ? `<p class="desc">${esc(g.descripcion)}</p>` : ''}
    <p class="precio">${money(g.precio_centavos)}</p>
    <p class="meta">${esc(g.porciones)} porciones${g.stock > 0 ? ` · quedan ${esc(g.stock)}` : ''}</p>
    <div class="control" data-control="${esc(g.id)}">${control(g)}</div>`;
const firma = (texto) => [...texto].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7).toString(36);
const fichaDe = (g) => `#guiso/${encodeURIComponent(g.id)}`;
// Renglón de la lista de guisos: miniatura de su charola, nombre (a su ficha), precio, porciones, lo que
// queda y, a la derecha, el «+». Lo de la derecha de la miniatura se pone al día en su lugar (firma).
const cuerpoRenglon = (g, mostrarDescripcion, n = guisoDe(g.nombre).n) => `
    <h3><a class="a-ficha" href="${fichaDe(g)}">${n ? `${esc(n)} · ` : ''}${esc(g.nombre)}</a></h3>
    ${g.vendidos != null ? `<p class="tag">${esc(g.vendidos)} ${Number(g.vendidos) === 1 ? 'vendido' : 'vendidos'}</p>` : ''}
    ${mostrarDescripcion ? `<p class="desc">${esc(g.descripcion)}</p>` : ''}
    <p class="meta"><b>${money(g.precio_centavos)}</b> · ${esc(g.porciones)} porciones${g.stock > 0 ? ` · quedan ${esc(g.stock)}` : ''}</p>
    <div class="control" data-control="${esc(g.id)}">${control(g, '', true)}</div>`;
const renglon = (g, mostrarDescripcion, cargar) => {
  const cuerpo = cuerpoRenglon(g, mostrarDescripcion);
  return `<li class="renglon${g.stock > 0 ? '' : ' agotado'}" data-clave="${esc(g.id)}" data-firma="${firma(cuerpo)}">
    ${charola(g.nombre, '', { tag: 'div', cls: 'mini', titulo: false, cargar })}<div class="datos">${cuerpo}</div></li>`;
};
const card = (g, mostrarDescripcion, cargar) => {
  const cuerpo = cuerpoDe(g, mostrarDescripcion);
  return charola(g.nombre, cuerpo, { tag: 'li', cls: g.stock > 0 ? '' : 'agotada', href: fichaDe(g), cargar, attrs: `data-clave="${esc(g.id)}" data-firma="${firma(cuerpo)}"` });
};

// En la lista, el control cambia de forma con movimiento: el «+» se estira hasta volverse «− 1 +», y al
// volver a cero el «+» regresa con un salto. Con movimiento reducido o sin GSAP, cambia directo.
function cambioDeControl(id, aSelector) {
  const gsap = moverse() ? globalThis.gsap : null;
  const lugar = view.querySelector(`.renglon [data-control="${CSS.escape(id)}"]`);
  if (!gsap || !lugar) return;
  if (aSelector) {
    const sel = lugar.querySelector('.cantidad');
    gsap.from(sel, { width: 44, borderRadius: 22, duration: 0.34, ease: 'power3.out', clearProps: 'width,borderRadius' });
    gsap.from(sel.children, { autoAlpha: 0, scale: 0.6, duration: 0.22, ease: 'back.out(2)', stagger: 0.04, delay: 0.1 });
  } else {
    gsap.from(lugar.querySelector('.mas'), { scale: 0.5, autoAlpha: 0, duration: 0.3, ease: 'back.out(2.4)' });
  }
}

// Al cambiar el carrito, las charolas del catálogo se ponen al día sin volver a pedir los guisos.
function pintarControles(id, cambio) {
  for (const el of view.querySelectorAll('[data-control]')) {
    const g = guisos.find((x) => String(x.id) === el.dataset.control);
    if (g) el.innerHTML = control(g, String(g.id) === String(id) ? cambio : '', Boolean(el.closest?.('.renglon')));
  }
}

// Esqueleto del catálogo: las mismas charolas, vacías. Solo aparece si la respuesta tarda.
// En index.html: el esqueleto del primer cuadro y el molde de la bolsa (los mismos que pone su script en línea).
const BOLSA = document.getElementById('bolsa-molde').innerHTML;
const ESQUELETO = document.getElementById('esqueleto').innerHTML + BOLSA;
toques(); // todo botón se hunde al presionarlo y rebota al soltarlo
let bolsaUI = null; // la bolsa de la lista de guisos, mientras está a la vista
// El alto de la cabecera fija: la lista de guisos y la bolsa se acomodan debajo de ella.
const altoCabecera = () => {
  const h = document.querySelector?.('.cabecera')?.offsetHeight;
  if (h) document.documentElement.style.setProperty('--alto-cabecera', `${h}px`);
};
altoCabecera();
addEventListener('resize', altoCabecera);
let directo = false; // la próxima vista se pinta sin fundido (después de la escena del pedido)
const moverse = () => globalThis.matchMedia?.('(prefers-reduced-motion: no-preference)').matches ?? false;
const TARDA = 200;
const YA_PINTADO = Symbol('ya pintado'); // la vista se puso al día en su lugar: no hay nada que repintar
let llegando = true; // se llegó (o se volvió) a la vista: es cuando se revalida lo guardado

// Una vez por llegada, lo guardado se vuelve a pedir; si cambió, el catálogo se pone al día en su lugar.
function revalidar() {
  const antes = JSON.stringify([guardadoDe('/guisos/populares'), guardadoDe('/guisos')]);
  Promise.all([traer('/guisos/populares'), traer('/guisos')]).then((nuevos) => {
    if (JSON.stringify(nuevos) !== antes && current === 'catalogo' && activa()) render();
  }).catch(() => {}); // sin red se queda lo guardado
} // ms antes de mostrar el esqueleto, para que no parpadee si la API contesta rápido

// Una descripción repetida en varios guisos no informa nada: devuelve cómo pintar cada tarjeta de esa lista.
function mostrarDescripcion(lista) {
  const veces = new Map();
  for (const g of lista) veces.set(g.descripcion, (veces.get(g.descripcion) || 0) + 1);
  return (g) => Boolean(g.descripcion) && veces.get(g.descripcion) === 1;
}
function conDescripcion(lista) {
  const mostrar = mostrarDescripcion(lista);
  return (g, cargar) => card(g, mostrar(g), cargar);
}

// Regreso evidente al catálogo desde cualquier otra vista.
const VOLVER = '<p class="volver"><a href="#catalogo">← Seguir comprando</a></p>';

// Estado vacío con salida: ocupa la vista, dice qué pasa y a dónde ir.
const vacio = (titulo, texto) => `
  <div class="vacio">
    ${picto('Charola')}
    <h2>${titulo}</h2>
    <p>${texto}</p>
    <a class="btn" href="#catalogo">Ver guisos</a>
  </div>`;

const fecha = (v) => new Date(isNaN(v) ? v : Number(v))
  .toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });

// ---------- Vistas: cada una devuelve su HTML ----------

const VIEWS = {
  async catalogo() {
    // Lo guardado (de la landing o de una visita anterior) se muestra ya; se vuelve a pedir por detrás.
    const ya = [guardadoDe('/guisos/populares'), guardadoDe('/guisos')];
    const [populares, todos] = ya.every(Boolean) ? ya : await Promise.all([traer('/guisos/populares'), traer('/guisos')]);
    if (ya.every(Boolean) && llegando) revalidar();
    llegando = false;
    guisos = todos;
    if (!todos.length) return `<div class="lista-guisos"><h1>Guisos empacados</h1><p>Todavía no hay guisos en el catálogo.</p></div>${BOLSA}`;
    // Como el pizarrón de la taquería: agrupados por precio, del más barato al más caro. Sin filtros.
    const precios = [...new Set(todos.map((g) => g.precio_centavos))].sort((a, b) => a - b);
    const filas = [
      ...(populares.length ? [['Lo que más sale', populares]] : []),
      ...precios.map((p) => [precios.length > 1 ? `De ${money(p)}` : 'Todos los guisos', todos.filter((g) => g.precio_centavos === p)]),
    ];
    const mostrar = mostrarDescripcion(todos);
    const enOrden = filas.flatMap(([, lista]) => lista);
    const estructura = JSON.stringify(filas.map(([t, lista]) => [t, lista.map((g) => [g.id, g.nombre])]));

    // Ya está a la vista con las mismas charolas: se pone al día en su lugar (existencias, precios,
    // cantidades) sin rehacer las tarjetas, para no recargar sus fotos ni repetir su entrada.
    if (view.dataset.vista === 'catalogo' && view.querySelector('[data-estructura]')?.dataset.estructura === estructura) {
      const tarjetas = view.querySelectorAll('.renglon[data-clave]');
      enOrden.forEach((g, i) => {
        const li = tarjetas[i];
        const cuerpo = cuerpoRenglon(g, mostrar(g));
        if (!li || li.dataset.firma === firma(cuerpo)) return;
        li.className = `renglon${g.stock > 0 ? '' : ' agotado'}`;
        li.dataset.firma = firma(cuerpo);
        li.querySelector('.datos').innerHTML = cuerpo;
      });
      return YA_PINTADO;
    }
    // La primera fila carga sus fotos de inmediato; las demás, al acercarse.
    let n = 0;
    const tarjeta = (g) => renglon(g, mostrar(g), n++ < 5 ? 'eager' : 'lazy');
    const fila = (lista) => `<ul class="renglones entra">${lista.map(tarjeta).join('')}</ul>`;
    return `
      <div class="lista-guisos">
        <h1 data-estructura="${esc(estructura)}">Guisos empacados</h1>
        ${filas.map(([t, lista]) => `<h2${t === 'Lo que más sale' ? '' : ' class="grupo"'}>${t}</h2>${fila(lista)}`).join('')}
      </div>${BOLSA}`;
  },

  // Ficha de un guiso: #guiso/<id>. Lo que se sabe de él (GET /guisos/:id) y lo que vale para todos.
  async guiso() {
    let g;
    let todos;
    try {
      [g, todos] = await Promise.all([api(`/guisos/${encodeURIComponent(param)}`), api('/guisos')]);
    } catch (err) {
      if (err.status !== 404) throw err;
      return `${VOLVER}<h1>Guiso</h1>${vacio('Ese guiso ya no está en la barra', 'Puede que se haya retirado del menú.')}`;
    }
    guisos = todos;
    document.title = `${g.nombre} — Los Tacos May`;
    const otros = todos.filter((x) => String(x.id) !== String(g.id) && x.stock > 0).slice(0, 4);
    return `
      ${VOLVER}
      <div class="ficha${g.stock > 0 ? '' : ' agotada'}">
        ${charola(g.nombre, '', { tag: 'div', titulo: false })}
        <div class="ficha-datos">
          <h1>${esc(g.nombre)}</h1>
          <p class="precio">${money(g.precio_centavos)}</p>
          <p class="meta">${esc(g.porciones)} porciones${g.stock > 0 ? ` · quedan ${esc(g.stock)}` : ''}</p>
          ${g.descripcion ? `<p class="desc">${esc(g.descripcion)}</p>` : ''}
          <div class="control" data-control="${esc(g.id)}">${control(g)}</div>
        </div>
      </div>
      <div class="ficha-info">
        <section>
          <h2>${picto('Calienta')} Cómo se calienta</h2>
          <p>A la sartén o a la olla, como recalientas cualquier guiso.</p>
        </section>
        <section>
          <h2>${picto('Congelado')} Cómo se conserva</h2>
          <p>Va empacado al vacío y congelado. Guárdalo en el congelador hasta que lo vayas a usar. <a href="#ayuda">Envíos y preguntas</a></p>
        </section>
      </div>
      ${otros.length ? `<h2>Otros guisos</h2><ul class="barra">${otros.map((g) => conDescripcion(todos)(g)).join('')}</ul>` : ''}`;
    // PENDIENTE-CLIENTE: instrucciones exactas de calentado y de conservación por guiso, cuánto dura,
    // ingredientes y alérgenos (necesitan campos nuevos: docs/diseno/plan-segundo-tiempo.md).
  },

  // Envíos y preguntas: solo lo que es cierto hoy. Lo demás se dice que falta, no se inventa.
  // PENDIENTE-CLIENTE: cobertura, costo, tiempos y días de envío; vida útil; formas de pago; contacto.
  async ayuda() {
    return `
      ${VOLVER}
      <h1>Envíos y preguntas</h1>
      <div class="ayuda">
        <h2>¿Cómo vienen los guisos?</h2>
        <p>Empacados al vacío y congelados. Rompes la bolsa, calientas y comes.</p>
        <h2>¿Ya hacen envíos?</h2>
        <p>Todavía no. A dónde llega, cuánto cuesta y en cuántos días está por confirmar; cuando esté seguro, va a aparecer aquí.</p>
        <h2>¿Se paga en la página?</h2>
        <p>No. La tienda todavía no cobra: confirmar un pedido lo deja registrado en «Mis pedidos».</p>
        <h2>¿Por qué mi carrito tiene reloj?</h2>
        <p>El carrito se guarda por un tiempo y el reloj dice cuánto le queda. Cada cambio lo renueva; si llega a cero, se vacía solo.</p>
        <h2>¿Los precios son los reales?</h2>
        <p>Los guisos empacados y sus precios son de ejemplo mientras se confirma la carta real.</p>
        <p><a class="btn" href="#catalogo">Ver guisos</a></p>
      </div>`;
  },

  async carrito() {
    await loadCart();
    if (!cart.items.length) {
      return `${VOLVER}<h1>Tu carrito</h1>${vacio('Tu carrito está vacío', 'Las charolas, no. Escoge tus guisos y aquí los juntamos.')}`;
    }
    return `
      ${VOLVER}
      <h1>Tu carrito</h1>
      <p class="expira">Tu carrito expira en <strong data-countdown></strong>
        <small>Cada cambio renueva el tiempo; en cero, se vacía solo. <a href="#ayuda">Envíos y preguntas</a></small></p>
      <ul class="lista">${cart.items.map(({ guiso: g, cantidad }) => `
        <li style="view-transition-name: fila-${String(g.id).replace(/\W/g, '')}">
          <div class="crece"><strong>${esc(g.nombre)}</strong><br>${money(g.precio_centavos)} c/u</div>
          <label for="cant-${esc(g.id)}">Cantidad<span class="sr"> de ${esc(g.nombre)}</span></label>
          <input id="cant-${esc(g.id)}" type="number" min="0" max="${esc(g.stock)}" step="1" inputmode="numeric"
            value="${esc(cantidad)}" data-change="qty" data-id="${esc(g.id)}">
          <strong>${money(g.precio_centavos * cantidad)}</strong>
          <button type="button" data-click="remove" data-id="${esc(g.id)}" data-nombre="${esc(g.nombre)}">Quitar<span class="sr"> ${esc(g.nombre)}</span></button>
        </li>`).join('')}</ul>
      <p class="total">Total: <strong>${money(cart.total_centavos)}</strong></p>
      <div class="acciones">
        <button type="button" class="primario" data-click="checkout">Confirmar pedido</button>
        <button type="button" data-click="empty">Vaciar carrito</button>
      </div>`;
  },

  async pedidos() {
    const pedidos = await api('/pedidos');
    if (!pedidos.length) return `${VOLVER}<h1>Mis pedidos</h1>${vacio('Todavía no tienes pedidos', 'Cuando confirmes el primero, aquí va a quedar.')}`;
    return `
      ${VOLVER}
      <h1>Mis pedidos</h1>
      <ul class="pedidos">${pedidos.map((p, n) => {
        // El recién confirmado llega abierto y resaltado; si no hay uno, se abre el más nuevo.
        const esNuevo = String(p.id) === String(nuevo);
        const piezas = p.items.reduce((t, i) => t + i.cantidad, 0);
        return `
        <li class="card${esNuevo ? ' nuevo' : ''}">
          <details${esNuevo || (!nuevo && n === 0) ? ' open' : ''}>
            <summary>
              <h2>Pedido #${esc(p.id)}</h2>
              <span class="meta">${esc(fecha(p.creado))} · ${piezas} ${piezas === 1 ? 'guiso' : 'guisos'}</span>
              <strong>${money(p.total_centavos)}</strong>
            </summary>
            <ul>${p.items.map((i) => `
              <li><span>${esc(i.cantidad)} × ${esc(i.nombre)}</span><span>${money(i.precio_centavos * i.cantidad)}</span></li>`).join('')}</ul>
            <p class="total">Total: <strong>${money(p.total_centavos)}</strong></p>
          </details>
        </li>`;
      }).join('')}</ul>
      <aside class="otro" aria-label="Seguir comprando">
        ${picto('Charola')}
        <h2>¿Otro guiso?</h2>
        <a class="btn" href="#catalogo">Ver guisos</a>
      </aside>`;
  },

  async admin() {
    guisos = await api('/guisos');
    const g = editing || {};
    const int = (min) => `type="number" min="${min}" step="1" inputmode="numeric"`;
    return `
      ${VOLVER}
      <h1>Administrar guisos</h1>
      <form class="form" data-submit="saveGuiso" novalidate>
        <h2>${editing ? `Editar «${esc(g.nombre)}»` : 'Nuevo guiso'}</h2>
        ${field('g', 'nombre', 'Nombre', g.nombre)}
        ${field('g', 'descripcion', 'Descripción', g.descripcion)}
        ${field('g', 'precio', 'Precio (pesos)', editing ? g.precio_centavos / 100 : '', 'type="number" min="0" step="0.01" inputmode="decimal"')}
        ${field('g', 'porciones', 'Porciones', g.porciones, int(1))}
        ${field('g', 'stock', 'Existencias', g.stock, int(0))}
        <div class="acciones">
          <button class="primario">${editing ? 'Guardar cambios' : 'Agregar guiso'}</button>
          ${editing ? '<button type="button" data-click="cancelEdit">Cancelar</button>' : ''}
        </div>
      </form>
      <h2>Guisos en el catálogo</h2>
      <ul class="lista">${guisos.map((x) => `
        <li${String(x.id) === String(guardado) ? ' class="guardado"' : ''}>
          <div class="crece"><strong>${esc(x.nombre)}</strong>${String(x.id) === String(guardado) ? ' <span class="palomita">✓ Guardado</span>' : ''}<br>
            ${money(x.precio_centavos)} · ${esc(x.porciones)} porciones · quedan ${esc(x.stock)}</div>
          ${String(x.id) === String(borrando) ? `
          <span class="confirma">¿Eliminar?</span>
          <button type="button" id="del-si" data-click="del" data-id="${esc(x.id)}">Sí, eliminar<span class="sr"> ${esc(x.nombre)}</span></button>
          <button type="button" id="del-no" data-click="cancelDel">No</button>` : `
          <button type="button" data-click="edit" data-id="${esc(x.id)}">Editar<span class="sr"> ${esc(x.nombre)}</span></button>
          <button type="button" data-click="pedirDel" data-id="${esc(x.id)}">Eliminar<span class="sr"> ${esc(x.nombre)}</span></button>`}
        </li>`).join('')}</ul>`;
  },

  async cuenta() {
    const u = user();
    return `
      ${VOLVER}
      <h1>Tu cuenta</h1>
      <div class="acceso">
        <div class="form">
          <p><strong>${esc(u.nombre)}</strong><br>${esc(u.email)}${isAdmin() ? '<br>Rol: administrador' : ''}</p>
          <p><a href="#pedidos">Ver mis pedidos</a></p>
          <button type="button" data-click="logout">Cerrar sesión</button>
        </div>
        ${LADO}
      </div>`;
  },

  entrar: async () => acceso(false),
  registro: async () => acceso(true),
};

// Lo que acompaña a los formularios de cuenta en pantalla ancha: para qué sirve tener cuenta.
const LADO = `
  <aside class="acceso-lado" aria-label="Para qué sirve tu cuenta">
    <img src="../marca/logo/sello.svg" alt="" width="220" height="360">
    <div>
      <h2>Con tu cuenta</h2>
      <ul>
        <li>Agregas guisos a tu carrito.</li>
        <li>Confirmas tu pedido.</li>
        <li>Ves tus pedidos anteriores.</li>
      </ul>
    </div>
  </aside>`;

// Iniciar sesión (#entrar) y crear cuenta (#registro): el mismo molde, con un enlace para pasar de una a otra.
function acceso(esRegistro) {
  const id = esRegistro ? 'registro' : 'login';
  return `
    ${VOLVER}
    <div class="acceso">
      <form class="form" data-submit="${id}" novalidate>
        <h1>${esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
        ${esRegistro ? field(id, 'nombre', 'Nombre', '', 'autocomplete="name"') : ''}
        ${field(id, 'email', 'Correo', '', 'type="email" autocomplete="email"')}
        ${field(id, 'password', 'Contraseña', '', `type="password" autocomplete="${esRegistro ? 'new' : 'current'}-password"`)}
        <button class="primario">${esRegistro ? 'Crear mi cuenta' : 'Entrar'}</button>
        <p class="cambio">${esRegistro
          ? '¿Ya tienes cuenta? <a href="#entrar">Entra</a>'
          : '¿No tienes cuenta? <a href="#registro">Créala</a>'}</p>
      </form>
      ${LADO}
    </div>`;
}

// ---------- Acciones: data-click / data-submit / data-change apuntan aquí ----------

// ---------- Formularios: validación en español y errores junto al campo ----------

function errorDeCampo(input, mensaje) {
  const id = `${input.id}-error`;
  input.setAttribute('aria-invalid', 'true');
  input.setAttribute('aria-describedby', id);
  input.insertAdjacentHTML('afterend', `<p class="error-campo" id="${id}">${esc(mensaje)}</p>`);
}

function limpiarErrores(form) {
  form.querySelectorAll('.error-campo').forEach((p) => p.remove());
  form.querySelectorAll('[aria-invalid]').forEach((i) => {
    i.removeAttribute('aria-invalid');
    i.removeAttribute('aria-describedby');
  });
}

// El navegador decide qué está mal (campo vacío, correo mal escrito, número fuera de rango);
// el mensaje lo ponemos nosotros, en español y debajo del campo. Los formularios llevan novalidate.
const MENSAJES = [
  ['valueMissing', () => 'Este campo no puede ir vacío.'],
  ['typeMismatch', () => 'Escribe un correo válido, como nombre@ejemplo.com.'],
  ['badInput', () => 'Escribe un número.'],
  ['rangeUnderflow', (i) => `Debe ser ${i.min} o más.`],
  ['stepMismatch', (i) => (i.step === '1' ? 'Escribe un número entero.' : 'Usa máximo dos decimales.')],
];

function validar(form) {
  limpiarErrores(form);
  let primero = null;
  for (const input of form.elements) {
    if (!input.willValidate || input.validity.valid) continue;
    const mensaje = MENSAJES.find(([falla]) => input.validity[falla])?.[1] ?? (() => 'Revisa este campo.');
    errorDeCampo(input, mensaje(input));
    primero ??= input;
  }
  primero?.focus();
  return !primero;
}

async function auth(form, path) {
  try {
    session.set(await api(path, { method: 'POST', body: Object.fromEntries(new FormData(form)) }));
  } catch (err) {
    // Lo que el servidor rechaza de lo escrito va junto a su campo y no borra nada:
    // 401 = correo o contraseña equivocados; 400 = ese correo ya tiene cuenta.
    const campo = err.status === 401 ? 'password' : err.status === 400 ? 'email' : null;
    if (!campo) throw err;
    errorDeCampo(form.elements[campo], err.status === 401 ? 'El correo o la contraseña no coinciden.' : err.message);
    form.elements[campo].focus();
    return;
  }
  await loadCart();
  notice(`Hola, ${user().nombre}.`);
  await go(desde); // de vuelta a donde estaba: el catálogo si quería agregar, el carrito si iba para allá
}

const ACTIONS = {
  login: (form) => auth(form, '/users/login'),
  registro: (form) => auth(form, '/users'),

  logout() {
    session.set(null);
    setCart(EMPTY);
    return go('catalogo');
  },

  async add(el) {
    if (!user()) {
      notice('Inicia sesión para agregar guisos al carrito.', 'error');
      return go('entrar');
    }
    const id = el.dataset.id;
    const actual = enCarrito(id);
    // En la lista, la miniatura vuela a su compartimento de la bolsa; en la ficha, la bolsa vuela al carrito
    // (la primera vez con el empacado completo; después, solo volando).
    const fila = el.closest?.('.renglon');
    if (fila) {
      el.classList.remove('toque'); void el.offsetWidth; el.classList.add('toque');
    }
    const pack = fila && bolsaUI?.conectada ? bolsaUI.volar(fila.querySelector('.charola'), id) : empacar(el, actual > 0);
    try { await setQty(id, actual + 1); } catch (err) { pack.cancel(); throw err; }
    pintarControles(id, 'sube');
    if (!actual && fila) cambioDeControl(id, true);
    view.querySelector(`[data-control="${CSS.escape(id)}"] [data-click="add"]`)?.focus({ preventScroll: true });
    // Con la animación, la bolsa ya dice que se agregó; con movimiento reducido, lo dice el aviso.
    if (!actual && !moverse()) notice(`Agregado al carrito: ${el.dataset.nombre}.`);
  },

  // Quitar uno desde la charola del catálogo.
  async menos(el) {
    const id = el.dataset.id;
    await setQty(id, enCarrito(id) - 1);
    pintarControles(id, 'baja');
    if (!enCarrito(id) && el.closest?.('.renglon')) cambioDeControl(id, false);
    view.querySelector(`[data-control="${CSS.escape(id)}"] :is([data-click="menos"], [data-click="add"])`)?.focus({ preventScroll: true });
  },

  async qty(el) {
    const id = el.dataset.id;
    const antes = enCarrito(id);
    const quiere = Math.max(0, parseInt(el.value, 10) || 0);
    try {
      await setQty(id, quiere);
    } catch (err) {
      await render(); // regresa el campo a la cantidad real
      const input = document.getElementById(`cant-${id}`);
      if (err.status !== 409 || !input) throw err;
      // Sin existencia suficiente: se dice en el renglón de ese guiso, no como aviso general.
      errorDeCampo(input, err.message);
      input.focus();
      return;
    }
    await cambiar(render);
    view.querySelector('.total strong')?.classList.add(quiere >= antes ? 'sube' : 'baja');
  },

  async remove(el) {
    const id = el.dataset.id;
    ultimo = { id, cantidad: enCarrito(id) };
    await setQty(id, 0);
    await cambiar(render);
    // Perdona el error sin preguntar antes: el aviso trae cómo regresarlo.
    notice(`Quitaste ${el.dataset.nombre}.`);
    aviso.insertAdjacentHTML('beforeend', ' <button type="button" data-click="deshacer">Deshacer</button>');
  },

  async deshacer() {
    if (!ultimo) return;
    const { id, cantidad } = ultimo;
    ultimo = null;
    await setQty(id, cantidad);
    if (current === 'carrito') await cambiar(render);
  },

  async empty() {
    setCart(await api('/carrito', { method: 'DELETE' }));
    await render();
  },

  async checkout() {
    // La bolsa entra en una caja y sube a un avión mientras responde la API; si rechaza, la escena se va.
    const escena = enviar(cart.items.map((it) => guisoDe(it.guiso.nombre).color));
    let p;
    try { p = await api('/pedidos', { method: 'POST' }); } catch (err) { escena?.cancel(); throw err; }
    await escena?.listo;
    // Después de la escena, «Mis pedidos» de un solo paso: la bolsa no se vacía a la vista y no hay fundido.
    // Lo único que se mueve es el resaltado del pedido nuevo.
    bolsaUI = null;
    directo = true;
    setCart(EMPTY);
    notice(`Pedido #${p.id} confirmado por ${money(p.total_centavos)}.`);
    nuevo = p.id;
    await go('pedidos');
    nuevo = null;
  },

  async saveGuiso(form) {
    const f = Object.fromEntries(new FormData(form));
    const body = {
      nombre: f.nombre.trim(),
      descripcion: f.descripcion.trim(),
      precio_centavos: Math.round(Number(f.precio) * 100),
      porciones: Number(f.porciones),
      stock: Number(f.stock),
    };
    const g = editing
      ? await api(`/guisos/${editing.id}`, { method: 'PUT', body })
      : await api('/guisos', { method: 'POST', body });
    notice(`${editing ? 'Guardado' : 'Agregado'}: ${g.nombre}.`);
    editing = null;
    guardado = g.id; // su renglón sale palomeado (y, si es nuevo, entra con movimiento)
    await render();
    guardado = null;
    view.querySelector('.guardado')?.scrollIntoView({ block: 'nearest' });
  },

  async edit(el) {
    editing = guisos.find((g) => String(g.id) === el.dataset.id);
    await render();
    document.getElementById('g-nombre').focus();
  },

  cancelEdit() {
    editing = null;
    return render();
  },

  // Eliminar se confirma en el mismo renglón: «¿Eliminar? Sí / No». El foco cae en «No».
  async pedirDel(el) {
    borrando = el.dataset.id;
    await render();
    document.getElementById('del-no')?.focus();
  },

  cancelDel() {
    borrando = null;
    return render();
  },

  async del(el) {
    const g = guisos.find((x) => String(x.id) === el.dataset.id);
    borrando = null;
    await api(`/guisos/${g.id}`, { method: 'DELETE' });
    if (editing?.id === g.id) editing = null;
    notice(`Eliminado: ${g.nombre}.`);
    await render();
  },
};

// ---------- Motor: errores, rutas y eventos ----------

// Todo lo que puede fallar pasa por aquí: un solo catch, un solo lugar de avisos.
async function run(fn) {
  try {
    await fn();
  } catch (err) {
    notice(err.message, 'error');
    if (err.vencida) { // sesión vencida: api() ya borró el token (un login fallido también da 401, y no lo es)
      setCart(EMPTY);
      await go('entrar');
    }
  }
}

const TITULOS = {
  catalogo: 'Guisos', carrito: 'Tu carrito', pedidos: 'Mis pedidos', admin: 'Administrar guisos',
  cuenta: 'Tu cuenta', entrar: 'Iniciar sesión', registro: 'Crear cuenta', guiso: 'Guiso',
  ayuda: 'Envíos y preguntas',
};

// La dirección es #vista o #vista/parámetro (la ficha: #guiso/3).
const route = () => {
  const [r, p = ''] = location.hash.slice(1).split('/');
  param = decodeURIComponent(p);
  return Object.hasOwn(VIEWS, r) ? r : 'catalogo';
};

// Navegar desde código sin perder el aviso recién puesto.
function go(r) {
  location.hash = r;
  return render();
}

// Cuenta y carrito de la cabecera (la misma pieza que usa el resto del sitio). Los enlaces principales
// están escritos en el HTML; aquí solo se marca «Guisos» cuando se está en el catálogo.
function renderNav() {
  const actual = current === 'registro' ? 'entrar' : current;
  nav.innerHTML = cuenta(user(), { base: '', actual, admin: isAdmin() });
  pintarCarrito(piezas(cart), { base: '', actual, fin: deadline });
  const guisos = document.querySelector('#nav-principal a[href="/tienda/#catalogo"]');
  if (current === 'catalogo') guisos?.setAttribute('aria-current', 'page');
  else guisos?.removeAttribute('aria-current');
}

async function render() {
  rendered = location.hash;
  const id = ++renderId;
  let r = route();
  if (!user() && (r === 'carrito' || r === 'pedidos' || r === 'cuenta')) {
    if (r !== 'cuenta') { notice('Inicia sesión para continuar.', 'error'); desde = r; } // al entrar, se sigue hacia allá
    r = 'entrar';
  }
  if (user() && (r === 'entrar' || r === 'registro')) r = 'cuenta';
  if (r === 'admin' && !isAdmin()) r = 'catalogo';
  if (r !== 'entrar' && r !== 'registro') desde = r === 'guiso' ? `guiso/${encodeURIComponent(param)}` : r;
  document.title = `${TITULOS[r]} — Los Tacos May`;
  const changed = r !== current;
  const deUnPaso = directo;
  directo = false;
  if (changed) borrando = null;
  current = r;
  renderNav();
  if (changed) llegando = true;
  // El esqueleto solo si tarda, y nunca dos veces (el de index.html puede estar ya puesto).
  const tarda = setTimeout(() => { if (id === renderId && changed && r === 'catalogo' && !view.querySelector('.hueca')) view.innerHTML = ESQUELETO; }, TARDA);
  await run(async () => {
    let html;
    try { html = await VIEWS[r](); } finally { clearTimeout(tarda); }
    if (id !== renderId) return; // ya hay un render más nuevo
    if (html === YA_PINTADO) { tick(); return; }
    const focusId = document.activeElement?.id;
    const pintar = () => {
      const esqueleto = view.querySelector('.hueca');
      view.innerHTML = html;
      // Sustituye al esqueleto en su lugar: fundido corto, sin volver a deslizar.
      if (esqueleto) for (const ul of view.querySelectorAll('.renglones.entra')) ul.classList.replace('entra', 'funde');
      montarBolsa();
      view.dataset.vista = r; // para que la hoja de estilos componga cada vista en pantalla ancha
      tick();
      // Conserva el foco al repintar; al cambiar de vista lo manda al contenido.
      // Sin desplazar: enfocar <main> escondía la cabecera (y el logotipo) al cargar.
      ((focusId && document.getElementById(focusId)) || (changed && view))?.focus?.({ preventScroll: true });
      // Si se está armando fuera de la vista (js/paginas.js), no se mueve la página que se ve.
      if (changed && !view.closest('[hidden]')) scrollTo(0, 0);
    };
    // Entre vistas, un fundido corto del navegador; sin soporte, cambia sin animar. Solo al cambiar de
    // vista: los repintados de la misma (carrito) ya traen su propia transición.
    if (!changed || deUnPaso) return pintar();
    // Hacia la ficha, la charola que se tocó se convierte en la de la ficha (mismo nombre de transición).
    if (r === 'guiso') view.querySelector(`[data-control="${CSS.escape(param)}"]`)?.closest('.charola')?.style.setProperty('view-transition-name', 'charola-ficha');
    await transicion(pintar);
  });
}

function dispatch(e, type) {
  const el = e.target.closest(`[data-${type}]`);
  if (!el) return;
  e.preventDefault();
  notice();
  if (type === 'submit' && !validar(el)) return;
  const btn = e.submitter || (el.tagName === 'BUTTON' ? el : null);
  // El botón dice en sí mismo que está enviando; deshabilitado evita el doble clic (p. ej. confirmar dos veces).
  if (btn) { btn.disabled = true; btn.classList.add('enviando'); btn.setAttribute('aria-busy', 'true'); }
  run(() => ACTIONS[el.dataset[type]](el)).finally(() => {
    if (btn) { btn.disabled = false; btn.classList.remove('enviando'); btn.removeAttribute('aria-busy'); }
  });
}
for (const type of ['click', 'submit', 'change']) view.addEventListener(type, (e) => dispatch(e, type));
nav.addEventListener('click', (e) => { if (activa()) dispatch(e, 'click'); }); // «Salir» vive en la cabecera
aviso.addEventListener('click', (e) => dispatch(e, 'click')); // «Deshacer» vive en el aviso

addEventListener('hashchange', () => {
  if (!activa() || location.hash === rendered) return;
  notice();
  render();
});

// Al volver con «atrás» la página sale de la memoria del navegador tal como se dejó (quizá con otra
// sesión o con otro carrito, cambiados en la landing): se pone al día sin recargar.
// Lo mismo al regresar desde la landing sin recargar (js/paginas.js avisa con «tm:pagina»).
const ponerAlDia = () => run(async () => {
  llegando = true;
  if (user()) await loadCart();
  else setCart(EMPTY);
  await render();
});
addEventListener('pageshow', (e) => { if (e.persisted && activa()) ponerAlDia(); });
// js/paginas.js avisa antes de mostrar la tienda y espera a que esté al día: se muestra ya lista.
addEventListener('tm:pagina', (e) => {
  if (!activa() || !location.pathname.startsWith('/tienda/')) return;
  const listo = ponerAlDia(); // fuera del ?.(): si no hay quien espere, igual se pone al día
  e?.detail?.esperar?.(listo);
});

// Arranque: si hay sesión guardada, se valida contra el backend y se carga su carrito (a la vez).
if (user()) {
  await run(async () => {
    const [yo] = await Promise.all([api('/users/me'), loadCart()]);
    session.set({ ...user(), ...yo });
  });
}
// Se espera la primera pintada: así js/paginas.js, al importar este script, muestra la tienda ya pintada.
await render();
