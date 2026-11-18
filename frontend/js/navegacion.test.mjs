// Entre la landing y la tienda sin recargar: node frontend/js/navegacion.test.mjs
// Corre js/paginas.js con un DOM de juguete: ida a la tienda, vuelta con «atrás», ir y volver tres
// veces (sin pedir de nuevo ni duplicar escuchas ni scripts), ancla de la landing desde la tienda,
// clics que no le tocan (pestaña nueva, tecla, externo, # de la misma página), respaldo si la red falla
// y entrada directa. Lo que hace cada página al volver lo prueba tienda/app.test.mjs.
import assert from 'node:assert/strict';

const ORIGEN = 'https://tacos.test';
const espera = () => new Promise((r) => setTimeout(r, 10));

// ---------- DOM de juguete ----------
class El {
  constructor(tag, attrs = {}, fijo = false) {
    Object.assign(this, { tagName: tag.toUpperCase(), attrs, fijo, textContent: '', media: '', h: {} });
  }
  matches() { return this.fijo || ['anuncio', 'preparando'].includes(this.attrs.id); } // paginas.js solo pregunta por su lista de partes fijas
  getAttribute(k) { return this.attrs[k] ?? null; }
  setAttribute(k, v) { this.attrs[k] = v; }
  removeAttribute(k) { delete this.attrs[k]; }
  hasAttribute(k) { return k in this.attrs; }
  get id() { return this.attrs.id; }
  set id(v) { this.attrs.id = v; }
  remove() { const i = this.dueno?.indexOf(this) ?? -1; if (i >= 0) this.dueno.splice(i, 1); }
  // Mover un nodo lo saca de donde estaba, como en el DOM.
  before(...nodos) {
    for (const n of nodos) n.remove();
    this.dueno.splice(this.dueno.indexOf(this), 0, ...nodos.map((n) => Object.assign(n, { dueno: this.dueno })));
    if (this.tagName === 'FOOTER') orden.push('se muestra'); // lo de después de la cabecera va antes del pie: el último paso
  }
  append(...nodos) { this.hijos ??= []; for (const n of nodos) { n.remove(); n.dueno = this.hijos; this.hijos.push(n); } }
  focus() { enfocado = this; }
  scrollIntoView() { anclado = this.id; }
}
const cuerpo = (lista) => { lista.forEach((n) => { n.dueno = lista; }); return lista; };
// Las hojas del <head>: las tres de siempre. paginas.js no debe tocarlas (ni media, ni href, ni nuevas).
const hoja = (href) => Object.assign(new El('link', { rel: 'stylesheet', href }), { rel: 'stylesheet', href });
// La marca de la página en <html>: en-inicio o en-tienda.
const clases = (lista) => ({
  lista,
  get length() { return lista.length; },
  [Symbol.iterator]() { return lista[Symbol.iterator](); },
  replace(a, b) { const i = lista.indexOf(a); if (i < 0) return false; lista[i] = b; return true; },
});

let enfocado = null;
const orden = []; // qué pasó primero: que la página nueva pintara o que se mostrara
let anclado = null;
let asignado = null;
let html; // los nodos del <body> de la página que se ve
let links; // las hojas del <head>
const raiz = { classList: clases([]) }; // <html>
const ventana = {};
const docEsc = {};
const pila = []; // el historial: [{ url, state }]
let pos = 0;
let pedidosRed = [];
let redFalla = false;
let transiciones = 0;
let movimiento = false;
// Las fuentes: paginas.js las pide todas antes de cambiar. Una puede no llegar nunca (red mala).
let fuentesPedidas = 0;
let fuenteAtorada = false;
const fuente = () => ({ load: () => { fuentesPedidas++; return fuenteAtorada ? new Promise(() => {}) : Promise.resolve(); } });

const PARTES = {
  '/': () => {
    const cab = new El('header', {}, true);
    return { cab, nodos: [new El('a', { class: 'saltar' }), cab, new El('script', {}, true), new El('main', { id: 'contenido' }), new El('section', { id: 'como' }), new El('footer', {}, true), new El('script', { src: '/js/landing.js' }, true)] };
  },
  '/tienda/': () => {
    const cab = new El('header', {}, true);
    return { cab, nodos: [cab, new El('script', {}, true), new El('p', { id: 'aviso' }), new El('main', { id: 'vista', tabindex: '-1' }), new El('template', { id: 'esqueleto' }), Object.assign(new El('script'), { textContent: 'esqueleto()' }), new El('dialog', { id: 'panel-carrito' }), new El('footer', {}, true), new El('script', { type: 'module', src: MODULO_TIENDA }, true)] };
  },
};
// La tienda de juguete: cuenta cuántas veces corre y cuántas veces la despiertan estando a la vista.
const MODULO_TIENDA = `data:text/javascript,globalThis.cargasTienda=(globalThis.cargasTienda||0)+1;globalThis.orden.push('tienda pinta');addEventListener('tm:pagina',(e)=>{if(location.pathname!=='/tienda/')return;globalThis.despiertaTienda=(globalThis.despiertaTienda||0)+1;e.detail.esperar(new Promise((r)=>setTimeout(()=>{globalThis.orden.push('tienda al día');r()},globalThis.tardaTienda||5)))})`;
globalThis.orden = orden;
const HOJAS = ['/barra.css', '/landing.css', '/tienda/styles.css'];
const MARCA = { '/': 'en-inicio', '/tienda/': 'en-tienda' };

function montar(ruta) {
  html = cuerpo(PARTES[ruta]().nodos);
  document.title = ruta === '/' ? 'Inicio' : 'Tienda';
  links = HOJAS.map(hoja);
  raiz.classList = clases(['js', MARCA[ruta]]); // «js» la pone landing.js: no se debe perder
  pila.length = 0;
  pila.push({ url: ORIGEN + ruta, state: null });
  pos = 0;
}
const url = () => new URL(pila[pos].url);

Object.assign(globalThis, {
  document: {
    get title() { return this._t ?? ''; }, set title(v) { this._t = v; },
    get documentElement() { return raiz; },
    fonts: [fuente(), fuente(), fuente()],
    head: { querySelectorAll: () => links, append() { throw new Error('paginas.js no debe agregar hojas'); } },
    body: { get children() { return [...html]; }, append(n) { n.remove?.(); n.dueno = html; html.push(n); } },
    querySelector(sel) {
      if (sel === 'header.cabecera') return html.find((n) => n.tagName === 'HEADER');
      if (sel === 'footer.pie') return html.find((n) => n.tagName === 'FOOTER');
      if (sel === 'main') return html.find((n) => n.tagName === 'MAIN');
      return null;
    },
    querySelectorAll: () => [],
    getElementById: (id) => html.find((n) => n.id === id) ?? null,
    createElement: (tag) => new El(tag),
    importNode: (n) => Object.assign(n, { importado: true }),
    addEventListener: (t, fn) => { (docEsc[t] ??= []).push(fn); },
    startViewTransition(fn) {
      transiciones++;
      fn();
      const saltada = () => Promise.reject(new Error('Transition was skipped'));
      return { ready: saltada(), finished: saltada(), updateCallbackDone: Promise.resolve() };
    },
  },
  location: {
    get pathname() { return url().pathname; }, get href() { return url().href; }, get hash() { return url().hash; },
    get origin() { return ORIGEN; }, assign(u) { asignado = u; },
  },
  history: {
    scrollRestoration: 'auto',
    get state() { return pila[pos].state; },
    pushState(state, _, u) { pila.splice(pos + 1); pila.push({ url: new URL(u, url()).href, state }); pos++; },
    replaceState(state) { pila[pos].state = state; },
  },
  DOMParser: class {
    parseFromString(ruta) {
      const { cab, nodos } = PARTES[ruta]();
      return {
        title: ruta === '/' ? 'Inicio' : 'Tienda',
        documentElement: { classList: clases([MARCA[ruta]]) },
        head: { querySelectorAll: () => HOJAS.map((h) => new El('link', { href: h })) },
        body: { children: nodos, querySelectorAll: () => nodos.filter((n) => n.attrs.type === 'module') },
        querySelector: () => cab,
      };
    }
  },
  fetch: async (ruta) => {
    pedidosRed.push(ruta);
    if (redFalla) throw new Error('sin red');
    return { ok: true, headers: { get: () => 'text/html; charset=utf-8' }, text: async () => ruta };
  },
  matchMedia: () => ({ matches: movimiento }),
  scrollTo() {}, scrollY: 0,
  addEventListener: (t, fn) => { (ventana[t] ??= []).push(fn); },
  dispatchEvent: (e) => { for (const fn of ventana[e.type] ?? []) fn(e); },
});

const enlace = (href, extra = {}) => ({ href: new URL(href, url()).href, target: '', hasAttribute: () => false, ...extra });
async function clic(href, { tecla = {}, a = {} } = {}) {
  const e = { button: 0, ...tecla, defaultPrevented: false, target: { closest: () => enlace(href, a) }, preventDefault() { this.defaultPrevented = true; } };
  for (const fn of docEsc.click) fn(e);
  await espera();
  return e.defaultPrevented;
}
async function atras() {
  pos--;
  for (const fn of ventana.popstate) fn();
  await espera();
}
// Las hojas, tal como estaban: mismas, en el mismo orden, sin media ni href cambiados.
const hojasIntactas = () => links.length === 3 && links.every((l, i) => l.href === HOJAS[i] && l.attrs.href === HOJAS[i] && l.media === '');
const marca = () => [...raiz.classList].join(' ');
const ids = () => html.filter((n) => !n.fijo && n.id !== 'anuncio').map((n) => n.id || n.tagName.toLowerCase());

// ---------- Respaldo: si la red falla, navegación normal ----------
montar('/');
await import('./paginas.js?respaldo');
redFalla = true;
assert.equal(await clic('/tienda/#carrito'), true);
assert.equal(asignado, `${ORIGEN}/tienda/#carrito`, 'sin red: se va con navegación normal');
assert.deepEqual(ids(), ['a', 'contenido', 'como'], 'y la landing queda como estaba');
redFalla = false;

// ---------- Entrada directa a /tienda/#carrito: no cambia nada, solo deja lista la otra página ----------
montar('/tienda/');
pila[0].url = `${ORIGEN}/tienda/#carrito`;
await import('./paginas.js?directa');
assert.deepEqual(ids(), ['aviso', 'vista', 'esqueleto', 'script', 'panel-carrito'], 'entrada directa: la tienda tal cual');
assert.equal(history.scrollRestoration, 'manual');

// ---------- Ida: landing → tienda ----------
montar('/');
for (const k of Object.keys(ventana)) delete ventana[k];
for (const k of Object.keys(docEsc)) delete docEsc[k];
pedidosRed = [];
asignado = null;
await import('./paginas.js');
const landing = ids();
const nodosLanding = html.filter((n) => !n.fijo);
const cabecera = html.find((n) => n.tagName === 'HEADER');
const pie = html.find((n) => n.tagName === 'FOOTER');
const escuchas = () => JSON.stringify([Object.keys(ventana).map((k) => [k, ventana[k].length]), Object.keys(docEsc).map((k) => [k, docEsc[k].length])]);

assert.equal(await clic('/tienda/#carrito'), true, 'el clic a la otra página lo atiende paginas.js');
assert.equal(asignado, null, 'sin recargar');
assert.ok(fuentesPedidas >= 3, 'antes de cambiar, se piden las fuentes');
assert.equal(location.href, `${ORIGEN}/tienda/#carrito`, 'la dirección es la de la tienda, con su #');
assert.deepEqual(ids(), ['aviso', 'vista', 'esqueleto', 'script', 'panel-carrito'], 'lo de la tienda, en su lugar');
assert.equal(html.find((n) => n.tagName === 'HEADER'), cabecera, 'la cabecera es la misma, sin tocar');
assert.equal(html.find((n) => n.tagName === 'FOOTER'), pie, 'el pie también');
assert.equal(html.indexOf(cabecera), 0, 'el enlace para saltar se fue con la landing');
assert.ok(hojasIntactas(), 'las hojas no se tocan al cambiar de página');
assert.equal(marca(), 'js en-tienda', '<html> queda marcado como tienda, sin perder sus otras clases');
assert.equal(document.title, 'Tienda');
assert.equal(enfocado?.id, 'vista', 'el foco va al contenido nuevo');
assert.equal(html.find((n) => n.tagName === 'SCRIPT' && !n.fijo).textContent, 'esqueleto()', 'el script en línea de la tienda se rehace para que corra');
await espera();
await new Promise((r) => setTimeout(r, 60));
assert.match(document.getElementById('anuncio').textContent, /Tienda/, 'se anuncia la página nueva');
assert.equal(globalThis.cargasTienda, 1, 'el script de la tienda corre una vez');
assert.deepEqual(orden.slice(-2), ['tienda pinta', 'se muestra'], 'primero pinta fuera de la vista y luego se muestra, ya pintada');
assert.ok(!html.some((n) => n.id === 'preparando'), 'el contenedor oculto ya no está');
const escuchasAntes = escuchas(); // ya con la tienda cargada: de aquí no debe crecer
assert.equal(transiciones, 0, 'con movimiento reducido: cambio directo, sin transición');

// ---------- Vuelta con «atrás» ----------
await atras();
assert.equal(location.pathname, '/');
assert.deepEqual(ids(), landing, 'atrás: la landing de vuelta');
assert.ok(html.filter((n) => !n.fijo && n.id !== 'anuncio').every((n, i) => n === nodosLanding[i]), 'con los mismos nodos (y sus escuchas), no unos nuevos');
assert.ok(hojasIntactas(), 'ni al volver');
assert.equal(marca(), 'js en-inicio', 'y <html> vuelve a ser la landing');
assert.equal(document.title, 'Inicio');

// ---------- Ir y volver tres veces ----------
movimiento = true; // con movimiento permitido, el cambio va dentro de una transición
for (let vuelta = 1; vuelta <= 3; vuelta++) {
  assert.equal(await clic('/tienda/#catalogo'), true);
  assert.deepEqual(ids(), ['aviso', 'vista', 'esqueleto', 'script', 'panel-carrito'], `vuelta ${vuelta}: tienda`);
  assert.equal(await clic('/'), true);
  assert.deepEqual(ids(), landing, `vuelta ${vuelta}: landing`);
}
assert.deepEqual(pedidosRed, ['/tienda/'], 'la tienda se pidió una sola vez');
assert.equal(globalThis.cargasTienda, 1, 'su script sigue corrido una sola vez');
assert.equal(globalThis.despiertaTienda, 3, 'y la despertaron una vez por vuelta');
const alDia = orden.flatMap((o, i) => (o === 'tienda al día' ? [orden[i + 1]] : []));
assert.deepEqual(alDia, ['se muestra', 'se muestra', 'se muestra'], 'al volver, cada vez primero se pone al día y luego se muestra');
assert.equal(escuchas(), escuchasAntes, 'ninguna escucha se duplicó');
assert.equal(transiciones, 6, 'con movimiento permitido, cada cambio con transición');
assert.ok(hojasIntactas(), 'tres vueltas y las hojas siguen intactas');

// ---------- Ancla de la landing desde la tienda ----------
await clic('/tienda/#pedidos');
anclado = null;
await clic('/#como');
assert.equal(location.href, `${ORIGEN}/#como`);
assert.equal(anclado, 'como', 'llega y se desplaza a la sección');

// ---------- Si la tienda tarda en ponerse al día, se muestra pasado el tope ----------
globalThis.tardaTienda = 5000;
await clic('/tienda/#catalogo');
assert.equal(ids().includes('vista'), false, 'mientras se pone al día, se sigue viendo la landing');
await new Promise((r) => setTimeout(r, 500));
assert.deepEqual(ids(), ['aviso', 'vista', 'esqueleto', 'script', 'panel-carrito'], 'pasado el tope, se muestra la tienda');
globalThis.tardaTienda = 5;
await clic('/');

// ---------- Una fuente que no llega no detiene la navegación ----------
fuenteAtorada = true;
await clic('/tienda/#carrito');
assert.equal(location.pathname, '/', 'mientras espera las fuentes, todavía no cambia');
await new Promise((r) => setTimeout(r, 700));
assert.equal(location.pathname, '/tienda/', 'pasado el tope, cambia igual');
assert.deepEqual(ids(), ['aviso', 'vista', 'esqueleto', 'script', 'panel-carrito']);
fuenteAtorada = false;
await clic('/');

// ---------- Lo que no le toca a paginas.js ----------
assert.equal(await clic('/#taqueria'), false, 'un # de la misma página lo atiende el navegador');
assert.equal(await clic('/tienda/', { tecla: { ctrlKey: true } }), false, 'con Ctrl (pestaña nueva) no se intercepta');
assert.equal(await clic('/tienda/', { tecla: { metaKey: true } }), false, 'con ⌘ tampoco');
assert.equal(await clic('/tienda/', { a: { target: '_blank' } }), false, 'ni con target');
assert.equal(await clic('https://maps.google.com/x'), false, 'ni un enlace externo');
assert.equal(await clic('/marca/'), false, 'ni otra página del sitio que no es landing ni tienda');

console.log('navegacion.test: OK (ida, atrás, tres vueltas, ancla, respaldo y entrada directa)');
