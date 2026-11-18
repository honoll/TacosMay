// Reparto simulado: la única implementación de reparto.js por ahora. No llama a nadie, no cobra ni envía.
// Cotiza con una lista corta de zonas y costos DE EJEMPLO, y la entrega avanza sola con tiempos cortos para
// la demostración. Cuando se conecte un proveedor real (docs/diseno/domicilio.md), esta pieza se cambia por
// otra con las mismas cuatro funciones y la página no se toca.

export const NOMBRE = 'Reparto simulado';

// PENDIENTE-CLIENTE: la cobertura y el costo reales los da el servicio de reparto. Zonas y costos de ejemplo.
export const ZONAS = [
  { colonia: 'Centro', envio_centavos: 3000 },
  { colonia: 'El Médano', envio_centavos: 4000 },
  { colonia: 'Lomas del Sol', envio_centavos: 5000 },
  { colonia: 'Arcos del Sol', envio_centavos: 5000 },
];

// Los pasos de una entrega y cuándo empieza cada uno (ms desde que se creó). Cortos, para enseñarlo.
export const PASOS = [
  ['recibido', 0], ['preparando', 3000], ['asignado', 8000], ['en_camino', 12000], ['entregado', 20000],
];

let reloj = () => Date.now();
let modo = { cerrado: false, falla: false }; // para enseñar los estados de «cerrado» y de error
const canceladas = new Set();

export const usarReloj = (f) => { reloj = f; };            // pruebas
export const configurar = (m) => { modo = { ...modo, ...m }; };

// Del horario solo se sabe que la barra del centro cierra a las 4 a. m. (PENDIENTE-CLIENTE: horario
// completo). La simulación está abierta salvo que se pida enseñar «cerrado».
export const abierto = () => !modo.cerrado;

export async function cotizar(pedido, destino) {
  if (!abierto()) return { ok: false, motivo: 'cerrado' };
  if (modo.falla) return { ok: false, motivo: 'error' };
  if (!pedido?.piezas) return { ok: false, motivo: 'pedido_vacio' };
  const zona = ZONAS.find((z) => z.colonia === destino?.colonia);
  if (!zona) return { ok: false, motivo: 'fuera_de_cobertura' };
  return { ok: true, cotizacionId: `cot-${reloj()}`, envio_centavos: zona.envio_centavos, zona: zona.colonia, vence: reloj() + 10 * 60 * 1000 };
}

export async function crearEntrega(pedido, destino, cotizacionId) {
  if (!cotizacionId) throw new Error('Falta la cotización.');
  return { entregaId: `sim-${reloj()}`, creada: reloj() };
}

export async function estado(entregaId) {
  const creada = Number(String(entregaId).replace('sim-', ''));
  if (canceladas.has(entregaId)) return { paso: 'cancelado', indice: -1 };
  const t = reloj() - creada;
  let indice = 0;
  PASOS.forEach(([, desde], i) => { if (t >= desde) indice = i; });
  const [paso] = PASOS[indice];
  const siguiente = PASOS[indice + 1];
  return {
    paso,
    indice,
    siguienteEn: siguiente ? siguiente[1] - t : 0,
    // Un repartidor de prueba: sin nombre real ni foto de persona.
    repartidor: indice >= 2 ? { alias: 'Repartidor de prueba', vehiculo: 'moto' } : null,
  };
}

export async function cancelar(entregaId) {
  canceladas.add(entregaId);
  return { ok: true };
}
