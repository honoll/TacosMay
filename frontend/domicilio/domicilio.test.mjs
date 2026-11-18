// Tacos a domicilio, sin navegador: node frontend/domicilio/domicilio.test.mjs
// El flujo completo contra el reparto simulado, con un reloj de juguete: armar, cotizar, fuera de cobertura,
// cerrado y error, confirmar, seguimiento hasta entregado, repetir, y que una recarga no pierda el pedido.
import assert from 'node:assert/strict';

const { MENU, pedidoDe, MAX_POR_GUISO } = await import('./menu.js');
const sim = await import('./reparto-simulado.js');
const reparto = await import('./reparto.js');
const { flujo } = await import('./flujo.js');

let ahora = 1_000_000;
sim.usarReloj(() => ahora);
const almacen = (() => { const d = {}; return { getItem: (k) => d[k] ?? null, setItem: (k, v) => { d[k] = v; } }; })();
const CENTRO = { calle: 'Calle de ejemplo 12', colonia: 'Centro', referencias: 'Portón negro', nombre: 'Cliente de prueba', telefono: '6240000000' };

// ---------- El menú: los catorce del pizarrón con su precio de barra ----------
assert.equal(MENU.length, 14);
assert.equal(MENU.find((g) => g.nombre === 'Lengua').precio_centavos, 6000);
assert.equal(MENU.find((g) => g.nombre === 'Carne en salsa roja').precio_centavos, 4500);
assert.deepEqual(pedidoDe({}), { items: [], piezas: 0, subtotal_centavos: 0 });

// ---------- Armar ----------
const f = flujo(reparto, almacen);
assert.equal(f.estado.paso, 'pedido');
f.ir('destino');
assert.equal(f.estado.paso, 'pedido', 'sin tacos no se pasa a la dirección');
const carne = MENU.find((g) => g.nombre === 'Carne en salsa roja').id;
const lengua = MENU.find((g) => g.nombre === 'Lengua').id;
f.cambiar(carne, 1); f.cambiar(carne, 1); f.cambiar(lengua, 1);
assert.deepEqual([f.pedido().piezas, f.pedido().subtotal_centavos], [3, 4500 * 2 + 6000], 'tres tacos al precio de la barra');
f.cambiar(lengua, -1);
assert.equal(f.pedido().piezas, 2, 'menos quita uno');
for (let i = 0; i < 30; i++) f.cambiar(carne, 1);
assert.equal(f.estado.cantidades[carne], MAX_POR_GUISO, 'con tope por guiso');
f.cambiar(carne, -(MAX_POR_GUISO - 2));

// ---------- Fuera de cobertura, cerrado y error: dicen qué pasa y no avanzan ----------
f.ir('destino');
assert.equal(f.estado.paso, 'destino');
let r = await f.cotizar({ ...CENTRO, colonia: 'Otra colonia' });
assert.deepEqual([r.ok, r.motivo, f.estado.paso], [false, 'fuera_de_cobertura', 'destino'], 'fuera de cobertura se queda en la dirección');
sim.configurar({ cerrado: true });
r = await f.cotizar(CENTRO);
assert.equal(r.motivo, 'cerrado');
assert.equal(reparto.abierto(), false);
sim.configurar({ cerrado: false, falla: true });
r = await f.cotizar(CENTRO);
assert.equal(r.motivo, 'error');
sim.configurar({ falla: false });

// ---------- Cotizar: el envío lo pone el reparto; los tacos, el precio de la barra ----------
r = await f.cotizar(CENTRO);
assert.ok(r.ok && r.envio_centavos === 3000 && f.estado.paso === 'confirmar', 'cotizado, pasa a confirmar');
assert.equal(f.total(), 9000 + 3000, 'total = tacos + envío');

// ---------- Confirmar: solo «al recibir»; «en línea» está por conectar ----------
await assert.rejects(f.confirmar('en_linea'), /por conectar/);
const entrega = await f.confirmar('al_recibir');
assert.match(entrega.entregaId, /^sim-/);
assert.equal(f.estado.paso, 'seguimiento');
f.cambiar(carne, 1);
assert.equal(f.pedido().piezas, 2, 'con la entrega en curso, el pedido ya no cambia');

// ---------- Seguimiento: avanza solo hasta entregado ----------
const vistos = [];
for (let t = 0; t <= 21000; t += 1000) {
  ahora = entrega.creada + t;
  const e = await f.seguir();
  if (vistos.at(-1) !== e.paso) vistos.push(e.paso);
}
assert.deepEqual(vistos, ['recibido', 'preparando', 'asignado', 'en_camino', 'entregado'], 'los cinco pasos, en orden');
const final = await f.seguir();
assert.deepEqual(final.repartidor, { alias: 'Repartidor de prueba', vehiculo: 'moto' }, 'un repartidor de prueba, sin nombre real');

// ---------- Una recarga no pierde la entrega ----------
const otra = flujo(reparto, almacen);
assert.equal(otra.estado.paso, 'seguimiento');
assert.equal(otra.estado.entrega.entregaId, entrega.entregaId);

// ---------- Repetir desde cero ----------
await otra.repetir();
assert.deepEqual([otra.estado.paso, otra.pedido().piezas, otra.estado.entrega], ['pedido', 0, null]);
assert.equal((await reparto.estado(entrega.entregaId)).paso, 'cancelado', 'la entrega de la demostración anterior se cancela');
assert.equal(flujo(reparto, almacen).estado.paso, 'pedido', 'y así queda guardado');

// ---------- La página dice lo que es ----------
const { readFileSync } = await import('node:fs');
const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
assert.match(html, /Versión de prueba:<\/strong> no se cobra ni se envía nada/, 'el aviso de prueba, a la vista');
assert.match(html, /Precios de ejemplo/, 'los precios dicen que son de ejemplo');
assert.match(html, /value="en_linea" disabled> En línea <span>por conectar<\/span>/, '«en línea», por conectar');
assert.ok(!/\d+\s?%|comisi/i.test(html.replace(/href="[^"]*"/g, '')), 'sin cifras de comisión ni comparaciones');
for (const svg of html.match(/<svg[\s\S]*?<\/svg>/g)) assert.ok(!/<(circle|path|rect)\b[^>]*[^/]>/.test(svg), `SVG con elementos sin cerrar: ${svg.slice(0, 60)}`);

console.log('domicilio.test: OK (armar, cotizar, fuera de cobertura, cerrado, error, confirmar, seguimiento, repetir)');
