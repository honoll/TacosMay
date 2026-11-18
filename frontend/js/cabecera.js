// La parte de la cabecera que depende de la sesión: cuenta y carrito. Es la misma en todo el sitio.
// La tienda la repinta en cada cambio (tienda/app.js); la landing y la página de «no encontrado» la
// llenan una vez al cargar con iniciarCabecera(). Sin JavaScript queda lo que trae el HTML:
// «Entrar» y «Carrito (0)».
import { api, session, esc } from './api.js';

// Cuántas piezas lleva un carrito (la respuesta de GET /carrito).
export const piezas = (carrito) => carrito.items.reduce((s, i) => s + i.cantidad, 0);

// Los enlaces de cuenta. base: '' dentro de la tienda, que navega por #; '/tienda/' desde cualquier otra página.
export function cuenta(u, { base = '/tienda/', actual = '', admin = false } = {}) {
  const a = (r, texto) => `<a href="${base}#${r}"${r === actual ? ' aria-current="page"' : ''}>${texto}</a>`;
  return [
    u ? a('pedidos', 'Mis pedidos') : '',
    admin ? a('admin', 'Admin') : '',
    u ? a('cuenta', esc(u.nombre)) : a('entrar', 'Entrar'),
    u ? '<button type="button" class="salir" data-click="logout">Salir</button>' : '',
  ].join('');
}

// El botón del carrito está escrito en el HTML y no se repinta: solo cambian su número y su destino.
export function pintarCarrito(n, { base = '/tienda/', actual = '' } = {}) {
  const boton = document.getElementById('nav-carrito');
  document.getElementById('nav-carrito-n').textContent = n;
  boton.setAttribute('href', `${base}#carrito`);
  if (actual === 'carrito') boton.setAttribute('aria-current', 'page');
  else boton.removeAttribute('aria-current');
}

// Páginas estáticas. Marca la página actual y, si hay sesión, pone el nombre y cuenta el carrito.
export async function iniciarCabecera() {
  if (location.pathname === '/') document.querySelector('#nav-principal a[href="/"]')?.setAttribute('aria-current', 'page');
  const nav = document.getElementById('nav');
  const pintar = (n) => {
    const u = session.get();
    nav.innerHTML = cuenta(u, { admin: u?.rol === 'admin' });
    pintarCarrito(n);
  };
  nav.addEventListener('click', (e) => {
    if (!e.target.closest('[data-click="logout"]')) return;
    session.set(null);
    pintar(0);
  });
  if (!session.get()?.token) return; // sin sesión no se pide el carrito
  pintar(0);
  try {
    pintar(piezas(await api('/carrito')));
  } catch {
    pintar(0); // sesión vencida: api() ya la borró, así que se pinta «Entrar»
  }
}
