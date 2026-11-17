const test = require('node:test')
const assert = require('node:assert')
const { armarPedido } = require('./pedidosModel')

const guisos = [
    { id: '1', nombre: 'Guiso A', precio_centavos: 10000, stock: 2 },
    { id: '2', nombre: 'Guiso B', precio_centavos: 5000, stock: 5 }
]

test('checkout sin stock suficiente falla con 409', () => {
    assert.throws(() => armarPedido({ 1: '3' }, guisos), { status: 409 })
})

test('checkout de un guiso que ya no existe falla con 409', () => {
    assert.throws(() => armarPedido({ 9: '1' }, guisos), { status: 409 })
})

test('checkout con stock arma los items y el total', () => {
    const pedido = armarPedido({ 1: '2', 2: '1' }, guisos)
    assert.strictEqual(pedido.total_centavos, 25000)
    assert.deepStrictEqual(pedido.items[0], { guisoId: '1', nombre: 'Guiso A', cantidad: 2, precio_centavos: 10000 })
})
