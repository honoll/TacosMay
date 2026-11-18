// El logotipo de todos los materiales, en un solo lugar. Para cambiarlo: edita ELEGIDO y corre
// `node frontend/marca/materiales/armar.mjs`. La comparación de las dos versiones sale siempre.
// Solo en node (lee archivos): las piezas se arman una vez y se guardan como SVG.
import { readFileSync } from 'node:fs';
import { VARIANTES_TACOS } from '../logos-tacos.js';

export const ELEGIDO = 'vigente'; // 'vigente' (4B + 4C) o 'tacos' (T3 + sello T5): lo decide Alejandro

const NEGRO = '#141210', ROJO = '#c8161f', CREMA = '#f7f4ee';
const archivo = (n) => readFileSync(new URL(`../logo/${n}.svg`, import.meta.url), 'utf8');

// Las variantes con tacos traen clases de color (logos.css); aquí se vuelven colores fijos.
const COLOR = { t: NEGRO, r: ROJO, p: CREMA };
function aColor(svg) {
  return svg.replace(/<(\w+)([^>]*?)\sclass="([^"]*)"([^>]*?)(\/?)>/g, (_, tag, a, cls, b, cierre) => {
    const c = cls.split(' '), col = COLOR[c.find((k) => COLOR[k])];
    let attrs = `${a}${b}`;
    const fija = (k, v) => { attrs = attrs.replace(new RegExp(`\\s${k}="[^"]*"`), '') + ` ${k}="${v}"`; };
    if (c.includes('mc')) { fija('fill', CREMA); fija('stroke', NEGRO); fija('stroke-width', 12); fija('stroke-linejoin', 'round'); fija('stroke-linecap', 'round'); }
    else if (c.includes('trazo')) { fija('fill', 'none'); fija('stroke', col); }
    else if (col) { fija('fill', col); if (tag === 'path') fija('stroke', col); } // las letras llevan trazo que redondea
    return `<${tag}${attrs}${cierre}>`;
  });
}
const T = Object.fromEntries(VARIANTES_TACOS.map((v) => [v.id, v]));

// grande: portada, cartel, bolsa · linea: cabeceras y etiquetas · chico: sello, ícono, calcomanía.
export const VERSIONES = {
  vigente: { nombre: '4B + 4C', nota: 'el vigente', grande: archivo('principal'), linea: archivo('compacta'), chico: archivo('sello') },
  tacos: { nombre: 'T3 + sello T5', nota: 'el de los tacos, recomendado', grande: aColor(T.T3.svg), linea: aColor(T.T5.svg), chico: aColor(T.T5.sello) },
};

// Una tinta: 'negro' (cartón, sello de goma, ticket térmico) o 'blanco' (sobre negro o rojo). El
// papel del dibujo (interior del marco, tortilla) toma el color del fondo.
export function logo(pieza, { version = ELEGIDO, modo = 'color', fondo = CREMA } = {}) {
  const s = VERSIONES[version][pieza];
  const [, w, h] = s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  let dentro = s.replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, '').replace(/<title>[^<]*<\/title>/, '');
  if (modo !== 'color') {
    const tinta = modo === 'blanco' ? CREMA : NEGRO;
    const fijo = { [NEGRO]: tinta, [ROJO]: tinta, [CREMA]: fondo };
    dentro = dentro.replace(/#(141210|c8161f|f7f4ee)\b/gi, (m) => fijo[m.toLowerCase()]);
  }
  return { w, h, dentro };
}

// El logotipo dentro de una caja (x, y, ancho, alto), centrado y sin deformar.
export function poner(pieza, x, y, ancho, alto, opciones) {
  const { w, h, dentro } = logo(pieza, opciones);
  const k = Math.min(ancho / w, alto / h);
  const dx = x + (ancho - w * k) / 2, dy = y + (alto - h * k) / 2;
  return `<g transform="translate(${+dx.toFixed(2)} ${+dy.toFixed(2)}) scale(${+k.toFixed(5)})">${dentro}</g>`;
}
