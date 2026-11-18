// Piezas compartidas de la marca, ruta 3 «La barra» (docs/diseno/sistema.md): fuente única para
// la landing, la tienda y los tableros de frontend/marca/. Aquí viven los colores de guiso, el
// contraste, los pictogramas y la charola. El logotipo son archivos: frontend/marca/logo/.
import { esc, slug } from './api.js';

export const NEGRO = '#141210';
export const BLANCO = '#FFFFFF';

// Los 14 del pizarrón, en su orden (docs/negocio/datos.md). El número es el de su charola.
// HIPÓTESIS: cada color se fija con el guiso real delante; hoy sale del nombre y de la descripción general.
export const GUISOS = [
  ['Corazón de vaca enamorada', '#7A2530'],
  ['Chorizo con huevo', '#F2B33D'],
  ['Salpicón', '#DCC9A0'],
  ['Nopalitos', '#55752B'],
  ['Mole con pollo', '#4A2A1C'],
  ['Bistek con papa', '#D2A463'],
  ['Chicharrón en salsa', '#8A9440'],
  ['Rajas con queso y crema', '#35603A'],
  ['Carne en salsa roja', '#A8321C'],
  ['Tinga de res', '#B9471F'],
  ['Barbacoa', '#6B4226'],
  ['Cabeza', '#B3A594'],
  ['Lengua', '#8A4A63'],
  ['Barbacoa de borrego', '#3D4A26'],
].map(([nombre, color], i) => ({ n: String(i + 1).padStart(2, '0'), nombre, color }));

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
// El color de texto que va encima de un fondo: negro o blanco, el que más contraste dé (fórmula WCAG).
export const tinta = (hex) => (ratio(hex, NEGRO) >= ratio(hex, BLANCO) ? NEGRO : BLANCO);

// Pictogramas de despacho. Retícula de 24, margen de 2, formas llenas; trazo (2 de grosor, punta redonda)
// solo donde la forma es una línea: vapor, flama, copo y palomita.
const T = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
export const PICTOS = {
  Charola: '<rect x="2" y="8" width="20" height="3" rx="1.5"/><path d="M4 12h16l-1.4 7.3A2 2 0 0 1 16.6 21H7.4a2 2 0 0 1-2-1.7z"/>',
  Cucharón: '<circle cx="8" cy="16.5" r="5.5"/><rect x="12.6" y="1.5" width="3" height="13" rx="1.5" transform="rotate(38 14.1 8)"/>',
  Vapor: `<path d="M7 21c-2-3 2-5 0-8s2-5 0-8M12 21c-2-3 2-5 0-8s2-5 0-8M17 21c-2-3 2-5 0-8s2-5 0-8" ${T}/>`,
  Reloj: '<path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 3a7 7 0 1 1 0 14 7 7 0 0 1 0-14z"/><path d="M11 7h2v4.6l3.3 2-1 1.7L11 12.7z"/>',
  Bolsa: '<path fill-rule="evenodd" d="M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm2 5v12h10V7z"/><rect x="8.5" y="10" width="7" height="6" rx="3"/>',
  Rompe: '<path d="M5 2h8l7 7v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><path d="M16.5 1l6.5 6.5-2.1 1.3-5.7-5.7z"/>',
  Calienta: `<rect x="2" y="9" width="15" height="5" rx="2.5"/><rect x="15.5" y="10.5" width="7.5" height="2" rx="1"/><path d="M5 22c-1.6-2 1-3 0-5M9.5 22c-1.6-2 1-3 0-5M14 22c-1.6-2 1-3 0-5" ${T}/>`,
  Taco: '<path d="M2 20a10 10 0 0 1 20 0z"/><circle cx="7.5" cy="9" r="2.2"/><circle cx="12" cy="6.5" r="2.2"/><circle cx="16.5" cy="9" r="2.2"/>',
  Congelado: `<path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" ${T}/>`,
  Caja: '<path d="M12 2l9 4.5-9 4.5-9-4.5z"/><path d="M2.5 8.5l8.5 4.3V22l-8.5-4.3zM21.5 8.5L13 12.8V22l8.5-4.3z"/>',
  Lugar: '<path fill-rule="evenodd" d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zm0 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>',
  Listo: '<path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
};
export const picto = (nombre) => `<svg class="picto" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${PICTOS[nombre]}</svg>`;

// ---------- La charola: el módulo de todo lo que muestra un guiso ----------

// Fotos que ya están en media/guisos/<slug>.webp (720 x 540) y <slug>-1024.webp (1024 x 768), recorte 4:3 del original.
// PENDIENTE-CLIENTE: imagen generada con IA, sustituir por foto real antes de publicar o vender.
export const FOTOS = new Set([
  'chorizo-con-huevo', 'salpicon', 'nopalitos', 'mole-con-pollo', 'bistek-con-papa',
  'chicharron-en-salsa', 'rajas-con-queso-y-crema', 'carne-en-salsa-roja', 'tinga-de-res',
]);

const SIZES = '(min-width: 1600px) 17vw, (min-width: 1280px) 20vw, (min-width: 700px) 25vw, 50vw';
const POR_SLUG = new Map(GUISOS.map((g) => [slug(g.nombre), g]));

// Lo que el sistema sabe de un guiso, buscado por su nombre (la API no manda color ni foto).
// Uno que no esté en la tabla va en charola de acero, sin número.
export function guisoDe(nombre) {
  const s = slug(nombre);
  const g = POR_SLUG.get(s);
  return { slug: s, n: g?.n ?? '', color: g?.color ?? '#D9DCDD', foto: FOTOS.has(s) };
}

// href: a dónde lleva la charola (su ficha); toda la zona del guiso se puede tocar.
// titulo: false la deja sin nombre debajo (en la ficha el nombre es el título de la vista).
// Lo de abajo de la charola (nombre y cuerpo). Aparte para poder ponerlo al día sin rehacer la charola.
export const datosDe = (nombre, cuerpo = '', { href = '', titulo = true } = {}) =>
  `${titulo ? `<h3>${href ? `<a class="a-ficha" href="${href}">${esc(nombre)}</a>` : esc(nombre)}</h3>` : ''}${cuerpo}`;

// attrs: atributos de más para la charola (la tienda pone su clave y su firma).
// cargar: 'eager' en la primera fila, para que su foto ya esté al mostrarse.
export function charola(nombre, cuerpo = '', { tag = 'article', cls = '', href = '', titulo = true, attrs = '', cargar = 'lazy' } = {}) {
  const g = guisoDe(nombre);
  // alt vacío: el nombre del guiso está escrito justo debajo.
  // Dos tamaños: 720 px para la retícula y 1024 px para las charolas grandes de pantalla ancha.
  const img = g.foto ? `<img class="foto" src="/media/guisos/${g.slug}.webp" srcset="/media/guisos/${g.slug}.webp 720w, /media/guisos/${g.slug}-1024.webp 1024w" sizes="${SIZES}" alt="" width="720" height="540" loading="${cargar}">` : '';
  return `<${tag} class="charola ${cls}" style="--c:${g.color};--t:${tinta(g.color)}"${attrs ? ` ${attrs}` : ''}>
    <div class="guiso">${img}${g.n ? `<span class="num">${g.n}</span>` : ''}<span class="vapor" aria-hidden="true">${picto('Vapor')}</span></div>
    ${titulo || cuerpo ? `<div class="datos">${datosDe(nombre, cuerpo, { href, titulo })}</div>` : ''}
  </${tag}>`;
}

// Las fotos de charola aparecen con un fundido corto al terminar de cargar, no a pedazos sobre el color
// (barra.css). Solo las que pinta JavaScript (class="foto"): las del HTML no esperan a ningún script.
if (typeof document !== 'undefined' && document.documentElement?.classList) {
  document.documentElement.classList.add('img-funde');
  document.addEventListener('load', (e) => { if (e.target.classList?.contains('foto')) e.target.classList.add('cargada'); }, true);
}
