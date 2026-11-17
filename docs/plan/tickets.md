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

- 🟡 F6 Landing en la raíz (`frontend/index.html`) + tienda mudada a `frontend/tienda/` (17-nov-2026, commit `a37ef55`)

🟡 = escrita, commiteada y verificada sin navegador; **falta que Alejandro la vea en pantalla**
(composición y movimiento solo los puede juzgar él).
- **Archivos:** `frontend/index.html`, `frontend/landing.css`, `frontend/js/landing.js`. La tienda
  quedó en `frontend/tienda/` (`index.html`, `styles.css`, `app.js`); `frontend/js/api.js` es
  compartido por las dos (mismo `api()`, `money()`, `esc()`). Sin build, sin dependencias, sin GSAP.
- **Dirección:** la identidad sale del producto, no de una plantilla: la bolsa al vacío como objeto,
  la etiqueta de empaque y el rótulo de taquería como tipografía, y «modo de uso» (el reverso del
  empaque) como escena central. Papel de estraza de fondo, rojo guajillo dominante, amarillo maíz
  solo en lo accionable. Intensidad media: un momento firma, el resto quieto.
- **Escenas (transición de estado):** 1 héroe (no sabe qué es → guiso de taquería en bolsa para su
  casa) · 2 modo de uso, firma (¿cómo se come? → son tres gestos) · 3 guisos en vivo desde
  `GET /api/guisos/populares` y `GET /api/guisos` (¿qué hay? → elige) · 4 envío (¿llega bien? →
  entiende por qué va congelado y qué falta confirmar) · 5 la taquería (producto → familia; con
  huecos marcados para fotos reales) · 6 cierre (→ `/tienda/`).
- **Movimiento y peldaño:** héroe, la bolsa se sella y cae el sello «al vacío» (CSS, keyframes);
  modo de uso, escena anclada con `position: sticky` donde el scroll abre la bolsa, pasa el guiso a
  la sartén y arma el taco (CSS con una variable `--p`; JS solo publica el avance, ~15 líneas);
  menú, cada renglón «se imprime» al entrar a pantalla (CSS + `IntersectionObserver`); botones con
  respuesta al hover. No se subió a GSAP: una sola escena con tres fases se resuelve con una variable.
- **Verificado sin navegador:** `node --check` de `js/landing.js`, `js/api.js` y `tienda/app.js`;
  `node frontend/js/api.test.mjs` → `api.test: OK` tras la mudanza; HTML bien anidado, un solo
  `h1`, jerarquía h1→h2→h3 sin saltos, ids únicos y las 23 referencias (`href`, `src`,
  `aria-labelledby`) resuelven; cero `animation`/`transition`/`scroll-behavior` fuera de
  `prefers-reduced-motion: no-preference`; sin `console.log`. Contraste WCAG calculado: tinta/papel
  14.41 · apagado/papel 5.47 · guajillo/papel 6.57 · crema/guajillo 7.48 · tinta/maíz 9.50 ·
  crema/tinta 16.40 · maíz/tinta 9.50 · foco azul/papel 5.57 (todos ≥ 4.5).
- **NO verificado (necesita pantalla):** scroll horizontal a 375 px, cómo se ve la composición a
  375 y 1280, la escena anclada y todo el movimiento, reduced-motion activado, estado de error del
  menú con la API caída, Lighthouse. La tienda en `/tienda/` no se volvió a correr contra Redis
  después de la mudanza: solo cambiaron dos rutas (`app.js` y el import de `../js/api.js`).
- **Prueba de genericidad:** con otro logo no sirve para otro negocio (la bolsa, el modo de uso y
  el menú de guisos son de este producto); lo que sí sigue genérico por falta de datos es la
  sección de la taquería y la tipografía, que usa fuentes del sistema.
- **Decisiones que le tocan a Alejandro:** paleta y rótulo provisionales; si se quiere una fuente
  propia hay que elegirla y guardarla en `frontend/`; tono en primera persona («nuestra familia»).
- **PENDIENTE-CLIENTE (9 marcas en el HTML):** dominio final e imagen para Open Graph · logotipo y
  nombre comercial · línea de confianza (año y ciudad de las taquerías) · instrucciones exactas de
  calentado y qué hacer si llega descongelado · confirmar que se vende congelado · cobertura,
  costo, tiempos y días de despacho del envío, ciudad de origen y vida útil declarada · historia de
  las taquerías · fotos reales (guisos en la taquería; quien atiende) · contactos reales, razón
  social y aviso de privacidad.
- **Aviso para todos los chats:** `git mv` deja los cambios en el índice, y el commit `114cfa0` de
  otro chat se los llevó a medias (tienda mudada sin sus rutas); `a37ef55` lo corrige. En un
  checkout compartido conviene `git commit -- <rutas>` en vez de `git commit` a secas.

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
- 🟡 C2 PDF de diseño y justificación: `docs/TacosMay-Diseno-y-Justificacion.pdf` (12 páginas, las 5 secciones + referencias APA; fuente en `docs/pdf/documento.html`, se regenera imprimiendo a PDF con Edge). Falta que Alejandro lo lea y lo haga suyo.
- 🟡 C3 Guion de demo (4 min) y preguntas probables de la defensa: `docs/guion-demo.md`. Falta ensayarlo con cronómetro, confirmar cómo se ven las claves en la consola de Redis Cloud.

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

- **Coordinación, 17-nov tras la mudanza (commit `a37ef55`):** el flujo completo por HTTP se volvió a correr contra Redis Cloud con la tienda en `/tienda/`: 40 de 40 en verde (landing, sus archivos y la tienda se sirven; API intacta). En la landing no hay teléfonos, precios ni cifras escritos a mano; 9 marcas `PENDIENTE-CLIENTE`. Sigue sin verse en pantalla.
