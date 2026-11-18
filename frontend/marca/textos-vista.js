// Página del inventario de textos: la misma tabla que docs/diseno/textos.md (los datos, en textos.js) y,
// donde se propone ícono, el ícono dibujado junto al texto actual, para juzgarlo con los ojos.
import { PICTOS } from '../js/barra.js';
import { RESUMEN, SECCIONES, MARCA, ICONOS, NUEVOS, NUEVO_NOMBRE } from './textos.js';

const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const dibujo = (nombre) => {
  const d = NUEVOS[nombre] ?? PICTOS[nombre];
  return d ? `<svg class="picto" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${d}</svg>` : '';
};
const TIPO = { 'Igual': 'igual', 'Más corto': 'corto', 'Reescribir': 'reescribir', 'Alternativas': 'marca', 'Ícono solo': 'icono', 'Ícono + etiqueta': 'icono', 'Quitar': 'quitar' };

// Cómo se vería: el ícono solo, en su botón de 44 px, o el ícono con la etiqueta propuesta (la primera
// palabra entre «» de la propuesta; si no hay, el texto actual).
function vista(f) {
  if (!f.picto) return '';
  const etiqueta = f.propuesta.match(/«([^»]+)»/)?.[1] ?? f.actual;
  if (f.tipo === 'Ícono solo') return `<span class="muestra solo" title="${esc(f.propuesta)}">${dibujo(f.picto)}</span>`;
  return `<span class="muestra">${dibujo(f.picto)}<span>${esc(etiqueta)}</span></span>`;
}

const fila = (f) => `
  <tr class="${TIPO[f.tipo] ?? ''}">
    <td>${esc(f.donde)}</td>
    <td>${esc(f.actual)}</td>
    <td class="n">${f.n}</td>
    <td>${esc(f.problema) || '—'}</td>
    <td><b class="tipo">${esc(f.tipo)}</b> ${esc(f.propuesta)}${f.aplicado ? ` <b class="aplicado">✅ Aplicado${f.aplicado === 'Sí' ? '' : `: ${esc(f.aplicado)}`}</b>` : ''}</td>
    <td>${vista(f)}</td>
  </tr>`;

const seccion = (s) => `
  <section>
    <h2>${esc(s.titulo)}</h2>
    ${s.nota ? `<p class="nota">${esc(s.nota)}</p>` : ''}
    <div class="tabla"><table>
      <thead><tr><th>Dónde</th><th>Texto actual</th><th>Car.</th><th>Problema</th><th>Propuesta</th><th>Así se vería</th></tr></thead>
      <tbody>${s.filas.map(fila).join('')}</tbody>
    </table></div>
  </section>`;

const marca = (m) => `
  <article class="tema">
    <h3>${esc(m.tema)}</h3>
    <p><b>Hoy:</b> ${esc(m.hoy)}</p>
    <ol>${m.alts.map((a) => `<li>${esc(a)}</li>`).join('')}</ol>
    <p class="rec"><b>Recomiendo:</b> ${esc(m.rec)}${m.aplicado ? ` <b class="aplicado">✅ ${esc(m.aplicado)}</b>` : ''}</p>
  </article>`;

const { total, cuenta, diez } = RESUMEN;
const pictosUsados = [...new Set(ICONOS.flatMap((i) => (i.picto ? i.picto.split(' · ') : [])))];

document.body.insertAdjacentHTML('beforeend', `
  <header class="cab">
    <p class="migas"><a href="./">← Las tres rutas</a> · <a href="sistema.html">El sistema</a></p>
    <p class="num">Los Tacos May · textos del sitio</p>
    <h1>Cada texto, con su propuesta</h1>
    <p class="idea">Inventario sacado del código, vista por vista, con lo que propongo para cada texto. <strong>Nada está aplicado</strong>: es para decidir. El razonamiento está en <code>docs/diseno/textos.md</code>.</p>
  </header>
  <main>
    <section class="resumen">
      <h2>Resumen</h2>
      <ul class="cifras">
        <li><b>${total}</b> textos</li>
        <li><b>${cuenta['Igual'] ?? 0}</b> se quedan igual</li>
        <li><b>${(cuenta['Más corto'] ?? 0) + (cuenta['Reescribir'] ?? 0)}</b> más cortos o reescritos</li>
        <li><b>${cuenta['Alternativas'] ?? 0}</b> de marca, con alternativas</li>
        <li><b>${(cuenta['Ícono solo'] ?? 0) + (cuenta['Ícono + etiqueta'] ?? 0)}</b> a ícono (${cuenta['Ícono solo'] ?? 0} solos)</li>
        <li><b>${cuenta['Quitar'] ?? 0}</b> se quitan</li>
      </ul>
      <h3>Los diez cambios que más mejoran el sitio</h3>
      <p class="nota"><b class="aplicado">✅ Aplicados los diez el 17-nov-2026.</b> Lo demás sigue como propuesta.</p>
      <ol class="diez">${diez.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
    </section>

    <section>
      <h2>Los pictogramas</h2>
      <p class="nota">Los del sistema que se usarían y los que faltan, dibujados en la misma retícula (24, margen de 2). Se ven a 24 y a 48 px.</p>
      <ul class="pictos">${[...pictosUsados, ...Object.keys(NUEVOS).filter((k) => !pictosUsados.includes(k))].map((k) => `
        <li><span class="p24">${dibujo(k)}</span><span class="p48">${dibujo(k)}</span><span>${esc(NUEVO_NOMBRE[k] ?? k)}${NUEVOS[k] ? ' <i>nuevo</i>' : ''}</span></li>`).join('')}</ul>
    </section>

    ${SECCIONES.map(seccion).join('')}

    <section>
      <h2>Textos de marca</h2>
      <div class="temas">${MARCA.map(marca).join('')}</div>
    </section>

    <section>
      <h2>Qué puede ser ícono y qué no</h2>
      <div class="tabla"><table>
        <thead><tr><th>Qué</th><th>Cómo</th><th>Pictograma</th><th>Por qué</th></tr></thead>
        <tbody>${ICONOS.map((i) => `
          <tr><td>${esc(i.que)}</td><td><b class="tipo">${esc(i.como)}</b></td>
          <td class="dibujos">${i.picto ? i.picto.split(' · ').map(dibujo).join('') : '—'}</td><td>${esc(i.por)}</td></tr>`).join('')}</tbody>
      </table></div>
    </section>
  </main>`);
