const { createClient } = require('redis')

//Único cliente de Redis de la app: todo lo demás importa este
const client = createClient({ url: process.env.REDIS_URL })

client.on('error', (error) => console.error('Error de Redis:', error.message))

const connectRedis = async () => {
    //sin REDIS_URL node-redis se iría a localhost: mejor fallar claro
    if (!process.env.REDIS_URL) {
        console.error('Falta REDIS_URL en el archivo .env (ver .env.example)')
        process.exit(1)
    }
    await client.connect()
    console.log('Redis conectado')
}

module.exports = { client, connectRedis }
