// Al confirmar el pedido: la bolsa sellada entra en una caja, la caja se cierra con su cinta y su
// etiqueta, y sube a un avión que despega (docs/diseno/empacado.md). Una línea de tiempo de GSAP, un paso
// después de otro, ≈ 2.6 s; se salta tocando, con «Saltar» o con Escape. Es una imagen de «va en camino»,
// sin texto que prometa envío. Sin GSAP o con movimiento reducido no hay escena: devuelve null y se llega
// directo a «Mis pedidos». Dibujo en la retícula de los pictogramas (caja en 120 × 110, avión en 24 × 24).

const CAJA = '<path class="tapa izq" fill="#b58a4f" d="M14 46 4 24h48l8 22Z"/>'
  + '<path class="tapa der" fill="#b58a4f" d="M106 46l10-22H68l-8 22Z"/>'
  + '<path fill="#c9a067" stroke="#141210" stroke-width="2" d="M14 46h92v56a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4Z"/>'
  + '<rect class="cinta" fill="#d9dcdd" stroke="#141210" stroke-width="1.5" x="52" y="44" width="16" height="30"/>'
  + '<g class="etiqueta"><rect fill="#f7f4ee" stroke="#141210" stroke-width="1.5" x="22" y="68" width="40" height="26" rx="2"/>'
  + '<circle fill="#c8161f" cx="31" cy="77" r="4"/><path stroke="#141210" stroke-width="2" stroke-linecap="round" d="M39 76h16M28 86h27"/></g>';
const AVION = '<path d="M11 2.5a1 1 0 0 1 2 0V8l9 5.5V16l-9-2.6v5l2.6 1.9V22L12 21l-3.6 1v-1.7L11 18.4v-5L2 16v-2.5L11 8Z"/>';

export function enviar(colores = []) {
  const gsap = globalThis.matchMedia?.('(prefers-reduced-motion: no-preference)').matches ? globalThis.gsap : null;
  if (!gsap) return null;
  const el = document.createElement('div');
  el.className = 'envio';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Empacando tu pedido');
  el.innerHTML = `
    <p class="sr" aria-live="polite">Empacando tu pedido</p>
    <div class="envio-escena" aria-hidden="true">
      <svg class="envio-avion" viewBox="0 0 24 24" fill="currentColor">${AVION}</svg>
      <div class="envio-bolsa">${colores.slice(0, 6).map((c) => `<i style="--c:${c}"></i>`).join('')}</div>
      <svg class="envio-caja" viewBox="0 0 120 110">${CAJA}</svg>
    </div>
    <button type="button" class="envio-saltar">Saltar</button>`;
  document.body.append(el);
  const antes = document.activeElement;
  el.querySelector('.envio-saltar').focus();

  let fin;
  const listo = new Promise((r) => { fin = r; });
  let hecho = false;
  let tl = null;
  const terminar = () => {
    if (hecho) return;
    hecho = true;
    clearTimeout(seguro);
    tl?.kill();
    document.removeEventListener('keydown', tecla);
    el.remove();
    antes?.focus?.({ preventScroll: true });
    fin();
  };
  const tecla = (e) => { if (e.key === 'Escape') terminar(); };
  document.addEventListener('keydown', tecla);
  el.addEventListener('click', terminar); // tocar en cualquier lugar (o «Saltar») la termina
  const seguro = setTimeout(terminar, 4500); // por si la línea de tiempo no llega a terminar

  const $ = (s) => el.querySelector(s);
  const caja = $('.envio-caja');
  const bolsa = $('.envio-bolsa');
  const avion = $('.envio-avion');
  tl = gsap.timeline({ onComplete: terminar })
    // entra la caja, abierta
    .from(caja, { scale: 0.8, autoAlpha: 0, duration: 0.25, ease: 'power2.out' })
    // la bolsa baja y se oculta dentro
    .to(bolsa, { yPercent: 95, scale: 0.8, duration: 0.35, ease: 'power2.in' })
    .to(bolsa, { autoAlpha: 0, duration: 0.1 }, '-=0.08')
    // se cierran las tapas, pasa la cinta, se pega la etiqueta
    .to(caja.querySelectorAll('.tapa'), { scaleY: 0.12, transformOrigin: '50% 100%', duration: 0.3, ease: 'power2.inOut', stagger: 0.05 })
    .fromTo(caja.querySelector('.cinta'), { scaleY: 0 }, { scaleY: 1, transformOrigin: '50% 0%', duration: 0.15, ease: 'none' })
    .fromTo(caja.querySelector('.etiqueta'), { scale: 1.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, transformOrigin: '50% 50%', duration: 0.18, ease: 'back.out(2)' })
    // el avión llega a un lado de la caja, sin tocarla
    .fromTo(avion, { xPercent: -160, rotation: 90, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.35, ease: 'power3.out' })
    // la caja se encoge hacia el avión y desaparece en él
    .to(caja, { xPercent: -114, yPercent: 16, scale: 0.15, autoAlpha: 0, duration: 0.4, ease: 'power2.in' })
    // despega
    .to(avion, { xPercent: 320, yPercent: -300, rotation: 70, autoAlpha: 0, duration: 0.7, ease: 'power2.in' });

  return { listo, cancel: terminar };
}
