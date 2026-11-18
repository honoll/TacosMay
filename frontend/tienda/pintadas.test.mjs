// Cuántas veces se pinta la tienda: node frontend/tienda/pintadas.test.mjs
// Cada vez que se reescribe <main> entero, las fotos se vuelven a crear y la entrada de las charolas se
// repite. Aquí se cuentan esas pintadas al llegar al catálogo sin datos y con datos ya guardados, y se
// comprueba que un cambio del carrito o de existencias se pone al día en su tarjeta, sin repintar.
import assert from 'node:assert/strict';

// ---------- DOM mínimo: <main> cuenta sus pintadas y arma sus tarjetas con lo que se le escribe ----------
const DES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
const desescapar = (t) => t.replace(/&(amp|lt|gt|quot|#39);/g, (m) => DES[m]);
const nodo = (extra = {}) => ({
  innerHTML: '', textContent: '', hidden: false, isConnected: true, className: '', dataset: {}, h: {},
  style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {}, replace() {} },
  addEventListener(tipo, fn) { this.h[tipo] = fn; }, setAttribute() {}, removeAttribute() {},
  insertAdjacentHTML() {}, querySelector: () => null, querySelectorAll: () => [], focus() {}, closest: () => null,
  ...extra,
});

let pintadas = [];   // el HTML de cada vez que se reescribió <main>
let tarjetas = [];   // las charolas que hay en <main>, como objetos que se conservan mientras no se repinte
let fundidos = 0;    // filas que cambiaron «entra» (deslizar) por «funde» (fundido)
function armarTarjetas(html) {
  return [...html.matchAll(/<li class="renglon([^"]*)" data-clave="([^"]*)" data-firma="([^"]*)">[\s\S]*?<div class="datos">([\s\S]*?)<\/div>\s*<\/li>/g)]
    .map(([, cls, clave, firma, datos]) => {
      const li = { className: `renglon${cls}`, dataset: { clave: desescapar(clave), firma }, img: { foto: true }, escrituras: 0 };
      const d = { _h: datos, get innerHTML() { return this._h; }, set innerHTML(v) { this._h = v; li.escrituras++; } };
      li.querySelector = (sel) => (sel === '.datos' ? d : sel === 'img' ? li.img : null);
      return li;
    });
}
let html = '';
// defineProperties y no {...}: el spread copiaría el valor del getter, no el getter (y no contaría nada).
const vista = Object.defineProperties(nodo(), Object.getOwnPropertyDescriptors({
  get innerHTML() { return html; },
  set innerHTML(v) { html = v; pintadas.push(v); tarjetas = armarTarjetas(v); },
  querySelector(sel) {
    if (sel === '.hueca') return html.includes('hueca') ? {} : null;
    if (sel === '[data-estructura]') {
      const m = html.match(/data-estructura="([^"]*)"/);
      return m ? { dataset: { estructura: desescapar(m[1]) } } : null;
    }
    return null;
  },
  querySelectorAll(sel) {
    if (sel === '.renglon[data-clave]') return tarjetas;
    if (sel === '.renglones.entra') return [...html.matchAll(/class="renglones entra"/g)].map(() => ({ classList: { replace: () => { fundidos++; } } }));
    return [];
  },
}));
const ESQUELETO = '<h1>Guisos</h1><ul class="barra">' + '<li class="charola hueca"></li>'.repeat(8) + '</ul>';
const porId = { vista, esqueleto: nodo({ innerHTML: ESQUELETO }) };
const store = {};
let hash = '';
const oyentes = {};
Object.assign(globalThis, {
  localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; }, removeItem: (k) => { delete store[k]; } },
  document: { getElementById: (id) => (porId[id] ??= nodo()), querySelector: () => null, querySelectorAll: () => [], activeElement: null, title: '' },
  location: { get pathname() { return '/tienda/'; }, get hash() { return hash; }, set hash(v) { hash = v ? `#${String(v).replace(/^#/, '')}` : ''; } },
  addEventListener: (tipo, fn) => { oyentes[tipo] = fn; },
  setInterval: () => 0, scrollTo() {}, CSS: { escape: String },
});

// ---------- API de mentira ----------
let GUISOS = [
  { id: '1', nombre: 'Carne en salsa roja', descripcion: 'igual', precio_centavos: 20000, porciones: 4, stock: 5 },
  { id: '2', nombre: 'Chorizo con huevo', descripcion: 'igual', precio_centavos: 20000, porciones: 4, stock: 3 },
  { id: '3', nombre: 'Tinga de res', descripcion: 'igual', precio_centavos: 20000, porciones: 4, stock: 2 },
];
let carrito = { items: [], total_centavos: 0, expira_en_segundos: 0 };
let tardaApi = 0;
const llamadas = [];
globalThis.fetch = async (url) => {
  llamadas.push(url);
  if (tardaApi && url.startsWith('/api/guisos')) await new Promise((r) => setTimeout(r, tardaApi));
  const ok = (data) => ({ ok: true, status: 200, json: async () => structuredClone(data) });
  if (url === '/api/guisos') return ok(GUISOS);
  if (url === '/api/guisos/populares') return ok([{ ...GUISOS[0], vendidos: 3 }]);
  if (url === '/api/guisos/1') return ok(GUISOS[0]);
  if (url === '/api/carrito') return ok(carrito);
  if (url === '/api/users/me') return ok({ id: 'u1', nombre: 'Prueba', email: 'p@x.mx', rol: 'cliente' });
  throw new Error(`llamada no prevista: ${url}`);
};
const espera = (ms = 20) => new Promise((r) => setTimeout(r, ms));
const tarjetaDe = (id) => tarjetas.filter((li) => li.dataset.clave === id);
const despertar = async () => { oyentes['tm:pagina']({ detail: { ruta: '/tienda/', esperar() {} } }); await espera(); };

// ---------- 1 · Sin datos guardados (entrada directa), la API tarda: esqueleto y contenido ----------
tardaApi = 260;
await import('./app.js');
await espera(400);
assert.equal(pintadas.length, 2, `sin datos: esqueleto y contenido, nada más (fueron ${pintadas.length})`);
assert.match(pintadas[0], /hueca/, 'primero, el esqueleto');
assert.match(pintadas[1], /data-clave="1"/, 'luego, el catálogo');
assert.ok(fundidos > 0, 'el catálogo sustituye al esqueleto con un fundido, sin volver a deslizar');
assert.match(pintadas[1], /loading="eager"/, 'la primera fila carga sus fotos de inmediato');

// ---------- 2 · Con datos guardados (llegada desde la landing): una sola pintada ----------
tardaApi = 0;
pintadas = [];
html = '';
fundidos = 0;
await import('./app.js?con-datos'); // la tienda vuelve a arrancar; los datos ya están en js/datos.js
await espera(60);
assert.equal(pintadas.length, 1, `con datos guardados: una sola pintada (fueron ${pintadas.length})`);
assert.doesNotMatch(pintadas[0], /hueca/, 'sin esqueleto');
assert.equal(llamadas.filter((u) => u === '/api/guisos').length, 2, 'y los vuelve a pedir por detrás (una vez al llegar)');

// ---------- 3 · Cambia el carrito: se pone al día en su tarjeta, sin repintar ni rehacer fotos ----------
store.tm_sesion = JSON.stringify({ id: 'u1', nombre: 'Prueba', rol: 'cliente', token: 't' });
carrito = { items: [{ guiso: GUISOS[0], cantidad: 2 }], total_centavos: 40000, expira_en_segundos: 900 };
const antes = tarjetas;
const foto1 = tarjetaDe('1')[0].img;
await despertar();
assert.equal(pintadas.length, 1, 'un cambio del carrito no repinta <main>');
assert.equal(tarjetas, antes, 'las mismas tarjetas');
assert.equal(tarjetaDe('1')[0].img, foto1, 'con la misma foto (no se vuelve a cargar)');
for (const li of tarjetaDe('1')) assert.match(li.querySelector('.datos').innerHTML, /class="cantidad"/, 'la tarjeta del guiso agregado muestra su cantidad');
for (const li of tarjetaDe('2')) assert.equal(li.escrituras, 0, 'las demás tarjetas no se tocan');

// ---------- 4 · Al revalidar, cambió una existencia: solo esa tarjeta ----------
GUISOS = GUISOS.map((g) => (g.id === '3' ? { ...g, stock: 0 } : g));
await despertar();
await espera(40);
assert.equal(pintadas.length, 1, 'un cambio de existencia tampoco repinta <main>');
const [tinga] = tarjetaDe('3');
assert.match(tinga.className, /agotado/, 'el renglón del guiso agotado se apaga');
assert.match(tinga.querySelector('.datos').innerHTML, /Se acabó por hoy/);
for (const li of tarjetaDe('2')) assert.equal(li.escrituras, 0, 'y las demás siguen sin tocarse');

// ---------- 5 · Entre vistas de la tienda: una pintada por cambio ----------
location.hash = 'guiso/1';
oyentes.hashchange();
await espera(60);
assert.equal(pintadas.length, 2, 'del catálogo a la ficha: una pintada');
assert.match(pintadas[1], /<h1>Carne en salsa roja<\/h1>/);

console.log('pintadas.test: OK (sin datos 2, con datos 1, carrito y existencias sin repintar, ficha 1)');
