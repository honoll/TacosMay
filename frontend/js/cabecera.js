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

// Minutos y segundos del tiempo que le queda al carrito: 04:59.
export const clock = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// El botón del carrito está escrito en el HTML y no se repinta: solo cambian su número y su destino.
// fin: cuándo expira el carrito (ms), para que la siguiente página llegue con el mismo reloj.
export function pintarCarrito(n, { base = '/tienda/', actual = '', fin = 0 } = {}) {
  const boton = document.getElementById('nav-carrito');
  document.getElementById('nav-carrito-n').textContent = n;
  boton.setAttribute('href', `${base}#carrito`);
  if (actual === 'carrito') boton.setAttribute('aria-current', 'page');
  else boton.removeAttribute('aria-current');
  // Lo que se ve, para la página que sigue (el script en línea bajo la cabecera de cada página).
  // Enlaces absolutos y sin «aquí estás»: valen desde cualquier página.
  const nav = document.getElementById('nav').innerHTML.replaceAll('href="#', 'href="/tienda/#').replace(/ aria-current="page"/g, '');
  try { sessionStorage.setItem('tm_cabecera', JSON.stringify({ nav, n, fin })); } catch { /* sin almacenamiento: solo se pierde el atajo */ }
}

// Páginas estáticas. Marca la página actual y, si hay sesión, pone el nombre y cuenta el carrito.
export async function iniciarCabecera() {
  if (location.pathname === '/') document.querySelector('#nav-principal a[href="/"]')?.setAttribute('aria-current', 'page');
  const nav = document.getElementById('nav');
  // Sin pintar «0» antes de saber: lo de la página anterior ya está puesto (script bajo la cabecera).
  let fin = 0;
  const reloj = () => {
    const s = Math.max(0, Math.ceil((fin - Date.now()) / 1000));
    for (const el of document.querySelectorAll('[data-countdown]')) el.textContent = s ? clock(s) : '';
  };
  const actualizar = async () => {
    if (!session.get()?.token) return pintar(0); // sin sesión no se pide el carrito
    try {
      const c = await api('/carrito');
      fin = c.items.length && c.expira_en_segundos > 0 ? Date.now() + c.expira_en_segundos * 1000 : 0;
      pintar(piezas(c));
    } catch {
      fin = 0;
      pintar(0); // sesión vencida: api() ya la borró, así que se pinta «Entrar»
    }
    reloj();
  };
  const pintar = (n) => {
    const u = session.get();
    nav.innerHTML = cuenta(u, { admin: u?.rol === 'admin' });
    pintarCarrito(n, { fin });
  };
  nav.addEventListener('click', (e) => {
    if (!e.target.closest('[data-click="logout"]')) return;
    session.set(null);
    fin = 0;
    pintar(0);
    reloj();
  });
  setInterval(reloj, 1000);
  // Al volver con «atrás» la página sale de la memoria del navegador tal como se dejó: se pone al día.
  addEventListener('pageshow', (e) => { if (e.persisted) actualizar(); });
  await actualizar();
}
