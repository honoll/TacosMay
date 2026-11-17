const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')
const { httpError, validar } = require('../utils')

const generarToken = ({ id, email }) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

const conToken = (user) => ({ ...User.publico(user), token: generarToken(user) })

const crearUser = asyncHandler(async (req, res) => {
    const datos = validar(req.body, { nombre: 'texto', email: 'texto', password: 'texto' })

    //verificamos que el email no esté registrado
    if (await User.findByEmail(datos.email)) {
        throw httpError(400, 'Ese email ya está registrado')
    }

    //el rol nunca viene del body: siempre se registra como cliente
    const user = await User.create(datos)

    res.status(201).json(conToken(user))
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = validar(req.body, { email: 'texto', password: 'texto' })

    const user = await User.findByEmail(email)

    //mismo mensaje si no existe el email o si el password está mal
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw httpError(401, 'Credenciales incorrectas')
    }

    res.status(200).json(conToken(user))
})

const datosUser = asyncHandler(async (req, res) => {
    //req.user lo pone el middleware protect a partir del token
    res.status(200).json(req.user)
})

module.exports = { crearUser, loginUser, datosUser }
