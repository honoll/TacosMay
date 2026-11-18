// Las barras desde donde sale el pedido, si está abierta y cómo avanza un pedido para recoger.
// Lo único real: la barra del centro, su dirección y que cierra a las 4 a. m. Las demás taquerías de la
// familia, el horario completo y el teléfono son PENDIENTE-CLIENTE: no se escriben hasta tenerlos.

export const SUCURSALES = [
  {
    id: 'centro',
    nombre: 'Barra del centro',
    direccion: 'José María Morelos S/N, Local 3, Centro, 23450 Cabo San Lucas, B.C.S.',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Los+Tacos+May%2C+Jos%C3%A9+Mar%C3%ADa+Morelos%2C+Centro%2C+Cabo+San+Lucas',
    cierra: '4 a. m.',
  },
];
export const sucursal = (id) => SUCURSALES.find((s) => s.id === id) ?? null;

// Sin horario de apertura no se puede saber si está abierta: la prueba la da por abierta salvo que se pida
// enseñar «cerrado» (/domicilio/?demo=cerrado).
let cerrada = false;
export const demostrarCerrada = (si) => { cerrada = Boolean(si); };
export const abierta = () => !cerrada;

// Recoger en la barra: lo lleva la cocina, no el reparto. Tiempos cortos de prueba.
export const PASOS_BARRA = [['recibido', 0], ['preparando', 3000], ['listo', 10000]];
export function estadoEnBarra(creado, ahora, recogido = false) {
  if (recogido) return { paso: 'entregado', indice: PASOS_BARRA.length };
  let indice = 0;
  PASOS_BARRA.forEach(([, desde], i) => { if (ahora - creado >= desde) indice = i; });
  return { paso: PASOS_BARRA[indice][0], indice };
}
