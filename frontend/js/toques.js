// Todo botón responde al tocarlo: se hunde al presionar y rebota al soltar (GSAP), con el ratón, el dedo
// o el teclado (Enter y espacio). Con movimiento reducido o sin GSAP no se mueve: el botón hace lo suyo igual.
// Se activa una sola vez aunque la landing y la tienda lo pidan (js/paginas.js las tiene juntas).

const BOTON = 'button:not(:disabled):not(.bolsa-barra), .btn';
const animador = () => (globalThis.matchMedia?.('(prefers-reduced-motion: no-preference)').matches ? globalThis.gsap ?? null : null);
let activo = false;

const presiona = (el) => animador()?.to(el, { scale: 0.94, duration: 0.08, ease: 'power2.out', overwrite: 'auto' });
const suelta = (el) => animador()?.to(el, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' });

export function toques(raiz = globalThis.document) {
  if (activo || !raiz?.addEventListener) return;
  activo = true;
  let tocado = null;
  raiz.addEventListener('pointerdown', (e) => {
    if (e.button) return;
    tocado = e.target.closest?.(BOTON) ?? null;
    if (tocado) presiona(tocado);
  }, { passive: true });
  for (const tipo of ['pointerup', 'pointercancel']) {
    raiz.addEventListener(tipo, () => { if (tocado) { suelta(tocado); tocado = null; } }, { passive: true });
  }
  raiz.addEventListener('keydown', (e) => {
    if ((e.key !== 'Enter' && e.key !== ' ') || !e.target.matches?.(BOTON)) return;
    const el = e.target;
    presiona(el);
    setTimeout(() => suelta(el), 90);
  });
}
