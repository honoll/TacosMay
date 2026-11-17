# Contrato entre backend y frontend

Fuente única de las claves de Redis y de la API. Lo edita coordinación.

## Claves de Redis (prefijo `tm:`)

| Clave | Tipo | Contenido | TTL |
|---|---|---|---|
| `tm:guiso:{id}` | Hash | `nombre`, `descripcion`, `precio_centavos`, `porciones`, `stock` | — |
| `tm:guisos` | Set | ids de todos los guisos (índice para listar) | — |
| `tm:guisos:vendidos` | Sorted Set | miembro = id de guiso, score = unidades vendidas | — |
| `tm:seq:{entidad}` | String | contador para ids (`INCR`) | — |
| `tm:user:{email}` | Hash | `id`, `nombre`, `email`, `password` (bcrypt), `rol` (`cliente`/`admin`) | — |
| `tm:carrito:{userId}` | Hash | campo = id de guiso, valor = cantidad | **30 min**, se renueva en cada cambio |
| `tm:pedido:{id}` | Hash | `id`, `userId`, `total_centavos`, `creado`, `items` (JSON) | — |
| `tm:pedidos:{userId}` | List | ids de pedidos del usuario, el más nuevo primero (`LPUSH`) | — |

El carrito que expira solo es la «consulta especializada» de la rúbrica (TTL); el ranking
es la estructura compuesta (Sorted Set). El checkout es una transacción `MULTI/EXEC` con
`WATCH` sobre el stock: descuenta stock, suma al ranking, crea el pedido y borra el carrito.

## API (todo JSON, base `/api`)

Errores: el status HTTP correcto y `{ "message": "..." }` (igual que el repo base).
Auth: `Authorization: Bearer <jwt>`.

| Método y ruta | Auth | Cuerpo | Respuesta |
|---|---|---|---|
| `POST /users` | — | `{nombre, email, password}` | `201 {id, nombre, email, rol, token}` |
| `POST /users/login` | — | `{email, password}` | `200 {id, nombre, email, rol, token}` |
| `GET /users/me` | sí | — | `200 {id, nombre, email, rol}` |
| `GET /guisos` | — | — | `200 [guiso]` |
| `GET /guisos/populares` | — | — | `200 [{...guiso, vendidos}]` (top 5) |
| `GET /guisos/:id` | — | — | `200 guiso` · `404` |
| `POST /guisos` | admin | `{nombre, descripcion, precio_centavos, porciones, stock}` | `201 guiso` |
| `PUT /guisos/:id` | admin | campos a cambiar | `200 guiso` · `404` |
| `DELETE /guisos/:id` | admin | — | `200 {id}` · `404` |
| `GET /carrito` | sí | — | `200 {items:[{guiso, cantidad}], total_centavos, expira_en_segundos}` |
| `PUT /carrito/items/:guisoId` | sí | `{cantidad}` (0 = quitar) | `200` carrito completo · `404` · `409` sin stock |
| `DELETE /carrito` | sí | — | `200` carrito vacío |
| `POST /pedidos` | sí | — (toma el carrito) | `201 pedido` · `400` carrito vacío · `409` sin stock |
| `GET /pedidos` | sí | — | `200 [pedido]` |

`guiso` = `{id, nombre, descripcion, precio_centavos, porciones, stock}` (números como números).
`pedido` = `{id, total_centavos, creado, items:[{guisoId, nombre, cantidad, precio_centavos}]}`.

Detalles fijados al integrar (17-nov): `creado` es fecha ISO 8601; con el carrito vacío
`expira_en_segundos` es `0`; `DELETE /carrito` y `PUT /carrito/items/:id` responden con la
misma forma que `GET /carrito`; `POST /users` siempre crea `cliente` (el admin lo crea el seed).

El frontend se sirve desde el mismo Express (`express.static('frontend')`), así que llama a
`/api/...` con ruta relativa y no hay CORS.
