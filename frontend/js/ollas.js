// Las ollas del héroe de la landing (index.html; landing.css lleva la composición y el movimiento):
// - la entrada (círculos que crecen, ollas que caen, texto que sube) es CSS y se ve una sola vez: al terminar se
//   pone .ya-entro en el héroe, y el enrutador (js/paginas.js), que reinserta los nodos al volver, no la repite;
// - el guiso gira muy lento dentro de su aro mientras el héroe se ve (.gira en .ollas); el botón «Pausar» del
//   héroe lo detiene (nada se mueve solo sin poder pararlo);
// - al bajar, paralaje suave (cada olla a su profundidad, data-p); en escritorio, siguen un poco al puntero (GSAP).
// Con movimiento reducido todo queda quieto (CSS y aquí).
const CURVA = 'power3.out';
const ENTRADA_MS = 1700; // la última olla termina de caer a los ~1.5 s (landing.css)

export function ligarOllas(todos, ficha) {
  for (const a of document.querySelectorAll('.ollas [data-guiso]')) {
    const g = todos.find((x) => x.nombre === a.dataset.guiso);
    if (g) a.href = ficha(g);
  }
}

export function moverOllas() {
  const caja = document.querySelector('.ollas');
  if (!caja) return;
  const heroe = caja.closest('.heroe');
  setTimeout(() => heroe.classList.add('ya-entro'), ENTRADA_MS);
  if (!globalThis.matchMedia?.('(prefers-reduced-motion: no-preference)').matches) return;

  // El giro dentro del aro: mientras el héroe se ve y nadie lo pausó con su botón.
  const boton = heroe.querySelector('.giro-pausa');
  let aLaVista = true;
  let pausado = false;
  const decidir = () => caja.classList.toggle('gira', aLaVista && !pausado && location.pathname === '/');
  if (boton) {
    boton.hidden = false;
    boton.addEventListener('click', () => {
      pausado = !pausado;
      // El texto dice lo que hará (sin aria-pressed: un botón que cambia de nombre no lleva además estado).
      boton.firstChild.textContent = pausado ? 'Reanudar' : 'Pausar';
      decidir();
    });
  }
  new IntersectionObserver(([e]) => { aLaVista = e.isIntersecting; decidir(); }).observe(caja);
  addEventListener('tm:pagina', decidir);
  decidir();

  // Paralaje al bajar y, en escritorio, el puntero: cada olla según su profundidad.
  const gsap = globalThis.gsap;
  if (!gsap) return;
  const ollas = [...caja.querySelectorAll('.olla')];
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
    heroe.addEventListener('pointermove', (e) => {
      px = (e.clientX / innerWidth) * 2 - 1;
      py = (e.clientY / innerHeight) * 2 - 1;
      pedir();
    });
    heroe.addEventListener('pointerleave', () => { px = 0; py = 0; pedir(); });
  }
}
