// La navegación es un solo sistema: node frontend/js/nav.test.mjs
// La cabecera y el pie están escritos en tres páginas (no hay build); aquí se comprueba que sean
// idénticos, que lleven al inicio y a la tienda, y que no enlacen el material interno de /marca/.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const raiz = new URL('../', import.meta.url);
const paginas = ['index.html', 'tienda/index.html', '404.html'];
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
console.log('nav.test: OK (cabecera y pie iguales en 3 páginas)');
