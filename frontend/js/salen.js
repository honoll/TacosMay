// Qué guisos van en «Lo que más sale» del inicio. Con pedidos, el ranking de la tienda (Sorted Set de Redis):
// hasta cuatro, si ya hay al menos tres vendidos. Sin pedidos todavía, los tres que más piden en la barra, dicho
// por Alejandro (docs/negocio/datos.md): así no se presume un ranking que no existe.
export const ESTRELLA = ['Chorizo con huevo', 'Rajas con queso y crema', 'Carne en salsa roja'];

export function cualesSalen(top = [], todos = []) {
  const vendidos = top.filter((g) => g.vendidos > 0);
  if (vendidos.length >= 3) return { lista: vendidos.slice(0, 4), enVivo: true };
  return { lista: ESTRELLA.map((n) => todos.find((g) => g.nombre === n)).filter(Boolean), enVivo: false };
}
