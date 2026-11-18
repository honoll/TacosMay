// Guisos y populares, compartidos por la landing y la tienda en la misma página (js/paginas.js cambia de
// una a otra sin recargar): lo que una ya pidió, la otra lo muestra al instante. Patrón «mostrar lo
// guardado y volver a pedir por detrás» (stale-while-revalidate): quien lo usa decide cuándo refrescar.
import { api } from './api.js';

const guardado = new Map(); // ruta de la API → lo último que respondió

export const guardadoDe = (ruta) => guardado.get(ruta);

export async function traer(ruta) {
  const valor = await api(ruta);
  guardado.set(ruta, valor);
  return valor;
}
