# Plan del segundo tiempo — estructura y movimiento, vista por vista

Qué se toma y qué no de los dos documentos de Investigación
([estructura-tiendas-comida.md](../investigacion/estructura-tiendas-comida.md) e
[interacciones-premium.md](../investigacion/interacciones-premium.md)), en orden de
ejecución. Alejandro: «todas las páginas funcionales y fáciles de usar, pero premium y con
animaciones premium».

**Reglas del tiempo:**
- Se trabaja por **vistas completas**: estructura, estados (vacío, cargando, error),
  movimiento, escritorio y celular. Una vista se termina, se sube y sigue la otra.
- **Nada de backend.** Lo que lo necesite está al final, como propuesta para coordinación.
- **Criterio de movimiento:** cada animación explica o confirma algo; respuesta en el mismo
  gesto; nada hace esperar a quien quiere comprar rápido. Si se quita y no se pierde
  información, sobra.
- **Sin dependencias.** Todo con CSS y las API del navegador. No se instala AutoAnimate,
  NumberFlow ni GSAP: lo que hacen aquí cabe en unas líneas propias.
- Cada vista deja su caso en `node frontend/tienda/app.test.mjs`.

## 0. Antes de la primera vista
Las cinco variables de tiempo y curva, en `frontend/barra.css`, para que todo use las mismas:

| Variable | Valor | Para |
|---|---|---|
| `--t-gesto` | 120 ms | Presionar, pasar, foco |
| `--t-chico` | 180 ms | Aviso, charola, renglón |
| `--t-grande` | 240 ms | Panel, vista |
| `--entra` | `cubic-bezier(.2, 0, 0, 1)` | Lo que entra: arranca rápido y frena |
| `--sale` | `cubic-bezier(.4, 0, 1, 1)` | Lo que sale |

## 1. Catálogo y tarjeta de guiso

| Qué | Se toma | Nota |
|---|---|---|
| Secciones con título **por precio**, como el pizarrón | Sí | El precio sale de la API; no hay filtros ni buscador |
| Fila «Los que más salen» arriba | Sí | Ya existe; se conserva |
| Cuatro columnas, cinco arriba de 1280 px | Sí | **Se quita la sexta columna** de 1600 px: nadie en la muestra pasa de cuatro o cinco |
| Charola con color o foto, número, nombre, porciones, precio y botón | Sí | Ya está |
| **«Agregar» se vuelve selector de cantidad** en su lugar (−, número, +) | Sí | Usa la misma llamada de hoy (`PUT /carrito/items/:id`); el número rueda al cambiar |
| Sin existencia: charola tapada, sin botón | Sí | Dice «Se acabó por hoy» |
| **Esqueleto de charolas** si la respuesta tarda más de 200 ms | Sí | En vez de una vista vacía |
| Entrada escalonada de las charolas (tope de 8) | Sí | Ya existe en la landing; se lleva al catálogo |
| Empacado corto desde la segunda vez seguida | Sí | La primera explica el producto; después, solo la bolsa volando |
| Resaltado que viaja entre charolas | No | Adorno: no dice nada que el foco y el cursor no digan ya |
| Toda la charola enlaza a su ficha | Con la vista 2 | — |

## 2. Ficha de un guiso (vista nueva)
`GET /guisos/:id` ya existe. Dirección: `/tienda/#guiso/<id>`.

- **Escritorio:** charola grande a la izquierda; a la derecha, nombre, porciones, precio,
  existencias y el mismo selector de cantidad. Debajo: cómo se calienta y cómo se conserva
  (un bloque general, igual para todos, con `PENDIENTE-CLIENTE`), y «otros guisos».
- **Celular:** una columna en ese orden, con el botón de agregar fijo abajo.
- **Movimiento:** la charola del catálogo se convierte en la de la ficha
  (`startViewTransition`, si el navegador la tiene; si no, cambia sin animar).
- **No se toma por ahora:** ingredientes, alérgenos, tabla nutrimental y foto propia por
  guiso: necesitan campos nuevos (ver propuestas).

## 3. Carrito

| Qué | Se toma | Nota |
|---|---|---|
| **Panel lateral** con `<dialog>` al tocar el carrito desde el catálogo | Sí | Lista corta, total, tiempo restante, «Seguir» y «Ver carrito». Foco, Esc y fondo los pone el navegador. **No se abre solo al agregar:** interrumpiría a quien compra varios |
| Página completa en dos columnas | Sí | Ya existe y ya tiene sus celdas |
| **Tiempo restante con umbrales** (5 min y 1 min) y reinicio visible al cambiar una cantidad | Sí | Es lo propio de esta tienda y lo que se enseña en el examen |
| Total y cantidades que ruedan | Sí | CSS propio |
| Altas y bajas de renglón animadas | Sí | Con `startViewTransition`; sin dependencia |
| El `409` de «sin existencia» en el renglón del guiso | Sí | Hoy sale como aviso general |
| Quitar con «Deshacer» | Sí | Repite la llamada anterior |
| Mínimo de compra o umbral de envío a la vista | No | No existen: no se inventan. El renglón queda reservado |
| Confirmar fijo abajo en celular | Sí | — |

## 4. Cuenta (iniciar sesión, crear cuenta, perfil)
Ya están separadas y con error junto al campo. Falta:
- **Botón con estado:** reposo → enviando → listo o error, en el mismo botón.
- **Sacudida corta** del campo con error (240 ms; con movimiento reducido, solo el mensaje).
- El requisito de la contraseña palomeado al escribir: **no**, porque el backend no pide
  ninguno y no se inventa una regla.

## 5. Mis pedidos
- El más nuevo arriba (ya viene así de la API).
- Detalle que se abre en el mismo renglón; el pedido recién hecho llega resaltado.
- Tabla en escritorio: **no**; con tres columnas de datos, la tarjeta ancha ya se lee bien.

## 6. Administración
- El renglón guardado se palomea; el guiso nuevo entra a la lista con movimiento.
- Borrar: se conserva la confirmación de hoy. «Mantener presionado» queda fuera: no
  funciona con teclado y obliga a mantener dos caminos.

## 7. Landing
- «Los que más salen» **con precio y botón** que lleva a la tienda, justo después del héroe.
- Titular por renglón y charolas escalonadas, con las variables nuevas.
- Esqueleto de charolas mientras responde la API.
- La franja de colores bajo el enlace de la sección actual.
- **Envíos y preguntas:** una vista de texto en la tienda (`#ayuda`), enlazada desde el pie,
  el carrito y la ficha. Dice lo que sí es cierto y que el envío aún no está abierto; lo
  demás es `PENDIENTE-CLIENTE`.
- No se toma: cabecera que se esconde al bajar (ya mide dos renglones), recorte que se abre
  en la taquería.

## 8. Al final, sobre todo el sitio
- **Transición entre vistas de la tienda** con `startViewTransition` (fundido de 150 ms),
  comprobando que exista.
- Entre landing y tienda, la transición entre páginas solo como mejora que no rompe nada.

## Lo que no se toma, y por qué
Buscador y filtros (son catorce guisos) · suscripción, reseñas, lista de deseos, comparador
y blog · consulta por código postal (no hay cobertura que consultar) · página de pago (no
hay pagos) · brillos, luz que sigue al cursor, degradados animados, partículas, vidrio
esmerilado, 3D, botones magnéticos, cursor propio, texto que se escribe solo, franjas que
corren, scroll secuestrado y sonido: todos están en la lista de «qué no usar» de
Investigación y chocan con la marca.

## Propuestas que necesitan backend (no se hacen; decide coordinación)

| Propuesta | Qué cambiaría | Para qué |
|---|---|---|
| Campos nuevos del guiso: `ingredientes`, `calentado`, `conservacion`, `alergenos`, `imagen` | El Hash `tm:guiso:{id}`, el alta y la edición | La ficha completa; las seis tiendas leídas llevan ingredientes y las de congelado, cómo calentar. El contenido es `PENDIENTE-CLIENTE` |
| Compra como invitado | El carrito hoy es `tm:carrito:{userId}` y todo pide token | Que la cuenta se pida al confirmar y no al agregar |
| Mínimo de compra y costo de envío | Datos nuevos y su regla | Mostrarlos en el carrito, como hacen todas |
| Recoger en la taquería como forma de entrega | Un campo en el pedido | Es lo más barato de ofrecer |
| Cajas armadas de tamaño fijo | Un tipo de producto nuevo | Llenar la hielera y justificar el envío |

## Estado
| Vista | Estado |
|---|---|
| 0 Variables | Hecho |
| 1 Catálogo y tarjeta | Hecho, sin ver en pantalla (17-nov-2026) |
| 2 Ficha de un guiso | Hecho, sin ver en pantalla (17-nov-2026) |
| 3 Carrito | Hecho, sin ver en pantalla (17-nov-2026) |
| 4 Cuenta | Hecho, sin ver en pantalla (17-nov-2026) |
| 5 Mis pedidos | Hecho, sin ver en pantalla (17-nov-2026) |
| 6 Administración | Hecho, sin ver en pantalla (17-nov-2026) |
| 7 Landing y ayuda | Hecho, sin ver en pantalla (17-nov-2026) |
