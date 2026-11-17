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

- 🟡 F6 Landing de Los Tacos May en la raíz (`frontend/index.html`) + tienda en `frontend/tienda/` (17-nov-2026)

🟡 = escrita, commiteada y verificada sin navegador; **la segunda vuelta (marca real) nadie la
ha visto en pantalla**: composición, tipografía y movimiento solo los puede juzgar Alejandro.
- **Archivos:** `frontend/index.html`, `frontend/landing.css`, `frontend/js/landing.js`,
  `frontend/fuentes/` (Rammetto One + `OFL.txt`). Tienda en `frontend/tienda/`; `frontend/js/api.js`
  es compartido (mismo `api()`, `money()`, `esc()`). Sin build, sin dependencias, sin GSAP.
- **Segunda vuelta (marca real, `docs/negocio/datos.md`):** la marca visible es «Los Tacos May»
  (también en el encabezado de la tienda). La paleta sale del rótulo: madera clara de fondo, negro
  del contorno, amarillo y rojo de las letras, verde del nopal; se retiró la provisional de papel
  de estraza y guajillo. Títulos en Rammetto One (OFL, guardada en `frontend/fuentes/`) con relleno
  y contorno negro como el letrero. El nopal con sombrero se redibujó en SVG propio como **versión
  provisional a partir de la foto del rótulo**; aparece en la cabecera, junto a la bolsa en el héroe
  y en el favicon. La sección de la taquería ahora tiene datos reales: los 14 guisos del pizarrón
  (sin precios) dibujados como pizarrón blanco con plumón rojo y rayas azules, y la dirección
  enlazada a Maps. Referencias y qué se tomó de cada una: `docs/investigacion/referencias-marca.md`.
- **Lo que se cuidó con los datos:** ningún precio del pizarrón ni horario en la página (grep de
  `$40/$45/$60` y de «4 a.m.» sin resultados); los guisos y precios empacados siguen saliendo de
  la API; no se usa la captura de Maps como imagen.
- **Escenas (transición de estado):** 1 héroe (no sabe qué es → guiso de Los Tacos May en bolsa
  para su casa) · 2 modo de uso, firma (¿cómo se come? → son tres gestos) · 3 guisos en vivo desde
  `GET /api/guisos/populares` y `GET /api/guisos` (¿qué hay? → elige) · 4 envío (¿llega bien? →
  entiende por qué va congelado y qué falta confirmar) · 5 la taquería (un producto → la taquería
  real del centro de Cabo San Lucas) · 6 cierre (→ `/tienda/`).
- **Movimiento y peldaño:** héroe, la bolsa se sella, cae el sello y se asoma el nopal (CSS,
  keyframes); el nopal de la cabecera saluda al pasar el cursor o el foco (CSS); modo de uso,
  escena anclada con `position: sticky` donde el scroll abre la bolsa, pasa el guiso a la sartén y
  arma el taco (CSS con una variable `--p`; JS solo publica el avance); menú, cada renglón «se
  imprime» al entrar a pantalla (CSS + `IntersectionObserver`). Sin librería.
- **Verificado sin navegador:** `node --check` de `js/landing.js` y `tienda/app.js`;
  `node frontend/js/api.test.mjs` → `api.test: OK`; HTML bien anidado, un solo `h1`, jerarquía sin
  saltos, ids únicos y 29 referencias (`href`, `src`, `aria-labelledby`, `url()` de la fuente)
  resueltas; cero `animation`/`transition`/`scroll-behavior` fuera de
  `prefers-reduced-motion: no-preference`. La fuente es un woff2 válido de 22 KB con su licencia.
  Contraste WCAG calculado: negro/madera 13.21 · negro/junta de tablón 10.56 · apagado/madera 6.49
  · apagado/junta 5.18 · rojo/blanco 5.75 · blanco/verde 6.46 · negro/amarillo 12.63 ·
  amarillo/negro 12.63 · blanco/rojo 5.75 · azul/blanco 7.63 (todos ≥ 4.5). Las letras amarillas
  del letrero sobre madera no llegan a 3:1 por relleno: las hace legibles el contorno negro, y solo
  se usan en la marca y en un título decorativo.
- **NO verificado (necesita pantalla):** scroll horizontal a 375 px; composición a 375 y 1280; si
  el nopal redibujado se parece lo suficiente al del rótulo; si Rammetto One se parece a la letra
  pintada y si sus títulos caben bien en móvil (los tamaños se calcularon sin medir la fuente); el
  contorno de las letras (`paint-order` en texto HTML pide un navegador reciente); la escena anclada
  y todo el movimiento; reduced-motion; el estado de error del menú; Lighthouse. La tienda no se
  volvió a correr contra Redis: solo cambió el texto de su marca.
- **Prueba de genericidad:** con otro logo ya no sirve para otro negocio: nopal, letrero, pizarrón
  con sus guisos y dirección son de esta taquería. Sigue flojo, por falta de material: no hay ni
  una foto real.
- **Decisiones que le tocan a Alejandro:** si el nopal y la fuente pasan como provisionales; tono
  en primera persona («nuestra familia»); mostrar o no «Corazón de vaca enamorada» antes de
  confirmarlo con la familia.
- **PENDIENTE-CLIENTE (9 marcas en el HTML).** Resuelto en esta vuelta: nombre comercial, ciudad y
  dirección, nombres de los guisos de la taquería. Sigue pendiente: dominio final e imagen para
  Open Graph · arte original del rótulo o foto de frente · año de inicio · instrucciones de
  calentado y qué hacer si llega descongelado · confirmar que se vende congelado · cobertura,
  costo, tiempos y días de despacho, origen del envío y vida útil · horario completo, demás
  taquerías, historia y fotos propias · confirmar «Corazón de vaca enamorada» y la carta vigente ·
  teléfono, WhatsApp, correo, redes, razón social y aviso de privacidad.

- **Tercera vuelta (17-nov-2026): rumbo a versión premium. Fases 1 y 2 hechas; fase 3 en espera
  de materiales.** Documentos en `docs/diseno/`: `metodologia.md` (10 pasos con entregable y
  criterio de salida, producción y control de materiales, presupuesto de peso, peldaños de
  movimiento), `marca.md` (**propuesta por aprobar**: idea central «Hecho a mano, hasta el
  letrero», voz, el nopal y sus poses, paleta con contraste, tipografía, texturas, foto e
  ilustración, qué no es), `guion-landing.md` (7 escenas con material, movimiento y técnica, y el
  sistema de botones animados: taco que se abre, bolsa que se rasga, tortilla que se voltea) y
  `materiales.md` (pedido a Alejandro: 6 piezas indispensables M1–M6 y 7 de mejora, con prompts
  para Gemini, formatos y nombres de archivo en `frontend/media/originales/`).
  - **No se tocó `frontend/`** en esta vuelta: no hay prototipo nuevo; la página publicada sigue
    siendo la de la segunda vuelta.
  - **Bloqueos de Alejandro:** aprobar la marca; decir si ya existe una bolsa empacada real (de eso
    depende que el producto y la escena firma sean foto y video reales o ilustración rotulada);
    producir M1–M6.
  - **Sin verificar:** los prompts no se han probado en Gemini; `docs/investigacion/landing-premium.md`
    aún no existía al escribir esto y falta contrastarlo antes de construir.

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
