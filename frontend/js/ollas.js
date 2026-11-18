// Las ollas del héroe de la landing (index.html, landing.css): guisos vistos desde arriba en su olla con aro
// de acero, sobre manchas de su color. Movimiento con GSAP, solo transform y opacidad:
// - entrada una sola vez: las manchas crecen y las ollas caen girando a su lugar, una tras otra;
// - mientras la barra de charolas gira (js/carrusel.js): flotan muy poco y el guiso da vueltas muy despacio
//   dentro de su olla; el botón «Pausar» de la barra las detiene también (nada se mueve solo sin poder pararlo);
// - al bajar, paralaje suave (cada olla a su profundidad, data-p); en escritorio, siguen un poco al puntero.
// Con movimiento reducido o sin GSAP, quietas. Al volver por el enrutador (js/paginas.js) no se repite la entrada:
// este módulo corre una sola vez.
const T = { chico: 0.18, grande: 0.24 };
const CURVA = 'power3.out';

export function ligarOllas(todos, ficha) {
  for (const a of document.querySelectorAll('.ollas [data-guiso]')) {
    const g = todos.find((x) => x.nombre === a.dataset.guiso);
    if (g) a.href = ficha(g);
  }
}

export function moverOllas() {
  const caja = document.querySelector('.ollas');
  const gsap = globalThis.matchMedia?.('(prefers-reduced-motion: no-preference)').matches ? globalThis.gsap : null;
  if (!caja || !gsap) return;
  const ollas = [...caja.querySelectorAll('.olla')];
  const aros = ollas.map((o) => o.querySelector('.aro'));

  // Entrada
  gsap.from(caja.querySelectorAll('.mancha'), { scale: 0.6, opacity: 0, duration: 0.5, ease: CURVA, stagger: 0.06, transformOrigin: '50% 50%', clearProps: 'transform,opacity' });
  const entrada = gsap.from(aros, { y: -70, rotation: -40, opacity: 0, duration: 0.6, ease: CURVA, stagger: 0.08, delay: 0.1, clearProps: 'opacity' });

  // Ambiente: flotar y girar despacio, solo mientras gira la barra y el héroe está a la vista.
  const ambiente = gsap.timeline({ paused: true });
  aros.forEach((aro, i) => {
    ambiente.to(aro, { y: i % 2 ? 5 : -5, duration: 2.6 + i * 0.4, ease: 'sine.inOut', repeat: -1, yoyo: true }, 0);
    ambiente.to(aro.querySelector('img'), { rotation: i % 2 ? -360 : 360, duration: 140 + i * 20, ease: 'none', repeat: -1 }, 0);
  });
  const boton = document.querySelector('.carrusel-pausa');
  let aLaVista = true;
  const decidir = () => {
    const gira = boton && !boton.hidden && boton.firstChild?.textContent.trim().startsWith('Pausar');
    if (gira && aLaVista && entrada.progress() === 1 && location.pathname === '/') ambiente.play(); else ambiente.pause();
  };
  entrada.eventCallback('onComplete', decidir);
  if (boton) new MutationObserver(decidir).observe(boton, { attributes: true, childList: true, characterData: true, subtree: true });
  new IntersectionObserver(([e]) => { aLaVista = e.isIntersecting; decidir(); }).observe(caja);
  addEventListener('tm:pagina', decidir);

  // Paralaje al bajar y, en escritorio, el puntero: cada olla según su profundidad.
  const prof = ollas.map((o) => Number(o.dataset.p) || 0.5);
  const ax = ollas.map((o) => gsap.quickTo(o, 'x', { duration: 0.6, ease: CURVA }));
  const ay = ollas.map((o) => gsap.quickTo(o, 'y', { duration: 0.6, ease: CURVA }));
  let px = 0;
  let py = 0;
  let pendiente = false;
  const mover = () => {
    pendiente = false;
    if (!caja.isConnected) return;
    const bajo = Math.min(1, Math.max(0, scrollY / Math.max(1, caja.offsetHeight)));
    ollas.forEach((_, i) => { ax[i](px * prof[i] * 16); ay[i](py * prof[i] * 12 - bajo * prof[i] * 60); });
  };
  const pedir = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(mover); } };
  addEventListener('scroll', pedir, { passive: true });
  if (globalThis.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    caja.closest('.heroe').addEventListener('pointermove', (e) => {
      px = (e.clientX / innerWidth) * 2 - 1;
      py = (e.clientY / innerHeight) * 2 - 1;
      pedir();
    });
    caja.closest('.heroe').addEventListener('pointerleave', () => { px = 0; py = 0; pedir(); });
  }
}
