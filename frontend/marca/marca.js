// Tableros de exploración de marca de Los Tacos May (fase 6 del proceso: territorios visuales).
// Una sola fuente para las tres rutas y para la comparación. Todo es tipografía, color y dibujo
// vectorial propio: exploración de sistema, no arte final. Razonamiento: docs/diseno/rutas.md.

// El cactus del letrero (docs/negocio/fotos/rotulo-logo.png), redibujado en vector: tronco rayado,
// brazo izquierdo horizontal y derecho que sube, flores en las puntas, sombrero ladeado, chapas.
// modo: 'color' (pintado), 'linea' (plumón), 'sello' (una tinta). Provisional: el definitivo se
// redibuja del original con la foto de frente.
function cactus(modo = 'color') {
  const p = {
    color: { cuerpo: '#2f9e44', raya: '#8ed66b', sombrero: '#ffcf1f', flor: '#f0566f', ojo: '#fff', boca: '#e3202c', chapa: '#f59aa8', trazo: '#141210', w: 5 },
    linea: { cuerpo: 'var(--papel)', raya: 'currentColor', sombrero: 'var(--papel)', flor: 'var(--papel)', ojo: 'var(--papel)', boca: 'none', chapa: 'none', trazo: 'currentColor', w: 4 },
    sello: { cuerpo: 'currentColor', raya: 'var(--papel)', sombrero: 'var(--papel)', flor: 'currentColor', ojo: 'var(--papel)', boca: 'var(--papel)', chapa: 'none', trazo: 'currentColor', w: 5 },
  }[modo];
  const brazos = 'M100 160L36 134M146 160l52-44';
  return `<svg viewBox="0 0 240 300" role="img" aria-label="El cactus de Los Tacos May"><g stroke="${p.trazo}" stroke-linecap="round" stroke-linejoin="round">
    <g fill="${p.flor}" stroke-width="${p.w - 1}">
      <ellipse cx="20" cy="98" rx="9" ry="14" transform="rotate(-24 20 98)"/><ellipse cx="8" cy="124" rx="9" ry="14" transform="rotate(-78 8 124)"/>
      <ellipse cx="204" cy="78" rx="9" ry="14" transform="rotate(8 204 78)"/><ellipse cx="224" cy="96" rx="9" ry="14" transform="rotate(58 224 96)"/>
    </g>
    <path d="${brazos}" fill="none" stroke-width="${38 + 2 * p.w}"/><path d="${brazos}" fill="none" stroke="${p.cuerpo}" stroke-width="38"/>
    <path d="M90 292V86a31 31 0 0 1 62 0v206z" fill="${p.cuerpo}" stroke-width="${p.w}"/>
    <path d="M106 150v132M121 150v134M136 150v132M92 153L42 132M152 150l40-34" fill="none" stroke="${p.raya}" stroke-width="${modo === 'linea' ? 2 : 5}"/>
    <path d="M96 62Q108 6 128 18q14 10 16 40z" fill="${p.sombrero}" stroke-width="${p.w}"/>
    <ellipse cx="120" cy="62" rx="52" ry="13" transform="rotate(-10 120 62)" fill="${p.sombrero}" stroke-width="${p.w}"/>
    <g fill="${p.ojo}" stroke-width="3.5"><ellipse cx="108" cy="108" rx="10" ry="14"/><ellipse cx="134" cy="108" rx="10" ry="14"/></g>
    <g stroke="none" fill="${modo === 'sello' ? 'currentColor' : p.trazo}"><circle cx="110" cy="103" r="4.5"/><circle cx="132" cy="103" r="4.5"/></g>
    <g stroke="none" fill="${p.chapa}"><circle cx="98" cy="128" r="6"/><circle cx="144" cy="128" r="6"/></g>
    <path d="M106 132q15 22 32 0-16 7-32 0z" fill="${p.boca}" stroke-width="3.5"/>
  </g></svg>`;
}

const HEROE_SUB = 'Guisos de Los Tacos May, en bolsa. Rompes, calientas y comes.';
const GUISO = 'Carne en salsa roja'; // uno de los tres que más salen (docs/negocio/datos.md)

// ---------- Dibujos ----------

// Un taco, en el estilo de ilustración de cada ruta.
function taco(modo) {
  if (modo === 'picto') { // ruta 3: pictogramas de despacho, geométricos, sin contorno a mano
    return `<svg viewBox="0 0 120 80" role="img" aria-label="Pictogramas: charola con vapor y cucharón"><g fill="currentColor">
      <rect x="6" y="38" width="66" height="30" rx="5"/><rect x="2" y="32" width="74" height="8" rx="3"/>
      <path d="M22 26q-6-8 0-16M39 26q-6-8 0-16M56 26q-6-8 0-16" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <circle cx="100" cy="56" r="13"/><rect x="97" y="8" width="6" height="40" rx="3"/></g></svg>`;
  }
  const l = modo === 'linea';
  const f = (c) => (l ? 'none' : c);
  return `<svg viewBox="0 0 120 80" role="img" aria-label="Un taco"><g stroke="${l ? 'currentColor' : '#141210'}" stroke-width="${l ? 3 : 4}" stroke-linejoin="round" stroke-linecap="round">
    <path d="M14 62A46 46 0 0 1 106 62Z" fill="${f('#e2a52c')}"/>
    <ellipse cx="60" cy="44" rx="38" ry="15" fill="${f('#7c2a14')}"/>
    <path d="M40 40h8M58 34h8M76 42h8" fill="none" stroke="${l ? 'currentColor' : '#2f9e44'}"/>
    <path d="M14 70A46 20 0 0 1 106 70Z" fill="${f('#ffcf1f')}"/></g></svg>`;
}

const palabras = `<span class="palabras"><span class="los">Los</span><span class="tacos">Tacos</span><span class="may">May</span></span>`;
const raya = `<svg class="subraya" viewBox="0 0 200 14" aria-hidden="true" preserveAspectRatio="none"><path d="M3 8q24-9 48 0t48 0 48 0 48-2" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`;
const bolsa = (etiqueta) => `<div class="mock bolsa-m"><div class="guiso-m"></div><div class="etiqueta">${etiqueta}</div></div>`;

// ---------- Las tres rutas ----------

const RUTAS = [
  {
    n: 1, nombre: 'El letrero', distancia: 'La más cercana a lo que ya existe',
    idea: 'Todo lo pinta la misma brocha que pintó «May»: madera, color plano y contorno negro.',
    conserva: ['El letrero completo: «May» rojo, escalonado, contorno negro', 'El cactus a todo color, como anfitrión', 'La madera cruda como fondo', 'La paleta del rótulo'],
    pule: ['El letrero se redibuja del original, sin enderezarlo', 'El cactus pasa de dibujo a personaje, con poses', 'Una letra de imprenta con remates cuadrados acompaña al rótulo'],
    deja: ['El código de plumones del pizarrón queda solo en el menú', 'El baño maría y la barra no aparecen'],
    paleta: [['Madera', '#EAD7B0', 'Fondo'], ['Negro contorno', '#141210', 'Texto y contornos'], ['Amarillo sombrero', '#FFCF1F', 'Botones, «Los Tacos»'], ['Rojo May', '#C8161F', '«May», acentos'], ['Verde cactus', '#1D6B30', 'Bloques con texto'], ['Rosa flor', '#F0566F', 'Solo ilustración']],
    tipos: [['Alfa Slab One', 'Títulos: mayúsculas gruesas con remates cuadrados, como las del letrero', 'EL GUISO YA ESTÁ HECHO', 'f-slab'], ['Atkinson Hyperlegible', 'Texto: clara y sin adorno, se lee de un vistazo', 'Llegas, comes y te vas. Catorce guisos, calientes desde temprano.', 'f-atk']],
    logo: `<div class="logo">${cactus('color')}${palabras}</div>`,
    logoNota: 'El letrero mismo, redibujado: tres renglones que suben a la derecha, «May» al doble y en rojo, contorno negro con más grosor hacia abajo.',
    personaje: `<div class="pers">${cactus('color')}</div>`,
    personajeNota: 'A todo color y con contorno negro irregular. Es quien recibe: aparece una vez por pieza, grande.',
    ilustracion: [taco('color'), 'Tinta plana, contorno negro de grosor desigual, una sola sombra plana. Como pintado con esmalte.'],
    foto: ['<div class="esq esq-1"><i></i><b></b></div>', 'Desde arriba, sobre madera clara; el guiso en su recipiente, luz de lado. La comida es foto; lo demás, pintura.'],
    texturas: [['tx-madera', 'Tablón con juntas'], ['tx-brocha', 'Brochazo de esmalte']],
    heroe: `<div class="mock heroe-m"><div class="logo chico">${palabras}</div><h3>El guiso ya está hecho.</h3><p>${HEROE_SUB}</p><span class="btn">Pedir guisos</span><div class="cx">${cactus('color')}</div></div>`,
    etiqueta: bolsa(`<div class="logo chico">${palabras}</div><strong>${GUISO}</strong><small>Guiso de taquería · al vacío</small>`),
    boton: ['Amarillo del sombrero, contorno negro y sombra dura, como letra de rótulo. Al pasar el cursor se levanta.'],
    riesgo: 'Es el territorio de las taquerías de diseño (rótulo recreado). Aquí es auténtico, pero se parece a lo que otros imitan, y no dice nada de la rapidez.',
  },
  {
    n: 2, nombre: 'El pizarrón', distancia: 'A medio camino',
    idea: 'La marca se escribe como su menú: negro titula, rojo nombra, azul cuenta.',
    conserva: ['El código de tres plumones, tal cual', 'El menú como lista, ordenado y a la vista', '«May» en rojo', 'El humor de los nombres («corazón de vaca enamorada»)'],
    pule: ['La letra a mano se vuelve legible y pareja', 'El cactus se dibuja a plumón, como apunte al margen'],
    deja: ['La madera como fondo', 'El contorno negro grueso y los colores planos del rótulo', 'El amarillo, salvo como resaltador'],
    paleta: [['Blanco pizarrón', '#FFFDF7', 'Fondo'], ['Negro plumón', '#1B1B1B', 'Titula'], ['Rojo plumón', '#C4202A', 'Nombra: guisos, «May»'], ['Azul plumón', '#1F4FA3', 'Cuenta: precios, datos, rayas'], ['Resaltador', '#FFE45C', 'Lo que se puede tocar'], ['Cartón', '#B89A63', 'Orilla del pizarrón']],
    tipos: [['Kalam Bold', 'Títulos y nombres: letra a mano de plumón, legible', 'Ya está hecho.', 'f-kalam b'], ['Kalam Regular', 'Listas y notas', 'Chorizo con huevo · Rajas con queso y crema', 'f-kalam'], ['Atkinson Hyperlegible', 'Letra chica y párrafos largos', 'Lo que no se escribe a mano: avisos, condiciones, datos.', 'f-atk']],
    logo: `<div class="logo"><span class="palabras"><span class="los">Los Tacos</span> <span class="may">May${raya}</span></span><span class="cx">${cactus('linea')}</span></div>`,
    logoNota: '«Los Tacos» en negro, «May» en rojo y subrayado en azul: el nombre escrito con los tres plumones. Se aleja del dibujo del letrero.',
    personaje: `<div class="pers">${cactus('linea')}</div>`,
    personajeNota: 'A línea, con un solo plumón. Vive en los márgenes: señala, palomea, anota. Nunca relleno.',
    ilustracion: [taco('linea'), 'Solo línea de plumón, una tinta por dibujo; el rayado hace de sombra. Flechas, palomitas y subrayados son parte del sistema.'],
    foto: ['<div class="esq esq-2"><i></i><b>carne en salsa roja</b></div>', 'El guiso recortado sobre blanco, visto desde arriba, con anotaciones a plumón encima: nombre en rojo, dato en azul.'],
    texturas: [['tx-pizarron', 'Pizarrón con borrones'], ['tx-carton', 'Orilla de cartón']],
    heroe: `<div class="mock heroe-m"><div class="logo chico"><span class="palabras"><span class="los">Los Tacos</span> <span class="may">May</span></span></div><h3>Ya está hecho.</h3><ul><li>Chorizo con huevo<em>listo</em></li><li>Rajas con queso y crema<em>listo</em></li><li>Carne en salsa roja<em>listo</em></li></ul><span class="btn">Pedir guisos</span><div class="cx">${cactus('linea')}</div></div>`,
    etiqueta: bolsa(`<strong>${GUISO}</strong>${raya}<small>Los Tacos <b>May</b> · al vacío</small><span class="paloma">congelado</span>`),
    boton: ['Recuadro trazado a plumón y resaltador amarillo. Al pasar el cursor se palomea en azul.'],
    riesgo: 'Mal ejecutado se ve improvisado o infantil. Y un fondo blanco con letra a mano lo puede tener cualquiera: depende por completo del rigor del sistema de tres colores.',
  },
  {
    n: 3, nombre: 'La barra', distancia: 'La más atrevida',
    idea: 'Lo que ves al llegar: charolas calientes en fila, cada guiso con su color, listo para servirse.',
    conserva: ['«May» del letrero, rojo y con contorno, como sello', 'Los colores de los guisos: de ahí sale la paleta', 'El baño maría y la barra: la verdad del negocio', 'El cactus, reducido a sello'],
    pule: ['Cada guiso recibe su color y su charola: sirve para 14 etiquetas', 'El orden por precio del pizarrón se vuelve retícula'],
    deja: ['La madera', 'La letra pintada multicolor fuera del logotipo', 'El cactus como personaje con poses'],
    paleta: [['Acero', '#D9DCDD', 'Fondo, charolas'], ['Negro', '#141210', 'Texto, botones'], ['Rojo May', '#C8161F', '«May» y nada más'], ['Salsa roja', '#A8321C', 'Carne en salsa roja, tinga'], ['Chorizo con huevo', '#F2B33D', 'Su guiso'], ['Rajas', '#35603A', 'Su guiso'], ['Mole', '#4A2A1C', 'Su guiso'], ['Crema', '#F7F4EE', 'Papel, tickets']],
    tipos: [['Barlow Condensed ExtraBold', 'Títulos y nombres de guiso: angosta y fuerte, se lee de lejos y de prisa', 'YA ESTÁ HECHO', 'f-barc x'], ['Barlow Condensed SemiBold', 'Datos, etiquetas, números', 'PORCIONES · LISTO EN LA BARRA', 'f-barc'], ['Barlow', 'Texto', 'Entras y sales en menos de diez minutos.', 'f-bar']],
    logo: `<div class="logo"><span class="palabras"><span class="los">Los Tacos</span><span class="may">May</span></span><span class="cx">${cactus('sello')}</span></div>`,
    logoNota: '«May» redibujado del letrero, rojo con contorno negro, sobre placa de acero; «Los Tacos» en angosta. El cactus, de sello, a un lado.',
    personaje: `<div class="pers sellos">${cactus('sello')}${cactus('sello')}${cactus('sello')}</div>`,
    personajeNota: 'A una tinta, chico, como sello de garantía en una esquina. No tiene poses ni protagoniza.',
    ilustracion: [taco('picto'), 'Pictogramas de despacho: charola, cucharón, vapor, reloj. Formas llenas y geométricas, sin contorno a mano.'],
    foto: ['<div class="esq esq-3"><i></i><b>CARNE EN SALSA ROJA</b></div>', 'La charola de acero desde arriba, llenando el encuadre: el guiso es el color. Luz de barra y vapor.'],
    texturas: [['tx-acero', 'Acero cepillado'], ['tx-ticket', 'Papel de ticket']],
    heroe: `<div class="mock heroe-m"><div class="logo chico"><span class="palabras"><span class="los">Los Tacos</span><span class="may">May</span></span></div><h3>Ya está hecho.</h3><div class="charolas"><i style="--c:#A8321C">Carne en salsa roja</i><i style="--c:#F2B33D;--t:#141210">Chorizo con huevo</i><i style="--c:#35603A">Rajas</i><i style="--c:#4A2A1C">Mole con pollo</i></div><span class="btn">Pedir guisos</span></div>`,
    etiqueta: bolsa(`<strong>${GUISO}</strong><small>Rompe · Calienta · Taquea</small><div class="pie-e"><span class="palabras"><span class="los">Los Tacos</span><span class="may">May</span></span>${cactus('sello')}</div>`),
    boton: ['Negro, con la franja de colores de los guisos a la izquierda. Al pasar el cursor la franja se abre.'],
    riesgo: 'Es la que más se aleja de lo que la gente ya reconoce (madera, cactus a color). Puede sentirse fría, de comedor industrial, si se pierde el «May» pintado.',
  },
];

// ---------- Armado de páginas ----------

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

// Cada muestra dice con qué color de texto pasa AA y con cuánto, calculado aquí (fórmula WCAG).
function muestra([nombre, hex, uso]) {
  const negro = ratio(hex, '#141210');
  const blanco = ratio(hex, '#FFFFFF');
  const mejor = negro >= blanco ? ['#141210', 'negro', negro] : ['#FFFFFF', 'blanco', blanco];
  return `<li style="background:${hex};color:${mejor[0]}"><strong>${nombre}</strong><span>${hex}</span><span>${uso}</span><span>texto ${mejor[1]} ${mejor[2].toFixed(1)}:1</span></li>`;
}

const lista = (titulo, items) => `<div><h3>${titulo}</h3><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul></div>`;
const tarjeta = (titulo, cuerpo, nota) => `<article class="tarjeta"><h3>${titulo}</h3><div class="lienzo">${cuerpo}</div><p>${nota}</p></article>`;
const boton = (r) => `<div class="lienzo"><button type="button" class="btn">Pedir guisos</button></div><p>${r.boton[0]}</p>`;

const completo = (r) => `
  <header class="cab"><p class="migas"><a href="./">← Las tres rutas</a></p>
    <p class="num">Ruta ${r.n} · ${r.distancia}</p><h1>${r.nombre}</h1><p class="idea">${r.idea}</p></header>
  <main class="r${r.n}">
    <section class="trio">${lista('Conserva', r.conserva)}${lista('Pule', r.pule)}${lista('Deja', r.deja)}</section>
    <section><h2>Paleta</h2><ul class="paleta">${r.paleta.map(muestra).join('')}</ul></section>
    <section><h2>Tipografías</h2>${r.tipos.map(([f, uso, m, cls]) => `<div class="tipo"><p class="spec ${cls}">${m}</p><p><strong>${f}</strong> · ${uso}</p></div>`).join('')}
      <p class="nota">Todas con licencia SIL Open Font License y guardadas en <code>frontend/fuentes/</code>.</p></section>
    <section class="rejilla">
      ${tarjeta('Logotipo', r.logo, r.logoNota)}
      ${tarjeta('Personaje', r.personaje, r.personajeNota)}
      ${tarjeta('Ilustración', `<div class="ilus">${r.ilustracion[0]}</div>`, r.ilustracion[1])}
      ${tarjeta('Fotografía de comida <small>(esquema, no foto)</small>', r.foto[0], r.foto[1])}
      ${tarjeta('Texturas', r.texturas.map(([c, n]) => `<figure class="tx ${c}"><figcaption>${n}</figcaption></figure>`).join(''), 'Hechas aquí con CSS para explorar; las definitivas salen de foto del material real.')}
    </section>
    <section><h2>Tres aplicaciones</h2><div class="rejilla">
      <article class="tarjeta ancha"><h3>Héroe de la landing</h3>${r.heroe}</article>
      <article class="tarjeta"><h3>Etiqueta de la bolsa</h3>${r.etiqueta}</article>
      <article class="tarjeta"><h3>Un botón</h3>${boton(r)}</article>
    </div></section>
    <section class="riesgo"><h2>Riesgo</h2><p>${r.riesgo}</p></section>
  </main>
  <nav class="otras">${RUTAS.filter((o) => o !== r).map((o) => `<a href="ruta-${o.n}.html">Ruta ${o.n} · ${o.nombre} →</a>`).join('')}</nav>`;

const comparacion = () => `
  <header class="cab"><p class="num">Los Tacos May · exploración de marca</p><h1>Tres rutas para una misma idea</h1>
    <p class="idea"><strong>Idea central:</strong> Ya está hecho. <strong>Promesa:</strong> guiso de olla sin la espera.</p>
    <p class="nota">Son tableros de exploración: tipografía, color y dibujo vectorial provisionales, sin imágenes generadas. Sirven para elegir un rumbo, no son arte final. El razonamiento y la recomendación están en <code>docs/diseno/rutas.md</code>.</p>
    <p class="elegida"><strong>Elegida: ruta 3, «La barra».</strong> <a class="ver" href="sistema.html">Ver el sistema de identidad →</a></p>
    <p class="elegida"><strong>Logotipo elegido: 4B como principal y 4C como sello.</strong> Exploración: <a class="ver" href="logos.html">Los siete conceptos →</a> <a class="ver" href="logos-2.html">Segundo pase del 3 y el 4 →</a></p></header>
  <main class="comparar">${RUTAS.map((r) => `
    <section class="col r${r.n}"><p class="num">Ruta ${r.n} · ${r.distancia}</p><h2>${r.nombre}</h2><p class="idea">${r.idea}</p>
      <div class="lienzo">${r.logo}</div>
      <ul class="paleta chica">${r.paleta.map(([n, h]) => `<li style="background:${h}" title="${n} ${h}"><span class="sr">${n} ${h}</span></li>`).join('')}</ul>
      ${r.heroe}${r.etiqueta}
      <div class="lienzo"><button type="button" class="btn">Pedir guisos</button></div>
      <p><a class="ver" href="ruta-${r.n}.html">Ver el tablero completo de la ruta ${r.n} →</a></p>
    </section>`).join('')}</main>`;

// Este módulo también presta el cactus a sistema.js: solo arma página donde hay data-ruta.
const cual = globalThis.document?.body.dataset.ruta;
if (cual) document.body.insertAdjacentHTML('beforeend', cual === 'todas' ? comparacion() : completo(RUTAS[cual - 1]));
