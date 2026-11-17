const express = require('express')
const router = express.Router()
const {crearUser, loginUser, datosUser} = require('../controllers/usersController')
const {protect} = require('../middleware/authMiddleware')

router.post('/', crearUser)
router.post('/login', loginUser)
router.get('/me', protect, datosUser)

module.exports = router
