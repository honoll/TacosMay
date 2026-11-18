// ¿Se alcanza «Confirmar pedido» en celular? node medir-carrito.mjs [carpeta de capturas]
// Tres caminos (bolsa desplegada en la lista, vista #carrito, panel desde la ficha), con 1, 3 y 8 guisos, a 390×844
// y 375×667. Sesión y carrito simulados solo en este Chrome. Por cada caso: el botón, ¿cabe en pantalla sin
// desplazar? y ¿el punto central es el botón (se puede tocar, nada lo tapa)?
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const carpeta = process.argv[2];
if (carpeta) mkdirSync(carpeta, { recursive: true });
const base = process.env.BASE || 'https://tacosmay.onrender.com';
const guisos = (await fetch(`${base}/api/guisos`).then((r) => r.json())).filter((g) => g.stock > 0);
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const perfil = join(tmpdir(), `medir-${Date.now()}`);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9335', `--user-data-dir=${perfil}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let lista;
for (let i = 0; i < 40 && !lista; i++) { await espera(250); lista = await fetch('http://127.0.0.1:9335/json').then((r) => r.json()).catch(() => null); }
const ws = new WebSocket(lista.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => { ws.onopen = r; });
let id = 0;
const pendientes = new Map();
let SIMULAR = {};
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pendientes.has(d.id)) { pendientes.get(d.id)(d.result ?? d); pendientes.delete(d.id); return; }
  if (d.method === 'Fetch.requestPaused') {
    const r = d.params.request;
    const cuerpo = SIMULAR[`${r.method} ${new URL(r.url).pathname}`];
    const n = ++id;
    ws.send(JSON.stringify(cuerpo === undefined
      ? { id: n, method: 'Fetch.continueRequest', params: { requestId: d.params.requestId } }
      : { id: n, method: 'Fetch.fulfillRequest', params: { requestId: d.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }], body: Buffer.from(JSON.stringify(cuerpo)).toString('base64') } }));
  }
};
const cdp = (method, params = {}) => new Promise((r) => { const n = ++id; pendientes.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
const evaluar = async (expression) => (await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.value;

await cdp('Page.enable');
await cdp('Fetch.enable', { patterns: [{ urlPattern: '*/api/carrito*' }, { urlPattern: '*/api/users/me*' }] });
await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await cdp('Page.addScriptToEvaluateOnNewDocument', { source: `localStorage.setItem('tm_sesion', JSON.stringify({ id: 'u-prueba', nombre: 'Cuenta de prueba', email: 'prueba@ejemplo.test', rol: 'cliente', token: 'simulado' }))` });

// El botón: ¿cabe sin desplazar?, y tras llevarlo a la vista dentro de su contenedor, ¿el centro es él?
const MEDIR = (sel) => `(async () => {
  const b = document.querySelector(${JSON.stringify(sel)});
  if (!b || !b.offsetParent) return { hay: false };
  const r0 = b.getBoundingClientRect();
  const sinDesplazar = r0.top >= 0 && r0.bottom <= innerHeight;
  b.scrollIntoView({ block: 'nearest' });
  await new Promise((r) => setTimeout(r, 200));
  const r = b.getBoundingClientRect();
  const enCentro = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return { hay: true, texto: b.textContent.trim().slice(0, 20), sinDesplazar, abajo: Math.round(r0.bottom), alto: innerHeight, tocable: Boolean(enCentro && (enCentro === b || b.contains(enCentro))) };
})()`;

const CAMINOS = [
  ['bolsa', '/tienda/#catalogo', `document.querySelector('.bolsa-barra')?.click()`, '.bolsa-cuentas [data-click="checkout"]'],
  ['carrito', '/tienda/#carrito', '', '[data-vista="carrito"] [data-click="checkout"]'],
  ['panel', '/tienda/#guiso/9', `document.getElementById('nav-carrito').click()`, '.panel .acciones a'],
];
const filas = [];
for (const [ancho, alto] of [[390, 844], [375, 667]]) {
  await cdp('Emulation.setDeviceMetricsOverride', { width: ancho, height: alto, deviceScaleFactor: 2, mobile: true });
  await cdp('Emulation.setTouchEmulationEnabled', { enabled: true });
  for (const n of [1, 3, 8]) {
    const items = guisos.slice(0, n).map((g) => ({ guiso: g, cantidad: 1 }));
    SIMULAR = {
      'GET /api/carrito': { items, total_centavos: items.reduce((s, i) => s + i.guiso.precio_centavos, 0), expira_en_segundos: 1500 },
      'GET /api/users/me': { id: 'u-prueba', nombre: 'Cuenta de prueba', email: 'prueba@ejemplo.test', rol: 'cliente' },
    };
    for (const [camino, ruta, accion, sel] of CAMINOS) {
      await cdp('Page.navigate', { url: 'about:blank' });
      await espera(150);
      await cdp('Page.navigate', { url: base + ruta });
      await espera(4500);
      if (accion) { await evaluar(`${accion}; 0`); await espera(800); }
      const m = await evaluar(MEDIR(sel));
      filas.push({ tam: `${ancho}x${alto}`, guisos: n, camino, ...m });
      if (carpeta) {
        const shot = await cdp('Page.captureScreenshot', { format: 'png' });
        writeFileSync(join(carpeta, `${camino}-${ancho}x${alto}-${n}.png`), Buffer.from(shot.data, 'base64'));
      }
    }
  }
}
console.table(filas);
ws.close();
chrome.kill();
await espera(500);
try { rmSync(perfil, { recursive: true, force: true }); } catch { /* el perfil puede seguir en uso */ }
