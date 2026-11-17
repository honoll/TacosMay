// Respuesta visual de «agregar al carrito»: el guiso se empaca al vacío y la bolsa viaja al carrito.
// Toda la coreografía (pasos y tiempos) está en styles.css; aquí solo se coloca la bolsa sobre la
// charola y se le dice a dónde volar. No espera a nadie ni detiene nada: la llamada a la API va aparte.
// Con movimiento reducido la bolsa no se muestra (CSS): quedan el aviso y el contador de siempre.

const activos = new Map(); // una bolsa por charola: agregar otra vez seguida no las encima
const SEGURO = 2600;       // ms; retira la bolsa aunque su animación no llegue a terminar (o no exista)

export function empacar(boton) {
  const charola = boton.closest('.charola');
  const zona = charola?.querySelector('.guiso');
  if (!zona) return { cancel() {} };
  activos.get(charola)?.quitar();

  // La bolsa tiene tamaño propio y se apoya en la orilla de abajo de la zona del guiso: crece hacia arriba,
  // así nunca tapa el nombre ni el botón, y se mantiene dentro de la pantalla (también a 375 px).
  const r = zona.getBoundingClientRect();
  const w = Math.min(150, innerWidth * 0.4);
  const h = w * 1.25;
  const left = Math.min(Math.max(r.left + r.width / 2 - w / 2, 8), innerWidth - w - 8);
  const top = Math.max(r.bottom - h, 8);
  const d = document.querySelector('#nav a[href="#carrito"]')?.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'empaque';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<div class="emp-bolsa"><div class="emp-guiso"></div><div class="emp-brillo"></div>'
    + '<div class="emp-banda"></div><div class="emp-barra"></div><div class="emp-etq"><b></b><span></span></div></div>';
  el.querySelector('.emp-etq b').textContent = zona.querySelector('.num')?.textContent ?? '';
  el.querySelector('.emp-etq span').textContent = boton.dataset.nombre ?? '';

  const s = el.style;
  s.left = `${left}px`; s.top = `${top}px`; s.width = `${w}px`; s.height = `${h}px`;
  s.setProperty('--c', charola.style.getPropertyValue('--c'));
  s.setProperty('--t', charola.style.getPropertyValue('--t'));
  const foto = zona.querySelector('img')?.currentSrc;
  if (foto) s.setProperty('--foto', `url("${foto}")`);
  // A dónde vuela: al centro del enlace del carrito; si no está a la vista, hacia arriba.
  s.setProperty('--dx', `${d ? d.left + d.width / 2 - (left + w / 2) : 0}px`);
  s.setProperty('--dy', `${d ? d.top + d.height / 2 - (top + h / 2) : -(top + h)}px`);

  const quitar = () => {
    clearTimeout(seguro);
    el.remove();
    if (activos.get(charola) === pack) activos.delete(charola);
  };
  const seguro = setTimeout(quitar, SEGURO);
  el.addEventListener('animationend', (e) => {
    if (e.target !== el) return; // solo los finales de la bolsa entera: su viaje o su regreso
    if (e.animationName === 'emp-viaja') llegar();
    quitar();
  });
  // Si la API falla (sin stock, sesión vencida), la bolsa se regresa y aparece el aviso de siempre.
  const pack = { quitar, cancel() { el.classList.add('falla'); } };
  activos.set(charola, pack);
  document.body.append(el);
  return pack;
}

// El contador del carrito responde cuando llega la bolsa. La clase va en el <nav>, que no se repinta.
function llegar() {
  const nav = document.getElementById('nav');
  nav.classList.remove('llega');
  void nav.offsetWidth;
  nav.classList.add('llega');
  setTimeout(() => nav.classList.remove('llega'), 300);
}
