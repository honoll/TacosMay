// Landing: las charolas del menú en vivo desde la API y el avance de la escena «Cómo funciona».
// Reúsa el api() y el money() de la tienda, y la charola de barra.js.
import { money, esc } from './api.js';
import { charola, guisoDe } from './barra.js';
import { carrusel } from './carrusel.js';
import { guardadoDe, traer } from './datos.js';
import { iniciarCabecera, actualizarCabecera } from './cabecera.js';

document.documentElement.classList.add('js');
iniciarCabecera();

// ---------- Las charolas, en vivo (GET /guisos/populares y GET /guisos) ----------

// ---------- El héroe: la barra que gira ----------
// Las tres charolas del HTML se quedan donde están (ya se ven y son las que más salen): solo ganan su
// enlace a la ficha. Detrás se agregan los demás guisos con foto, de los mismos datos que la tienda.
const giro = carrusel(document.getElementById('carrusel'));
function llenarCarrusel(todos) {
  giro.rehacer((fila) => {
    const puestas = new Map([...fila.children].map((li) => [li.querySelector('h3')?.textContent.trim(), li]));
    for (const g of todos.filter((x) => guisoDe(x.nombre).foto)) {
      const href = `/tienda/#guiso/${encodeURIComponent(g.id)}`;
      const li = puestas.get(g.nombre);
      if (li) {
        if (!li.querySelector('.a-ficha')) li.querySelector('h3').innerHTML = `<a class="a-ficha" href="${href}">${esc(g.nombre)}</a>`;
      } else {
        fila.insertAdjacentHTML('beforeend', charola(g.nombre, '', { tag: 'li', href }));
      }
    }
  });
}

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
  // Si la tienda ya los pidió, se muestran sin esperar (js/datos.js); si no, charolas huecas mientras tanto.
  const ya = [guardadoDe('/guisos/populares'), guardadoDe('/guisos')];
  if (!ya.every(Boolean)) {
    setEstado('Leyendo el menú…', 'cargando');
    menu.innerHTML = HUECAS;
  }
  try {
    const [top, todos] = ya.every(Boolean) ? ya : await Promise.all([traer('/guisos/populares'), traer('/guisos')]);
    // Cuatro charolas iguales llenan la fila (2 × 2 en celular). Con menos de cuatro guisos vendidos
    // el bloque no sale: rellenarlo con otros diría que «salen» guisos que nadie ha pedido.
    const salen = top.filter((g) => g.vendidos > 0).slice(0, 4);
    populares.innerHTML = salen.map((g) => guiso(g, true)).join('');
    bloquePopulares.hidden = salen.length < 4;
    menu.innerHTML = todos.map((g) => guiso(g)).join('');
    llenarCarrusel(todos);
    setEstado(todos.length ? '' : 'Todavía no hay guisos en el menú.');
  } catch {
    menu.innerHTML = '';
    // Estado digno: la página sigue completa y la tienda sigue a un clic.
    setEstado('No pudimos leer el menú. Dale otra vez, o entra a la tienda.', 'error');
  }
}
reintentar.addEventListener('click', loadMenu);
const menuListo = loadMenu();

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
  if (!como.isConnected) return; // se está viendo la tienda (js/paginas.js)
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

// Al regresar desde la tienda sin recargar (js/paginas.js): la cabecera vuelve a ser la de aquí.
addEventListener('tm:pagina', () => {
  if (!como.isConnected || location.pathname !== '/') return;
  actualizarCabecera();
  progress();
});

// El script termina cuando el menú está pintado: js/paginas.js muestra la landing ya completa.
await menuListo;
