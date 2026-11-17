const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')
const { httpError } = require('../utils')

const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw httpError(401, 'Acceso no autorizado, no se proporcionó el token')
    }

    let decoded
    try {
        //verificamos la firma y la expiración del token: "Bearer <token>"
        decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET)
    } catch (error) {
        throw httpError(401, 'Acceso no autorizado, token inválido')
    }

    //los usuarios se guardan por email (tm:user:{email})
    const user = await User.findByEmail(decoded.email)

    if (!user) {
        throw httpError(401, 'Acceso no autorizado, el usuario ya no existe')
    }

    //sin el password
    req.user = User.publico(user)
    next()
})

//va después de protect
const soloAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin') {
        throw httpError(403, 'Solo un administrador puede hacer esto')
    }
    next()
}

module.exports = { protect, soloAdmin }
