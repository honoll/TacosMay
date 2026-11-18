# «Confirmar pedido» en celular (18-nov-2026)

Alejandro, desde el iPhone: «le doy a carrito y no puedo llegar a confirmar pedido». Coordinación encontró la
causa (la bolsa desplegada era `display: grid` sin filas definidas: la fila del cuerpo crecía con la bolsa, el
desplazamiento nunca se activaba y el pie quedaba bajo la pantalla) y la corrigió en `3aee59c`
(`grid-template-rows: auto minmax(0, 1fr)`). Con eso ya se podía llegar bajando por toda la bolsa; en `0392dd3`
el total y «Confirmar pedido» quedan **fijos al pie** del panel desplegado, sobre el área segura.

## Cómo se midió

`herramientas/medir-carrito.mjs`: Chrome sin ventana, celular emulado (táctil, ×2), movimiento reducido, sesión y
carrito simulados solo en ese Chrome. Por cada caso: ¿el botón cabe sin desplazar? y, llevado a la vista, ¿el
punto central es el botón (nada lo tapa)? Capturas: `capturas/carrito-celular/` (`<camino>-<tamaño>-<guisos>.png`).

## Resultado

| Camino | 390 × 844 (1 · 3 · 8 guisos) | 375 × 667 (1 · 3 · 8 guisos) |
|---|---|---|
| **Bolsa desplegada** (lista de guisos → barra de abajo) | Antes: fuera de pantalla en los tres (el botón terminaba en 858, 858 y 1361 px); se alcanzaba bajando. **Ahora: a la vista y tocable en los tres** (termina en 765 px) | Antes: fuera (799, 799 y 1294 px). **Ahora: a la vista y tocable** (588, 588 y 575 px) |
| **Vista `#carrito`** (botón de la cabecera) | Ya estaba bien: la barra de confirmar va pegada abajo (610 a 782 px). Ahora también respeta el área segura | Ya estaba bien (605 px) |
| **Panel desde la ficha** (`.panel`, 100dvh) | No tiene «Confirmar pedido»: tiene «Ver carrito», a la vista y tocable (824 px), que lleva a `#carrito` | Igual (647 a 649 px) |

## Para que no vuelva

`frontend/tienda/bolsa.test.mjs` comprueba las reglas que lo garantizan: las filas del panel, la columna con
`min-height: 0`, las bolsas que se desplazan, el pie con `flex: none` y `env(safe-area-inset-bottom)`, y la barra
pegada de `#carrito`. Para medirlo de verdad, `node docs/calidad/herramientas/medir-carrito.mjs <carpeta>`.

**No comprobado:** en un iPhone de verdad (el área segura de Safari solo se ve ahí; la página no usa
`viewport-fit=cover`, así que Safari ya deja el contenido fuera de su barra y el `env()` vale 0 o lo que Safari
reserve).
