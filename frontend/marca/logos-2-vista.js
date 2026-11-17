// Página del segundo pase de logotipos (3 y 4): variantes, el sistema híbrido y el juego completo
// de cada candidato. Dibujos en logos-2.js; razonamiento y recomendación en docs/diseno/logos.md.
import { VARIANTES, JUEGOS } from './logos-2.js';

const ctx = (titulo, cls, cuerpo) => `<figure class="ctx ${cls}"><div class="lienzo-l">${cuerpo}</div><figcaption>${titulo}</figcaption></figure>`;

const variante = (v) => `
  <article class="variante" id="v${v.id}">
    <h3><b>${v.id}</b> ${v.nombre}</h3>
    <div class="lienzo-l">${v.svg}</div>
    <div class="par"><div class="lienzo-l tinta-n">${v.svg}</div><div class="lienzo-l tinta-b">${v.svg}</div></div>
    <p>${v.idea}</p>
  </article>`;

const familia = (n, titulo, texto) => `
  <section><h2>${titulo}</h2><p class="idea">${texto}</p>
    <div class="variantes">${VARIANTES.filter((v) => v.id.startsWith(n)).map(variante).join('')}</div></section>`;

const cabecera = (j) => `<div class="cab-m"><span class="lg-cab">${j.horizontal}</span><span class="nav-m"><i>Guisos</i><i>La taquería</i><b>Tienda</b></span></div>`;
const etiqueta = (j) => `<div class="etq-m"><span class="franja-m">09</span><div><strong>Carne en salsa roja</strong><small>Guiso de taquería · al vacío</small><span class="lg-etq">${j.horizontal}</span></div><span class="sello-etq">${j.icono}</span></div>`;
const pestana = (j) => `<div class="pestana"><span class="fav">${j.icono}</span><span>Los Tacos May</span><i>×</i></div>`;

const juego = (j, i) => `
  <section class="concepto" id="j${i}">
    <header><p class="num">Juego completo · candidato ${j.id}</p><h2>${j.nombre}</h2><p class="idea">${j.nota}</p></header>
    <div class="contextos">
      ${ctx('Principal, sobre claro', 'grande', j.principal)}
      ${ctx('Horizontal', '', j.horizontal)}
      ${ctx('Sello', 'sello', j.sello)}
      ${ctx('Una tinta, negro', 'tinta', j.principal)}
      ${ctx('Sobre oscuro', 'oscuro', j.principal)}
      ${ctx('Sobre el rojo de la marca', 'rojo', j.principal)}
      ${ctx('A 24 px', 'chico', `<span class="px24">${j.icono}</span><span class="px48">${j.icono}</span>`)}
      ${ctx('Ícono de pestaña', 'en-pes', pestana(j))}
      ${ctx('En la cabecera de la landing', 'en-cab', cabecera(j))}
      ${ctx('En la etiqueta de la bolsa', 'en-etq', etiqueta(j))}
    </div>
  </section>`;

document.body.insertAdjacentHTML('beforeend', `
  <header class="cab"><p class="migas"><a href="./">← Las tres rutas</a> · <a href="logos.html">Los siete conceptos</a> · <a href="sistema.html">El sistema</a></p>
    <p class="num">Los Tacos May · logotipos, segundo pase</p><h1>El 3 y el 4, afinados</h1>
    <p class="idea">Siete variantes para decidir, una manera de que convivan y el juego completo de cada candidato. Ninguno está aplicado todavía.</p>
    <p class="nota">Letras, cactus y sombrero redibujados: pesos parejos, hueco de la «A» más abierto, espacios ajustados letra por letra, el brazo izquierdo corto y bajo y el derecho largo y alto. «Los Tacos» es el trazo real de Barlow Condensed SemiBold. Cada variante se ve en color y a una tinta, en negro y en blanco. La recomendación está en <code>docs/diseno/logos.md</code>.</p></header>
  <main class="logos">
    ${familia('3', 'Variantes del 3 · La Y es el cactus', 'Cambian tres cosas que se pueden decidir: dónde va el sombrero (o si va), si lleva flores, y si el cactus es rojo como la palabra o negro.')}
    ${familia('4', 'Variantes del 4 · El cactus lleva el nombre', 'El problema era el peso. Tres salidas: aplanarlo en pastilla con todo adentro, vaciarlo a contorno, o ponerlo de pie como sello.')}
    <section><h2>Los dos juntos</h2>
      <p class="idea">Fundirlos en una sola pieza no funciona: los dos ya unen cactus y nombre, así que juntarlos pone un cactus dentro de otro. Lo que sí funciona es repartirles el trabajo: <strong>el 3 firma y el 4 sella.</strong> La palabra va donde hay que leer el nombre (cabecera, etiqueta, caja); el cactus de pie va donde hace falta un símbolo (ícono, cierre, esquina). Nunca pegados.</p>
      <div class="variantes dos"><article class="variante"><h3><b>3A</b> La firma</h3><div class="lienzo-l">${JUEGOS[2].principal}</div></article>
        <article class="variante"><h3><b>4C</b> El sello</h3><div class="lienzo-l alto">${JUEGOS[2].sello}</div></article></div>
    </section>
    ${JUEGOS.map(juego).join('')}
  </main>`);
