// Reparto simulado: la única implementación de reparto.js por ahora. No llama a nadie, no cobra ni envía.
// Imita la forma de Uber Direct (docs/investigacion/reparto-a-domicilio.md §5): cotización con vigencia,
// entrega con enlace de seguimiento, estados que avanzan solos y cancelación con límite. Las zonas y los
// costos son DE EJEMPLO y los tiempos son cortos para enseñarlo. docs/diseno/domicilio.md

export const NOMBRE = 'Reparto simulado';

// PENDIENTE-CLIENTE: la cobertura y el costo reales los da el servicio de reparto. Zonas y costos de ejemplo.
export const ZONAS = [
  { colonia: 'Centro', envio_centavos: 3000 },
  { colonia: 'El Médano', envio_centavos: 4000 },
  { colonia: 'Lomas del Sol', envio_centavos: 5000 },
  { colonia: 'Arcos del Sol', envio_centavos: 5000 },
];

// Los pasos de una entrega y cuándo empieza cada uno (ms desde que se creó). Cortos, para enseñarlo.
// Con un proveedor real, «recibido» y «preparando» los pone la cocina y el proveedor avisa de «asignado» en
// adelante (más «devuelto» si no se pudo entregar).
export const PASOS = [
  ['recibido', 0], ['preparando', 3000], ['asignado', 8000], ['en_camino', 12000], ['entregado', 20000],
];
export const VIGENCIA = 10 * 60 * 1000; // la cotización vale 10 minutos
const MINUTOS_DE_PRUEBA = 25;            // la hora estimada que se enseña (de juguete)

let reloj = () => Date.now();
let modo = { falla: false }; // para enseñar el estado de error
const canceladas = new Set();
const porPedido = new Map(); // pedidoId → entrega: reintentar no crea dos entregas

export const usarReloj = (f) => { reloj = f; };            // pruebas
export const configurar = (m) => { modo = { ...modo, ...m }; };

export async function cotizar(destino) {
  if (modo.falla) return { ok: false, motivo: 'error' };
  const zona = ZONAS.find((z) => z.colonia === destino?.colonia);
  if (!zona) return { ok: false, motivo: 'fuera_de_cobertura' };
  const ahora = reloj();
  return { ok: true, cotizacionId: `cot-${ahora}`, envio_centavos: zona.envio_centavos, vence: ahora + VIGENCIA, minutos: MINUTOS_DE_PRUEBA };
}

export async function crearEntrega({ pedidoId, cotizacion, destino, contacto, items }) {
  if (porPedido.has(pedidoId)) return porPedido.get(pedidoId);
  if (!cotizacion?.cotizacionId) return { ok: false, motivo: 'sin_cotizacion' };
  if (reloj() > cotizacion.vence) return { ok: false, motivo: 'cotizacion_vencida' };
  if (!destino || !contacto?.telefono || !items?.length) return { ok: false, motivo: 'datos_incompletos' };
  const creada = reloj();
  const entrega = { ok: true, entregaId: `sim-${creada}`, creada, seguimiento: `#seguimiento-sim-${creada}` };
  porPedido.set(pedidoId, entrega);
  return entrega;
}

export async function estado(entregaId) {
  const creada = Number(String(entregaId).replace('sim-', ''));
  if (canceladas.has(entregaId)) return { paso: 'cancelado', indice: -1, llega: null, repartidor: null };
  const t = reloj() - creada;
  let indice = 0;
  PASOS.forEach(([, desde], i) => { if (t >= desde) indice = i; });
  return {
    paso: PASOS[indice][0],
    indice,
    llega: creada + MINUTOS_DE_PRUEBA * 60 * 1000,
    // Un repartidor de prueba: sin nombre real ni foto de persona.
    repartidor: indice >= 2 ? { alias: 'Repartidor de prueba', vehiculo: 'moto' } : null,
  };
}

// Se puede cancelar mientras el repartidor no recoge el pedido. Si hubiera costo, lo diría el proveedor.
export async function cancelar(entregaId) {
  const e = await estado(entregaId);
  if (e.paso === 'cancelado') return { ok: true, costo_centavos: null };
  if (e.indice >= 3) return { ok: false, motivo: 'ya_recogido' };
  canceladas.add(entregaId);
  return { ok: true, costo_centavos: null };
}
