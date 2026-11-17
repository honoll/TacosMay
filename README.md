# TacosMay

Tienda de guisos de taquería empacados al vacío. Proyecto final de Bases de Datos Avanzadas
(Anáhuac): API en Node + Express sobre **Redis** (modelo Clave-Valor) en la nube, con el
frontend estático servido por el mismo servidor.

> Los nombres de los guisos que carga el seed son los del menú real; los precios, las porciones y el stock son **datos de ejemplo**
> (`PENDIENTE-CLIENTE`), no los reales del negocio.

## Requerimientos

- Node.js 20 o más nuevo (probado con 24) y npm
- Una base de Redis en la nube: [Redis Cloud](https://redis.io/try-free/), plan gratis

## Instalación

```bash
npm install
```

Copia `.env.example` como `.env` y llena los valores. El `.env` no se sube al repo.

| Variable | Para qué |
|---|---|
| `PORT` | Puerto del servidor (5000 si se omite) |
| `REDIS_URL` | Conexión a Redis Cloud: `redis://default:<password>@<host>:<puerto>` |
| `JWT_SECRET` | Cadena larga y aleatoria para firmar los tokens |
| `ADMIN_NOMBRE`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Administrador que crea el seed |

## Cargar datos (seed)

```bash
npm run seed
```

Borra **solo** las claves `tm:*` y carga el administrador y los 14 guisos del menú de Los Tacos May (precio, porciones y stock de ejemplo). Se puede
correr las veces que sea; siempre deja la base igual.

## Correr la app

```bash
npm start
```

La tienda queda en <http://localhost:5000> y la API en `/api`. Para desarrollo,
`npm run dev` reinicia el servidor al guardar. Pruebas: `npm test`.

## Estructura

```
backend/
  server.js        Express: rutas /api + frontend estático
  seed.js          npm run seed
  utils.js         httpError y validar (compartidos por los controladores)
  config/          redis.js (único cliente) y keys.js (único constructor de claves tm:)
  models/          funciones por entidad que hablan con Redis
  controllers/     lógica de cada endpoint (express-async-handler)
  routes/          rutas de users, guisos, carrito y pedidos
  middleware/      protect + soloAdmin (JWT) y errorMiddleware
frontend/          la tienda (HTML, CSS y JS sin build)
docs/contrato.md   claves de Redis y endpoints
```

## Qué usa de Redis

| Estructura | Clave | Uso |
|---|---|---|
| Hash | `tm:guiso:{id}`, `tm:user:{email}`, `tm:pedido:{id}` | Entidades |
| Set | `tm:guisos` | Índice para listar el catálogo |
| Sorted Set | `tm:guisos:vendidos` | Ranking de más vendidos (`ZINCRBY`, `ZRANGE ... REV`) |
| Hash con TTL | `tm:carrito:{userId}` | Carrito que expira solo a los 30 min (`EXPIRE`, `TTL`) |
| List | `tm:pedidos:{userId}` | Historial de pedidos (`LPUSH`) |
| String | `tm:seq:{entidad}` | Contadores de ids (`INCR`) |

El checkout (`POST /api/pedidos`) es una transacción `WATCH` + `MULTI/EXEC`: si el stock
cambia mientras se arma el pedido, no se aplica nada y responde `409`.

## Probar la API a mano

Con el servidor corriendo y el seed cargado (cambia email y password por los de tu `.env`):

```bash
curl -s localhost:5000/api/guisos
curl -s -X POST localhost:5000/api/users/login -H "Content-Type: application/json" -d '{"email":"ADMIN_EMAIL","password":"ADMIN_PASSWORD"}'
```

Con el `token` de la respuesta:

```bash
curl -s -X PUT localhost:5000/api/carrito/items/1 -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d '{"cantidad":2}'
curl -s -X POST localhost:5000/api/pedidos -H "Authorization: Bearer TOKEN"
curl -s localhost:5000/api/guisos/populares
```
