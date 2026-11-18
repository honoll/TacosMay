// La barra que gira, en el héroe de la landing: la fila de charolas avanza sola, despacio, y da la vuelta
// sin corte (al final van copias de la lista, ocultas a lectores de pantalla y fuera del teclado).
// Es una fila con desplazamiento nativo: se mueve con el dedo, la rueda o el teclado como cualquier otra, y
// con el ratón se arrastra. Se detiene con el cursor encima, al tocarla, con el foco dentro, fuera de la
// vista, con la pestaña oculta y con su botón (contenido que se mueve solo más de 5 s: WCAG 2.2.2).
// Con movimiento reducido no gira: queda como fila que se desliza a mano, con imán (CSS: .quieto).

const VELOCIDAD = 28;  // px por segundo: tranquila
const DESCANSO = 1500; // ms sin tocar la fila antes de que vuelva a girar

export function carrusel(raiz) {
  const fila = raiz.querySelector('.carrusel-fila');
  const boton = raiz.querySelector('.carrusel-pausa');
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  raiz.classList.toggle('quieto', reducido);
  boton.hidden = reducido;

  let x = 0;        // dónde va la fila (con decimales; scrollLeft se redondea)
  let periodo = 0;  // ancho de una vuelta: de la primera charola a su primera copia
  let cuadro = 0;
  let antes = 0;
  let descanso = 0;
  const motivos = new Set(); // por qué está detenida: boton, cursor, foco, mano, fuera, oculta

  const vuelta = (v) => (periodo ? ((v % periodo) + periodo) % periodo : v);

  function quitarCopias() {
    for (const c of fila.querySelectorAll('[data-copia]')) c.remove();
    periodo = 0;
  }
  // Copias suficientes para que, al llegar al final de la primera vuelta, la pantalla siga llena.
  function copiar() {
    quitarCopias();
    const originales = [...fila.children];
    if (reducido || !originales.length || !fila.clientWidth) return;
    for (let i = 0; i < 4 && (i === 0 || fila.scrollWidth < fila.clientWidth + periodo * 2); i++) {
      for (const el of originales) {
        const c = el.cloneNode(true);
        c.setAttribute('data-copia', '');
        c.setAttribute('aria-hidden', 'true');
        c.inert = true;
        fila.append(c);
      }
      if (i === 0) periodo = fila.querySelector('[data-copia]').offsetLeft - originales[0].offsetLeft;
    }
    x = vuelta(fila.scrollLeft);
    actualizar();
  }

  function marcha(t) {
    const dt = Math.min(0.1, (t - antes) / 1000);
    antes = t;
    x = vuelta(x + VELOCIDAD * dt);
    fila.scrollLeft = x;
    cuadro = requestAnimationFrame(marcha);
  }
  function actualizar() {
    const corre = !reducido && periodo > 0 && motivos.size === 0;
    if (corre && !cuadro) {
      antes = performance.now();
      cuadro = requestAnimationFrame(marcha);
    } else if (!corre && cuadro) {
      cancelAnimationFrame(cuadro);
      cuadro = 0;
    }
  }
  const detener = (m) => { motivos.add(m); actualizar(); };
  const seguir = (m) => { motivos.delete(m); actualizar(); };
  // La mano mueve la fila (dedo, rueda, arrastre): se detiene y vuelve a girar un rato después de soltarla.
  const mano = () => {
    detener('mano');
    clearTimeout(descanso);
    descanso = setTimeout(() => seguir('mano'), DESCANSO);
  };

  fila.addEventListener('scroll', () => {
    if (Math.abs(fila.scrollLeft - x) <= 2) return; // el paso de la propia marcha
    mano();
    x = fila.scrollLeft;
    if (periodo && x >= periodo) fila.scrollLeft = x = vuelta(x); // da la vuelta también a mano
  }, { passive: true });
  fila.addEventListener('touchstart', mano, { passive: true });
  fila.addEventListener('touchend', mano, { passive: true });

  // Arrastrar con el ratón (el dedo y la rueda ya desplazan solos). Si se arrastró, no se abre el enlace.
  let arrastre = null;
  fila.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    arrastre = { desde: e.clientX, inicio: x, movido: false };
  });
  fila.addEventListener('pointermove', (e) => {
    if (!arrastre) return;
    const dx = e.clientX - arrastre.desde;
    if (!arrastre.movido && Math.abs(dx) < 5) return;
    if (!arrastre.movido) fila.setPointerCapture?.(e.pointerId);
    arrastre.movido = true;
    mano();
    fila.scrollLeft = x = vuelta(arrastre.inicio - dx);
  });
  const soltar = () => { if (arrastre?.movido) setTimeout(() => { arrastre = null; }); else arrastre = null; };
  fila.addEventListener('pointerup', soltar);
  fila.addEventListener('pointercancel', soltar);
  fila.addEventListener('click', (e) => { if (arrastre?.movido) { e.preventDefault(); e.stopPropagation(); } }, true);
  fila.addEventListener('dragstart', (e) => e.preventDefault());

  raiz.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') detener('cursor'); });
  raiz.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') seguir('cursor'); });
  raiz.addEventListener('focusin', () => detener('foco'));
  raiz.addEventListener('focusout', (e) => { if (!raiz.contains(e.relatedTarget)) seguir('foco'); });

  boton.addEventListener('click', () => {
    const pausado = !motivos.has('boton');
    if (pausado) detener('boton'); else seguir('boton');
    // El texto dice lo que hará (sin aria-pressed: un botón que cambia de nombre no lleva además estado).
    boton.firstChild.textContent = pausado ? 'Reanudar' : 'Pausar';
  });

  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return detener('fuera');
    if (!periodo) copiar(); // se armó oculta (js/paginas.js): ahora que se ve, ya se puede medir
    seguir('fuera');
  }).observe(raiz);
  document.addEventListener('visibilitychange', () => (document.hidden ? detener('oculta') : seguir('oculta')));
  let medida = 0;
  addEventListener('resize', () => { clearTimeout(medida); medida = setTimeout(copiar, 200); });

  copiar();
  // Cambiar las charolas (con los datos de la API): sin copias mientras tanto, y luego se vuelven a hacer.
  return {
    rehacer(cambio) {
      quitarCopias();
      cambio(fila);
      copiar();
    },
    get girando() { return cuadro !== 0; },
  };
}
