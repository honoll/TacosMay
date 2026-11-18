// La única puerta al servicio de reparto. La página y flujo.js hablan solo con estas funciones; hoy las cumple
// reparto-simulado.js. Para conectar un proveedor real (la investigación recomienda Uber Direct) se cambia el
// import por un módulo que llame a rutas propias del backend: las claves del proveedor no pueden vivir en el
// navegador. Correspondencia con cada operación real: docs/diseno/domicilio.md.
//
//   cotizar(destino)  → { ok: true, cotizacionId, envio_centavos, vence, minutos }
//                     | { ok: false, motivo: 'fuera_de_cobertura' | 'error' }
//   crearEntrega({ pedidoId, cotizacion, destino, contacto, items })
//                     → { ok: true, entregaId, creada, seguimiento }   (mismo pedidoId → la misma entrega)
//                     | { ok: false, motivo: 'cotizacion_vencida' | 'sin_cotizacion' | 'datos_incompletos' }
//   estado(entregaId) → { paso, indice, llega, repartidor: { alias, vehiculo } | null }
//                       paso: recibido · preparando · asignado · en_camino · entregado · cancelado (· devuelto, real)
//   cancelar(entregaId) → { ok: true, costo_centavos } | { ok: false, motivo: 'ya_recogido' }
//   zonas()           → [colonia, …]  (sugerencia del formulario; la cobertura la decide cotizar)
import * as proveedor from './reparto-simulado.js';

export const NOMBRE = proveedor.NOMBRE;
export const simulado = true;
export const PASOS = proveedor.PASOS.map(([paso]) => paso);
export const cotizar = (destino) => proveedor.cotizar(destino);
export const crearEntrega = (datos) => proveedor.crearEntrega(datos);
export const estado = (entregaId) => proveedor.estado(entregaId);
export const cancelar = (entregaId) => proveedor.cancelar(entregaId);
export const zonas = () => proveedor.ZONAS.map((z) => z.colonia);
// Solo para enseñar el estado de error; un proveedor real no lo tiene.
export const demostrar = (modo) => proveedor.configurar?.(modo);
