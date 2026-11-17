const { client } = require('../config/redis')
const keys = require('../config/keys')

//esquema para validar (utils.validar)
const CAMPOS = {
    nombre: 'texto',
    descripcion: 'texto',
    precio_centavos: 'entero',
    porciones: 'entero',
    stock: 'entero'
}

//Redis regresa todo como texto: aquí los números vuelven a ser números
const desdeHash = (id, hash) => hash.nombre === undefined ? null : {
    id,
    nombre: hash.nombre,
    descripcion: hash.descripcion,
    precio_centavos: Number(hash.precio_centavos),
    porciones: Number(hash.porciones),
    stock: Number(hash.stock)
}

const findById = async (id) => desdeHash(id, await client.hGetAll(keys.guiso(id)))

//los que ya no existen se omiten
const findMany = async (ids) => (await Promise.all(ids.map(findById))).filter(Boolean)

const findAll = async () => {
    const ids = await client.sMembers(keys.guisos)
    return findMany(ids.sort((a, b) => a - b))
}

//top 5 del Sorted Set de vendidos
const populares = async () => {
    const top = await client.zRangeWithScores(keys.vendidos, 0, 4, { REV: true })
    const vendidos = Object.fromEntries(top.map(({ value, score }) => [value, score]))
    const guisos = await findMany(top.map(({ value }) => value))
    return guisos.map((guiso) => ({ ...guiso, vendidos: vendidos[guiso.id] }))
}

const create = async (datos) => {
    const id = String(await client.incr(keys.seq('guiso')))
    await client.multi()
        .hSet(keys.guiso(id), datos)
        .sAdd(keys.guisos, id)
        .exec()
    return { id, ...datos }
}

const update = async (id, datos) => {
    if (!(await client.exists(keys.guiso(id)))) return null
    if (Object.keys(datos).length) await client.hSet(keys.guiso(id), datos)
    return findById(id)
}

//regresa false si no existía
const remove = async (id) => {
    const [borrados] = await client.multi()
        .del(keys.guiso(id))
        .sRem(keys.guisos, id)
        .zRem(keys.vendidos, id)
        .exec()
    return borrados > 0
}

module.exports = { CAMPOS, findById, findMany, findAll, populares, create, update, remove }
