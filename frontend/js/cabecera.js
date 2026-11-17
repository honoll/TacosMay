// La parte de la cabecera que depende de la sesión: cuenta y carrito. Es la misma en todo el sitio.
// La tienda la repinta en cada cambio (tienda/app.js); la landing y la página de «no encontrado» la
// llenan una vez al cargar con iniciarCabecera(). Sin JavaScript queda lo que trae el HTML:
// «Entrar» y «Carrito (0)».
import { api, session, esc } from './api.js';

// Cuántas piezas lleva un carrito (la respuesta de GET /carrito).
export const piezas = (carrito) => carrito.items.reduce((s, i) => s + i.cantidad, 0);

// base: '' dentro de la tienda, que navega por #; '/tienda/' desde cualquier otra página.
export function cuentaYCarrito(u, n, { base = '/tienda/', actual = '', admin = false } = {}) {
  const a = (r, texto, cls = '') =>
    `<a${cls ? ` class="${cls}"` : ''} href="${base}#${r}"${r === actual ? ' aria-current="page"' : ''}>${texto}</a>`;
  return [
    u ? a('pedidos', 'Mis pedidos') : '',
    admin ? a('admin', 'Admin') : '',
    u ? a('cuenta', esc(u.nombre)) : a('entrar', 'Entrar'),
    u ? '<button type="button" class="salir" data-click="logout">Salir</button>' : '',
    a('carrito', `Carrito (${n}) <span data-countdown></span>`, 'btn chico'),
  ].join('');
}

// Páginas estáticas. Marca la página actual y, si hay sesión, pone el nombre y cuenta el carrito.
export async function iniciarCabecera() {
  if (location.pathname === '/') document.querySelector('#nav-principal a[href="/"]')?.setAttribute('aria-current', 'page');
  const nav = document.getElementById('nav');
  const pintar = (n) => {
    const u = session.get();
    nav.innerHTML = cuentaYCarrito(u, n, { admin: u?.rol === 'admin' });
  };
  nav.addEventListener('click', (e) => {
    if (!e.target.closest('[data-click="logout"]')) return;
    session.set(null);
    pintar(0);
  });
  if (!session.get()) return;
  pintar(0);
  try {
    pintar(piezas(await api('/carrito')));
  } catch {
    pintar(0); // sesión vencida: api() ya la borró, así que se pinta «Entrar»
  }
}
