import { api, session, money, esc, notice } from '../js/api.js';
import { charola } from '../js/barra.js';
import { empacar } from './empaque.js';

const view = document.getElementById('vista');
const nav = document.getElementById('nav');

const EMPTY = { items: [], total_centavos: 0, expira_en_segundos: 0 };
let cart = EMPTY;
let deadline = 0;    // ms en que expira el carrito; 0 = sin cuenta regresiva
let guisos = [];     // último listado, para editar en admin sin volver a pedirlo
let editing = null;  // guiso en edición en el panel admin
let current = '';    // vista pintada (puede diferir del hash si un guard redirige)
let rendered = null; // hash ya pintado, para no repintar en el hashchange de go()
let renderId = 0;
let desde = 'catalogo'; // última vista que no es de acceso: ahí se regresa después de entrar o registrarse

const user = () => session.get();
const isAdmin = () => user()?.rol === 'admin';

// ---------- Carrito y cuenta regresiva (el TTL de Redis, a la vista) ----------

function setCart(c) {
  cart = { ...EMPTY, ...c };
  deadline = cart.items.length && cart.expira_en_segundos > 0
    ? Date.now() + cart.expira_en_segundos * 1000 : 0;
  renderNav();
  tick();
}

const loadCart = async () => setCart(await api('/carrito'));

const clock = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

function tick() {
  const left = deadline ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000)) : 0;
  document.querySelectorAll('[data-countdown]').forEach((el) => {
    el.textContent = deadline ? clock(left) : '';
    el.classList.toggle('urgente', deadline > 0 && left <= 60);
  });
  if (deadline && left === 0) {
    deadline = 0;
    // Redis redondea el TTL: un segundo de margen para no consultar antes de que borre la clave.
    setTimeout(() => run(async () => {
      await loadCart();
      if (!cart.items.length) notice('Tu carrito expiró por inactividad y Redis lo borró (TTL).', 'error');
      if (current === 'carrito') await render();
    }), 1000);
  }
}
setInterval(tick, 1000);

async function setQty(id, cantidad) {
  setCart(await api(`/carrito/items/${id}`, { method: 'PUT', body: { cantidad } }));
}

// ---------- Piezas de HTML reusadas ----------

const field = (prefix, name, label, value = '', attrs = '') => `
  <label for="${prefix}-${name}">${label}</label>
  <input id="${prefix}-${name}" name="${name}" value="${esc(value)}" required ${attrs}>`;

// Tarjeta de guiso: una charola del sistema (color, número y foto según el nombre; ver ../js/barra.js).
// La descripción solo se muestra si dice algo propio de ese guiso (conDescripcion lo decide).
const card = (g, mostrarDescripcion) => charola(g.nombre, `
    ${g.vendidos != null ? `<p class="tag">${esc(g.vendidos)} vendidos</p>` : ''}
    ${mostrarDescripcion ? `<p class="desc">${esc(g.descripcion)}</p>` : ''}
    <p class="precio">${money(g.precio_centavos)}</p>
    <p class="meta">${esc(g.porciones)} porciones · ${g.stock > 0 ? `${esc(g.stock)} disponibles` : 'Se acabó por hoy'}</p>
    <button type="button" class="primario" data-click="add" data-id="${esc(g.id)}" data-nombre="${esc(g.nombre)}"
      ${g.stock > 0 ? '' : 'disabled'}>Agregar<span class="sr"> ${esc(g.nombre)} al carrito</span></button>`, { tag: 'li', cls: g.stock > 0 ? '' : 'agotada' });

// Una descripción repetida en varios guisos no informa nada: devuelve cómo pintar cada tarjeta de esa lista.
function conDescripcion(lista) {
  const veces = new Map();
  for (const g of lista) veces.set(g.descripcion, (veces.get(g.descripcion) || 0) + 1);
  return (g) => card(g, Boolean(g.descripcion) && veces.get(g.descripcion) === 1);
}

const fecha = (v) => new Date(isNaN(v) ? v : Number(v))
  .toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });

// ---------- Vistas: cada una devuelve su HTML ----------

const VIEWS = {
  async catalogo() {
    const [populares, todos] = await Promise.all([api('/guisos/populares'), api('/guisos')]);
    guisos = todos;
    const tarjeta = conDescripcion(todos);
    return `
      <h1>Guisos de taquería empacados al vacío</h1>
      ${populares.length ? `<h2>Los más pedidos</h2><ul class="grid">${populares.map(tarjeta).join('')}</ul>` : ''}
      <h2>Todos los guisos</h2>
      ${todos.length ? `<ul class="grid">${todos.map(tarjeta).join('')}</ul>` : '<p>Todavía no hay guisos en el catálogo.</p>'}`;
  },

  async carrito() {
    await loadCart();
    if (!cart.items.length) {
      return '<h1>Tu carrito</h1><p>Tu carrito está vacío.</p><p><a href="#catalogo">Ver guisos</a></p>';
    }
    return `
      <h1>Tu carrito</h1>
      <p class="expira">Tu carrito expira en <strong data-countdown></strong>
        <small>Cada cambio renueva el tiempo. Si llega a cero, Redis borra el carrito solo (TTL).</small></p>
      <ul class="lista">${cart.items.map(({ guiso: g, cantidad }) => `
        <li>
          <div class="crece"><strong>${esc(g.nombre)}</strong><br>${money(g.precio_centavos)} c/u</div>
          <label for="cant-${esc(g.id)}">Cantidad<span class="sr"> de ${esc(g.nombre)}</span></label>
          <input id="cant-${esc(g.id)}" type="number" min="0" max="${esc(g.stock)}" step="1" inputmode="numeric"
            value="${esc(cantidad)}" data-change="qty" data-id="${esc(g.id)}">
          <strong>${money(g.precio_centavos * cantidad)}</strong>
          <button type="button" data-click="remove" data-id="${esc(g.id)}">Quitar<span class="sr"> ${esc(g.nombre)}</span></button>
        </li>`).join('')}</ul>
      <p class="total">Total: <strong>${money(cart.total_centavos)}</strong></p>
      <div class="acciones">
        <button type="button" class="primario" data-click="checkout">Confirmar pedido</button>
        <button type="button" data-click="empty">Vaciar carrito</button>
      </div>`;
  },

  async pedidos() {
    const pedidos = await api('/pedidos');
    if (!pedidos.length) return '<h1>Mis pedidos</h1><p>Todavía no tienes pedidos.</p>';
    return `
      <h1>Mis pedidos</h1>
      <ul class="grid">${pedidos.map((p) => `
        <li class="card">
          <h2>Pedido #${esc(p.id)}</h2>
          <p class="meta">${esc(fecha(p.creado))}</p>
          <ul>${p.items.map((i) => `
            <li>${esc(i.cantidad)} × ${esc(i.nombre)} — ${money(i.precio_centavos * i.cantidad)}</li>`).join('')}</ul>
          <p class="total">Total: <strong>${money(p.total_centavos)}</strong></p>
        </li>`).join('')}</ul>`;
  },

  async admin() {
    guisos = await api('/guisos');
    const g = editing || {};
    const int = (min) => `type="number" min="${min}" step="1" inputmode="numeric"`;
    return `
      <h1>Administrar guisos</h1>
      <form class="form" data-submit="saveGuiso">
        <h2>${editing ? `Editar «${esc(g.nombre)}»` : 'Nuevo guiso'}</h2>
        ${field('g', 'nombre', 'Nombre', g.nombre)}
        ${field('g', 'descripcion', 'Descripción', g.descripcion)}
        ${field('g', 'precio', 'Precio (pesos)', editing ? g.precio_centavos / 100 : '', 'type="number" min="0" step="0.01" inputmode="decimal"')}
        ${field('g', 'porciones', 'Porciones', g.porciones, int(1))}
        ${field('g', 'stock', 'Stock', g.stock, int(0))}
        <div class="acciones">
          <button class="primario">${editing ? 'Guardar cambios' : 'Agregar guiso'}</button>
          ${editing ? '<button type="button" data-click="cancelEdit">Cancelar</button>' : ''}
        </div>
      </form>
      <h2>Guisos en el catálogo</h2>
      <ul class="lista">${guisos.map((x) => `
        <li>
          <div class="crece"><strong>${esc(x.nombre)}</strong><br>
            ${money(x.precio_centavos)} · ${esc(x.porciones)} porciones · stock ${esc(x.stock)}</div>
          <button type="button" data-click="edit" data-id="${esc(x.id)}">Editar<span class="sr"> ${esc(x.nombre)}</span></button>
          <button type="button" data-click="del" data-id="${esc(x.id)}">Eliminar<span class="sr"> ${esc(x.nombre)}</span></button>
        </li>`).join('')}</ul>`;
  },

  async cuenta() {
    const u = user();
    return `
      <h1>Tu cuenta</h1>
      <div class="acceso">
        <div class="form">
          <p><strong>${esc(u.nombre)}</strong><br>${esc(u.email)}${isAdmin() ? '<br>Rol: administrador' : ''}</p>
          <p><a href="#pedidos">Ver mis pedidos</a></p>
          <button type="button" data-click="logout">Cerrar sesión</button>
        </div>
        ${LADO}
      </div>`;
  },

  entrar: async () => acceso(false),
  registro: async () => acceso(true),
};

// Lo que acompaña a los formularios de cuenta en pantalla ancha: para qué sirve tener cuenta.
const LADO = `
  <aside class="acceso-lado" aria-label="Para qué sirve tu cuenta">
    <img src="../marca/logo/sello.svg" alt="" width="220" height="360">
    <div>
      <h2>Con tu cuenta</h2>
      <ul>
        <li>Agregas guisos a tu carrito.</li>
        <li>Confirmas tu pedido.</li>
        <li>Ves tus pedidos anteriores.</li>
      </ul>
    </div>
  </aside>`;

// Iniciar sesión (#entrar) y crear cuenta (#registro): el mismo molde, con un enlace para pasar de una a otra.
function acceso(esRegistro) {
  const id = esRegistro ? 'registro' : 'login';
  return `
    <div class="acceso">
      <form class="form" data-submit="${id}">
        <h1>${esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
        ${esRegistro ? field(id, 'nombre', 'Nombre', '', 'autocomplete="name"') : ''}
        ${field(id, 'email', 'Correo', '', 'type="email" autocomplete="email"')}
        ${field(id, 'password', 'Contraseña', '', `type="password" autocomplete="${esRegistro ? 'new' : 'current'}-password"`)}
        <button class="primario">${esRegistro ? 'Crear mi cuenta' : 'Entrar'}</button>
        <p class="cambio">${esRegistro
          ? '¿Ya tienes cuenta? <a href="#entrar">Entra</a>'
          : '¿No tienes cuenta? <a href="#registro">Créala</a>'}</p>
      </form>
      ${LADO}
    </div>`;
}

// ---------- Acciones: data-click / data-submit / data-change apuntan aquí ----------

async function auth(form, path) {
  session.set(await api(path, { method: 'POST', body: Object.fromEntries(new FormData(form)) }));
  await loadCart();
  notice(`Hola, ${user().nombre}.`);
  await go(desde); // de vuelta a donde estaba: el catálogo si quería agregar, el carrito si iba para allá
}

const ACTIONS = {
  login: (form) => auth(form, '/users/login'),
  registro: (form) => auth(form, '/users'),

  logout() {
    session.set(null);
    setCart(EMPTY);
    return go('catalogo');
  },

  async add(el) {
    if (!user()) {
      notice('Inicia sesión para agregar guisos al carrito.', 'error');
      return go('entrar');
    }
    const actual = cart.items.find((i) => String(i.guiso.id) === el.dataset.id)?.cantidad || 0;
    const pack = empacar(el); // respuesta visual: no espera a la llamada ni la retrasa
    try { await setQty(el.dataset.id, actual + 1); } catch (err) { pack.cancel(); throw err; }
    notice(`Agregado al carrito: ${el.dataset.nombre}.`);
  },

  async qty(el) {
    // Si el backend rechaza (sin stock), repintar regresa el input a la cantidad real.
    try { await setQty(el.dataset.id, Math.max(0, parseInt(el.value, 10) || 0)); } finally { await render(); }
  },

  async remove(el) {
    await setQty(el.dataset.id, 0);
    await render();
  },

  async empty() {
    setCart(await api('/carrito', { method: 'DELETE' }));
    await render();
  },

  async checkout() {
    const p = await api('/pedidos', { method: 'POST' });
    setCart(EMPTY);
    notice(`Pedido #${p.id} confirmado por ${money(p.total_centavos)}.`);
    await go('pedidos');
  },

  async saveGuiso(form) {
    const f = Object.fromEntries(new FormData(form));
    const body = {
      nombre: f.nombre.trim(),
      descripcion: f.descripcion.trim(),
      precio_centavos: Math.round(Number(f.precio) * 100),
      porciones: Number(f.porciones),
      stock: Number(f.stock),
    };
    const g = editing
      ? await api(`/guisos/${editing.id}`, { method: 'PUT', body })
      : await api('/guisos', { method: 'POST', body });
    notice(`${editing ? 'Guardado' : 'Agregado'}: ${g.nombre}.`);
    editing = null;
    await render();
  },

  async edit(el) {
    editing = guisos.find((g) => String(g.id) === el.dataset.id);
    await render();
    document.getElementById('g-nombre').focus();
  },

  cancelEdit() {
    editing = null;
    return render();
  },

  async del(el) {
    const g = guisos.find((x) => String(x.id) === el.dataset.id);
    if (!confirm(`¿Eliminar «${g.nombre}» del catálogo?`)) return;
    await api(`/guisos/${g.id}`, { method: 'DELETE' });
    if (editing?.id === g.id) editing = null;
    notice(`Eliminado: ${g.nombre}.`);
    await render();
  },
};

// ---------- Motor: errores, rutas y eventos ----------

// Todo lo que puede fallar pasa por aquí: un solo catch, un solo lugar de avisos.
async function run(fn) {
  try {
    await fn();
  } catch (err) {
    notice(err.message, 'error');
    if (err.status === 401) { // sesión vencida: api() ya borró el token
      setCart(EMPTY);
      await go('entrar');
    }
  }
}

const TITULOS = {
  catalogo: 'Guisos', carrito: 'Tu carrito', pedidos: 'Mis pedidos', admin: 'Administrar guisos',
  cuenta: 'Tu cuenta', entrar: 'Iniciar sesión', registro: 'Crear cuenta',
};

const route = () => {
  const r = location.hash.slice(1);
  return Object.hasOwn(VIEWS, r) ? r : 'catalogo';
};

// Navegar desde código sin perder el aviso recién puesto.
function go(r) {
  location.hash = r;
  return render();
}

function renderNav() {
  const u = user();
  const n = cart.items.reduce((s, i) => s + i.cantidad, 0);
  const links = [
    ['catalogo', 'Guisos'],
    ['carrito', `Carrito (${n}) <span data-countdown></span>`],
    ...(u ? [['pedidos', 'Mis pedidos']] : []),
    ...(isAdmin() ? [['admin', 'Admin']] : []),
    u ? ['cuenta', esc(u.nombre)] : ['entrar', 'Entrar'],
  ];
  nav.innerHTML = links
    .map(([r, text]) => `<a href="#${r}"${r === current || (r === 'entrar' && current === 'registro') ? ' aria-current="page"' : ''}>${text}</a>`)
    .join('');
}

async function render() {
  rendered = location.hash;
  const id = ++renderId;
  let r = route();
  if (!user() && (r === 'carrito' || r === 'pedidos' || r === 'cuenta')) {
    if (r !== 'cuenta') { notice('Inicia sesión para continuar.', 'error'); desde = r; } // al entrar, se sigue hacia allá
    r = 'entrar';
  }
  if (user() && (r === 'entrar' || r === 'registro')) r = 'cuenta';
  if (r === 'admin' && !isAdmin()) r = 'catalogo';
  if (r !== 'entrar' && r !== 'registro') desde = r;
  document.title = `${TITULOS[r]} — Los Tacos May`;
  const changed = r !== current;
  current = r;
  renderNav();
  await run(async () => {
    const html = await VIEWS[r]();
    if (id !== renderId) return; // ya hay un render más nuevo
    const focusId = document.activeElement?.id;
    view.innerHTML = html;
    view.dataset.vista = r; // para que la hoja de estilos componga cada vista en pantalla ancha
    tick();
    // Conserva el foco al repintar; al cambiar de vista lo manda al contenido.
    // Sin desplazar: enfocar <main> escondía la cabecera (y el logotipo) al cargar.
    ((focusId && document.getElementById(focusId)) || (changed && view))?.focus?.({ preventScroll: true });
    if (changed) scrollTo(0, 0);
  });
}

function dispatch(e, type) {
  const el = e.target.closest(`[data-${type}]`);
  if (!el) return;
  e.preventDefault();
  notice();
  const btn = e.submitter || (el.tagName === 'BUTTON' ? el : null);
  if (btn) btn.disabled = true; // evita el doble clic (p. ej. confirmar dos veces)
  run(() => ACTIONS[el.dataset[type]](el)).finally(() => { if (btn) btn.disabled = false; });
}
for (const type of ['click', 'submit', 'change']) view.addEventListener(type, (e) => dispatch(e, type));

addEventListener('hashchange', () => {
  if (location.hash === rendered) return;
  notice();
  render();
});

// Arranque: si hay sesión guardada, se valida contra el backend y se carga su carrito.
if (user()) {
  await run(async () => {
    session.set({ ...user(), ...(await api('/users/me')) });
    await loadCart();
  });
}
render();
