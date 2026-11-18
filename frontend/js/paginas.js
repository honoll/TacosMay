// Entre la landing y la tienda sin recargar. Al tocar un enlace a la otra página, la pide con fetch y
// cambia solo lo que es de cada página: todo el <body> menos la cabecera, su script en línea, el pie y
// los scripts de módulo. La cabecera y el pie no se tocan.
// Lo de cada página se guarda al salir y se vuelve a poner al regresar, con sus escuchas: los scripts de
// cada página corren una sola vez y, al volver, se ponen al día con el evento «tm:pagina».
// Si algo falla (red, respuesta rara), navegación normal. Pestaña nueva, teclas modificadoras, enlaces
// externos, descargas y cambios de # dentro de la misma página: los atiende el navegador como siempre.

export const PAGINAS = ['/', '/tienda/'];
const fijo = (el) => el.matches('header.cabecera, header.cabecera + script, footer.pie, script[src], #anuncio');

const guardadas = new Map(); // ruta → lo de esa página, ya puesto alguna vez
const pedidas = new Map();   // ruta → promesa con su HTML (se pide al acercarse al enlace)
let actual = location.pathname;
let turno = 0;               // si llega otro clic antes de terminar, gana el último

const cabecera = () => document.querySelector('header.cabecera');
const pie = () => document.querySelector('footer.pie');
const hojas = () => [...document.head.querySelectorAll('link[rel="stylesheet"]')];
const animar = () => document.startViewTransition && matchMedia('(prefers-reduced-motion: no-preference)').matches;

// Para lector de pantalla: se dice a qué página se llegó.
const anuncio = Object.assign(document.createElement('p'), { id: 'anuncio', className: 'sr' });
anuncio.setAttribute('aria-live', 'polite');
document.body.append(anuncio);

// El salto entre páginas lo maneja esto, no el navegador (si no, al volver brincaría la página vieja).
history.scrollRestoration = 'manual';

function pedir(ruta) {
  if (!pedidas.has(ruta)) {
    pedidas.set(ruta, fetch(ruta).then((r) => {
      if (!r.ok || !r.headers.get('content-type')?.includes('text/html')) throw new Error(`${r.status}`);
      return r.text();
    }).catch((err) => { pedidas.delete(ruta); throw err; }));
  }
  return pedidas.get(ruta);
}

// Lo de la página que se ve ahora: los nodos antes y después de la cabecera, y sus hojas de estilo.
function partes(cuerpo, cab) {
  const hijos = [...cuerpo.children];
  const i = hijos.indexOf(cab);
  return { antes: hijos.slice(0, i).filter((el) => !fijo(el)), despues: hijos.slice(i + 1).filter((el) => !fijo(el)) };
}
const estaPagina = () => ({
  titulo: document.title,
  css: hojas().filter((l) => l.media !== 'not all').map((l) => l.href),
  js: [],
  ...partes(document.body, cabecera()),
  puesta: true,
});

// La otra página, la primera vez: de su HTML salen el título, las hojas, los scripts y sus nodos.
async function leer(ruta) {
  const doc = new DOMParser().parseFromString(await pedir(ruta), 'text/html');
  const base = new URL(ruta, location.href);
  const abs = (el, attr) => new URL(el.getAttribute(attr), base).href;
  return {
    titulo: doc.title,
    css: [...doc.head.querySelectorAll('link[rel="stylesheet"]')].map((l) => abs(l, 'href')),
    js: [...doc.body.querySelectorAll('script[type="module"][src]')].map((s) => abs(s, 'src')),
    ...partes(doc.body, doc.querySelector('header.cabecera')),
    puesta: false,
  };
}

// Una hoja nueva se carga sin aplicarse; se enciende en el mismo cuadro en que cambia el contenido.
function cargarHoja(href) {
  const l = Object.assign(document.createElement('link'), { rel: 'stylesheet', href, media: 'not all' });
  const lista = new Promise((r) => { l.onload = l.onerror = r; });
  document.head.append(l);
  return lista;
}

// Los nodos traídos de otro documento se adoptan aquí (ya con la dirección nueva, para que sus rutas
// relativas resuelvan bien). Un <script> en línea se rehace para que corra.
function adoptar(el) {
  if (el.tagName !== 'SCRIPT') return document.importNode(el, true);
  const s = document.createElement('script');
  s.textContent = el.textContent;
  return s;
}

export async function ir(url, { empuja = true } = {}) {
  const ruta = url.pathname;
  const mio = ++turno;
  let pag;
  try {
    pag = guardadas.get(ruta) || await leer(ruta);
    await Promise.all(pag.css.filter((h) => !hojas().some((l) => l.href === h)).map(cargarHoja));
  } catch {
    location.assign(url.href); // respaldo: navegación normal
    return;
  }
  if (mio !== turno) return;

  if (empuja) {
    history.replaceState({ ...history.state, y: scrollY }, '');
    history.pushState({ y: 0 }, '', url.href);
  }
  guardadas.set(actual, estaPagina());

  const cambiar = () => {
    for (const l of hojas()) l.media = pag.css.includes(l.href) ? 'all' : 'not all';
    const { antes, despues } = partes(document.body, cabecera());
    for (const el of [...antes, ...despues]) el.remove();
    if (!pag.puesta) {
      pag.antes = pag.antes.map(adoptar);
      pag.despues = pag.despues.map(adoptar);
      pag.puesta = true;
    }
    cabecera().before(...pag.antes);
    pie().before(...pag.despues);
    document.title = pag.titulo;
    // «Aquí estás» en la cabecera: Inicio en la landing; en la tienda lo pone su propio script.
    for (const a of document.querySelectorAll('#nav-principal a[aria-current]')) a.removeAttribute('aria-current');
    if (ruta === '/') document.querySelector('#nav-principal a[href="/"]')?.setAttribute('aria-current', 'page');
    actual = ruta;
    const ancla = ruta === '/' && url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!empuja) scrollTo({ top: history.state?.y || 0, behavior: 'instant' });
    else if (ancla) ancla.scrollIntoView({ behavior: 'instant' });
    else scrollTo({ top: 0, behavior: 'instant' });
    const main = document.querySelector('main');
    if (!main.hasAttribute('tabindex')) main.tabIndex = -1;
    main.focus({ preventScroll: true });
  };
  if (animar()) await document.startViewTransition(cambiar).updateCallbackDone;
  else cambiar();

  anuncio.textContent = '';
  setTimeout(() => { anuncio.textContent = `Página: ${document.title}`; }, 50);
  dispatchEvent(new CustomEvent('tm:pagina', { detail: { ruta } }));
  for (const src of pag.js) await import(src); // la primera vez corre; después ya está cargado
}

// El enlace del evento, si es a la otra página de este sitio y se puede atender aquí.
function destino(e) {
  const a = e.target.closest?.('a[href]');
  if (!a || a.target || a.hasAttribute('download')) return null;
  const url = new URL(a.href, location.href);
  return url.origin === location.origin && PAGINAS.includes(url.pathname) && url.pathname !== actual ? url : null;
}

document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const url = destino(e);
  if (!url) return;
  e.preventDefault();
  ir(url);
});

// Al acercarse a un enlace (cursor, dedo o teclado) se pide ya la otra página: al tocarlo, está lista.
for (const tipo of ['pointerover', 'touchstart', 'focusin']) {
  document.addEventListener(tipo, (e) => {
    const url = destino(e);
    if (url && !guardadas.has(url.pathname)) pedir(url.pathname).catch(() => {});
  }, { passive: true });
}

// «Atrás» y «adelante» entre las dos páginas. Dentro de una misma página (# de la tienda, anclas de
// la landing) no hace nada: eso lo atiende cada página como siempre.
addEventListener('popstate', () => {
  if (location.pathname !== actual && PAGINAS.includes(location.pathname)) ir(new URL(location.href), { empuja: false });
});
