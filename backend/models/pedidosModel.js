const { WatchError } = require('redis')
const { client } = require('../config/redis')
const keys = require('../config/keys')
const Guiso = require('./guisosModel')
const { httpError } = require('../utils')

//Valida el carrito ({guisoId: cantidad}) contra los guisos y arma el pedido (sin id).
//Función pura: es la que cubre la prueba (pedidosModel.test.js)
const armarPedido = (carrito, guisos) => {
    const items = Object.entries(carrito).map(([guisoId, cantidad]) => {
        const guiso = guisos.find((g) => g.id === guisoId)
        if (!guiso) throw httpError(409, 'Un guiso de tu carrito ya no está disponible')
        if (Number(cantidad) > guiso.stock) {
            throw httpError(409, `No hay stock suficiente de ${guiso.nombre} (quedan ${guiso.stock})`)
        }
        return { guisoId, nombre: guiso.nombre, cantidad: Number(cantidad), precio_centavos: guiso.precio_centavos }
    })

    return {
        total_centavos: items.reduce((total, item) => total + item.precio_centavos * item.cantidad, 0),
        creado: new Date().toISOString(),
        items
    }
}

const checkout = async (userId) => {
    //WATCH es por conexión: se usa una conexión propia para que otra petición no lo pise
    const conexion = client.duplicate()
    conexion.on('error', (error) => console.error('Error de Redis:', error.message))
    await conexion.connect()

    try {
        await conexion.watch(keys.carrito(userId))
        const carrito = await client.hGetAll(keys.carrito(userId))
        const ids = Object.keys(carrito)
        if (!ids.length) throw httpError(400, 'Tu carrito está vacío')

        //si el stock cambia entre esta lectura y el EXEC, la transacción se cancela
        await conexion.watch(ids.map(keys.guiso))
        const pedido = armarPedido(carrito, await Guiso.findMany(ids))
        const id = String(await client.incr(keys.seq('pedido')))

        const multi = conexion.multi()
        for (const { guisoId, cantidad } of pedido.items) {
            multi.hIncrBy(keys.guiso(guisoId), 'stock', -cantidad)
            multi.zIncrBy(keys.vendidos, cantidad, guisoId)
        }
        multi.hSet(keys.pedido(id), {
            id,
            userId,
            total_centavos: pedido.total_centavos,
            creado: pedido.creado,
            items: JSON.stringify(pedido.items)
        })
        multi.lPush(keys.pedidos(userId), id)
        multi.del(keys.carrito(userId))
        await multi.exec()

        return { id, ...pedido }
    } catch (error) {
        if (error instanceof WatchError) throw httpError(409, 'El stock cambió mientras comprabas, intenta de nuevo')
        throw error
    } finally {
        conexion.destroy()
    }
}

const findByUser = async (userId) => {
    const ids = await client.lRange(keys.pedidos(userId), 0, -1)
    const hashes = await Promise.all(ids.map((id) => client.hGetAll(keys.pedido(id))))
    return hashes.map(({ id, total_centavos, creado, items }) => ({
        id,
        total_centavos: Number(total_centavos),
        creado,
        items: JSON.parse(items)
    }))
}

module.exports = { armarPedido, checkout, findByUser }
