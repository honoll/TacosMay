const express = require('express')
const router = express.Router()
const {createPedido, getPedidos} = require('../controllers/pedidosController')
const {protect} = require('../middleware/authMiddleware')

//todas las rutas de pedidos pasan por protect
router.use(protect)

router.post('/', createPedido)
router.get('/', getPedidos)

module.exports = router
