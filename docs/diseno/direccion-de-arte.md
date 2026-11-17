# Dirección de arte — Los Tacos May · ruta 3 «La barra»

Cómo se producen las imágenes para que salgan de una misma mano y no genéricas. Aplica la
sección 5 de [proceso-de-marca.md](../investigacion/proceso-de-marca.md) al
[sistema](sistema.md). **Nada de aquí se ha ejecutado:** los prompts no se han probado.

**La decisión de fondo:** esta ruta se apoya en tipografía, color y charolas. Por eso se
generan **muy pocas imágenes y ninguna ilustración**. El logotipo, el cactus, los
pictogramas, el marco de acero, el vapor y todo el movimiento se hacen en vector y en
código, donde no hay nada que salga genérico.

## 1. Antes de generar

Esto tiene que existir primero; sin ello no hay criterio para aceptar o rechazar.

| Qué | Dónde está | Estado |
|---|---|---|
| Plataforma y personalidad | [plataforma.md](plataforma.md) | Propuesta, sin aprobar |
| Sistema: paleta, encuadre, reglas de foto | [sistema.md](sistema.md), secciones 2 y 8 | Propuesta, sin aprobar |
| La lista cerrada de piezas | Sección 5 de este documento | Lista |
| La **pieza maestra** de la serie | La primera imagen aprobada de I1 (charola 09) | Por generar |

**Referencias propias que se adjuntan siempre** (si el generador las acepta; ver sección 3):
1. La **pieza maestra** aprobada: fija luz, color y nivel de detalle de toda la serie.
2. En cuanto existan, **fotos reales** de los guisos, aunque sean de celular: son lo único
   que ningún otro negocio puede subir (`PENDIENTE-CLIENTE`).

No se adjuntan referencias de otras marcas ni fotos de banco. El letrero **no** se usa como
referencia para imágenes de comida.

## 2. Restricciones fijas

Van en todos los pedidos, con el mismo texto (el **bloque fijo** de la sección 5).

- **Punto de vista:** desde arriba, a 90°. Nunca en ángulo.
- **Encuadre:** el sujeto llena el cuadro como se indica en cada pieza; sin margen decorativo.
- **Luz:** pareja, de barra, ligeramente cálida; sin sombras duras ni reflejos quemados.
- **Enfoque:** todo nítido; sin desenfoque de fondo ni viñeta.
- **Color:** natural, sin saturar; el tono dominante debe acercarse al color de la charola
  del guiso ([sistema.md](sistema.md), sección 2).
- **Estilo:** comida casera servida, un poco desordenada; no emplatado de restaurante.
- **Prohibido en la imagen:** texto, logotipos, manos, personas, cubiertos, platos
  decorados, manteles, adornos que el guiso no lleva, vapor (lo pone el código), marcos.
- **No se generan:** el logotipo, las letras, el cactus, el local, la barra con gente, personas.
- **Una variable a la vez:** mismo bloque fijo, misma referencia; cambia solo la línea del sujeto.
- **Editar antes que regenerar:** si una imagen casi está, se corrige esa.

## 3. La herramienta: generador de Antigravity (Imagen)

- Entrega **JPG de 1024 × 1024**. Por eso todas las piezas se piden **cuadradas** y el
  sistema las recorta a 4:3 dentro de la charola: lo importante va al centro.
- **Dice aceptar imágenes de referencia, pero no está probado.** Primera tarea: generar la
  pieza maestra, y con ella adjunta generar la segunda. Si la referencia no surte efecto, la
  consistencia descansa solo en el bloque fijo; en ese caso se generan más variantes por
  pieza y se elige con la hoja de contactos.
- **No hace video.** Todo el movimiento se resuelve en código (CSS; sprites armados con
  imágenes fijas solo si hiciera falta). La única pieza de video que podría valer la pena
  está en la sección 6, como opcional, para hacerla a mano en la app de Gemini.
- 1024 px alcanza para una charola (se muestra a 400–600 px). No alcanza para un fondo a
  pantalla completa: ninguna pieza se usa así.

## 4. El logotipo y el cactus: redibujo vectorial, no generación

> **Resuelto el 17-nov-2026:** el logotipo ya está dibujado en vector y elegido (4B y 4C,
> [sistema.md](sistema.md), sección 1). Ya no se calca el letrero ni hace falta su foto de
> frente. Lo que sigue en esta sección queda como registro de por qué no se generó.

**Recomendación: redibujo vectorial sobre la foto de frente del letrero.**

Por qué no generarlos: los generadores deforman letras, enderezan lo irregular y añaden lo
que nadie pidió (la prueba anterior le puso sarape y huaraches al cactus). Un logotipo
necesita vector de todos modos, y lo que hace valioso a este es justo lo que el generador
borra: el trazo desigual del rotulista.

| Paso | Quién | Cómo |
|---|---|---|
| 1. Foto de frente del letrero, de día, sin ángulo, en la mayor resolución posible | Alejandro (`PENDIENTE-CLIENTE`) | Tres tomas: completo, solo las letras, solo el cactus |
| 2. Enderezar la perspectiva si hace falta | Frontend | Recorte y corrección sobre la foto |
| 3. Calcar «May», «Los Tacos» y el cactus, pieza por pieza | Frontend, en SVG; o una persona en Inkscape | Con la foto debajo; se copian las irregularidades, no se corrigen |
| 4. Derivar el sello de una tinta del cactus calcado | Frontend | Reglas de [sistema.md](sistema.md), sección 1 |
| 5. Validar | Alejandro y su familia | Lista de abajo |

Hoy, con la única foto que hay (457 × 279 px, en ángulo y recortada), el cactus está
redibujado **por rasgos** y «May» está sustituido por una fuente. Sirve para trabajar; no es
el arte final.

**Si no se consigue la foto de frente:** se puede pedir al generador un «estudio» del
letrero visto de frente a partir de la foto actual, solo como guía para calcar, nunca como
arte final, y revisando letra por letra contra la foto original.

**Validación contra el original:**
- [ ] Encimado al 50 % sobre la foto enderezada, el calco coincide en silueta.
- [ ] Están todos los rasgos: remates cuadrados, contorno con más grosor abajo, «May» al
      doble; tronco rayado, brazo izquierdo horizontal y derecho que sube, flores en las
      puntas, sombrero ladeado, ojos juntos mirando arriba, chapas, boca abierta.
- [ ] No quedó simétrico ni «limpio».
- [ ] Se lee a 24 px (sello) y a 120 px (principal), y funciona a una tinta.
- [ ] La familia lo ve junto a la foto del letrero y dice que es el suyo.

## 5. Las piezas a generar

Bloque fijo, **el mismo en todos los prompts**, al final:

```
Photographed from directly above, perfectly top-down (90 degrees). Even, soft, slightly warm
overhead kitchen light, no hard shadows, no glare, no blown highlights. Everything in sharp
focus, no depth-of-field blur, no vignette. Natural true-to-life colors, not oversaturated,
no filters. Real homestyle Mexican taqueria food, freshly served, moist, a little messy and
imperfect, not styled like fine dining or advertising. No text, no letters, no logos, no
watermark, no hands, no people, no cutlery, no spoon, no plate decoration, no garnish that is
not listed, no steam, no border, no frame. Square image.
```

### I1 — La superficie de cada guiso (lo primero y lo indispensable)
- **Para qué:** la parte de arriba de cada charola: tienda, héroe, imagen para compartir.
- **Brief:** como si se mirara dentro de una charola llena. **El guiso llena el cuadro de
  orilla a orilla**; no se ve la charola, ni mesa, ni plato. El marco de acero lo dibuja el
  código, igual para todas. Lo importante al centro, porque se recorta a 4:3.
- **Proporción:** 1:1 (1024 × 1024).
- **Prompt** (cambia solo `[GUISO]`; después va el bloque fijo):

```
Extreme close top-down view of [GUISO], filling the entire frame from edge to edge, as if
looking straight down into a full steam-table pan of it. No pan edges, no table, no plate and
no background visible: only the food surface.
```

| Orden | Charola | `[GUISO]` | Archivo |
|---|---|---|---|
| 1 (**pieza maestra**) | 09 Carne en salsa roja | `chunks of stewed beef in a smooth brick-red chile sauce` | `I1-09-carne-en-salsa-roja.jpg` |
| 2 | 02 Chorizo con huevo | `scrambled eggs mixed with crumbled red chorizo, with orange chorizo fat` | `I1-02-chorizo-con-huevo.jpg` |
| 3 | 08 Rajas con queso y crema | `roasted poblano pepper strips with soft onion in cream and melted white cheese` | `I1-08-rajas-con-queso-y-crema.jpg` |

Con esas tres (las que más salen, según Alejandro) ya se arma el héroe. Las otras once, en
el mismo molde y adjuntando la pieza maestra:

| Charola | `[GUISO]` | Archivo |
|---|---|---|
| 01 Corazón de vaca enamorada | `PENDIENTE-CLIENTE`: no se sabe qué lleva; **no se genera** hasta saberlo | — |
| 03 Salpicón | `shredded beef salpicon with chopped tomato, onion and cilantro` | `I1-03-salpicon.jpg` |
| 04 Nopalitos | `diced cooked nopal cactus paddles with tomato and onion` | `I1-04-nopalitos.jpg` |
| 05 Mole con pollo | `shredded chicken in dark brown mole sauce with a few sesame seeds` | `I1-05-mole-con-pollo.jpg` |
| 06 Bistek con papa | `chopped beef steak with small diced potatoes in a light sauce` | `I1-06-bistek-con-papa.jpg` |
| 07 Chicharrón en salsa | `soft pork chicharron pieces simmered in chile salsa` | `I1-07-chicharron-en-salsa.jpg` |
| 10 Tinga de res | `shredded beef tinga in tomato and chipotle sauce with sliced onion` | `I1-10-tinga-de-res.jpg` |
| 11 Barbacoa | `moist shredded beef barbacoa in its own dark juices` | `I1-11-barbacoa.jpg` |
| 12 Cabeza | `tender steamed beef head meat, finely chopped, pale and juicy` | `I1-12-cabeza.jpg` |
| 13 Lengua | `tender beef tongue cut in small cubes, light brown, juicy` | `I1-13-lengua.jpg` |
| 14 Barbacoa de borrego | `shredded lamb barbacoa, dark and moist` | `I1-14-barbacoa-de-borrego.jpg` |

- **[HIPÓTESIS]:** qué lleva cada guiso y de qué color es su salsa sale del nombre, no de la
  receta de la casa (`PENDIENTE-CLIENTE`). Si en la taquería es distinto, se cambia la línea.
- **Criterio de aceptación:**
  - [ ] El guiso llena todo el cuadro; no se ve charola, plato, mesa ni orilla.
  - [ ] Vista exactamente desde arriba; todo enfocado; sin viñeta.
  - [ ] Se entiende qué guiso es sin leer el nombre.
  - [ ] Se ve casero y servido, no de anuncio; sin adornos que no se pidieron.
  - [ ] El tono dominante se acerca al color de su charola.
  - [ ] Puesta junto a la pieza maestra, parece la misma barra y la misma luz.

### I2 — La bolsa al vacío
- **Para qué:** el segundo estado del producto (lo que llega), en la escena «cómo funciona»
  de la landing.
- **Brief:** una bolsa transparente al vacío, acostada sobre acero cepillado, con el guiso
  de la pieza maestra adentro, aplastado y con el plástico pegado. Una etiqueta **blanca y
  lisa** al centro: el sistema le encima la etiqueta real. Algo de escarcha.
- **Referencia:** la pieza maestra. **Proporción:** 1:1.
- **Prompt** (después va el bloque fijo):

```
A single clear vacuum-sealed plastic food pouch lying flat on a brushed stainless steel
counter, centered and filling about 80% of the frame. Inside, tightly vacuum packed, a flat
portion of stewed beef in brick-red chile sauce; the plastic clings to the food with fine
wrinkles. Heat-sealed bands at the top and bottom. A light touch of frost on the plastic. In
the center of the pouch, one completely blank plain white rectangular sticker with nothing
printed on it. Soft controlled reflections on the plastic.
```

- **Criterio de aceptación:**
  - [ ] La etiqueta es blanca, lisa, rectangular y está de frente.
  - [ ] Se ve el guiso a través del plástico y es el mismo de la pieza maestra.
  - [ ] Ninguna letra en toda la imagen. Fondo de acero, sin otros objetos.
- **Archivo:** `I2-bolsa.jpg`.

### I3 — El taco servido
- **Para qué:** el tercer estado (el resultado), en la misma escena.
- **Brief:** un taco abierto visto desde arriba: tortilla de maíz con el guiso de la pieza
  maestra encima, sobre papel de estraza encima del acero. Sin nada más.
- **Referencia:** la pieza maestra. **Proporción:** 1:1.
- **Prompt** (después va el bloque fijo, quitándole `no garnish that is not listed`):

```
A single open soft corn tortilla seen from above, centered and filling about 75% of the frame,
topped with stewed beef in brick-red chile sauce, a little chopped white onion and cilantro.
It sits on a sheet of plain brown butcher paper on a brushed stainless steel counter. Nothing
else in the frame.
```

- **[HIPÓTESIS]:** con qué se sirve el taco en la taquería (cebolla, cilantro, salsas, papel)
  es `PENDIENTE-CLIENTE`; se ajusta cuando se sepa.
- **Criterio de aceptación:**
  - [ ] Un solo taco, desde arriba, sin plato ni adornos de más.
  - [ ] El guiso coincide con la pieza maestra.
- **Archivo:** `I3-taco.jpg`.

### Dónde se dejan y cómo se usan
- Originales, tal como salen: `frontend/media/originales/`.
- El chat de frontend los optimiza (WebP, recorte 4:3 centrado) hacia
  `frontend/media/guisos/<nombre-con-guiones>.webp` y los enchufa.
- En el código, cada una lleva
  `PENDIENTE-CLIENTE: imagen generada con IA, sustituir por foto real antes de publicar o vender`.

## 6. Opcional: una pieza de video (a mano, en la app de Gemini)

No hace falta para que la página esté completa. Si Alejandro quiere probar:

- **V1 — Vapor real.** Vapor blanco subiendo sobre fondo negro puro, cámara fija, 4 a 5
  segundos, sin objetos. Se mezcla por encima de las charolas del héroe en modo de fusión
  claro. Sustituiría al vapor dibujado. Archivo: `V1-vapor.mp4`.

No se piden videos de comida, de manos ni de la bolsa abriéndose: es donde más falla el
generador, y el sistema no los necesita.

## 7. Señales para rechazar una imagen

- Brillo plástico o de anuncio; colores más saturados que la paleta.
- Acomodo perfecto, simétrico, «de revista»; trozos idénticos repetidos.
- Detalle parejo en todo, sin que se entienda qué es lo principal.
- Adornos que nadie pidió: ramita de cilantro, rodaja de limón, chile entero, ajonjolí de más.
- Se ve la charola, un plato, la mesa, un mantel, una cuchara o una mano.
- Vista en ángulo, fondo desenfocado o viñeta.
- Cualquier letra, logotipo o marca.
- No se distingue de la charola de al lado (dos guisos que se ven iguales).
- Sirve igual para cualquier otra taquería y no se parece a comida servida de verdad.

**Hoja de contactos:** las imágenes aceptadas se ven todas juntas, chicas, dentro de sus
charolas. La que salta a la vista por luz, color o estilo, se rehace.

## 8. Resumen: lo mínimo a generar

| Orden | Pieza | Cuántas |
|---|---|---|
| 1 | **I1** pieza maestra: carne en salsa roja | 1 |
| 2 | **I1** chorizo con huevo, y rajas con queso y crema | 2 |
| 3 | **I2** la bolsa al vacío | 1 |
| 4 | **I3** el taco servido | 1 |
| Después | **I1** los otros diez guisos (el 01 espera a saber qué lleva) | 10 |

Cinco imágenes para ver la landing completa; quince para toda la tienda.
