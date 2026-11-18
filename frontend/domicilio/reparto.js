// La única puerta al servicio de reparto. La página habla solo con estas funciones; hoy las cumple
// reparto-simulado.js. Para conectar un proveedor real (Uber Direct, Rappi u otro de «solo entrega»), se
// cambia el import por un módulo que llame a rutas propias del backend (las claves del proveedor no pueden
// vivir en el navegador). Contrato completo y lo que falta: docs/diseno/domicilio.md.
//
//   cotizar(pedido, destino)      → { ok: true, cotizacionId, envio_centavos, zona, vence }
//                                    | { ok: false, motivo: 'fuera_de_cobertura' | 'cerrado' | 'pedido_vacio' | 'error' }
//   crearEntrega(pedido, destino, cotizacionId) → { entregaId, creada }
//   estado(entregaId)             → { paso: 'recibido' | 'preparando' | 'asignado' | 'en_camino' | 'entregado' | 'cancelado',
//                                     indice, siguienteEn, repartidor: { alias, vehiculo } | null }
//   cancelar(entregaId)           → { ok }
//   abierto()                     → true | false
//   zonas()                       → [colonia, …]
import * as proveedor from './reparto-simulado.js';

export const NOMBRE = proveedor.NOMBRE;
export const simulado = true;
export const cotizar = (pedido, destino) => proveedor.cotizar(pedido, destino);
export const crearEntrega = (pedido, destino, cotizacionId) => proveedor.crearEntrega(pedido, destino, cotizacionId);
export const estado = (entregaId) => proveedor.estado(entregaId);
export const cancelar = (entregaId) => proveedor.cancelar(entregaId);
export const abierto = () => proveedor.abierto();
// Las colonias que el formulario ofrece (hoy, zonas de ejemplo; con un proveedor real, las de su cobertura).
export const zonas = () => proveedor.ZONAS.map((z) => z.colonia);
// Solo para enseñar los estados de «cerrado» y de error; un proveedor real no lo tiene.
export const demostrar = (modo) => proveedor.configurar?.(modo);
