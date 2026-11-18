// Al confirmar el pedido (docs/diseno/empacado.md, docs/calidad/critica-envio.md): las bolsas de tus guisos, cada
// una en su color, caen a la caja → se cierran las tapas → cinta y etiqueta con el número → llega el avión rodando
// por la pista → levanta la nariz, la caja sube a bordo, cierra → acelera, levanta el morro y sale por arriba a la
// derecha dejando una estela → la estela se vuelve la raya sobre la que queda «Pedido #N confirmado», con «Ver mis
// pedidos» y «Seguir comprando». Una sola línea de tiempo de GSAP (≈ 3.9 s con 2 guisos, ≈ 4.4 s con 8), solo
// transform, opacidad y stroke-dashoffset (la estela), dibujada con el sistema (trazo negro de 2, acero, crema, la
// franja de cuatro colores como librea). Al fondo, el sol de Cabo y dos nubes, que se quedan atrás más despacio.
// La API se llama en paralelo (tienda/app.js): si el número no ha llegado cuando se pega la etiqueta, la línea
// espera ahí. Se salta tocando, con «Saltar» o con Escape: va directo al final. Con movimiento reducido o sin
// GSAP no hay coreografía: el final aparece en cuanto se confirma.
//
// enviar(colores) → { listo, confirmar(pedido, total), cancel }
//   listo: promesa con 'pedidos' o 'catalogo' (lo que elige la persona), o null si se canceló (la API falló).

const ANCHO = 400;
const ALTO = 300;
const PISO = 232; // la pista: lo que baja de aquí no se ve (las bolsas entran a la caja por detrás del frente)
const MAX_BOLSAS = 8;
const FRANJA = ['#a8321c', '#8a9440', '#f2b33d', '#35603a'];
const NEGRO = '#141210';
const T = `stroke="${NEGRO}" stroke-width="2" stroke-linejoin="round"`;

// Una bolsa por guiso pedido (hasta ocho), sobre la caja, cada una con su color.
const DESFASE = [-24, 0, 24, -12, 12, -24, 24, 0];
function bolsasSvg(colores) {
  const n = Math.max(1, Math.min(MAX_BOLSAS, colores.length));
  return Array.from({ length: n }, (_, i) => {
    const x = 305 + DESFASE[i];
    return `<g class="bolsa-g"><rect x="${x}" y="108" width="30" height="40" rx="5" fill="#f7f4ee" ${T}/>`
      + `<rect x="${x + 5}" y="120" width="20" height="22" rx="3" fill="${colores[i] ?? '#d9dcdd'}" stroke="${NEGRO}" stroke-width="1.5"/>`
      + `<rect x="${x}" y="108" width="30" height="6" rx="3" fill="${NEGRO}"/></g>`;
  }).join('');
}

const FONDO = '<g class="fondo">'
  + `<g class="sol"><circle cx="336" cy="62" r="20" fill="#f2b33d" ${T}/>`
  + `<path d="M336 30v-10M336 104v-10M304 62h-10M378 62h-10M313 39l-7-7M366 92l-7-7M359 39l7-7M306 92l7-7" ${T} stroke-linecap="round"/></g>`
  + `<path class="nube n1" d="M54 84h64a14 14 0 0 0-14-16 18 18 0 0 0-33-6 14 14 0 0 0-17 22z" fill="#fff" ${T}/>`
  + `<path class="nube n2" d="M196 52h50a11 11 0 0 0-11-13 14 14 0 0 0-26-4 11 11 0 0 0-13 17z" fill="#fff" ${T}/>`
  + '</g>';

const PISTA = `<g class="pista"><path d="M0 ${PISO}H${ANCHO * 2}" ${T}/>`
  + Array.from({ length: 16 }, (_, i) => `<rect x="${i * 50}" y="${PISO + 10}" width="26" height="4" rx="2" fill="${NEGRO}"/>`).join('')
  + '</g>';

const CAJA = '<g class="caja">'
  + `<rect x="270" y="156" width="100" height="76" fill="#f7f4ee" ${T}/>`
  + `<path d="M270 170h100" stroke="${NEGRO}" stroke-width="1.5" stroke-dasharray="4 4"/>`
  + `<rect class="tapa izq" x="270" y="151" width="50" height="7" rx="2" fill="#d9dcdd" ${T}/>`
  + `<rect class="tapa der" x="320" y="151" width="50" height="7" rx="2" fill="#d9dcdd" ${T}/>`
  + `<rect class="cinta" x="312" y="150" width="16" height="34" fill="#aeb5b8" stroke="${NEGRO}" stroke-width="1.5"/>`
  + `<g class="etiqueta"><rect x="280" y="190" width="80" height="32" rx="3" fill="#fff" stroke="${NEGRO}" stroke-width="1.5"/>`
  + FRANJA.map((c, i) => `<rect x="${284 + i * 4}" y="194" width="4" height="24" fill="${c}"/>`).join('')
  + `<text class="envio-num" x="329" y="213" text-anchor="middle" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-weight="800" font-size="17" fill="${NEGRO}">#</text></g>`
  + '</g>';

// El avión de carga, de perfil y con la nariz a la derecha: la nariz se levanta (bisagra arriba) para cargar.
const AVION = '<g class="avion">'
  + `<path d="M24 152 4 98h30l34 54z" fill="#f7f4ee" ${T}/>`
  + `<rect x="20" y="150" width="190" height="72" rx="16" fill="#f7f4ee" ${T}/>`
  + FRANJA.map((c, i) => `<rect x="${34 + i * 40}" y="172" width="40" height="8" fill="${c}"/>`).join('')
  + `<path d="M96 198h82l-20 18H86z" fill="#d9dcdd" ${T}/>`
  + `<circle cx="64" cy="226" r="6" fill="${NEGRO}"/><circle cx="182" cy="226" r="6" fill="${NEGRO}"/>`
  + `<g class="nariz"><path d="M204 150h18a30 36 0 0 1 0 72h-18z" fill="#f7f4ee" ${T}/>`
  + `<path d="M222 160a20 22 0 0 1 16 16h-16z" fill="${NEGRO}"/></g>`
  + '</g>';

export function enviar(colores = []) {
  const gsap = globalThis.matchMedia?.('(prefers-reduced-motion: no-preference)').matches ? globalThis.gsap : null;
  const el = document.createElement('div');
  el.className = gsap ? 'envio' : 'envio quieta'; // quieta: sin coreografía, se espera el número y sale el final
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-labelledby', 'envio-titulo');
  el.innerHTML = `
    <p class="envio-aviso sr" aria-live="polite">Empacando tu pedido</p>
    <p class="envio-espera">Confirmando tu pedido…</p>
    <div class="envio-escena" aria-hidden="true">
      <svg viewBox="0 0 ${ANCHO} ${ALTO}"><defs><clipPath id="envio-piso"><rect y="-200" width="${ANCHO}" height="${PISO + 200}"/></clipPath></defs>
        ${FONDO}
        <path class="estela" d="M120 222C230 222 300 170 430 -20" pathLength="1" fill="none" stroke="#aeb5b8" stroke-width="5" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1"/>
        ${PISTA}
        <g clip-path="url(#envio-piso)">${bolsasSvg(colores)}</g>
        ${CAJA}
        ${AVION}
      </svg>
    </div>
    <div class="envio-final">
      <p class="envio-dato">Ya quedó registrado</p>
      <h2 id="envio-titulo">Pedido <span class="envio-numero">#</span> confirmado</h2>
      <span class="envio-raya" aria-hidden="true"></span>
      <p class="envio-total"></p>
      <div class="envio-acciones">
        <button type="button" class="btn envio-ver">Ver mis pedidos</button>
        <button type="button" class="btn sec envio-seguir">Seguir comprando</button>
      </div>
    </div>
    <button type="button" class="envio-saltar">Saltar</button>`;
  document.body.append(el);
  const antes = document.activeElement;
  const $ = (s) => el.querySelector(s);
  $('.envio-final').hidden = true; // hasta que haya número
  $('.envio-saltar').focus();

  let resolver;
  const listo = new Promise((r) => { resolver = r; });
  let pedido = null;
  let enFinal = false;
  let cerrado = false;
  let tl = null;

  const cerrar = (eleccion) => {
    if (cerrado) return;
    cerrado = true;
    clearTimeout(seguro);
    tl?.kill();
    document.removeEventListener('keydown', tecla);
    el.remove();
    if (eleccion === null) antes?.focus?.({ preventScroll: true });
    resolver(eleccion);
  };
  // El final: el número, el total y las dos salidas. Es lo que queda en pantalla hasta que se elige.
  const mostrarFinal = () => {
    if (enFinal || !pedido) return;
    enFinal = true;
    clearTimeout(seguro);
    tl?.progress(1);
    el.classList.add('terminado');
    $('.envio-saltar').hidden = true;
    $('.envio-final').hidden = false;
    $('.envio-ver').focus();
  };
  // Saltar: al final si ya hay número; si no, hasta la etiqueta (y ahí espera), y el final llega con el número.
  const saltar = () => {
    if (enFinal) return;
    if (pedido) mostrarFinal();
    else if (tl) { tl.seek('etiqueta'); tl.pause(); }
  };
  const tecla = (e) => {
    if (e.key !== 'Escape') return;
    if (enFinal) cerrar('pedidos'); else saltar();
  };
  document.addEventListener('keydown', tecla);
  el.addEventListener('click', () => { if (!enFinal) saltar(); });
  $('.envio-ver').addEventListener('click', () => cerrar('pedidos'));
  $('.envio-seguir').addEventListener('click', () => cerrar('catalogo'));
  // Por si la línea de tiempo no llega a terminar (pestaña oculta): el final, en cuanto haya número.
  let seguro = setTimeout(mostrarFinal, 6000);

  // En la etiqueta, si el número no ha llegado, la línea espera; al terminar, el final.
  if (gsap) tl = coreografia(gsap, el, () => { if (!pedido) tl.pause(); }, mostrarFinal);

  return {
    listo,
    // La API respondió: el número va a la etiqueta y al final; si la línea esperaba en la etiqueta, sigue.
    confirmar(p, total = '') {
      if (cerrado) return;
      pedido = p;
      for (const n of el.querySelectorAll('.envio-num')) n.textContent = `#${p.id}`;
      $('.envio-numero').textContent = `#${p.id}`;
      $('.envio-total').textContent = total;
      $('.envio-aviso').textContent = `Pedido #${p.id} confirmado${total ? ` por ${total}` : ''}.`;
      if (!tl) { mostrarFinal(); return; }
      if (tl.paused()) tl.play();
      clearTimeout(seguro);
      seguro = setTimeout(mostrarFinal, 5000);
    },
    // La API rechazó (sin existencias, sesión vencida): la escena se retira y el error lo dice la tienda.
    cancel: () => cerrar(null),
  };
}

// La coreografía. Cada golpe tiene peso: las bolsas caen y la caja acusa el golpe; el avión llega, se pasa un
// poco y se asienta; la caja toma impulso para subir; el avión acelera antes de levantar el morro.
function coreografia(gsap, el, alLlegarEtiqueta, alTerminar) {
  const $ = (s) => el.querySelector(s);
  const $$ = (s) => [...el.querySelectorAll(s)];
  const caja = $('.caja');
  const avion = $('.avion');
  const CURVA = 'power3.out';
  const tl = gsap.timeline({ onComplete: alTerminar });

  // Estado de partida: tapas abiertas, cinta y etiqueta fuera, avión fuera por la izquierda, bolsas arriba.
  tl.set($('.etiqueta'), { opacity: 0 }, 0)
    .set($('.cinta'), { scaleY: 0, transformOrigin: '50% 0%' }, 0)
    .set($('.tapa.izq'), { rotation: -118, svgOrigin: '270 156' }, 0)
    .set($('.tapa.der'), { rotation: 118, svgOrigin: '370 156' }, 0)
    .set(avion, { x: -440 }, 0)
    .set($$('.bolsa-g'), { opacity: 0 }, 0)
    // la caja abierta llega a la pista
    .from(caja, { y: 24, opacity: 0, duration: 0.3, ease: CURVA }, 0);

  // las bolsas, una tras otra; de la cuarta en adelante, en ráfaga
  let t = 0.2;
  $$('.bolsa-g').forEach((b, i) => {
    tl.fromTo(b, { y: -36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.12, ease: CURVA }, t)
      .to(b, { y: 104, duration: 0.18, ease: 'power2.in' }, t + 0.12);
    t += i < 2 ? 0.18 : 0.05;
  });
  const T0 = t + 0.25; // la última bolsa ya está dentro

  // ya dentro de la caja (tapadas por su frente), las bolsas se van con ella: que no se queden en la pista
  tl.set($$('.bolsa-g'), { opacity: 0 }, T0)
    .to(caja, { scaleY: 0.94, transformOrigin: '50% 100%', duration: 0.08, ease: 'power2.out' }, T0)
    .to(caja, { scaleY: 1, duration: 0.16, ease: CURVA }, T0 + 0.08)
    // se cierran las tapas, cinta y etiqueta con el número
    .to($('.tapa.izq'), { rotation: 0, svgOrigin: '270 156', duration: 0.24, ease: 'power3.inOut' }, T0 + 0.08)
    .to($('.tapa.der'), { rotation: 0, svgOrigin: '370 156', duration: 0.24, ease: 'power3.inOut' }, T0 + 0.15)
    .to($('.cinta'), { scaleY: 1, duration: 0.14, ease: 'power2.out' }, T0 + 0.38)
    .fromTo($('.etiqueta'), { opacity: 0, scale: 1.25, rotation: -6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, rotation: 0, duration: 0.18, ease: CURVA }, T0 + 0.48)
    .addLabel('etiqueta', T0 + 0.66)
    .call(() => alLlegarEtiqueta(), null, T0 + 0.66)
    // llega el avión rodando: se pasa un poco y se asienta
    .to(avion, { x: 8, duration: 0.42, ease: 'power3.out' }, T0 + 0.7)
    .to(avion, { x: 0, duration: 0.14, ease: 'power2.inOut' }, T0 + 1.12)
    // levanta la nariz; la caja toma impulso y sube a bordo, por debajo de la nariz; cierra
    .to($('.nariz'), { rotation: -58, svgOrigin: '204 150', duration: 0.2, ease: 'power2.out' }, T0 + 1.2)
    .to(caja, { y: -14, duration: 0.1, ease: 'power2.out' }, T0 + 1.4)
    .to(caja, { x: -132, scale: 0.78, svgOrigin: '270 232', duration: 0.3, ease: 'power2.inOut' }, T0 + 1.5)
    .set(caja, { opacity: 0 }, T0 + 1.8)
    .to($('.nariz'), { rotation: 0, svgOrigin: '204 150', duration: 0.16, ease: 'power2.in' }, T0 + 1.78)
    // acelera por la pista (las marcas corren), levanta el morro y sale por arriba a la derecha con su estela
    .to(avion, { x: 90, duration: 0.35, ease: 'power2.in' }, T0 + 1.95)
    .to($('.pista'), { x: -100, duration: 0.9, ease: 'power1.in' }, T0 + 1.95)
    .to(avion, { x: 520, y: -250, rotation: -16, svgOrigin: '64 226', duration: 0.55, ease: 'power2.in' }, T0 + 2.3)
    .to($('.estela'), { strokeDashoffset: 0, duration: 0.5, ease: 'power2.in' }, T0 + 2.32)
    // el fondo se queda atrás, más despacio que el avión
    .to($('.sol'), { x: -14, duration: 0.9, ease: 'power1.in' }, T0 + 1.95)
    .to($$('.nube'), { x: -36, duration: 0.9, ease: 'power1.in' }, T0 + 1.95)
    // la estela se vuelve la raya del final: el dibujo se va y llega «Pedido #N confirmado»
    .to($('.envio-escena svg'), { opacity: 0, duration: 0.25, ease: 'power2.out' }, T0 + 2.8)
    .fromTo($('.envio-final'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35, ease: CURVA, onStart: () => { $('.envio-final').hidden = false; } }, T0 + 2.85)
    .fromTo($('.envio-raya'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.35, ease: 'power3.inOut' }, T0 + 2.85);
  return tl;
}
