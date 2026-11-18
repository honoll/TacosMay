// El inicio, sin navegador: node frontend/js/landing.test.mjs
// Qué secciones lleva y en qué orden, que los guisos salgan dos veces y ya (las ollas y «Lo que más sale»),
// que el contenido de muestra esté marcado y listado, las ollas del héroe y su movimiento, y qué guisos
// van en «Lo que más sale».
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const leer = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const html = leer('index.html');
const css = leer('landing.css');
const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));

// ---------- Las secciones, en orden ----------
const secciones = [...main.matchAll(/<section class="([\w-]+)"(?: id="([\w-]+)")?/g)].map((m) => m[2] ?? m[1]);
assert.deepEqual(secciones, ['heroe', 'populares-bloque', 'taqueria', 'como', 'calentar', 'envio', 'preguntas', 'visitanos', 'cierre'],
  'héroe, lo que más sale, la taquería, de la olla a tu casa, cómo calentarlo, el envío, preguntas, dónde está y cierre');

// ---------- Los guisos, dos veces y ya ----------
assert.ok(!/carrusel|pizarron|id="menu"/.test(html), 'sin carrusel, sin «Todas las charolas» y sin pizarrón');
const guisoConFoto = (main.match(/\/media\/guisos\/[\w-]+\.webp"/g) || []).length;
assert.equal(guisoConFoto, 5, 'fotos de guisos solo en las cinco ollas del héroe');
assert.equal((main.match(/id="populares"/g) || []).length, 1, 'y una sola sección de producto');
assert.match(main, /<a class="enl" href="\/tienda\/">Ver todos los guisos<\/a>/, 'que lleva a todos en la tienda');

// ---------- Lo real se queda real ----------
for (const real of ['José María Morelos S/N, Local 3', 'Cierra a las 4 a.&nbsp;m.', 'unos 22 años', 'May es el papá']) assert.ok(main.includes(real), `real: ${real}`);

// ---------- El contenido de muestra: marcado en el HTML y listado en docs ----------
const muestras = (main.match(/data-muestra/g) || []).length;
assert.ok(muestras >= 6, 'cada bloque inventado lleva data-muestra');
const lista = readFileSync(new URL('../../docs/negocio/contenido-de-muestra.md', import.meta.url), 'utf8');
for (const inventado of ['Chayo', 'Toño', 'Lupita', '8–10', 'seis meses', 'te reponemos']) {
  assert.ok(main.includes(inventado), `está en la página: ${inventado}`);
  assert.ok(lista.includes(inventado), `y en contenido-de-muestra.md: ${inventado}`);
}
for (const img of ['banio-maria', 'sellado', 'sirviendo']) {
  assert.ok(main.includes(`/media/ambiente/${img}.webp`), `imagen de ambiente: ${img}`);
  assert.ok(lista.includes(img), `listada como generada: ${img}`);
}
assert.ok(readFileSync(new URL('../media/originales/LEEME.txt', import.meta.url), 'utf8').includes('A3-sirviendo'), 'las imágenes generadas, anotadas en LEEME.txt');
assert.match(leer('proyecto/index.html'), /contenido del inicio es de muestra/, '/proyecto/ lo dice');

// ---------- Las ollas del héroe ----------
const ollas = html.slice(html.indexOf('<div class="ollas"'), html.indexOf('giro-pausa'));
assert.ok(html.indexOf('<h1') < html.indexOf('<div class="ollas"'), 'el titular va antes que las ollas');
const nombres = [...ollas.matchAll(/data-guiso="([^"]+)"/g)].map((m) => m[1]);
assert.ok(nombres.length >= 4 && nombres.length <= 5, 'cuatro o cinco ollas');
const { guisoDe } = await import('./barra.js');
for (const n of nombres) assert.ok(guisoDe(n).foto && ollas.includes(`/media/guisos/${guisoDe(n).slug}.webp`), `${n}: con su foto`);
assert.equal((ollas.match(/fetchpriority="high"/g) || []).length, 1, 'una sola olla con prioridad');
assert.equal((ollas.match(/<img(?![^>]*alt="[^"]+")/g) || []).length, 0, 'cada foto con el nombre del guiso (nombre del enlace)');
assert.match(html, /<button class="btn sec chico giro-pausa" type="button" hidden>Pausar<span class="sr">[^<]+<\/span><\/button>/, 'el giro se puede pausar');
assert.match(css, /\.giro-pausa\[hidden\] \{ display: none; \}/, 'oculto sin JavaScript (display: flex no gana a hidden)');

// ---------- El movimiento: una sola vez, y quieto sin poder pararlo nunca ----------
for (const anim of ['sube', 'crece', 'cae']) assert.match(css, new RegExp(`\\.heroe:not\\(\\.ya-entro\\)[^{]*\\{ animation: ${anim} `), `la entrada «${anim}» del héroe no se repite al volver`);
assert.match(css, /main > section\.entra:not\(\.ya\)/, 'la de cada sección tampoco');
assert.match(css, /\.olla img \{ animation: gira [^}]*animation-play-state: paused; \}/, 'el guiso no gira hasta que lo permite js/ollas.js');
assert.match(css, /\.ollas\.gira \.olla img \{ animation-play-state: running; \}/);
const quieto = css.replace(/@media \(prefers-reduced-motion: no-preference\)[^{]*\{[\s\S]*?\n\}/g, '');
assert.doesNotMatch(quieto, /animation:/, 'toda animación del inicio, solo con movimiento permitido');

// ---------- «Lo que más sale»: el ranking si ya hay ventas; si no, los que más piden en la barra ----------
const { cualesSalen, ESTRELLA } = await import('./salen.js');
const todos = ['Chorizo con huevo', 'Rajas con queso y crema', 'Carne en salsa roja', 'Lengua', 'Mole con pollo'].map((nombre, i) => ({ id: String(i + 1), nombre }));
let r = cualesSalen([{ ...todos[3], vendidos: 2 }], todos);
assert.deepEqual([r.enVivo, r.lista.map((g) => g.nombre)], [false, ESTRELLA], 'sin tres vendidos no se presume ranking');
r = cualesSalen(todos.map((g, i) => ({ ...g, vendidos: 9 - i })), todos);
assert.deepEqual([r.enVivo, r.lista.length], [true, 4], 'con ventas, hasta cuatro, en vivo');

console.log('landing.test: OK (secciones, guisos dos veces, muestra marcada y listada, ollas, movimiento, lo que más sale)');
