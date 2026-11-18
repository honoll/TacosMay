// El pizarrón de la taquería (docs/negocio/datos.md): el precio de cada taco en la barra.
// PENDIENTE-CLIENTE: menú y precios vigentes. La foto del pizarrón tiene unos diez meses; en la página
// estos precios se marcan como «de ejemplo».
import { slug } from '../js/api.js';

export const MENU = [
  ['Corazón de vaca enamorada', 4000], ['Chorizo con huevo', 4000], ['Salpicón', 4000], ['Nopalitos', 4000],
  ['Mole con pollo', 4000], ['Bistek con papa', 4000], ['Chicharrón en salsa', 4000], ['Rajas con queso y crema', 4000],
  ['Carne en salsa roja', 4500], ['Tinga de res', 4500], ['Barbacoa', 4500], ['Cabeza', 4500],
  ['Lengua', 6000], ['Barbacoa de borrego', 4500],
].map(([nombre, precio_centavos]) => ({ id: slug(nombre), nombre, precio_centavos }));

export const MAX_POR_GUISO = 20;
export const MAX_NOTA = 140;
export const guiso = (id) => MENU.find((g) => g.id === id) ?? null;

// El menú por secciones, como el pizarrón las agrupa: por precio de barra.
export const SECCIONES = [...new Set(MENU.map((g) => g.precio_centavos))].sort((a, b) => a - b)
  .map((precio) => ({ id: `de-${precio / 100}`, precio_centavos: precio, guisos: MENU.filter((g) => g.precio_centavos === precio) }));

// Lo que se pide, a partir de las cantidades y notas por guiso: renglones, piezas y subtotal (al precio de la barra).
export function pedidoDe(cantidades = {}, notas = {}) {
  const items = MENU.filter((g) => cantidades[g.id] > 0)
    .map((g) => ({ id: g.id, nombre: g.nombre, cantidad: cantidades[g.id], precio_centavos: g.precio_centavos, nota: notas[g.id] ?? '' }));
  return {
    items,
    piezas: items.reduce((s, i) => s + i.cantidad, 0),
    subtotal_centavos: items.reduce((s, i) => s + i.cantidad * i.precio_centavos, 0),
  };
}
