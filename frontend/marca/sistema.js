// Sistema de identidad de Los Tacos May, ruta 3 «La barra». Manual escrito: docs/diseno/sistema.md.
// Los valores compartidos (colores de guiso, pictogramas, cactus) viven en ../js/barra.js; aquí
// están los que solo usa el manual, y la página que los pinta.
import { NEGRO, GUISOS, ratio, tinta, PICTOS, picto } from '../js/barra.js';

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


// ---------- Piezas ----------

// El logotipo son archivos: logo/principal.svg (4B con «Los Tacos»), logo/compacta.svg (4B sin texto)
// y logo/sello.svg (4C), cada uno también a una tinta en negro (-negro) y en blanco (-blanco).
const logo = (archivo, cls = '') => `<img class="s-logo ${cls}" src="logo/${archivo}.svg" alt="Los Tacos May">`;

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
      <div class="pie">${logo('compacta', 'mini')}</div>
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
    <p class="idea"><strong>Ya está hecho.</strong> Charolas calientes en fila, cada guiso con su color, y el cactus de May firmando.</p>
    <p class="nota">Manual a la vista; el texto completo está en <code>docs/diseno/sistema.md</code>. El logotipo es el que eligió Alejandro: 4B como principal y 4C como sello.</p>
    <nav class="indice" aria-label="Secciones">${[['logotipo', 'Logotipo'], ['color', 'Color'], ['tipografia', 'Tipografía'], ['plumones', 'Plumones'], ['pictogramas', 'Pictogramas'], ['reticula', 'Retícula'], ['materiales', 'Materiales'], ['fotografia', 'Fotografía'], ['voz', 'Voz'], ['movimiento', 'Movimiento'], ['aplicaciones', 'Aplicaciones'], ['nunca', 'Nunca']].map(([i, t]) => `<a href="#${i}">${t}</a>`).join('')}</nav>
  </header>
  <main class="r3 sistema">
  ${seccion('logotipo', 'Logotipo', `
    <div class="rejilla">
      <article class="tarjeta"><h3>Principal</h3><div class="lienzo crema">${logo('principal')}</div><p>El cactus lleva el nombre: «May» en rojo dentro del cuerpo, los dos brazos a distinta altura, el sombrero ladeado y «Los Tacos» debajo. Desde 200 px de ancho.</p></article>
      <article class="tarjeta"><h3>Compacta</h3><div class="lienzo crema">${logo('compacta')}</div><p>Lo mismo sin «Los Tacos», para cabeceras y espacios bajos. De 96 a 200 px de ancho.</p></article>
      <article class="tarjeta"><h3>Sello</h3><div class="lienzo crema">${logo('sello', 'alto')}</div><p>El cactus de pie con las tres letras apiladas. Ícono de pestaña, esquina de etiqueta, cierre de caja, y todo lo que mida menos de 96 px de ancho.</p></article>
      <article class="tarjeta"><h3>Una tinta, negro</h3><div class="lienzo">${logo('principal-negro')}${logo('sello-negro', 'alto chico')}</div><p>Cartón, sellos de goma, impresión barata. También sobre acero.</p></article>
      <article class="tarjeta"><h3>Sobre oscuro</h3><div class="lienzo oscuro">${logo('principal-blanco')}${logo('sello-blanco', 'alto chico')}</div><p>Una tinta en blanco. Sobre negro no se usa la versión a color.</p></article>
      <article class="tarjeta"><h3>Sobre el rojo</h3><div class="lienzo rojo">${logo('principal-blanco')}${logo('sello-blanco', 'alto chico')}</div><p>La misma versión en blanco.</p></article>
    </div>
    <div class="rejilla">
      <article class="tarjeta"><h3>Área de respeto</h3><div class="lienzo crema"><div class="respeto">${logo('principal')}</div></div><p>Alrededor, libre, el alto de la copa del sombrero.</p></article>
      <article class="tarjeta"><h3>Tamaños mínimos</h3><div class="lienzo crema minimos">${logo('principal', 't200')}${logo('compacta', 't96')}${logo('sello', 't24')}</div><p>Principal: 200 px o 50 mm de ancho. Compacta: 96 px o 25 mm. Sello: 24 px u 8 mm de alto. Si no cabe uno, se usa el siguiente.</p></article>
    </div>
    <h3 class="sub">Usos incorrectos</h3>
    <div class="rejilla nos">
      ${no(logo('compacta', 'mal-color'), 'Cambiarle los colores')}
      ${no(logo('compacta', 'mal-estira'), 'Estirarlo o inclinarlo')}
      ${no(logo('compacta', 'mal-sombra'), 'Ponerle sombras suaves o brillo')}
      ${no(`<div class="mal-fondo">${logo('compacta')}</div>`, 'Ponerlo sobre una foto o un color de guiso')}
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
    <p class="nota">«May» y «Los Tacos» del logotipo no son texto: son dibujo, dentro de sus archivos. Todas las fuentes son SIL Open Font License, en <code>frontend/fuentes/</code>.</p>`)}

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
      <article class="tarjeta"><h3>Caja de envío</h3><div class="lienzo crema"><div class="caja">${logo('compacta-negro', 'mini')}<p>Ya está hecho.</p><span class="cinta"></span></div></div><p>Cartón natural a una tinta; la cinta lleva la franja de colores.</p></article>
      <article class="tarjeta ancha"><h3>Héroe de la landing</h3><div class="heroe-s">${logo('compacta', 'mini')}<h3>Ya está hecho.</h3><p>Guisos de Los Tacos May, en bolsa. Rompes, calientas y comes.</p>${boton('Pedir guisos')}<div class="barra">${ESTRELLA.map((g) => charola(g)).join('')}</div></div></article>
      <article class="tarjeta ancha"><h3>Imagen para compartir (1200 × 630)</h3><div class="compartir"><div>${logo('principal')}<p>Ya está hecho.</p></div><div class="barra">${ESTRELLA.map((g) => charola(g)).join('')}</div></div></article>
    </div>`)}

  ${seccion('nunca', 'Lo que nunca se hace', `<ul class="nunca">
      <li>Usar el rojo de «May» en otra cosa que no sea el logotipo.</li>
      <li>Mostrar un color de guiso sin su número y su nombre.</li>
      <li>Redibujar o «adornar» al cactus: sarape, huaraches, bigote, cara.</li>
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
