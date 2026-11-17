// Comprobación de los SVG del logotipo: node frontend/marca/logo/svg.test.mjs
// Un SVG cargado con <img> debe ser XML válido o el navegador no lo pinta (los rasterizadores sí
// lo toleran, por eso verlos convertidos a imagen no basta). Aquí: atributos sin repetir y etiquetas
// bien cerradas, en cada archivo de esta carpeta.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

const dir = new URL('.', import.meta.url);
const archivos = readdirSync(dir).filter((f) => f.endsWith('.svg'));
assert.ok(archivos.length > 0, 'no hay archivos SVG');

for (const f of archivos) {
  const src = readFileSync(new URL(f, dir), 'utf8');
  assert.match(src, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/, `${f}: no empieza con <svg xmlns>`);
  const pila = [];
  for (const [tag, cierre, nombre, attrs, vacia] of src.matchAll(/<(\/?)([a-zA-Z][\w-]*)((?:\s+[\w:-]+="[^"<]*")*)\s*(\/?)>/g)) {
    const vistos = new Set();
    for (const [, a] of attrs.matchAll(/\s([\w:-]+)=/g)) {
      assert.ok(!vistos.has(a), `${f}: atributo «${a}» repetido en ${tag.slice(0, 60)}`);
      vistos.add(a);
    }
    if (cierre) assert.equal(pila.pop(), nombre, `${f}: </${nombre}> no cierra lo que abrió`);
    else if (!vacia) pila.push(nombre);
  }
  assert.deepEqual(pila, [], `${f}: quedaron etiquetas sin cerrar`);
  // Nada fuera de las etiquetas reconocidas: si la expresión no casó algo, hay XML que no entendemos.
  const resto = src.replace(/<(\/?)([a-zA-Z][\w-]*)((?:\s+[\w:-]+="[^"<]*")*)\s*(\/?)>/g, '').replace(/[^<>]/g, '');
  assert.equal(resto, '', `${f}: hay etiquetas mal formadas`);
}
console.log(`svg.test: OK (${archivos.length} archivos)`);
