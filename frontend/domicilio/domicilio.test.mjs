// Tacos a domicilio, sin navegador: node frontend/domicilio/domicilio.test.mjs
// El flujo completo contra el reparto simulado, con un reloj de juguete, en el orden del flujo de referencia:
// cómo lo quieres y dónde, menú y detalle, tu orden, pagar, confirmación con número, seguimiento, cancelar,
// recoger en la barra, historial y que una recarga no pierda nada.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const { MENU, SECCIONES, pedidoDe, MAX_POR_GUISO, MAX_NOTA, grupos, usarGrupos, ajustar } = await import('./menu.js');
const sim = await import('./reparto-simulado.js');
const reparto = await import('./reparto.js');
const barra = await import('./sucursales.js');
const { flujo, PROPINAS } = await import('./flujo.js');

let ahora = 1_000_000;
sim.usarReloj(() => ahora);
const reloj = () => ahora;
const almacen = (() => { const d = {}; return { getItem: (k) => d[k] ?? null, setItem: (k, v) => { d[k] = v; } }; })();
const CENTRO = { calle: 'Calle de ejemplo 12', colonia: 'Centro', referencias: 'Portón negro' };
const CONTACTO = { nombre: 'Cliente de prueba', telefono: '6240000000', correo: '' };

// ---------- El menú: los catorce del pizarrón, por secciones de precio ----------
assert.equal(MENU.length, 14);
assert.deepEqual(SECCIONES.map((x) => [x.precio_centavos, x.guisos.length]), [[4000, 8], [4500, 5], [6000, 1]], 'tres secciones, como el pizarrón');
assert.deepEqual(pedidoDe({}), { items: [], piezas: 0, subtotal_centavos: 0 });
const carne = MENU.find((g) => g.nombre === 'Carne en salsa roja').id;
const lengua = MENU.find((g) => g.nombre === 'Lengua').id;

// ---------- 0 · Como en Orinoco: el menú primero; la entrega se pide antes de pagar ----------
const f = flujo(reparto, almacen, reloj);
assert.equal(f.estado.vista, 'menu', 'se llega al menú, sin elegir antes cómo');
f.poner(carne, 1);
assert.equal(f.pedido().piezas, 1, 'se llena la orden sin haber elegido entrega');
f.ir('pagar');
assert.equal(f.estado.vista, 'menu', 'pero sin entrega no se paga');
f.ir('modo');
assert.equal(f.estado.vista, 'modo');
f.quitar(carne);

// ---------- Opciones del taco (grupos con tope y obligatorios), con grupos de prueba ----------
// Los reales están PENDIENTE-CLIENTE: en la página no hay ninguno.
assert.deepEqual(grupos(), [], 'sin datos de la taquería, ningún grupo de opciones');
usarGrupos([
  { id: 'g1', nombre: 'Grupo de prueba con tope', min: 0, max: 2, opciones: [{ id: 'a', nombre: 'A' }, { id: 'b', nombre: 'B' }, { id: 'c', nombre: 'C', precio_centavos: 500 }] },
  { id: 'g2', nombre: 'Grupo obligatorio de prueba', min: 1, max: 1, opciones: [{ id: 'x', nombre: 'X' }, { id: 'y', nombre: 'Y' }] },
]);
let aj = ajustar({ g1: ['a', 'b', 'c', 'a', 'zz'] });
assert.deepEqual([aj.opciones.g1, aj.completos, aj.faltan], [['a', 'b'], ['g1'], ['g2']], 'tope del grupo, sin repetir ni inventar opciones; «completo» y lo obligatorio que falta');
assert.deepEqual(f.poner(lengua, 1, '', { g1: ['a'] }), { ok: false, faltan: ['g2'] }, 'sin la obligatoria no entra');
assert.deepEqual(f.poner(lengua, 2, '', { g1: ['c'], g2: ['y', 'x'] }), { ok: true });
let item = f.pedido().items[0];
assert.deepEqual([item.precio_centavos, item.opciones], [6000 + 500, ['C', 'Y']], 'la opción con costo suma al taco; la orden dice cuáles lleva');
f.quitar(lengua);
usarGrupos([]);

// ---------- 1 · Entrega: cómo lo quieres y dónde ----------
f.elegirModo('domicilio');
let r = await f.cotizar({ ...CENTRO, colonia: 'Otra colonia' });
assert.deepEqual([r.ok, f.estado.problema], [false, 'fuera_de_cobertura'], 'fuera de cobertura lo dice');
barra.demostrarCerrada(true);
r = await f.cotizar(CENTRO);
assert.equal(f.estado.problema, 'cerrado', 'con la barra cerrada no se cotiza');
barra.demostrarCerrada(false);
sim.configurar({ falla: true });
await f.cotizar(CENTRO);
assert.equal(f.estado.problema, 'error');
sim.configurar({ falla: false });
r = await f.cotizar(CENTRO);
assert.ok(r.ok && r.envio_centavos === 3000 && r.vence === ahora + sim.VIGENCIA, 'cotización con su vigencia');
assert.equal(f.estado.sucursal, 'centro', 'la barra del centro lo prepara');
f.ir('menu');
assert.equal(f.estado.vista, 'menu');
assert.equal(f.cuentas().total, 0, 'sin tacos el total es cero aunque ya haya envío');

// ---------- 2 · Detalle del taco: cantidad y nota para la cocina ----------
f.poner(carne, 2, '  Sin cebolla  ');
f.poner(lengua, 1);
assert.deepEqual(f.pedido().items.map((i) => [i.nombre, i.cantidad, i.nota]), [['Carne en salsa roja', 2, 'Sin cebolla'], ['Lengua', 1, '']]);
f.poner(lengua, 999, 'x'.repeat(500));
assert.deepEqual([f.estado.cantidades[lengua], f.estado.notas[lengua].length], [MAX_POR_GUISO, MAX_NOTA], 'con tope de cantidad y de nota');
f.poner(lengua, 1, '');

// ---------- 3 · Tu orden: editable; envío, cuota «por definir», propina y total ----------
f.ir('orden');
f.cambiar(carne, 1); f.cambiar(carne, -1);
f.quitar(lengua);
assert.equal(f.pedido().piezas, 2, 'quitar un renglón');
f.poner(lengua, 1);
f.propina(15);
f.propina(7);
assert.equal(f.estado.propina_pct, 15, 'solo las propinas que ofrece la página');
assert.ok(PROPINAS.includes(0), 'y se puede no dejar propina');
let c = f.cuentas();
assert.deepEqual([c.subtotal, c.envio, c.cuota, c.propina, c.total], [15000, 3000, null, 2250, 15000 + 3000 + 2250], 'tacos + envío + propina; la cuota no suma');

// ---------- 4 · Pagar: invitado, «al recibir»; en línea y programado, por conectar ----------
f.ir('pagar');
assert.equal(f.estado.vista, 'pagar');
await assert.rejects(f.confirmar({ contacto: CONTACTO, pago: 'en_linea' }), /por conectar/);
await assert.rejects(f.confirmar({ contacto: CONTACTO, horario: 'programado' }), /por conectar/);
await assert.rejects(f.confirmar({ contacto: { ...CONTACTO, telefono: '123' } }), /10 dígitos/);
// La cotización venció y el envío no cambió: se vuelve a cotizar sola y el pedido sale.
ahora += sim.VIGENCIA + 1;
r = await f.confirmar({ contacto: CONTACTO });
assert.ok(r.ok && /^TM-\d{5}$/.test(r.numero), 'confirmación con número de pedido');
assert.equal(f.estado.vista, 'seguimiento');
const numero = r.numero;
f.poner(carne, 5);
assert.equal(f.pedido().piezas, 3, 'con el pedido en curso, la orden ya no cambia');
f.ir('menu');
assert.equal(f.estado.vista, 'seguimiento', 'ni se sale del seguimiento');
// Mismo número de pedido → la misma entrega (reintentar no crea dos).
const dos = await reparto.crearEntrega({ pedidoId: numero, cotizacion: f.estado.cotizacion, destino: CENTRO, contacto: CONTACTO, items: f.pedido().items });
assert.equal(dos.entregaId, f.estado.pedido.entregaId);

// ---------- 5 · Seguimiento: avanza solo, con hora estimada; cancelar solo al principio ----------
const creada = f.estado.pedido.creado;
let e = await f.seguir();
assert.deepEqual([e.paso, e.cancelable, typeof e.llega], ['recibido', true, 'number']);
const vistos = [];
for (let t = 0; t <= 21000; t += 1000) {
  ahora = creada + t;
  e = await f.seguir();
  if (vistos.at(-1) !== e.paso) vistos.push(e.paso);
  if (e.paso === 'preparando') assert.deepEqual(await f.cancelar(), { ok: false, motivo: 'ya_empezo' }, 'con la cocina trabajando ya no se cancela');
}
assert.deepEqual(vistos, ['recibido', 'preparando', 'asignado', 'en_camino', 'entregado'], 'los cinco pasos, en orden');
assert.deepEqual(e.repartidor, { alias: 'Repartidor de prueba', vehiculo: 'moto' }, 'un repartidor de prueba, sin nombre real');
assert.equal(f.pedidos[0].estado, 'entregado', 'el historial guarda cómo terminó');
assert.equal(flujo(reparto, almacen, reloj).estado.pedido.numero, numero, 'una recarga no pierde el pedido');

// ---------- Otro pedido: recoger en la barra, y cancelarlo a tiempo ----------
f.nuevo();
assert.deepEqual([f.estado.vista, f.pedido().piezas, f.estado.contacto.nombre], ['menu', 0, 'Cliente de prueba'], 'otro pedido conserva dirección y contacto');
f.elegirModo('recoger');
assert.equal(f.entregaLista(), false, 'al cambiar a recoger hay que elegir barra');
f.elegirSucursal('centro');
f.poner(carne, 1);
f.ir('pagar');
r = await f.confirmar({ contacto: CONTACTO });
assert.ok(r.ok);
c = f.estado.pedido.cuentas;
assert.deepEqual([c.envio, c.total], [0, 4500], 'recoger no lleva envío (y otro pedido empieza sin propina)');
assert.deepEqual(await f.cancelar(), { ok: true }, 'recién pedido sí se cancela');
assert.equal((await f.seguir()).paso, 'cancelado');
assert.equal(f.pedidos[0].estado, 'cancelado');

// Recoger hasta el final: listo → «ya lo recogí».
f.nuevo();
f.poner(lengua, 2);
f.ir('pagar');
await f.confirmar({ contacto: CONTACTO });
ahora = f.estado.pedido.creado + 11000;
assert.equal((await f.seguir()).paso, 'listo');
await f.recogido();
assert.equal((await f.seguir()).paso, 'entregado');

// ---------- Historial: repetir un pedido anterior ----------
assert.equal(f.pedidos.length, 3);
f.repetir(numero);
assert.deepEqual([f.estado.vista, f.pedido().piezas, f.estado.notas[carne]], ['orden', 3, 'Sin cebolla'], 'repetir arma la misma orden');
await f.reiniciar();
assert.deepEqual([f.estado.vista, f.pedidos.length], ['menu', 0], 'reiniciar la demostración borra todo');

// ---------- La página dice lo que es ----------
const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
assert.match(html, /Versión de prueba:<\/strong> no se cobra ni se envía nada/, 'el aviso de prueba, a la vista');
assert.match(html, /Precios de ejemplo/, 'los precios dicen que son de ejemplo');
assert.match(html, /value="en_linea" disabled>[^<]*<span[^>]*>por conectar<\/span>/, '«en línea», por conectar');
assert.match(html, /Cuota de servicio<\/dt><dd[^>]*>por definir<\/dd>/, 'la cuota de servicio, por definir y sin importe');
assert.ok(!/\d+\s?%|comisi/i.test(html.replace(/href="[^"]*"/g, '')), 'sin cifras de comisión ni comparaciones');
assert.ok(!html.includes('«uno más»'), 'sin el texto roto de la cuenta vacía');
assert.deepEqual([...html.matchAll(/<li data-vista="(\w+)">/g)].map((m) => m[1]), ['menu', 'orden', 'modo', 'pagar', 'seguimiento'], 'los pasos en el orden del flujo de referencia: menú primero, la entrega antes de pagar');
assert.match(html, /class="entrega-chip" data-ir="modo"/, 'cómo y dónde, siempre a la vista y se puede cambiar');
assert.match(html, /<div class="det-grupos"><\/div>/, 'los grupos de opciones los pone el JS; ninguno escrito a mano');
for (const svg of html.match(/<svg[\s\S]*?<\/svg>/g)) assert.ok(!/<(circle|path|rect)\b[^>]*[^/]>/.test(svg), `SVG con elementos sin cerrar: ${svg.slice(0, 60)}`);

console.log('domicilio.test: OK (menú primero, opciones con tope y obligatorias, modo y cobertura, menú y detalle, orden, propina, pagar, número, seguimiento, cancelar, recoger, historial)');
