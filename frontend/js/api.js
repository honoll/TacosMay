// Lo que comparten todas las pantallas: sesión, fetch, dinero, escape de HTML y avisos.

const KEY = 'tm_sesion';

// Sesión = la respuesta de login/registro tal cual: {id, nombre, email, rol, token}.
export const session = {
  get() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
  },
  set(s) {
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  },
};

const fail = (message, status) => Object.assign(new Error(message), { status });

// Los mensajes del servidor, en la voz del sitio (el backend no se toca: sus pruebas los cubren). Si llega
// uno que no está aquí, se muestra tal cual.
const VOZ = [
  [/^Credenciales incorrectas$/, () => 'El correo o la contraseña no coinciden.'],
  [/^Ese email ya está registrado$/, () => 'Ese correo ya tiene cuenta. Entra con él.'],
  [/^No hay stock suficiente de (.+) \(quedan (\d+)\)$/, (g, n) => `Solo ${n === '1' ? 'queda 1' : `quedan ${n}`} de ${g}.`],
  [/^El guiso especificado no existe$/, () => 'Ese guiso ya no está en la barra.'],
];
export const enVoz = (m) => {
  for (const [patron, voz] of VOZ) { const r = String(m).match(patron); if (r) return voz(...r.slice(1)); }
  return m;
};

// El único fetch del frontend. Devuelve el JSON o lanza Error con el `message` del backend.
export async function api(path, { method = 'GET', body } = {}) {
  const token = session.get()?.token;
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch('/api' + path, { method, headers, body: body && JSON.stringify(body) });
  } catch {
    throw fail('No pudimos conectar. Revisa tu internet y dale otra vez.', 0);
  }
  const data = await res.json().catch(() => null);
  if (res.ok) return data;
  // Un 401 con token guardado es sesión vencida; sin token es un login fallido y habla el backend.
  if (res.status === 401 && token) {
    session.set(null);
    throw Object.assign(fail('Tu sesión venció. Inicia sesión de nuevo.', 401), { vencida: true });
  }
  throw fail(enVoz(data?.message || `Error ${res.status}`), res.status);
}

const mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
export const money = (centavos) => mxn.format(centavos / 100);

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

// «Tinga de res» → «tinga-de-res»: nombre de archivo de la foto de un guiso.
export const slug = (v) => String(v).normalize('NFD').replace(/\p{M}/gu, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// El único lugar que muestra avisos y errores. Sin argumentos lo limpia.
let seVa;
export function notice(msg = '', kind = 'ok') {
  const el = document.getElementById('aviso');
  el.textContent = msg;
  el.className = kind;
  el.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  el.hidden = !msg;
  clearTimeout(seVa);
  if (!msg) return;
  el.insertAdjacentHTML('beforeend', ' <button type="button" class="cierra" aria-label="Cerrar el aviso">✕</button>');
  el.querySelector?.('.cierra')?.addEventListener('click', () => notice());
  // Una confirmación se va sola; un error se queda hasta que se cierra o llega otro aviso.
  if (kind !== 'error') { seVa = setTimeout(notice, 8000); seVa.unref?.(); }
}

// Cambia la página dentro de una transición de vista si el navegador la tiene y se permite movimiento;
// si no, directo. Una transición saltada (pestaña oculta, otra en curso) rechaza ready y finished:
// se atrapan para no dejar errores en la consola, y el cambio se hace igual (el navegador sí llama a fn).
export function transicion(fn) {
  if (!document.startViewTransition || !matchMedia('(prefers-reduced-motion: no-preference)').matches) return Promise.resolve(fn());
  const t = document.startViewTransition(fn);
  t.ready.catch(() => {});
  t.finished.catch(() => {});
  return t.updateCallbackDone; // solo rechaza si fn falla
}
