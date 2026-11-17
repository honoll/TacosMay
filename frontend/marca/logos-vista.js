// Página de la exploración de logotipos: pinta cada concepto de logos.js en sus contextos.
// Razonamiento y recomendación: docs/diseno/logos.md.
import { LOGOS } from './logos.js';

const ctx = (titulo, cls, cuerpo) => `<figure class="ctx ${cls}"><div class="lienzo-l">${cuerpo}</div><figcaption>${titulo}</figcaption></figure>`;

const cabecera = (l) => `<div class="cab-m"><span class="lg-cab">${l.svg}</span><span class="nav-m"><i>Guisos</i><i>La taquería</i><b>Tienda</b></span></div>`;

const etiqueta = (l) => `<div class="etq-m"><span class="franja-m">09</span><div><strong>Carne en salsa roja</strong><small>Guiso de taquería · al vacío</small><span class="lg-etq">${l.svg}</span></div></div>`;

const concepto = (l) => `
  <section class="concepto" id="c${l.n}">
    <header><p class="num">Concepto ${l.n} · ${l.familia}</p><h2>${l.nombre}</h2><p class="idea">${l.idea}</p></header>
    <div class="contextos">
      ${ctx('Grande', 'grande', l.svg)}
      ${ctx('A 24 px (pestaña o sello)', 'chico', `<span class="px24">${l.icono}</span><span class="px48">${l.icono}</span>`)}
      ${ctx('Una tinta, negro', 'tinta', l.svg)}
      ${ctx('Una tinta, blanco sobre oscuro', 'oscuro', l.svg)}
      ${ctx('Sobre el rojo de la marca', 'rojo', l.svg)}
      ${ctx('En la cabecera de la landing', 'en-cab', cabecera(l))}
      ${ctx('En la etiqueta de la bolsa', 'en-etq', etiqueta(l))}
    </div>
    <dl class="ficha"><div><dt>Conserva del letrero</dt><dd>${l.conserva}</dd></div><div><dt>Deja</dt><dd>${l.deja}</dd></div><div><dt>Riesgo principal</dt><dd>${l.riesgo}</dd></div></dl>
  </section>`;

document.body.insertAdjacentHTML('beforeend', `
  <header class="cab"><p class="migas"><a href="./">← Las tres rutas</a> · <a href="sistema.html">El sistema</a></p>
    <p class="num">Los Tacos May · exploración de logotipos</p><h1>Siete maneras de unir «May» y el cactus</h1>
    <p class="idea">Para elegir un rumbo. Ninguno está aplicado todavía al sistema, a la landing ni a la tienda.</p>
    <p class="nota">Las letras de «May» y el cactus son dibujo propio, hecho en vector. «Los Tacos» va en la tipografía del sistema. La recomendación y sus motivos están en <code>docs/diseno/logos.md</code>.</p></header>
  <main class="logos">
    <section><h2>Todos juntos</h2>
      <div class="todos">${LOGOS.map((l) => `<a class="ficha-l" href="#c${l.n}"><span class="lienzo-l">${l.svg}</span><span><b>${l.n}</b> ${l.nombre}</span></a>`).join('')}</div>
    </section>
    ${LOGOS.map(concepto).join('')}
  </main>`);
