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
    throw fail('No se pudo conectar con el servidor.', 0);
  }
  const data = await res.json().catch(() => null);
  if (res.ok) return data;
  // Un 401 con token guardado es sesión vencida; sin token es un login fallido y habla el backend.
  if (res.status === 401 && token) {
    session.set(null);
    throw fail('Tu sesión venció. Inicia sesión de nuevo.', 401);
  }
  throw fail(data?.message || `Error ${res.status}`, res.status);
}

const mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
export const money = (centavos) => mxn.format(centavos / 100);

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

// «Tinga de res» → «tinga-de-res»: nombre de archivo de la foto de un guiso.
export const slug = (v) => String(v).normalize('NFD').replace(/\p{M}/gu, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// El único lugar que muestra avisos y errores. Sin argumentos lo limpia.
export function notice(msg = '', kind = 'ok') {
  const el = document.getElementById('aviso');
  el.textContent = msg;
  el.className = kind;
  el.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  el.hidden = !msg;
}
