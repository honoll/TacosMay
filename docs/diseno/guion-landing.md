# Guion de la landing — Los Tacos May · ruta 3 «La barra»

La página escena por escena, con el [sistema](sistema.md) de la ruta 3. Sustituye al guion
anterior (rótulo, madera y botones con taco), que queda en el historial de git.

**Estado: guion listo; la página NO se ha rehecho.** `frontend/index.html` sigue siendo la
versión anterior. Se reconstruye cuando el sistema esté aprobado y existan las imágenes de
[direccion-de-arte.md](direccion-de-arte.md).

## Estrategia

- **Para quién:** gente que trabaja y tiene poco tiempo para comer; primero, quien ya conoce
  la barra **[HIPÓTESIS]**.
- **Qué debe lograr:** que en cinco segundos se entienda qué es, que se antoje, que se vea
  que hay una taquería y una persona detrás, y que se llegue a la tienda.
- **La frase:** *Ya está hecho.* (candidatas: «Llegas, comes y te vas.» · «El guiso ya está.
  Tú nomás calienta.»)
- **Intensidad:** media. El sistema es de despacho: el movimiento es corto y funcional. Hay
  un solo momento más trabajado (la escena 2).
- **Recorrido:** argumental. Qué es → cómo funciona → qué hay → qué falta confirmar → quién
  está detrás → pedir.

## Mapa de escenas

| # | Escena | La persona pasa de… a… | Peso |
|---|---|---|---|
| 1 | La barra (héroe) | «¿qué es esto?» → «guisos de una taquería, ya hechos, en bolsa» | Grande, aire |
| 2 | Cómo funciona (**el momento fuerte**) | «¿y cómo se come?» → «rompo, caliento y ya» | La más trabajada |
| 3 | Las charolas, en vivo | «¿qué guisos hay?» → «quiero ese» | Densa |
| 4 | El envío, con franqueza | «¿y sí llega bien?» → «entiendo qué hay y qué falta» | Corta, papel de ticket |
| 5 | May y la taquería | «es un producto» → «es de una persona, desde hace unos 22 años» | Media |
| 6 | Cierre | convencida → en la tienda | Grande |

---

## Escena 1 — La barra

- **Se ve:** fondo crema. Logotipo horizontal arriba. Título grande «Ya está hecho.», una
  línea de apoyo («Guisos de Los Tacos May, en bolsa. Rompes, calientas y comes.»), el botón
  principal y debajo **una fila de tres charolas**: las que más salen (02 chorizo con huevo,
  08 rajas con queso y crema, 09 carne en salsa roja), cada una con su número y su color.
- **Material:** imágenes I1 de esos tres guisos; mientras llegan, el color liso de cada charola.
- **Se mueve:** las charolas entran a la barra una tras otra (180 ms, cada 40 ms) y sube el
  vapor una vez. El título no se anima.
- **Técnica:** CSS. No espera a JavaScript.
- **Celular:** logotipo, título, botón a lo ancho; las charolas en fila de dos, con la
  tercera debajo.
- **Sin movimiento:** igual, quieto.

## Escena 2 — Cómo funciona

- **Se ve:** los tres estados del producto, en tres charolas grandes y numeradas: **1 En la
  charola** (el guiso en la barra) → **2 En la bolsa** (al vacío, con su etiqueta) → **3 En
  tu taco**. Cada una con su verbo (Rompe · Calienta · Taquea) y su pictograma.
- **Material:** I1 (pieza maestra), I2 (bolsa, con la etiqueta del sistema encimada) e I3 (taco).
- **Se mueve:** la sección se ancla y el scroll pasa de un estado al siguiente: la charola
  activa se desliza al centro y las otras quedan a los lados, en reposo. Tres pasos, con un
  tramo quieto en cada uno.
- **Técnica:** `position: sticky` + una variable de avance (ya existe en la landing actual).
  Sin video ni secuencia de cuadros: son tres imágenes fijas.
- **Celular:** las tres charolas apiladas, sin anclar, cada una con su paso.
- **Sin movimiento o sin JavaScript:** las tres charolas en fila, todas a la vista.
- `PENDIENTE-CLIENTE`: cómo y cuánto se calienta; qué hacer si llega descongelado.

## Escena 3 — Las charolas, en vivo

- **Se ve:** primero «Lo que más sale» (el orden de `GET /api/guisos/populares`), con la
  primera charola más grande. Después todas, en retícula: cuatro por fila en escritorio, dos
  en celular. Cada charola: número, color o foto, nombre, porciones, existencias, precio.
  Botón principal hacia la tienda.
- **Datos:** `GET /api/guisos/populares` y `GET /api/guisos`, con el mismo `api()` de la
  tienda. El **color y el número** de cada guiso salen de la tabla del sistema, buscados por
  el nombre; un guiso que no esté en la tabla lleva charola de acero, sin color.
- **Material:** I1 de cada guiso; si no hay, el color.
- **Estados:** cargando = tres charolas chicas llenándose; error = «No pudimos leer el menú.
  Dale otra vez.» con botón; vacío = «Todavía no hay guisos en el menú.»; sin existencias =
  «Se acabó por hoy.» y la charola en acero.
- **Se mueve:** cada fila entra al llegar a pantalla.

## Escena 4 — El envío, con franqueza

- **Se ve:** un ticket de papel: lo que se sabe y lo que falta, renglón por renglón. «Va
  congelado» y por qué (el vacío no conserva solo), con sus fuentes; y «cobertura, costo y
  tiempos: todavía no publicados».
- **Se mueve:** nada.
- `PENDIENTE-CLIENTE`: confirmar que se vende congelado; cobertura, costo, tiempos, origen y
  vida útil.

## Escena 5 — May y la taquería

- **Se ve:** el logotipo principal en grande y tres datos, en letra de datos: quién es May
  (el papá de Alejandro; dicho como la familia quiera decirlo), «unos 22 años en Cabo San
  Lucas» y «entras y sales en menos de 10 minutos». El menú de la taquería como **pizarrón
  de tres plumones**, sin precios. La dirección, enlazada al mapa, con el pictograma de lugar.
- **Material:** ninguno generado. Cuando haya fotos reales del local y de la barra, entran aquí.
- **Se mueve:** nada.
- `PENDIENTE-CLIENTE`: año exacto, de dónde es la familia, horario completo, demás
  taquerías, cómo quieren contar quién es May.

## Escena 6 — Cierre

Fondo negro. «Ya está hecho.» en crema, el botón principal en su versión clara y el sello
del cactus. Pie: dirección, y los contactos como enlaces cuando existan (`PENDIENTE-CLIENTE`).

---

## Botones

Los del sistema: principal negro con la franja de colores, secundario de contorno, enlace
subrayado. Se retira el botón con el taco que se abre del guion anterior: en esta ruta lo
que responde es la franja de colores. Alto mínimo 48 px; el foco se ve con anillo azul; con
movimiento reducido no hay transición.

## Orden de carga

1. HTML, CSS, las fuentes de títulos y las tres imágenes del héroe (ya recortadas y ligeras).
2. El menú en vivo.
3. Las demás imágenes, al acercarse (carga diferida).

No hay librerías ni video.

## Lo que hace falta para rehacer la página

1. Sistema aprobado por Alejandro.
2. Las cinco imágenes mínimas de [direccion-de-arte.md](direccion-de-arte.md).
3. Pasar los datos del sistema (`frontend/marca/sistema.js`: colores de guiso y pictogramas)
   a un archivo compartido que usen la landing y, cuando toque, la tienda.
4. Corregir «nopal» por «cactus»: la landing actual todavía lo dice en comentarios, clases y
   un texto alternativo; desaparece al rehacerla.
