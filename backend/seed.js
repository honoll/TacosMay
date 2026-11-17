//npm run seed: deja la base con el admin y los guisos del menú (precios de ejemplo). Se puede correr las veces que sea.
require('dotenv').config({ quiet: true })
const { client, connectRedis } = require('./config/redis')
const keys = require('./config/keys')
const User = require('./models/usersModel')
const Guiso = require('./models/guisosModel')

//Nombres reales del menú de Los Tacos May (docs/negocio/datos.md).
//Precio, porciones y stock son DE EJEMPLO: el producto empacado está PENDIENTE-CLIENTE
const PRECIO_EJEMPLO = { base: 18000, especial: 20000, lengua: 26000 }
const GUISOS = [
    ['Corazón de vaca enamorada', 'base', 20],
    ['Chorizo con huevo', 'base', 20],
    ['Salpicón', 'base', 20],
    ['Nopalitos', 'base', 25],
    ['Mole con pollo', 'base', 3], //stock bajo a propósito: demo de «no vender de más»
    ['Bistek con papa', 'base', 20],
    ['Chicharrón en salsa', 'base', 20],
    ['Rajas con queso y crema', 'base', 25],
    ['Carne en salsa roja', 'especial', 15],
    ['Tinga de res', 'especial', 15],
    ['Barbacoa', 'especial', 15],
    ['Cabeza', 'especial', 10],
    ['Lengua', 'lengua', 8],
    ['Barbacoa de borrego', 'especial', 10]
].map(([nombre, precio, stock]) => ({
    nombre,
    descripcion: 'Guiso del menú de Los Tacos May. Precio y porciones de ejemplo.',
    precio_centavos: PRECIO_EJEMPLO[precio],
    porciones: 4,
    stock
}))
const seed = async () => {
    const { ADMIN_NOMBRE, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.error('Faltan ADMIN_EMAIL y ADMIN_PASSWORD en el archivo .env (ver .env.example)')
        process.exit(1)
    }

    await connectRedis()

    //limpia solo las claves de TacosMay (tm:*), nada más de la base
    let borradas = 0
    for await (const claves of client.scanIterator({ MATCH: keys.todas, COUNT: 100 })) {
        if (claves.length) borradas += await client.del(claves)
    }

    await User.create({ nombre: ADMIN_NOMBRE || 'Admin', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, rol: 'admin' })
    for (const guiso of GUISOS) await Guiso.create(guiso)

    console.log(`Seed listo: ${borradas} claves borradas, 1 admin (${ADMIN_EMAIL}) y ${GUISOS.length} guisos del menú (precios de ejemplo)`)
    await client.close()
}

seed()
