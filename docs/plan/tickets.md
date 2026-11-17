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

- **Cuarta vuelta (17-nov-2026): todo con IA y página armada con huecos rotulados.** Por decisión
  de Alejandro la página es una prueba y todos los materiales se generan con Gemini.
  - **Documentos (`docs/diseno/`):** `materiales.md` reescrito (5 indispensables: M4 nopal, M2 seis
    guisos fotorrealistas con una sola dirección de fotografía, M3 bolsa con etiqueta en blanco, M5
    taco que se abre, M6 tres clips ilustrados de la escena firma; mejora: M1a letrero, M1b madera,
    M7–M10); `marca.md`, `guion-landing.md` y `metodologia.md` ajustados. Se eligió M6 ilustrado y
    no fotorrealista: el scroll recorre el video cuadro por cuadro y ahí se notan las fallas de
    manos y líquidos. La taquería (antes M11) no se pide: generarla pasaría por el local real.
  - **Página (`frontend/`):** cada material tiene su lugar definitivo como `.pieza` con su código a
    la vista (`data-pieza`): M3 bolsa 3:4 y M4 nopal en el héroe, M6 secuencia en la escena firma
    (16:9 recortado a 4:3), M2 una foto 4:3 por guiso, M9 nopal apenado en el error del menú, M8
    nopal con frío en envío, M4 nopal señalando la dirección, M7 nopal en el cierre. Mientras
    llegan, se ve la versión provisional dibujada (bolsa, nopal, pictograma) o un hueco rayado.
  - **Botones animados funcionando con arte provisional:** tres tiras de 12 cuadros en
    `frontend/media/sprites/` (taco que se abre, bolsa que se rasga, tortilla que se voltea) con un
    solo mecanismo en CSS (`.icono` + `steps()`): con cursor o foco se animan al pasar; en táctil,
    al entrar a pantalla y al tocar; con movimiento reducido quedan fijos en el cuadro final; el
    texto del botón sigue siendo su nombre accesible. La tortilla es además el «cargando» del menú.
  - **Otros cambios:** el letrero se pinta al cargar y la bolsa cae a la mesa; los renglones del
    menú se abren (`<details>`) para ver foto y descripción; escarcha en la escena de envío; la
    escena de la taquería queda con pizarrón, dirección y nopal. `slug()` nuevo en `js/api.js`
    (compartido) con su caso en `api.test.mjs`. **No se añadió GSAP:** el reproductor de la
    secuencia son unas líneas sobre el avance de scroll que ya existía.
  - **Cómo se enchufa cada material:** M2 → `media/guisos/<slug>.webp` y añadir el slug a `FOTOS` en
    `js/landing.js`; M6 → cuadros en `media/modo/<720|1280>/NNN.webp` y poner su número en `FRAMES`;
    M5/M10 → sustituir las tiras de `media/sprites/` (misma geometría: 12 cuadros en fila); M3, M4,
    M7, M8, M9 y M1a → cambiar el `<svg>` provisional por `<img>` donde lo indica el comentario.
  - **Imágenes generadas con IA en la página hoy: ninguna** (aún no llega ningún archivo). Llevarán
    `PENDIENTE-CLIENTE: imagen generada con IA, sustituir por foto real antes de publicar o vender`:
    M2 (guisos) y M3 (bolsa); el comentario ya está puesto en sus huecos.
  - **Verificado sin navegador:** `node --check` de `js/landing.js` y `tienda/app.js`;
    `node frontend/js/api.test.mjs` → `api.test: OK`; HTML bien anidado, un `h1`, ids únicos, 33
    referencias resueltas; las tres tiras son XML válido; cero movimiento fuera de
    `prefers-reduced-motion: no-preference`; contrastes nuevos: etiqueta de pieza 12.63, «+» rojo
    sobre madera 4.13 (signo grande, mínimo 3).
  - **NO verificado:** nada de esta vuelta se ha visto en pantalla (ni los sprites, ni los huecos,
    ni el `<details>`, ni la escarcha). El reproductor de la secuencia (`FRAMES > 0`) no se ha
    ejecutado nunca: no hay cuadros con qué probarlo. Los prompts no se han probado en Gemini. La
    tienda no se volvió a correr contra Redis (solo se añadió una función a `js/api.js`).

- **Quinta vuelta (17-nov-2026): marca con proceso. Imágenes y cambios a la landing, en pausa
  hasta que Alejandro elija ruta.**
  - `docs/diseno/plataforma.md`: plataforma revisada con las respuestas de Alejandro. Idea central
    **«Ya está hecho»**; promesa: guiso de olla sin la espera; para gente que trabaja; razones para
    creer solo con hechos (unos 22 años en Cabo, May es una persona, baño maría, menos de 10
    minutos, 14 guisos, dirección). Explica por qué cambia frente a Investigación (la rapidez sí
    es la verdad del negocio) y frente a `marca.md`, y qué significa «premium» aquí (oficio, no lujo).
  - `docs/diseno/rutas.md` + tableros en `frontend/marca/` (`index.html` y `ruta-1/2/3.html`,
    visibles en `/marca/`): **1 El letrero** (madera, brocha, cactus a color), **2 El pizarrón**
    (tres plumones), **3 La barra** (charolas, un color por guiso, «May» como sello).
    **Recomendación: ruta 3**, con la condición de conservar «May» y el cactus redibujados del
    letrero; segunda opción, ruta 1 con el orden de la 3. Incluye el paso siguiente (sistema y
    dirección de arte para generar imágenes), listo y sin ejecutar.
  - Fuentes nuevas en `frontend/fuentes/` (todas SIL OFL, con su licencia): Alfa Slab One,
    Atkinson Hyperlegible, Kalam, Barlow Condensed y Barlow.
  - `marca.md`, `guion-landing.md` y `materiales.md` quedan **en suspenso** (nota al inicio); en
    `docs/diseno/` se corrigió «nopal» por «cactus». **La landing todavía dice «nopal»** en
    comentarios, clases y un texto alternativo: se corrige cuando se retome.
  - **Verificado sin navegador:** `node --check` de `marca/marca.js`; las cuatro páginas armadas
    con un DOM simulado (etiquetas cuadradas, sin valores vacíos); contraste de los pares de texto
    de las tres rutas, mínimo 5.76; nueve WOFF2 válidos. No se tocó la landing ni la tienda.
  - **NO verificado:** nadie ha visto los tableros en pantalla (ni a 375 px ni en escritorio).
  - **Bloqueo de Alejandro:** aprobar o corregir la plataforma y elegir ruta. Para el sistema hará
    falta la foto de frente del letrero (`PENDIENTE-CLIENTE`).

- **Sexta vuelta (17-nov-2026): sistema de identidad de la ruta 3, «La barra», y dirección de
  arte. La landing no se tocó.** Alejandro eligió la ruta 3 con la condición de conservar «May»
  y el cactus redibujados del letrero.
  - `docs/diseno/sistema.md` + `frontend/marca/sistema.html` (visible en `/marca/sistema.html`,
    enlazado desde `/marca/`): logotipo (construcción, seis versiones, área de respeto, mínimos,
    usos incorrectos), paleta base y **un color por guiso para los 14 del pizarrón**, tipografía,
    código de tres plumones, 12 pictogramas de despacho, la charola como módulo, materiales,
    fotografía, voz, movimiento, y seis aplicaciones (etiqueta, tarjeta de guiso, botones, caja,
    héroe, imagen para compartir). Los valores viven en `frontend/marca/sistema.js`.
  - `docs/diseno/direccion-de-arte.md`: qué se define antes de generar, restricciones, señales de
    rechazo y la lista de piezas con brief, prompt y criterio. **Mínimo: 5 imágenes** (tres
    superficies de guiso, la bolsa y el taco); 15 para toda la tienda. Logotipo, cactus,
    pictogramas, marco de acero, vapor y movimiento se hacen en vector y en código, no se generan.
  - `guion-landing.md` y `materiales.md` sustituidos por sus versiones de la ruta 3; `marca.md`
    queda como histórico con su nota.
  - **Provisional, dicho claro:** «May» está escrito con Alfa Slab One y el cactus está redibujado
    por rasgos, no calcado: la única foto del letrero mide 457 × 279 px, en ángulo y recortada.
    Los 14 colores de guiso son hipótesis hasta ver los guisos reales.
  - **Verificado sin navegador:** `node --check` de `marca/sistema.js` y `marca/marca.js`; la
    página armada con un DOM simulado (720 etiquetas que abren y 720 que cierran, sin valores
    vacíos, anclas resueltas, sin ids repetidos); contraste calculado con las funciones de la
    propia página, mínimo 5.3 en los colores de guiso; movimiento solo dentro de
    `prefers-reduced-motion: no-preference`. No se tocó la landing ni la tienda.
  - **NO verificado:** nadie ha visto `sistema.html` en pantalla; los prompts no se han probado;
    no se sabe si el generador de Antigravity respeta imágenes de referencia.
  - **Bloqueos de Alejandro:** aprobar plataforma, frase de marca y sistema; foto de frente del
    letrero (`PENDIENTE-CLIENTE`); ver los guisos reales para fijar colores.
  - **La landing todavía dice «nopal»** y sigue con el diseño anterior: se rehace con el sistema
    aprobado y las imágenes.

- **Séptima vuelta (17-nov-2026): landing rehecha en la ruta 3, «La barra», y tienda con el mismo
  sistema en lo visual.**
  - **Landing** (`frontend/index.html`, `landing.css`, `js/landing.js`): seis escenas del guion:
    héroe «Ya está hecho.» con fila de tres charolas; «Cómo funciona» con los tres estados
    (charola, bolsa, taco); charolas en vivo desde `GET /api/guisos/populares` y `GET /api/guisos`;
    el envío en papel de ticket; May y la taquería con el pizarrón de tres plumones y la dirección;
    cierre. Logotipo con «May» y el cactus de sello en cabecera, escena 5 y pie.
  - **Compartido** (`frontend/barra.css`, `frontend/js/barra.js`): fuentes, colores, logotipo,
    botones, pictogramas, cactus y la charola. Lo usan la landing, la tienda y los tableros de
    `frontend/marca/` (una sola tabla de colores por guiso). Color, número y foto de cada charola
    se buscan por el nombre del guiso; uno fuera de la tabla va en charola de acero.
  - **Tienda** (`frontend/tienda/`): solo visual. Hoja de estilos al sistema, logotipo en la
    cabecera y la tarjeta del catálogo convertida en charola (`card` en `app.js`). **No se tocaron
    rutas, llamadas, estado ni acciones**; el botón conserva sus `data-*`.
  - **Imágenes** (`frontend/media/guisos/`, WebP 720 × 540, recorte 4:3 centrado, unos 92 KB cada
    una; originales en `frontend/media/originales/`): `carne-en-salsa-roja` (pieza maestra,
    aprobada) y `chorizo-con-huevo` (provisional: Alejandro aún elige variante). Las dos son
    **generadas con IA** y llevan `PENDIENTE-CLIENTE: imagen generada con IA, sustituir por foto
    real antes de publicar o vender` (en `index.html` y en `FOTOS` de `js/barra.js`).
  - **Huecos rotulados:** I1-08 rajas con queso y crema (héroe y, en vivo, su charola en landing y
    tienda), I2 bolsa e I3 taco (escena 2). Cómo se enchufan: `docs/diseno/guion-landing.md`.
  - **Retirado:** madera, rótulo recreado, «nopal», sprites provisionales (`media/sprites/`), los
    huecos M2–M9 y la fuente Rammetto One con su licencia.
  - **Verificado sin navegador:** `node --check` de `js/landing.js`, `js/barra.js`,
    `tienda/app.js` y los módulos de `marca/`; `node frontend/js/api.test.mjs` → `api.test: OK`;
    HTML bien anidado en landing y tienda, un `h1`, jerarquía sin saltos, ids únicos, 32 referencias
    resueltas, las 3 imágenes con `alt` y medidas; ninguna clase sin regla en landing ni en tienda;
    movimiento solo dentro de `prefers-reduced-motion: no-preference`; sin restos de la dirección
    anterior; sin precios ni horarios escritos a mano; el manual (`marca/sistema.html`) sigue
    armando igual tras mover los datos. Contraste: negro/crema 17.0, gris/crema 6.8, gris/acero
    5.4, rojo plumón/pizarrón 5.8, alerta de la tienda 6.7, texto sobre cada color de guiso ≥ 5.3.
  - **NO verificado:** nada de esto se ha visto en pantalla: ni la landing (375 px, escritorio, la
    escena anclada, el movimiento) ni la tienda con su nuevo aspecto. **La tienda no se volvió a
    correr contra Redis tras el cambio de tarjeta:** conviene repetir el flujo de la demo antes del
    examen. Sin revisar: Lighthouse y lector de pantalla.
  - **Provisional:** «May» en Alfa Slab One y cactus redibujado por rasgos (falta la foto de frente
    del letrero); los 14 colores de guiso son hipótesis.

- **Octava vuelta (17-nov-2026): llegaron I1-08, I2 e I3; ya no hay huecos rotulados.**
  - Optimizadas a WebP 720 × 540 en `frontend/media/guisos/`: `rajas-con-queso-y-crema` (69 KB),
    `bolsa` (45 KB) y `taco` (57 KB); originales de 2048 px en `frontend/media/originales/`. Las
    cinco imágenes de la página son **generadas con IA** y llevan su `PENDIENTE-CLIENTE`.
  - **Rajas:** recorte más cerrado (1520 × 1140 del original, centrado un poco abajo) para dejar
    fuera la orilla de la sartén; revisado mirando el recorte: no se ve orilla, lo oscuro que queda
    es chile tatemado. Aparece en el héroe y, en vivo, en su charola de landing y tienda.
  - **Bolsa:** en el paso 2 de «Cómo funciona», con la etiqueta del sistema encima de la etiqueta en
    blanco. La posición se midió en el original (la etiqueta blanca ocupa x 780–1288, y 860–1208 de
    2048) y se pasó a porcentajes del recorte 4:3. El recorte 4:3 corta las orillas de arriba y de
    abajo de la bolsa, que es casi cuadrada.
  - **Taco:** en el paso 3.
  - Se quitó el mecanismo de huecos (`PENDIENTES` y `.pieza`): los diez guisos sin imagen muestran
    el color de su charola.
  - **Tamaño:** se quedó en 720 px. Las charolas se muestran a 350 px o menos casi siempre, así que
    720 ya cubre pantallas densas; un segundo tamaño duplicaría el peso sin que se note. La única que
    se ve mayor (la primera de «Lo que más sale», hasta unos 560 px) queda a 1.3×.
  - **Verificado sin navegador:** `node --check` de los módulos; `api.test: OK`; HTML bien anidado,
    6 imágenes con `alt` y medidas, 35 referencias resueltas, ninguna clase sin regla, sin
    marcadores ni restos de huecos.
  - **NO verificado:** si la etiqueta cae exactamente sobre la blanca al verla en pantalla (está
    calculada, no vista), si su texto se lee a ese tamaño, y todo lo que ya estaba sin ver: landing
    y tienda completas, a 375 px y en escritorio. La tienda sigue sin correrse contra Redis desde
    que cambió su tarjeta.

- **Novena vuelta (17-nov-2026): exploración de logotipos. Nada aplicado todavía.** A Alejandro no
  lo convenció el logotipo; abrió la puerta a un cactus en silueta y a una marca que una cactus y
  nombre.
  - `frontend/marca/logos.html` (visible en `/marca/logos.html`, enlazado desde `/marca/`) con
    siete conceptos, cada uno grande, a 24 px, a una tinta en negro, en blanco sobre oscuro, sobre
    el rojo, en la cabecera y en la etiqueta: 1 El cactus de May (silueta + nombre) · 2 La placa
    (silueta mínima) · 3 La Y es el cactus (combinada) · 4 El cactus lleva el nombre (combinada) ·
    5 La charola de May (cactus + producto) · 6 May, a secas (solo letras) · 7 El letrero.
  - `docs/diseno/logos.md`: razonamiento y **recomendación: el 3**; segunda opción, el 1 con el 2
    como ícono. El 5 no se recomienda: se lee como planta en maceta.
  - Las letras de «May» y el cactus son dibujo propio en vector (por coordenadas), no una fuente.
  - **Verificado:** los siete dibujos convertidos a imagen y revisados a la vista (color, blanco
    sobre negro y 24 px); `node --check`; la página armada con un DOM simulado (651 etiquetas
    cuadradas, sin valores vacíos, ninguna clase sin regla).
  - **NO verificado:** la página en el navegador; los dibujos con las fuentes del sistema; el
    parecido con marcas registradas (revisión de memoria, falta búsqueda formal).
  - **Bloqueo de Alejandro:** elegir concepto. Después: segundo pase de dibujo, versiones del
    sistema y aplicarlo a landing y tienda.

- **Décima vuelta (17-nov-2026): empacado al agregar al carrito y lienzo a todo el ancho.** El
  logotipo sigue sin elegirse; no se aplicó ninguno.
  - **Empacado** (`frontend/tienda/empaque.js` + `tienda/styles.css`), al agregar un guiso en el
    catálogo de la tienda (la landing no tiene «agregar»). Coreografía, 2.0 s en total:
    0.00 s aparece la bolsa sobre la charola (0.16 s) · 0.10 s el guiso cae dentro (0.26 s) ·
    0.36 s vacío: la bolsa se encoge y el plástico se pega (0.28 s) · 0.66 s pasa la barra de calor
    y queda la banda sellada (0.24 s) · 0.90 s cae la etiqueta con número y nombre (0.20 s) ·
    1.15 s la bolsa vuela al enlace del carrito (0.60 s) · 1.75 s el contador responde (0.25 s).
    La bolsa es dibujo en CSS con el color del guiso (y su foto, si la tiene): igual para los 14.
  - **Técnica:** CSS (keyframes con retrasos y dos variables para el destino del vuelo); JS solo
    coloca la bolsa y le dice a dónde ir. Sin librería: no hizo falta.
  - **No cambia la lógica:** la llamada sale en el mismo momento y no espera a la animación. Si la
    API falla, la bolsa se sacude y se va, y sale el aviso de siempre. Una bolsa por charola
    (agregar seguido no las encima). No tapa el botón ni toma el foco; va oculta para el lector
    de pantalla. Con movimiento reducido no se muestra: quedan el aviso y el contador.
    Cambios en `tienda/app.js`: el `import`, dos líneas en `add` y una en `render` (`data-vista`).
  - **Todo el ancho:** margen de 16 a 64 px según pantalla y tope de 1680 px (antes 1120 en la
    landing y 1000 en la tienda). Charolas: 4, 5 y 6 por fila (700, 1280 y 1600 px). Desde 1100 px:
    héroe en dos columnas, ticket del envío en dos columnas, carrito con lista y resumen lado a
    lado, admin con formulario y lista lado a lado. El texto corrido conserva su ancho de lectura.
    Regla escrita en `docs/diseno/sistema.md`, sección 6.
  - **Imágenes:** segundo tamaño de 1024 × 768 para las cinco (80 a 149 KB), servido con `srcset`.
  - **Verificado sin navegador:** `node --check` de `tienda/empaque.js`, `tienda/app.js`,
    `js/barra.js` y `js/landing.js`; `api.test: OK`; HTML bien anidado, 6 imágenes con `alt` y
    medidas, ninguna clase sin regla en landing ni tienda; el diff de `app.js` son 4 líneas.
  - **NO verificado:** la animación no se ha visto correr ni una vez (ni su ritmo, ni el vuelo al
    carrito, ni la reversa con error); la retícula a 1280, 1440 y 1920 px, y a 375 px; la tienda
    contra Redis con estos cambios (lo corre coordinación).

- **Undécima vuelta (17-nov-2026): segundo pase de los logotipos 3 y 4. Nada aplicado todavía.**
  - `frontend/marca/logos-2.html` (en `/marca/logos-2.html`, enlazado desde `/marca/` y `logos.html`):
    cuatro variantes del 3 (3A sombrero en la horquilla · 3B sombrero en el brazo alto · 3C cactus
    en negro · 3D sin sombrero, en una línea), tres del 4 (4A pastilla · 4B contorno · 4C vertical),
    el híbrido como sistema y el juego completo de tres candidatos (principal, horizontal, sello,
    una tinta, sobre claro, oscuro y rojo, 24 px, pestaña, cabecera y etiqueta).
  - Redibujado: pesos y espacios de «May», hueco de la «A», postura del cactus (brazo izquierdo
    corto y bajo, derecho largo y alto), sombrero, y un filo que separa sombrero y flores a una
    tinta. «Los Tacos» es ahora el trazo real de Barlow Condensed SemiBold.
  - `docs/diseno/logos.md`: **recomendación: 3A como logotipo y 4C como sello**; segunda opción,
    3A solo. Fundirlos en una pieza no funciona (cactus dentro de cactus).
  - **Verificado:** dibujos convertidos a imagen y revisados a la vista; `node --check`; página
    armada con DOM simulado (463 etiquetas cuadradas, ninguna clase sin regla).
  - **NO verificado:** la página en el navegador; búsqueda formal de marcas.
  - **Bloqueo de Alejandro:** elegir (sistema 3A + 4C, o uno solo) y las tres decisiones de detalle.

- **Duodécima vuelta (17-nov-2026): logotipo elegido y aplicado.** Alejandro eligió **4B como
  principal y 4C como sello**.
  - **Arte:** archivos SVG autónomos en `frontend/marca/logo/`: `principal` (4B con «Los Tacos»),
    `compacta` (4B sin texto) y `sello` (4C), cada uno a color, `-negro` y `-blanco`, más
    `icono.svg`. Último repaso: el marco pasó de trazo 10 a 12; los brazos nacen bajo el marco (a
    una tinta asomaba su punta dentro de la placa); las letras del sello son huecos de verdad.
  - **Regla de tamaños:** principal desde 200 px de ancho; compacta de 96 a 200 px; por debajo, el
    sello (mínimo 24 px de alto). Sobre oscuro y sobre rojo, siempre la versión en blanco.
  - **Aplicado en la landing:** cabecera (compacta), escena «May y la taquería» (principal), pie
    (principal en blanco), etiqueta sobre la foto de la bolsa (sello), ícono de pestaña e imagen
    para compartir (`frontend/media/compartir.jpg`, 1200 × 630, con `og:image`).
  - **Aplicado en la tienda (solo visual):** cabecera, ícono de pestaña y la etiqueta de la bolsa
    en la animación de empacado (sello). Sin cambios en `app.js`.
  - **Manual:** sección 1 de `docs/diseno/sistema.md` reescrita y `frontend/marca/sistema.html`
    actualizado; se quitó la nota de «provisional a la espera de la foto del letrero». `logos.html`
    y `logos-2.html` quedan como historial, con la nota de cuál se eligió.
  - **Retirado del sitio:** el cactus anterior (ahora solo vive en los tableros de rutas) y Alfa
    Slab One de `barra.css`.
  - **Verificado:** las diez versiones del logotipo y la imagen para compartir convertidas a imagen
    y revisadas a la vista; `node --check` de todos los módulos; `api.test: OK`; HTML de landing y
    tienda bien anidado, 10 imágenes con `alt` y medidas, ninguna clase sin regla; manual y tableros
    armados con DOM simulado, sin referencias a archivos que falten. Contraste: «May» rojo sobre
    crema 5.3; negro sobre crema 17.0 y sobre acero 13.6; blanco sobre negro 17.0 y sobre rojo 5.3.
  - **NO verificado:** nada en el navegador: el tamaño real del logotipo en la cabecera a 375 px,
    el sello dentro de la etiqueta de la bolsa (es muy chico) y en la animación, y el ícono de
    pestaña. La tienda no se volvió a correr contra Redis. Falta la búsqueda formal de marcas.

- **Decimotercera vuelta (17-nov-2026): correcciones tras ver el sitio desplegado** (lista de
  coordinación, con capturas a 375 y 1440 px).
  - **SVG inválidos (causa):** el guion que exporta los logotipos pasaba cada clase a atributos sin
    quitar el `fill="none"` que la pieza ya traía, y el atributo quedaba dos veces. Ahora cada
    etiqueta conserva una sola aparición de cada atributo y la exportación se detiene si el
    archivo no pasa un parseo XML estricto. En el repo queda la prueba
    `node frontend/marca/logo/svg.test.mjs` (atributos sin repetir, etiquetas bien cerradas), que
    falla con los archivos rotos y pasa con los corregidos. **Aviso:** al aplicar el arreglo, un
    primer intento mío volvió a escribir los archivos rotos por unos minutos en disco; la prueba
    lo atrapó antes de commitear. El guion vive fuera del repo.
  - **1 · Etiqueta de la bolsa:** sobre la etiqueta blanca va solo el nombre del guiso, centrado,
    con una raya del color del guiso; se quitaron el sello, el número y la letra chica.
  - **2 · Fuente de la tienda:** la causa no eran las rutas de `@font-face`. `barra.css` llamaba
    `--texto` a su variable de tipografía y la hoja de la tienda define `--texto` como color: la
    pisaba y el texto caía a la fuente con remates del sistema. La variable ahora es `--fuente`.
  - **3 y 4 · Charolas sin foto:** más bajas (5:2), con cepillado de acero sobre su color y el
    número grande, en landing y tienda. La tienda pasa a dos columnas en celular; el botón ocupa el
    ancho de su charola y puede partirse en dos renglones.
  - **5 · Cabecera en celular:** logotipo y «Tienda» en la primera línea, los tres enlaces en la
    segunda («Tienda» salió del `<nav>`).
  - **6 · Escritorio:** en el héroe, titular y texto lado a lado y las tres charolas debajo a todo
    lo ancho. En «Cómo funciona» el gris **sí** era la progresión por scroll, pero se leía como
    error: los pasos inactivos ya no pierden color, solo se achican, y el activo lleva filo negro.
    Con movimiento reducido salen los tres iguales desde el inicio (las reglas viven dentro de
    `prefers-reduced-motion: no-preference`).
  - **7 · Empacado a 375 px:** la bolsa tiene tamaño propio (40 % del ancho, máximo 150 px), se
    apoya en la orilla de abajo de la zona del guiso y crece hacia arriba, así que no tapa el
    nombre ni el botón; se mantiene a 8 px de las orillas de la pantalla.
  - **Verificado sin navegador:** `svg.test: OK (10 archivos)` y parseo estricto con Python;
    `api.test: OK`; `node --check` de los módulos; HTML bien anidado; ninguna clase sin regla.
  - **NO verificado:** nada de esto en pantalla. La animación de empacado sigue sin verse correr.

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
