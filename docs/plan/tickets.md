# Tickets — TacosMay

Fuente de verdad del trabajo. Entrega: semana del 17–20 nov 2026.

## Bloqueos que solo Alejandro puede quitar
- ✅ (17-nov) **Crear la base en Redis Cloud** (plan gratis) y poner `REDIS_URL` en `.env`. Sin esto
  nada se puede verificar contra la nube.
- 🔲 **Fecha y hora exactas** de la exposición.
- 🔲 Menú y precios reales de TacosMay (`PENDIENTE-CLIENTE`; no bloquea la entrega: el seed
  usa datos de ejemplo).

## Backend
- 🟡 B1 Esqueleto con la estructura de 2026backA + conexión a Redis por `REDIS_URL`
- 🟡 B2 Usuarios y JWT (registro, login, `protect`, `soloAdmin`)
- 🟡 B3 CRUD de guisos + populares
- 🟡 B4 Carrito con TTL
- 🟡 B5 Pedidos (checkout transaccional)
- 🟡 B6 Seed (`npm run seed`) + README + `.env.example`

🟡 = código escrito y commiteado, **sin verificar contra Redis** (no hay `REDIS_URL`: falta
que Alejandro cree la base en Redis Cloud). Evidencia B1–B6 (17-nov-2026):
- **Verificado sin Redis:** `npm test` → `tests 3 · pass 3 · fail 0` (checkout sin stock →
  409, guiso borrado → 409, total correcto); las 4 rutas cargan; los 27 métodos de
  node-redis 6.3.1 que se usan existen; sin variables el arranque falla claro:
  `node backend/server.js` → `Falta JWT_SECRET…` / `Falta REDIS_URL…` (exit 1),
  `node backend/seed.js` → `Faltan ADMIN_EMAIL y ADMIN_PASSWORD…` (exit 1).
- **NO verificado:** ningún comando tocó un Redis real (tampoco local: no hay). Falta correr
  seed, servidor y el flujo completo, sobre todo la transacción `WATCH`/`MULTI`/`EXEC`.
- **Para verificar** (con `.env` lleno): `npm run seed` dos veces (la 2.ª debe decir que
  borró claves y dejar los mismos 6 guisos), `npm start`, y los `curl` de «Probar la API a
  mano» del `README.md`; pedir más de 3 del guiso 6 debe dar `409`.
- Respuestas a los supuestos del frontend: `expira_en_segundos` es `0` con carrito vacío;
  `creado` es fecha ISO; `DELETE /carrito` responde igual que `GET /carrito`; el seed crea
  el admin. Los ids (`id`, `guisoId`) son **texto** (`"1"`), no número.

## Frontend
- ✅ F1 Catálogo + populares
- ✅ F2 Registro / login
- ✅ F3 Carrito con cuenta regresiva de expiración
- ✅ F4 Checkout + mis pedidos
- ✅ F5 Panel admin (alta, edición y baja de guisos)

Evidencia F1–F5 (17-nov-2026), `frontend/`: `index.html`, `styles.css`, `js/api.js` (único
`api()`, sesión, `money`, `esc`, `notice`), `js/app.js` (vistas y acciones).
- **Verificado sin backend:** `node --check` de `js/app.js` y `js/api.js` sin errores;
  `node frontend/js/api.test.mjs` → `api.test: OK` (token Bearer, cuerpo JSON, error
  `{message}` → excepción, 401 con token = sesión vencida, servidor caído, formato de dinero,
  escape de HTML); las 13 rutas que usa coinciden con `docs/contrato.md` (no usa
  `GET /guisos/:id`, no hace falta).
- **NO verificado:** nada corrió en un navegador ni contra el backend/Redis. Falta de punta
  a punta: registro → agregar → cuenta regresiva → expiración → pedido → mis pedidos → CRUD
  admin, y la revisión visual a 375 px (el CSS está hecho para eso, pero nadie lo vio). C1.

## Investigación
- ✅ I1 Viabilidad: empaque al vacío, vida útil, cadena de frío, paqueterías, regulación → `docs/investigacion/viabilidad.md` (17-nov)
- ✅ I2 Competencia y precios de referencia en México → `docs/investigacion/mercado.md` (17-nov)
- ✅ I3 Insumos para el PDF: dominio del problema y justificación Clave-Valor vs SQL → `docs/investigacion/insumos-pdf.md` (17-nov). Ojo: el plan gratis de Redis Cloud no tiene persistencia en disco (sección c)

## Coordinación
- 🟡 C1 Integrar y correr el flujo completo de la demo contra la nube
  - **Verificado 17-nov contra Redis Cloud (`…db.redis.io`), servidor local en :5000:**
    `npm run seed` → `1 admin y 6 guisos de ejemplo`; 34 de 34 comprobaciones por HTTP en verde:
    frontend servido, registro/login/`me`, 401 sin token, 403 de cliente en rutas de admin, CRUD
    completo de guisos con 404, carrito con TTL (1800 → 1798 → se renueva a 1800 al cambiar),
    409 por stock, pedido (stock 3 → 1, carrito vacío, ranking con 2 vendidos), 409 al pedir sin
    stock, borrado de guiso sin romper populares ni carrito. Con esto B1–B6 quedan verificados
    contra la nube y los cuatro supuestos del frontend se cumplen.
  - **Falta:** verlo en un navegador (clics reales, cuenta regresiva, 375 px). Eso lo ve Alejandro.
  - Quedaron en la base un usuario `prueba…@tacosmay.test` y el pedido 1; `npm run seed` los limpia.
- 🔲 C2 PDF de diseño y justificación (5 secciones obligatorias de la rúbrica)
- 🔲 C3 Guion de demo (4 min) y preguntas probables de la defensa

## Cambios al contrato
_(propuestas de backend/frontend; coordinación las aplica en `docs/contrato.md`)_
- **Backend, detalles que el contrato no fija** (no cambian rutas ni claves):
  - El JWT lleva `{id, email}` porque el usuario se guarda por email (`tm:user:{email}`) y
    así `protect` lo encuentra sin un índice extra. El email se guarda en minúsculas.
  - Códigos además de los del contrato: `400` dato faltante/inválido o email repetido,
    `401` sin token o credenciales malas, `403` no es admin. `precio_centavos`,
    `porciones`, `stock` y `cantidad` deben ser enteros JSON ≥ 0 (no texto).
  - Borrar un guiso también lo saca de `tm:guisos:vendidos`.
- **Frontend, supuestos que el contrato no fija** (no bloquean; si el backend hace otra cosa, avisar):
  - `expira_en_segundos` con carrito vacío: el frontend acepta `0`, negativo (`-2` de `TTL`)
    o ausente; solo cuenta hacia atrás si hay items y el valor es > 0.
  - `creado` del pedido: acepta fecha ISO o epoch en **milisegundos**. Si llega en segundos,
    la fecha saldrá en 1970.
  - `DELETE /carrito` debe responder con la misma forma que `GET /carrito`.
  - El alta de admin la hace un usuario con `rol: admin`: el seed (B6) necesita crear uno,
    porque `POST /users` solo da `cliente`.

## Después (fuera de la entrega)
- Pagos, cotización real de envío por código postal, lotes con fecha de caducidad,
  panel de pedidos para la cocina, marca y diseño propios.
