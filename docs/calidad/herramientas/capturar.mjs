// Capturas de página completa con Chrome por el protocolo de depuración: emulación real de celular
// (390, móvil, táctil) y de escritorio (1440), movimiento reducido. node capturar.mjs <carpeta> [base]
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const [carpeta, base = 'https://tacosmay.onrender.com'] = process.argv.slice(2);
const PAGINAS = (process.env.PAGINAS && JSON.parse(process.env.PAGINAS)) || [
  ['inicio', '/'], ['tienda-lista', '/tienda/#catalogo'], ['tienda-ficha', '/tienda/#guiso/9'],
  ['tienda-carrito', '/tienda/#carrito'], ['tienda-entrar', '/tienda/#entrar'], ['tienda-registro', '/tienda/#registro'],
];
const TAMANOS = (process.env.TAMANOS && JSON.parse(process.env.TAMANOS)) || [[390, 844, true], [1440, 900, false]];
mkdirSync(carpeta, { recursive: true });
const perfil = join(tmpdir(), `cap-${Date.now()}`);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9333', `--user-data-dir=${perfil}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let lista;
for (let i = 0; i < 40 && !lista; i++) { await espera(250); lista = await fetch('http://127.0.0.1:9333/json').then((r) => r.json()).catch(() => null); }
const ws = new WebSocket(lista.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => { ws.onopen = r; });
let id = 0;
const pendientes = new Map();
// SIMULAR: { "/api/ruta": cuerpo } — respuestas de prueba solo dentro de este Chrome (no se crea nada en el servidor).
const SIMULAR = process.env.SIMULAR ? JSON.parse(process.env.SIMULAR) : null;
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pendientes.has(d.id)) { pendientes.get(d.id)(d.result ?? d); pendientes.delete(d.id); return; }
  if (d.method === 'Fetch.requestPaused') {
    const ruta = new URL(d.params.request.url).pathname;
    const cuerpo = SIMULAR?.[ruta];
    const n = ++id;
    ws.send(JSON.stringify(cuerpo === undefined
      ? { id: n, method: 'Fetch.continueRequest', params: { requestId: d.params.requestId } }
      : { id: n, method: 'Fetch.fulfillRequest', params: { requestId: d.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }], body: Buffer.from(JSON.stringify(cuerpo)).toString('base64') } }));
  }
};
const cdp = (method, params = {}) => new Promise((r) => { const n = ++id; pendientes.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });

await cdp('Page.enable');
if (SIMULAR) await cdp('Fetch.enable', { patterns: Object.keys(SIMULAR).map((r) => ({ urlPattern: `*${r}*` })) });
await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
for (const [ancho, alto, movil] of TAMANOS) {
  await cdp('Emulation.setDeviceMetricsOverride', { width: ancho, height: alto, deviceScaleFactor: movil ? 2 : 1, mobile: movil });
  await cdp('Emulation.setTouchEmulationEnabled', { enabled: movil });
  for (const [nombre, ruta, estado] of PAGINAS) {
    await cdp('Page.navigate', { url: 'about:blank' });
    await espera(200);
    await cdp('Page.navigate', { url: base + ruta });
    await espera(estado ? 2500 : 5000);
    if (estado) { // poner un estado guardado (p. ej. un paso de domicilio) y recargar
      await cdp('Runtime.evaluate', { expression: estado });
      await cdp('Page.reload');
      await espera(4000);
    }
    // Bajar toda la página para que carguen las fotos diferidas y suba al inicio; la cabecera fija, en su lugar
    // (en una captura de página completa aparecería abajo).
    await cdp('Runtime.evaluate', { expression: `(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); for (const img of document.images) img.loading = 'eager'; await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 3000); }))); const c = document.querySelector('.cabecera'); if (c) c.style.position = 'relative'; })()`, awaitPromise: true });
    await espera(800);
    const { result } = await cdp('Runtime.evaluate', { expression: 'JSON.stringify([document.documentElement.scrollHeight, document.documentElement.scrollWidth, innerWidth])', returnByValue: true });
    const [h, sw, iw] = JSON.parse(result.value);
    if (process.env.MEDIR) { // una expresión que devuelve texto: medidas del DOM ya pintado
      const m = await cdp('Runtime.evaluate', { expression: process.env.MEDIR, returnByValue: true });
      console.log(`  ${nombre}-${ancho} medidas: ${m.result?.value}`);
    }
    const shot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: ancho, height: Math.min(h, 12000), scale: 1 } });
    writeFileSync(join(carpeta, `${nombre}-${ancho}.png`), Buffer.from(shot.data, 'base64'));
    console.log(`${nombre}-${ancho}: alto ${h}, scrollWidth ${sw} / innerWidth ${iw}`);
  }
}
ws.close();
chrome.kill();
await espera(500);
try { rmSync(perfil, { recursive: true, force: true }); } catch { /* el perfil temporal puede seguir en uso */ }
