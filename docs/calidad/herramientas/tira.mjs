// Tira de cuadros de la escena de «Confirmar pedido», sin depender del reloj: node tira.mjs <carpeta> [n guisos]
// En este Chrome (y solo aquí): sesión, carrito y POST /api/pedidos simulados; un script de depuración guarda la
// última línea de tiempo de GSAP; se pausa y se recorre con progress() en 11 puntos, a 390 y a 1440.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const [carpeta, nGuisos = '2', prefijo = ''] = process.argv.slice(2);
const base = process.env.BASE || 'https://tacosmay.onrender.com';
mkdirSync(carpeta, { recursive: true });
const guisos = await fetch(`${base}/api/guisos`).then((r) => r.json());
const items = guisos.filter((g) => g.stock > 0).slice(0, Number(nGuisos)).map((g, i) => ({ guiso: g, cantidad: 1 + (i % 2) }));
const total = items.reduce((s, i) => s + i.cantidad * i.guiso.precio_centavos, 0);
const pedido = { id: 42, total_centavos: total, creado: new Date().toISOString(), items: items.map((i) => ({ guisoId: i.guiso.id, nombre: i.guiso.nombre, cantidad: i.cantidad, precio_centavos: i.guiso.precio_centavos })) };
const SIMULAR = {
  'GET /api/carrito': { items, total_centavos: total, expira_en_segundos: 1500 },
  'GET /api/users/me': { id: 'u-prueba', nombre: 'Cuenta de prueba', email: 'prueba@ejemplo.test', rol: 'cliente' },
  'POST /api/pedidos': pedido,
  'GET /api/pedidos': [pedido],
};
const DEPURAR = `(() => {
  window.__lineas = [];
  const st = window.setTimeout.bind(window);
  window.setTimeout = (f, ms, ...a) => (ms >= 3000 ? 0 : st(f, ms, ...a)); // el seguro de 4.5 s de la escena, congelado mientras se captura
  let g;
  Object.defineProperty(window, 'gsap', { configurable: true, get: () => g, set: (v) => {
    g = v; const original = v.timeline.bind(v);
    v.timeline = (...a) => { const t = original(...a); window.__lineas.push(t); return t; };
  } });
  localStorage.setItem('tm_sesion', JSON.stringify({ id: 'u-prueba', nombre: 'Cuenta de prueba', email: 'prueba@ejemplo.test', rol: 'cliente', token: 'simulado' }));
})()`;

const perfil = join(tmpdir(), `tira-${Date.now()}`);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9334', `--user-data-dir=${perfil}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let lista;
for (let i = 0; i < 40 && !lista; i++) { await espera(250); lista = await fetch('http://127.0.0.1:9334/json').then((r) => r.json()).catch(() => null); }
const ws = new WebSocket(lista.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => { ws.onopen = r; });
let id = 0;
const pendientes = new Map();
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
await cdp('Fetch.enable', { patterns: [{ urlPattern: '*/api/carrito*' }, { urlPattern: '*/api/users/me*' }, { urlPattern: '*/api/pedidos*' }] });
await cdp('Page.addScriptToEvaluateOnNewDocument', { source: DEPURAR });
const PUNTOS = Array.from({ length: 12 }, (_, i) => Math.round((i / 11) * 1000) / 1000);
for (const [ancho, alto, movil] of [[390, 844, true], [1440, 900, false]]) {
  await cdp('Emulation.setDeviceMetricsOverride', { width: ancho, height: alto, deviceScaleFactor: movil ? 2 : 1, mobile: movil });
  await cdp('Page.navigate', { url: 'about:blank' });
  await espera(200);
  await cdp('Page.navigate', { url: `${base}/tienda/#carrito` });
  await espera(5000);
  const n0 = await evaluar('window.__lineas.length');
  await evaluar(`document.querySelector('[data-click="checkout"]').click()`);
  // La escena arranca al tocar; su línea de tiempo es la primera nueva con onComplete (la de enviar()).
  const info = await evaluar(`(async () => {
    for (let i = 0; i < 40; i++) {
      const t = window.__lineas.slice(${n0}).find((x) => x.eventCallback('onComplete'));
      if (t) { t.pause(); window.__escena = t; return JSON.stringify({ duracion: t.duration() }); }
      await new Promise((r) => setTimeout(r, 25));
    }
    return 'sin escena';
  })()`);
  console.log(`${ancho}: ${info}`);
  if (info === 'sin escena') continue;
  await espera(1000); // que llegue la respuesta del pedido (confirmar() reanuda la línea) y volver a pausar
  await evaluar('window.__escena.pause(); 0');
  for (const p of PUNTOS) {
    await evaluar(`window.__escena.progress(${p}); 0`);
    await espera(60);
    const shot = await cdp('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(carpeta, `${prefijo}${ancho}-${String(Math.round(p * 100)).padStart(3, '0')}.png`), Buffer.from(shot.data, 'base64'));
  }
}
ws.close();
chrome.kill();
await espera(500);
try { rmSync(perfil, { recursive: true, force: true }); } catch { /* el perfil puede seguir en uso */ }
