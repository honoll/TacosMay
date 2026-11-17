// Sistema de identidad de Los Tacos May, ruta 3 «La barra». Manual escrito: docs/diseno/sistema.md.
// Este archivo es la fuente única de los valores (colores, guisos, pictogramas); la página los pinta
// y calcula el contraste. Cuando se rehaga la landing, estos datos pasan a ser compartidos.
import { cactus } from './marca.js';

export const NEGRO = '#141210';
export const BLANCO = '#FFFFFF';

export const BASE = [
  ['Acero', '#D9DCDD', 'Fondo de barra, marco claro'],
  ['Acero oscuro', '#6F777B', 'Borde de charola, líneas'],
  ['Negro', '#141210', 'Texto, botones, una tinta'],
  ['Crema', '#F7F4EE', 'Papel: fondo de página, etiquetas, tickets'],
  ['Rojo May', '#C8161F', 'Solo la palabra «May»'],
  ['Gris texto', '#4F5659', 'Texto secundario'],
];

export const PLUMONES = [
  ['Negro titula', '#1B1B1B', 'Títulos del menú'],
  ['Rojo nombra', '#C4202A', 'Nombres de guisos'],
  ['Azul cuenta', '#1F4FA3', 'Precios, cantidades y rayas'],
];

// Los 14 del pizarrón, en su orden (docs/negocio/datos.md). El número es el de su charola.
// HIPÓTESIS: cada color se fija con el guiso real delante; hoy sale del nombre y de la descripción general.
export const GUISOS = [
  ['Corazón de vaca enamorada', '#7A2530'],
  ['Chorizo con huevo', '#F2B33D'],
  ['Salpicón', '#C9D46A'],
  ['Nopalitos', '#55752B'],
  ['Mole con pollo', '#4A2A1C'],
  ['Bistek con papa', '#C39A5E'],
  ['Chicharrón en salsa', '#E08A3C'],
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

// ---------- Piezas ----------

const may = '<span class="may">May</span>';
const sello = `<span class="sello">${cactus('sello')}</span>`;
const LOGOS = {
  principal: `<span class="palabras"><span class="los">Los Tacos</span>${may}</span>${sello}`,
  horizontal: `${sello}<span class="palabras fila"><span class="los">Los Tacos</span>${may}</span>`,
  sello: `<span class="sello aro">${cactus('sello')}</span>`,
};
const logo = (v, cls = '') => `<div class="s-logo ${v} ${cls}" role="img" aria-label="Los Tacos May">${LOGOS[v]}</div>`;

const muestra = ([nombre, hex, uso], extra = '') => {
  const t = tinta(hex);
  return `<li style="background:${hex};color:${t}"><strong>${nombre}</strong><span>${hex}</span>${uso ? `<span>${uso}</span>` : ''}<span>texto ${t === NEGRO ? 'negro' : 'blanco'} ${ratio(hex, t).toFixed(1)}:1</span>${extra}</li>`;
};

const vapor = `<span class="vapor" aria-hidden="true">${picto('Vapor')}</span>`;
const charola = (g, cuerpo = '') => `
  <article class="charola" style="--c:${g.color};--t:${tinta(g.color)}">
    <div class="guiso"><span class="num">${g.n}</span>${vapor}</div>
    <div class="datos"><h3>${g.nombre}</h3>${cuerpo}</div>
  </article>`;

const boton = (texto, cls = '') => `<button type="button" class="btn ${cls}">${texto}</button>`;
const G = Object.fromEntries(GUISOS.map((g) => [g.n, g]));
const ESTRELLA = [G['02'], G['08'], G['09']]; // los que más salen, según Alejandro

const fila = (k, v = '—') => `<li><span>${k}</span><i></i><span>${v}</span></li>`;
const etiqueta = (g) => `
  <div class="etq" style="--c:${g.color};--t:${tinta(g.color)}">
    <div class="franja"><span class="num">${g.n}</span></div>
    <div class="cuerpo">
      <strong>${g.nombre}</strong>
      <p class="dato">Guiso de taquería · al vacío</p>
      <ul class="ticket">${fila('Porciones')}${fila('Contenido neto')}${fila('Lote')}${fila('Caducidad')}</ul>
      <p class="dato pasos">${picto('Rompe')} Rompe ${picto('Calienta')} Calienta ${picto('Taco')} Taquea</p>
      <p class="dato">${picto('Congelado')} Conserve en congelación</p>
      <div class="pie">${logo('horizontal', 'mini')}</div>
    </div>
  </div>`;

const VOZ = [
  ['Titulares', ['Ya está hecho.', 'Llegas, comes y te vas.', 'El guiso ya está. Tú nomás calienta.']],
  ['Botones', ['Pedir guisos', 'Agregar', 'Ver el menú', 'Cómo llegar']],
  ['Estados vacíos', ['Tu carrito está vacío. Las charolas, no.', 'Todavía no tienes pedidos.']],
  ['Se acabó y errores', ['Se acabó por hoy.', 'No pudimos leer el menú. Dale otra vez.', 'Tu sesión venció. Entra de nuevo.']],
  ['Etiqueta', ['Rompe. Calienta. Taquea.', 'Ya está hecho. Nomás calienta.']],
];

const seccion = (id, titulo, cuerpo) => `<section id="${id}"><h2>${titulo}</h2>${cuerpo}</section>`;
const no = (html, pie) => `<figure class="no"><div class="lienzo">${html}</div><figcaption>${pie}</figcaption></figure>`;

const pagina = () => `
  <header class="cab"><p class="migas"><a href="./">← Las tres rutas</a></p>
    <p class="num">Los Tacos May · sistema de identidad · ruta 3</p><h1>La barra</h1>
    <p class="idea"><strong>Ya está hecho.</strong> Charolas calientes en fila, cada guiso con su color, «May» siempre presente.</p>
    <p class="nota">Manual a la vista; el texto completo está en <code>docs/diseno/sistema.md</code>. El dibujo de «May» y del cactus es provisional hasta redibujarlos sobre una foto de frente del letrero.</p>
    <nav class="indice" aria-label="Secciones">${[['logotipo', 'Logotipo'], ['color', 'Color'], ['tipografia', 'Tipografía'], ['plumones', 'Plumones'], ['pictogramas', 'Pictogramas'], ['reticula', 'Retícula'], ['materiales', 'Materiales'], ['fotografia', 'Fotografía'], ['voz', 'Voz'], ['movimiento', 'Movimiento'], ['aplicaciones', 'Aplicaciones'], ['nunca', 'Nunca']].map(([i, t]) => `<a href="#${i}">${t}</a>`).join('')}</nav>
  </header>
  <main class="r3 sistema">
  ${seccion('logotipo', 'Logotipo', `
    <div class="rejilla">
      <article class="tarjeta"><h3>Principal</h3><div class="lienzo crema">${logo('principal')}</div><p>«Los Tacos» arriba, «May» al doble, el cactus de sello a la derecha.</p></article>
      <article class="tarjeta"><h3>Horizontal</h3><div class="lienzo crema">${logo('horizontal')}</div><p>Para cabeceras y espacios bajos.</p></article>
      <article class="tarjeta"><h3>Sello solo</h3><div class="lienzo crema">${logo('sello')}</div><p>Ícono, cierre de caja, esquina de etiqueta.</p></article>
      <article class="tarjeta"><h3>Una tinta</h3><div class="lienzo crema">${logo('principal', 'tinta')}</div><p>Todo en negro: sellos, cartón, impresión barata.</p></article>
      <article class="tarjeta"><h3>Sobre acero</h3><div class="lienzo">${logo('principal')}</div><p>El fondo claro de la barra.</p></article>
      <article class="tarjeta"><h3>Sobre oscuro</h3><div class="lienzo oscuro">${logo('principal', 'inv')}</div><p>«May» conserva su rojo; el contorno y lo demás pasan a crema.</p></article>
    </div>
    <div class="rejilla">
      <article class="tarjeta"><h3>Área de respeto</h3><div class="lienzo crema"><div class="respeto">${logo('principal')}</div></div><p>Alrededor, libre, el alto de la «M» de «May».</p></article>
      <article class="tarjeta"><h3>Tamaños mínimos</h3><div class="lienzo crema minimos">${logo('principal', 't120')}${logo('sello', 't24')}</div><p>Principal: 120 px o 30 mm de ancho. Sello: 24 px u 8 mm. Más chico, solo el sello.</p></article>
    </div>
    <h3 class="sub">Usos incorrectos</h3>
    <div class="rejilla nos">
      ${no(logo('principal', 'mal-color'), 'Cambiar el rojo de «May»')}
      ${no(logo('principal', 'mal-contorno'), 'Quitarle el contorno')}
      ${no(logo('principal', 'mal-estira'), 'Estirarlo o inclinarlo')}
      ${no(logo('principal', 'mal-sombra'), 'Ponerle sombras suaves o brillo')}
    </div>`)}

  ${seccion('color', 'Color', `
    <h3 class="sub">Base</h3><ul class="paleta">${BASE.map((c) => muestra(c)).join('')}</ul>
    <h3 class="sub">Un color por guiso <small>(hipótesis hasta ver los guisos reales)</small></h3>
    <ul class="paleta guisos">${GUISOS.map((g) => muestra([`${g.n} · ${g.nombre}`, g.color, ''])).join('')}</ul>
    <p class="nota">El color nunca va solo: siempre lo acompañan el número de charola y el nombre. Los colores claros van siempre dentro del marco de acero.</p>`)}

  ${seccion('tipografia', 'Tipografía', `
    <div class="tipo"><p class="t-display">Ya está hecho.</p><p><strong>Barlow Condensed ExtraBold</strong>, mayúsculas, interlínea 0.9 · títulos y nombres de guiso</p></div>
    <div class="tipo"><p class="t-dato">Charola 09 · 4 porciones · listo</p><p><strong>Barlow Condensed SemiBold</strong>, mayúsculas, espaciado 0.1 em · datos, etiquetas, botones <small>(cifras de ejemplo)</small></p></div>
    <div class="tipo"><p class="t-precio">$ 000</p><p><strong>Barlow Condensed ExtraBold</strong>, cifras alineadas · precios <small>(el valor sale de la API)</small></p></div>
    <div class="tipo"><p class="t-texto">Entras y sales en menos de diez minutos. Los guisos ya están hechos y calientes.</p><p><strong>Barlow Regular</strong> 17 px, interlínea 1.5 · texto. <strong>SemiBold</strong> para resaltar.</p></div>
    <p class="nota">«May» no es una fuente: es un dibujo. Mientras se redibuja del letrero, lo sustituye Alfa Slab One. Todas son SIL Open Font License, en <code>frontend/fuentes/</code>.</p>`)}

  ${seccion('plumones', 'El código de tres plumones (solo en el menú)', `
    <div class="rejilla">
      <article class="tarjeta"><div class="pizarra"><h3>Los Tacos May · Menú</h3><ul>${ESTRELLA.map((g) => `<li>${g.nombre}<i></i><b>$ —</b></li>`).join('')}</ul></div><p>Negro titula, rojo nombra, azul cuenta. Es su pizarrón: se usa en el menú y en ningún otro lado.</p></article>
      <article class="tarjeta"><ul class="paleta">${PLUMONES.map((c) => muestra(c)).join('')}</ul></article>
    </div>`)}

  ${seccion('pictogramas', 'Pictogramas de despacho', `
    <ul class="pictos">${Object.keys(PICTOS).map((n) => `<li>${picto(n)}<span>${n}</span></li>`).join('')}</ul>
    <div class="rejilla"><article class="tarjeta"><div class="lienzo crema"><div class="cuadricula">${picto('Charola')}</div></div><p>Retícula de 24 con margen de 2. Formas llenas; trazo de 2 con punta redonda solo en vapor, flama, copo y palomita. Un solo color.</p></article></div>`)}

  ${seccion('reticula', 'Retícula y composición', `
    <div class="barra">${ESTRELLA.concat(G['05']).map((g) => charola(g)).join('')}</div>
    <p class="nota">La charola es el módulo. Marco de acero de 1/16 de su ancho, separación de 1/8, esquinas redondeadas. En fila: cuatro en escritorio, dos en celular, y el número de charola siempre arriba a la izquierda. Una fila, después texto: nunca dos retículas seguidas.</p>`)}

  ${seccion('materiales', 'Materiales y texturas', `
    <div class="rejilla">
      <article class="tarjeta"><div class="lienzo"><figure class="tx tx-acero"><figcaption>Acero cepillado</figcaption></figure><figure class="tx tx-ticket"><figcaption>Papel de ticket</figcaption></figure></div><p>Acero: fondo de barra y marco de charola. Ticket: datos, recibos, etiqueta. Ninguno va debajo de texto largo ni se usa como adorno.</p></article>
    </div>`)}

  ${seccion('fotografia', 'Fotografía de comida', `
    <div class="rejilla">
      <article class="tarjeta"><div class="lienzo"><div class="foto-esq" style="--c:${G['09'].color}"><span>el guiso llena el cuadro</span></div></div><p><strong>Así sí:</strong> desde arriba, a 90°, el guiso llenando todo el encuadre. El marco de acero lo pone el diseño, no la foto. Luz pareja de barra, sin sombras duras.</p></article>
      <article class="tarjeta"><div class="lienzo"><div class="foto-esq mal" style="--c:${G['09'].color}"><span>plato, mantel, adornos</span></div></div><p><strong>Así no:</strong> en ángulo, con plato decorado, manteles, manos, cubiertos, fondo desenfocado o cilantro puesto para la foto.</p></article>
    </div>`)}

  ${seccion('voz', 'Voz', `
    <div class="rejilla">${VOZ.map(([t, frases]) => `<article class="tarjeta"><h3>${t}</h3><ul class="frases">${frases.map((f) => `<li>${f}</li>`).join('')}</ul></article>`).join('')}</div>
    <p class="nota">De tú, frases cortas, lo importante primero. Sí: guiso, charola, barra, listo, caliente, nomás. No: gourmet, premium, experiencia, artesanal, exquisito.</p>`)}

  ${seccion('movimiento', 'Movimiento: corto, seco, funcional', `
    <div class="rejilla">
      <article class="tarjeta ancha"><h3>Una charola entra a la barra</h3><div class="barra entra" id="demo-entra">${ESTRELLA.concat(G['05']).map((g) => charola(g)).join('')}</div><p>${boton('Repetir', 'sec')} Se desliza 16 px desde la derecha en 180 ms, una tras otra cada 40 ms. El vapor sube una vez.</p></article>
      <article class="tarjeta"><h3>Un botón responde</h3><div class="lienzo crema">${boton('Pedir guisos')}</div><p>La franja de colores se abre; al presionar se hunde 2 px.</p></article>
      <article class="tarjeta"><h3>Cargando</h3><div class="lienzo crema"><span class="cargando" role="img" aria-label="Cargando"><i></i><i></i><i></i></span></div><p>Tres charolas se llenan en secuencia. Con movimiento reducido, todo queda quieto y completo.</p></article>
    </div>`)}

  ${seccion('aplicaciones', 'Aplicaciones', `
    <div class="rejilla">
      <article class="tarjeta"><h3>Etiqueta de la bolsa</h3>${etiqueta(G['09'])}<p>La franja y el número cambian con el guiso. «—» marca datos pendientes del negocio.</p></article>
      <article class="tarjeta"><h3>Tarjeta de guiso en la tienda</h3><div class="barra una">${charola(G['08'], `<p class="dato">Porciones · existencias</p><p class="precio">$ —</p>${boton('Agregar')}`)}</div><p>Precio, porciones y existencias salen de la API.</p></article>
      <article class="tarjeta"><h3>Botones</h3><div class="lienzo crema botones">${boton('Pedir guisos')}${boton('Ver el menú', 'sec')}<a class="enl" href="#aplicaciones">Cómo llegar</a></div><p>Principal: negro con la franja. Secundario: contorno. Enlace: subrayado grueso.</p></article>
      <article class="tarjeta"><h3>Caja de envío</h3><div class="lienzo crema"><div class="caja">${logo('principal', 'tinta')}<p>Ya está hecho.</p><span class="cinta"></span></div></div><p>Cartón natural a una tinta; la cinta lleva la franja de colores.</p></article>
      <article class="tarjeta ancha"><h3>Héroe de la landing</h3><div class="heroe-s">${logo('horizontal', 'mini')}<h3>Ya está hecho.</h3><p>Guisos de Los Tacos May, en bolsa. Rompes, calientas y comes.</p>${boton('Pedir guisos')}<div class="barra">${ESTRELLA.map((g) => charola(g)).join('')}</div></div></article>
      <article class="tarjeta ancha"><h3>Imagen para compartir (1200 × 630)</h3><div class="compartir"><div>${logo('principal')}<p>Ya está hecho.</p></div><div class="barra">${ESTRELLA.map((g) => charola(g)).join('')}</div></div></article>
    </div>`)}

  ${seccion('nunca', 'Lo que nunca se hace', `<ul class="nunca">
      <li>Usar el rojo de «May» en otra cosa que no sea «May».</li>
      <li>Mostrar un color de guiso sin su número y su nombre.</li>
      <li>Ponerle al cactus sarape, huaraches, bigote o cualquier cosa que el letrero no tenga.</li>
      <li>Degradados, brillos, sombras suaves, 3D.</li>
      <li>Fotos en ángulo con plato decorado, o de banco de imágenes.</li>
      <li>Palabras de lujo: gourmet, premium, artesanal, experiencia.</li>
      <li>Prometer envío, tiempos o precios sin confirmar.</li>
      <li>Movimiento que haga esperar o que no explique nada.</li>
    </ul>`)}
  </main>`;

if (globalThis.document?.body.dataset.sistema !== undefined) {
  document.body.insertAdjacentHTML('beforeend', pagina());
  const demo = document.getElementById('demo-entra');
  // Repetir la entrada: se quita y se vuelve a poner la clase para reiniciar la animación CSS.
  demo.parentElement.querySelector('.btn').addEventListener('click', () => {
    demo.classList.remove('entra');
    void demo.offsetWidth;
    demo.classList.add('entra');
  });
}
