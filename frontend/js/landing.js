// Landing: «Lo que más sale» en vivo desde la API (Redis), las ollas del héroe y la entrada de cada sección.
// Los guisos salen dos veces en el inicio y ya: las ollas de arriba y esta sección; el resto es información.
// Reúsa el money() de la tienda, la charola de barra.js y los datos ya pedidos de js/datos.js.
import { money, esc } from './api.js';
import { charola } from './barra.js';
import { guardadoDe, traer } from './datos.js';
import { iniciarCabecera, actualizarCabecera } from './cabecera.js';
import { toques } from './toques.js';
import { ligarOllas, moverOllas } from './ollas.js';
import { cualesSalen } from './salen.js';

document.documentElement.classList.add('js');
iniciarCabecera();
toques(); // todo botón se hunde al presionarlo y rebota al soltarlo
moverOllas(); // las ollas del héroe entran una vez (js/ollas.js)

// ---------- Lo que más sale (GET /guisos/populares y GET /guisos) ----------
const populares = document.getElementById('populares');
const nota = document.getElementById('populares-nota');
const ficha = (g) => `/tienda/#guiso/${encodeURIComponent(g.id)}`;
const HUECAS = '<li class="charola hueca" aria-hidden="true"><div class="guiso"></div><div class="datos"><p></p><p></p></div></li>'.repeat(3);

const guiso = (g) => charola(g.nombre, `
    <p class="dato">${esc(g.porciones)} porciones · ${g.stock > 0 ? `quedan ${esc(g.stock)}` : 'Se acabó por hoy'}</p>
    <p class="precio">${money(g.precio_centavos)}</p>${g.stock > 0 ? `
    <a class="btn chico" href="${ficha(g)}">Pedir<span class="sr"> ${esc(g.nombre)}</span></a>` : ''}`, { tag: 'li', cls: g.stock > 0 ? '' : 'agotada', href: ficha(g) });

async function cargar() {
  const ya = [guardadoDe('/guisos/populares'), guardadoDe('/guisos')];
  if (!ya.every(Boolean)) populares.innerHTML = HUECAS;
  try {
    const [top, todos] = ya.every(Boolean) ? ya : await Promise.all([traer('/guisos/populares'), traer('/guisos')]);
    const { lista, enVivo } = cualesSalen(top, todos);
    populares.innerHTML = lista.map(guiso).join('');
    nota.textContent = enVivo ? 'Contados en vivo por los pedidos de la tienda.' : 'Los que más piden en la barra.';
    ligarOllas(todos, ficha);
  } catch {
    populares.innerHTML = '';
    nota.textContent = 'No pudimos leer los guisos ahorita. Están todos en la tienda.';
  }
}
const listo = cargar();

// ---------- Cada sección entra una vez, la primera vez que llega a pantalla (el movimiento vive en CSS) ----------
const llega = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('entra');
    llega.unobserve(e.target);
    setTimeout(() => e.target.classList.add('ya'), 2000); // terminada la entrada: el enrutador no la repite
  }
}, { rootMargin: '0px 0px -12% 0px' });
document.querySelectorAll('main > section:not(.heroe), .barra').forEach((el) => llega.observe(el));

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
for (const id of ['como', 'taqueria']) centro.observe(document.getElementById(id));

// Al regresar desde la tienda sin recargar (js/paginas.js): la cabecera vuelve a ser la de aquí.
addEventListener('tm:pagina', () => {
  if (location.pathname === '/') actualizarCabecera();
});

// El script termina cuando la sección de guisos está pintada: js/paginas.js muestra la landing ya completa.
await listo;
