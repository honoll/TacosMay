// La bolsa con compartimentos y la escena del envío: node frontend/tienda/bolsa.test.mjs
// Corre tienda/bolsa.js y tienda/envio.js con un DOM de juguete: llenar, sumar cantidad, otra bolsa al
// séptimo guiso, quitar, el vuelo que se revierte si la API rechaza, la barra de celular, confirmar y
// saltar la escena, y movimiento reducido (sin vuelo, sin pasos, sin escena).
import assert from 'node:assert/strict';

// ---------- DOM de juguete ----------
class E {
  constructor(tag) {
    Object.assign(this, { tagName: tag.toUpperCase(), children: [], parentNode: null, className: '', dataset: {}, attrs: {}, h: {}, textContent: '', _html: '' });
    this.style = { vars: {}, setProperty(k, v) { this.vars[k] = v; } };
  }
  cl() { return this.className.split(/\s+/).filter(Boolean); }
  get classList() {
    const el = this;
    return {
      add: (...c) => { el.className = [...new Set([...el.cl(), ...c])].join(' '); },
      remove: (...c) => { el.className = el.cl().filter((x) => !c.includes(x)).join(' '); },
      contains: (c) => el.cl().includes(c),
      toggle: (c, si) => ((si ?? !el.cl().includes(c)) ? el.classList.add(c) : el.classList.remove(c)),
    };
  }
  // Lo que se escribe como HTML se vuelve hijos planos, uno por cada elemento con clase (basta para buscar por clase).
  set innerHTML(v) {
    this._html = v;
    this.children = [];
    for (const [, tag, cls, texto] of v.matchAll(/<(\w+)[^>]*?class="([^"]*)"[^>]*>([^<]*)/g)) {
      const e = new E(tag);
      e.className = cls;
      e.textContent = texto;
      this.appendChild(e);
    }
  }
  get innerHTML() { return this._html; }
  append(...ns) { for (const n of ns) this.appendChild(n); }
  appendChild(n) { n.remove(); n.parentNode = this; this.children.push(n); return n; }
  insertBefore(n, ref) {
    n.remove();
    n.parentNode = this;
    const i = ref ? this.children.indexOf(ref) : -1;
    if (i < 0) this.children.push(n); else this.children.splice(i, 0, n);
  }
  remove() { if (this.parentNode) { const c = this.parentNode.children; c.splice(c.indexOf(this), 1); this.parentNode = null; } }
  get lastElementChild() { return this.children.at(-1); }
  get isConnected() { return true; }
  todos() { return this.children.flatMap((c) => [c, ...c.todos()]); }
  querySelectorAll(sel) { return this.todos().filter((e) => e.cl().includes(sel.slice(1))); }
  querySelector(sel) { return sel.startsWith('#') ? this.todos().find((e) => e.id === sel.slice(1)) ?? null : this.querySelectorAll(sel)[0] ?? null; }
  setAttribute(k, v) { this.attrs[k] = v; }
  removeAttribute(k) { delete this.attrs[k]; if (k === 'data-clave') delete this.dataset.clave; }
  get offsetWidth() { return 0; }
  get offsetParent() { return this.visible ? {} : null; }
  addEventListener(t, f) { (this.h[t] ??= []).push(f); }
  focus() { enfocado = this; }
  getBoundingClientRect() { return { left: 10, top: 10, width: 100, height: 80 }; }
  cloneNode() { const c = new E(this.tagName); c.className = this.className; return c; }
  animate(cuadros) { animaciones.push(cuadros); let fin; const finished = new Promise((r) => { fin = r; }); setTimeout(fin, 5); return { finished, cancel() {} }; }
}
let enfocado = null;
let reducido = false;
const animaciones = [];
const oyentesDoc = {};
const cuerpo = new E('body');
let reloj = 1000;
Object.assign(globalThis, {
  matchMedia: (q) => ({ matches: q.includes('no-preference') ? !reducido : reducido }),
  performance: { now: () => reloj },
  getComputedStyle: () => ({ transform: 'none' }),
  // GSAP de juguete: registra cada animación y la termina a los pocos milisegundos (llama a onComplete).
  gsap: {
    llamadas: [],
    animacion(vars = {}) {
      let viva = true;
      setTimeout(() => { if (viva) vars.onComplete?.(); }, 5);
      return { kill() { viva = false; } };
    },
    to(el, vars) { this.llamadas.push(['to', el, vars]); return this.animacion(vars); },
    fromTo(el, de, a) { this.llamadas.push(['fromTo', el, a]); return this.animacion(a); },
    // Línea de tiempo de juguete: a los pocos ms corre sus .call() (la etiqueta) y, si nadie la pausó, termina.
    timeline(vars = {}) {
      const g = this;
      const llamar = [];
      let viva = true;
      let pausada = false;
      let hecha = false;
      const fin = () => { if (!viva || pausada || hecha) return; hecha = true; vars.onComplete?.(); };
      const tl = {
        to: () => tl, fromTo: () => tl, from: () => tl, set: () => tl, addLabel: () => tl,
        call: (f) => { llamar.push(f); return tl; },
        kill() { viva = false; },
        pause() { pausada = true; return tl; },
        play() { pausada = false; setTimeout(fin, 5); return tl; },
        paused: () => pausada,
        progress() { pausada = false; fin(); return tl; },
        seek() { return tl; },
      };
      g.llamadas.push(['timeline', null, vars]);
      setTimeout(() => { if (!viva) return; for (const f of llamar) f(); fin(); }, 5); // a los 5 ms, como antes
      return tl;
    },
  },
  document: {
    createElement: (t) => new E(t),
    body: cuerpo,
    get activeElement() { return enfocado; },
    addEventListener: (t, f) => { oyentesDoc[t] = f; },
    removeEventListener: (t) => { delete oyentesDoc[t]; },
  },
});

function raizBolsa() {
  const raiz = new E('aside');
  raiz.className = 'bolsa-lado vacia';
  const hijo = (tag, cls) => { const e = new E(tag); e.className = cls; raiz.appendChild(e); return e; };
  const barra = hijo('button', 'bolsa-barra');
  for (const c of ['bolsa-mini', 'bolsa-n', 'bolsas', 'bolsa-total', 'bolsa-total']) hijo('span', c);
  return { raiz, barra, cont: raiz.querySelector('.bolsas') };
}
const G = (id, nombre) => ({ id, nombre });
const GUISOS = [G('1', 'Carne en salsa roja'), G('2', 'Chorizo con huevo'), G('3', 'Rajas con queso y crema'), G('4', 'Tinga de res'),
  G('5', 'Salpicón'), G('6', 'Nopalitos'), G('7', 'Mole con pollo')];
const espera = (ms = 10) => new Promise((r) => setTimeout(r, ms));

const { bolsa, POR_BOLSA } = await import('./bolsa.js');
const { enviar } = await import('./envio.js');
const { raiz, barra, cont } = raizBolsa();
const b = bolsa(raiz);
const comps = () => cont.querySelectorAll('.comp').filter((c) => !c.cl().includes('sale'));
const huecos = () => cont.querySelectorAll('.hueco');

// ---------- El total brinca y «Confirmar pedido» hace un pulso cuando sube ----------
{
  const r = raizBolsa();
  const cuentas = new E('div'); cuentas.className = 'bolsa-cuentas';
  const total = new E('p'); total.className = 'total';
  const confirmar = new E('button'); confirmar.className = 'primario'; confirmar.attrs['data-click'] = 'checkout';
  cuentas.append(total, confirmar); r.raiz.appendChild(cuentas);
  r.raiz.querySelector = ((q) => (sel) => (sel === '.bolsa-cuentas .total' ? total : sel === '.bolsa-cuentas [data-click="checkout"]' ? confirmar : q.call(r.raiz, sel)))(r.raiz.querySelector);
  const bb = bolsa(r.raiz);
  bb.pintar([], 0);
  assert.ok(!total.cl().includes('salta'), 'al abrir no brinca nada');
  bb.pintar([{ guiso: GUISOS[0], cantidad: 1 }], 20000);
  assert.ok(total.cl().includes('salta') && confirmar.cl().includes('pulso'), 'sube el total: brinca y «Confirmar pedido» pulsa');
}

// ---------- Llenar: el primer guiso abre su compartimento y se llena ----------
b.pintar([{ guiso: GUISOS[0], cantidad: 1 }], 20000);
assert.equal(POR_BOLSA, 6);
assert.equal(comps().length, 1, 'un compartimento por guiso');
const carne = comps()[0];
assert.equal(carne.dataset.clave, '1');
assert.ok(carne.cl().includes('llena'), 'se llena: cae, vacío, sella, etiqueta');
assert.equal(carne.querySelector('.n').textContent, '1');
assert.equal(huecos().length, 5, 'la bolsa muestra los huecos que le quedan');
assert.equal(raiz.querySelector('.bolsa-n').textContent, '1 guiso');
assert.equal(raiz.querySelectorAll('.bolsa-total')[0].textContent, '$200.00');
assert.equal(raiz.cl().includes('vacia'), false);

// ---------- Sumar a medio llenado: solo cambia el número, la animación no se reinicia ----------
b.pintar([{ guiso: GUISOS[0], cantidad: 2 }], 40000);
assert.ok(carne.cl().includes('llena') && !carne.cl().includes('suma'), 'tocar «+» seguido no encima animaciones');
assert.equal(carne.querySelector('.n').textContent, '2');

// ---------- Sumar: más del mismo guiso cambia su cantidad, sin abrir otro ----------
reloj += 1000; // ya terminó de llenarse
b.pintar([{ guiso: GUISOS[0], cantidad: 3 }], 60000);
assert.equal(comps().length, 1, 'no abre otro compartimento');
assert.equal(comps()[0], carne, 'es el mismo: no se rehace ni repite su llenado');
assert.equal(carne.querySelector('.n').textContent, '3');
assert.ok(carne.cl().includes('suma') && !carne.cl().includes('llena'), 'la cantidad rueda y se vuelve a sellar');
assert.equal(raiz.querySelector('.bolsa-n').textContent, '3 guisos');

// ---------- Otro guiso, otro compartimento; al séptimo, otra bolsa ----------
b.pintar(GUISOS.map((g, i) => ({ guiso: g, cantidad: i === 0 ? 3 : 1 })), 140000);
assert.equal(comps().length, 7);
assert.equal(cont.children.length, 2, 'el séptimo guiso abre otra bolsa');
assert.equal(cont.children[1].querySelectorAll('.comp').length, 1);
assert.equal(cont.children[1].querySelectorAll('.hueco').length, 5);
assert.equal(cont.children[0].querySelector('.bolsa-num').textContent, 'Bolsa 1 de 2 · llena', 'la primera bolsa dice que está llena');
assert.equal(cont.children[1].querySelector('.bolsa-num').textContent, 'Bolsa 2 de 2');
assert.equal(cont.children[0].querySelector('.bolsa-num').hidden, false);
assert.deepEqual(comps().map((c) => c.dataset.clave), ['1', '2', '3', '4', '5', '6', '7'], 'en el orden en que entraron');

// ---------- Quitar: se vacía su compartimento y los demás se recorren ----------
b.pintar(GUISOS.slice(1).map((g) => ({ guiso: g, cantidad: 1 })), 120000);
assert.ok(carne.cl().includes('sale'), 'el compartimento se vacía');
await espera(300);
assert.equal(carne.parentNode, null, 'y se retira');
assert.deepEqual(comps().map((c) => c.dataset.clave), ['2', '3', '4', '5', '6', '7'], 'los demás se recorren');
assert.equal(cont.children.length, 1, 'con seis vuelve a ser una bolsa');
b.pintar([], 0);
await espera(300);
assert.equal(comps().length, 0);
assert.ok(raiz.cl().includes('vacia'), 'vacía, dice que está vacía');
assert.equal(huecos().length, 6);

// ---------- El vuelo: espera a que aterrice; si la API rechaza, se revierte ----------
const mini = new E('div');
mini.className = 'charola mini';
let vuelo = b.volar(mini, '1');
assert.equal(cuerpo.children.filter((c) => c.cl().includes('vuela')).length, 1, 'la miniatura vuela');
b.pintar([{ guiso: GUISOS[0], cantidad: 1 }], 20000);
const llenado = gsap.llamadas.filter(([t]) => t === 'timeline').at(-1)[2];
assert.equal(llenado.delay, 0.32, 'la cámara se llena cuando aterriza el guiso');
await espera(20);
assert.equal(cuerpo.children.filter((c) => c.cl().includes('vuela')).length, 0, 'al aterrizar, la miniatura se retira');
vuelo = b.volar(mini, '2');
b.volar(mini, '2');
assert.equal(cuerpo.children.filter((c) => c.cl().includes('vuela')).length, 1, 'un solo vuelo por guiso a la vez');
const antes = animaciones.length;
vuelo.cancel();
const sacudida = gsap.llamadas.at(-1);
assert.ok(sacudida[0] === 'to' && JSON.stringify(sacudida[2].keyframes).includes('+=12'), 'la API rechazó: el guiso se sacude y se desvanece');
await espera(20);
assert.equal(cuerpo.children.filter((c) => c.cl().includes('vuela')).length, 0);
assert.equal(comps().length, 1, 'y no se abre compartimento');
const tres = [b.volar(mini, '3'), b.volar(mini, '4'), b.volar(mini, '5'), b.volar(mini, '6')];
assert.equal(cuerpo.children.filter((c) => c.cl().includes('vuela')).length, 3, 'nunca más de tres vuelos a la vez');
await espera(20);
void tres;

// ---------- Celular: plegada, el guiso vuela a la barra; tocarla la despliega ----------
barra.visible = true;
assert.equal(b.destino('9'), barra, 'con la bolsa plegada, el vuelo va a la barra');
barra.h.click[0]();
assert.ok(raiz.cl().includes('abierta') && barra.attrs['aria-expanded'] === 'true', 'tocar la barra despliega la bolsa');
assert.notEqual(b.destino('9'), barra, 'desplegada, va al compartimento');
barra.h.click[0]();
assert.equal(barra.attrs['aria-expanded'], 'false');
barra.visible = false;

// ---------- Confirmar: la escena termina en «Pedido #N confirmado» y la persona elige a dónde ir ----------
const capaDe = () => cuerpo.children.find((c) => c.cl().includes('envio'));
let escena = enviar(['#a8321c', '#f2b33d']);
let capa = capaDe();
assert.ok(capa && capa.attrs.role === 'dialog', 'sale la escena de envío');
assert.equal(enfocado?.cl().includes('envio-saltar'), true, '«Saltar» recibe el foco');
let eleccion = 'sin elegir';
escena.listo.then((e) => { eleccion = e; });
oyentesDoc.keydown({ key: 'Escape' }); // saltar antes de que responda la API
await espera(30);
assert.ok(cuerpo.children.includes(capa) && capa.querySelector('.envio-final').hidden, 'saltar sin número no cierra: espera el número');
escena.confirmar({ id: 42 }, '$580.00');
await espera(30);
assert.equal(capa.querySelector('.envio-final').hidden, false, 'con el número, el final');
assert.equal(capa.querySelector('.envio-numero').textContent, '#42', '«Pedido #42 confirmado»');
assert.equal(capa.querySelector('.envio-num').textContent, '#42', 'y el número en la etiqueta de la caja');
assert.equal(capa.querySelector('.envio-total').textContent, '$580.00');
assert.equal(enfocado?.cl().includes('envio-ver'), true, '«Ver mis pedidos» recibe el foco');
capa.querySelector('.envio-seguir').h.click[0]();
await espera();
assert.ok(eleccion === 'catalogo' && !cuerpo.children.includes(capa), '«Seguir comprando» cierra y vuelve a los guisos');

escena = enviar([]);
capa = capaDe();
escena.cancel(); // la API rechazó (409)
assert.equal(await escena.listo, null);
assert.ok(!cuerpo.children.includes(capa), 'si falla la API, la escena se retira');

escena = enviar(['#35603a']);
capa = capaDe();
escena.confirmar({ id: 7 }, '$180.00');
await espera(40);
assert.equal(capa.querySelector('.envio-final').hidden, false, 'sin tocar nada, la línea llega sola al final');
capa.h.click[0](); // un toque en el final no lo cierra: hay que elegir
assert.ok(cuerpo.children.includes(capa));
oyentesDoc.keydown({ key: 'Escape' });
assert.equal(await escena.listo, 'pedidos', 'Escape en el final lleva a «Mis pedidos»');

// ---------- Movimiento reducido: sin vuelo, sin pasos, sin escena ----------
reducido = true;
const r2 = raizBolsa();
const b2 = bolsa(r2.raiz);
const nVuelos = cuerpo.children.length;
b2.volar(mini, '1').cancel();
assert.equal(cuerpo.children.length, nVuelos, 'sin vuelo');
b2.pintar([{ guiso: GUISOS[0], cantidad: 1 }], 20000);
b2.pintar([], 0);
assert.equal(r2.cont.querySelectorAll('.comp').length, 0, 'quitar es inmediato, sin esperar a su animación');
escena = enviar(['#a8321c']);
capa = capaDe();
assert.ok(capa.cl().includes('quieta'), 'sin coreografía: «Confirmando…» y nada se mueve');
escena.confirmar({ id: 9 }, '$200.00');
assert.equal(capa.querySelector('.envio-final').hidden, false, 'directo al final en cuanto se confirma');
capa.querySelector('.envio-ver').h.click[0]();
assert.equal(await escena.listo, 'pedidos');
reducido = false;
const g = globalThis.gsap;
delete globalThis.gsap;
escena = enviar([]);
escena.confirmar({ id: 10 });
assert.equal(capaDe().querySelector('.envio-final').hidden, false, 'sin GSAP (no cargó), igual: nada se queda a medias');
escena.cancel();
globalThis.gsap = g;

console.log('bolsa.test: OK (llenar, sumar, otra bolsa, quitar, vuelo y error, celular, envío con número y salidas, movimiento reducido)');
