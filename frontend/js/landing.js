// Landing: las charolas del menú en vivo desde la API y el avance de la escena «Cómo funciona».
// Reúsa el api() y el money() de la tienda, y la charola de barra.js.
import { api, money, esc } from './api.js';
import { charola } from './barra.js';
import { iniciarCabecera } from './cabecera.js';

document.documentElement.classList.add('js');
iniciarCabecera();

// ---------- Las charolas, en vivo (GET /guisos/populares y GET /guisos) ----------

const menu = document.getElementById('menu');
const populares = document.getElementById('populares');
const bloquePopulares = document.getElementById('populares-bloque');
const estado = document.getElementById('menu-estado');
const texto = document.getElementById('menu-texto');
const reintentar = document.getElementById('menu-reintentar');

const ficha = (g) => `/tienda/#guiso/${encodeURIComponent(g.id)}`;
const HUECAS = '<li class="charola hueca" aria-hidden="true"><div class="guiso"></div><div class="datos"><p></p><p></p></div></li>'.repeat(8);

// Cada charola lleva a su ficha en la tienda; las que más salen traen además el botón.
const guiso = (g, boton = false) => charola(g.nombre, `
    <p class="dato">${esc(g.porciones)} porciones · ${g.stock > 0 ? `${esc(g.stock)} en existencia` : 'Se acabó por hoy'}${g.vendidos > 0 ? ` · ${esc(g.vendidos)} ${Number(g.vendidos) === 1 ? 'vendido' : 'vendidos'}` : ''}</p>
    <p class="precio">${money(g.precio_centavos)}</p>${boton && g.stock > 0 ? `
    <a class="btn chico" href="${ficha(g)}">Pedir<span class="sr"> ${esc(g.nombre)}</span></a>` : ''}`, { tag: 'li', cls: g.stock > 0 ? '' : 'agotada', href: ficha(g) });

// Un solo lugar decide qué muestra el estado del menú: cargando, error o nada.
function setEstado(msg, kind) {
  texto.textContent = msg;
  estado.hidden = !msg;
  estado.querySelector('.cargando').hidden = kind !== 'cargando';
  reintentar.hidden = kind !== 'error';
}

async function loadMenu() {
  setEstado('Leyendo el menú…', 'cargando');
  menu.innerHTML = HUECAS; // charolas huecas mientras responde la API
  try {
    const [top, todos] = await Promise.all([api('/guisos/populares'), api('/guisos')]);
    populares.innerHTML = top.map((g) => guiso(g, true)).join('');
    bloquePopulares.hidden = !top.length;
    menu.innerHTML = todos.map((g) => guiso(g)).join('');
    setEstado(todos.length ? '' : 'Todavía no hay guisos en el menú.');
  } catch {
    menu.innerHTML = '';
    // Estado digno: la página sigue completa y la tienda sigue a un clic.
    setEstado('No pudimos leer el menú. Dale otra vez, o entra a la tienda.', 'error');
  }
}
reintentar.addEventListener('click', loadMenu);
loadMenu();

// Cada fila de charolas entra a la barra la primera vez que llega a pantalla (la animación vive en CSS).
const seen = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('entra');
    seen.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.barra:not(.entra)').forEach((el) => seen.observe(el));

const como = document.getElementById('como');

// ---------- La cabecera marca la sección que está al centro de la pantalla ----------
const enlaces = document.querySelectorAll('#nav-principal a');
const alCentro = new Set();
const centro = new IntersectionObserver((entries) => {
  for (const e of entries) alCentro[e.isIntersecting ? 'add' : 'delete'](e.target.id);
  const actual = alCentro.size ? `/#${[...alCentro][0]}` : '/';
  for (const a of enlaces) {
    if (a.getAttribute('href') === actual) a.setAttribute('aria-current', actual === '/' ? 'page' : 'location');
    else a.removeAttribute('aria-current');
  }
}, { rootMargin: '-45% 0px -45% 0px' });
centro.observe(como);
centro.observe(document.getElementById('taqueria'));

// ---------- Escena «Cómo funciona»: el scroll elige el estado activo ----------
// JS solo publica el paso (1 a 3); el resalte está en CSS, que lo ignora en celular y con movimiento reducido.

const STEPS = 3;
let queued = false;

function progress() {
  queued = false;
  const r = como.getBoundingClientRect();
  const span = r.height - innerHeight;
  const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 1;
  como.dataset.step = Math.min(STEPS, 1 + Math.floor(p * STEPS));
}
function request() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(progress);
}
addEventListener('scroll', request, { passive: true });
addEventListener('resize', request);
progress();
