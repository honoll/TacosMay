# Hallazgos de la revisión

Registro de lo encontrado al ejecutar [plan-de-revision.md](plan-de-revision.md). Estado:
🔴 abierto · 🟡 corregido, falta volver a verlo · ✅ corregido y visto.

## Vuelta 5 — 17-nov-2026: entre la landing y la tienda sin recargar

Revisión del enrutador (`frontend/js/paginas.js`) a 1440: ida y vuelta tres veces, «atrás» y
«adelante», sin recarga, con la misma cabecera, un solo `main`, una cabecera y un pie.

| # | Dónde | Gravedad | Hallazgo | Estado |
|---|---|---|---|---|
| Y1 | Landing → tienda sin recargar | Bloquea | La tienda quedaba sin estilos: las hojas con ruta relativa resolvían contra `/tienda/` después del `pushState`, el enrutador dejaba de reconocer `barra.css` y lo apagaba | 🟡 coordinación fija las hojas absolutas al arrancar (20973e3); además las tres páginas usan rutas desde la raíz en hojas, scripts, ícono e imágenes, y `navegacion.test` resuelve `link.href` contra la dirección vigente y falla si se quita esa línea |
| Y2 | Consola, cualquier cambio de vista o de página | Menor | Rechazos sin atrapar de las transiciones de vista saltadas («Transition was skipped», «Document hidden») | 🟡 una sola función `transicion()` en `js/api.js` atrapa `ready` y `finished`; el cambio se hace igual (probado en `api.test` y `navegacion.test`) |
| Y3 | iPhone, Safari: Inicio → Guisos y de vuelta | Grave | Un instante el logotipo gigante (la cabecera sin estilo) y, de regreso, se asomaba «Saltar al contenido». Causa: el enrutador encendía y apagaba hojas al navegar (`media="not all"`), poco fiable en Safari | 🟡 las tres páginas cargan siempre las mismas tres hojas, en el mismo orden, y el enrutador ya no toca el CSS: solo cambia la marca de `<html>` (`en-inicio`, `en-tienda`). Cada regla de `landing.css` y `tienda/styles.css` va acotada con `:where(.en-…)`, que no cambia su especificidad. Pruebas: `paginas.test` (hojas iguales, todo acotado, sin choques) y `navegacion.test` (las hojas no se tocan). Falta verlo en el iPhone |

Sin revisar todavía: celular, Safari y Firefox; llegar a un ancla de la landing desde la
tienda; navegar con sesión iniciada (contador y cuenta regresiva tras varias idas y vueltas).

## Vuelta 4 — 17-nov-2026: vistas 2 a 8 del segundo tiempo

Recorrido con cuenta de prueba (cliente y administrador) a 1440 × 900, y la landing también
a 375 × 812. Pruebas automáticas en verde (API contra Redis y las cuatro del frontend).

**Funciona y se vio:** landing con «Lo que más sale» tras el héroe; ficha de un guiso con
foto grande, cantidad, cómo se calienta y cómo se conserva; carrito; confirmar pedido;
pedidos con el recién confirmado resaltado; alta de un guiso en administración con el
renglón palomeado.

| # | Dónde | Gravedad | Hallazgo | Estado |
|---|---|---|---|---|
| X1 | Landing, «Lo que más sale», escritorio | Grave | La primera charola sale enorme y la segunda chica; si el más vendido no tiene foto queda un bloque gigante de color liso. Con solo dos guisos vendidos el bloque se ve roto | ✅ visto: con menos de tres vendidos el bloque no se muestra; falta verlo con tres o más |
| X2 | Tienda, aviso flotante | Grave | La ficha de aviso de abajo tapa lo que tiene debajo y se queda con el clic: no se pudo pulsar «Eliminar» del último renglón de administración mientras estaba visible | 🟡 |
| X3 | T9 Administración | Menor | Eliminar un guiso usa el cuadro de confirmación nativo del navegador; no es del sistema visual y hay navegadores embebidos que lo descartan solos. Usar confirmación propia en la página | 🟡 |
| X4 | Todo el sitio, sin sesión | Menor | La consola registra un error 401 al cargar: se pide el carrito aunque no haya sesión | ✅ falsa alarma de coordinación: el 401 era de mi propia prueba de contraseña equivocada; sin sesión solo se piden guisos y populares |

Sin revisar todavía: editar un guiso; carrito expirado; panel lateral del carrito; W2 en
celular; tableta y 1920 px; solo teclado y movimiento reducido; la dirección pública.

## Vuelta 3 — 17-nov-2026: comprobación de las correcciones y del catálogo nuevo

Repetí el recorrido con cuenta de prueba (cliente y administrador) a 1440 × 900 y 375 × 812:
V1 a V10 quedaron corregidos y vistos. El catálogo nuevo (lo que más sale, grupos por precio,
«Agregar» que se vuelve selector de cantidad) funciona. Pruebas automáticas en verde; el
servidor ya sirve la página de no encontrado. Cuenta de prueba y su pedido, borrados.

| # | Dónde | Gravedad | Hallazgo | Estado |
|---|---|---|---|---|
| W1 | T2 Catálogo | Menor | La ficha dice «1 vendidos»: falta el singular | ✅ |
| W2 | T1 Cabecera, celular con sesión | Menor | «Mis pedidos», «Admin», el nombre y «Salir» quedan fuera de la pantalla en la fila deslizable, sin ninguna señal de que hay más a la derecha | 🟡 |

Sin revisar todavía: landing completa con la cabecera nueva (N5, N6); tableta y 1920 px;
editar y eliminar un guiso; carrito expirado; solo teclado y movimiento reducido; la
dirección pública.

## Vuelta 2 — 17-nov-2026: revisión en pantalla con cuenta de prueba

Hecha en `localhost:5000` a 1440 × 900 y a 375 × 812, sin sesión, como cliente y como
administrador, con una cuenta de prueba que se borró al terminar (junto con su pedido; las
existencias se devolvieron). Pruebas automáticas: flujo de la API contra Redis en verde y
`api.test` en verde.

**Funciona y se vio:** registro (queda con sesión y regresa al catálogo), validación de
campos vacíos, inicio de sesión, agregar al carrito con la animación de la bolsa, contador y
cuenta regresiva en la cabecera, carrito, confirmar pedido, mis pedidos, carrito vacío,
administración (se llega y lista los guisos), cerrar sesión, página `404.html`.

| # | Dónde | Gravedad | Hallazgo | Estado |
|---|---|---|---|---|
| V1 | T6 Carrito, escritorio | Grave | El título «Tu carrito» aparece **debajo** de la lista de guisos, y el recuadro de expiración, el total y los botones quedan sueltos a la derecha y más abajo: la retícula de la vista está mal armada | ✅ visto en pantalla · cada bloque del carrito tiene su celda escrita (fila y columna); título arriba, lista a la izquierda, expiración, total y botones a la derecha |
| V2 | T9 Administración, escritorio | Grave | Mismo defecto: el título «Administrar guisos» queda debajo del formulario «Nuevo guiso», y la lista empieza desalineada a la derecha | ✅ visto en pantalla · igual en administración: título arriba, formulario a la izquierda, lista a la derecha |
| V3 | T3 Iniciar sesión | Grave | Con contraseña equivocada el formulario se vacía (hay que volver a escribir el correo) y el error solo sale en la franja de arriba, no junto al campo | ✅ visto en pantalla · el formulario ya no se repinta al fallar: conserva lo escrito, marca el campo y dice el error debajo (contraseña en iniciar sesión, correo en crear cuenta) |
| V4 | T1 Cabecera, celular con sesión | Grave | Con sesión la cabecera mide 192 px en cuatro renglones (pedidos y admin, nombre y salir, carrito, enlaces): casi un cuarto de la pantalla | ✅ visto en pantalla · dos renglones aunque haya sesión: logotipo y carrito arriba; abajo, todos los enlaces en una fila que se desliza |
| V5 | T1 Cabecera, escritorio | Menor | El contador y la cuenta regresiva salen pegados: «Carrito (2)29:55» | ✅ visto en pantalla · el contador va en su ficha y la cuenta regresiva separada por una raya |
| V6 | T8 Mis pedidos, escritorio | Menor | Una tarjeta angosta arriba a la izquierda y el resto de la pantalla vacío | ✅ visto en pantalla · pedidos a lo ancho de su columna y, al lado, un panel para seguir comprando |
| V7 | T6 Carrito vacío, escritorio | Menor | Un renglón y un botón en una pantalla vacía | ✅ visto en pantalla · estado vacío que ocupa la vista: pictograma, mensaje y botón |
| V8 | T5 Agregar al carrito | Menor | La franja de aviso («Agregado al carrito…») tapa el título de la página mientras está visible | ✅ visto en pantalla · el aviso ya no va arriba: es una ficha fija abajo, al centro |
| V9 | T4 Crear cuenta | Menor | El mensaje de campo vacío es el del navegador y sale en inglés («Please fill out this field») | ✅ visto en pantalla · validación propia con mensajes en español debajo de cada campo (los formularios llevan `novalidate`) |
| V10 | X1 No encontrado | Menor | La página existe y se ve bien, pero el servidor que está corriendo sigue respondiendo el error crudo de Express: falta reiniciarlo para que tome la línea nueva de `server.js` | ✅ visto en pantalla · |

Sin revisar en esta vuelta: landing completa después de la cabecera nueva; tableta y
1920 px; editar y eliminar un guiso desde administración; carrito expirado; solo teclado y
movimiento reducido; la dirección pública.

## Vuelta 1 — 17-nov-2026: navegación (inventario de enlaces)

| # | Dónde | Gravedad | Hallazgo | Estado |
|---|---|---|---|---|
| N1 | T1 Tienda | Bloquea | No hay ninguna forma de volver al inicio del sitio | ✅ «Inicio» y el logotipo llevan a `/` |
| N2 | T1 Tienda | Grave | El logotipo de la tienda lleva a `#catalogo`, no al inicio | ✅ |
| N3 | Tienda, todas las vistas | Grave | La tienda no tiene pie de página | ✅ |
| N4 | T1 Tienda | Grave | Sin sesión no se ve el carrito en la cabecera | ✅ «Carrito (0)» siempre visible |
| N5 | L1 Landing | Menor | La cabecera no tiene acceso a «Entrar» ni al carrito | 🟡 falta verlo en la landing |
| N6 | L7 Landing | Menor | El pie solo trae dirección | 🟡 falta verlo en la landing |
| N7 | Sitio | Menor | No hay página de «no encontrado» | 🟡 ver V10 |

## Vueltas anteriores (ya corregidas)

| Dónde | Hallazgo | Estado |
|---|---|---|
| Todo el sitio | Los diez SVG del logotipo eran XML inválido y no se pintaban | ✅ |
| T1 Tienda | Al cargar se desplazaba y escondía la cabecera con el logotipo | ✅ |
| L3 Landing | El sello sobre la etiqueta de la bolsa era ilegible | ✅ |
| T2 Tienda | Descripción en fuente del sistema; una sola columna en celular | ✅ |
| L1 Landing | Cabecera de tres renglones en celular | ✅ |
| T3/T4 Tienda | Iniciar sesión y crear cuenta estaban en una misma vista | ✅ |
