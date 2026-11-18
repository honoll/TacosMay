// Los pasos del pedido a domicilio, sin pantalla: armar, a dónde (y cotizar), confirmar, seguir, repetir.
// La página (domicilio.js) solo pinta este estado; el estado se guarda en localStorage para que una recarga
// no pierda el pedido ni la entrega en curso.
import { pedidoDe, MAX_POR_GUISO } from './menu.js';

const CLAVE = 'tm_domicilio';
const VACIO = () => ({ paso: 'pedido', cantidades: {}, destino: null, cotizacion: null, problema: null, entrega: null });

export function flujo(reparto, almacen = globalThis.localStorage) {
  let s = VACIO();
  try { s = { ...s, ...JSON.parse(almacen?.getItem(CLAVE) ?? '{}') }; } catch { /* guardado roto: se empieza de cero */ }
  const guardar = () => { try { almacen?.setItem(CLAVE, JSON.stringify(s)); } catch { /* sin almacenamiento: sigue en memoria */ } };
  const pedido = () => pedidoDe(s.cantidades);

  return {
    get estado() { return s; },
    pedido,
    total: () => pedido().subtotal_centavos + (s.cotizacion?.envio_centavos ?? 0),

    cambiar(id, delta) {
      if (s.entrega) return;
      const n = Math.max(0, Math.min(MAX_POR_GUISO, (s.cantidades[id] ?? 0) + delta));
      s.cantidades = { ...s.cantidades, [id]: n };
      if (!n) delete s.cantidades[id];
      s.cotizacion = null; // otro pedido, otra cotización
      if (!pedido().piezas && s.paso !== 'pedido') s.paso = 'pedido';
      guardar();
    },

    // Volver a un paso anterior (o seguir al de dirección cuando ya hay tacos).
    ir(paso) {
      if (s.entrega) return;
      if (paso === 'destino' && !pedido().piezas) return;
      if (paso === 'confirmar' && !s.cotizacion) return;
      s.paso = paso;
      s.problema = null;
      guardar();
    },

    async cotizar(destino) {
      s.destino = destino;
      s.problema = null;
      const r = await reparto.cotizar(pedido(), destino);
      if (r.ok) { s.cotizacion = r; s.paso = 'confirmar'; } else { s.cotizacion = null; s.problema = r.motivo; }
      guardar();
      return r;
    },

    async confirmar(pago = 'al_recibir') {
      if (pago !== 'al_recibir') throw new Error('El pago en línea está por conectar.');
      if (!s.cotizacion) throw new Error('Falta cotizar el envío.');
      s.entrega = { ...(await reparto.crearEntrega(pedido(), s.destino, s.cotizacion.cotizacionId)), pago };
      s.paso = 'seguimiento';
      guardar();
      return s.entrega;
    },

    seguir: () => (s.entrega ? reparto.estado(s.entrega.entregaId) : null),

    // Repetir la demostración desde cero.
    async repetir() {
      if (s.entrega) await reparto.cancelar(s.entrega.entregaId);
      s = VACIO();
      guardar();
    },
  };
}
