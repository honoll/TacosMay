// Al confirmar el pedido (docs/diseno/empacado.md, docs/calidad/critica-envio.md): tus guisos, en sus colores,
// en la bolsa → se sella → la bolsa entra a la caja → se cierran las tapas → cinta y etiqueta con el número →
// la caja sale → «Pedido #N confirmado», con «Ver mis pedidos» y «Seguir comprando». Una sola línea de tiempo
// de GSAP (≈ 3 s), solo transform y opacidad, dibujada con el sistema (trazo negro de 2, acero, crema, la franja
// de cuatro colores). La API se llama en paralelo (tienda/app.js): si el número no ha llegado cuando se pega la
// etiqueta, la línea espera ahí. Se salta tocando, con «Saltar» o con Escape: va directo al final. Con
// movimiento reducido o sin GSAP no hay coreografía: el final aparece en cuanto se confirma.
//
// enviar(colores) → { listo, confirmar(pedido, total), cancel }
//   listo: promesa con 'pedidos' o 'catalogo' (lo que elige la persona), o null si se canceló (la API falló).

const ANCHO = 320;
const SUELO = 196; // la línea del piso: lo que baja de aquí no se ve (la bolsa entra a la caja por detrás del frente)
const MAX_COMP = 8;
const FRANJA = ['#a8321c', '#8a9440', '#f2b33d', '#35603a'];

// La bolsa: dos columnas de compartimentos, uno por guiso pedido (hasta ocho), con su color.
function bolsaSvg(colores) {
  const n = Math.max(1, Math.min(MAX_COMP, colores.length));
  const filas = Math.ceil(n / 2);
  const alto = 26 + filas * 26;
  const y0 = 132 - alto; // la base de la bolsa queda a la misma altura con 1 o con 8
  const celdas = Array.from({ length: n }, (_, i) => {
    const x = 120 + (i % 2) * 41;
    const y = y0 + 20 + Math.floor(i / 2) * 26;
    return `<rect x="${x}" y="${y}" width="39" height="22" rx="3" fill="${colores[i] ?? '#d9dcdd'}" stroke="#141210" stroke-width="1.5"/>`;
  }).join('');
  return `<g class="bolsa"><rect x="112" y="${y0}" width="96" height="${alto}" rx="8" fill="#f7f4ee" stroke="#141210" stroke-width="2"/>`
    + `<rect class="sello" x="112" y="${y0}" width="96" height="10" rx="4" fill="#141210"/>${celdas}</g>`;
}

const CAJA = '<g class="caja">'
  + '<rect x="100" y="116" width="120" height="80" fill="#f7f4ee" stroke="#141210" stroke-width="2"/>'
  + '<path d="M100 132h120" stroke="#141210" stroke-width="1.5" stroke-dasharray="4 4"/>'
  + '<rect class="tapa izq" x="100" y="111" width="60" height="7" rx="2" fill="#d9dcdd" stroke="#141210" stroke-width="2"/>'
  + '<rect class="tapa der" x="160" y="111" width="60" height="7" rx="2" fill="#d9dcdd" stroke="#141210" stroke-width="2"/>'
  + '<rect class="cinta" x="152" y="110" width="16" height="40" fill="#aeb5b8" stroke="#141210" stroke-width="1.5"/>'
  + '<g class="etiqueta"><rect x="112" y="150" width="96" height="36" rx="3" fill="#fff" stroke="#141210" stroke-width="1.5"/>'
  + FRANJA.map((c, i) => `<rect x="${116 + i * 4}" y="154" width="4" height="28" fill="${c}"/>`).join('')
  + '<text class="envio-num" x="164" y="175" text-anchor="middle" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-weight="800" font-size="18" fill="#141210">#</text></g>'
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
      <svg viewBox="0 0 ${ANCHO} 210"><defs><clipPath id="envio-piso"><rect width="${ANCHO}" height="${SUELO}"/></clipPath></defs>
        <path class="envio-vel" d="M40 150h36M24 166h48M48 182h28" stroke="#141210" stroke-width="3" stroke-linecap="round"/>
        <g clip-path="url(#envio-piso)">${bolsaSvg(colores)}</g>
        ${CAJA}
        <path d="M16 ${SUELO + 1}H304" stroke="#141210" stroke-width="2"/>
      </svg>
    </div>
    <div class="envio-final" hidden>
      <p class="envio-dato">Listo, ya está en la barra</p>
      <h2 id="envio-titulo">Pedido <span class="envio-numero">#</span> confirmado</h2>
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
  let seguro = setTimeout(mostrarFinal, 5000);

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
      seguro = setTimeout(mostrarFinal, 3500);
    },
    // La API rechazó (sin existencias, sesión vencida): la escena se retira y el error lo dice la tienda.
    cancel: () => cerrar(null),
  };
}

// La coreografía. Cada paso tiene peso: la bolsa toma impulso antes de caer, la caja acusa el golpe y se
// asienta, las tapas giran sobre su bisagra, la caja retrocede antes de salir.
function coreografia(gsap, el, alLlegarEtiqueta, alTerminar) {
  const $ = (s) => el.querySelector(s);
  const caja = $('.caja');
  const bolsa = $('.bolsa');
  const CURVA = 'power3.out';
  return gsap.timeline({ onComplete: alTerminar })
    // tus guisos, en su bolsa; la caja abierta, abajo
    .from(bolsa, { y: 14, opacity: 0, duration: 0.3, ease: CURVA })
    .from(caja, { y: 26, opacity: 0, duration: 0.3, ease: CURVA }, 0.1)
    .set($('.etiqueta'), { opacity: 0 }, 0)
    .set($('.cinta'), { scaleY: 0, transformOrigin: '50% 0%' }, 0)
    .set($('.tapa.izq'), { rotation: -118, svgOrigin: '100 116' }, 0)
    .set($('.tapa.der'), { rotation: 118, svgOrigin: '220 116' }, 0)
    .set($('.envio-vel'), { opacity: 0, scaleX: 0, transformOrigin: '100% 50%' }, 0)
    // se sella: la banda negra corre de un lado al otro
    .from($('.sello'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.3, ease: 'power2.inOut' }, 0.4)
    // toma impulso y cae dentro de la caja (por detrás del frente: no aparece ni desaparece nada)
    .to(bolsa, { y: -6, duration: 0.12, ease: 'power2.out' }, 0.75)
    .to(bolsa, { y: 104, duration: 0.32, ease: 'power2.in' }, 0.87)
    .to(caja, { scaleY: 0.95, transformOrigin: '50% 100%', duration: 0.08, ease: 'power2.out' }, 1.17)
    .to(caja, { scaleY: 1, duration: 0.2, ease: CURVA }, 1.25)
    // se cierran las tapas, una y otra
    .to($('.tapa.izq'), { rotation: 0, svgOrigin: '100 116', duration: 0.28, ease: 'power3.inOut' }, 1.3)
    .to($('.tapa.der'), { rotation: 0, svgOrigin: '220 116', duration: 0.28, ease: 'power3.inOut' }, 1.4)
    // cinta y etiqueta con el número
    .to($('.cinta'), { scaleY: 1, duration: 0.18, ease: 'power2.out' }, 1.7)
    .fromTo($('.etiqueta'), { opacity: 0, scale: 1.25, rotation: -6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, rotation: 0, duration: 0.22, ease: CURVA }, 1.85)
    .addLabel('etiqueta', 2.07)
    .call(() => alLlegarEtiqueta(), null, 2.07)
    // la caja retrocede y sale; tras ella, tres rayas de velocidad
    .to(caja, { x: -10, duration: 0.14, ease: 'power2.out' }, 2.2)
    .to(caja, { x: 330, duration: 0.42, ease: 'power3.in' }, 2.34)
    .to($('.envio-vel'), { opacity: 1, scaleX: 1, duration: 0.16, ease: CURVA }, 2.36)
    .to($('.envio-vel'), { opacity: 0, x: 120, duration: 0.3, ease: 'power2.in' }, 2.52)
    // el final, que se queda: el piso se va y entra «Pedido #N confirmado» en su lugar
    .to(el.querySelector('.envio-escena svg'), { opacity: 0, duration: 0.25, ease: 'power2.out' }, 2.62)
    .fromTo($('.envio-final'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: CURVA, onStart: () => { $('.envio-final').hidden = false; } }, 2.7);
}
