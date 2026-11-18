// La navegación es un solo sistema: node frontend/js/nav.test.mjs
// La cabecera y el pie están escritos en cuatro páginas (no hay build); aquí se comprueba que sean
// idénticos, que lleven al inicio y a la tienda, y que no enlacen el material interno de /marca/.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const raiz = new URL('../', import.meta.url);
const paginas = ['index.html', 'tienda/index.html', '404.html', 'domicilio/index.html', 'proyecto/index.html'];
const bloque = (html, ini, fin) => {
  const a = html.indexOf(ini);
  const b = html.indexOf(fin, a);
  assert.ok(a >= 0 && b > a, `falta ${ini}`);
  return html.slice(a, b + fin.length).replace(/\s+/g, ' ');
};

const [cabeceras, pies] = [['<header class="cabecera caja">', '</header>'], ['<footer class="pie">', '</footer>']]
  .map(([ini, fin]) => paginas.map((p) => bloque(readFileSync(new URL(p, raiz), 'utf8'), ini, fin)));

for (const [nombre, bloques] of [['cabecera', cabeceras], ['pie', pies]]) {
  for (let i = 1; i < bloques.length; i++) assert.equal(bloques[i], bloques[0], `la ${nombre} de ${paginas[i]} no es igual a la de ${paginas[0]}`);
  for (const destino of ['href="/"', 'href="/tienda/#catalogo"', 'href="/tienda/#carrito"', 'href="/tienda/#entrar"']) {
    assert.ok(bloques[0].includes(destino), `la ${nombre} no enlaza ${destino}`);
  }
  assert.ok(!bloques[0].includes('/marca/"') && !/href="\/marca\/[^l]/.test(bloques[0]), `la ${nombre} enlaza material interno de /marca/`);
  // Rutas absolutas: el mismo bloque tiene que servir desde /, /tienda/ y cualquier dirección que no exista.
  assert.ok(!/(?:href|src)="(?!\/|https?:|#)/.test(bloques[0]), `la ${nombre} tiene una ruta relativa`);
}
// Textos aprobados (docs/diseno/textos.md): la cabecera ya no lleva «Cómo funciona» ni «La taquería» (siguen en
// el pie) y el carrito es un ícono con su número, su reloj y su nombre para lector («Carrito, 3 guisos»).
assert.ok(!cabeceras[0].includes('href="/#como"') && !cabeceras[0].includes('href="/#taqueria"'), 'la cabecera no lleva «Cómo funciona» ni «La taquería»');
assert.ok(pies[0].includes('href="/#como"') && pies[0].includes('href="/#taqueria"'), 'siguen en el pie');
// Tacos a domicilio (prueba): en el pie, no en la navegación principal.
assert.ok(pies[0].includes('href="/domicilio/"') && !cabeceras[0].includes('/domicilio/'), 'domicilio va en el pie y no en la cabecera');
// El proyecto escolar (para el profesor): discreto, en el pie y no en la cabecera.
assert.ok(pies[0].includes('<a href="/proyecto/">Proyecto escolar</a>') && !cabeceras[0].includes('/proyecto/'), 'proyecto escolar va en el pie y no en la cabecera');
assert.match(cabeceras[0], /id="nav-carrito"[^>]*><svg class="picto"[^>]*aria-hidden="true">[\s\S]*?<\/svg><span class="sr">Carrito, <\/span><b id="nav-carrito-n">0<\/b><span class="sr"> guisos<\/span>/, 'el carrito: ícono, número y nombre para lector');
// W2: con sesión, «Pedidos» con su caja y la cuenta con el ícono de persona; el nombre completo, para lector.
// En celular la cuenta es solo el ícono y «Salir» queda en «Tu cuenta», para que la fila quepa a 375 px.
const { cuenta } = await import('./cabecera.js');
const conSesion = cuenta({ nombre: 'Maximiliano Hernández' });
assert.match(conSesion, /<svg class="picto"[^>]*aria-hidden="true">[\s\S]*?<\/svg>Pedidos<\/a>/, '«Pedidos» con su caja');
assert.match(conSesion, /class="persona" aria-label="Tu cuenta: Maximiliano Hernández">/, 'la cuenta lleva el nombre completo para lector');
assert.match(conSesion, /<span class="nombre">Maximiliano…<\/span>/, 'y a la vista, recortado a 12 caracteres');
assert.match(cuenta(null), />Entrar<\/a>$/, 'sin sesión, «Entrar»');
const barra = readFileSync(new URL('barra.css', raiz), 'utf8');
const celular = barra.slice(barra.indexOf('@media (max-width: 899px)'));
assert.ok(/\.cabecera nav a\.persona \.nombre \{ display: none; \}/.test(celular) && /\.cabecera nav \.salir \{ display: none; \}/.test(celular), 'en celular: solo el ícono de la cuenta y sin «Salir»');
assert.match(barra, /\.cabecera nav a\.persona \{ min-width: 44px;/, 'el ícono de la cuenta mide al menos 44 px');
console.log('nav.test: OK (cabecera y pie iguales en 5 páginas, carrito con ícono, cuenta que cabe en celular)');
