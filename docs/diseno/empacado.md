# La vista de guisos en lista, la bolsa con compartimentos y el envío

Pedido de Alejandro (17-nov-2026): «la vista de guisos […] en lista […], un botón de más a su
derecha que en sí sería el agregar, este hace una animación completa y se mete a lado derecho
dentro de un empaque y se sella y si agrega otro se pone dentro de otro empaque sellado […] y luego
si completan la compra esta se meta en una caja y se suba a un avión».

Referencia: una bolsa transparente con varios compartimentos sellados por separado
(`referencias/referencia-bolsa-compartimentos.png`). Se toma **solo la idea de los
compartimentos**: ni su forma, ni su etiqueta, ni su marca.

Criterio de todo: cada paso explica algo (llenar, sellar, etiquetar, empacar, enviar), corto y
seco; agregar un guiso nunca detiene la compra.

## Decisiones

| Decisión | Por qué |
|---|---|
| **Lista a la izquierda, bolsa a la derecha** (escritorio) | El «+» de cada renglón queda en su orilla derecha: el guiso viaja el camino más corto, del botón a la bolsa. Se lee como se compra: escoges, y luego se empaca |
| La lista conserva sus secciones: **Lo que más sale** y los grupos por precio | Ya funcionan como el pizarrón; no hay por qué cambiarlas |
| Cada renglón: miniatura de su charola (color, número y foto), nombre (enlace a su ficha), precio, porciones, «quedan N» y, a la derecha, «+» | Los textos son los del inventario (`textos.md`): «quedan N», nombre accesible «Agregar <guiso>» |
| Con el guiso ya en la bolsa, el «+» se vuelve «− cantidad +» como hoy | Misma lógica y mismas llamadas |
| **La bolsa es el carrito, en resumen**, y **convive** con la vista `#carrito` | La demo del examen abre el carrito y señala su cuenta regresiva (`docs/guion-demo.md`). La bolsa trae el total, la cuenta regresiva, «Confirmar pedido» y «Ver carrito»; la vista completa sigue para cambiar cantidades, quitar y vaciar |
| **Seis compartimentos por bolsa** (dos columnas, tres filas). El séptimo guiso abre **otra bolsa** debajo, y cada una dice «Bolsa 1 de 2 · llena» | Seis se leen de un vistazo sin achicar la etiqueta. Otra bolsa es más honesto que una que crece sin forma |
| Un compartimento por **guiso distinto**; más unidades del mismo cambian su etiqueta («× 3») | Como el empaque real: un guiso por compartimento |
| Quitar un guiso (cantidad a cero) **vacía su compartimento** y los demás se recorren | La bolsa siempre dice lo que hay |
| El botón del carrito de la cabecera, en la lista: en escritorio lleva a la bolsa; en celular la abre | En la lista la bolsa ya está a la vista; el panel lateral se queda para la ficha |
| La ficha de un guiso conserva el empacado de hoy (la bolsa vuela al carrito de la cabecera) | Ahí no hay bolsa a la vista |
| «Confirmar pedido» en el rojo de la marca y el láser de sellado en rojo | Así viene en la referencia que eligió Alejandro. Es una excepción a «el rojo, solo en el logotipo» (`sistema.md`); si se queda, hay que escribirla ahí como regla |
| **Con GSAP** (vendor/gsap.min.js, 3.15.1, licencia estándar sin costo: uso comercial permitido, conservando su aviso de copyright) | Alejandro lo pidió el 17-nov-2026 al ver que las animaciones de CSS se veían mal: GSAP encadena los pasos en líneas de tiempo (nada se encima), hace el arco del vuelo y respeta el movimiento reducido. Sin GSAP, el estado cambia directo |
| **La bolsa es la imagen que eligió Alejandro** (`media/bolsa/bolsa.webp`), no dibujo de CSS | Con degradados de CSS el plástico parecía un filtro. Cada guiso va en una de las seis cámaras medidas sobre la imagen, y encima lleva el plástico de esa cámara (`camara-N.webp`, gris neutro en hard-light): las arrugas y los brillos reales caen sobre la foto. Imagen generada con IA: `PENDIENTE-CLIENTE` |
| El avión es una imagen de «va en camino», **sin texto que prometa** | Cobertura, costo y tiempos siguen por confirmar (`PENDIENTE-CLIENTE`) |

## Coreografía

### Agregar un guiso nuevo (≈ 550 ms, no detiene nada)

Rehecho el 17-nov-2026 con las referencias que eligió Alejandro (una bolsa multicámara con la foto
del guiso prensada bajo el plástico y una pastilla negra con número, nombre y cantidad).

| Paso | Empieza | Dura | Qué se ve | Qué explica |
|---|---|---|---|---|
| Toque | 0 ms | 80 ms | El «+» se hunde y suelta un anillo; la foto del renglón se hunde un instante | Se tocó; de ahí sale el guiso |
| Vuela | 0 ms | 320 ms | La foto del guiso vuela en arco, un poco ladeada, y llega del tamaño de su cámara, donde se funde | Ese guiso va a la bolsa |
| Al vacío | 320 ms | 400 ms | La foto se acomoda; la cámara se encoge un instante y rebota, y el plástico se pega | Se le saca el aire |
| Sella | 260 ms | 200 ms | Un láser rojo barre el borde de arriba de la cámara | Sellado |
| Etiqueta | 410 ms | 100 ms | Entra desde abajo la pastilla negra «09 · Carne en salsa roja × 1» | Qué es y cuántos |
| Total | 510 ms | 250 ms | El total brinca y «Confirmar pedido» hace un pulso | Cambió lo que pagas |

La llamada a la API sale al tocar «+», en paralelo con el vuelo. La cámara se llena cuando la API
confirma: si contesta antes de que aterrice el vuelo, espera al aterrizaje; si tarda más, empieza al
llegar la respuesta. Se puede seguir tocando «+» en otros renglones mientras tanto: cada vuelo y
cada cámara llevan su propia animación, y nunca hay más de tres vuelos a la vez.

### Sumar otra unidad del mismo guiso (≈ 0.75 s)

La cámara se aprieta y rebota, el láser vuelve a pasar y la cantidad rueda hacia arriba.
Vuela al compartimento de ese guiso (0.45 s); al confirmar la API, la cantidad de la etiqueta
rueda («× 2») y la banda de calor pasa otra vez (0.30 s). Tocar «+» varias veces seguidas no
encima nada: un solo vuelo por guiso a la vez, y si su compartimento todavía se está llenando,
solo cambia el número.

### Quitar (cantidad a cero) (0.25 s)
El compartimento se vacía (el guiso se desvanece y la etiqueta cae) y los que siguen se recorren.

### Si la API rechaza (sin existencia, sesión vencida)
El guiso que volaba se sacude y se desvanece (0.30 s); no se abre compartimento; sale el aviso con
el mensaje (qué pasó y qué hacer), como hoy.

### Confirmar el pedido (≈ 3.15 s, se salta con un toque, «Saltar» o Escape)

Rehecha el 18-nov-2026 (crítica y tiras de cuadros en `docs/calidad/critica-envio.md`). Una sola línea de
tiempo, todo en SVG con el sistema (trazo negro de 2, acero, crema, la franja de cuatro colores):

| Paso | Empieza | Qué se ve |
|---|---|---|
| Tus guisos | 0.00 s | La bolsa con un compartimento por guiso pedido (hasta 8), en su color, sobre la caja abierta |
| Se sella | 0.40 s | Una banda negra corre por la boca de la bolsa |
| Cae a la caja | 0.75 s | Toma impulso, cae por detrás del frente (no aparece ni desaparece nada) y la caja acusa el golpe |
| Se cierra | 1.30 s | Las tapas giran sobre su bisagra, una y otra |
| Cinta y etiqueta | 1.70 s | Pasa la cinta y se pega la etiqueta con la franja y el número del pedido |
| Sale | 2.20 s | La caja retrocede y sale; tres rayas de velocidad |
| El final | 2.80 s | «Pedido #N confirmado», el total, «Ver mis pedidos» (con el foco) y «Seguir comprando». Se queda hasta que se elige |

La llamada `POST /pedidos` sale al tocar «Confirmar pedido», en paralelo, como antes. Si la API rechaza (el
409 de existencias de la demo), la escena se retira y sale el error. Si el número todavía no llega cuando se
pega la etiqueta, la línea espera ahí. Saltar lleva al final (o a la etiqueta, si falta el número). Escape en
el final lleva a «Mis pedidos». El lector de pantalla oye «Empacando tu pedido» y luego «Pedido #N confirmado
por $…».

### Movimiento reducido
Sin vuelo y sin pasos: el compartimento aparece ya sellado y la cantidad cambia. Al confirmar, «Confirmando tu
pedido…» y, en cuanto responde la API, directo al final («Pedido #N confirmado» con sus dos salidas).

## Disposición

**La lista:** cada guiso en su tarjeta (miniatura, nombre, datos y el «+» junto a ellos), en una
columna en celular y en dos cuando caben (desde 700 px de ancho), para que el «+» no quede lejos
del guiso.

**Escritorio (≥ 900 px):** dos columnas. A la izquierda la lista; a la derecha la bolsa, fija
mientras se desplaza la lista (`position: sticky`), con su título «Tu carrito», los
compartimentos, la cuenta regresiva (reloj + «Expira en 14:59»), el total, «Confirmar pedido» y
«Ver carrito». Si hay dos bolsas y no caben, la columna se desplaza por dentro.

**Celular:** la lista ocupa la pantalla. La bolsa es una barra fija abajo (los compartimentos en
chico, el total y la cuenta regresiva) que al tocarla se despliega hasta tres cuartos de pantalla
con la bolsa completa y sus botones. El vuelo va a la barra, que no tapa la lista: la página deja
espacio abajo y el aviso sube encima de la barra.

## Los botones

Todo botón del sitio se hunde al presionarlo y rebota al soltarlo (`js/toques.js`, GSAP), también con
Enter y espacio. En la lista, la primera vez el «+» se estira hasta volverse «− 1 +», y al volver a cero el
«+» regresa con un salto. Con movimiento reducido, nada se mueve.

## Teclado y lector de pantalla
- El «+» es un botón con nombre «Agregar <guiso>»; el selector de cantidad, como hoy.
- La bolsa es una región con nombre «Tu carrito»; cada compartimento dice «<guiso>, <cantidad>».
  Los cambios se anuncian con el aviso de siempre.
- En celular, la barra es un botón con `aria-expanded` que despliega la bolsa.
- La escena de envío no atrapa: «Saltar» o Escape la terminan.

## Dibujo
Compartimentos, bolsa, caja y avión en vector, con la retícula y el trazo de los pictogramas del
sistema; las fotos son las de `frontend/media/guisos/`. Cada SVG pasa un parseo XML estricto.
