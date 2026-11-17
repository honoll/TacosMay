//Único lugar donde se arman las claves de Redis (ver docs/contrato.md)
const k = (...partes) => ['tm', ...partes].join(':')

module.exports = {
    guiso: (id) => k('guiso', id),
    guisos: k('guisos'),
    vendidos: k('guisos', 'vendidos'),
    seq: (entidad) => k('seq', entidad),
    user: (email) => k('user', email),
    carrito: (userId) => k('carrito', userId),
    pedido: (id) => k('pedido', id),
    pedidos: (userId) => k('pedidos', userId),
    todas: k('*')
}
