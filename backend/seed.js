//npm run seed: deja la base con el admin y guisos DE EJEMPLO. Se puede correr las veces que sea.
require('dotenv').config({ quiet: true })
const { client, connectRedis } = require('./config/redis')
const keys = require('./config/keys')
const User = require('./models/usersModel')
const Guiso = require('./models/guisosModel')

//DATOS DE EJEMPLO: el menú, precios y porciones reales de TacosMay están PENDIENTE-CLIENTE
const GUISOS_EJEMPLO = [
    ['Chicharrón en salsa verde', 18000, 4, 20],
    ['Tinga de pollo', 16000, 4, 20],
    ['Bistec en salsa pasilla', 20000, 4, 15],
    ['Rajas con crema', 14000, 4, 25],
    ['Papa con chorizo', 13000, 4, 25],
    ['Mole con pollo', 19000, 4, 3]
].map(([nombre, precio_centavos, porciones, stock]) => ({
    nombre: `${nombre} (EJEMPLO)`,
    descripcion: 'Dato de ejemplo para la demo: no es el menú ni el precio real.',
    precio_centavos,
    porciones,
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
    for (const guiso of GUISOS_EJEMPLO) await Guiso.create(guiso)

    console.log(`Seed listo: ${borradas} claves borradas, 1 admin (${ADMIN_EMAIL}) y ${GUISOS_EJEMPLO.length} guisos de ejemplo`)
    await client.close()
}

seed()
