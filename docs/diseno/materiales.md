# Pedido de materiales — landing de Los Tacos May

> **EN SUSPENSO (17-nov-2026).** Este documento se rehace cuando Alejandro elija una ruta visual
> ([plataforma.md](plataforma.md), [rutas.md](rutas.md)). Se conserva como registro; no es la
> dirección vigente. Ya se corrigió el término: el personaje es un **cactus**, no un nopal.

Para Alejandro. **Todo se produce con Gemini, desde casa**: no hacen falta fotos ni videos
reales por ahora. Con las **cinco piezas indispensables** (M4, M2, M3, M5 y M6) la página se
ve completa; lo demás es mejora y puede llegar después.

- **Dónde dejar todo:** `frontend/media/originales/`, con el nombre exacto que se indica.
- **No recortes ni comprimas.** Mándalo como salió; optimizar y montar lo hace el chat de frontend.
- La página ya tiene un hueco rotulado con el código de cada pieza (M2, M3…): al llegar el
  archivo solo se optimiza y se enchufa.
- A qué escena va cada pieza: [guion-landing.md](guion-landing.md). Estilo: [marca.md](marca.md).

## Decidido por Alejandro el 17-nov-2026

1. Todavía **no existe la bolsa empacada** real.
2. La página es **una prueba**: no se le vende a nadie todavía, así que la comida, la bolsa y
   todo lo demás se generan con IA.

Consecuencia que se conserva: cada imagen o video generado de comida, de la bolsa o del
local lleva en el código el comentario
`PENDIENTE-CLIENTE: imagen generada con IA, sustituir por foto real antes de publicar o vender`,
y F6 las lista. En la página no hay avisos visibles. Por qué importa sustituirlas antes de
vender: [landing-premium.md](../investigacion/landing-premium.md), sección 6.

## Dos estilos, y nada más

| Estilo | Para qué | Cómo se mantiene parejo |
|---|---|---|
| **Rótulo pintado** (ilustración plana, contorno negro) | El cactus, los botones, la escena del modo de uso, el letrero | Se adjunta siempre `M4a` y se pega el **bloque de rótulo** |
| **Foto de taquería** (fotorrealista) | Los guisos y la bolsa | Se pega siempre el mismo **bloque de fotografía**; solo cambia la línea del platillo |

**Bloque de rótulo** (va al final de todos los prompts ilustrados):

```
Style: same as the attached reference: Mexican hand-painted sign art (rotulismo), flat solid
colors, thick slightly irregular black outline, one flat shadow tone, subtle brush texture,
chunky rounded shapes. No text, no letters, no watermark, no 3D, no realistic rendering.
```

**Bloque de fotografía** (va al final de todos los prompts fotorrealistas):

```
Photography direction: realistic food photograph, shot directly from above (90 degree top-down),
on a light natural pine wood table with visible grain. Soft natural window light coming from
the left, gentle soft shadows falling to the right, warm neutral white balance, true-to-life
colors, no filters. 50mm lens look, everything in sharp focus. The subject is centered and
fills about 60% of the frame, with empty wood around it. No hands, no people, no cutlery, no
napkins, no garnish that is not listed, no text, no logos, no watermark. Landscape 4:3, 2K.
```

## Consejos para Gemini (valen para todo)

- **Cuatro variantes por pieza;** elige una y corrige con «igual, pero…» en vez de empezar de cero.
- **Para una serie** (los guisos): genera el primero, apruébalo y **adjúntalo como referencia**
  en los siguientes con la frase `Match the attached photo exactly in table, light, bowl, angle and framing`.
- **Si mete letras,** repite añadiendo `absolutely no text or letters anywhere`.
- **Si el fondo no sale liso,** añade `the background must be one single flat color with no variation`.
- **Video:** pide la duración más corta que te deje (3 a 5 segundos basta). Si tu Gemini
  permite dar **primer y último cuadro**, úsalo: es lo que más control da.
- La marca de agua en una esquina no importa si el sujeto está centrado y con margen.
- Los prompts van en inglés porque los generadores suelen obedecerlos mejor; si el tuyo
  responde mejor en español, tradúcelos sin cambiar el contenido.
- Guarda el archivo original tal cual lo descargaste.

---

# Indispensables

## M4 — El cactus: de frente y poses (imagen, estilo rótulo)
- **Para:** todas las escenas. **Es la primera pieza:** una vez aprobada, `M4a` se adjunta en
  todos los prompts ilustrados para que todo salga de la misma mano.
- **Paso 1, de frente.** Adjunta `docs/negocio/fotos/rotulo-logo.png` y pega:

```
Use the attached photo of a hand-painted Mexican taqueria sign as the exact character reference.
Redraw the cactus mascot from the sign as a clean character illustration: a green cactus
with lighter green vertical stripes, two arms (one on each side), small red flowers at the tips
of the arms, a tilted yellow sombrero, big round white eyes with black pupils and a red smiling
mouth. Full body, front view, standing, friendly neutral pose, centered with generous margin.
Keep the same proportions, colors and face as in the photo.
Background: perfectly flat solid magenta (#FF00FF), no gradient, no floor, no shadow.
Style: traditional Mexican hand-painted sign art (rotulismo), flat solid colors, thick slightly
irregular black outline, one flat shadow tone, subtle brush texture, chunky rounded shapes.
No text, no letters, no logo, no watermark, no 3D, no realistic rendering, no extra accessories.
Square image, 2K.
```

- **Paso 2, las poses.** Adjunta el `M4a` aprobado y pega (más el bloque de rótulo):

```
Using the attached character exactly as reference (same colors, outline, proportions and face),
create a character pose sheet with 6 separate full-body poses in a 3 x 2 grid, evenly spaced,
none overlapping: (1) waving while lifting its sombrero with one arm, (2) pointing to the right
with one arm, (3) hugging a clear vacuum-sealed food pouch filled with red stew, (4) eyes
closed, happily smelling steam, (5) shivering, wearing a red scarf, frost on the sombrero,
(6) embarrassed, holding its sombrero in one hand.
Background: perfectly flat solid magenta (#FF00FF). Landscape 3:2, 4K if available.
```

- **Se acepta si:** se reconoce como el cactus del rótulo; contorno negro grueso; fondo magenta
  liso; sin letras; las seis poses son el mismo personaje.
- **Archivos:** `M4a-cactus-frente.png`, `M4b-cactus-poses.png`.
- **Por qué magenta:** el cactus es verde; un fondo verde no se podría quitar.

## M2 — Los guisos (seis fotos, estilo foto de taquería)
- **Para:** el menú en vivo (escena 4). Los seis primeros bastan; si haces más, mejor: la
  página enchufa la foto de cualquier guiso cuyo archivo exista.
- **Prompt base** (cambia solo `[PLATILLO]` y termina con el bloque de fotografía):

```
A single small round dark brown glazed clay cazuela (Mexican clay bowl), about 18 cm wide,
filled with [PLATILLO]. Freshly served, slightly steaming, homestyle taqueria stew, generous
portion, natural and a little imperfect, not styled like fine dining. Two warm corn tortillas
partly visible at the left edge of the frame.
```

| # | Guiso | `[PLATILLO]` | Archivo |
|---|---|---|---|
| 1 | Tinga de res | `shredded beef tinga stewed in a red tomato and chipotle sauce with soft sliced onion` | `M2-tinga-de-res.png` |
| 2 | Chicharrón en salsa | `pork chicharron pieces softened and simmered in a red chile salsa` | `M2-chicharron-en-salsa.png` |
| 3 | Mole con pollo | `shredded chicken covered in dark brown mole sauce, sprinkled with a few sesame seeds` | `M2-mole-con-pollo.png` |
| 4 | Rajas con queso y crema | `roasted poblano pepper strips with sliced onion, melted white cheese and cream` | `M2-rajas-con-queso-y-crema.png` |
| 5 | Bistek con papa | `chopped beef steak with small diced potatoes in a light tomato sauce` | `M2-bistek-con-papa.png` |
| 6 | Barbacoa | `moist shredded beef barbacoa in its own dark juices` | `M2-barbacoa.png` |
| 7 | Chorizo con huevo | `scrambled eggs mixed with crumbled red chorizo` | `M2-chorizo-con-huevo.png` |
| 8 | Nopalitos | `diced cooked cactus cactus paddles with tomato, onion and cilantro` | `M2-nopalitos.png` |
| 9 | Carne en salsa roja | `chunks of beef simmered in a smooth red chile sauce` | `M2-carne-en-salsa-roja.png` |
| 10 | Salpicón | `shredded beef salpicon with chopped tomato, onion and cilantro` | `M2-salpicon.png` |

- **Ojo:** el color de cada salsa y lo que lleva cada guiso es **suposición mía** a partir del
  nombre. Si en la taquería se hace distinto, cambia la línea (por ejemplo `green tomatillo salsa`).
  No pedí «Corazón de vaca enamorada», Cabeza, Lengua ni Barbacoa de borrego: son los más
  fáciles de que salgan mal o irreconocibles.
- **Orden:** genera primero la tinga, apruébala y adjúntala en las demás (ver consejos).
- **Se acepta si:** misma mesa, misma cazuela, misma luz y mismo encuadre en toda la serie; se
  entiende qué guiso es; se ve casero y antojable, no de restaurante fino; sin manos, cubiertos
  ni letras.

## M3 — La bolsa al vacío (foto, estilo foto de taquería)
- **Para:** el héroe (escena 1) y la imagen para compartir.
- **Prompt** (adjunta `M2-tinga-de-res.png` ya aprobada y termina con el bloque de fotografía,
  cambiando su última línea por `Portrait 3:4, 2K.`):

```
Match the attached photo exactly in table and light. A single clear vacuum-sealed plastic food
pouch lying flat, tightly vacuum packed around a portion of shredded beef tinga in red sauce,
the plastic clinging to the food with fine wrinkles, heat-sealed bands at the top and bottom, a
small tear notch on one side. A light touch of frost on the plastic, as if just taken out of the
freezer. In the center of the pouch there is one completely blank, plain white rectangular
sticker label with nothing printed on it. Soft, controlled reflections on the plastic.
```

- **La etiqueta va en blanco a propósito:** el nombre lo pone la página encima, bien escrito.
- **Se acepta si:** la etiqueta es blanca, lisa y está de frente; el guiso se ve a través del
  plástico; no hay ninguna letra; la madera y la luz coinciden con las fotos de los guisos.
- **Archivo:** `M3-bolsa.png`.

## M5 — El taco que se abre (video, estilo rótulo)
- **Para:** el botón principal de toda la página.
- **Cómo:** primero dos imágenes (cerrado y abierto) y luego un video que va de una a otra.
  De ese video se extraen 12 cuadros.
- **Paso 1, taco cerrado.** Adjunta `M4a` y pega (más el bloque de rótulo):

```
A single taco seen from the front at a slight 3/4 angle, centered, filling about 60% of the
frame. The corn tortilla is folded closed, so the filling is hidden.
Background: perfectly flat solid blue (#0033FF), no gradient, no table, no shadow. Landscape 16:9, 2K.
```

- **Paso 2, taco abierto.** Adjunta el taco cerrado y pega (más el bloque de rótulo):

```
The exact same taco as the attached image, same position, same size, same colors and outline,
but now the tortilla is open like a mouth, showing saucy red stewed meat, chopped white onion
and green cilantro inside. Same flat solid blue (#0033FF) background. Landscape 16:9, 2K.
```

- **Paso 3, el video.** Da el taco cerrado como primer cuadro y el abierto como último (o, si
  no se puede, adjunta los dos) y pega:

```
Short 2D animation. The folded taco opens smoothly until it is fully open, then holds still for
the last second. Camera completely locked: no zoom, no pan, no shake. The taco stays in the same
place and keeps the same shape, colors and black outline during the whole clip. The background
stays one flat solid blue. No text, no hands, no steam, no extra objects. 16:9, shortest
duration available.
```

- **Se acepta si:** la cámara no se mueve; el taco no cambia de forma ni de color; empieza
  cerrado y termina abierto y quieto; el fondo es azul liso todo el tiempo.
- **Archivos:** `M5-taco-cerrado.png`, `M5-taco-abierto.png`, `M5-taco-abre.mp4`.
- **Si el video no sale bien:** con las dos imágenes basta; el botón alterna entre ellas.

## M6 — Romper, calentar, taquear (tres videos, estilo rótulo)
- **Para:** la escena firma (escena 3): los cuadros de estos videos avanzan con el scroll.
- **Por qué ilustrado y no fotorrealista:** en esta escena quien visita recorre el video
  cuadro por cuadro con el dedo. En video fotorrealista las manos, el plástico que se rasga y
  el guiso que cae son justo donde los generadores fallan, y aquí cada falla se ve detenida.
  El dibujo plano aguanta mejor, sale más parejo entre clips y es del mismo mundo que el cactus.
- **Prompt común** (adjunta `M4a`; cambia solo `[ACCIÓN]`; termina con el bloque de rótulo):

```
Short 2D animation, top-down view of a light wooden table. [ACCIÓN] Camera completely locked:
no zoom, no pan, no shake. Objects keep the same shape, colors and black outline during the
whole clip, and everything holds perfectly still for the last second. The background is one
flat warm light wood color (#EAD7B0) for the whole clip, with no change. No faces, no text.
16:9, 1080p, shortest duration available.
```

| Clip | `[ACCIÓN]` | Archivo |
|---|---|---|
| 1 Rompe | `A clear vacuum-sealed pouch filled with red stewed meat lies in the center. Two simple cartoon hands enter from the bottom and tear open its top corner; the corner peels away.` | `M6-1-rompe.mp4` |
| 2 Calienta | `A dark round frying pan sits in the center. Red stewed meat slides out of an open pouch held at the top edge into the pan, spreads, and soft steam starts to rise.` | `M6-2-calienta.mp4` |
| 3 Taquea | `A warm corn tortilla lies on a round plate in the center. A spoon serves red stewed meat onto the tortilla, then chopped white onion and green cilantro fall on top.` | `M6-3-taquea.mp4` |

- **Se acepta si:** vista desde arriba en los tres; cámara quieta; fondo del mismo color de
  madera; el último segundo está quieto; no hay letras. No hace falta que un clip empiece
  donde termina el anterior: la página cambia de uno a otro en el salto entre pasos.

---

# Mejora posterior (cuando lo anterior ya esté montado)

Todos son estilo rótulo: adjunta `M4a` y termina con el bloque de rótulo, salvo donde se indica.

| # | Pieza | Para | Prompt (antes del bloque) | Formato | Archivo |
|---|---|---|---|---|---|
| M1a | El letrero limpio, de frente | Logotipo en cabecera y héroe | Adjunta `docs/negocio/fotos/rotulo-logo.png`. `Recreate only the lettering "Los Tacos May" from the attached sign photo as a clean, flat, front-facing graphic. Keep the exact letter shapes, proportions, yellow and red fill colors and thick black outline of the original hand-painted letters; correct only the perspective. Do not redesign the letters. Background: flat solid magenta (#FF00FF).` **Revisa que diga «Los Tacos May» bien escrito;** si cambia las letras, no sirve y se queda la fuente | Horizontal 3:2, 4K, PNG | `M1a-letrero.png` |
| M1b | Madera que se repite | Fondo de la página | **Sin bloque de rótulo.** `Seamless tileable texture of light natural pine wood planks, vertical boards, visible grain and a few small knots, flat even lighting, top-down, no shadows, no objects, no text.` | 1:1, 2K, PNG | `M1b-madera.png` |
| M7 | Cactus saludando | Héroe y cierre | Video. `Short 2D animation of the attached cactus character, full body, front view, centered. It lifts its yellow sombrero with one arm, waves once and puts the sombrero back, ending in the exact starting pose. Camera locked. Background: flat solid magenta (#FF00FF).` | 16:9, lo más corto | `M7-cactus-saluda.mp4` |
| M8 | Cactus con frío | Escena 5 | Solo si la pose 5 de `M4b` no sirve. `The attached cactus character, full body, shivering, wearing a red scarf, frost and small icicles on its sombrero. Background: flat solid magenta (#FF00FF).` | 1:1, 2K, PNG | `M8-cactus-frio.png` |
| M9 | Cactus apenado | Error del menú | Solo si la pose 6 de `M4b` no sirve. Igual que M8 con `embarrassed, holding its sombrero in one hand, small shy smile.` | 1:1, 2K, PNG | `M9-cactus-apenado.png` |
| M10a | Bolsa que se rasga | Botón «Ver cómo se come» | Video. `Short 2D animation of a clear vacuum-sealed pouch filled with red stew, front view, centered. Its top corner tears open and peels away, then holds still. Camera locked. Background: flat solid blue (#0033FF).` | 16:9, lo más corto | `M10a-bolsa-rasga.mp4` |
| M10b | Tortilla que se voltea | «Cargando» y «Volver a intentar» | Video. `Short 2D animation, top-down view of a single corn tortilla on a dark round comal. The tortilla flips over once in place and lands flat, ending like the first frame. Camera locked. Background: flat solid blue (#0033FF).` | 16:9, lo más corto | `M10b-tortilla-voltea.mp4` |

**No se pide (decidido):**
- **La taquería (antes M11).** La escena 6 se resuelve con el pizarrón, la dirección y el
  cactus señalando. Una fachada o un interior generados pasarían por el local real, y no lo son.
- **Imagen para compartir en redes:** se arma con el letrero, el cactus y la bolsa cuando lleguen.

---

## Resumen: lo mínimo para que la página se vea completa

| Orden | Pieza | Qué es | Archivos |
|---|---|---|---|
| 1 | **M4** | El cactus, de frente y en seis poses | 2 imágenes |
| 2 | **M2** | Seis guisos en cazuela, misma mesa y misma luz | 6 imágenes |
| 3 | **M3** | La bolsa al vacío con etiqueta en blanco | 1 imagen |
| 4 | **M5** | El taco que se abre | 2 imágenes + 1 video |
| 5 | **M6** | Romper, calentar, taquear | 3 videos |

## Lo que sigue pendiente y no es material
Del negocio (`PENDIENTE-CLIENTE`): si el cactus tiene nombre; año de inicio e historia;
horario completo; demás taquerías; teléfono, WhatsApp, correo y redes; instrucciones de
calentado; todo lo del envío; razón social y aviso de privacidad. Y, antes de publicar o
vender: sustituir por fotos reales todo lo generado de comida y de la bolsa.
