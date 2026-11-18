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

// Las opciones de cada taco, como en el flujo de referencia (Orinoco): grupos como «quitar ingredientes» o
// «elige tus salsas», cada uno con un tope (máximo) y, si es obligatorio, un mínimo; cada opción, una vez.
// Grupo: { id, nombre, min, max, opciones: [{ id, nombre, precio_centavos }] }.
// PENDIENTE-CLIENTE: qué lleva cada taco, qué salsas y extras hay y si alguno cuesta. Mientras, no hay grupos
// y el detalle lo dice; usarGrupos() los pone cuando haya datos (y en las pruebas).
let GRUPOS = [];
export const grupos = () => GRUPOS;
export function usarGrupos(lista = []) { GRUPOS = lista; }

// Una elección ({ grupoId: [opcionId] }) recortada a lo que permite cada grupo, con su estado:
// cuántas lleva cada grupo, cuáles ya están completos (llegaron al tope) y cuáles obligatorios faltan.
export function ajustar(eleccion = {}) {
  const opciones = {};
  const completos = [];
  const faltan = [];
  for (const g of GRUPOS) {
    const validas = new Set(g.opciones.map((o) => o.id));
    const elegidas = [...new Set(eleccion[g.id] ?? [])].filter((id) => validas.has(id)).slice(0, g.max);
    if (elegidas.length) opciones[g.id] = elegidas;
    if (elegidas.length >= g.max) completos.push(g.id);
    if (elegidas.length < (g.min ?? 0)) faltan.push(g.id);
  }
  return { opciones, completos, faltan };
}
// Lo que suman las opciones elegidas de un taco, y sus nombres para la orden.
const extras = (eleccion = {}) => GRUPOS.flatMap((g) => g.opciones.filter((o) => eleccion[g.id]?.includes(o.id)));

// Lo que se pide, a partir de las cantidades, notas y opciones por guiso: renglones, piezas y subtotal (al precio de la barra).
export function pedidoDe(cantidades = {}, notas = {}, opciones = {}) {
  const items = MENU.filter((g) => cantidades[g.id] > 0)
    .map((g) => {
      const ex = extras(opciones[g.id]);
      return { id: g.id, nombre: g.nombre, cantidad: cantidades[g.id], precio_centavos: g.precio_centavos + ex.reduce((s, o) => s + (o.precio_centavos ?? 0), 0), nota: notas[g.id] ?? '', opciones: ex.map((o) => o.nombre), eleccion: opciones[g.id] ?? {} };
    });
  return {
    items,
    piezas: items.reduce((s, i) => s + i.cantidad, 0),
    subtotal_centavos: items.reduce((s, i) => s + i.cantidad * i.precio_centavos, 0),
  };
}
