// La demo guiada de la exposición: los pasos de docs/guion-demo.md («Demo en vivo (4:00)»), cada uno con
// peticiones reales a la API. Sin DOM: demo.js lo pinta y guion.test.mjs lo corre con una API falsa.
// Los comandos de Redis son texto fijo tomado de los modelos del backend (backend/models), con los ids reales.

// El guiso de la carrera entre A y B: el mole si está y le quedan pocas (así viene en el seed); si no, el
// que tenga menos existencias. A pide más de la mitad y B lo mismo: A alcanza y entre los dos no.
export function elegir(guisos) {
  const con = guisos.filter((g) => g.stock >= 1).sort((x, y) => x.stock - y.stock);
  const mole = con.find((g) => /mole/i.test(g.nombre) && g.stock <= 10);
  const guiso = mole ?? con[0];
  if (!guiso) return null;
  const a = Math.floor(guiso.stock / 2) + 1;
  const otro = con.find((g) => g.id !== guiso.id) ?? null;
  return { guiso, a, b: a, otro };
}

import { money } from '../../js/api.js';

const PRUEBA = { nombre: 'Guiso de prueba de la demo', descripcion: 'Creado y borrado en vivo durante la exposición.', precio_centavos: 9900, porciones: 1, stock: 5 };
const tapar = (cuerpo) => (cuerpo?.password ? { ...cuerpo, password: '••••••••' } : cuerpo);

// api(ruta, {method, body, token}) es la de js/api.js. admin = {email, password} o null.
export function crearGuion({ api, admin = null, ahora = () => Date.now() }) {
  const c = {}; // lo que los pasos se van pasando: tokens, ids, existencias

  // Cada llamada queda anotada en el paso (petición y respuesta reales); los errores también.
  const llamar = (log) => async (metodo, ruta, { cuerpo, token = null, espera } = {}) => { // null: sin la sesión de la tienda
    const nota = { metodo, ruta: '/api' + ruta, cuerpo: tapar(cuerpo) };
    log.push(nota);
    try {
      // La respuesta tal cual (con el token) queda fuera de lo que se pinta: no enumerable.
      Object.defineProperty(nota, 'real', { value: await api(ruta, { method: metodo, body: cuerpo, token }) });
      nota.status = metodo === 'POST' && ruta !== '/users/login' ? 201 : 200; // los de la tabla de docs/contrato.md
      nota.respuesta = nota.real?.token ? { ...nota.real, token: '(jwt, no se muestra)' } : nota.real;
    } catch (e) {
      nota.status = e.status || 0;
      nota.respuesta = e.data ?? { message: e.message };
      if (espera !== nota.status) throw e;
    }
    return nota;
  };

  const paso = (id, titulo, correr) => ({ id, titulo, correr: async () => { const log = []; const r = await correr(llamar(log)); return { log, ...r }; } });

  // Antes de proyectar: dos clientes de demostración (contraseña generada aquí, solo en memoria) y el catálogo.
  async function preparar() {
    const marca = ahora();
    for (const quien of ['A', 'B']) {
      const cuerpo = { nombre: `Cliente ${quien} (demo)`, email: `demo-${quien.toLowerCase()}-${marca}@example.com`, password: globalThis.crypto.randomUUID() };
      const r = await api('/users', { method: 'POST', body: cuerpo, token: null });
      c[quien] = { id: r.id, token: r.token, email: r.email };
    }
    const guisos = await api('/guisos', { token: null });
    c.eleccion = elegir(guisos);
    if (!c.eleccion) throw new Error('No hay guisos con existencias: corre npm run seed.');
  }

  const pasos = [
    paso('catalogo', 'El catálogo', async (pedir) => {
      const [lista, top] = [await pedir('GET', '/guisos'), await pedir('GET', '/guisos/populares')];
      const { guiso } = c.eleccion;
      c.stock0 = lista.respuesta.find((g) => g.id === guiso.id)?.stock ?? guiso.stock;
      c.vendidos0 = top.respuesta.find((g) => g.id === guiso.id)?.vendidos ?? 0;
      return {
        redis: ['SMEMBERS tm:guisos', 'HGETALL tm:guiso:{id}   (uno por guiso, en paralelo)', 'ZRANGE tm:guisos:vendidos 0 4 REV WITHSCORES'],
        cambios: [`${lista.respuesta.length} guisos en la base`, `${guiso.nombre}: quedan ${c.stock0}`, `Vendidos de ${guiso.nombre}: ${c.vendidos0}`],
      };
    }),
    paso('a-agrega', 'A agrega al carrito', async (pedir) => {
      const { guiso, a } = c.eleccion;
      const r = await pedir('PUT', `/carrito/items/${guiso.id}`, { cuerpo: { cantidad: a }, token: c.A.token });
      const ttl = r.respuesta.expira_en_segundos;
      return {
        redis: [`HSET tm:carrito:${c.A.id} ${guiso.id} ${a}`, `EXPIRE tm:carrito:${c.A.id} ${ttl}`, `HGETALL tm:carrito:${c.A.id}  ·  TTL tm:carrito:${c.A.id}`],
        cambios: [`A lleva ${a} de ${guiso.nombre}`, `TTL del carrito: ${ttl} s`],
        ttl: { quien: 'A', segundos: ttl },
      };
    }),
    paso('a-renueva', 'Cada cambio renueva el TTL', async (pedir) => {
      const { guiso, a, otro } = c.eleccion;
      const [id, cantidad] = otro ? [otro.id, 1] : [guiso.id, a];
      const antes = await pedir('GET', '/carrito', { token: c.A.token });
      const r = await pedir('PUT', `/carrito/items/${id}`, { cuerpo: { cantidad }, token: c.A.token });
      const ttl = r.respuesta.expira_en_segundos;
      return {
        redis: [`TTL tm:carrito:${c.A.id}  →  ${antes.respuesta.expira_en_segundos}`, `HSET tm:carrito:${c.A.id} ${id} ${cantidad}`, `EXPIRE tm:carrito:${c.A.id} ${ttl}`],
        cambios: [`TTL: ${antes.respuesta.expira_en_segundos} s → ${ttl} s`, otro ? `A agregó 1 de ${otro.nombre}` : 'Mismo renglón, otra vez'],
        ttl: { quien: 'A', segundos: ttl },
      };
    }),
    paso('b-agrega', 'B pide las mismas porciones', async (pedir) => {
      const { guiso, a, b } = c.eleccion;
      const r = await pedir('PUT', `/carrito/items/${guiso.id}`, { cuerpo: { cantidad: b }, token: c.B.token });
      const ttl = r.respuesta.expira_en_segundos;
      return {
        redis: [`HSET tm:carrito:${c.B.id} ${guiso.id} ${b}`, `EXPIRE tm:carrito:${c.B.id} ${ttl}`],
        cambios: [`Quedan ${c.stock0} de ${guiso.nombre}`, `A pide ${a} y B pide ${b}: ${a + b} en total`],
        ttl: { quien: 'B', segundos: ttl },
      };
    }),
    paso('a-confirma', 'A confirma su pedido', async (pedir) => {
      const { guiso } = c.eleccion;
      const r = await pedir('POST', '/pedidos', { token: c.A.token });
      c.pedido = r.respuesta;
      const [g, top] = [await pedir('GET', `/guisos/${guiso.id}`), await pedir('GET', '/guisos/populares')];
      c.stock1 = g.respuesta.stock;
      const vendidos = top.respuesta.find((x) => x.id === guiso.id)?.vendidos ?? 0;
      return {
        redis: [
          `WATCH tm:carrito:${c.A.id}  ${c.pedido.items.map((i) => `tm:guiso:${i.guisoId}`).join(' ')}`,
          `INCR tm:seq:pedido  →  ${c.pedido.id}`,
          'MULTI',
          ...c.pedido.items.flatMap((i) => [`  HINCRBY tm:guiso:${i.guisoId} stock -${i.cantidad}`, `  ZINCRBY tm:guisos:vendidos ${i.cantidad} ${i.guisoId}`]),
          `  HSET tm:pedido:${c.pedido.id} {id, userId, total, creado, items}`,
          `  LPUSH tm:pedidos:${c.A.id} ${c.pedido.id}`,
          `  DEL tm:carrito:${c.A.id}`,
          'EXEC',
        ],
        cambios: [`Pedido #${c.pedido.id} creado`, `${guiso.nombre}: quedan ${c.stock0} → ${c.stock1}`, `Lo que más sale: ${c.vendidos0} → ${vendidos} vendidos`, 'Carrito de A: borrado'],
        ttl: { quien: 'A', segundos: 0 },
      };
    }),
    paso('b-confirma', 'B confirma: no alcanza', async (pedir) => {
      const { guiso } = c.eleccion;
      const r = await pedir('POST', '/pedidos', { token: c.B.token, espera: 409 });
      const negado = r.status === 409;
      return {
        redis: [`WATCH tm:carrito:${c.B.id}  tm:guiso:${guiso.id}`, `HGETALL tm:guiso:${guiso.id}  →  stock ${c.stock1}`, negado ? 'No alcanza: no se llega a MULTI ni a EXEC' : 'MULTI … EXEC'],
        cambios: negado ? [`409: ${r.respuesta.message}`, `${guiso.nombre} sigue en ${c.stock1}`, `El carrito de B sigue ahí y expira solo`] : [`No se esperaba: se creó el pedido #${r.respuesta.id}`],
        aviso: negado ? null : 'Las existencias no eran las esperadas: alguien más compró o se repuso stock.',
      };
    }),
    paso('admin-crea', 'Admin crea un guiso', async (pedir) => {
      if (!admin) return { saltado: 'Sin correo y contraseña de admin: este paso se salta.' };
      c.adminToken = (await pedir('POST', '/users/login', { cuerpo: admin, token: null })).real.token;
      const r = await pedir('POST', '/guisos', { cuerpo: PRUEBA, token: c.adminToken });
      c.nuevo = r.respuesta;
      return {
        redis: [`HGETALL tm:user:${admin.email.toLowerCase()}   (bcrypt compara la contraseña)`, `INCR tm:seq:guiso  →  ${c.nuevo.id}`, 'MULTI', `  HSET tm:guiso:${c.nuevo.id} nombre descripcion precio_centavos porciones stock`, `  SADD tm:guisos ${c.nuevo.id}`, 'EXEC'],
        cambios: [`Guiso #${c.nuevo.id} creado`, `Precio: ${money(c.nuevo.precio_centavos)}`],
      };
    }),
    paso('admin-edita', 'Admin cambia el precio', async (pedir) => {
      if (!c.nuevo) return { saltado: admin ? 'No se creó el guiso en el paso anterior.' : 'Sin datos de admin: este paso se salta.' };
      const r = await pedir('PUT', `/guisos/${c.nuevo.id}`, { cuerpo: { precio_centavos: 12900 }, token: c.adminToken });
      return {
        redis: [`EXISTS tm:guiso:${c.nuevo.id}`, `HSET tm:guiso:${c.nuevo.id} precio_centavos 12900`],
        cambios: [`Precio: ${money(c.nuevo.precio_centavos)} → ${money(r.respuesta.precio_centavos)}`],
      };
    }),
    paso('admin-elimina', 'Admin elimina el guiso', async (pedir) => {
      if (!c.nuevo) return { saltado: admin ? 'No se creó el guiso.' : 'Sin datos de admin: este paso se salta.' };
      await pedir('DELETE', `/guisos/${c.nuevo.id}`, { token: c.adminToken });
      const r = await pedir('GET', `/guisos/${c.nuevo.id}`, { espera: 404 });
      return {
        redis: ['MULTI', `  DEL tm:guiso:${c.nuevo.id}`, `  SREM tm:guisos ${c.nuevo.id}`, `  ZREM tm:guisos:vendidos ${c.nuevo.id}`, 'EXEC'],
        cambios: [`Guiso #${c.nuevo.id} eliminado`, `Al pedirlo otra vez: ${r.status}`],
      };
    }),
    paso('persistencia', 'Todo sigue en la base', async (pedir) => {
      const { guiso } = c.eleccion;
      const [ps, g] = [await pedir('GET', '/pedidos', { token: c.A.token }), await pedir('GET', `/guisos/${guiso.id}`)];
      const sigue = ps.respuesta.find((p) => p.id === c.pedido?.id);
      return {
        redis: [`LRANGE tm:pedidos:${c.A.id} 0 -1`, `HGETALL tm:pedido:${c.pedido?.id ?? '{id}'}`, `HGETALL tm:guiso:${guiso.id}`],
        cambios: [sigue ? `Pedido #${sigue.id} sigue ahí: ${money(sigue.total_centavos)}` : 'El pedido de A no aparece', `${guiso.nombre}: quedan ${g.respuesta.stock}`],
      };
    }),
  ];
  return { preparar, pasos, contexto: c };
}
