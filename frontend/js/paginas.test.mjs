// Pasar de una página a otra sin destello: node frontend/js/paginas.test.mjs
// La landing y la tienda son dos documentos. Lo que evita el destello es que la página nueva llegue
// con la cabecera igual a como se fue y con contenido desde el primer cuadro. Aquí se corren, sin
// navegador, los scripts en línea de cada página en tres casos: ida (con la cabecera de la página
// anterior guardada), entrada directa (sin nada guardado) y vuelta con «atrás» (memoria del navegador).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const leer = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const paginas = ['index.html', 'tienda/index.html', '404.html'];
const html = Object.fromEntries(paginas.map((p) => [p, leer(p)]));
const enLinea = (h) => [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);

// ---------- Lo mismo en las tres páginas ----------
const cabecera = (h) => enLinea(h)[0];
for (const p of paginas) {
  const h = html[p];
  assert.match(h, /<\/header>\n {2}<script>/, `${p}: el script de la cabecera va justo debajo de ella, antes del primer cuadro`);
  assert.equal(cabecera(h), cabecera(html['index.html']), `${p}: el script de la cabecera es el mismo que en la landing`);
  for (const f of ['barlow-condensed-800', 'barlow-condensed-600', 'barlow-400', 'barlow-600']) {
    assert.ok(h.includes(`href="/fuentes/${f}-latin.woff2" as="font"`), `${p}: precarga ${f}`);
  }
  assert.ok(h.indexOf('rel="preload"') < h.indexOf('rel="stylesheet"'), `${p}: las fuentes se piden antes que la hoja de estilos`);
  JSON.parse(h.match(/<script type="speculationrules">([\s\S]*?)<\/script>/)[1]);
}
assert.ok(html['index.html'].includes('<link rel="prefetch" href="/tienda/">'), 'la landing deja lista la tienda');
assert.ok(html['tienda/index.html'].includes('<link rel="prefetch" href="/">'), 'la tienda deja lista la landing');

const css = leer('barra.css');
assert.match(css, /html \{ background: var\(--crema\)/, 'el lienzo es crema, nunca blanco');
assert.equal((css.match(/font-display: fallback/g) || []).length, 4, 'las cuatro fuentes sin brinco de tipografía');
assert.match(css, /\.cabecera \{ view-transition-name: cabecera;/, 'la cabecera tiene nombre propio en la transición');
const sinMovimiento = css.slice(css.lastIndexOf('@media (prefers-reduced-motion: no-preference)'));
assert.ok(sinMovimiento.includes('@view-transition { navigation: auto; }'), 'la transición entre páginas solo con movimiento permitido');

// ---------- Un DOM de juguete para correr los scripts en línea ----------
function pagina(hash, guardado = {}) {
  const nodos = {
    nav: { innerHTML: '<a href="/tienda/#entrar">Entrar</a>' },
    'nav-carrito-n': { textContent: '0' },
    reloj: { textContent: '' },
    vista: { innerHTML: '' },
    esqueleto: { innerHTML: '<h1>Guisos</h1><ul class="barra">huecas</ul>' },
  };
  const caja = (datos) => ({ getItem: (k) => datos[k] ?? null });
  vm.runInNewContext([...enLinea(html['tienda/index.html'])].join('\n'), {
    document: { getElementById: (id) => nodos[id], querySelector: () => nodos.reloj },
    location: { hash },
    sessionStorage: caja(guardado.session || {}),
    localStorage: caja(guardado.local || {}),
    JSON, Math, Date, String,
  });
  return nodos;
}
const ANTES = {
  nav: '<a href="/tienda/#pedidos">Mis pedidos</a><a href="/tienda/#cuenta">Prueba</a><button type="button" class="salir" data-click="logout">Salir</button>',
  n: 3,
  fin: Date.now() + 600_000,
};
const conSesion = { session: { tm_cabecera: JSON.stringify(ANTES) }, local: { tm_sesion: '{"token":"t"}' } };

// Ida: de la landing a «Guisos». La cabecera llega igual y el catálogo, con su esqueleto.
let p = pagina('#catalogo', conSesion);
assert.equal(p.nav.innerHTML, ANTES.nav, 'ida: la cuenta llega pintada como estaba');
assert.equal(p['nav-carrito-n'].textContent, 3, 'ida: el carrito llega con su número');
assert.match(p.reloj.textContent, /^(10:00|09:59)$/, 'ida: y con su reloj');
assert.match(p.vista.innerHTML, /huecas/, 'ida: el catálogo no llega vacío');
assert.match(pagina('', conSesion).vista.innerHTML, /huecas/, '/tienda/ sin # es el catálogo');

// Entrada directa a /tienda/#carrito (enlace pegado, pestaña nueva, recargar sin nada guardado).
p = pagina('#carrito');
assert.match(p.nav.innerHTML, /Entrar/, 'entrada directa: queda la cabecera del HTML');
assert.equal(p.vista.innerHTML, '', 'entrada directa a otra vista: sin esqueleto de catálogo que luego cambie');
assert.equal(pagina('#guiso/2').vista.innerHTML, '', 'ni en la ficha');

// Cerró sesión en otra pestaña: lo guardado no se usa.
p = pagina('#catalogo', { session: conSesion.session, local: {} });
assert.match(p.nav.innerHTML, /Entrar/, 'sin sesión no se pinta la cuenta guardada');

// Un carrito ya vencido no pone reloj.
p = pagina('#catalogo', { ...conSesion, session: { tm_cabecera: JSON.stringify({ ...ANTES, fin: Date.now() - 1 }) } });
assert.equal(p.reloj.textContent, '', 'carrito vencido: sin reloj');

// ---------- Lo que se guarda para la página siguiente (cabecera.js) ----------
const guardado = {};
const dom = { nav: { innerHTML: '<a href="#pedidos" aria-current="page">Mis pedidos</a>' }, 'nav-carrito-n': {}, 'nav-carrito': { setAttribute() {}, removeAttribute() {} } };
Object.assign(globalThis, {
  document: { getElementById: (id) => dom[id] },
  sessionStorage: { setItem: (k, v) => { guardado[k] = v; } },
  localStorage: { getItem: () => null },
});
const { pintarCarrito } = await import('./cabecera.js');
pintarCarrito(2, { base: '', actual: 'pedidos', fin: 123 });
assert.deepEqual(JSON.parse(guardado.tm_cabecera), { nav: '<a href="/tienda/#pedidos">Mis pedidos</a>', n: 2, fin: 123 },
  'se guarda con enlaces que sirven desde cualquier página y sin «aquí estás»');

// La vuelta con «atrás» (la página sale de la memoria del navegador) la cubre app.test: se pone al día.
console.log('paginas.test: OK (ida, entrada directa y lo que se guarda para la siguiente página)');
