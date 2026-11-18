# Crítica de la escena de «Confirmar pedido» (18-nov-2026)

Alejandro: «hay que seguir mejorando la animación de confirmar pedido». La escena (`frontend/tienda/envio.js`)
nunca se había visto correr: el panel del navegador de las sesiones que la hicieron estaba oculto, y ahí las
animaciones no avanzan.

## Cómo se vio

**Cuadro por cuadro, no en vivo.** En un Chrome sin ventana, por su protocolo de depuración y solo ahí:

- sesión, carrito y `POST /api/pedidos` respondidos con datos de prueba (no se escribe nada en el servidor);
- un script de depuración inyectado antes de cargar la página guarda la línea de tiempo de GSAP de la escena (no
  hay nada de depuración en el código publicado);
- al tocar «Confirmar pedido» se pausa la línea y se recorre con `progress()` en 11 puntos (0 %, 10 % … 100 %),
  a 390 × 844 y a 1440 × 900, con 2 guisos; además con 1 y con 8.

Tira: `capturas/envio/antes/` (`390-000.png` … `1440-100.png`). El panel del navegador seguía oculto: no se vio
correr en vivo.

## Lo que está mal (de más a menos peso)

1. **No termina en nada.** El último cuadro (100 %) es la pantalla vacía; la escena se quita y aparece «Mis
   pedidos» con un aviso abajo. El número de pedido nunca forma parte de la escena: la historia no cierra.
2. **El primer cuadro está roto.** Al 0 % solo flotan los cuadritos de color de los compartimentos, sin bolsa: la
   bolsa es una foto (`bolsa.webp`) que no ha cargado cuando la escena empieza, y la caja todavía no aparece.
3. **La caja y el avión son clip-art.** Caja de cartón café con tapas en perspectiva y un avión de ícono
   genérico: otro dibujo que el de la marca (trazo negro de 2, acero, crema, colores por guiso). Y el avión
   promete envío aéreo, que no está definido (`docs/negocio/datos.md`: cobertura y transporte por confirmar).
4. **Las tapas no se cierran: se aplastan.** Se animan con `scaleY` a 0.12; se ven encogerse, no doblarse.
5. **La caja «entra» al avión encogiéndose** hasta desaparecer: sin física; parece que la caja se borra.
6. **Escena chica sobre el carrito fantasma.** El fondo es crema al 95 %: detrás se lee el carrito entero
   (renglones, precios, botones), y la escena ocupa un rectángulo pequeño. Ruido y poca presencia.
7. **Sin peso.** Casi todo es `power2` de entrada/salida; nada anticipa ni se asienta (la bolsa no toma impulso,
   la caja no acusa el golpe), salvo el rebote de la etiqueta.
8. **Con 8 guisos se ven 6.** La bolsa tiene seis compartimentos fijos; el resto se pierde. Con 1, un cuadrito.
9. **Duración y salida.** 2.75 s y se salta con un toque, Escape o «Saltar» (bien), pero al saltar se va
   directo a «Mis pedidos»: no hay manera de seguir comprando.

## Qué se pide de la nueva

Una coreografía continua que se entienda sin leer: **tus guisos (en sus colores) → se sella la bolsa → entra a
la caja → la caja se cierra → cinta y etiqueta con el número → la caja sale → «Pedido #N confirmado»** con «Ver
mis pedidos» y «Seguir comprando». Dibujo con el sistema (trazo negro, acero, crema, la franja de cuatro
colores). Solo `transform`/`opacity`. ≈ 3 s; saltable; con movimiento reducido, directo al final. La llamada
a la API no cambia: sale al tocar y, si falla (409), la escena se retira y sale el error.

## Qué se hizo (`0ea98af`, `d1e7343`, `cce5552`)

| Problema | Qué se hizo |
|---|---|
| No termina en nada | Termina en **«Pedido #N confirmado»**, con el total, «Ver mis pedidos» (con el foco) y «Seguir comprando»; se queda hasta que se elige. El número sale primero en la etiqueta de la caja. |
| Primer cuadro roto | Todo es SVG dibujado: no hay foto que esperar. La bolsa y la caja entran juntas. |
| Caja y avión de clip-art | Caja crema con trazo negro de 2, cinta de acero, etiqueta blanca con la franja de cuatro colores. **Sin avión**: el transporte no está definido; la caja sale de lado, con tres rayas de velocidad. |
| Tapas aplastadas | Giran sobre su bisagra (`rotation` con `svgOrigin`), una y luego la otra. |
| La caja «entra» al avión | La bolsa cae dentro de la caja **por detrás del frente** (recorte en el piso): nada aparece ni desaparece. |
| Escena chica sobre el carrito fantasma | Fondo crema entero; el dibujo y el final ocupan el mismo lugar, al centro. |
| Sin peso | La bolsa toma impulso (−6) antes de caer; la caja se aplasta 5 % al recibirla y se asienta; la caja retrocede antes de salir (`power3.in`). |
| 8 guisos → 6 | La bolsa crece con los guisos: dos columnas, hasta 8 compartimentos; con 1, uno. |
| Saltar lleva a pedidos | Saltar lleva **al final** (o a la etiqueta si el número no ha llegado, y ahí espera). Desde el final se elige. |

**Duración:** 3.15 s hasta el final (antes 2.75 s y terminaba en blanco). **Saltable:** toque, «Saltar», Escape.
**Movimiento reducido o sin GSAP:** «Confirmando tu pedido…» y directo al final en cuanto responde la API.
**La API no cambia:** la llamada sale al tocar «Confirmar pedido»; si responde 409, la escena se retira y sale
el error, como antes.

**Cómo se vio:** igual que el «antes», cuadro por cuadro con `progress()` en un Chrome sin ventana (sin
suprimir los eventos de la línea, para que el final aparezca), con 1, 2 y 8 guisos, a 390 y a 1440:
`capturas/envio/despues/` (66 cuadros). **No se vio correr en vivo**: el panel del navegador seguía oculto.

## Segunda vuelta: el avión (`52f5dba`, `807c26c`, `e0d2bcf`)

Pedido de Alejandro desde el principio: «que se meta en una caja y se suba a un avión, todo con animación
completa». La primera versión había quitado el avión; esta lo devuelve, dibujado con la marca.

- **Bolsas por guiso:** una bolsita por guiso, con su color, cae a la caja; las tres primeras una tras otra, de
  la cuarta en adelante en ráfaga (con 8 no se alarga).
- **El avión:** de carga, de perfil, con trazo negro, ala de acero y la franja de cuatro colores como librea.
  Llega rodando por la pista, se pasa un poco y se asienta; levanta la nariz; la caja toma impulso y sube a bordo
  por debajo; cierra; acelera (las marcas de la pista corren), levanta el morro y sale por arriba a la derecha
  con una estela (`stroke-dashoffset`).
- **Fondo:** el sol de Cabo y dos nubes, en trazo; se quedan atrás más despacio que el avión.
- **El final, parte de la escena:** la estela se vuelve la raya bajo «Pedido #N confirmado» (el mismo número
  que llevaba la etiqueta), el total y los dos botones.
- **Tamaño:** la escena llena: `min(94vw, 900px, alto útil × 4/3)`; en 390 caja y avión ocupan ~85 % del ancho.

**Duración:** 4.01 s con 2 guisos, 4.31 s con 8 (dentro de 3.5–4.5 s). Saltable con toque, «Saltar» y Escape
(al final completo); con movimiento reducido, directo al final; la API y el 409, sin cambios.

**Arreglado al verla:** las bolsas, ya dentro de la caja, se quedaban en la pista cuando la caja subía al avión;
la punta redonda de la estela asomaba como un punto antes de dibujarse.

**Cómo se vio:** cuadro por cuadro con `progress()` en un Chrome sin ventana, 12 puntos, con 2 y con 8 guisos,
a 390 y a 1440: `capturas/envio/despues/` (`390-…`, `1440-…`, `ocho-390-…`, `ocho-1440-…`). No se vio correr
en vivo (panel oculto).

## Tercera vuelta: el atorón en Safari de iPhone (18-nov, noche)

En iPhone la escena «se queda trabada cuando ya se cierra la caja». Coordinación ya hizo que el final no dependa de
la línea (`6ff98fd`, `76bf939`). Aquí se quitó lo frágil de lo que corre justo después de cerrar la caja:

| Antes | Ahora | Por qué |
|---|---|---|
| Orígenes en porcentaje sobre SVG (cinta `50% 0%`, aplastón de la caja `50% 100%`, etiqueta `50% 50%`) | `svgOrigin` en unidades del dibujo (`320 150`, `320 232`, `320 206`) | El porcentaje obliga a GSAP a medir con `getBBox`, lo que más varía en WebKit |
| La caja cambiaba de origen a media línea (porcentaje, luego `svgOrigin 270 232`) | Un solo origen (`320 232`) todo el tiempo; `x −143` en vez de `−132` (mismo destino) | Al cambiar de origen GSAP compensa la posición; un salto ahí sería justo «al cerrar la caja» |
| Las bolsas, en un grupo con `clip-path="url(#…)"` | Sin recorte: caen 84 en vez de 104 y quedan en el piso de la caja, tras su frente | Una referencia `url(#…)` menos en un SVG insertado por `innerHTML` |
| `tl.pause()` dentro de un `.call` en la etiqueta y `play()` desde `confirmar` | `addPause('etiqueta')`; `confirmar` hace `removePause` y, si ya estaba detenida, `play()` | Nada pausa ni reanuda la línea desde dentro de su propio render |
| Estela con `pathLength="1"` y guion de 1 | Guion medido en píxeles (`getTotalLength`) | No todos los Safari respetan `pathLength` en el guion |

**Encontrado al probar:** `removePause('etiqueta')` no encontraba la pausa porque GSAP la guarda con el tiempo
redondeado y la etiqueta valía `1.4700000000000002`: la línea se quedaba detenida en la etiqueta (en Chrome
también). La etiqueta va ahora en un tiempo redondeado a milésimas.

**Comprobado (Chrome sin ventana, `envio.js` local servido en lugar del publicado solo en ese Chrome, API
simulada):** en vivo, sin pausar nada, la línea llega sola al final con 1, 2 y 8 guisos (3.83, 4.01 y 4.31 s) a
390 y a 1440; con la API tardando 3 s, se detiene en la etiqueta con «Confirmando tu pedido…» y sigue al llegar
el número; la tira cuadro por cuadro se ve igual que antes. Pruebas de `frontend/` en verde.
**No comprobado:** Safari ni iPhone. Playwright WebKit no está instalado en esta máquina (solo Chromium) y no se
descargó. No se sabe si alguna de estas era *la* causa; si vuelve a pasar, falta verlo en un iPhone con el
inspector de Safari.
