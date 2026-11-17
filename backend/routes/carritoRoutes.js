const express = require('express')
const router = express.Router()
const {getCarrito, setItem, clearCarrito} = require('../controllers/carritoController')
const {protect} = require('../middleware/authMiddleware')

//todas las rutas del carrito pasan por protect
router.use(protect)

router.get('/', getCarrito)
router.put('/items/:guisoId', setItem)
router.delete('/', clearCarrito)

module.exports = router
