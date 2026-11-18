// La bolsa al vacío con compartimentos: el carrito, dibujado (docs/diseno/empacado.md).
// La bolsa es la imagen que eligió Alejandro (media/bolsa/bolsa.webp); cada guiso ocupa una de sus seis
// cámaras: su foto queda debajo del plástico de esa cámara (media/bolsa/camara-N.webp, en hard-light).
// PENDIENTE-CLIENTE: imagen generada con IA, sustituir por foto real antes de publicar o vender.
// Se pinta desde el carrito que devuelve la API, por clave: una cámara no se rehace cuando cambia su
// cantidad. El movimiento lo lleva GSAP (vendor/gsap.min.js): sin GSAP o con movimiento reducido, el
// estado cambia directo, sin animación.
import { guisoDe } from '../js/barra.js';
import { esc, money } from '../js/api.js';

export const POR_BOLSA = 6;
const VUELO = 0.32;     // s: un arco rápido
const MAX_VUELOS = 3;   // del cuarto vuelo simultáneo en adelante, sin vuelo
const moverse = () => globalThis.matchMedia?.('(prefers-reduced-motion: no-preference)').matches ?? false;
const animador = () => (moverse() ? globalThis.gsap ?? null : null);

export function bolsa(raiz) {
  const cont = raiz.querySelector('.bolsas');
  const comps = new Map();    // id del guiso → su cámara
  const orden = [];           // ids, en el orden en que entraron a la bolsa
  const llegadas = new Map(); // id → cuándo aterriza su vuelo (ms), para que el llenado espere al guiso
  const volando = new Set();  // guisos con un vuelo en el aire: tocar «+» otra vez no lanza otro
  let vuelos = 0;
  let totalAntes = null;
  let esperaMayor = 0;        // s: lo que falta para que aterrice el último guiso (el total brinca entonces)

  const ahora = () => performance.now();

  function camara(it) {
    const g = guisoDe(it.guiso.nombre);
    const li = document.createElement('li');
    li.className = 'comp';
    li.dataset.clave = String(it.guiso.id);
    li.style.setProperty('--c', g.color);
    if (g.foto) li.style.setProperty('--foto', `url("/media/guisos/${g.slug}.webp")`);
    li.innerHTML = '<span class="comp-guiso"></span><span class="comp-plastico"></span><span class="comp-banda"></span>'
      + `<span class="comp-etq"><b>${esc(g.n)}</b><span class="comp-nombre">${esc(it.guiso.nombre)}</span>`
      + `<span class="comp-cant"><span aria-hidden="true">× </span><span class="n">${esc(it.cantidad)}</span></span></span>`;
    return li;
  }

  // Llenar: la foto entra prensada bajo el plástico, el láser sella arriba y cae la etiqueta.
  // Sumar: el láser vuelve a pasar y la cantidad rueda. Si la cámara se está llenando, sumar solo cambia el número.
  const DURA = { llena: 450, suma: 300 };
  function paso(li, clase) {
    if (clase === 'suma' && ahora() < Number(li.dataset.hasta || 0)) return;
    const espera = Math.max(0, (llegadas.get(li.dataset.clave) ?? 0) - ahora()) / 1000;
    li.dataset.hasta = String(ahora() + espera * 1000 + DURA[clase]);
    li.classList.remove('llena', 'suma');
    li.classList.add(clase);
    esperaMayor = Math.max(esperaMayor, espera + DURA[clase] / 1000);
    const gsap = animador();
    if (!gsap) return;
    const q = (s) => li.querySelector(s);
    const tl = gsap.timeline({ delay: espera });
    if (clase === 'llena') {
      tl.fromTo(q('.comp-guiso'), { scale: 1.1, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.24, ease: 'power3.out' })
        .fromTo(q('.comp-plastico'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24, ease: 'power1.in' }, '<')
        .fromTo(q('.comp-banda'), { scaleX: 0, autoAlpha: 1 }, { scaleX: 1, duration: 0.18, ease: 'none', transformOrigin: '0% 50%' }, '<0.05')
        .to(q('.comp-banda'), { autoAlpha: 0, duration: 0.12 })
        .fromTo(q('.comp-etq'), { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.2, ease: 'back.out(2)' }, '-=0.14');
    } else {
      tl.fromTo(q('.comp-banda'), { scaleX: 0, autoAlpha: 1 }, { scaleX: 1, duration: 0.18, ease: 'none', transformOrigin: '0% 50%' })
        .to(q('.comp-banda'), { autoAlpha: 0, duration: 0.12 })
        .fromTo(q('.n'), { yPercent: 70, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.2, ease: 'power2.out' }, 0);
    }
  }

  // Bolsas y huecos: cada cámara en su lugar (la posición en la bolsa sale del orden, en CSS); los huecos
  // completan la última bolsa. Con más de seis guisos, cada bolsa dice cuál es.
  function acomodar() {
    const n = Math.max(1, Math.ceil(orden.length / POR_BOLSA));
    while (cont.children.length < n) {
      const b = document.createElement('div');
      b.className = 'bolsa';
      b.innerHTML = '<p class="bolsa-num" hidden></p><ul class="comps"></ul>';
      cont.append(b);
    }
    while (cont.children.length > n) cont.lastElementChild.remove();
    for (const h of cont.querySelectorAll('.hueco')) h.remove();
    orden.forEach((id, i) => {
      const ul = cont.children[Math.floor(i / POR_BOLSA)].querySelector('.comps');
      const li = comps.get(id);
      if (li.parentNode !== ul || ul.children[i % POR_BOLSA] !== li) ul.insertBefore(li, ul.children[i % POR_BOLSA] ?? null);
    });
    [...cont.children].forEach((b, i) => {
      const num = b.querySelector('.bolsa-num');
      if (!num) return;
      num.hidden = n === 1;
      num.textContent = `Bolsa ${i + 1} de ${n}${i < n - 1 ? ' · llena' : ''}`;
    });
    for (const b of cont.children) {
      const ul = b.querySelector('.comps');
      for (let k = ul.querySelectorAll('.comp').length; k < POR_BOLSA; k++) {
        const h = document.createElement('li');
        h.className = 'hueco';
        h.setAttribute('aria-hidden', 'true');
        ul.append(h);
      }
    }
  }

  function vaciar(id) {
    const li = comps.get(id);
    comps.delete(id);
    orden.splice(orden.indexOf(id), 1);
    li.removeAttribute('data-clave');
    const gsap = animador();
    if (!gsap) return li.remove();
    li.classList.add('sale');
    gsap.to(li, { scale: 0.92, autoAlpha: 0, duration: 0.22, ease: 'power2.in', onComplete: () => { li.remove(); acomodar(); } });
  }

  function golpe(el, clase) {
    if (!el) return;
    el.classList.remove(clase);
    void el.offsetWidth;
    el.classList.add(clase);
  }

  // Lo que dice el carrito, en la bolsa: cámaras nuevas se llenan, cantidades nuevas suman, las que ya no
  // están se vacían. Abajo, el resumen (para la barra de celular) y el total, que brinca si sube.
  function pintar(items, total) {
    const ids = items.map((it) => String(it.guiso.id));
    for (const id of [...comps.keys()]) if (!ids.includes(id)) vaciar(id);
    for (const it of items) {
      const id = String(it.guiso.id);
      const li = comps.get(id);
      if (!li) {
        const nuevo = camara(it);
        comps.set(id, nuevo);
        orden.push(id);
        acomodar();
        paso(nuevo, 'llena');
      } else if (li.querySelector('.n').textContent !== String(it.cantidad)) {
        li.querySelector('.n').textContent = String(it.cantidad);
        paso(li, 'suma');
      }
    }
    acomodar();
    const piezas = items.reduce((s, it) => s + it.cantidad, 0);
    raiz.classList.toggle('vacia', !items.length);
    raiz.querySelector('.bolsa-mini').innerHTML = items.map((it) => `<i style="--c:${guisoDe(it.guiso.nombre).color}"></i>`).join('');
    raiz.querySelector('.bolsa-n').textContent = `${piezas} ${piezas === 1 ? 'guiso' : 'guisos'}`;
    for (const t of raiz.querySelectorAll('.bolsa-total')) t.textContent = money(total);
    if (totalAntes !== null && total > totalAntes && moverse()) {
      const cifra = raiz.querySelector('.bolsa-cuentas .total');
      const confirmar = raiz.querySelector('.bolsa-cuentas [data-click="checkout"]');
      golpe(cifra, 'salta');
      golpe(confirmar, 'pulso');
      const gsap = animador();
      if (gsap && cifra && confirmar) {
        gsap.timeline({ delay: esperaMayor })
          .fromTo(cifra.querySelector('strong') ?? cifra, { y: 0 }, { keyframes: [{ y: -6, duration: 0.12, ease: 'power2.out' }, { y: 0, duration: 0.3, ease: 'bounce.out' }] })
          .fromTo(confirmar, { scale: 1 }, { scale: 1.05, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 0);
      }
    }
    totalAntes = total;
    esperaMayor = 0;
  }

  const desplegada = () => !raiz.querySelector('.bolsa-barra')?.offsetParent || raiz.classList.contains('abierta');

  // A dónde vuela un guiso: a su cámara, al primer hueco o, con la bolsa plegada, a la barra.
  function destino(id) {
    if (!desplegada()) return raiz.querySelector('.bolsa-barra');
    return comps.get(String(id)) ?? cont.querySelector('.hueco') ?? cont;
  }

  // La foto del guiso vuela en arco del renglón a su cámara y llega de su tamaño. Devuelve cancel() para
  // cuando la API rechaza: el guiso se sacude y se desvanece donde vaya.
  function volar(miniatura, id) {
    const gsap = animador();
    if (!gsap || !miniatura || vuelos >= MAX_VUELOS || volando.has(String(id))) return { cancel() {} };
    const a = miniatura.getBoundingClientRect();
    const b = destino(id).getBoundingClientRect();
    const clon = document.createElement('div');
    clon.className = 'vuela';
    clon.setAttribute('aria-hidden', 'true');
    const foto = miniatura.querySelector?.('img')?.currentSrc;
    clon.style.backgroundColor = miniatura.style?.getPropertyValue?.('--c') || '';
    if (foto) clon.style.backgroundImage = `url("${foto}")`;
    Object.assign(clon.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
    document.body.append(clon);
    const k = b.width / a.width;
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const arco = 40 + Math.min(120, Math.abs(dx) * 0.25);
    vuelos++;
    volando.add(String(id));
    llegadas.set(String(id), ahora() + VUELO * 1000);
    let quitado = false;
    const quitar = () => { if (quitado) return; quitado = true; vuelos--; volando.delete(String(id)); clon.remove(); };
    const vuelo = gsap.to(clon, {
      keyframes: [
        { x: dx / 2, y: dy / 2 - arco, scale: (1 + k) / 2, duration: VUELO / 2, ease: 'power1.out' },
        { x: dx, y: dy, scale: k, duration: VUELO / 2, ease: 'power2.in' },
      ],
      onComplete: quitar,
    });
    return {
      cancel() {
        llegadas.delete(String(id));
        if (quitado) return;
        vuelo.kill();
        gsap.to(clon, { keyframes: [{ x: '-=6', duration: 0.06 }, { x: '+=12', duration: 0.08 }, { x: '-=6', autoAlpha: 0, duration: 0.14 }], onComplete: quitar });
      },
    };
  }

  // En celular la barra despliega la bolsa; el botón del carrito de la cabecera la abre o la muestra.
  const barra = raiz.querySelector('.bolsa-barra');
  barra?.addEventListener('click', () => abrir(!raiz.classList.contains('abierta')));
  function abrir(si = true) {
    raiz.classList.toggle('abierta', si);
    barra?.setAttribute('aria-expanded', String(si));
  }
  function mostrar() {
    if (barra?.offsetParent) return abrir(true);
    raiz.scrollIntoView({ block: 'nearest' });
    raiz.querySelector('#bolsa-titulo')?.focus({ preventScroll: true });
  }

  return { pintar, volar, destino, mostrar, abrir, get conectada() { return raiz.isConnected; } };
}
