// La barra que gira del héroe: node frontend/js/carrusel.test.mjs
// Corre js/carrusel.js con un DOM de juguete: copias ocultas a lectores y al teclado, que gire y dé la
// vuelta sin salto, que se detenga con su botón, el cursor, el foco, fuera de la vista y con la pestaña
// oculta, y que con movimiento reducido no gire. Y en el HTML y el CSS: el botón, y nada que gire sin JS.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const leer = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

// ---------- HTML y CSS ----------
const html = leer('index.html');
const heroe = html.slice(html.indexOf('<div class="carrusel"'), html.indexOf('</section>', html.indexOf('<div class="carrusel"')));
assert.match(heroe, /<ul class="carrusel-fila" tabindex="0" aria-label="[^"]+">/, 'la fila se alcanza con el teclado y tiene nombre');
assert.match(heroe, /<button class="[^"]*carrusel-pausa" type="button" hidden>Pausar<span class="sr">[^<]+<\/span><\/button>/, 'hay botón de pausa (oculto hasta que gira)');
assert.equal((heroe.match(/<li class="charola"/g) || []).length, 3, 'sin datos ni JavaScript, las tres charolas de siempre');
assert.equal((heroe.match(/fetchpriority="high"/g) || []).length, 1, 'la primera foto, con prioridad');
// Las ollas del héroe: después del titular en el HTML (se lee primero), cada una a un guiso con foto, y
// solo la grande con prioridad (las chicas no compiten por la primera pintura).
const ollas = html.slice(html.indexOf('<div class="ollas"'), html.indexOf('<div class="carrusel"'));
assert.ok(html.indexOf('<h1') < html.indexOf('<div class="ollas"'), 'el titular va antes que las ollas');
const nombres = [...ollas.matchAll(/data-guiso="([^"]+)"/g)].map((m) => m[1]);
assert.ok(nombres.length >= 4 && nombres.length <= 5, 'cuatro o cinco ollas');
const { guisoDe } = await import('./barra.js');
for (const n of nombres) assert.ok(guisoDe(n).foto && ollas.includes(`/media/guisos/${guisoDe(n).slug}.webp`), `${n}: con su foto`);
assert.equal((ollas.match(/fetchpriority="high"/g) || []).length, 1, 'una sola olla con prioridad');
assert.equal((ollas.match(/<img(?![^>]*alt="[^"]+")/g) || []).length, 0, 'cada foto con el nombre del guiso (nombre del enlace)');
const css = leer('landing.css');
assert.match(css, /\.carrusel-pausa\[hidden\] \{ display: none; \}/, 'el botón oculto no se muestra (display: flex no gana a hidden)');
assert.doesNotMatch(css, /carrusel[^{]*\{[^}]*animation/, 'el giro no es una animación CSS: lo lleva carrusel.js, que respeta el movimiento reducido');

// ---------- DOM de juguete ----------
let cuadros = new Map();
let siguiente = 1;
let reloj = 0;
let reducido = false;
let observador;
const oyentesDoc = {};
Object.assign(globalThis, {
  matchMedia: () => ({ matches: reducido }),
  requestAnimationFrame: (fn) => { const id = siguiente++; cuadros.set(id, fn); return id; },
  cancelAnimationFrame: (id) => { cuadros.delete(id); },
  performance: { now: () => reloj },
  IntersectionObserver: class { constructor(fn) { observador = fn; } observe() {} },
  document: { hidden: false, addEventListener: (t, fn) => { oyentesDoc[t] = fn; } },
  addEventListener() {},
});
const avanzar = (ms) => { reloj += ms; const fns = [...cuadros.values()]; cuadros = new Map(); for (const fn of fns) fn(reloj); };

const ANCHO = 300; // cada charola mide 300 con su separación
function armar() {
  const h = {};
  const oye = (obj) => Object.assign(obj, { h: {}, addEventListener(t, fn) { this.h[t] = fn; } });
  const charola = (n, copia = false) => oye({
    n, copia, attrs: {}, inert: false,
    setAttribute(k, v) { this.attrs[k] = v; },
    cloneNode() { return charola(n, true); },
    remove() { fila.hijos.splice(fila.hijos.indexOf(this), 1); },
    get offsetLeft() { return fila.hijos.indexOf(this) * ANCHO; },
  });
  const fila = oye({
    hijos: [charola('chorizo'), charola('rajas'), charola('carne')],
    scrollLeft: 0, clientWidth: 375,
    get children() { return this.hijos.filter((c) => !c.attrs['data-copia']); },
    get scrollWidth() { return this.hijos.length * ANCHO; },
    append(c) { this.hijos.push(c); },
    querySelector(sel) { return sel === '[data-copia]' ? this.hijos.find((c) => c.attrs['data-copia'] !== undefined) : null; },
    querySelectorAll(sel) { return sel === '[data-copia]' ? this.hijos.filter((c) => c.attrs['data-copia'] !== undefined) : []; },
  });
  const boton = oye({ hidden: true, firstChild: { textContent: 'Pausar' } });
  const clases = new Set();
  const raiz = oye({
    classList: { toggle: (c, si) => (si ? clases.add(c) : clases.delete(c)) },
    querySelector: (sel) => (sel === '.carrusel-fila' ? fila : boton),
    contains: () => false,
  });
  return { raiz, fila, boton, clases, h };
}
const { carrusel } = await import('./carrusel.js');

// ---------- Gira, da la vuelta, y las copias no se leen ni se alcanzan ----------
const { raiz, fila, boton } = armar();
const giro = carrusel(raiz);
observador([{ isIntersecting: true }]);
const copias = fila.hijos.filter((c) => c.copia);
assert.ok(copias.length >= 3, 'hay copias para el empalme');
assert.ok(copias.every((c) => c.attrs['aria-hidden'] === 'true' && c.inert && c.attrs['data-copia'] === ''), 'las copias, ocultas a lectores de pantalla y fuera del teclado');
assert.ok(fila.scrollWidth >= fila.clientWidth + 900, 'copias suficientes para que la pantalla siga llena al dar la vuelta');
assert.equal(boton.hidden, false, 'el botón de pausa se ve');
assert.ok(giro.girando, 'gira sola');
avanzar(16);
for (let i = 0; i < 60; i++) avanzar(100);
assert.ok(fila.scrollLeft > 100 && fila.scrollLeft < 900, `avanza despacio (${Math.round(fila.scrollLeft)} px en 6 s)`);
for (let i = 0; i < 400; i++) avanzar(100);
assert.ok(fila.scrollLeft >= 0 && fila.scrollLeft < 900, 'al pasar una vuelta regresa al principio, sin salto (lo de enfrente es igual)');

// ---------- Se detiene ----------
boton.h.click();
assert.equal(giro.girando, false, 'el botón la detiene');
assert.equal(boton.firstChild.textContent, 'Reanudar', 'y dice que ahora reanuda');
const quieta = fila.scrollLeft;
avanzar(1000);
assert.equal(fila.scrollLeft, quieta, 'detenida no se mueve');
boton.h.click();
assert.ok(giro.girando, 'y la reanuda');
raiz.h.pointerenter({ pointerType: 'mouse' });
assert.equal(giro.girando, false, 'con el cursor encima se detiene');
raiz.h.pointerleave({ pointerType: 'mouse' });
assert.ok(giro.girando, 'y sigue al salir');
raiz.h.focusin();
assert.equal(giro.girando, false, 'con el foco del teclado dentro se detiene');
raiz.h.focusout({ relatedTarget: null });
assert.ok(giro.girando);
observador([{ isIntersecting: false }]);
assert.equal(giro.girando, false, 'fuera de la vista no gira');
observador([{ isIntersecting: true }]);
document.hidden = true;
oyentesDoc.visibilitychange();
assert.equal(giro.girando, false, 'con la pestaña oculta no gira');
document.hidden = false;
oyentesDoc.visibilitychange();
assert.ok(giro.girando);

// ---------- A mano: al tocarla se detiene y vuelve a girar un rato después ----------
fila.scrollLeft += 200;
fila.h.scroll();
assert.equal(giro.girando, false, 'la mano la mueve: se detiene');
await new Promise((r) => setTimeout(r, 1600));
assert.ok(giro.girando, 'y al soltarla vuelve a girar');

// ---------- Con los datos: sin copias mientras cambian, y luego se rehacen ----------
giro.rehacer((f) => {
  assert.equal(f.querySelectorAll('[data-copia]').length, 0, 'sin copias mientras se agregan charolas');
});
assert.ok(fila.querySelectorAll('[data-copia]').length >= 3, 'y se vuelven a hacer');

// ---------- Movimiento reducido: no gira, se desliza a mano ----------
reducido = true;
const quieto = armar();
const giro2 = carrusel(quieto.raiz);
observador([{ isIntersecting: true }]);
assert.equal(giro2.girando, false, 'con movimiento reducido no gira');
assert.equal(quieto.fila.hijos.filter((c) => c.copia).length, 0, 'ni hace copias');
assert.equal(quieto.boton.hidden, true, 'ni muestra el botón');
assert.ok(quieto.clases.has('quieto'), 'queda como fila que se desliza a mano (con imán)');

console.log('carrusel.test: OK (copias ocultas, giro y vuelta, pausas, a mano y movimiento reducido)');
