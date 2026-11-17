const { client } = require('../config/redis')
const keys = require('../config/keys')
const Guiso = require('./guisosModel')

const TTL_SEGUNDOS = 30 * 60

const get = async (userId) => {
    const key = keys.carrito(userId)
    const [hash, ttl] = await Promise.all([client.hGetAll(key), client.ttl(key)])
    const guisos = await Guiso.findMany(Object.keys(hash))
    const items = guisos.map((guiso) => ({ guiso, cantidad: Number(hash[guiso.id]) }))

    return {
        items,
        total_centavos: items.reduce((total, { guiso, cantidad }) => total + guiso.precio_centavos * cantidad, 0),
        //TTL regresa negativo si el carrito no existe (vacío o ya expiró)
        expira_en_segundos: Math.max(ttl, 0)
    }
}

//cantidad 0 = quitar; cada cambio renueva los 30 minutos
const setItem = async (userId, guisoId, cantidad) => {
    const key = keys.carrito(userId)
    if (cantidad === 0) await client.hDel(key, guisoId)
    else await client.hSet(key, guisoId, cantidad)
    await client.expire(key, TTL_SEGUNDOS)
}

const clear = (userId) => client.del(keys.carrito(userId))

module.exports = { get, setItem, clear }
