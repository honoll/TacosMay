const express = require('express')
const router = express.Router()
const {getGuisos, getPopulares, getGuiso, createGuiso, updateGuiso, deleteGuiso} = require('../controllers/guisosController')
const {protect, soloAdmin} = require('../middleware/authMiddleware')

router.get('/', getGuisos)
//antes de /:id para que "populares" no se tome como un id
router.get('/populares', getPopulares)
router.get('/:id', getGuiso)

router.post('/', protect, soloAdmin, createGuiso)
router.put('/:id', protect, soloAdmin, updateGuiso)
router.delete('/:id', protect, soloAdmin, deleteGuiso)

module.exports = router
