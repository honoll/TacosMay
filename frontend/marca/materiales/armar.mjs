// Arma todos los materiales: `node frontend/marca/materiales/armar.mjs`.
// - svg/<pieza>-<version>.svg: cada pieza en las dos versiones del logotipo (para comparar).
// - pedidos/: íconos, imagen para compartir y manifiesto de la página de pedidos, con el logotipo ELEGIDO.
// - docs/diseno/materiales-del-local/*.pdf: lo imprimible, con el logotipo ELEGIDO.
// - index.html: la página /marca/materiales/ con todo lado a lado.
// PNG y PDF salen de rasterizar.py (PyMuPDF). Razonamiento: docs/diseno/materiales-del-local/README.md.
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ELEGIDO, VERSIONES } from './logo.js';
import * as P from './piezas.js';

const aqui = (p) => fileURLToPath(new URL(p, import.meta.url));
const DOCS = aqui('../../../docs/diseno/materiales-del-local/');
for (const d of ['svg', 'pedidos']) mkdirSync(aqui(d), { recursive: true });
mkdirSync(DOCS, { recursive: true });

// Cada pieza: [archivo, función, argumentos extra].
const PIEZAS = [
  ['cartel', P.cartel], ['volante', P.volante], ['calcomania', P.calcomania], ['calcomania-carton', P.calcomania, 'carton'],
  ['icono', P.icono], ['icono-lleno', P.icono, 'lleno'], ['icono-maskable', P.icono, 'maskable'], ['compartir', P.compartir],
  ['ticket-llevar', P.ticket, 'llevar'], ['ticket-domicilio', P.ticket, 'domicilio'],
  ['empaque-llevar', P.empaque, 'llevar'], ['empaque-domicilio', P.empaque, 'domicilio'],
];
for (const v of Object.keys(VERSIONES)) for (const [n, f, extra] of PIEZAS) writeFileSync(aqui(`svg/${n}-${v}.svg`), f(v, extra));

// Página de pedidos: lo que Frontend enlaza (README.md trae las etiquetas <link> y <meta>).
const el = (n) => aqui(`svg/${n}-${ELEGIDO}.svg`);
writeFileSync(aqui('pedidos/icono.svg'), P.icono(ELEGIDO));
writeFileSync(aqui('pedidos/manifest.webmanifest'), JSON.stringify({
  name: 'Los Tacos May — Pedidos', short_name: 'Tacos May', lang: 'es-MX',
  start_url: '/domicilio/', scope: '/domicilio/', display: 'standalone', // shortcut: el prototipo; cambia al dominio de pedidos (PENDIENTE-CLIENTE)
  background_color: P.C.crema, theme_color: P.C.negro,
  icons: [
    { src: 'icono.svg', type: 'image/svg+xml', sizes: 'any' },
    { src: 'icono-192.png', type: 'image/png', sizes: '192x192' },
    { src: 'icono-512.png', type: 'image/png', sizes: '512x512' },
    { src: 'icono-maskable-512.png', type: 'image/png', sizes: '512x512', purpose: 'maskable' },
  ],
}, null, 2) + '\n');

const trabajos = [
  [el('icono-lleno'), aqui('pedidos/icono-180.png'), 180],
  [el('icono-lleno'), aqui('pedidos/icono-192.png'), 192],
  [el('icono-lleno'), aqui('pedidos/icono-512.png'), 512],
  [el('icono-maskable'), aqui('pedidos/icono-maskable-512.png'), 512],
  [el('compartir'), aqui('pedidos/compartir.png'), 1200],
  ...['cartel', 'volante', 'calcomania', 'calcomania-carton', 'ticket-llevar', 'ticket-domicilio'].map((n) => [el(n), join(DOCS, `${n}.pdf`), null]),
];
const lista = join(tmpdir(), 'materiales-trabajos.json');
writeFileSync(lista, JSON.stringify(trabajos));
execFileSync(process.env.PYTHON ?? 'python', [aqui('rasterizar.py'), lista], { stdio: 'inherit' });
rmSync(lista);

// ---------- La página ----------
const V = Object.entries(VERSIONES);
const img = (n, v, alt, cls = '') => `<img class="${cls}" src="svg/${n}-${v}.svg" alt="${alt}, logotipo ${VERSIONES[v].nombre}" loading="lazy">`;
const par = (n, alt, cls) => `<div class="par">${V.map(([v, d]) => `<figure>${img(n, v, alt, cls)}<figcaption><b>${d.nombre}</b> · ${d.nota}${v === ELEGIDO ? ' · <em>en uso</em>' : ''}</figcaption></figure>`).join('')}</div>`;
const pieza = (id, titulo, medida, texto, cuerpo) => `
    <section id="${id}"><h2>${titulo} <small>${medida}</small></h2><p class="nota">${texto}</p>${cuerpo}</section>`;
const pestana = (v) => `<div class="pestana"><img src="svg/icono-${v}.svg" alt="" width="16" height="16"><span>Los Tacos May — Pedidos</span><i aria-hidden="true">×</i></div>`;
const inicio = (v) => `<div class="inicio"><span><img src="svg/icono-lleno-${v}.svg" alt="" width="60" height="60"><b>Tacos May</b></span><span><img class="mascara" src="svg/icono-maskable-${v}.svg" alt="" width="60" height="60"><b>Tacos May</b></span></div>`;

const html = `<!doctype html>
<html lang="es-MX">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Materiales del local — Los Tacos May</title>
  <link rel="icon" type="image/svg+xml" href="pedidos/icono.svg">
  <link rel="stylesheet" href="../marca.css">
  <link rel="stylesheet" href="materiales.css">
</head>
<body>
  <!-- Generado por armar.mjs: no se edita a mano. -->
  <header class="cab"><p class="migas"><a href="../">← Marca</a> · <a href="../sistema.html">El sistema</a> · <a href="../logos-tacos.html">Logotipos con tacos</a></p>
    <p class="num">Los Tacos May · materiales del local y de pedidos</p><h1>Para la barra, la bolsa y el celular</h1>
    <p class="idea">El cartel con QR, la calcomanía y el volante del local; el ícono, el nombre corto y la imagen para compartir de la página de pedidos; y una propuesta de empaque. Todo con el sistema de «La barra».</p>
    <p class="nota"><strong>Propuesta.</strong> El logotipo no está elegido: cada pieza va con las dos versiones. Se cambia en un solo lugar (<code>ELEGIDO</code> en <code>materiales/logo.js</code>, hoy <b>${VERSIONES[ELEGIDO].nombre}</b>) y se vuelve a correr <code>armar.mjs</code>. El QR no lleva código: la página aún no tiene dirección (<code>PENDIENTE-CLIENTE</code>). «—» marca los datos que pone cada pedido. Razonamiento: <code>docs/diseno/materiales-del-local/README.md</code>.</p>
    <nav class="indice" aria-label="Piezas">${[['cartel', 'Cartel'], ['calcomania', 'Calcomanía'], ['volante', 'Volante'], ['pedidos', 'Página de pedidos'], ['empaque', 'Empaque']].map(([i, t]) => `<a href="#${i}">${t}</a>`).join('')}</nav>
  </header>
  <main class="materiales">
    ${pieza('cartel', 'Cartel de la barra', 'carta, 216 × 279 mm', 'Para la barra o la pared, a la altura de los ojos. Se lee de lejos: «Escanea y pide», el QR de 66 mm (se lee a unos 60 cm) y tres pasos. La franja de colores al pie, como en los botones.', par('cartel', 'Cartel de la barra', 'hoja'))}
    ${pieza('calcomania', 'Calcomanía de cierre', 'redonda, 60 mm', 'Cierra el doblez de la bolsa. «Cerrado en la barra»: el cliente sabe que nadie la abrió en el camino. A color sobre etiqueta crema, o a una tinta directo sobre cartón (más barata).', par('calcomania', 'Calcomanía a color', 'redonda') + par('calcomania-carton', 'Calcomanía a una tinta, sobre cartón', 'redonda'))}
    ${pieza('volante', 'Volante para la bolsa', 'un cuarto de carta, 108 × 140 mm', 'Va dentro de cada bolsa: invita a pedir la próxima vez desde el celular. Cuatro salen de una hoja carta.', par('volante', 'Volante para la bolsa', 'hoja chica'))}
    <section id="pedidos"><h2>Página de pedidos</h2>
      <p class="nota">Nombre: <b>Los Tacos May — Pedidos</b>. Nombre corto (bajo el ícono en el celular, máximo 12 letras): <b>Tacos May</b>. Los archivos están en <code>/marca/materiales/pedidos/</code>, con el logotipo en uso; cómo se enlazan, en el README.</p>
      <h3>En la pestaña del navegador</h3>${`<div class="par">${V.map(([v, d]) => `<figure>${pestana(v)}<div class="tamanos">${[16, 32, 64].map((s) => `<img src="svg/icono-${v}.svg" alt="" width="${s}" height="${s}">`).join('')}</div><figcaption><b>${d.nombre}</b> · a 16, 32 y 64 px</figcaption></figure>`).join('')}</div>`}
      <h3>En la pantalla de inicio del celular</h3><p class="nota">Izquierda, iPhone (cuadrado, él redondea); derecha, Android (lo recorta en círculo: el logotipo va dentro de la zona segura).</p>${`<div class="par">${V.map(([v, d]) => `<figure>${inicio(v)}<figcaption><b>${d.nombre}</b></figcaption></figure>`).join('')}</div>`}
      <h3>Imagen para compartir <small>1200 × 630</small></h3><p class="nota">La que sale al mandar el enlace por WhatsApp o redes. Las tres charolas son los guisos que más salen (02, 08 y 09), cada una con su número y su nombre, sin fotos generadas.</p>${par('compartir', 'Imagen para compartir', 'ancha')}
    </section>
    <section id="empaque"><h2>Empaque <small>propuesta: la familia aún no ha dicho qué usan</small></h2>
      <p class="nota">Una bolsa de papel en cartón natural impresa a una tinta (o con un sello de goma: misma pieza, sin imprenta), la calcomanía en el doblez y la etiqueta del pedido impresa en la barra por la impresora térmica (80 mm, en negro). Lo único que cambia a domicilio es la etiqueta, con dirección, y la calcomanía a color, que se nota más si llega rota. Medida de la bolsa: <code>PENDIENTE-CLIENTE</code>.</p>
      <h3>Para llevar</h3>${par('empaque-llevar', 'Empaque para llevar', 'ancha')}
      <h3>A domicilio</h3>${par('empaque-domicilio', 'Empaque a domicilio', 'ancha')}
      <h3>La etiqueta del pedido <small>ticket térmico, 80 mm</small></h3><div class="par tickets">${V.map(([v, d]) => `<figure><div class="dos">${img('ticket-llevar', v, 'Etiqueta para llevar', 'ticket')}${img('ticket-domicilio', v, 'Etiqueta a domicilio', 'ticket')}</div><figcaption><b>${d.nombre}</b></figcaption></figure>`).join('')}</div>
    </section>
  </main>
</body>
</html>
`;
writeFileSync(aqui('index.html'), html);
console.log(`listo: ${PIEZAS.length * V.length} SVG, ${trabajos.length} PNG/PDF, index.html · logotipo en uso: ${ELEGIDO}`);
