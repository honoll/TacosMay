# Plan de revisión del sitio — Los Tacos May

Cómo se revisa el sitio antes de darlo por bueno: cada página, cada vista y cada función,
vistas en pantalla y probadas con datos, no solo leídas en código. Lo ejecuta coordinación;
las fallas van a [hallazgos.md](hallazgos.md) y de ahí al chat de frontend o de backend.

Sitio: `http://localhost:5000` (desarrollo) y <https://tacosmay.onrender.com> (público).

## 1. Qué se revisa (inventario)

| # | Página o vista | Dirección | Necesita sesión |
|---|---|---|---|
| L1 | Landing: cabecera y navegación | `/` | no |
| L2 | Landing: inicio (héroe) | `/` | no |
| L3 | Landing: cómo funciona | `/#como` | no |
| L4 | Landing: todas las charolas (en vivo desde Redis) | `/#guisos` | no |
| L5 | Landing: el envío | `/` | no |
| L6 | Landing: la taquería y el pizarrón | `/#taqueria` | no |
| L7 | Landing: cierre y pie | `/` | no |
| T1 | Tienda: cabecera y navegación | `/tienda/` | no / cliente / admin |
| T2 | Tienda: catálogo y populares | `/tienda/#catalogo` | no |
| T3 | Tienda: iniciar sesión | `/tienda/#…` | no |
| T4 | Tienda: crear cuenta | `/tienda/#…` | no |
| T5 | Tienda: agregar al carrito (animación de empacado) | catálogo | cliente |
| T6 | Tienda: carrito y cuenta regresiva | `/tienda/#carrito` | cliente |
| T7 | Tienda: confirmar pedido | carrito | cliente |
| T8 | Tienda: mis pedidos | `/tienda/#pedidos` | cliente |
| T9 | Tienda: administración (alta, edición, baja) | `/tienda/#admin` | admin |
| T10 | Tienda: cerrar sesión | cabecera | cliente |
| X1 | Dirección que no existe (404) | `/lo-que-sea` | no |
| X2 | Ícono de pestaña, título e imagen para compartir | todas | no |

`/marca/` es material interno de diseño: no se revisa como producto, pero no debe quedar
enlazado desde el sitio público.

## 2. En qué condiciones

| Eje | Valores |
|---|---|
| Tamaño | Celular 375 × 812 · tableta 768 × 1024 · escritorio 1440 × 900 · escritorio ancho 1920 × 1080 |
| Estado de sesión | Sin sesión · cliente · administrador |
| Estado de datos | Catálogo normal · carrito vacío · carrito con varios guisos · sin pedidos · con pedidos · guiso sin existencias |
| Estado de red | Normal · API caída o lenta · sesión vencida |
| Preferencias | Movimiento normal · movimiento reducido · solo teclado |

No se prueban todas las combinaciones: cada vista se ve en celular y en escritorio, y los
demás ejes se prueban donde cambian algo.

## 3. Qué se comprueba en cada página

**Navegación**
- [ ] Desde aquí se puede ir al inicio, a la tienda y regresar a donde se estaba.
- [ ] El logotipo lleva al inicio del sitio.
- [ ] Se sabe en qué página se está (título, enlace marcado como actual).
- [ ] Ningún enlace está roto ni lleva a un lugar inesperado; el botón «atrás» del navegador funciona.
- [ ] Hay pie de página con lo mínimo: marca, dirección, enlaces principales.

**Contenido**
- [ ] Todo el texto se lee, sin cortes ni encimados; sin texto de relleno ni datos inventados.
- [ ] Todas las imágenes y logotipos cargan y tienen su proporción.
- [ ] Los estados vacíos, de carga y de error dicen qué pasa y qué hacer.

**Composición**
- [ ] Sin scroll horizontal; nada se sale de la pantalla ni se encima.
- [ ] En escritorio se usa el ancho con sentido; en celular los botones miden al menos 44 px.
- [ ] Elementos de una misma fila tienen la misma altura y alineación.

**Función**
- [ ] Cada botón y cada formulario hace lo que dice, y avisa del resultado.
- [ ] Los errores de validación son claros y están junto al campo.
- [ ] Lo que se cambia queda guardado al recargar (persistencia en Redis).

**Accesibilidad**
- [ ] Se puede recorrer y usar solo con teclado; el foco se ve.
- [ ] Contraste suficiente; imágenes con texto alternativo; formularios con etiqueta.
- [ ] Con movimiento reducido no hay animaciones y nada queda escondido.

**Técnica**
- [ ] Sin errores en la consola ni peticiones fallidas.
- [ ] Título de pestaña e ícono correctos.

## 4. Qué se prueba de cada función

| Función | Camino normal | Casos límite |
|---|---|---|
| Ver catálogo | Aparecen los 14 guisos con precio, porciones y existencia | API caída; guiso sin foto; guiso sin existencias |
| Crear cuenta | Registro correcto, queda con sesión y regresa a donde estaba | Correo repetido; campos vacíos; contraseña corta |
| Iniciar sesión | Entra y regresa a donde estaba | Contraseña equivocada; correo inexistente |
| Agregar al carrito | Corre la animación y sube el contador | Sin sesión; más que la existencia; varias veces seguidas |
| Carrito | Cantidades, total y cuenta regresiva; cambiar cantidad renueva el tiempo | Quitar; vaciar; carrito expirado |
| Confirmar pedido | Crea el pedido, baja la existencia, vacía el carrito | Carrito vacío; sin existencias al confirmar |
| Mis pedidos | Lista con fecha, guisos y total | Sin pedidos |
| Administración | Alta, edición y baja de un guiso; se refleja en el catálogo | Campos inválidos; cliente intentando entrar |
| Cerrar sesión | Sale y se ocultan carrito, pedidos y administración | Sesión vencida a media compra |

## 5. Gravedad

| Nivel | Qué es | Ejemplo |
|---|---|---|
| **Bloquea** | Impide usar una función o deja a alguien atorado | No hay forma de volver al inicio; un botón no hace nada |
| **Grave** | Funciona, pero se ve roto o confunde | Logotipos que no cargan; texto encimado |
| **Menor** | Detalle de acabado | Alturas disparejas; un texto repetido |

Se da por bueno cuando no queda nada que bloquee ni nada grave, en celular y en escritorio.

## 6. Cómo se ejecuta

1. Inventario de enlaces y vistas (automático).
2. Recorrido en pantalla de cada vista, en celular y en escritorio, con capturas.
3. Prueba de cada función con una cuenta de prueba de cliente y una de administrador.
4. Prueba automática de la API contra Redis (el flujo de 34 comprobaciones que ya existe).
5. Registro de hallazgos con gravedad → corrección → **nueva revisión de lo corregido**.
6. Repaso final en la dirección pública.

La cuenta de prueba se crea para la revisión y se borra al terminar.
