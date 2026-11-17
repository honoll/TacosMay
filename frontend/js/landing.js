// Landing: menú en vivo desde la API, botones animados y la escena «Modo de uso».
// Reúsa el mismo api(), money() y esc() de la tienda.
import { api, money, esc, slug } from './api.js';

document.documentElement.classList.add('js');

// ---------- Materiales que ya llegaron (docs/diseno/materiales.md) ----------

// M2: nombres de archivo (sin extensión) de las fotos que ya están en media/guisos/<slug>.webp.
// PENDIENTE-CLIENTE: imagen generada con IA, sustituir por foto real antes de publicar o vender.
const FOTOS = new Set([]);

// M6: número de cuadros en media/modo/<720|1280>/001.webp …; 0 = todavía no llegan (se ve el pictograma).
const FRAMES = 0;

// ---------- Menú en vivo (GET /guisos/populares y GET /guisos) ----------

const menu = document.getElementById('menu');
const populares = document.getElementById('populares');
const bloquePopulares = document.getElementById('populares-bloque');
const texto = document.getElementById('menu-texto');
const icono = document.getElementById('menu-icono');
const apenado = document.getElementById('menu-nopal');
const reintentar = document.getElementById('menu-reintentar');

const foto = (g) => {
  const s = slug(g.nombre);
  return FOTOS.has(s)
    ? `<img class="foto" src="media/guisos/${s}.webp" alt="${esc(g.nombre)} servido en cazuela" width="800" height="600" loading="lazy">`
    : `<div class="pieza hueco" data-pieza="M2 · ${s}.webp · 4:3"></div>`;
};

const existencias = (g) => `${esc(g.porciones)} porciones · ${g.stock > 0 ? `${esc(g.stock)} en existencia` : 'Se acabó por hoy'}`;

const popular = (g, i) => `
  <li style="--i:${i}">
    <span class="num rotulo" aria-hidden="true">${i + 1}</span>
    <div>
      <h3 class="rotulo">${esc(g.nombre)}</h3>
      <p>${money(g.precio_centavos)} · ${esc(g.porciones)} porciones${g.vendidos > 0 ? ` · ${esc(g.vendidos)} vendidos` : ''}</p>
      ${i === 0 ? foto(g) : ''}
    </div>
  </li>`;

const fila = (g, i) => `
  <li style="--i:${i}">
    <details>
      <summary class="fila">
        <h3 class="rotulo">${esc(g.nombre)}</h3>
        <span class="puntos" aria-hidden="true"></span>
        <strong>${money(g.precio_centavos)}</strong>
      </summary>
      <div class="detalle">
        ${foto(g)}
        <p>${esc(g.descripcion)}</p>
        <p class="dato">${existencias(g)}</p>
      </div>
    </details>
  </li>`;

// Un solo lugar decide qué muestra el estado del menú: cargando, error o nada.
function setEstado(msg, kind) {
  texto.textContent = msg;
  texto.parentElement.hidden = !msg;
  icono.hidden = kind !== 'cargando';
  apenado.hidden = kind !== 'error';
  reintentar.hidden = kind !== 'error';
}

async function loadMenu() {
  setEstado('Leyendo el menú…', 'cargando');
  try {
    const [top, todos] = await Promise.all([api('/guisos/populares'), api('/guisos')]);
    populares.innerHTML = top.map(popular).join('');
    bloquePopulares.hidden = !top.length;
    menu.innerHTML = todos.map(fila).join('');
    setEstado(todos.length ? '' : 'Todavía no hay guisos en el menú.');
  } catch {
    // Estado digno: la página sigue completa y la tienda sigue a un clic.
    setEstado('No pudimos leer el menú. Dale otra vez, o entra a la tienda.', 'error');
  }
}
reintentar.addEventListener('click', loadMenu);
loadMenu();

// ---------- «Visto»: una sola clase para todo lo que reacciona al entrar a pantalla ----------
// Listas que se imprimen, la escarcha, y los botones animados en pantallas táctiles. La animación vive en CSS.

const seen = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('visto');
    seen.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.imprime, .oscuro, .boton, .enlace').forEach((el) => seen.observe(el));

// ---------- Escena «Modo de uso»: el scroll es la línea de tiempo ----------
// JS publica el avance (0 a 1) y el paso activo; el pictograma se mueve en CSS con esa variable.
// Cuando lleguen los cuadros de M6, el mismo avance elige qué cuadro dibuja el <canvas>.

const modo = document.getElementById('modo');
const canvas = document.getElementById('secuencia');
const STEPS = 3;
const REST = 0.06; // reposo al inicio y al final, para que el primer y el último cuadro se asienten
const still = matchMedia('(prefers-reduced-motion: reduce)');
let frames = [];
let queued = false;

function drawFrame(p) {
  const rested = Math.min(1, Math.max(0, (p - REST) / (1 - 2 * REST)));
  const img = frames[Math.round(rested * (frames.length - 1))];
  if (!img?.complete || !img.naturalWidth) return;
  // Los clips son 16:9 y el marco 4:3: se recorta el centro.
  const h = img.naturalHeight;
  const w = Math.round((h * 4) / 3);
  if (canvas.width !== w) { canvas.width = w; canvas.height = h; }
  canvas.getContext('2d').drawImage(img, (img.naturalWidth - w) / 2, 0, w, h, 0, 0, w, h);
}

function progress() {
  queued = false;
  const r = modo.getBoundingClientRect();
  const span = r.height - innerHeight;
  const p = span > 0 && !still.matches ? Math.min(1, Math.max(0, -r.top / span)) : 1;
  modo.style.setProperty('--scroll', p.toFixed(3));
  modo.dataset.step = Math.min(STEPS, 1 + Math.floor(p * STEPS));
  if (frames.length) drawFrame(p);
}
function request() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(progress);
}

if (FRAMES > 0) {
  // Se cargan al acercarse a la escena, no al abrir la página. Con movimiento reducido basta el último cuadro.
  new IntersectionObserver((entries, o) => {
    if (!entries[0].isIntersecting) return;
    o.disconnect();
    const dir = innerWidth < 860 ? 720 : 1280;
    const first = still.matches ? FRAMES - 1 : 0;
    frames = Array.from({ length: FRAMES - first }, (_, i) => {
      const img = new Image();
      img.onload = request;
      img.src = `media/modo/${dir}/${String(first + i + 1).padStart(3, '0')}.webp`;
      return img;
    });
    modo.classList.add('con-secuencia');
    canvas.hidden = false;
  }, { rootMargin: '100% 0px' }).observe(modo);
}

addEventListener('scroll', request, { passive: true });
addEventListener('resize', request);
progress();
