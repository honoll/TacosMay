// La bolsa al vacío con compartimentos: el carrito, dibujado (docs/diseno/empacado.md).
// Un compartimento por guiso distinto; seis por bolsa (el séptimo abre otra). Se pinta desde el carrito
// que devuelve la API, por clave: un compartimento no se rehace cuando cambia su cantidad, así no repite
// su llenado. El vuelo de la miniatura al compartimento y los pasos de llenar, sellar y etiquetar son
// respuesta visual: el compartimento aparece cuando la API confirma. Con movimiento reducido no hay vuelo
// ni pasos (CSS): el compartimento aparece ya sellado.
import { guisoDe, tinta } from '../js/barra.js';
import { esc, money } from '../js/api.js';

export const POR_BOLSA = 6;
const VUELO = 450;        // ms
const MAX_VUELOS = 3;     // del cuarto vuelo simultáneo en adelante, sin vuelo
const moverse = () => globalThis.matchMedia?.('(prefers-reduced-motion: no-preference)').matches ?? false;

export function bolsa(raiz) {
  const cont = raiz.querySelector('.bolsas');
  const comps = new Map();    // id del guiso → su compartimento
  const orden = [];           // ids, en el orden en que entraron a la bolsa
  const llegadas = new Map(); // id → cuándo aterriza su vuelo (para que el llenado espere al guiso)
  let vuelos = 0;

  const ahora = () => performance.now();

  function compartimento(it) {
    const g = guisoDe(it.guiso.nombre);
    const li = document.createElement('li');
    li.className = 'comp';
    li.dataset.clave = String(it.guiso.id);
    li.style.setProperty('--c', g.color);
    li.style.setProperty('--t', tinta(g.color));
    if (g.foto) li.style.setProperty('--foto', `url("/media/guisos/${g.slug}.webp")`);
    li.innerHTML = `<span class="comp-guiso"></span><span class="comp-banda"></span>`
      + `<span class="comp-etq"><b>${esc(g.n)}</b><span class="comp-nombre">${esc(it.guiso.nombre)}</span>`
      + `<span class="comp-cant"><span aria-hidden="true">× </span><span class="n">${esc(it.cantidad)}</span></span></span>`;
    return li;
  }

  // Un paso del compartimento (llena, suma, sale). Espera a que aterrice el guiso que viene volando.
  function paso(li, clase) {
    const espera = Math.max(0, (llegadas.get(li.dataset.clave) ?? 0) - ahora());
    li.style.setProperty('--espera', `${Math.round(espera)}ms`);
    li.classList.remove('llena', 'suma');
    void li.offsetWidth;
    li.classList.add(clase);
  }

  // Bolsas y huecos: cada compartimento en su lugar; los huecos completan la última bolsa.
  function acomodar() {
    const n = Math.max(1, Math.ceil(orden.length / POR_BOLSA));
    while (cont.children.length < n) {
      const b = document.createElement('div');
      b.className = 'bolsa';
      b.innerHTML = '<ul class="comps"></ul>';
      cont.append(b);
    }
    while (cont.children.length > n) cont.lastElementChild.remove();
    for (const h of cont.querySelectorAll('.hueco')) h.remove();
    orden.forEach((id, i) => {
      const ul = cont.children[Math.floor(i / POR_BOLSA)].querySelector('.comps');
      const li = comps.get(id);
      if (li.parentNode !== ul || ul.children[i % POR_BOLSA] !== li) ul.insertBefore(li, ul.children[i % POR_BOLSA] ?? null);
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
    if (!moverse()) return li.remove();
    li.classList.add('sale');
    setTimeout(() => { li.remove(); acomodar(); }, 260);
  }

  // Lo que dice el carrito, en la bolsa: compartimentos nuevos se llenan, cantidades nuevas suman,
  // los que ya no están se vacían. Abajo, el resumen (para la barra de celular) y el total.
  function pintar(items, total) {
    const ids = items.map((it) => String(it.guiso.id));
    for (const id of [...comps.keys()]) if (!ids.includes(id)) vaciar(id);
    for (const it of items) {
      const id = String(it.guiso.id);
      const li = comps.get(id);
      if (!li) {
        const nuevo = compartimento(it);
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
  }

  const desplegada = () => !raiz.querySelector('.bolsa-barra')?.offsetParent || raiz.classList.contains('abierta');

  // A dónde vuela un guiso: a su compartimento, al primer hueco o, con la bolsa plegada, a la barra.
  function destino(id) {
    if (!desplegada()) return raiz.querySelector('.bolsa-barra');
    return comps.get(String(id)) ?? cont.querySelector('.hueco') ?? cont;
  }

  // La miniatura de la charola vuela del renglón a la bolsa. Devuelve cancel() para cuando la API rechaza:
  // el guiso se sacude y se desvanece donde vaya.
  function volar(miniatura, id) {
    if (!moverse() || !miniatura || vuelos >= MAX_VUELOS) return { cancel() {} };
    const a = miniatura.getBoundingClientRect();
    const b = destino(id).getBoundingClientRect();
    const clon = miniatura.cloneNode(true);
    clon.classList.add('vuela');
    clon.setAttribute('aria-hidden', 'true');
    Object.assign(clon.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
    document.body.append(clon);
    const k = Math.min(1, (b.width * 0.7) / a.width);
    const fin = `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px, ${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(${k})`;
    vuelos++;
    llegadas.set(String(id), ahora() + VUELO);
    const anim = clon.animate([{ transform: 'none' }, { transform: fin }], { duration: VUELO, easing: 'cubic-bezier(.5, 0, .2, 1)', fill: 'forwards' });
    let quitado = false;
    const quitar = () => { if (quitado) return; quitado = true; vuelos--; clon.remove(); };
    anim.finished.then(quitar, quitar);
    return {
      cancel() {
        llegadas.delete(String(id));
        if (quitado) return;
        const t = getComputedStyle(clon).transform;
        anim.cancel();
        clon.style.transform = t;
        clon.animate([{ transform: t }, { transform: `${t} translateX(-6px)` }, { transform: `${t} translateX(6px)`, opacity: 0 }], { duration: 300 }).finished.then(quitar, quitar);
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
