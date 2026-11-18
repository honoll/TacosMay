// Los materiales del local y de la página de pedidos, como SVG sueltos (docs/diseno/materiales-del-local/).
// Sistema: docs/diseno/sistema.md (ruta 3 «La barra»). El logotipo sale de logo.js; cada pieza recibe
// la versión para poder mostrar las dos lado a lado. Lo que falta del negocio va como PENDIENTE-CLIENTE.
// El texto se convierte a trazos con las fuentes de la marca: el SVG no depende de fuentes instaladas
// y se imprime y se rasteriza igual en cualquier lado.
import { readFileSync } from 'node:fs';
import { GUISOS, PICTOS, tinta } from '../../js/barra.js';
import { poner } from './logo.js';

// shortcut: fontkitten se toma de otro proyecto de esta máquina (no es dependencia de TacosMay);
// si falta, apunta FONTKITTEN a cualquier copia de fontkitten/dist/index.js.
const { create } = await import(process.env.FONTKITTEN ?? 'file:///C:/estudio/LaVictoria_Web/node_modules/fontkitten/dist/index.js');
const FUENTE = Object.fromEntries(Object.entries({ bc8: 'barlow-condensed-800', bc6: 'barlow-condensed-600', b4: 'barlow-400', b6: 'barlow-600' })
  .map(([k, n]) => [k, create(readFileSync(new URL(`../../fuentes/${n}-latin.woff2`, import.meta.url)))]));

export const C = { negro: '#141210', crema: '#f7f4ee', acero: '#d9dcdd', aceroOsc: '#6f777b', gris: '#4f5659', carton: '#c9a26b', blanco: '#ffffff' };
const G = Object.fromEntries(GUISOS.map((g) => [g.n, g]));
const ESTRELLA = [G['02'], G['08'], G['09']]; // los que más salen, según Alejandro (sistema.js)
const FRANJA = ['09', '07', '02', '08'].map((n) => G[n].color); // sistema.md §2, regla 5

const r2 = (v) => +v.toFixed(2);

// ---------- Texto a trazos ----------
// f: bc8 Barlow Condensed ExtraBold · bc6 SemiBold · b4 Barlow Regular · b6 SemiBold. t: tamaño (unidades del lienzo).
// ls: espaciado en em. Sin interletraje de la fuente (no hay motor de composición): basta en mayúsculas condensadas.
export function ancho(s, { f = 'b4', t = 10, ls = 0 } = {}) {
  const fu = FUENTE[f];
  return fu.glyphsForString(s).reduce((a, g) => a + g.advanceWidth + ls * fu.unitsPerEm, 0) * (t / fu.unitsPerEm) - ls * t;
}
export function texto(s, x, y, { f = 'b4', t = 10, ls = 0, ancla = 'start', color = C.negro } = {}) {
  const fu = FUENTE[f], k = t / fu.unitsPerEm;
  let ax = x - (ancla === 'middle' ? ancho(s, { f, t, ls }) / 2 : ancla === 'end' ? ancho(s, { f, t, ls }) : 0), d = '';
  const p = ([px, py]) => `${r2(ax + px * k)} ${r2(y - py * k)}`;
  const par = (a) => a.reduce((o, v, i) => (i % 2 ? o.push([a[i - 1], v]) : 0, o), []).map(p).join(' ');
  for (const g of fu.glyphsForString(s)) {
    for (const { command: c, args } of g.path.commands) {
      d += c === 'moveTo' ? `M${par(args)}` : c === 'lineTo' ? `L${par(args)}` : c === 'quadraticCurveTo' ? `Q${par(args)}` : c === 'bezierCurveTo' ? `C${par(args)}` : 'Z';
    }
    ax += (g.advanceWidth + ls * fu.unitsPerEm) * k;
  }
  return `<path fill="${color}" d="${d}"><title>${s.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</title></path>`;
}
// Parte un texto en renglones que no pasen de `max` de ancho.
export function renglones(s, max, o) {
  const out = [];
  for (const w of s.split(' ')) {
    const prueba = out.length ? `${out[out.length - 1]} ${w}` : w;
    if (out.length && ancho(prueba, o) <= max) out[out.length - 1] = prueba; else out.push(w);
  }
  return out;
}

// ---------- Piezas del sistema ----------
const rect = (x, y, w, h, fill, extra = '') => `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" fill="${fill}"${extra}/>`;
export const franja = (x, y, w, h) => FRANJA.map((c, i) => rect(x + (w / 4) * i, y, w / 4 + 0.01, h, c)).join('');
const picto = (nombre, x, y, t, color) => `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(t / 24)})" fill="${color}" color="${color}">${PICTOS[nombre]}</g>`;

// La charola (sistema.md §6): marco de acero, el color del guiso 4:3 con su número y el vapor, el nombre en crema.
function charola(g, x, y, w) {
  const m = w / 16, iw = w - 2 * m, ih = iw * 0.75, c = tinta(g.color);
  const nom = renglones(g.nombre.toUpperCase(), iw - 2 * m, { f: 'bc8', t: w * 0.105 });
  const alto = m + ih + m * 1.2 + nom.length * w * 0.105 * 0.95 + m * 1.6;
  return rect(x, y, w, alto, C.acero, ` rx="${r2(m * 1.4)}" stroke="${C.aceroOsc}" stroke-width="${r2(w / 160)}"`)
    + rect(x + m, y + m, iw, ih, g.color, ` rx="${r2(m * 0.6)}"`)
    + texto(g.n, x + m * 2, y + m + w * 0.17, { f: 'bc8', t: w * 0.16, color: c })
    + picto('Vapor', x + w - m * 2 - w * 0.15, y + m * 1.6, w * 0.15, c)
    + rect(x + m, y + m + ih + m * 0.4, iw, alto - ih - m * 2.4, C.crema, ` rx="${r2(m * 0.6)}"`)
    + nom.map((l, i) => texto(l, x + m * 2, y + m + ih + m * 1.2 + (i + 1) * w * 0.105 * 0.95, { f: 'bc8', t: w * 0.105 })).join('');
}

// El QR, mientras no haya dominio: el lugar y el tamaño reales, con sus tres esquinas de referencia,
// pero sin código (no se puede leer). Cuando exista la dirección se genera el QR real del mismo tamaño.
function qr(x, y, s) {
  const m = s / 33, esq = (ex, ey) => rect(ex, ey, 7 * m, 7 * m, C.negro) + rect(ex + m, ey + m, 5 * m, 5 * m, C.blanco) + rect(ex + 2 * m, ey + 2 * m, 3 * m, 3 * m, C.negro);
  const q = 4 * m, cx = x + s / 2;
  return rect(x, y, s, s, C.blanco, ` stroke="${C.negro}" stroke-width="${r2(m / 3)}"`)
    + esq(x + q, y + q) + esq(x + s - q - 7 * m, y + q) + esq(x + q, y + s - q - 7 * m)
    + rect(x + s * 0.2, y + s * 0.37, s * 0.6, s * 0.27, 'none', ` stroke="${C.gris}" stroke-width="${r2(m / 3)}" stroke-dasharray="${r2(m)} ${r2(m * 0.7)}"`)
    + texto('QR', cx, y + s * 0.5, { f: 'bc8', t: s * 0.11, ancla: 'middle', color: C.gris })
    + texto('PENDIENTE-CLIENTE', cx, y + s * 0.565, { f: 'b6', t: s * 0.055, ancla: 'middle', color: C.gris })
    + texto('dirección de la página', cx, y + s * 0.62, { f: 'b4', t: s * 0.05, ancla: 'middle', color: C.gris });
}
const circulo = (n, cx, cy, r) => `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}" fill="${C.negro}"/>` + texto(n, cx, cy + r * 0.45, { f: 'bc8', t: r * 1.3, ancla: 'middle', color: C.blanco });

const svg = (w, h, unidad, cuerpo, titulo) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}${unidad}" height="${h}${unidad}" role="img" aria-label="${titulo}"><title>${titulo}</title>${cuerpo}</svg>\n`;

// ---------- 1. Materiales del local ----------

// Cartel de la barra con QR: carta vertical, 216 × 279 mm.
export function cartel(v) {
  const pasos = ['ESCANEA', 'ESCOGE', 'SIGUE TU PEDIDO'];
  return svg(216, 279, 'mm', rect(0, 0, 216, 279, C.crema)
    + poner('grande', 38, 14, 140, 66, { version: v })
    + texto('ESCANEA', 108, 114, { f: 'bc8', t: 31, ancla: 'middle' })
    + texto('Y PIDE.', 108, 141, { f: 'bc8', t: 31, ancla: 'middle' })
    + texto('Desde tu celular, directo a la barra.', 108, 156, { t: 7, ancla: 'middle', color: C.gris })
    + qr(75, 166, 66)
    + pasos.map((p, i) => { const cx = 36 + i * 72; return circulo(String(i + 1), cx - ancho(p, { f: 'bc6', t: 5, ls: 0.1 }) / 2 - 5, 249.2, 3.6) + texto(p, cx + 1.5, 251, { f: 'bc6', t: 5, ls: 0.1, ancla: 'middle' }); }).join('')
    + franja(0, 265, 216, 14), 'Cartel de la barra con QR');
}

// Calcomanía redonda de 60 mm: cierra la bolsa. Sobre crema a color, o a una tinta sobre cartón.
export function calcomania(v, modo = 'color') {
  const fondo = modo === 'color' ? C.crema : C.carton;
  return svg(64, 64, 'mm', `<circle cx="32" cy="32" r="30" fill="${fondo}" stroke="${C.negro}" stroke-width="1.4"/><circle cx="32" cy="32" r="27.4" fill="none" stroke="${C.negro}" stroke-width="0.4"/>`
    + poner('chico', 16, 9.5, 32, 27, { version: v, modo: modo === 'color' ? 'color' : 'negro', fondo })
    + texto('CERRADO', 32, 46, { f: 'bc8', t: 6.2, ancla: 'middle' })
    + texto('EN LA BARRA', 32, 52.5, { f: 'bc6', t: 4.4, ls: 0.12, ancla: 'middle' }), 'Calcomanía de cierre de la bolsa');
}

// Volante para la bolsa: un cuarto de carta, 108 × 140 mm.
export function volante(v) {
  return svg(108, 140, 'mm', rect(0, 0, 108, 140, C.crema)
    + poner('linea', 14, 9, 80, 26, { version: v })
    + ['LA PRÓXIMA,', 'PÍDELOS DESDE', 'TU CELULAR.'].map((l, i) => texto(l, 54, 49 + i * 11.5, { f: 'bc8', t: 11.4, ancla: 'middle' })).join('')
    + texto('Escanea, escoge y sigue tu pedido.', 54, 80.5, { t: 4.3, ancla: 'middle', color: C.gris })
    + qr(35, 85, 38)
    + texto('Gracias por venir.', 54, 130, { f: 'b6', t: 4.3, ancla: 'middle' })
    + franja(0, 134, 108, 6), 'Volante para la bolsa');
}

// ---------- 2. La página de pedidos ----------

// Íconos: 'pestana' (placa redonda, para el navegador), 'lleno' (cuadrado sin transparencia: iPhone y
// Android) y 'maskable' (el logotipo dentro del círculo seguro del 80 %: Android lo recorta a su forma).
export function icono(v, tipo = 'pestana') {
  const fondo = tipo === 'pestana' ? rect(0, 0, 512, 512, C.crema, ' rx="104"') : rect(0, 0, 512, 512, C.crema);
  const m = { pestana: 56, lleno: 72, maskable: 128 }[tipo];
  return svg(512, 512, '', fondo + poner('chico', m, m, 512 - 2 * m, 512 - 2 * m, { version: v }), 'Los Tacos May');
}

// Imagen para compartir, 1200 × 630 (sistema.md §11): crema, logotipo y frase a la izquierda,
// tres charolas a la derecha, la franja al pie.
export function compartir(v) {
  return svg(1200, 630, '', rect(0, 0, 1200, 630, C.crema)
    + poner('grande', 64, 56, 470, 250, { version: v })
    + texto('PIDE TUS', 72, 404, { f: 'bc8', t: 92 })
    + texto('TACOS.', 72, 486, { f: 'bc8', t: 92 })
    + texto('Desde tu celular, directo a la barra.', 74, 540, { t: 30, color: C.gris })
    + ESTRELLA.map((g, i) => charola(g, 560 + i * 202, 196, 188)).join('')
    + franja(0, 600, 1200, 30), 'Los Tacos May: pide tus tacos');
}

// ---------- 3. Empaque (propuesta) ----------

// Etiqueta del pedido: ticket térmico de 80 mm, en negro. Los datos del pedido los pone el sistema; aquí, «—».
export function ticket(v, tipo = 'llevar') {
  const filas = tipo === 'domicilio' ? ['Nombre', 'Teléfono', 'Dirección', 'Referencias', 'Pago'] : ['Nombre', 'Hora', 'Pago'];
  const punteada = (y) => `<path d="M6 ${y}H74" stroke="${C.negro}" stroke-width="0.5" stroke-dasharray="1 1.2"/>`;
  let y = 52, cuerpo = '';
  for (const f of filas) { cuerpo += texto(f.toUpperCase(), 6, y, { f: 'bc6', t: 4, ls: 0.08 }) + texto('—', 74, y, { f: 'bc8', t: 4.4, ancla: 'end' }); y += 8; }
  y += 2; cuerpo += punteada(y - 4) + texto('TU PEDIDO', 6, y + 3, { f: 'bc6', t: 4, ls: 0.08 });
  for (let i = 0; i < 3; i++) { y += 9; cuerpo += texto('— × —', 6, y + 3, { f: 'bc8', t: 5 }) + texto('—', 74, y + 3, { f: 'bc8', t: 5, ancla: 'end' }); }
  y += 10; cuerpo += punteada(y) + texto('TOTAL', 6, y + 9, { f: 'bc8', t: 6 }) + texto('—', 74, y + 9, { f: 'bc8', t: 6, ancla: 'end' });
  const H = y + 26;
  const pie = tipo === 'domicilio' ? 'Si el sello llega roto, avísanos.' : 'Gracias por venir.';
  return svg(80, H, 'mm', rect(0, 0, 80, H, C.blanco)
    + poner('linea', 14, 5, 52, 16, { version: v, modo: 'negro', fondo: C.blanco })
    + rect(6, 24, 68, 10, C.negro) + texto(tipo === 'domicilio' ? 'A DOMICILIO' : 'PARA LLEVAR', 40, 31.6, { f: 'bc8', t: 6.6, ls: 0.06, ancla: 'middle', color: C.blanco })
    + texto('PEDIDO', 6, 43, { f: 'bc6', t: 4, ls: 0.08 }) + texto('#—', 74, 43.5, { f: 'bc8', t: 6.5, ancla: 'end' }) + `<path d="M6 47H74" stroke="${C.negro}" stroke-width="0.5" stroke-dasharray="1 1.2"/>`
    + cuerpo + texto(pie, 40, H - 8, { t: 3.6, ancla: 'middle' }), `Etiqueta del pedido, ${tipo === 'domicilio' ? 'a domicilio' : 'para llevar'}`);
}

// La bolsa de papel (cartón natural, una tinta): de frente, con el doblez arriba cerrado por la calcomanía.
// Al lado, la etiqueta del pedido. La medida de la bolsa es PENDIENTE-CLIENTE (depende de cuántos tacos van).
export function empaque(v, tipo = 'llevar') {
  const bolsa = `<path d="M24 70H176V290H24Z" fill="${C.carton}" stroke="#a97f4a" stroke-width="1.2"/><path d="M24 70H176V100H24Z" fill="#b98f58"/><path d="M24 280H176" stroke="#a97f4a" stroke-width="0.8"/>`
    + poner('grande', 44, 140, 112, 80, { version: v, modo: 'negro', fondo: C.carton })
    + franja(28, 270, 144, 6);
  const sello = calcomania(v, tipo === 'domicilio' ? 'color' : 'negro').replace(/^<svg[^>]*>|<\/svg>\s*$/g, '').replace(/<title>[^<]*<\/title>/, '');
  const t = ticket(v, tipo), th = +t.match(/viewBox="0 0 80 ([\d.]+)"/)[1];
  const tk = `<g transform="translate(200 ${r2(290 - th * 1.2)}) scale(1.2)">${t.replace(/^<svg[^>]*>|<\/svg>\s*$/g, '').replace(/<title>[^<]*<\/title>/, '')}<rect width="80" height="${th}" fill="none" stroke="${C.aceroOsc}" stroke-width="0.4"/></g>`;
  return svg(310, 300, 'mm', rect(0, 0, 310, 300, C.acero) + bolsa + `<g transform="translate(78 63) scale(0.7)">${sello}</g>` + tk,
    tipo === 'domicilio' ? 'Empaque a domicilio' : 'Empaque para llevar');
}
