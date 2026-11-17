const asyncHandler = require('express-async-handler')
const Pedido = require('../models/pedidosModel')

const createPedido = asyncHandler(async (req, res) => {
    //toma el carrito del usuario; 400 si está vacío, 409 si no hay stock
    res.status(201).json(await Pedido.checkout(req.user.id))
})

const getPedidos = asyncHandler(async (req, res) => {
    res.status(200).json(await Pedido.findByUser(req.user.id))
})

module.exports = { createPedido, getPedidos }
