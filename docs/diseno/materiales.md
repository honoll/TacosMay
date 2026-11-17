# Pedido de materiales — landing de Los Tacos May

Para Alejandro. Todo lo que hay que producir, en orden de prioridad. Con las **cinco piezas
indispensables** (M1, M2, M4, M5 y M6b) ya se puede construir la primera versión premium; lo demás es
mejora y puede llegar después.

- **Dónde dejar todo:** `frontend/media/originales/`, con el nombre exacto que se indica.
- **No recortes, no comprimas, no pongas filtros.** Mándalo como salió; la optimización la
  hace el chat de frontend.
- A qué escena va cada pieza: [guion-landing.md](guion-landing.md). Estilo: [marca.md](marca.md).

## Decidido el 17-nov-2026: todavía no existe la bolsa empacada

Alejandro confirmó que aún no hay una bolsa de guiso al vacío de verdad. Por eso:
- **M3 no se produce.** La bolsa del héroe será ilustración rotulada, en el estilo del nopal.
- **M6 se sustituye por M6b** (tres clips ilustrados con Gemini).
- La página dirá con franqueza que el empaque está en desarrollo; no se muestra una bolsa
  inventada como si fuera el producto. Cuando exista la bolsa real, se hacen M3 y M6 y se cambian.

## La regla de honestidad

| Qué | Cómo se produce |
|---|---|
| La comida y el producto («esto es lo que te llega», «esto se sirve») | **Foto o video real**, siempre |
| El nopal, íconos, animaciones de botones, texturas, fondos | Gemini |
| Retoque de fotos reales | Gemini, **solo** luz, color y limpiar el fondo; la comida no se toca |

## Cómo tomar buenas fotos con el celular (vale para M1, M2, M3, M6 y M11)

1. **Luz:** de día, junto a una puerta o ventana, con la luz entrando **de lado**. Sin flash.
   Apaga los focos amarillos de encima si puedes. Nada de sol directo sobre el plato.
2. **Lente limpio:** pásale un trapo antes.
3. **Ángulo:** platos y cazuelas, **desde arriba** (el celular plano, paralelo a la mesa); el
   taco armado, **a 45°**; el local y el rótulo, **de frente y a la altura de los ojos**.
4. **Fondo:** su mesa, su barra o su papel de siempre, limpios. Quita servilleteros, botellas
   y cables del cuadro.
5. **Encuadre:** horizontal, con aire alrededor del sujeto (se recorta después). Toca la
   pantalla sobre la comida para enfocar.
6. **Ajustes:** cámara normal (no retrato, no gran angular 0.5x), máxima resolución, sin
   filtros, sin texto ni fecha encima.
7. **La comida:** recién servida, como se sirve en la taquería. Si echa vapor, mejor.
8. **Toma tres de cada una** y manda las tres.

---

# Indispensables

## M1 — El rótulo, de frente (foto real)
- **Para:** el logotipo y el nopal (escena 1) y los tonos exactos de la paleta.
- **Tomas:** (a) el rótulo completo, de frente, sin ángulo, que no lo tape nada; (b) un
  acercamiento al nopal; (c) un acercamiento a las letras; (d) un pedazo de tablón sin
  pintura, de cerca, para la textura de madera.
- **Formato:** JPG o HEIC, horizontal, máxima resolución.
- **Archivos:** `M1a-rotulo-frente.jpg`, `M1b-rotulo-nopal.jpg`, `M1c-rotulo-letras.jpg`,
  `M1d-tablon.jpg`.

## M2 — Los guisos (fotos reales)
- **Para:** el menú en vivo (escena 4). Mínimo **tres guisos**; lo ideal, todos los que se
  vayan a vender empacados.
- **Tomas por guiso:** (a) desde arriba, en su cazuela o en un plato; (b) a 45°, en taco, con
  lo que lleva en la taquería.
- **Formato:** horizontal 4:3, máxima resolución.
- **Archivos:** el nombre del guiso en minúsculas, sin acentos y con guiones:
  `M2-tinga-de-res-arriba.jpg`, `M2-tinga-de-res-taco.jpg`, `M2-chicharron-en-salsa-arriba.jpg`…

## M3 — La bolsa empacada (foto real, si existe)
- **Para:** el héroe (escena 1) y la imagen para compartir.
- **Tomas:** (a) la bolsa sola, desde arriba, sobre madera o sobre su barra; (b) la bolsa a
  45° con algo que dé escala (un plato, tortillas); (c) dos o tres bolsas juntas.
- **Cuida:** que no brille el plástico (gírala hasta que el reflejo se vaya), que se vea el
  guiso adentro, y que no haya etiquetas de otra marca.
- **Archivos:** `M3a-bolsa-arriba.jpg`, `M3b-bolsa-45.jpg`, `M3c-bolsas-juntas.jpg`.

## M4 — El nopal: hoja del personaje (Gemini, imagen)
- **Para:** todas las escenas. **Es la primera pieza generada**: una vez aprobada, se adjunta
  como referencia en todos los prompts siguientes para que todo salga de la misma mano.
- **Paso 1, el nopal de frente.** Adjunta `M1a` y `M1b` (o, mientras, `docs/negocio/fotos/rotulo-logo.png`) y pega:

```
Use the attached photo of a hand-painted Mexican taqueria sign as the exact character reference.
Redraw the cactus mascot from the sign as a clean character illustration: a green nopal cactus
with lighter green vertical stripes, two arms (one on each side), small red flowers at the tips
of the arms, a tilted yellow sombrero, big round white eyes with black pupils and a red smiling
mouth. Full body, front view, standing, friendly neutral pose, centered with generous margin.
Style: traditional Mexican hand-painted sign lettering art (rotulismo), flat solid colors, thick
black outline of slightly irregular width, one flat shadow tone only, visible subtle brush
texture, chunky rounded shapes. Keep the same proportions, colors and face as in the photo.
Background: perfectly flat solid magenta (#FF00FF), no gradient, no floor, no shadow on the
background. No text, no letters, no logo, no watermark, no 3D, no realistic rendering, no extra
accessories. Square image, 2048 x 2048.
```

- **Paso 2, las poses.** Adjunta el nopal aprobado del paso 1 y pega:

```
Using the attached character exactly as reference (same colors, outline, proportions and face),
create a character pose sheet with 6 separate full-body poses arranged in a 3 x 2 grid, evenly
spaced, none overlapping: (1) waving while lifting its sombrero with one arm, (2) pointing to
the right with one arm, (3) hugging a clear vacuum-sealed food pouch filled with red stew,
(4) eyes closed, happily smelling steam, (5) shivering, wearing a scarf, frost on the sombrero,
(6) embarrassed, holding its sombrero in one hand. Style: Mexican hand-painted sign art, flat
solid colors, thick slightly irregular black outline, one flat shadow tone, subtle brush
texture. Background: perfectly flat solid magenta (#FF00FF). No text, no numbers, no labels, no
watermark, no 3D. Landscape image, 3:2, at least 3000 px wide.
```

- **Se acepta si:** se reconoce como el nopal del rótulo, el contorno es negro y grueso, el
  fondo es magenta liso y no trae letras.
- **Archivos:** `M4a-nopal-frente.png`, `M4b-nopal-poses.png`. PNG, sin comprimir.
- **Por qué magenta:** el nopal es verde; un fondo verde no se podría quitar.

## M5 — El taco que se abre (Gemini, video)
- **Para:** el botón principal de toda la página (el más importante de los botones).
- **Cómo:** se pide **un video**, no cuadros sueltos; de ahí se extraen 12 cuadros. Así el
  taco es el mismo en todos. Adjunta `M4a` como referencia de estilo y pega:

```
Short 2D animation in the same hand-painted Mexican sign illustration style as the attached
reference (flat solid colors, thick slightly irregular black outline, one flat shadow tone,
subtle brush texture). Subject: a single taco seen from the front at a slight 3/4 angle,
centered, filling about 60% of the frame. Start: the corn tortilla is folded closed. Action: the
tortilla opens smoothly like a mouth, revealing saucy red stewed meat, chopped white onion and
green cilantro inside; it ends fully open and holds still for the last second. Camera
completely locked, no zoom, no pan, no camera shake. The taco stays in the same position and
keeps the same shape and colors for the whole clip. Background: perfectly flat solid blue
(#0033FF), no gradient, no table, no shadow. No text, no hands, no steam, no extra objects, no
watermark in the center. 16:9, 1080p, the shortest duration available (about 4 to 8 seconds).
```

- **Se acepta si:** la cámara no se mueve, el taco no cambia de forma ni de color, empieza
  cerrado y termina abierto y quieto.
- **Archivo:** `M5-taco-abre.mp4`.
- **Si Gemini no da video:** genera dos imágenes con el mismo prompt cambiando solo «folded
  closed» y «fully open» (`M5-taco-cerrado.png`, `M5-taco-abierto.png`); el botón alternará
  entre las dos. Se ve menos fino, pero funciona.

## M6 — Romper, calentar, taquear (video real, desde arriba)
- **Para:** la escena firma (escena 3): el video se convierte en una secuencia de cuadros que
  avanza con el scroll. **Es la pieza que más levanta la página.**
- **Preparación:** el celular fijo y plano sobre la mesa de trabajo, mirando hacia abajo
  (apoyado en una repisa, en una pila de cajas o sostenido con cinta; que no lo sostenga una
  mano). Luz de día de lado. Una superficie limpia. Una sartén oscura ya en la lumbre o en
  una parrilla portátil, dentro del cuadro. Un plato con dos tortillas calientes a un lado.
- **Una sola toma, sin cortes, tres acciones con dos segundos de pausa entre cada una:**
  1. Entra la bolsa al cuadro y unas manos la rompen o la cortan.
  2. El guiso cae a la sartén caliente y se mueve con una cuchara hasta que suelte vapor.
  3. Se sirve el guiso en una tortilla y el taco queda al centro, quieto, tres segundos.
- **Cuida:** manos limpias y sin anillos; que nada tape la cámara; que el encuadre no cambie
  entre acciones; sin música ni voces importa poco (el audio no se usa).
- **Formato:** horizontal, 1080p o 4K, 30 cuadros por segundo, 30 a 45 segundos.
- **Archivo:** `M6-modo-de-uso.mp4`. Si salen varias tomas: `M6-modo-de-uso-2.mp4`…

### M6b — Si todavía no hay bolsa real (Gemini, tres videos ilustrados)
Mismo estilo que M5, adjuntando `M4a`. Tres clips, uno por paso, con este prompt cambiando
solo la línea `Action`:

```
Short 2D animation in the same hand-painted Mexican sign illustration style as the attached
reference (flat solid colors, thick slightly irregular black outline, one flat shadow tone,
subtle brush texture). Top-down view. Action: [ACTION]. Camera completely locked, no zoom, no
pan. Objects keep the same shape and colors for the whole clip and the final second holds
still. Background: flat warm light wood tabletop color (#EAD7B0), no gradient. No text, no
faces, no watermark in the center. 16:9, 1080p, shortest duration available.
```

- `[ACTION]` 1: `two hands tear open the corner of a clear vacuum-sealed pouch filled with red stewed meat`
- `[ACTION]` 2: `red stewed meat is poured from an open pouch into a dark frying pan and starts steaming`
- `[ACTION]` 3: `a spoon serves red stewed meat onto a warm corn tortilla on a plate, then onion and cilantro are sprinkled on top`
- **Archivos:** `M6b-1-rompe.mp4`, `M6b-2-calienta.mp4`, `M6b-3-taquea.mp4`.
- En la página irán rotulados como ilustración, no como foto del producto.

---

# Mejora posterior (cuando lo anterior ya esté montado)

En todos los prompts de Gemini de esta sección, adjunta `M4a` y termina con este **bloque de
estilo**, tal cual:

```
Style: same as the attached reference: Mexican hand-painted sign art, flat solid colors, thick
slightly irregular black outline, one flat shadow tone, subtle brush texture. No text, no
letters, no watermark, no 3D, no realistic rendering.
```

| # | Pieza | Para | Tipo | Prompt (antes del bloque de estilo) o instrucción | Formato | Archivo |
|---|---|---|---|---|---|---|
| M7 | Nopal saludando | Escena 1 y cierre | Gemini, video | `Short 2D animation of the attached cactus character, full body, front view, centered. It lifts its yellow sombrero with one arm, waves once and puts the sombrero back, ending in the exact starting pose. Camera locked. Background: flat solid magenta (#FF00FF).` | 16:9, 1080p, lo más corto | `M7-nopal-saluda.mp4` |
| M8 | Nopal con frío | Escena 5 | Gemini, imagen | Si la pose 5 de M4b salió bien, no hace falta. Si no: `The attached cactus character, full body, shivering, wearing a red scarf, frost and small icicles on its sombrero. Background: flat solid magenta (#FF00FF).` | 1:1, 2048 px, PNG | `M8-nopal-frio.png` |
| M9 | Nopal apenado | Error del menú | Gemini, imagen | Igual que M8 con: `embarrassed, holding its sombrero in one hand, small shy smile.` | 1:1, 2048 px, PNG | `M9-nopal-apenado.png` |
| M10a | Bolsa que se rasga | Botón «Ver cómo se come» | Gemini, video | `Short 2D animation of a clear vacuum-sealed pouch filled with red stew, front view, centered. Its top corner tears open and peels away, then holds still. Camera locked. Background: flat solid blue (#0033FF).` | 16:9, 1080p | `M10a-bolsa-rasga.mp4` |
| M10b | Tortilla que se voltea | «Cargando» y «Volver a intentar» | Gemini, video | `Short 2D animation, top-down view of a single corn tortilla on a dark round comal. The tortilla flips over once in place and lands flat, ending like the first frame. Camera locked. Background: flat solid blue (#0033FF).` | 16:9, 1080p | `M10b-tortilla-voltea.mp4` |
| M11 | La taquería | Escena 6 | **Fotos reales** | De frente y a la altura de los ojos: la fachada con el rótulo; la plancha o las cazuelas; manos sirviendo un taco; el pizarrón del menú como esté hoy. Personas solo con su permiso | Horizontal, máxima resolución | `M11-fachada.jpg`, `M11-cazuelas.jpg`, `M11-manos.jpg`, `M11-pizarron.jpg` |
| M12 | Madera que se repite | Fondo | Gemini, imagen (solo si `M1d` no sirve) | `Seamless tileable texture of light natural pine wood planks, vertical boards, visible grain and a few knots, flat even lighting, top-down, no shadows, no objects.` (sin el bloque de estilo) | 1:1, 2048 px | `M12-madera.png` |
| M13 | El letrero como logotipo | Escena 1, cabecera | Gemini, retoque de `M1a` | Adjunta `M1a` y pide: `Recreate only the lettering "Los Tacos May" from the attached sign photo as a clean front-facing graphic, keeping the exact letter shapes, proportions, yellow and red fill colors and black outline of the original hand-painted letters. Do not redesign or change the letters. Background: flat solid magenta (#FF00FF).` Revisa que las letras sean **las del rótulo** y estén bien escritas; si las cambia, no sirve | Horizontal, 3000 px, PNG | `M13-letrero.png` |

**Imagen para compartir en redes:** no hay que producirla; se arma con el letrero, el nopal y
la foto de la bolsa cuando lleguen.

---

## Consejos para Gemini

- **Cuatro variantes por pieza;** elige una y corrige con «igual, pero…» en vez de empezar de cero.
- **Siempre adjunta la referencia** (la foto del rótulo al principio; después `M4a`).
- **Si mete letras o texto,** repite añadiendo `absolutely no text or letters anywhere`.
- **Si el fondo no sale liso,** repite añadiendo `the background must be one single flat color with no variation`.
- **Marca de agua:** si sale en una esquina, no importa mientras el sujeto esté centrado y
  con margen (se recorta).
- Los prompts van en inglés porque los generadores de imagen y video suelen obedecerlos
  mejor así; si tu Gemini responde mejor en español, tradúcelos sin cambiar el contenido.

## Resumen: qué hace falta para ver la primera versión premium

| # | Pieza | Tipo | Tiempo estimado |
|---|---|---|---|
| M1 | Rótulo de frente (4 fotos) | Foto real | 10 min en la taquería |
| M2 | Tres guisos (6 fotos) | Foto real | 20 min |
| M4 | El nopal: de frente y poses | Gemini | 30 min |
| M5 | El taco que se abre | Gemini, video | 20 min |
| M6b | Romper, calentar, taquear: tres clips ilustrados | Gemini, video | 40 min |

Los tiempos son una estimación mía, no una medición.

## Lo que sigue pendiente y no es material
Del negocio (`PENDIENTE-CLIENTE`): si el nopal tiene nombre; año de inicio e historia;
horario completo; demás taquerías; teléfono, WhatsApp, correo y redes; instrucciones de
calentado; todo lo del envío; razón social y aviso de privacidad.
