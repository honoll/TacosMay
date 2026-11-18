// La tienda, armada sin navegador: node frontend/tienda/app.test.mjs
// Carga app.js con un DOM mínimo y una API de mentira, recorre el flujo de cuenta y arma cada
// vista con datos de ejemplo. Comprueba dos cosas que leer el código por partes no detecta:
// 1) a dónde se regresa después de entrar, y que un error de acceso no borra el formulario;
// 2) que en escritorio cada bloque de cada vista tiene su celda escrita y ninguna se encima.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// ---------- DOM mínimo ----------
const nodo = (extra = {}) => ({
  innerHTML: '', textContent: '', hidden: false, className: '', dataset: {}, h: {}, attrs: {},
  style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} },
  addEventListener(tipo, fn) { this.h[tipo] = fn; },
  setAttribute(k, v) { this.attrs[k] = v; }, removeAttribute(k) { delete this.attrs[k]; },
  insertAdjacentHTML(_, html) { this.despues = (this.despues || '') + html; },
  querySelector: () => null, querySelectorAll: () => [], focus() { this.enfocado = true; }, closest: () => null,
  ...extra,
});
const porId = {};
const store = {};
let hash = '';
const oyentes = {};
Object.assign(globalThis, {
  localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; }, removeItem: (k) => { delete store[k]; } },
  document: { getElementById: (id) => (porId[id] ??= nodo()), querySelector: () => null, querySelectorAll: () => [], activeElement: null, title: '' },
  location: { get hash() { return hash; }, set hash(v) { hash = v ? `#${String(v).replace(/^#/, '')}` : ''; } },
  addEventListener: (tipo, fn) => { oyentes[tipo] = fn; },
  setInterval: () => 0, scrollTo() {}, innerWidth: 1440, CSS: { escape: String },
  FormData: class { constructor(f) { this.e = [...f.elements].map((i) => [i.name, i.value]); } [Symbol.iterator]() { return this.e[Symbol.iterator](); } },
});

// ---------- API de mentira ----------
const GUISOS = [
  { id: '1', nombre: 'Carne en salsa roja', descripcion: 'igual', precio_centavos: 20000, porciones: 4, stock: 5 },
  { id: '2', nombre: 'Guiso nuevo', descripcion: 'propia de este guiso', precio_centavos: 18000, porciones: 4, stock: 0 },
  { id: '3', nombre: 'Tinga de res', descripcion: 'igual', precio_centavos: 20000, porciones: 4, stock: 2 },
];
const USUARIO = { id: 'u1', nombre: 'Prueba', email: 'p@x.mx', rol: 'admin', token: 't' };
const CARRITO = { items: [{ guiso: GUISOS[0], cantidad: 2 }], total_centavos: 40000, expira_en_segundos: 900 };
const PEDIDO = { id: '7', total_centavos: 40000, creado: '2026-11-17T12:00:00Z', items: [{ guisoId: '1', nombre: 'Carne en salsa roja', cantidad: 2, precio_centavos: 20000 }] };
let carritoVacio = false;
const llamadas = [];
const cuerpos = [];
globalThis.fetch = async (url, { method = 'GET', body } = {}) => {
  llamadas.push(`${method} ${url}`);
  cuerpos.push(body);
  const ok = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });
  if (url === '/api/guisos') return ok(GUISOS);
  if (url === '/api/guisos/1') return ok(GUISOS[0]);
  if (url.startsWith('/api/guisos/') && url !== '/api/guisos/populares') return ok({ message: 'Guiso no encontrado' }, 404);
  if (url === '/api/guisos/populares') return ok([{ ...GUISOS[0], vendidos: 3 }]);
  if (url === '/api/carrito') return ok(carritoVacio ? { items: [], total_centavos: 0, expira_en_segundos: 0 } : CARRITO);
  if (url.startsWith('/api/carrito/items/')) return JSON.parse(body).cantidad > 5 ? ok({ message: 'Solo quedan 5 de Carne en salsa roja' }, 409) : ok(CARRITO);
  if (url === '/api/pedidos') return ok([PEDIDO]);
  if (url === '/api/users/login') return JSON.parse(body).password === 'buena' ? ok(USUARIO) : ok({ message: 'Credenciales incorrectas' }, 401);
  if (url === '/api/users') return ok({ message: 'Ese email ya está registrado' }, 400);
  throw new Error(`llamada no prevista: ${method} ${url}`);
};

const espera = () => new Promise((r) => setTimeout(r, 15));
const vista = () => porId.vista;
const ir = async (h) => { location.hash = h; oyentes.hashchange(); await espera(); };
const clic = async (el) => { vista().h.click({ target: { closest: (s) => (s === '[data-click]' ? el : null) }, preventDefault() {} }); await espera(); };
const campo = (name, value) => nodo({ name, value, id: `f-${name}`, willValidate: true, validity: { valid: value !== '', valueMissing: value === '' } });
const formulario = (accion, campos) => {
  const elements = Object.assign(campos, Object.fromEntries(campos.map((c) => [c.name, c])));
  return nodo({ tagName: 'FORM', dataset: { submit: accion }, elements });
};
const enviar = async (form) => { vista().h.submit({ target: { closest: (s) => (s === '[data-submit]' ? form : null) }, preventDefault() {} }); await espera(); };

// ---------- 1 · Catálogo y flujo de cuenta ----------
await import('./app.js');
await espera();
assert.match(vista().innerHTML, /class="charola/, 'el catálogo pinta charolas');
assert.equal(vista().dataset.vista, 'catalogo');
assert.ok(!vista().innerHTML.includes('>igual<'), 'una descripción repetida en varios guisos no se muestra');
assert.ok(vista().innerHTML.includes('propia de este guiso'), 'una descripción propia sí se muestra');

await clic(nodo({ tagName: 'BUTTON', dataset: { click: 'add', id: '1', nombre: 'Carne en salsa roja' } }));
assert.equal(location.hash, '#entrar', 'agregar sin sesión lleva a iniciar sesión');
assert.match(vista().innerHTML, /Iniciar sesión/);
assert.match(vista().innerHTML, /href="#registro"/, 'iniciar sesión enlaza a crear cuenta');

// Campo vacío: no se llama a la API y el mensaje va en español junto al campo
let n = llamadas.length;
const vacioPwd = formulario('login', [campo('email', 'p@x.mx'), campo('password', '')]);
await enviar(vacioPwd);
assert.equal(llamadas.length, n, 'con un campo vacío no se llama a la API');
assert.match(vacioPwd.elements.password.despues, /no puede ir vacío/);
assert.equal(vacioPwd.elements.password.attrs['aria-invalid'], 'true');

// Contraseña equivocada: el formulario no se repinta y el error va junto al campo
const pintado = vista().innerHTML;
const mala = formulario('login', [campo('email', 'p@x.mx'), campo('password', 'mala')]);
await enviar(mala);
assert.equal(vista().innerHTML, pintado, 'un error de acceso no vuelve a pintar el formulario (se conserva lo escrito)');
assert.match(mala.elements.password.despues, /no coinciden/);
assert.equal(location.hash, '#entrar');
assert.equal(porId.aviso.hidden, true, 'el error de acceso no sale en la franja de avisos, sino junto al campo');

// Correo repetido al crear cuenta: error junto al correo
await ir('registro');
assert.match(vista().innerHTML, /Crear cuenta/);
const repetido = formulario('registro', [campo('nombre', 'P'), campo('email', 'p@x.mx'), campo('password', 'x')]);
await enviar(repetido);
assert.match(repetido.elements.email.despues, /ya está registrado/);

// Entrar bien: se regresa a donde estaba (el catálogo, porque quería agregar)
await enviar(formulario('login', [campo('email', 'p@x.mx'), campo('password', 'buena')]));
assert.equal(location.hash, '#catalogo', 'después de entrar se regresa a la vista anterior');
assert.equal(JSON.parse(store.tm_sesion).token, 't');
assert.match(porId.nav.innerHTML, /Prueba/, 'la cabecera muestra el nombre');
assert.match(porId.nav.innerHTML, /data-click="logout"/, 'y «Salir»');
assert.equal(porId['nav-carrito-n'].textContent, 2, 'el contador del carrito cuenta las piezas');

// Catálogo con sesión: por precio como el pizarrón, y cada charola con su control
const cat = vista().innerHTML;
assert.ok(cat.indexOf('De $180.00') > 0 && cat.indexOf('De $180.00') < cat.indexOf('De $200.00'), 'los guisos van agrupados por precio, de menor a mayor');
const controlDe = (id) => cat.split(`data-control="${id}">`).at(-1).split('</li>')[0];
assert.match(controlDe('1'), /class="cantidad"[\s\S]*<output[^>]*>2</, 'el guiso que ya va en el carrito muestra el selector con su cantidad');
assert.match(controlDe('3'), /data-click="add"[^>]*>Agregar/, 'el que no va en el carrito muestra «Agregar»');
assert.ok(/Se acabó por hoy/.test(controlDe('2')) && !/<button/.test(controlDe('2')), 'sin existencias no hay botón');

// Agregar uno más y quitar uno desde la charola: la misma llamada de siempre, con la cantidad nueva
n = llamadas.length;
await clic(nodo({ tagName: 'BUTTON', dataset: { click: 'add', id: '1', nombre: 'Carne en salsa roja' } }));
assert.equal(llamadas[n], 'PUT /api/carrito/items/1');
assert.equal(cuerpos[n], '{"cantidad":3}', 'agregar suma uno a lo que ya iba');
await clic(nodo({ tagName: 'BUTTON', dataset: { click: 'menos', id: '1', nombre: 'Carne en salsa roja' } }));
assert.equal(cuerpos[n + 1], '{"cantidad":1}', 'quitar uno resta uno');
assert.equal(llamadas.length, n + 2, 'cambiar la cantidad no vuelve a pedir el catálogo');

// Ficha de un guiso: su dirección, su control y la salida si no existe
assert.match(cat, /href="#guiso\/1"/, 'cada charola enlaza a su ficha');
await ir('guiso/1');
assert.equal(vista().dataset.vista, 'guiso');
assert.match(vista().innerHTML, /<h1>Carne en salsa roja<\/h1>[\s\S]*data-control="1"/, 'la ficha lleva el nombre y el mismo control');
assert.match(document.title, /Carne en salsa roja/);
await ir('guiso/999');
assert.match(vista().innerHTML, /class="vacio"[\s\S]*href="#catalogo"/, 'un guiso que no existe ofrece volver a los guisos');
assert.equal(porId.aviso.hidden, true, 'y no sale como error en la franja');

// ---------- 2 · Cada vista en escritorio: todos sus bloques tienen celda y ninguna se encima ----------
const VACIAS = new Set(['input', 'img', 'br']);
function bloques(html) {
  const out = []; let nivel = 0;
  for (const [, cierre, tag, attrs] of html.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<(\/?)([a-zA-Z0-9]+)((?:\s[^<>]*)?)>/g)) {
    if (cierre) { nivel--; continue; }
    if (nivel === 0) out.push({ tag, cls: (attrs.match(/class="([^"]*)"/)?.[1] || '').split(/\s+/).filter(Boolean) });
    if (!VACIAS.has(tag) && !attrs.trimEnd().endsWith('/')) nivel++; // <rect … /> de los pictogramas se cierra sola
  }
  assert.equal(nivel, 0, 'la vista tiene etiquetas sin cerrar');
  return out;
}
const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
const celdas = (v) => [...css.matchAll(new RegExp(`\\[data-vista="${v}"\\](?::has\\([^)]*\\))? > ([.\\w]+) \\{ grid-area: (\\d+) / (\\d+) / (\\d+) / (\\d+)`, 'g'))]
  .map(([, sel, f1, c1, f2, c2]) => ({ sel, f1: +f1, c1: +c1, f2: +f2, c2: +c2 }));

async function revisarVista(v, esperados) {
  await ir(v);
  assert.equal(vista().dataset.vista, v, `se pintó ${v}`);
  const reglas = celdas(v);
  const puestos = bloques(vista().innerHTML).map((b) => {
    const r = reglas.filter((x) => (x.sel.startsWith('.') ? b.cls.includes(x.sel.slice(1)) : b.tag === x.sel));
    assert.equal(r.length, 1, `${v}: <${b.tag} class="${b.cls.join(' ')}"> debe tener exactamente una celda escrita (tiene ${r.length})`);
    return { b, ...r[0] };
  });
  assert.deepEqual(puestos.map((p) => p.sel), esperados, `${v}: orden de los bloques`);
  for (const [i, a] of puestos.entries()) {
    for (const b of puestos.slice(i + 1)) {
      const seEnciman = a.f1 < b.f2 && b.f1 < a.f2 && a.c1 < b.c2 && b.c1 < a.c2;
      assert.ok(!seEnciman, `${v}: ${a.sel} y ${b.sel} caen en la misma celda`);
    }
  }
  const titulo = puestos.find((p) => p.sel === 'h1');
  for (const p of puestos) if (p !== titulo && p.sel !== '.volver') assert.ok(p.f1 > titulo.f1, `${v}: ${p.sel} debe ir debajo del título`);
}
await revisarVista('carrito', ['.volver', 'h1', '.expira', '.lista', '.total', '.acciones']);
await revisarVista('pedidos', ['.volver', 'h1', '.pedidos', '.otro']);
await revisarVista('admin', ['.volver', 'h1', '.form', 'h2', '.lista']);

// Carrito: sin existencia suficiente se dice en el renglón; quitar se puede deshacer
await ir('carrito');
porId['cant-1'] = nodo({ id: 'cant-1' });
const cambio = async (el) => { vista().h.change({ target: { closest: (s) => (s === '[data-change]' ? el : null) }, preventDefault() {} }); await espera(); };
await cambio(nodo({ value: '9', dataset: { change: 'qty', id: '1' } }));
assert.match(porId['cant-1'].despues, /Solo quedan 5/, 'el 409 va junto a la cantidad de ese guiso');
assert.equal(porId.aviso.hidden, true, 'y no como aviso general');
n = llamadas.length;
await clic(nodo({ tagName: 'BUTTON', dataset: { click: 'remove', id: '1', nombre: 'Carne en salsa roja' } }));
assert.equal(cuerpos[n], '{"cantidad":0}');
assert.match(porId.aviso.textContent, /Quitaste Carne en salsa roja/);
assert.match(porId.aviso.despues, /data-click="deshacer"/, 'el aviso de quitar trae «Deshacer»');
n = llamadas.length;
porId.aviso.h.click({ target: { closest: (s) => (s === '[data-click]' ? nodo({ tagName: 'BUTTON', dataset: { click: 'deshacer' } }) : null) }, preventDefault() {} });
await espera();
assert.equal(cuerpos[n], '{"cantidad":2}', 'deshacer regresa la cantidad que había');

// Mis pedidos: cada pedido se abre en su renglón; el más nuevo llega abierto
await ir('pedidos');
assert.match(vista().innerHTML, /<details open>\s*<summary>\s*<h2>Pedido #/, 'el pedido más nuevo viene abierto');

// Estados vacíos con salida
carritoVacio = true;
await ir('catalogo'); await ir('carrito');
assert.match(vista().innerHTML, /class="vacio"[\s\S]*href="#catalogo"/, 'el carrito vacío ofrece ver guisos');

// Salir desde la cabecera
porId.nav.h.click({ target: { closest: (s) => (s === '[data-click]' ? nodo({ tagName: 'BUTTON', dataset: { click: 'logout' } }) : null) }, preventDefault() {} });
await espera();
assert.equal(store.tm_sesion, undefined, '«Salir» cierra la sesión');
assert.match(porId.nav.innerHTML, /href="#entrar"/);

console.log('app.test: OK (flujo de cuenta y celdas de carrito, pedidos y admin)');
