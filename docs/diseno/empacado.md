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
| **Seis compartimentos por bolsa** (dos columnas, tres filas). El séptimo guiso abre **otra bolsa** debajo | Seis se leen de un vistazo sin achicar la etiqueta. Otra bolsa es más honesto que una que crece sin forma |
| Un compartimento por **guiso distinto**; más unidades del mismo cambian su etiqueta («× 3») | Como el empaque real: un guiso por compartimento |
| Quitar un guiso (cantidad a cero) **vacía su compartimento** y los demás se recorren | La bolsa siempre dice lo que hay |
| El botón del carrito de la cabecera, en la lista: en escritorio lleva a la bolsa; en celular la abre | En la lista la bolsa ya está a la vista; el panel lateral se queda para la ficha |
| La ficha de un guiso conserva el empacado de hoy (la bolsa vuela al carrito de la cabecera) | Ahí no hay bolsa a la vista |
| **Sin GSAP**: CSS para los pasos y la API de animaciones del navegador para el vuelo | Ninguno de los pasos pide más; una dependencia sería peso sin razón |
| El avión es una imagen de «va en camino», **sin texto que prometa** | Cobertura, costo y tiempos siguen por confirmar (`PENDIENTE-CLIENTE`) |

## Coreografía

### Agregar un guiso nuevo (≈ 1.2 s, no detiene nada)

| Paso | Empieza | Dura | Qué se ve | Qué explica |
|---|---|---|---|---|
| Vuela | 0.00 s | 0.45 s | La miniatura de la charola sale del renglón y vuela al siguiente compartimento libre | Ese guiso va a la bolsa |
| Cae | 0.45 s | 0.20 s | El guiso (su color y su foto) cae en el compartimento | Se llena |
| Vacío | 0.65 s | 0.20 s | El compartimento se encoge un poco y el plástico se pega | Al vacío |
| Sella | 0.85 s | 0.20 s | Pasa la barra de calor y queda la banda sellada | Sellado |
| Etiqueta | 1.05 s | 0.15 s | Cae la etiqueta con el número de charola, el nombre y «× 1» | Qué es y cuántos |

La llamada a la API sale al tocar «+», en paralelo con el vuelo. El compartimento se llena cuando
la API confirma: si contesta antes de que aterrice el vuelo, espera al aterrizaje; si tarda más,
empieza al llegar la respuesta. Se puede seguir tocando «+» en otros renglones mientras tanto:
cada vuelo y cada compartimento llevan su propia animación, y nunca hay más de tres vuelos a la
vez (del cuarto en adelante, sin vuelo).

### Sumar otra unidad del mismo guiso (≈ 0.75 s)
Vuela al compartimento de ese guiso (0.45 s); al confirmar la API, la cantidad de la etiqueta
rueda («× 2») y la banda de calor pasa otra vez (0.30 s).

### Quitar (cantidad a cero) (0.25 s)
El compartimento se vacía (el guiso se desvanece y la etiqueta cae) y los que siguen se recorren.

### Si la API rechaza (sin existencia, sesión vencida)
El guiso que volaba se sacude y se desvanece (0.30 s); no se abre compartimento; sale el aviso con
el mensaje (qué pasó y qué hacer), como hoy.

### Confirmar el pedido (≈ 2.4 s, se salta con un toque o con Escape)

| Paso | Empieza | Dura | Qué se ve |
|---|---|---|---|
| Entra la caja | 0.00 s | 0.25 s | Una caja abierta aparece en el centro de la pantalla |
| La bolsa entra | 0.25 s | 0.40 s | La bolsa sellada, con los colores de sus compartimentos, baja y entra en la caja |
| Se cierra | 0.65 s | 0.30 s | Las dos tapas se doblan |
| Cinta y etiqueta | 0.95 s | 0.30 s | Pasa la cinta y se pega la etiqueta con el sello de la marca |
| Al avión | 1.25 s | 0.40 s | La caja se encoge hacia el avión, que llega desde la izquierda |
| Despega | 1.65 s | 0.75 s | El avión sube en diagonal y sale de la pantalla |

La llamada `POST /pedidos` sale al tocar «Confirmar pedido», en paralelo. Si la API rechaza (el
409 de existencias de la demo), la escena se retira y sale el error. Al terminar (o al saltarla)
se llega a «Mis pedidos» con el pedido recién hecho resaltado, como hoy. Un botón visible
«Saltar» recibe el foco; el lector de pantalla oye «Empacando tu pedido» y luego el aviso de
confirmación.

### Movimiento reducido
Sin vuelo, sin pasos y sin escena de envío: el compartimento aparece ya sellado, la cantidad
cambia y, al confirmar, se llega directo a «Mis pedidos».

## Disposición

**Escritorio (≥ 900 px):** dos columnas. A la izquierda la lista; a la derecha la bolsa, fija
mientras se desplaza la lista (`position: sticky`), con su título «Tu carrito», los
compartimentos, la cuenta regresiva (reloj + «Expira en 14:59»), el total, «Confirmar pedido» y
«Ver carrito». Si hay dos bolsas y no caben, la columna se desplaza por dentro.

**Celular:** la lista ocupa la pantalla. La bolsa es una barra fija abajo (los compartimentos en
chico, el total y la cuenta regresiva) que al tocarla se despliega hasta tres cuartos de pantalla
con la bolsa completa y sus botones. El vuelo va a la barra, que no tapa la lista: la página deja
espacio abajo y el aviso sube encima de la barra.

## Teclado y lector de pantalla
- El «+» es un botón con nombre «Agregar <guiso>»; el selector de cantidad, como hoy.
- La bolsa es una región con nombre «Tu carrito»; cada compartimento dice «<guiso>, <cantidad>».
  Los cambios se anuncian con el aviso de siempre.
- En celular, la barra es un botón con `aria-expanded` que despliega la bolsa.
- La escena de envío no atrapa: «Saltar» o Escape la terminan.

## Dibujo
Compartimentos, bolsa, caja y avión en vector, con la retícula y el trazo de los pictogramas del
sistema; las fotos son las de `frontend/media/guisos/`. Cada SVG pasa un parseo XML estricto.
