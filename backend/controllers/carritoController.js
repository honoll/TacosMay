const asyncHandler = require('express-async-handler')
const Carrito = require('../models/carritoModel')
const Guiso = require('../models/guisosModel')
const { httpError, validar } = require('../utils')

const getCarrito = asyncHandler(async (req, res) => {
    res.status(200).json(await Carrito.get(req.user.id))
})

const setItem = asyncHandler(async (req, res) => {
    const { cantidad } = validar(req.body, { cantidad: 'entero' })

    const guiso = await Guiso.findById(req.params.guisoId)
    if (!guiso) throw httpError(404, 'El guiso especificado no existe')
    if (cantidad > guiso.stock) {
        throw httpError(409, `No hay stock suficiente de ${guiso.nombre} (quedan ${guiso.stock})`)
    }

    await Carrito.setItem(req.user.id, guiso.id, cantidad)
    res.status(200).json(await Carrito.get(req.user.id))
})

const clearCarrito = asyncHandler(async (req, res) => {
    await Carrito.clear(req.user.id)
    res.status(200).json(await Carrito.get(req.user.id))
})

module.exports = { getCarrito, setItem, clearCarrito }
