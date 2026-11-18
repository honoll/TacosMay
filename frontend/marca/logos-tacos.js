// La idea de Alejandro (tres tacos dentro del cactus, «MAY» fuera) y cuatro variantes que atacan
// sus puntos débiles. Razonamiento y recomendación: docs/diseno/logos-tacos.md.
// Geometría del 4B (brazos, marco, sombrero, letras de «MAY») tomada de logo/principal.svg.
// Colores por clase, como en logos.css: .t tinta · .r rojo May · .mc marco y tortilla (papel con
// trazo de tinta, 12) · .g1-.g3 relleno de cada taco (color de charola; tinta a una tinta).
import { JUEGOS } from './logos-2.js';

const MAY = 'M0 100L0 0L30 0L56 52L82 0L112 0L112 100L84 100L84 44L66 84L46 84L28 44L28 100ZM117 100L155 0L187 0L225 100L195 100L189 82L153 82L147 100ZM160 62L182 62L171 26ZM219 0L250 0L271 40L292 0L323 0L285 62L285 100L257 100L257 62Z';
const may = (x, y, s) => `<path class="r" transform="translate(${x} ${y}) scale(${s})" d="${MAY}" fill-rule="evenodd" stroke-width="6" stroke-linejoin="round"/>`;

// Sombrero del 4B: copa en pico y ala ancha, ladeado 7°. (cx, cy) es el centro del ala.
const sombrero = (cx, cy, k = 1) => `<g transform="translate(${cx} ${cy}) rotate(-7) scale(${k})"><path class="t" d="M-31.28 -2Q-15.64 -61.2 4.69 -51.41Q25.02 -39.17 31.28 -2Z"/><ellipse class="t" cx="0" cy="0" rx="68" ry="15.64"/></g>`;

// Brazos: [x del marco, y, x de la punta, y de la punta]. Izquierdo corto y bajo, derecho largo y alto.
const brazo = (x0, y0, x1, y1) => `<path class="t trazo" d="M${x0} ${y0}H${x1}V${y1 + 20}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle class="r" cx="${x1}" cy="${y1}" r="8"/>`;
const marco = (x, y, w, h) => `<rect class="mc" x="${x}" y="${y}" width="${w}" height="${h}" rx="26"/>`;

// El taco: la tortilla doblada en media luna (puntas en ±a, doblez de profundidad b) y el relleno
// en tres lóbulos que asoman por la boca. El relleno se dibuja primero y la tortilla lo tapa.
const relleno = (a) => {
  const x1 = a * 0.86, w = (2 * x1) / 3, r = +(w / 2).toFixed(2);
  let d = `M${x1} 8L${x1} -2`;
  for (let i = 1; i <= 3; i++) d += `A${r} ${+(r * 1.25).toFixed(2)} 0 0 0 ${+(x1 - w * i).toFixed(2)} -2`;
  return `${d}L${-x1} 8Z`;
};
export const taco = (cx, cy, { a = 37, b = 33, ang = -30, g = 't' } = {}) =>
  `<g transform="translate(${cx} ${cy}) rotate(${ang})"><path class="${g}" d="${relleno(a)}"/><path class="mc" d="M${-a} 0A${a} ${b} 0 0 0 ${a} 0Z"/></g>`;

const svg = (w, h, cuerpo) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Los Tacos May">${cuerpo}</svg>`;

// El cactus del 4B con su marco, ancho 328 × 98 desde (76, 76).
const cactus = (dentro, hat = 232) => brazo(76, 150, 42, 104) + brazo(404, 136, 438, 72) + marco(76, 76, 328, 98) + dentro + sombrero(hat, 72);
const tres = (color) => [138, 240, 342].map((x, i) => taco(x, 126, { g: color ? `g${i + 1}` : 't' })).join('');

// Un taco grande en un marco casi cuadrado: el sello de T5, que también sirve sola.
const selloTaco = (dx = 0) => `<g transform="translate(${dx} 0)">${brazo(56, 150, 24, 108) + brazo(204, 130, 236, 70) + marco(56, 76, 148, 104) + taco(131, 124, { a: 44, b: 39, ang: -28 }) + sombrero(124, 72, 0.82)}</g>`;

export const VARIANTES_TACOS = [
  {
    id: 'T1', nombre: 'La idea, bien dibujada',
    idea: 'El boceto de Alejandro tal cual: el cactus del 4B se vuelve charola con tres tacos y «MAY» sale arriba a la derecha, pegado al ala del sombrero.',
    pro: 'Dice «tacos» sin leer nada; el marco ya es charola con producto (ruta 3).',
    contra: '«MAY», lo único propio, queda chico y fuera. A 24 px los tacos se vuelven una franja de manchas.',
    svg: svg(480, 200, cactus(tres(false), 200) + may(286, 30, 0.33)),
  },
  {
    id: 'T2', nombre: 'Tacos a color',
    idea: 'El mismo dibujo, con el relleno de cada taco en un color de charola: carne en salsa roja, nopalitos y chorizo con huevo.',
    pro: 'Es la barra en miniatura: un color por guiso. En grande es el más apetitoso.',
    contra: 'Tres colores más en el logotipo; a una tinta vuelve a ser el T1. Los colores compiten con el rojo de «MAY».',
    svg: svg(480, 200, cactus(tres(true), 200) + may(286, 30, 0.33)),
  },
  {
    id: 'T3', nombre: 'May abajo, grande',
    idea: 'Los tres tacos en el cactus arriba, como escudo, y «MAY» debajo a todo lo ancho, en rojo.',
    pro: '«MAY» recupera el peso: se lee primero el nombre, luego los tacos. Funciona en portada, caja y etiqueta grande.',
    contra: 'Es alto: no cabe en una cabecera baja sin achicarse mucho. Pide su versión horizontal aparte.',
    svg: svg(480, 300, cactus(tres(false)) + may(82, 196, 0.98)),
  },
  {
    id: 'T4', nombre: 'May dentro, con un taco',
    idea: 'El 4B de hoy con «MAY» corrido a la izquierda y un taco al final de la charola: «MAY + taco» en una sola línea.',
    pro: 'Es el cambio más chico al logotipo elegido: conserva «MAY» rojo y grande, y agrega el producto.',
    contra: 'Un solo taco, chico, se lee al segundo vistazo. Pierde la fila de la charola, que era lo bonito del boceto.',
    svg: svg(480, 200, cactus(may(100, 102, 0.56) + taco(340, 128, { a: 38, b: 34, ang: -30 }), 196)),
  },
  {
    id: 'T5', nombre: 'Un taco grande y May al lado',
    idea: 'El cactus se vuelve cuadrado y lleva un solo taco grande; «MAY» va a su lado, grande y en rojo.',
    pro: 'El taco, uno y grande, aguanta 24 px y la pestaña. El sello (cactus con taco) se separa solo.',
    contra: 'Ya no es la charola con varios tacos. Lo horizontal es largo: pide cabeceras de al menos 40 px de alto.',
    svg: svg(556, 200, selloTaco() + may(266, 100, 0.8)),
    sello: svg(260, 200, selloTaco()),
  },
];

// Los vigentes, sin tocar, para comparar: 4B (horizontal) y 4C (sello).
const VIGENTE = JUEGOS.find((j) => j.id === '4B');
export const ACTUALES = [
  // La «horizontal» de ese juego es la pastilla rellena; el 4B vigente es la principal sin «LOS TACOS» (= logo/compacta.svg).
  { id: '4B', nombre: 'El logotipo vigente', idea: 'El cuerpo del cactus es el marco; «MAY» rojo dentro.', svg: VIGENTE.principal.replace(/<path class="t lt"[^>]*\/>/, '').replace('0 0 480 212', '0 0 480 186') },
  { id: '4C', nombre: 'El sello vigente', idea: 'El cactus de pie con M, A, Y apiladas.', svg: VIGENTE.sello },
];

// ---------- La página (logos-tacos.html) ----------
// Mete un logotipo dentro de otro SVG (cabeceras de muestra) a un alto dado. Como grupo escalado y no
// como <svg> anidado, porque logos.css le pone width:100% a todo svg dentro de .logos.
const anidar = (s, x, y, h) => {
  const h0 = +s.match(/viewBox="0 0 [\d.]+ ([\d.]+)"/)[1];
  return `<g transform="translate(${x} ${y}) scale(${+(h / h0).toFixed(4)})">${s.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`;
};
const navTexto = (x, y, t) => `<text x="${x}" y="${y}" class="nav-t">${t}</text>`;
const boton = (x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="36" rx="4" class="nav-b"/><text x="${x + w / 2}" y="${y + 24}" class="nav-t nav-bt" text-anchor="middle">Tienda</text>`;
const cab1440 = (s) => `<svg class="cab-svg" viewBox="0 0 1440 84" role="img" aria-label="Cabecera de 1440 px"><rect width="1440" height="84" class="cab-f"/>${anidar(s, 48, 14, 56)}${navTexto(1050, 49, 'Guisos')}${navTexto(1140, 49, 'La taquería')}${boton(1272, 24, 120)}<rect y="82" width="1440" height="2" class="cab-l"/></svg>`;
const cab375 = (s) => `<svg class="cab-svg c375" viewBox="0 0 375 64" role="img" aria-label="Cabecera de 375 px"><rect width="375" height="64" class="cab-f"/>${anidar(s, 16, 12, 40)}${boton(271, 14, 88)}<rect y="62" width="375" height="2" class="cab-l"/></svg>`;

const ctx = (titulo, cls, cuerpo) => `<figure class="ctx ${cls}"><div class="lienzo-l">${cuerpo}</div><figcaption>${titulo}</figcaption></figure>`;
const etiqueta = (s) => `<div class="etq-m"><span class="franja-m">09</span><div><strong>Carne en salsa roja</strong><small>Guiso de taquería · al vacío</small><span class="lg-etq">${s}</span></div></div>`;
const pestana = (s) => `<div class="pestana"><span class="fav">${s}</span><span>Los Tacos May</span><i>×</i></div>`;
const chicos = (s) => `<span class="alto24">${s}</span><span class="alto48">${s}</span>`;

const ficha = (v) => `
  <article class="variante">
    <h3><b>${v.id}</b> ${v.nombre}</h3>
    <div class="lienzo-l">${v.svg}</div>
    <div class="lienzo-l chicos">${chicos(v.sello ?? v.svg)}</div>
    <p>${v.idea}</p>
    ${v.pro ? `<p class="pc"><strong>A favor:</strong> ${v.pro}</p><p class="pc"><strong>En contra:</strong> ${v.contra}</p>` : ''}
    <a class="ver" href="#c${v.id}">Verla en sus contextos ↓</a>
  </article>`;

const contextos = (v) => `
  <section class="concepto" id="c${v.id}">
    <header><p class="num">${v.id}</p><h2>${v.nombre}</h2><p class="idea">${v.idea}</p></header>
    <div class="contextos">
      ${ctx('Grande, sobre claro', 'grande', v.svg)}
      ${ctx(`A 24 px y a 48 px de alto${v.sello ? ' (el sello)' : ''}`, 'chico', chicos(v.sello ?? v.svg))}
      ${ctx('Una tinta, negro', 'tinta', v.svg)}
      ${ctx('En blanco sobre oscuro', 'oscuro', v.svg)}
      ${ctx('Sobre el rojo de la marca', 'rojo', v.svg)}
      ${ctx(`Ícono de pestaña, 16 px${v.sello ? ' (el sello)' : ''}`, 'en-pes', pestana(v.sello ?? v.svg))}
      ${ctx('En la etiqueta de la bolsa', 'en-etq', etiqueta(v.svg))}
      ${ctx('Cabecera a 375 px (tamaño real)', 'ancho en-cab', cab375(v.svg))}
      ${ctx('Cabecera a 1440 px (reducida para caber en la pantalla)', 'ancho en-cab', cab1440(v.svg))}
    </div>
  </section>`;

const T = Object.fromEntries(VARIANTES_TACOS.map((v) => [v.id, v]));
const TODOS = [...VARIANTES_TACOS, ...ACTUALES];

export const pagina = () => `
  <header class="cab"><p class="migas"><a href="./">← Marca</a> · <a href="logos-2.html">Segundo pase (3 y 4)</a> · <a href="sistema.html">El sistema</a></p>
    <p class="num">Los Tacos May · logotipos, la idea de los tacos</p><h1>Tacos en la charola</h1>
    <p class="idea">El boceto de Alejandro: el cactus del 4B con tres tacos dentro y «MAY» arriba a la derecha. Aquí está bien dibujado, con cuatro variantes que atacan sus puntos débiles, junto al 4B y el 4C de hoy. Nada está aplicado.</p>
    <p class="nota">El taco es una media luna inclinada con el relleno macizo asomando en tres lóbulos, en el mismo trazo que el marco. El relleno a línea se probó y se descartó: con ese trazo los lóbulos se cierran en manchas. Brazos, marco, sombrero y letras de «MAY» son los del 4B. El razonamiento y la recomendación están en <code>docs/diseno/logos-tacos.md</code>.</p></header>
  <main class="logos">
    <section><h2>De un vistazo</h2>
      <p class="idea">Cada una grande y a 24 y 48 px de alto. Las cinco primeras son nuevas; las dos últimas, las vigentes.</p>
      <div class="variantes">${TODOS.map(ficha).join('')}</div></section>
    <section><h2>Lo que propongo: un sistema de dos piezas</h2>
      <p class="idea"><strong>T3 como logotipo grande y el sello de T5 para todo lo chico;</strong> en una línea (cabecera, etiqueta) van el sello y «MAY» juntos, que es el T5. La fila de tacos vive donde hay tamaño para verla; donde no lo hay, un taco grande.</p>
      <div class="variantes">
        <article class="variante"><h3><b>T3</b> Grande: portada, caja, bolsa</h3><div class="lienzo-l">${T.T3.svg}</div></article>
        <article class="variante"><h3><b>T5</b> En una línea: cabecera, etiqueta</h3><div class="lienzo-l">${T.T5.svg}</div></article>
        <article class="variante"><h3><b>T5</b> Sello: pestaña, esquina, cierre</h3><div class="lienzo-l">${T.T5.sello}</div><div class="lienzo-l chicos">${chicos(T.T5.sello)}${pestana(T.T5.sello)}</div></article>
      </div></section>
    ${TODOS.map(contextos).join('')}
  </main>`;

if (typeof document !== 'undefined') document.body.insertAdjacentHTML('beforeend', pagina());
