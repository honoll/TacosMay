const asyncHandler = require('express-async-handler')
const Guiso = require('../models/guisosModel')
const { httpError, validar } = require('../utils')

const noExiste = () => httpError(404, 'El guiso especificado no existe')

const getGuisos = asyncHandler(async (req, res) => {
    res.status(200).json(await Guiso.findAll())
})

const getPopulares = asyncHandler(async (req, res) => {
    res.status(200).json(await Guiso.populares())
})

const getGuiso = asyncHandler(async (req, res) => {
    const guiso = await Guiso.findById(req.params.id)
    if (!guiso) throw noExiste()
    res.status(200).json(guiso)
})

const createGuiso = asyncHandler(async (req, res) => {
    const guiso = await Guiso.create(validar(req.body, Guiso.CAMPOS))
    res.status(201).json(guiso)
})

const updateGuiso = asyncHandler(async (req, res) => {
    const guiso = await Guiso.update(req.params.id, validar(req.body, Guiso.CAMPOS, true))
    if (!guiso) throw noExiste()
    res.status(200).json(guiso)
})

const deleteGuiso = asyncHandler(async (req, res) => {
    if (!(await Guiso.remove(req.params.id))) throw noExiste()
    res.status(200).json({ id: req.params.id })
})

module.exports = { getGuisos, getPopulares, getGuiso, createGuiso, updateGuiso, deleteGuiso }
