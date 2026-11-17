const bcrypt = require('bcrypt')
const { client } = require('../config/redis')
const keys = require('../config/keys')

const normalizar = (email) => email.trim().toLowerCase()

const findByEmail = async (email) => {
    const user = await client.hGetAll(keys.user(normalizar(email)))
    return user.id ? user : null
}

const create = async ({ nombre, email, password, rol = 'cliente' }) => {
    const user = {
        id: String(await client.incr(keys.seq('user'))),
        nombre,
        email: normalizar(email),
        password: await bcrypt.hash(password, 10),
        rol
    }
    await client.hSet(keys.user(user.email), user)
    return user
}

//lo que sí se puede mandar al cliente
const publico = ({ id, nombre, email, rol }) => ({ id, nombre, email, rol })

module.exports = { findByEmail, create, publico }
