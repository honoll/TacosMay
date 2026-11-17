// Landing: las charolas del menú en vivo desde la API y el avance de la escena «Cómo funciona».
// Reúsa el api() y el money() de la tienda, y la charola de barra.js.
import { api, money, esc } from './api.js';
import { charola } from './barra.js';

document.documentElement.classList.add('js');

// ---------- Las charolas, en vivo (GET /guisos/populares y GET /guisos) ----------

const menu = document.getElementById('menu');
const populares = document.getElementById('populares');
const bloquePopulares = document.getElementById('populares-bloque');
const estado = document.getElementById('menu-estado');
const texto = document.getElementById('menu-texto');
const reintentar = document.getElementById('menu-reintentar');

const guiso = (g) => charola(g.nombre, `
    <p class="dato">${esc(g.porciones)} porciones · ${g.stock > 0 ? `${esc(g.stock)} en existencia` : 'Se acabó por hoy'}${g.vendidos > 0 ? ` · ${esc(g.vendidos)} vendidos` : ''}</p>
    <p class="precio">${money(g.precio_centavos)}</p>`, { tag: 'li', cls: g.stock > 0 ? '' : 'agotada' });

// Un solo lugar decide qué muestra el estado del menú: cargando, error o nada.
function setEstado(msg, kind) {
  texto.textContent = msg;
  estado.hidden = !msg;
  estado.querySelector('.cargando').hidden = kind !== 'cargando';
  reintentar.hidden = kind !== 'error';
}

async function loadMenu() {
  setEstado('Leyendo el menú…', 'cargando');
  try {
    const [top, todos] = await Promise.all([api('/guisos/populares'), api('/guisos')]);
    populares.innerHTML = top.map(guiso).join('');
    bloquePopulares.hidden = !top.length;
    menu.innerHTML = todos.map(guiso).join('');
    setEstado(todos.length ? '' : 'Todavía no hay guisos en el menú.');
  } catch {
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

// ---------- Escena «Cómo funciona»: el scroll elige el estado activo ----------
// JS solo publica el paso (1 a 3); el resalte está en CSS, que lo ignora en celular y con movimiento reducido.

const como = document.getElementById('como');
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
