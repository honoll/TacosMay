// La demo guiada, de punta a punta contra una API falsa en memoria: node frontend/proyecto/demo/guion.test.mjs
import assert from 'node:assert/strict';
import { elegir, crearGuion } from './guion.js';

// Cantidades: A alcanza, B también al agregar, pero entre los dos no.
for (const stock of [1, 2, 3, 4, 7, 10]) {
  const { a, b } = elegir([{ id: '1', nombre: 'Mole con pollo', stock }]);
  assert.ok(a <= stock && b <= stock && a + b > stock, `stock ${stock}: a=${a} b=${b}`);
}
assert.equal(elegir([{ id: '1', nombre: 'Mole', stock: 40 }, { id: '2', nombre: 'Tinga', stock: 5 }]).guiso.id, '2', 'mole con muchas: el de menos existencias');
assert.equal(elegir([{ id: '1', nombre: 'Mole con pollo', stock: 3 }, { id: '2', nombre: 'Tinga', stock: 2 }]).guiso.id, '1', 'el mole, como en el guion');
assert.equal(elegir([{ id: '1', nombre: 'X', stock: 0 }]), null);

// Backend falso con las reglas del contrato (stock al agregar y al confirmar, 409, 404, admin).
function backend() {
  const guisos = { 1: { id: '1', nombre: 'Mole con pollo', descripcion: '', precio_centavos: 18000, porciones: 2, stock: 3 }, 2: { id: '2', nombre: 'Tinga', descripcion: '', precio_centavos: 15000, porciones: 2, stock: 9 } };
  const vendidos = {}; const users = {}; const carritos = {}; const pedidos = {}; let n = 0; let ng = 2;
  const err = (status, message) => Object.assign(new Error(message), { status, data: { message } });
  const quien = (token) => { const u = Object.values(users).find((x) => x.token === token); if (!u) throw err(401, 'No autorizado'); return u; };
  const carrito = (id) => ({ items: Object.entries(carritos[id] ?? {}).map(([g, cantidad]) => ({ guiso: guisos[g], cantidad })), total_centavos: 0, expira_en_segundos: carritos[id] ? 1800 : 0 });
  const tokens = [];
  const api = async (ruta, { method = 'GET', body, token } = {}) => {
    tokens.push(token);
    let m;
    if (method === 'POST' && ruta === '/users') { const id = String(Object.keys(users).length + 2); users[body.email] = { id, nombre: body.nombre, email: body.email, rol: 'cliente', token: `t${id}`, password: body.password }; const { password, ...u } = users[body.email]; return u; }
    if (method === 'POST' && ruta === '/users/login') { if (body.email !== 'admin@x' || body.password !== 'secreta') throw err(401, 'Credenciales incorrectas'); return { id: '1', rol: 'admin', token: 'tadmin' }; }
    if (ruta === '/guisos') { if (method === 'GET') return Object.values(guisos); if (token !== 'tadmin') throw err(403, 'Solo admin'); const g = { ...body, id: String(++ng) }; guisos[g.id] = g; return g; }
    if (ruta === '/guisos/populares') return Object.entries(vendidos).map(([id, v]) => ({ ...guisos[id], vendidos: v }));
    if ((m = ruta.match(/^\/guisos\/(\d+)$/))) {
      const g = guisos[m[1]]; if (!g) throw err(404, 'El guiso especificado no existe');
      if (method === 'GET') return g;
      if (token !== 'tadmin') throw err(403, 'Solo admin');
      if (method === 'PUT') return Object.assign(g, body);
      delete guisos[m[1]]; delete vendidos[m[1]]; return { id: m[1] };
    }
    const u = quien(token);
    if (ruta === '/carrito') return carrito(u.id);
    if ((m = ruta.match(/^\/carrito\/items\/(\d+)$/))) { if (body.cantidad > guisos[m[1]].stock) throw err(409, 'sin stock'); (carritos[u.id] ??= {})[m[1]] = body.cantidad; return carrito(u.id); }
    if (ruta === '/pedidos' && method === 'POST') {
      const c = carritos[u.id]; if (!c) throw err(400, 'Tu carrito está vacío');
      for (const [g, k] of Object.entries(c)) if (k > guisos[g].stock) throw err(409, `No hay stock suficiente de ${guisos[g].nombre} (quedan ${guisos[g].stock})`);
      for (const [g, k] of Object.entries(c)) { guisos[g].stock -= k; vendidos[g] = (vendidos[g] ?? 0) + k; }
      const p = { id: String(++n), total_centavos: 100, creado: 'x', items: Object.entries(c).map(([guisoId, cantidad]) => ({ guisoId, nombre: guisos[guisoId].nombre, cantidad, precio_centavos: 1 })) };
      (pedidos[u.id] ??= []).unshift(p); delete carritos[u.id]; return p;
    }
    if (ruta === '/pedidos') return pedidos[u.id] ?? [];
    throw err(404, 'no');
  };
  return { api, guisos, users, tokens };
}

for (const admin of [{ email: 'admin@x', password: 'secreta' }, null]) {
  const b = backend();
  const g = crearGuion({ api: b.api, admin, ahora: () => 123 });
  await g.preparar();
  assert.equal(Object.keys(b.users).length, 2, 'dos clientes de demostración');
  assert.ok(Object.keys(b.users).every((e) => /^demo-[ab]-123@example\.com$/.test(e)));
  assert.ok(Object.values(b.users).every((u) => u.password.length >= 32), 'contraseña generada, no fija');
  const res = {};
  for (const p of g.pasos) res[p.id] = await p.correr();
  const visto = JSON.stringify(res);
  assert.ok(!visto.includes('secreta') && !/"t\d+"|tadmin/.test(visto), 'ni contraseñas ni tokens a la vista');
  assert.equal(res['a-confirma'].log[0].status, 201);
  assert.equal(b.guisos[1].stock, 1, 'A compró 2 de 3');
  assert.equal(res['b-confirma'].log[0].status, 409, 'B recibe el 409');
  assert.ok(res['persistencia'].cambios[0].startsWith('Pedido #1 sigue'));
  assert.ok(b.tokens.every((t) => t !== undefined), 'cada llamada lleva su token (o null): nunca la sesión de la tienda');
  if (admin) {
    assert.equal(res['admin-elimina'].log[1].status, 404, 'creado, editado y eliminado');
    assert.ok(res['admin-edita'].cambios[0].includes('$129.00'));
  } else {
    for (const id of ['admin-crea', 'admin-edita', 'admin-elimina']) assert.ok(res[id].saltado, `${id} se salta sin admin`);
  }
}
console.log('guion.test: OK (cantidades, 10 pasos con y sin admin, 409 de B, sin secretos a la vista)');
