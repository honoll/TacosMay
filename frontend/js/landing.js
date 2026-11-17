// Landing: menú en vivo desde la API y progreso de scroll de la escena «Modo de uso».
// Reúsa el mismo api(), money() y esc() de la tienda.
import { api, money, esc } from './api.js';

document.documentElement.classList.add('js');

// ---------- Menú en vivo (GET /guisos/populares y GET /guisos) ----------

const menu = document.getElementById('menu');
const populares = document.getElementById('populares');
const bloquePopulares = document.getElementById('populares-bloque');
const estado = document.getElementById('menu-estado');
const reintentar = document.getElementById('menu-reintentar');

const popular = (g, i) => `
  <li style="--i:${i}">
    <span class="num rotulo" aria-hidden="true">${i + 1}</span>
    <div>
      <h3 class="rotulo">${esc(g.nombre)}</h3>
      <p>${money(g.precio_centavos)} · ${esc(g.porciones)} porciones${g.vendidos > 0 ? ` · ${esc(g.vendidos)} vendidos` : ''}</p>
    </div>
  </li>`;

const fila = (g, i) => `
  <li style="--i:${i}">
    <div class="fila">
      <h3 class="rotulo">${esc(g.nombre)}</h3>
      <span class="puntos" aria-hidden="true"></span>
      <strong>${money(g.precio_centavos)}</strong>
    </div>
    <p>${esc(g.descripcion)}</p>
    <p class="dato">${esc(g.porciones)} porciones · ${g.stock > 0 ? `${esc(g.stock)} en existencia` : 'Agotado por ahora'}</p>
  </li>`;

async function loadMenu() {
  estado.textContent = 'Leyendo el menú…';
  reintentar.hidden = true;
  try {
    const [top, todos] = await Promise.all([api('/guisos/populares'), api('/guisos')]);
    populares.innerHTML = top.map(popular).join('');
    bloquePopulares.hidden = !top.length;
    menu.innerHTML = todos.map(fila).join('');
    estado.textContent = todos.length ? '' : 'Todavía no hay guisos en el menú.';
  } catch {
    // Estado digno: la página sigue completa y la tienda sigue a un clic.
    estado.textContent = 'No pudimos leer el menú en este momento. Puedes volver a intentar o entrar a la tienda.';
    reintentar.hidden = false;
  }
  estado.hidden = !estado.textContent;
}
reintentar.addEventListener('click', loadMenu);
loadMenu();

// Las listas «se imprimen» la primera vez que entran a la pantalla (la animación vive en CSS).
const seen = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('visto');
    seen.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.imprime').forEach((el) => seen.observe(el));

// ---------- Escena «Modo de uso»: el scroll es la línea de tiempo ----------
// JS solo publica el avance (0 a 1) y el paso activo; todo el movimiento está en CSS,
// que además lo ignora con prefers-reduced-motion.

const modo = document.getElementById('modo');
const STEPS = 3;
let queued = false;

function progress() {
  queued = false;
  const r = modo.getBoundingClientRect();
  const span = r.height - innerHeight;
  const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 1;
  modo.style.setProperty('--scroll', p.toFixed(3));
  modo.dataset.step = Math.min(STEPS, 1 + Math.floor(p * STEPS));
}
function request() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(progress);
}
addEventListener('scroll', request, { passive: true });
addEventListener('resize', request);
progress();
