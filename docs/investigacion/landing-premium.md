# Landing premium para Los Tacos May: cómo lo hacen los profesionales

Fecha de consulta de todas las fuentes: **17 de noviembre de 2026**. Complementa a
[referencias-marca.md](referencias-marca.md); no lo repite.

Cómo leerlo:

- **[HECHO]** = lo dice la fuente enlazada. **[JUICIO]** = interpretación o recomendación mía.
- Límite: se leyeron artículos, casos publicados y documentación; **nadie vio los sitios
  renderizados**. Lo que digo de «cómo se siente» un sitio viene de lo que su estudio o la
  prensa describen, no de haberlo navegado.
- Nada de los sitios citados se copia: sirven para entender decisiones y técnicas.

**La idea central, por si solo se lee esto:** en todos los casos documentados lo premium
no sale de la página. Sale de una marca decidida antes (una idea, un personaje, una voz,
fotos propias) que la página solo pone en movimiento. Rehacer la landing sin esos insumos
vuelve a dar una página «correcta».

---

## 1. Quién lo hace bien y cómo

### Casos con técnica o decisiones documentadas

| Caso | Quién | Qué lo hace sentirse premium | Técnica o decisión concreta |
|---|---|---|---|
| [La Revoltosa](https://www.awwwards.com/la-revoltosa-rebooting-a-70-year-old-spanish-soda-brand-for-the-scroll-generation.html), refresco español de 1953 (jul. 2026) | waka, Madrid. Equipo acreditado: dirección creativa, web, video y movimiento, ilustración | [HECHO] La marca «se presenta sola» en primera persona, por capítulos; cada sabor tiene su paleta y su mundo ilustrado; el logotipo de los años 70 se recuperó y redibujó; fotografía propia, sin modelos | [HECHO] Botella 3D en WebGL (Three.js) con el titular dentro de la escena; animación SVG ligada al scroll encima de un video en bucle; GSAP y Lenis; carga progresiva en móvil |
| [Graza](https://eyeondesign.aiga.org/how-to-build-an-entire-brand-identity-around-a-squeeze-bottle/), aceite de oliva empacado (2022) | Gander, Nueva York | [HECHO] Toda la identidad sale de un objeto: la botella que se aprieta. Ilustración suelta, a mano, que personifica el producto | [HECHO] Se descartaron etiquetas solo con logotipo o solo tipográficas por no ser juguetonas. [JUICIO] El empaque es el héroe; la web lo hereda |
| [Omsom](https://www.weareoutline.com/case-studies/omsom), sazonadores empacados (2020) | Outline | [HECHO] Un concepto (fuerzas que chocan) llevado a todo: logotipo repetido y deformado, caja tipo cerillera gigante | [HECHO] Un solo estudio hizo estrategia, nombre, identidad, textos, empaque, dirección de arte y web; la foto de comida la hizo una fotógrafa de alimentos acreditada |
| [Fly By Jing](https://www.barrelny.com/dtc-patterns-articles/how-fly-by-jing-blends-two-cultures-together-through-food-and-flavor), salsas empacadas | Análisis de Barrel | [HECHO] La página de producto continúa el empaque: mismos colores, mismo patrón, animación; fotos de uso e historia de ingredientes junto al producto | [JUICIO] Regla útil: el patrón del empaque es el fondo de la web |
| [Fishwife](https://www.packagetheworld.com/blog/fishwife-tinned-fish-packaging-case-study), conservas | Ilustrador contratado antes de tener nombre | [HECHO] Un color saturado por producto, repetido en lata, caja, fondos de la web y redes | Fuente débil: el propio sitio la marca «en revisión» y es de un proveedor de empaque |

### Dónde mirar más (no analizados)

[HECHO] La categoría [Food & Drink de Awwwards](https://www.awwwards.com/websites/food-drink/)
listaba como recientes: Agrumea Farm (Studio K95, Sitio del Día, 5-nov-2026), Santioni
Spirits (Active Theory, Sitio del Mes, oct-2026), FIX Dessert Chocolatier, Theobroma e
Impasto Forno Antico (menciones). No leí sus técnicas; el chat de Frontend debería abrir
dos o tres antes de diseñar.

### México

[HECHO] Los casos mexicanos con decisiones publicadas son de identidad, no de web:
Taquería Gabriel (Panamá Studio), El Califa (Esrawe Studio), Tacos Norteados (Inter
Estudio) y Xolos (Nube Amarilla); van en la sección 5. **No encontré** un sitio de comida
mexicano premiado con su caso técnico publicado. Entre los negocios mexicanos de comida
empacada revisados en [mercado.md](mercado.md), ninguno documenta su diseño.

### Lo que se repite [JUICIO]

1. **Una idea, no un estilo.** Botella que se aprieta, fuerzas que chocan, una marca que
   habla en primera persona.
2. **El producto físico manda** y la web lo continúa (color, patrón, ilustración).
3. **Fotografía propia.** Ningún caso usa foto de banco.
4. **Un solo recurso espectacular**, no diez: La Revoltosa tiene una botella 3D y todo lo
   demás la acompaña.
5. **Voz propia** en los textos.

---

## 2. El proceso, paso a paso

Lo que las fuentes sí dicen:

- [HECHO] Red Antler: el proceso siempre empieza por estrategia; el primer gran entregable
  es un primer pase de identidad con logotipo, tipografías, paleta y mensajes
  ([TechCrunch](https://techcrunch.com/2019/04/09/verified-expert-brand-designer-red-antler/)).
- [HECHO] Koto separa su trabajo en Estrategia, Marca (identidad visual, identidad en
  movimiento, dirección de arte, ilustración, tipografía) y Digital (experiencia,
  interfaz, prototipado, movimiento, sistema de diseño)
  ([servicios](https://koto.com/services)).
- [HECHO] El Doble Diamante del Design Council ordena cualquier proyecto en Descubrir,
  Definir, Desarrollar y Entregar
  ([fuente](https://www.designcouncil.org.uk/our-resources/the-double-diamond/)).
- [HECHO] En Omsom el alcance fue estrategia → nombre → identidad → textos → empaque →
  dirección de arte → web; en La Revoltosa trabajaron por separado dirección, web,
  movimiento e ilustración (enlaces en la sección 1).
- Ninguna fuente publica una lista de entregables por fase. **La tabla siguiente es
  síntesis mía** a partir de lo anterior.

### Metodología propuesta [JUICIO]

| # | Paso | Pregunta que cierra | Entregable | Quién |
|---|---|---|---|---|
| 1 | **Posicionamiento** | ¿Para quién es y por qué esta taquería y no otra? | Una frase de posicionamiento, tres razones para creerla, lo que la marca nunca diría | Coordinación + Alejandro |
| 2 | **Idea rectora** | ¿Cuál es la única idea de la que sale todo? | Una frase y un objeto. Candidatas: el nopal del rótulo como anfitrión; el pizarrón del menú como interfaz | Coordinación |
| 3 | **Sistema de identidad** | ¿Cómo se reconoce sin leer el nombre? | Logotipo redibujado del rótulo real, mascota en 4–6 poses, paleta con valores exactos, dos tipografías, un patrón, reglas de uso en una página | Alejandro (dibujo, IA con el rótulo como referencia) |
| 4 | **Voz** | ¿Cómo habla? | 10 frases modelo: titular, botones, estados vacíos, error, despedida | Coordinación |
| 5 | **Dirección de arte** | ¿Cómo se fotografía y se ilustra? | Tablero de referencia; lista de tomas; reglas de luz, fondo, ángulo y encuadre | Coordinación |
| 6 | **Guion de la página** | ¿Qué se cuenta y en qué orden? | Guion por pantallas, con el texto real, antes de diseñar. Cada sección: qué debe sentir y qué debe hacer el visitante | Coordinación + Frontend |
| 7 | **Producción** | ¿Existe el material? | Fotos reales, clips de video, ilustraciones, sprites, texturas, ya exportados al peso final | Alejandro |
| 8 | **Prototipo de movimiento** | ¿Cómo se mueve antes de construir todo? | Una sola sección (el héroe) funcionando con el material real, en celular | Frontend |
| 9 | **Construcción** | — | La página completa, sin build | Frontend |
| 10 | **Pulido** | ¿Aguanta celular, teclado, movimiento reducido y red lenta? | Lista de revisión pasada: rendimiento, accesibilidad, estados de cada botón, textos | Frontend |

Reglas de orden [JUICIO]:

- **Los pasos 1 a 6 no necesitan código.** Si el paso 7 no está, el 9 se hace con huecos
  marcados, no con relleno.
- **Un paso no empieza sin el entregable del anterior.** La landing actual se saltó del 3
  al 9; por eso se ve correcta y no distinta.
- Lo que hoy bloquea es el paso 7: no hay fotos propias de los guisos ni del local, ni una
  foto de frente del rótulo ([datos.md](../negocio/datos.md)).

---

## 3. Recursos visuales más allá del SVG simple

Los pesos recomendados son **[JUICIO]**; los datos técnicos llevan fuente. Para una página
sin build, cada biblioteca se baja una vez a `frontend/` y se carga con `<script>`; así
no se depende de un servidor ajeno.

| Recurso | Cuándo conviene | Formato y peso objetivo | Cómo entra sin build | Riesgos |
|---|---|---|---|---|
| **Fotografía de producto y de proceso** | Siempre. Es lo que más separa premium de correcto | AVIF con respaldo WebP o JPEG en `<picture>`; héroe ≤ 200 KB, el resto ≤ 100 KB; `width` y `height` declarados | `<picture>` + `loading="lazy"` salvo el héroe | [HECHO] La imagen del héroe suele ser el elemento que mide el LCP; lo «bueno» es 2.5 s o menos ([web.dev](https://web.dev/articles/lcp)). [HECHO] AVIF pesa bastante menos que JPEG y WebP ([web.dev](https://web.dev/learn/images/avif)) |
| **Video en bucle** (vapor, salsa cayendo, comal) | Para dar vida al héroe o a una sección; 3 a 6 s | MP4 (H.264) + WebM, sin audio, 720p, ≤ 1.5 MB; siempre con `poster` | `<video autoplay loop muted playsinline poster>` | [HECHO] Esos cuatro atributos son los que emulan un GIF; `playsinline` hace falta en iOS ([web.dev](https://web.dev/articles/replace-gifs-with-videos), [carga diferida](https://web.dev/articles/lazy-loading-video)). [HECHO] Lo que se mueve solo más de 5 s necesita forma de pausarse (WCAG 2.2.2, [W3C](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)) |
| **Secuencia de imágenes controlada por scroll** (la bolsa que se abre, el taco que se arma) | Un solo momento estelar | 40–60 cuadros WebP de ~25 KB; total ≤ 1.5 MB; versión de celular con menos cuadros | `<canvas>` + `drawImage` según el avance del scroll | [HECHO] El ejemplo de referencia usa 148 cuadros y su página pesa 55.8 MB; el propio artículo recomienda imagen fija en redes lentas ([CSS-Tricks](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/)) |
| **Animación ligada al scroll con CSS** (`animation-timeline`) | Revelados, parallax suave, barras de progreso; sin JavaScript | Cero peso | CSS puro, dentro de `@supports (animation-timeline: view())` | [HECHO] MDN la marca disponible en todos los navegadores actuales desde octubre de 2026 ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline)); es reciente, por eso el `@supports` |
| **Sprite cuadro por cuadro** con `steps()` | Íconos y botones chicos que «actúan» | Una tira WebP de 12–24 cuadros, ≤ 60 KB | `background-position` + `steps()` | [HECHO] La tira puede volverse muy pesada y no resuelve bien pantallas de alta densidad; a cambio es CSS puro y no bloquea ([Lean Rada](https://leanrada.com/notes/css-sprite-sheets/)) |
| **Lottie** | Ilustración vectorial animada hecha en After Effects | Reproductor dotLottie ~35 KB (dato del fabricante); `lottie-web` 75 KB comprimido | `<script>` + un `<canvas>` | [HECHO] Tamaños: [Bundlephobia](https://bundlephobia.com/package/lottie-web), [LottieFiles](https://docs.lottiefiles.com/en/runtimes). [JUICIO] Necesita a alguien que anime en After Effects; hoy no lo hay |
| **Rive** | Botón o mascota con estados: reposo, cursor encima, presionado | Reproductor `@rive-app/canvas` 86 KB comprimido; hay variante `canvas-lite` más chica | `<script>` que expone `rive`; `new rive.Rive({ src, canvas, stateMachine })` | [HECHO] Los estados y el hover se dibujan en el editor de Rive, no en código ([documentación](https://rive.app/docs/runtimes/web/web-js), [tamaño](https://bundlephobia.com/package/@rive-app/canvas)). [JUICIO] Es la mejor opción para una mascota interactiva, pero exige aprender el editor |
| **Texturas e ilustración pintada a mano** (madera del rótulo, papel, gis del pizarrón) | Para que el fondo no sea plano | Textura en mosaico, WebP ≤ 40 KB; ilustraciones PNG/WebP con transparencia | `background-image`; `mix-blend-mode: multiply` para que tome el color | [JUICIO] Texto encima de textura pierde contraste: poner una capa de color debajo del texto |
| **Tipografía variable** | Titulares que engordan o se estiran al entrar o con el cursor | Un archivo WOFF2 | `@font-face` + animar `font-variation-settings` | [HECHO] Un archivo contiene todo el rango de pesos y anchos ([web.dev](https://web.dev/articles/variable-fonts)). [JUICIO] Rammetto One, la fuente actual, no es variable; exige cambiarla |
| **WebGL ligero** (deformación de fotos, objeto 3D) | Solo si es **el** recurso estelar | OGL 33 KB comprimido; Three.js 181 KB | OGL con `<script type="module">` | [HECHO] Tamaños: [OGL](https://bundlephobia.com/package/ogl), [Three.js](https://bundlephobia.com/package/three). [JUICIO] Para este proyecto no: el costo es alto y la bolsa de guiso no gana nada en 3D frente a una buena secuencia |
| **GSAP + ScrollTrigger** | Secciones ancladas y animación ligada al scroll con control fino | 27 KB comprimido más el plugin | `<script>` | [HECHO] Anclar (`pin`) y ligar al scroll (`scrub`) ([documentación](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)); gratis también para uso comercial desde abril de 2025 ([licencia](https://gsap.com/licensing/)) |

Obligatorio en todos [HECHO]: respetar `prefers-reduced-motion`. Para algunas personas el
movimiento provoca mareo y náusea; parallax y animación por scroll son disparadores
nombrados, y con esa preferencia activa se recomienda no reproducir video solo
([web.dev](https://web.dev/articles/prefers-reduced-motion)).

Presupuesto de la página [JUICIO]: primera pantalla ≤ 500 KB, página completa ≤ 3 MB, y
**un** recurso pesado (la secuencia o el video del héroe), no ambos.

---

## 4. Microinteracciones y botones animados

### Ejemplos reales y cómo están hechos

- **El corazón de Twitter.** [HECHO] Una tira de 55 cuadros en una sola fila; al pasar el
  cursor se recorre con `transition: background 1s steps(55)`
  ([CSS Animation Rocks](https://cssanimation.rocks/twitter-fave/), 2015). Es la receta
  exacta para «un taco que se abre».
- **Tira con `steps()` moderna.** [HECHO] 29 cuadros de 100 px, tira de 2900 px,
  `steps(29, jump-none)`; se puede pausar, invertir y disparar con `:hover` o `:checked`
  ([Lean Rada](https://leanrada.com/notes/css-sprite-sheets/)).
- **Rive.** [HECHO] Estados de reposo, cursor y presionado definidos en una máquina de
  estados dibujada en el editor; Rive afirma que Duolingo lo usa
  ([Rive](https://rive.app/blog/rive-as-a-lottie-alternative), dato del fabricante).
- **Lottie por tramos.** [HECHO] Un solo archivo donde cada rango de cuadros es un estado
  ([DEV](https://dev.to/fazalshah/lottie-micro-interactions-patterns-for-hover-click-and-state-changes-1237)).

### Qué técnica para qué [JUICIO]

| Necesidad | Técnica | Por qué |
|---|---|---|
| Ícono chico que actúa una vez (taco que se abre, bolsa que se rasga, chile que tiembla) | **Sprite + `steps()`** | Cero dependencias y se produce con IA: un clip corto, cuadros extraídos, una tira |
| Mascota que reacciona (el nopal saluda, parpadea, sigue el cursor) | **Rive**, o sprite si solo son dos poses | Tiene estados de verdad |
| Trazo que se dibuja (subrayado de gis, flecha) | **SVG** con `stroke-dashoffset` | Vectorial y ligero |
| Cambio de forma entre dos íconos | SVG con morph (GSAP MorphSVG, ya gratuito) | Solo si las dos formas se parecen |

### En táctil, donde no hay cursor

[HECHO] `@media (hover: none)` detecta que la entrada principal no puede pasar por encima;
`pointer: coarse` detecta el dedo
([MDN hover](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover),
[MDN pointer](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer)).

Reglas [JUICIO]:

1. **Nada de información solo en hover.** El hover adorna, nunca informa.
2. En táctil, la animación se dispara **al entrar en pantalla** (una vez) y **al tocar**
   (`:active`), no al pasar.
3. El botón navega de inmediato; la animación no retrasa la acción.
4. Con teclado, lo mismo que hover se ve en `:focus-visible`.
5. Área de toque de 44 px o más, aunque el dibujo sea chico.

### Receta del botón «taco que se abre» [JUICIO]

Tira de 16 cuadros de 64 px (1024 × 64 px, WebP, a doble resolución para pantallas
densas):

```css
.boton-taco::before {
  content: ""; width: 64px; height: 64px;
  background: url(img/taco-tira.webp) 0 0 / 1024px 64px no-repeat;
}
@media (prefers-reduced-motion: no-preference) {
  @media (hover: hover) {
    .boton-taco::before { transition: background-position .5s steps(15); }
    .boton-taco:hover::before,
    .boton-taco:focus-visible::before { background-position: -960px 0; }
  }
  @media (hover: none) {
    .boton-taco.visto::before { animation: abrir .5s steps(15) forwards; }
  }
}
@keyframes abrir { to { background-position: -960px 0; } }
```

La clase `visto` la pone un `IntersectionObserver` cuando el botón entra en pantalla. Con
movimiento reducido se queda en el primer cuadro. No está probado en navegador.

---

## 5. Marcas de taquería y comida mexicana: qué decisiones las hicieron reconocibles

Orinoco, Gabriel y El Califa ya están en [referencias-marca.md](referencias-marca.md);
aquí van por decisión de marca, con casos nuevos.

| Marca | Nombre | Rótulo y letra | Personaje o motivo | Color | Voz | Empaque | Fuente |
|---|---|---|---|---|---|---|---|
| Taquería Orinoco | — | Arial estirada como letra de rótulo | Ilustración a una tinta | Rojo y blanco, nada más | Letrero de local, con humor | — | [sitio](https://taqueriaorinoco.com/) |
| Taquería Gabriel | — | Rótulos pintados a mano por un maestro rotulista | Neón, azulejo blanco | — | — | — | [Materia Press](https://materia.press/taqueria-gabriel-and-the-art-of-the-rotulo/) |
| El Califa | — | Letras inspiradas en rótulos | **La tortilla** hecha círculo y repetida | Dorado sobre terrazo | — | Gráficos tomados de manteles de taquería | [Designboom](https://www.designboom.com/design/esrawe-studio-el-califa-taqueria-interiors-mexico-city-02-24-2018/) |
| Tacos Norteados (Mérida) | — | Logotipo tipográfico de mucho peso | Ninguno, a propósito: sin caricaturas ni sombreros | Cálida, de fuego y carbón | Urbana | Sistema pensado para empaque, rótulo y pantallas | [Inter Estudio](https://interestudio.mx/portafolio-inter/tacos-norteados/) |
| Xolos (EE. UU.) | El animal da el nombre | — | **Xoloitzcuintle** con estética de alebrije | Pop | — | Menús, empaque, uniformes | [Nube Amarilla](https://nubeamarilla.com/portafolio/como-el-diseno-de-marca-eleva-tu-restaurante/) |
| Bellaco (España) | Palabra con actitud | Bowlby One en títulos | **Luchador enmascarado** | Bandera en versión neón, trama de puntos de cartel de lucha | Humor, albur, doble sentido; lema «Taquería de Barrio» | Bolsas, papel picado | [Río Babel](https://riobabel.com/trabajos/bellaco.html) |
| Tacombi (EE. UU.) | Taco + Combi: el nombre cuenta el origen | Sello circular rojo | La combi de 1963 | Rojo | Hospitalidad mexicana | Vende tortillas empacadas bajo otra marca | [historia](https://www.tacombi.com/our-story) |
| Siete (EE. UU.) | Los siete integrantes de la familia | — | La familia | — | Familiar, bilingüe | Comida empacada | [historia](https://sietefoods.com/pages/our-story) |
| Somos (EE. UU.) | «Somos»: identidad | — | — | — | Comida mexicana «de verdad» contra la falsa | Salsas, arroz y frijoles empacados | [historia](https://eatsomos.com/pages/our-story) |

«—» = la fuente no lo dice.

### Patrones [JUICIO]

1. **El nombre carga una historia** (Tacombi, Siete). «May» seguramente la tiene.
2. **Un personaje o un motivo, uno solo**, que se pueda dibujar en un vaso, una bolsa y un
   botón: la tortilla, el xolo, el luchador, la combi.
3. **El rótulo pintado a mano como sistema**, no como adorno.
4. **Paleta corta y terca.**
5. **Voz con carácter**, que suena a alguien.
6. **Dos caminos válidos frente al cliché**: evitarlo (Norteados: sin sombreros) o
   apropiárselo con oficio (Bellaco, Xolos). Lo que no funciona es el punto medio.

### Aplicado a Los Tacos May [JUICIO]

- **Ya tiene lo más difícil:** un rótulo real pintado a mano y una mascota (el nopal con
  sombrero y tunas). Ninguna marca nueva puede inventar eso con credibilidad.
- **El nopal debe pasar de dibujo a personaje:** nombre, 4–6 poses, y un papel en la
  página (recibe, señala el menú, empaca, se despide). Es lo que hace reconocible la
  marca sin leerla.
- **El pizarrón del menú es el segundo activo:** letra de gis a mano. Sirve de sistema
  para precios, etiquetas y notas.
- **El sombrero** es el cliché que Norteados evita. Como viene del rótulo real de la
  familia, es legítimo conservarlo; es decisión de ellos.
- **Empaque:** la bolsa al vacío es transparente y anónima. Una etiqueta con el nopal y
  la letra del rótulo es lo que la convierte en producto de marca, y es además donde va
  lo que pide la NOM-051 ([viabilidad.md](viabilidad.md)).

---

## 6. Qué puede producir Alejandro con IA generativa (Gemini)

### Lo que hace hoy, según la documentación oficial

**Imagen** ([documentación](https://aistudio.google.com/docs/image-generation)) [HECHO]:
modelos «Nano Banana» (el recomendado es `gemini-nano-banana-2.1`); genera desde texto,
**edita una foto que se le sube**, combina hasta 14 imágenes de referencia, mantiene un
personaje consistente entre imágenes y escribe texto dentro de la imagen; salida de 1K,
2K o 4K. La documentación **no menciona fondo transparente**. Todas las imágenes llevan
marca de agua invisible SynthID.

**Video** ([documentación](https://aistudio.google.com/docs/omni)) [HECHO]: el modelo
vigente en la API es Gemini Omni Flash; los modelos Veo 3.1 de la API se apagaron el 22
de octubre de 2026. Clips de 3 a 15 s, 720p por defecto y 1080p, horizontal 16:9 o
vertical 9:16; parte de una imagen inicial, o **interpola entre un primer y un último
cuadro** (3 a 10 s); acepta hasta 6 imágenes de referencia; genera audio. No dice nada
de bucles perfectos. Los videos también llevan SynthID. La app de Gemini puede tener
límites distintos a la API; no lo verifiqué.

[HECHO] SynthID es detectable: Gemini y un portal público pueden revisar si un archivo
la trae ([DeepMind](https://deepmind.google/science/synthid/)).

### El punto delicado: foto generada del guiso

Hechos:

- [HECHO] La ley mexicana exige que la publicidad sea veraz y comprobable, y prohíbe
  expresamente las **imágenes** que induzcan o puedan inducir a error por engañosas
  (Ley Federal de Protección al Consumidor, art. 32;
  [texto vigente](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPC.pdf), última reforma
  12-dic-2025).
- [HECHO] La política de Google prohíbe hacer pasar contenido generado por hecho solo por
  humanos con fin de engañar
  ([política](https://policies.google.com/terms/generative-ai/use-policy), punto 4.5).
- [HECHO] Un estudio de Baymard con 2,273 compradores en línea (junio de 2026) encontró
  que 60 % confiaría menos en comprar si supiera que las fotos del producto son
  generadas; recomienda foto auténtica para el producto e IA solo en contenido de apoyo
  ([PetaPixel](https://petapixel.com/2026/11/03/ai-generated-product-photos-are-putting-off-online-shoppers-study-finds/)).
- [HECHO] Un estudio con 241 consumidores (British Food Journal, 2025) encontró que las
  imágenes de comida generadas bajan el valor percibido y suben los comentarios negativos
  ([Universidad de Zaragoza](https://zaguan.unizar.es/record/168259?ln=en)).
- Fuentes secundarias reportan que las apps de reparto restringen imágenes de platillos
  generadas o engañosas. No pude leer las políticas oficiales de Uber Eats ni de
  DoorDash; **no lo cito como hecho**.

**Recomendación [JUICIO], sin matices:**

> **Todo lo que el cliente va a recibir o a visitar se muestra con foto real: el guiso,
> la bolsa, la porción, el local, la gente.** La IA se usa para lo que nadie va a recibir:
> el personaje, la ilustración, las texturas, los fondos, la animación y el retoque de
> luz y fondo de una foto real. Nunca se genera ni se «mejora» la comida misma.

Prueba rápida: si un cliente pudiera decir «esto no es lo que me llegó» señalando la
imagen, esa imagen tiene que ser una foto.

### Qué pedirle y qué no

| Material | ¿Con IA? | Qué pedir | Formato de entrega | Límites |
|---|---|---|---|---|
| **Foto del guiso, de la bolsa, de la porción servida** | **No** | Foto real con celular: luz de ventana, fondo de la madera o el comal del local | JPEG original, lo más grande posible | — |
| Retoque de esas fotos | Sí, limitado | Subir la foto: «limpia el fondo, iguala la luz, no cambies la comida» | Misma resolución | Comparar contra el original: si cambió el guiso, se descarta |
| **Logotipo redibujado** | Sí, con revisión | Subir la foto del rótulo: «redibuja este rótulo de frente, plano, mismos colores y letra» | PNG 4K; luego vectorizar a mano | La IA deforma letras; hace falta la foto de frente del rótulo (`PENDIENTE-CLIENTE`) |
| **Mascota en poses** | **Sí, es el mejor uso** | Rótulo como referencia + «el mismo nopal: saludando, señalando, cargando una bolsa, guiñando; trazo de rótulo pintado a mano, fondo liso de un color» | PNG 2K por pose, fondo liso para recortar | Revisar que sea el mismo personaje en todas; el fondo transparente no está garantizado, se recorta después |
| **Texturas** (madera, pizarrón, papel estraza) | Sí | «Textura en mosaico, sin objetos, luz pareja» | PNG 1K–2K → WebP | Verificar que el mosaico no muestre costura |
| **Ilustraciones de ingredientes** (chile, cebolla, tortilla) | Sí | Mismo trazo que la mascota, un ingrediente por imagen | PNG 1K, fondo liso | Son ilustración: no deben parecer foto |
| **Animación del botón** (taco que se abre) | Sí | Video de 3 s desde una ilustración: primer cuadro taco cerrado, último cuadro taco abierto, cámara fija, fondo liso | MP4 → extraer 16 cuadros → tira WebP | Es dibujo, no foto; revisar que el fondo no cambie entre cuadros |
| **Mascota animada** (saludo, parpadeo) | Sí | Primer y último cuadro **iguales**, para que el clip cierre en bucle | MP4 3–4 s → WebM/MP4 sin audio | El bucle perfecto no está garantizado: hay que probarlo |
| **Video del héroe** (vapor, comal, salsa) | **No** si muestra comida | Grabarlo real con celular, cámara fija, 10 s | MP4 1080p | Un video generado de comida es la misma trampa que la foto |
| Fondos y ambiente (papel picado, patrón de tunas) | Sí | Patrón repetible con los colores exactos de la paleta | PNG → WebP | — |

Para todo lo generado: guardar el original y la instrucción usada, y pasar cada imagen
por una revisión humana antes de subirla (manos, letras y bordes son donde falla).

### Lista de tomas reales que hacen falta [JUICIO]

1. El rótulo, de frente, de día.
2. El pizarrón del menú, de frente.
3. Cada guiso en su cazuela, desde arriba, con luz de ventana.
4. Un taco servido de cada guiso estrella.
5. Las manos sirviendo o empacando.
6. La bolsa al vacío con guiso real, sobre la madera.
7. La fachada y la barra con gente (con permiso de quien salga).
8. Un clip de 10 s del comal o del vapor, con cámara fija.

---

## 7. Las diez decisiones que más separan una landing «correcta» de una premium

Ordenadas por impacto para Los Tacos May. Todo es **[JUICIO]**, apoyado en las secciones
anteriores.

1. **Fotografía real y propia.** Sin fotos del guiso y del local no hay página premium
   posible; ningún recurso técnico lo compensa. Es el bloqueo número uno.
2. **Una idea rectora.** Decidir si la página la conduce el nopal (un anfitrión) o el
   pizarrón (el menú como interfaz), y sacar todo de ahí.
3. **El nopal como personaje**, con poses y con un papel en cada sección, en vez de un
   logotipo quieto.
4. **Un solo momento estelar.** Recomiendo la bolsa que se abre y se sirve, como secuencia
   ligada al scroll con fotos reales. Todo lo demás, sobrio.
5. **Voz propia en cada texto**, incluidos botones, errores y estados vacíos. Hoy los
   textos son correctos y de nadie.
6. **Paleta y letra tomadas del rótulo real, con disciplina:** verde, amarillo, rojo,
   negro y madera, y la letra de gis del pizarrón para lo secundario. Nada más.
7. **Textura.** Madera, gis y papel en lugar de fondos planos; es lo que hace que se
   sienta hecha a mano y no generada.
8. **Botones e íconos que actúan** (el taco que se abre, la bolsa que se rasga), con
   sprite y `steps()`, y con su versión táctil y de teclado.
9. **Ritmo y aire:** menos secciones, más grandes, con una sola idea cada una; el menú
   como lista de pizarrón y no como tarjetas.
10. **Pulido invisible:** primera pantalla en menos de 2.5 s en celular, movimiento
    reducido respetado, todo usable con teclado. Premium que carga lento se siente barato.

Orden de trabajo sugerido: 1 y 2 (deciden Alejandro y la familia) → 3, 5 y 6 → prototipo
del héroe con 4 → el resto.

---

## Lo que no pude verificar

- Ningún sitio se vio renderizado; las técnicas de los premiados de Awwwards de 2026 no
  se leyeron, salvo La Revoltosa.
- Las políticas oficiales de fotos de Uber Eats y DoorDash (páginas no encontradas).
- La documentación de `lottie-web` y de dotLottie para web no se pudo leer completa; sus
  tamaños vienen de Bundlephobia y del fabricante.
- Las cifras de Rive frente a Lottie son del propio Rive.
- No encontré estudios mexicanos con casos web de comida premiados y documentados.
- El CSS de la sección 4 no se probó en navegador.

## PENDIENTE-CLIENTE

- Foto de frente y en buena resolución del rótulo, o el arte original. `PENDIENTE-CLIENTE`
- Fotos propias de los guisos, del local y de la gente (lista de tomas, sección 6). `PENDIENTE-CLIENTE`
- De dónde viene «May» y la historia de las taquerías, para la voz y el guion. `PENDIENTE-CLIENTE`
- Si el nopal tiene nombre y quién pintó el rótulo. `PENDIENTE-CLIENTE`
- Si la familia quiere conservar el sombrero y el rótulo tal cual o permite redibujarlos. `PENDIENTE-CLIENTE`
- Cómo se ve hoy el producto empacado (bolsa, etiqueta), si ya existe. `PENDIENTE-CLIENTE`
- Cómo habla la taquería con sus clientes: frases, apodos de los guisos, dichos de la casa. `PENDIENTE-CLIENTE`
