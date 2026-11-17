const path = require('path')
const express = require('express')
const dotenv = require('dotenv').config({ quiet: true })
const { connectRedis } = require('./config/redis')
const errorHandler = require('./middleware/errorMiddleware')

const port = process.env.PORT || 5000

if (!process.env.JWT_SECRET) {
    console.error('Falta JWT_SECRET en el archivo .env (ver .env.example)')
    process.exit(1)
}

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/users', require('./routes/usersRoutes'))
app.use('/api/guisos', require('./routes/guisosRoutes'))
app.use('/api/carrito', require('./routes/carritoRoutes'))
app.use('/api/pedidos', require('./routes/pedidosRoutes'))

//la tienda (frontend estático) se sirve desde el mismo servidor
app.use(express.static(path.join(__dirname, '..', 'frontend')))

app.use(errorHandler)

connectRedis().then(() => {
    app.listen(port, () => {
        console.log(`Servidor Iniciado en el puerto ${port}`)
    })
})
