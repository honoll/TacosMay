# Tacos a domicilio en Cabo San Lucas (versión de prueba)

Idea 1 de [docs/ideas.md](../ideas.md). Es una **versión de prueba**: no se cobra ni se envía nada, y la
página lo dice arriba. Vive en `/domicilio/` y no toca el backend ni la tienda.

Hay dos productos distintos, y la página lo dice:

| | Guiso empacado (la tienda) | Tacos a domicilio (esta prueba) |
|---|---|---|
| Qué es | Guiso al vacío: romper, calentar, comer | Tacos preparados en la barra del centro |
| A dónde | Todo México, por paquetería | Solo Cabo San Lucas |
| Cuándo | Días | El mismo día |
| Quién lleva | Paquetería | Un servicio de «solo entrega» (hoy, simulado) |

**Entradas:** el pie de todas las páginas («Tacos a domicilio») y una nota discreta bajo el pizarrón de
la landing. No está en la navegación principal.

## El flujo

1. **Tus tacos.** Los catorce nombres del pizarrón con su precio de barra ($40, $45 y $60), marcados en
   la página como «precios de ejemplo» y en el código como `PENDIENTE-CLIENTE` (la foto del pizarrón
   tiene meses). Botones − n + con tope de 20 por guiso. A un lado (abajo en celular), la cuenta:
   tacos + envío = total; el envío dice «se cotiza con tu dirección» hasta cotizar.
2. **A dónde.** Calle y número, colonia (lista de zonas de ejemplo + «Otra colonia»), referencias
   (opcional), quién recibe y teléfono de 10 dígitos. «Cotizar el envío» pide la cotización.
   - **Fuera de cobertura** («Otra colonia»): mensaje franco y enlace al guiso empacado.
   - **Cerrado:** la cocina está cerrada; solo se sabe que la barra cierra a las 4 a. m., así que no
     se escribe horario completo. Se ve el menú, no se puede seguir.
   - **Error del reparto:** «No pudimos cotizar el envío. Dale otra vez en un momento.»
3. **Confirmar.** Desglose (cada guiso, la dirección, quién recibe) y cómo se paga: «Al recibir» activo;
   «En línea» apagado con la etiqueta «por conectar».
4. **Seguimiento.** Avanza solo: recibido → preparando → repartidor asignado → en camino → entregado,
   en unos 20 segundos. Cada paso tiene su escena (palomita, la charola servida con vapor, la bolsa de
   reparto que se cierra, la moto que sale, el lugar con palomita). El repartidor es «Repartidor de
   prueba, en moto», sin nombre real ni foto. «Repetir la demostración» cancela la entrega y empieza
   de cero.

El estado se guarda en `localStorage` (`tm_domicilio`): recargar no pierde el pedido ni la entrega en
curso. Para enseñar los estados raros: `/domicilio/?demo=cerrado` y `/domicilio/?demo=falla`.

## Qué es real y qué es simulado

| Real | Simulado |
|---|---|
| Los nombres del pizarrón | Los precios (de ejemplo) |
| La dirección de la taquería | Las zonas y costos de envío (Centro $30, El Médano $40, Lomas del Sol y Arcos del Sol $50, todos de ejemplo) |
| Que la barra cierra a las 4 a. m. | El horario de apertura (no se muestra) |
| | El reparto entero: cotización, entrega, repartidor y tiempos |
| | El pago (no se cobra nada) |

## Las piezas

| Archivo | Qué hace |
|---|---|
| `frontend/domicilio/index.html` | La página: misma cabecera, pie, hojas y enrutador del sitio (`html.en-domicilio`) |
| `frontend/domicilio/domicilio.css` | Sus estilos, acotados con `:where(.en-domicilio)`; se enlaza en todas las páginas |
| `frontend/domicilio/domicilio.js` | Pinta el estado; la lista se pinta una vez y luego solo cambian números y el paso visible |
| `frontend/domicilio/flujo.js` | Los pasos sin pantalla: armar, ir, cotizar, confirmar, seguir, repetir |
| `frontend/domicilio/menu.js` | Los catorce del pizarrón y `pedidoDe(cantidades)` |
| `frontend/domicilio/reparto.js` | **La única puerta al reparto** (abajo) |
| `frontend/domicilio/reparto-simulado.js` | Su única implementación hoy |
| `frontend/domicilio/domicilio.test.mjs` | El flujo completo con un reloj de juguete |

Movimiento con GSAP (el del sitio); con movimiento reducido o sin GSAP cada estado se ve quieto y
completo.

## La interfaz `reparto.js`

| Función | Recibe | Devuelve |
|---|---|---|
| `cotizar(pedido, destino)` | `pedido = { items: [{ id, nombre, precio_centavos, cantidad }], piezas, subtotal_centavos }`; `destino = { calle, colonia, referencias, nombre, telefono }` | `{ ok: true, cotizacionId, envio_centavos, zona, vence }` o `{ ok: false, motivo }` con `motivo` = `fuera_de_cobertura` · `cerrado` · `pedido_vacio` · `error` |
| `crearEntrega(pedido, destino, cotizacionId)` | Lo mismo y la cotización | `{ entregaId, creada }` |
| `estado(entregaId)` | El id | `{ paso, indice, siguienteEn, repartidor }`; `paso` = `recibido` · `preparando` · `asignado` · `en_camino` · `entregado` · `cancelado`; `repartidor = { alias, vehiculo }` o `null` |
| `cancelar(entregaId)` | El id | `{ ok }` |
| `abierto()` | — | `true` / `false` |
| `zonas()` | — | Colonias que el formulario ofrece |

`demostrar({ cerrado, falla })` existe solo para enseñar los estados raros; un proveedor real no lo trae.

## Qué haría falta para conectarlo

Según [docs/investigacion/reparto-a-domicilio.md](../investigacion/reparto-a-domicilio.md) (17-nov-2026):

1. **Un proveedor de «solo entrega» con cuenta de negocio.** La investigación recomienda empezar con
   **Uber Direct**: es el único que publica entregas por encargo en Cabo San Lucas y tiene API con modo
   de pruebas (Robo Courier). Alta, tarifa vigente y cancelación: por confirmar con la cuenta.
2. **Rutas propias en el backend.** Las claves del proveedor no pueden vivir en el navegador.
   `reparto.js` cambiaría su import por un módulo que llame a rutas del backend (cotizar, crear,
   estado, cancelar); el backend calcula el precio de los tacos con sus datos, guarda la cotización,
   recibe los avisos del proveedor (webhook) y la página le pregunta el estado al backend.
3. **Ajustes al contrato** que la investigación encontró frente a Uber Direct:
   - nombre y teléfono de quien recibe (ya están en el formulario) y los de la taquería para recoger;
   - `tracking_url` y un id propio del pedido al crear (para no crear dos entregas al reintentar);
   - el estado `devuelto` (no se pudo entregar); `recibido` y `preparando` los pone la cocina, no el
     repartidor;
   - costo y motivo al cancelar; prueba de entrega (PIN o foto);
   - `zonas()` deja de ser regla: la cobertura la dice la cotización.
4. **Pago en línea.** Pago contra entrega con Uber Direct no aparece en su documentación, así que
   «Al recibir» probablemente no se pueda; hace falta un cobro en línea (link de pago o checkout) y
   **crear la entrega solo después de cobrar**.
5. **Cómo llega el pedido a la cocina:** impresora de comandas que consulta al servidor, o WhatsApp
   con su API; por decidir con la taquería.
6. **Datos del negocio (`PENDIENTE-CLIENTE`):** precios vigentes, horario completo, radio de entrega,
   tiempo de preparación y si ya usan alguna app de reparto.

## Lo que no se construyó

Cuentas, historial de pedidos a domicilio, mapa, ubicación del repartidor en vivo y propinas: no hacen
falta para enseñar la idea.
