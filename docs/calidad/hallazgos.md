# Hallazgos de la revisión

Registro de lo encontrado al ejecutar [plan-de-revision.md](plan-de-revision.md). Estado:
🔴 abierto · 🟡 corregido, falta volver a verlo · ✅ corregido y visto.

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
| V1 | T6 Carrito, escritorio | Grave | El título «Tu carrito» aparece **debajo** de la lista de guisos, y el recuadro de expiración, el total y los botones quedan sueltos a la derecha y más abajo: la retícula de la vista está mal armada | 🔴 |
| V2 | T9 Administración, escritorio | Grave | Mismo defecto: el título «Administrar guisos» queda debajo del formulario «Nuevo guiso», y la lista empieza desalineada a la derecha | 🔴 |
| V3 | T3 Iniciar sesión | Grave | Con contraseña equivocada el formulario se vacía (hay que volver a escribir el correo) y el error solo sale en la franja de arriba, no junto al campo | 🔴 |
| V4 | T1 Cabecera, celular con sesión | Grave | Con sesión la cabecera mide 192 px en cuatro renglones (pedidos y admin, nombre y salir, carrito, enlaces): casi un cuarto de la pantalla | 🔴 |
| V5 | T1 Cabecera, escritorio | Menor | El contador y la cuenta regresiva salen pegados: «Carrito (2)29:55» | 🔴 |
| V6 | T8 Mis pedidos, escritorio | Menor | Una tarjeta angosta arriba a la izquierda y el resto de la pantalla vacío | 🔴 |
| V7 | T6 Carrito vacío, escritorio | Menor | Un renglón y un botón en una pantalla vacía | 🔴 |
| V8 | T5 Agregar al carrito | Menor | La franja de aviso («Agregado al carrito…») tapa el título de la página mientras está visible | 🔴 |
| V9 | T4 Crear cuenta | Menor | El mensaje de campo vacío es el del navegador y sale en inglés («Please fill out this field») | 🔴 |
| V10 | X1 No encontrado | Menor | La página existe y se ve bien, pero el servidor que está corriendo sigue respondiendo el error crudo de Express: falta reiniciarlo para que tome la línea nueva de `server.js` | 🟡 |

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
