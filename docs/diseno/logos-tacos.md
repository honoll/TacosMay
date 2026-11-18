# La idea de los tacos — Los Tacos May (17-nov-2026)

Alejandro bocetó una vuelta al logotipo vigente (4B): «¿no estaría mejor tenerlo así?, ¿no
sería más intuitivo?». Es el cactus del 4B (el cuerpo como marco, los dos brazos, las flores y
el sombrero), pero dentro del marco van **tres tacos en fila** y «MAY», en rojo, sale del marco
y queda arriba a la derecha, pegado al ala del sombrero. El boceto:
`docs/diseno/referencias/boceto-logo-tacos-alejandro.png`.

- **Verlo:** `http://localhost:5000/marca/logos-tacos.html`. Código en
  `frontend/marca/logos-tacos.js` (dibujos y página) y `logos-tacos.css`. Todavía no está
  enlazado desde `/marca/`.
- **Estado:** exploración para elegir. **Nada está aplicado** al sistema, a la landing ni a la
  tienda. El logotipo vigente sigue siendo el 4B con el 4C de sello ([sistema.md](sistema.md)).

## La idea, en corto
**Gana** en dos cosas: dice «tacos» sin leer nada, y convierte el marco del cactus en una
charola con producto, que es la ruta 3 de la marca («La barra»).
**Pierde** en tres: «May», lo único propio del nombre, queda chico y fuera; tres tacos a línea
no aguantan tamaños chicos (pestaña, sello de 24 px); y un taco mal sintetizado se lee como
rebanada, tazón u hoja. Las variantes atacan esos tres puntos.

## Cómo se dibujó el taco
Brazos, marco, sombrero y las letras de «MAY» son **la geometría exacta del 4B**
(`frontend/marca/logo/`); lo nuevo es el taco.
- **El taco:** una media luna (la tortilla doblada) **inclinada 30°**, con el relleno macizo
  asomando por la boca en tres lóbulos. El relleno va detrás: la tortilla lo tapa por abajo.
  Mismo trazo que el marco (12).
- **Lo que se probó y se descartó:**
  - **Media luna derecha** (boca horizontal): se lee como **tazón o barca**. La inclinación es
    la que dice «taco».
  - **Borde ondulado** (la boca de la tortilla dibujada como ola): se lee como **concha**.
  - **Relleno a línea** (lóbulos solo de contorno): con trazo 12 los lóbulos se cierran y quedan
    manchas sueltas. Por eso el relleno es macizo; el «a línea» del boceto es la tortilla.
  - **Más profunda que ancha:** con poco hondo parecía rebanada; ahora la tortilla es casi media
    luna completa (hondo = 0.9 del ancho).

## Las cinco variantes

| | Qué es | A favor | En contra |
|---|---|---|---|
| **T1 · La idea, bien dibujada** | El boceto: tres tacos dentro, «MAY» chico arriba a la derecha junto al ala | Dice «tacos» de inmediato; la charola con producto | «MAY» chico y fuera: en cabecera de 375 px ya no se lee. A 24 px los tacos son una franja de manchas |
| **T2 · Tacos a color** | Igual, con el relleno en colores de charola: carne en salsa roja, nopalitos, chorizo con huevo | En grande es la más apetitosa: la barra en miniatura | Tres colores más que compiten con el rojo de «MAY»; a una tinta es el T1 |
| **T3 · May abajo, grande** | Los tres tacos en el cactus arriba, «MAY» debajo a todo lo ancho | El nombre recupera el peso: se lee «MAY» y luego los tacos | Es alto: en una cabecera baja se achica mucho |
| **T4 · May dentro, con un taco** | El 4B con «MAY» corrido a la izquierda y un taco al final | El cambio más chico al logotipo elegido; «MAY» sigue grande y rojo | Un taco chico se entiende al segundo vistazo; pierde la fila, que era lo bonito del boceto |
| **T5 · Un taco grande y May al lado** | El cactus casi cuadrado con un solo taco grande; «MAY» grande a su lado | El mejor en chico: a 24 y 16 px se sigue viendo un taco con sombrero. El sello se separa solo | Ya no es una charola con varios tacos. En cuadrado el cactus se acerca a **una olla con asas**: para guisos no estorba, pero es menos cactus |

Cada una se ve en la página grande, a 24 y 48 px de alto, a una tinta en negro, en blanco sobre
oscuro, sobre el rojo de la marca, como ícono de pestaña, en la etiqueta de la bolsa y en una
cabecera a 375 px y a 1440 px; junto a ellas, el 4B y el 4C vigentes en los mismos contextos.

## Lo que vi al revisarlas
- **A 24 px y en la pestaña** se cumple el pronóstico: T1 y T2 se empastan y «MAY» no se lee.
  T3 y T4 conservan «MAY». **El sello del T5 es lo único que aún se ve como taco a 16 px**, y
  se lee mejor que el 4C, que a ese tamaño es un palito.
- **En la cabecera de 375 px** los más claros son T5 y T4 (y el 4B). T1 y T2 dejan un «MAY» de
  unos 8 px.
- **A una tinta** todos aguantan: el relleno macizo toma la tinta y la tortilla queda calada.
- **T2** es el más bonito en grande, pero es ilustración más que logotipo: sirve mejor como
  viñeta de empaque que como firma.

## Mi juicio
**Mejoran al 4B:**
- **T5**, en lo chico y en una línea: «MAY» más grande que en el 4B y un sello que sí aguanta
  la pestaña. Es el que más resuelve.
- **T3**, en lo grande: dice las dos cosas, nombre y producto, con el nombre primero.
- **T4** mejora poco: es el 4B con un taco. Es la opción segura si no se quiere mover nada más.

**No lo mejoran:** **T1** y **T2** como logotipo. La intuición de Alejandro es buena (los
tacos dicen qué vendemos sin leer), pero sacar «MAY» y achicarlo cambia lo único que es solo
nuestro por un dibujo que cualquier taquería puede tener. Como ilustración (portada, caja,
cierre) T2 sí tiene lugar.

## Recomendación: un sistema de dos piezas
1. **T3 como logotipo grande** (portada, caja, frente de la bolsa, imagen para compartir): la
   fila de tacos donde hay tamaño para verla, y «MAY» grande debajo.
2. **El sello de T5** (cactus con un taco) **para todo lo chico**: pestaña, esquina de
   etiqueta, cierre de caja. En una línea (cabecera, etiqueta) va **el sello con «MAY» al
   lado**, que es el T5 completo.

Las dos piezas comparten sombrero, brazos, flores, el taco y el rojo de «MAY»: se reconocen
como de la misma marca, como hoy el 4B y el 4C. Nunca van pegadas.

**Segunda opción, de cambio mínimo:** T4 en lugar del 4B y el sello de T5 en lugar del 4C.

Decisiones que le tocan a Alejandro: fila de tacos o un taco grande; relleno en tinta o a
color (T1 o T2); «MAY» fuera, abajo, dentro o al lado. Al elegir, hace falta un segundo pase
de dibujo viéndolo en pantalla con él (el ala del sombrero sobre el marco cuadrado, el remate
de los lóbulos) y reescribir la sección 1 de [sistema.md](sistema.md) con versiones, tamaños
mínimos y área de respeto.

## Parecidos con otras marcas
De memoria, **ninguna me recuerda el logotipo de otra taquería o empresa conocida.** Aviso: el
**pictograma de taco** (media luna con relleno) es genérico y muchísimas taquerías usan uno;
solo no distingue a nadie. Lo que hace propia a esta marca sigue siendo el cactus (brazos
desiguales, sombrero ladeado) y «MAY». Es una revisión de memoria, no una búsqueda de marcas
registradas: antes de registrar el elegido hace falta una búsqueda formal (`PENDIENTE-CLIENTE`).

## Verificación
- Cada dibujo se convirtió a imagen (PyMuPDF) y se revisó a la vista en color, a una tinta en
  negro, en blanco sobre oscuro, sobre rojo, a 24 y a 16 px, y en las cabeceras de 375 y 1440 px.
  Con eso se corrigió: tacos que rozaban el fondo del marco, tacos que parecían barcas
  (más inclinación y más hondo) y el 4B de comparación (la «horizontal» del juego 4B en
  `logos-2.js` es la pastilla rellena; se usa la principal sin «LOS TACOS», igual a
  `logo/compacta.svg`).
- Los 8 SVG (5 variantes, el sello del T5, 4B, 4C) y las 14 cabeceras de muestra pasan un
  **parseo XML estricto** (Python `xml.etree`), sin atributos repetidos ni etiquetas sin cerrar.
- `node --check` del módulo; la página armada en node: 2 821 etiquetas balanceadas, sin ids
  repetidos, anclas resueltas, sin valores vacíos, ninguna clase sin regla en
  `marca.css`, `logos.css` o `logos-tacos.css`.
- **Sin verificar:** la página en el navegador (no se abrió por instrucción). En particular,
  que no haya scroll horizontal a 375 px, cómo se ven los contextos con las fuentes reales
  (en la revisión, el menú de la cabecera salió con una fuente genérica) y que el navegador
  calcule el ancho de los SVG a 24 y 48 px desde su `viewBox`.
