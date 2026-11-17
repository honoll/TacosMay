// Autocomprobación sin backend ni navegador: node frontend/js/api.test.mjs
import assert from 'node:assert/strict';

const store = {};
globalThis.localStorage = {
  getItem: (k) => store[k] ?? null,
  setItem: (k, v) => { store[k] = v; },
  removeItem: (k) => { delete store[k]; },
};
let last;
const respond = (status, data) => {
  globalThis.fetch = async (url, opts) => {
    last = { url, ...opts };
    return { ok: status < 400, status, json: async () => data };
  };
};

const { api, session, money, esc, slug } = await import('./api.js');

assert.match(money(12345), /123\.45/);
assert.equal(slug('Chicharrón en salsa'), 'chicharron-en-salsa');
assert.equal(slug(' Rajas con queso y crema (EJEMPLO) '), 'rajas-con-queso-y-crema-ejemplo');
assert.equal(esc('<b a="1">&\'</b>'), '&lt;b a=&quot;1&quot;&gt;&amp;&#39;&lt;/b&gt;');

// Sin sesión: ruta relativa bajo /api, sin Authorization; un 401 es login fallido y habla el backend.
respond(401, { message: 'Credenciales incorrectas' });
await assert.rejects(api('/users/login', { method: 'POST', body: { email: 'a', password: 'b' } }),
  { message: 'Credenciales incorrectas', status: 401 });
assert.equal(last.url, '/api/users/login');
assert.equal(last.headers.Authorization, undefined);
assert.equal(last.body, '{"email":"a","password":"b"}');

// Con sesión: manda el token; cantidad 0 sí viaja en el cuerpo.
session.set({ token: 'abc', rol: 'cliente' });
respond(200, { items: [] });
assert.deepEqual(await api('/carrito/items/7', { method: 'PUT', body: { cantidad: 0 } }), { items: [] });
assert.equal(last.headers.Authorization, 'Bearer abc');
assert.equal(last.body, '{"cantidad":0}');

// Errores {message} se vuelven excepción con su status.
respond(409, { message: 'Sin stock' });
await assert.rejects(api('/pedidos', { method: 'POST' }), { message: 'Sin stock', status: 409 });

// 401 con token = sesión vencida: se borra la sesión.
respond(401, { message: 'jwt expired' });
await assert.rejects(api('/carrito'), { message: /sesión venció/, status: 401 });
assert.equal(session.get(), null);

// Servidor caído.
globalThis.fetch = async () => { throw new TypeError('fetch failed'); };
await assert.rejects(api('/guisos'), { message: /No se pudo conectar/ });

console.log('api.test: OK');
