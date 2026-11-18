# Tacos a domicilio en Cabo San Lucas (versión de prueba)

Idea 1 de [docs/ideas.md](../ideas.md). Es una **versión de prueba**: no se cobra ni se envía nada, y la
página lo dice arriba. Vive en `/domicilio/` y no toca el backend ni la tienda de guisos empacados.

Hay dos productos distintos, y la página lo dice:

| | Guiso empacado (la tienda) | Tacos a domicilio (esta prueba) |
|---|---|---|
| Qué es | Guiso al vacío: romper, calentar, comer | Tacos preparados en la barra |
| A dónde | Todo México, por paquetería | Solo Cabo San Lucas, o recoger en la barra |
| Cuándo | Días | El mismo día |
| Quién lleva | Paquetería | Un servicio de «solo entrega» (hoy, simulado) |

**Entradas:** el pie de todas las páginas («Tacos a domicilio») y una nota discreta bajo el pizarrón de
la landing. No está en la navegación principal.

## Flujo de referencia: Toks

Alejandro pidió copiar el **flujo** de pedido de Toks (el orden de pasos y decisiones), no su aspecto: la
marca, los textos, los íconos, las fotos y los colores son los de Los Tacos May, y no se copian importes.

**Cómo se vio (18-nov-2026):** en <https://www.toks.com.mx/> como visitante («¡Hola, Invitado!»), en el
navegador. Para pasar del mapa se buscó un lugar público (no una dirección personal) en la Ciudad de
México, porque Toks no aparece en Cabo San Lucas. Se avanzó hasta la bolsa. **No** se aceptaron términos,
no se creó cuenta, no se escribieron datos personales y no se pidió nada. Lo demás sale de sus
[términos y condiciones](https://www.toks.com.mx/terminos-y-condiciones) y se marca como tal.

| # | Paso en Toks | Qué decide el cliente | Qué datos da | Qué ve | Fuente |
|---|---|---|---|---|---|
| 1 | Portada «Ordena aquí» | Entrega a domicilio o recoger en tienda | Nada aún | Saludo de invitado, los dos botones, un campo «Escribe tu dirección» y el menú por categorías con fotos y botón «Agregar» | Visto |
| 2 | «Edita tu dirección» (se abre al tocar un platillo si no hay dirección) | El modo (se puede cambiar ahí) y la ubicación | Dirección con autocompletar de mapa; se ajusta el pin | Mapa; la dirección se guarda con estrella (favorita) y bote (borrar) | Visto |
| 3 | Sucursal | A domicilio: se asigna la cercana; recoger: se elige de la lista | Nada | Tarjetas por sucursal: nombre, distancia, dirección, abierto o cerrado, días, teléfono y «Ordenar ahora». La cabecera queda con «Entrega a domicilio · [sucursal]» | Visto (todas decían «Cerrado» a esa hora, pero dejaba seguir) |
| 4 | Menú por categorías | Qué platillo | Nada | Íconos de categoría arriba (promociones, temporada, combos, bebidas…) y tarjetas con foto, descripción, precio y «Agregar» | Visto |
| 5 | Detalle del platillo (página aparte) | Personalización, cantidad, comentarios | Opciones obligatorias («Elige 1…»), texto libre de comentarios | Foto grande, nombre, precio, descripción, grupos de opciones, «Comentarios», − 1 + y «Agregar» con el importe | Visto |
| 6 | Bolsa («Tu orden») | Cambiar cantidad, editar, eliminar, agregar otro; artículos adicionales | Nada | Renglones con − n +, «Editar» y «Eliminar»; «Detalles de entrega» con «Editar»; adicionales (cubiertos); invitación a registrarse; resumen: subtotal, envío, cuota de servicio, total; casilla de términos y «Ir a pagar» (apagado hasta aceptar) | Visto. Aquí se detuvo la visita |
| 7 | Cuenta o invitado | Registrarse, entrar o seguir como invitado | Invitado: nombre, teléfono y correo. Cuenta: verificación por correo | Panel «Registrarme / Iniciar sesión». Como invitado no hay historial ni beneficios | Términos §«Acceso como invitado»; el panel se vio |
| 8 | Recompensas | Código promocional o beneficio del programa de lealtad (uno por pedido) | El código | — | Términos §2.3.1. No se vio |
| 9 | Confirmación final | Revisar y confirmar | — | Contacto, sucursal, detalles de entrega, **tipo de horario (inmediata o programada)**, **gratificación voluntaria (propina)**, puntos, descuentos, método de pago, resumen y total | Términos §2.5. No se vio |
| 10 | Pago | Forma de pago | Tarjeta (crédito o débito), PayPal o puntos | Pago en línea; no se menciona efectivo ni pago al recibir | Términos §2.6. No se vio |
| 11 | Número de orden | — | — | Número de orden para seguimiento y aclaraciones | Términos. No se vio |
| 12 | Seguimiento | — | — | A domicilio: SMS con enlace de seguimiento y hora estimada. Recoger: SMS con avisos y hora para recoger. Preparación estimada: 15 minutos desde el pago | Términos. No se vio |
| 13 | Cancelar | — | — | Antes de pagar se puede cancelar o corregir; **una vez aceptado el pedido no se cancela** | Términos |
| 14 | Fuera de zona | — | — | Si la dirección está fuera de la zona de entrega, puede pedir para recoger en el restaurante que elija | Términos |

**Lo que no se pudo ver sin cuenta o sin aceptar términos:** la pantalla de contacto de invitado, la de
propina, el horario programado, la de pago, la confirmación con número, el seguimiento y el historial.
Lo que se dice de ellos sale de los términos, no de verlos. Tampoco se vio qué pasa cuando la sucursal
está cerrada al pagar (la visita fue de noche: todas decían «Cerrado» y aun así dejó llegar a la bolsa).

## Toks frente al prototipo

| Paso de Toks | En el prototipo | Estado |
|---|---|---|
| 1. Domicilio o recoger | «¿Cómo quieres tus tacos?»: a domicilio o recoger en la barra | Existe |
| 2. Dirección con mapa y pin | Calle y número, colonia (lista de ejemplo + otra) y referencias; «Ver si llegamos» cotiza | Existe, **sin mapa**: el mapa necesita un servicio con clave (por conectar) |
| 2. Direcciones favoritas | La última dirección se recuerda en este navegador | Parcial: sin lista de favoritas (necesita cuenta) |
| 3. Sucursal asignada o elegida | A domicilio la asigna la cotización; para recoger se elige de la lista | Existe, con **una barra**: las demás taquerías son `PENDIENTE-CLIENTE` y la lista está preparada para ellas |
| 3. Distancia, horario y teléfono de la sucursal | Dirección real y enlace al mapa; «cierra a las 4 a. m.; apertura por confirmar» | Parcial: sin distancia (no hay mapa) ni teléfono (`PENDIENTE-CLIENTE`) |
| 4. Menú por categorías | Menú por secciones del pizarrón (por precio) con saltos a cada sección | Existe |
| 5. Detalle con opciones obligatorias | Detalle del taco con el lugar para «Salsas y complementos: por confirmar» | Lugar listo; **qué lleva cada taco es `PENDIENTE-CLIENTE`**, no se inventa |
| 5. Comentarios | «Nota para la cocina» (140 caracteres) | Existe |
| 5. Cantidad y «Agregar» con importe | − n + y «Agregar · $» (o «Guardar» si ya estaba) | Existe |
| 6. Bolsa editable | «Tu orden»: − n +, Editar (abre el detalle), Quitar, «Agregar otro taco» | Existe |
| 6. Detalles de entrega con «Editar» | «Entrega» con «Cambiar» | Existe |
| 6. Artículos adicionales (cubiertos) | — | No aplica por ahora: qué ofrece la barra es `PENDIENTE-CLIENTE` |
| 6. Invitación a registrarse | — | No aplica: la prueba no da beneficios por cuenta |
| 6. Resumen: subtotal, envío, cuota de servicio, total | Tacos, envío, **cuota de servicio «por definir»** (sin importe), propina y total | Existe |
| 6. Aceptar términos | — | Falta: la taquería no tiene términos ni aviso de privacidad (`PENDIENTE-CLIENTE`) |
| 7. Cuenta o invitado | Invitado (nombre, teléfono, correo opcional) o, si ya entró en la tienda, «Pides con tu cuenta» con su nombre | Existe (solo lee la sesión de la tienda) |
| 8. Código promocional o lealtad | — | No aplica: no hay promociones ni programa |
| 9. Inmediata o programada | «Lo antes posible» y «Programar una hora: por conectar» | Existe; programar necesita el horario real |
| 9. Propina | Sin propina, 10, 15 o 20 % del subtotal | Existe |
| 10. Pago | «Al recibir» (o «al recoger») activo; «En línea: por conectar» | Existe. Ojo: Toks solo cobra en línea, y la investigación no encontró pago contra entrega en Uber Direct |
| 11. Número de orden | «Pedido TM-12345» | Existe |
| 12. Seguimiento con hora estimada | Estados, escenas, «Llega cerca de las …» (hora de prueba), repartidor de prueba; recoger: recibido → preparando → listo → «Ya lo recogí» | Existe; el SMS y el enlace del proveedor, por conectar |
| 12. Contacto | «En un pedido real llamarías a la barra; su teléfono está por confirmar» | Lugar listo; teléfono `PENDIENTE-CLIENTE` |
| 13. Cancelar | Se puede mientras la cocina no empieza; después se dice por qué no | Existe (más flexible que Toks; decisión de la taquería) |
| 14. Fuera de zona → recoger | Mensaje franco con «Mejor paso a la barra» y enlace al guiso empacado | Existe |
| Historial (con cuenta) | «Tus pedidos de prueba» en este navegador, con «Pedir lo mismo» | Existe (local; el real necesita cuenta y backend) |

## El flujo como quedó

1. **Cómo lo quieres.** A domicilio: dirección y «Ver si llegamos» (cotiza el envío y dice qué barra lo
   prepara). Recoger: la barra del centro con su dirección real. Fuera de cobertura, cerrado o error: lo
   dice con franqueza y ofrece recoger o el guiso empacado.
2. **Menú.** Los catorce nombres del pizarrón en tres secciones (tacos de $40, $45 y $60, **precios de
   ejemplo**). «Agregar» abre el **detalle del taco**: cantidad, nota para la cocina y el lugar para
   salsas y complementos «por confirmar».
3. **Tu orden.** Renglones editables, cómo se entrega (con «Cambiar») y propina.
4. **Pagar.** Tus datos (invitado o cuenta de la tienda), para cuándo (lo antes posible; programar,
   por conectar), cómo pagas («al recibir»; en línea, por conectar) y la revisión con el desglose. Si la
   cotización venció se vuelve a pedir; si el envío cambió, se avisa antes de pedir.
5. **Confirmación y seguimiento.** Número de pedido, escena por paso, hora estimada de prueba, línea de
   pasos, repartidor de prueba, contacto, cancelar (solo al principio) y «Hacer otro pedido».

La cuenta (tacos + envío + cuota «por definir» + propina = total) va a un lado en escritorio y como barra
fija abajo en celular, en el menú y en «Tu orden». «Tus pedidos de prueba» abre el historial, con
«Pedir lo mismo» y «Borrar todo y empezar de cero».

El estado se guarda en `localStorage` (`tm_domicilio` y `tm_domicilio_pedidos`): recargar no pierde nada.
Para enseñar los estados raros: `/domicilio/?demo=cerrado` y `/domicilio/?demo=falla`.

## Qué es real y qué es simulado

| Real | Simulado o por confirmar |
|---|---|
| Los nombres del pizarrón | Los precios (de ejemplo) |
| La barra del centro y su dirección | Las demás taquerías (`PENDIENTE-CLIENTE`) |
| Que la barra cierra a las 4 a. m. | El horario de apertura (no se muestra) y si está abierta |
| | Las zonas y costos de envío (Centro $30, El Médano $40, Lomas del Sol y Arcos del Sol $50, de ejemplo) |
| | El reparto entero: cotización, entrega, repartidor, tiempos y hora estimada |
| | El pago, la cuota de servicio y los complementos de cada taco |

## Las piezas

| Archivo | Qué hace |
|---|---|
| `frontend/domicilio/index.html` | La página: misma cabecera, pie, hojas y enrutador del sitio (`html.en-domicilio`); vistas, detalle e historial |
| `frontend/domicilio/domicilio.css` | Sus estilos, acotados con `:where(.en-domicilio)`; se enlaza en todas las páginas |
| `frontend/domicilio/domicilio.js` | Pinta el estado; menú, barras y pasos se pintan una vez |
| `frontend/domicilio/flujo.js` | El flujo sin pantalla: modo, cotizar, sucursal, poner/cambiar/quitar, propina, confirmar, seguir, recogido, cancelar, nuevo, repetir, reiniciar |
| `frontend/domicilio/menu.js` | Los catorce del pizarrón, sus secciones y `pedidoDe(cantidades, notas)` |
| `frontend/domicilio/sucursales.js` | Las barras (hoy una), si está abierta y los pasos de recoger |
| `frontend/domicilio/reparto.js` | **La única puerta al reparto** (abajo) |
| `frontend/domicilio/reparto-simulado.js` | Su única implementación hoy |
| `frontend/domicilio/domicilio.test.mjs` | El flujo completo con un reloj de juguete |

Movimiento con GSAP (el del sitio); con movimiento reducido o sin GSAP cada estado se ve quieto y completo.

## La interfaz `reparto.js` y la operación real (Uber Direct)

Ajustada a lo que la investigación ([reparto-a-domicilio.md §5](../investigacion/reparto-a-domicilio.md))
dice que ofrece Uber Direct. Con el proveedor real, cada función llamaría a una ruta propia del backend,
que es quien guarda las claves y habla con el proveedor.

| Función | Recibe | Devuelve | Operación real |
|---|---|---|---|
| `cotizar(destino)` | `{ calle, colonia, referencias }` | `{ ok, cotizacionId, envio_centavos, vence, minutos }` o `{ ok: false, motivo: fuera_de_cobertura · error }` | `POST /v1/customers/{id}/delivery_quotes` (recogida = la barra, entrega = el cliente). `dqt_…` → `cotizacionId`; el costo → `envio_centavos`; la vigencia → `vence`. La cobertura la dice esta respuesta, no una lista de colonias |
| `crearEntrega({ pedidoId, cotizacion, destino, contacto, items })` | El número de pedido, la cotización vigente, el destino, nombre y teléfono de quien recibe y los renglones | `{ ok, entregaId, creada, seguimiento }` o `{ ok: false, motivo: cotizacion_vencida · sin_cotizacion · datos_incompletos }` | `POST /v1/customers/{id}/deliveries` con `quote_id`, recogida y entrega (dirección, nombre, teléfono) y `manifest_items`. `id` → `entregaId`; `tracking_url` → `seguimiento`. El mismo `pedidoId` devuelve la misma entrega (no se crean dos al reintentar). Se crea **solo después de cobrar** |
| `estado(entregaId)` | El id | `{ paso, indice, llega, repartidor }` | Lo que el backend guardó de los avisos del proveedor (webhook `event.delivery_status` y `event.courier_update`): `pending` → asignado, `pickup`/`pickup_complete` → en camino, `delivered` → entregado, `canceled` → cancelado, `returned` → devuelto. «Recibido» y «preparando» los pone la cocina |
| `cancelar(entregaId)` | El id | `{ ok, costo_centavos }` o `{ ok: false, motivo: ya_recogido }` | Cancelar la entrega en el proveedor (ruta exacta y si cobra: por confirmar con la cuenta). El prototipo deja cancelar solo antes de que la cocina empiece |
| `zonas()` | — | Colonias | Solo sugerencia del formulario |

## Qué haría falta para conectarlo

1. **Proveedor de «solo entrega» con cuenta de negocio** (la investigación recomienda Uber Direct, que
   publica entregas por encargo en Cabo San Lucas y tiene modo de pruebas).
2. **Rutas propias en el backend** para cotizar, crear, consultar y cancelar, el **webhook** de estados y
   el precio de los tacos calculado con sus datos (no con lo que diga el navegador).
3. **Pago en línea** (link de pago o checkout) y crear la entrega solo con el pago confirmado. «Al
   recibir» probablemente no se pueda con Uber Direct.
4. **Cómo llega el pedido a la cocina:** impresora de comandas o WhatsApp; por decidir con la taquería.
5. **Avisos al cliente:** SMS o WhatsApp con número de pedido, enlace de seguimiento y hora estimada.
6. **Datos del negocio (`PENDIENTE-CLIENTE`):** precios vigentes, horario completo, las demás barras,
   teléfono de la barra, salsas y complementos de cada taco, si habrá cuota de servicio, radio de
   entrega, tiempo de preparación, términos y aviso de privacidad.

## Lo que no se construyó

Mapa con pin, direcciones favoritas, cuentas propias del domicilio, promociones, programa de lealtad y
artículos adicionales: necesitan servicios o datos que no hay, o no aplican a la barra.
