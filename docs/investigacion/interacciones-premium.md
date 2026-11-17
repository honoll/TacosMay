# Interacciones y animaciones de nivel premium para Los Tacos May

Fecha de consulta: **17 de noviembre de 2026**. Parte de 21st.dev y bibliotecas parecidas
como referencia de patrón, y dice cómo rehacer cada uno sin React, dentro de las reglas de
movimiento de [sistema.md](../diseno/sistema.md) (sección 10: corto, seco, funcional).

## Cómo se hizo y qué límites tiene

- Se leyó el **texto** de las páginas de cada biblioteca y de su repositorio. **Ninguna
  demostración se vio en movimiento:** las vistas previas necesitan JavaScript. Lo que se
  dice de cada patrón sale de su descripción y de sus parámetros.
- **[VISTO]** = leído en la fuente enlazada. **[JUICIO]** = interpretación o
  recomendación mía.
- No se copia código de ninguna biblioteca. Los patrones (una idea de interacción) no
  tienen dueño; el código sí.
- El sitio no tiene paso de build: todo lo recomendado es CSS y JavaScript nativos. Hoy
  no usa GSAP ni transiciones de vista; solo `IntersectionObserver` en la landing.

## 1. Qué hay en 21st.dev y bibliotecas parecidas

### Las bibliotecas

| Biblioteca | Qué es | Requiere | Licencia [VISTO] | ¿Se puede adaptar su código? |
|---|---|---|---|---|
| [21st.dev](https://21st.dev/community/components) | Registro comunitario de componentes de muchos autores; dos copias gratis al día, lo demás con membresía | React, Tailwind, shadcn | No declarada en lo leído; cada pieza es de su autor | **No sin revisar cada pieza.** Usar solo como catálogo de ideas |
| [Aceternity UI](https://ui.aceternity.com/components) | Componentes para copiar, con nivel de pago | React, Tailwind, Motion | Licencia propia ([texto](https://ui.aceternity.com/licence)); no nombra licencia abierta para lo gratuito | **No copiar.** Solo referencia |
| [Magic UI](https://magicui.design/docs/components) | Componentes animados para copiar; nivel Pro aparte | React, Tailwind | **MIT** ([repositorio](https://github.com/magicuidesign/magicui)) | Sí, conservando el aviso de licencia |
| [Motion Primitives](https://github.com/ibelick/motion-primitives) | Piezas de movimiento, en beta | React, Motion, Tailwind | **MIT** | Sí. Su sitio no se pudo abrir |
| [React Bits](https://www.reactbits.dev/get-started/index) | Más de 215 componentes y fondos animados | React | **MIT + Commons Clause** ([repositorio](https://github.com/DavidHDev/react-bits)) | Sí para usar; la cláusula impide vender el software mismo |
| [coss ui](https://coss.com/ui) (antes Origin UI) | Componentes sobrios de interfaz | React, Base UI, Tailwind | **MIT** ([repositorio](https://github.com/cosscom/ui)) | Sí |
| [Animate UI](https://animate-ui.com/) | Primitivas animadas | React (y Vue) | No declarada en lo leído | Solo referencia |
| [Sonner](https://sonner.emilkowal.ski/) | Avisos apilados | React | **MIT** | Sí |
| [NumberFlow](https://number-flow.barvian.me/) | Números que giran al cambiar | Sin dependencias; usa un elemento propio; su repositorio lista una versión «TS/JS» | **MIT** | Sí. **Candidato a usarse sin framework**; verificar el paquete antes |
| [AutoAnimate](https://auto-animate.formkit.com/) | Una llamada anima altas, bajas y cambios de orden de los hijos de un contenedor | **Nada: funciona en JavaScript nativo**; respeta movimiento reducido | **MIT** | Sí. **Se puede usar tal cual** |

### Los patrones, por tipo

Lo que hace cada uno es [VISTO] en su página; «para aquí» es [JUICIO].

| Tipo | Ejemplo | Qué hace | Para aquí |
|---|---|---|---|
| **Cabecera** | [Floating Navbar](https://ui.aceternity.com/components/floating-navbar) (Aceternity) | La barra se esconde al bajar y reaparece al subir | Sí, en celular |
| | [Pill Nav](https://www.reactbits.dev/components/pill-nav) (React Bits) | Un relleno sube por el enlace al pasar el cursor y un punto se desliza al activo | Sí: es la franja de colores del sistema |
| | [Scroll Progress](https://magicui.design/docs/components/scroll-progress) (Magic UI) | Barra bajo la cabecera que marca el avance de lectura | No: la landing es corta |
| **Héroe y texto** | [Text Animate](https://magicui.design/docs/components/text-animate) (Magic UI) | Parte el texto en letras, palabras o renglones y los hace entrar escalonados; 0.3 s | Sí, por renglón y una sola vez |
| | [Split Text](https://www.reactbits.dev/text-animations/split-text) (React Bits) | Lo mismo, por letra o palabra | Por renglón, no por letra |
| | [Text Generate](https://ui.aceternity.com/components/text-generate-effect) (Aceternity) | Las palabras aparecen una por una al cargar | **No:** hace esperar para leer |
| **Entrada al hacer scroll** | [Blur Fade](https://magicui.design/docs/components/blur-fade) (Magic UI) | Aparece de borroso a nítido moviéndose 6 px, al entrar en pantalla; 0.4 s | Sí, sin el desenfoque |
| | [Fade Content](https://www.reactbits.dev/animations/fade-content) (React Bits) | Aparece al entrar, opcionalmente desde gris o con grano | Solo la versión simple |
| **Tarjeta de producto** | [Card Hover Effect](https://ui.aceternity.com/components/card-hover-effect) (Aceternity) | Un resaltado se desliza de una tarjeta a la que tiene el cursor | Sí: da continuidad al recorrer la barra |
| | [Spotlight Card](https://www.reactbits.dev/components/spotlight-card) (React Bits) | Una luz sigue al cursor sobre la tarjeta | **No:** brillo |
| | [Tilted Card](https://www.reactbits.dev/components/tilted-card) (React Bits) | La tarjeta se inclina en 3D hacia el cursor | **No:** 3D |
| **Botones** | [Stateful Button](https://ui.aceternity.com/components/stateful-button) (Aceternity) | Al hacer clic muestra «cargando» y luego «listo» dentro del mismo botón | **Sí, el más útil** |
| | [Hold Button](https://www.reactbits.dev/micro/hold-button) (React Bits) | Un relleno sube mientras se mantiene presionado; se suelta y regresa | Sí, para borrar en administración |
| | [Slide Commit](https://www.reactbits.dev/micro/slide-commit) (React Bits) | Deslizar para confirmar | No: más lento que un botón |
| | [Ripple Button](https://magicui.design/docs/components/ripple-button) (Magic UI) | Ondas que salen del botón; 600 ms | No: el sistema ya define «se hunde 2 px» |
| | [Shimmer Button](https://magicui.design/docs/components/shimmer-button), [Border Beam](https://magicui.design/docs/components/border-beam) (Magic UI) | Una luz recorre el borde, en bucle | **No:** brillo en bucle |
| | [Magnetic Button](https://ui.aceternity.com/components/magnetic-button) (Aceternity) | El botón se va hacia el cursor | **No:** el blanco no debe moverse |
| **Números y carrito** | [Number Ticker](https://magicui.design/docs/components/number-ticker) (Magic UI), [Counter](https://www.reactbits.dev/components/counter) (React Bits), NumberFlow | Los dígitos ruedan hasta el nuevo valor | **Sí:** contador del carrito, total, tiempo restante |
| | [Number Field](https://coss.com/ui/docs/components/number-field) (coss) | Campo con botones de más y menos | Sí: cantidad en la charola y en el carrito |
| | [Drawer](https://coss.com/ui/docs/components/drawer) y Sheet (coss) | Un panel entra desde una orilla; admite arrastre | **Sí:** panel del carrito |
| | «Volar al carrito» | No encontré un componente con ese nombre en lo leído | Ya existe aquí: el empacado |
| **Formularios** | [Vanish Input](https://ui.aceternity.com/components/placeholders-and-vanish-input) (Aceternity) | El texto de ejemplo rota y lo escrito se desvanece al enviar | **No:** distrae y borra lo escrito |
| | [Stepper](https://www.reactbits.dev/components/stepper) (React Bits) | El indicador se desliza entre pasos | No hay pasos que mostrar |
| **Pestañas** | [Tabs](https://ui.aceternity.com/components/tabs) (Aceternity), [Tabs](https://coss.com/ui/docs/components/tabs) (coss) | Un indicador marca la pestaña activa y se mueve al cambiar | Sí, en la navegación de la tienda |
| **Listas** | [Animated List](https://magicui.design/docs/components/animated-list) (Magic UI) | Los renglones entran uno tras otro | Sí, con retraso corto |
| | AutoAnimate | Anima solo lo que se agrega, se quita o cambia de lugar | **Sí:** carrito y administración |
| **Carga** | [Skeleton](https://coss.com/ui/docs/components/skeleton) (coss) | Bloques con pulso hasta que llegan los datos | Sí, con forma de charola |
| | [Multi Step Loader](https://ui.aceternity.com/components/multi-step-loader) (Aceternity) | Mensajes de carga que rotan, 2 s cada uno | No: aquí nada tarda tanto |
| **Avisos** | [Sonner](https://sonner.emilkowal.ski/), [Toast](https://coss.com/ui/docs/components/toast) (coss) | Avisos apilados en una esquina; el mismo aviso se actualiza en su lugar; se descartan deslizando | Sí |
| | [Toast undo](https://21st.dev/@shugar/components/toast/undo.md) (21st.dev) | Aviso con «deshacer» (solo se leyó el nombre) | Sí, al quitar del carrito |
| **Vacíos** | [Empty](https://coss.com/ui/docs/components/empty) (coss), [Empty de productos](https://21st.dev/@j1zuz/components/empty/products.md) (21st.dev) | Contenedor para «no hay nada» con una acción | Sí; el patrón es de contenido, no de movimiento |
| **Fondos y efectos** | [Marquee](https://magicui.design/docs/components/marquee) (Magic UI) | Franja que corre sin fin | **No:** bucle |
| | [Click Spark](https://www.reactbits.dev/animations/click-spark) (React Bits) | Chispas en cada clic | **No:** partículas |
| | Fondos animados, cursores, 3D (categorías de Aceternity y React Bits) | — | **No** |
| **Modal** | [Animated Modal](https://ui.aceternity.com/components/animated-modal) (Aceternity) | Ventana con entrada animada; se cierra al hacer clic afuera | Sí, con `<dialog>` nativo |
| **Transición entre vistas** | No encontré un componente dedicado en lo leído | — | Se hace con la API del navegador (sección 2) |

De 21st.dev solo se pudieron leer nombres y autores de los listados de
[tarjetas](https://21st.dev/s/card), [héroes](https://21st.dev/s/hero),
[avisos](https://21st.dev/s/toast), [vacíos](https://21st.dev/s/empty-state),
[pestañas](https://21st.dev/s/tabs) y [barras](https://21st.dev/s/navbar): el listado no
describe qué hace cada uno. El sitio de Motion Primitives rechazó la lectura.

## 2. Cómo se reconstruye cada patrón sin React

### La caja de herramientas nativa

| Herramienta | Para qué | Disponibilidad [VISTO en MDN] |
|---|---|---|
| `transition` y `@keyframes` sobre `transform` y `opacity` | Casi todo | Universal. Son las dos propiedades baratas: no obligan a recalcular ni a repintar ([web.dev](https://web.dev/articles/animations-guide)) |
| [`@starting-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) | Animar la **entrada** de algo recién insertado o recién mostrado, sin JavaScript | Disponible en todos los navegadores actuales desde agosto de 2024 |
| [`<dialog>` con `showModal()`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) | Panel del carrito y modales: capa superior, fondo, resto de la página inerte, foco inicial y Esc, gratis | Ampliamente disponible desde 2022 |
| [`popover`](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) | Menús y avisos no modales, con cierre al hacer clic afuera | Nuevo en todos desde enero de 2025 |
| [`document.startViewTransition()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition) | Transición entre vistas de la tienda y elementos que «viajan» de una vista a otra con [`view-transition-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name) | Nuevo en todos desde octubre de 2025. Sin soporte, se aplica el cambio sin animar: hay que comprobar que exista |
| [`@view-transition { navigation: auto }`](https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition) | Transición entre páginas distintas (landing ↔ tienda) | **Disponibilidad limitada.** Solo como mejora que no rompe nada si falta |
| `animation-timeline: view()` | Entradas ligadas al scroll, sin JavaScript | Nuevo en todos desde octubre de 2026 (ver [landing-premium.md](landing-premium.md)); va dentro de `@supports` |
| `IntersectionObserver` | Disparar una entrada una sola vez al aparecer | Universal; ya se usa en la landing |
| [`element.animate()`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) | Animaciones calculadas en el momento (de dónde a dónde) y que se pueden cancelar | Universal |
| [`linear()`](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear) | Curvas a la medida | Ampliamente disponible desde 2023 |
| [`transition-behavior: allow-discrete`](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior) | Animar la **salida** hacia `display: none` | **Limitada.** Declarar antes una transición normal como respaldo |
| [`interpolate-size`](https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size) | Animar a `height: auto` | **Limitada y experimental.** Alternativa segura: `grid-template-rows: 0fr → 1fr` |
| [`navigator.vibrate()`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate) | Respuesta háptica | **Limitada.** No contar con ella |
| GSAP (27 KB comprimido, gratuito) | Secuencias largas con muchas piezas | Hoy no hace falta: el empacado ya está en CSS |

### Receta de cada patrón que vale la pena

Técnica, costo y comportamiento son [JUICIO] construido sobre la tabla anterior. Movimiento
reducido, en todos: el estado final aparece de inmediato y completo.

| Patrón | Por qué se siente premium | Cómo se rehace | Costo | Teclado y táctil |
|---|---|---|---|---|
| **Botón con estado** (reposo → enviando → listo o error) | Contesta en el lugar exacto donde se hizo clic; no hay que buscar el resultado | Un atributo `data-estado` en el botón; CSS cambia texto e ícono con `opacity` y `transform`; la palomita se traza con `stroke-dashoffset`. Ancho fijo para que no brinque. `aria-busy` mientras envía y un `aria-live` que diga el resultado | Mínimo | Igual con Enter y con el dedo |
| **Presionar** | Respuesta inmediata al gesto | `:active { transform: translateY(2px) }` (ya está en el sistema), sin transición de entrada y con 120 ms de salida | Nulo | En táctil `:active` basta |
| **Franja que se abre** (relleno al pasar) | Dice «esto se puede accionar» antes del clic | Pseudoelemento con `transform: scaleX(0 → 1)` y `transform-origin: left`, dentro de `@media (hover: hover)`; lo mismo en `:focus-visible` | Nulo | En táctil no hay hover: el estado activo de la navegación la muestra fija |
| **Indicador que se desliza** (pestañas, enlace activo) | Continuidad: el ojo sigue a dónde se fue | Darle `view-transition-name` al indicador y cambiar de vista con `startViewTransition`; sin soporte, cambia de golpe | Bajo | No depende del cursor |
| **Resaltado que viaja entre tarjetas** | La fila se siente una sola pieza | Un solo elemento de resaltado que se mueve con `transform` hacia la charola bajo el cursor (`pointerenter`), con `element.animate()` | Bajo | Solo con `hover: hover`; con teclado sigue al foco |
| **Entrada escalonada** (charolas, renglones) | Orden: llegan como sobre un riel | `@starting-style` o una clase puesta por `IntersectionObserver`; retraso con `transition-delay: calc(var(--i) * 40ms)`, **tope de 8 elementos** para que la fila completa no pase de 0.5 s | Bajo | Sin diferencia |
| **Texto que entra por renglón** | El titular «se coloca» | Cada renglón en un `<span>` con `overflow: hidden` y el texto subiendo con `transform`; partir por renglón a mano en el HTML, no por letra | Bajo | El texto está en el HTML: el lector de pantalla lo lee completo |
| **Número que rueda** (contador, total, tiempo) | El cambio se ve, no solo aparece | Dos opciones: (a) el dígito viejo sale hacia arriba y el nuevo entra, con `overflow: hidden`, solo cuando cambia; (b) NumberFlow si su versión sin framework se confirma. `font-variant-numeric: tabular-nums` para que no baile el ancho | Bajo | El valor real va en texto; `aria-live="polite"` solo en el total, no en el reloj |
| **Panel lateral del carrito** | No saca del catálogo; entra desde donde está el ícono | `<dialog>` con `showModal()`; entra con `translateX(100% → 0)` vía `@starting-style` y el fondo se oscurece; salida con respaldo sin animación | Bajo | Esc y foco los da el navegador; hay que devolver el foco al botón que lo abrió. En celular ocupa toda la pantalla |
| **Alta, baja y cambio de orden en listas** | Nada aparece ni desaparece de golpe; se entiende qué cambió | AutoAnimate sobre el contenedor (una línea), o `startViewTransition` con un `view-transition-name` por renglón | Bajo | Sin diferencia |
| **Aviso con deshacer** | Perdona el error sin preguntar antes | Contenedor fijo con `role="status"`; cada aviso entra con `@starting-style`, se queda 5 s y se pausa con el cursor o el foco encima; el botón «Deshacer» repite la llamada anterior | Bajo | El botón debe alcanzarse con Tab; en táctil, deslizar para quitar es opcional |
| **Esqueleto con forma de charola** | La página no brinca cuando llegan los datos | Las mismas charolas, vacías, con el «tres charolas que se llenan» del sistema; aparece solo si la respuesta tarda más de 200 ms | Nulo | `aria-busy` en la lista |
| **Transición entre vistas de la tienda** | La tienda se siente una sola cosa y no páginas sueltas | Envolver el cambio de vista del enrutador en `startViewTransition`; fundido de 150 ms; la charola del catálogo y la de la ficha comparten `view-transition-name` y una se convierte en la otra | Bajo | El foco va al título de la vista nueva, como hoy |
| **Mantener presionado para borrar** | Evita el borrado accidental sin ventana de confirmación | `pointerdown` arranca un relleno de 800 ms con `transform: scaleX`; soltar antes lo cancela | Bajo | **Con teclado no hay «mantener»:** Enter abre una confirmación normal. Por eso es solo para administración |
| **Cabecera que se esconde al bajar** | Deja toda la pantalla al contenido | Comparar la posición de scroll; `transform: translateY(-100%)` al bajar y 0 al subir | Bajo | Reaparece siempre que el foco entra en ella. Solo en celular |
| **Sacudida de error en un campo** | Señala cuál campo, sin leer | Tres vaivenes de 4 px en 240 ms, más el mensaje junto al campo | Nulo | El mensaje va en texto y ligado con `aria-describedby`; con movimiento reducido solo el mensaje |

**Sin equivalente razonable sin framework:** ninguno de los recomendados. Lo que sí pide
más de lo que conviene: física de resortes (arrastre con inercia, botones magnéticos) y
los fondos con WebGL. Ambos quedan fuera también por marca.

## 3. Qué separa una animación premium de una vistosa

Reglas publicadas [VISTO]:

- **Duración.** La mayoría entre 100 y 500 ms, lo más corto que no se sienta brusco; unos
  100 ms para respuestas simples, 200–300 ms para cambios grandes; arriba de 500 ms se
  siente lento ([Nielsen Norman Group](https://www.nngroup.com/articles/animation-duration/)).
  Otras guías son más estrictas: bajo 300 ms
  ([Emil Kowalski](https://emilkowal.ski/ui/7-practical-animation-tips)) y no más de 200 ms
  en interacciones ([Rauno Freiberg](https://interfaces.rauno.me/)).
- **Entrar tarda un poco más que salir:** por ejemplo 300 ms para aparecer y 200–250 ms
  para irse (Nielsen Norman Group).
- **Curva.** Desaceleración (`ease-out`) para lo que entra, porque responde de inmediato y
  deja que el ojo se asiente; lo lineal se ve artificial (Nielsen Norman Group). Las
  curvas de fábrica de CSS son débiles: conviene una propia (Kowalski).
- **Escalas chicas.** Botón presionado a 0.97; nada nace desde escala 0, sino desde 0.9 o
  más (Kowalski, Freiberg).
- **Origen.** El movimiento sale del lugar que lo provocó: un menú crece desde su botón,
  no desde el centro (Kowalski; [guía de Vercel](https://vercel.com/design/guidelines)).
- **Lo frecuente no se anima.** Lo que se hace muchas veces al día no lleva adorno
  (Kowalski, Freiberg).
- **Interrumpible.** Cualquier animación se cancela si el usuario hace otra cosa (Vercel).
- **Solo para aclarar causa y efecto;** solo `transform` y `opacity`; nunca
  `transition: all` (Vercel).
- **Carga.** El indicador espera 150–300 ms antes de aparecer y, si aparece, dura al
  menos 300–500 ms, para que no parpadee (Vercel).
- **Optimista.** Se actualiza la pantalla al instante y se revierte con aviso si el
  servidor falla (Freiberg).
- **El hover no existe en táctil:** va dentro de `@media (hover: hover)` (Freiberg).

No pude leer las guías de movimiento de Material Design ni de Apple (sus páginas solo
entregan el título); las cifras de arriba no vienen de ahí.

### Reglas para este sitio [JUICIO]

Compatibles con los límites del sistema (120–250 ms de respuesta, 1.2 s máximo, sin
rebotes ni bucles):

| Qué | Valor |
|---|---|
| Respuesta al gesto (presionar, pasar, foco) | 120 ms |
| Entrada de un elemento chico (aviso, charola, renglón) | 180 ms |
| Entrada de un elemento grande (panel, modal, vista) | 240 ms |
| Salida de cualquiera | 30 % menos que su entrada |
| Escalonado | 40 ms por elemento, tope de 8 |
| Curva de entrada | `cubic-bezier(0.2, 0, 0, 1)`: arranca rápido y frena |
| Curva de salida | `cubic-bezier(0.4, 0, 1, 1)`: acelera y se va |
| Desplazamiento de entrada | 8 a 16 px; nunca la pantalla entera, salvo el panel |
| Rebote o resorte | Ninguno: «seco» |

Los valores de las curvas son propuesta mía; se guardan como variables
(`--entra`, `--sale`, `--t-gesto`, `--t-chico`, `--t-grande`) para afinarlos en un solo
lugar.

Lo que hace la diferencia, en orden:

1. **Respuesta en el mismo cuadro.** El botón se hunde al tocarlo, antes de que conteste
   el servidor.
2. **Continuidad.** Lo que cambia viene de algún lado y va a algún lado: la charola se
   vuelve ficha, la bolsa llega al carrito y el contador sube cuando llega.
3. **Coreografía.** Una sola cosa se mueve a la vez, o varias en un orden que se entiende.
4. **Curva propia y consistente** en todo el sitio.
5. **Fin limpio.** Termina exacto, sin vibrar ni rebotar.

**Sonido y vibración:** no encontré una guía legible que los norme. [JUICIO] El «peso» se
logra con el orden y la curva, no con audio: un sitio que suena sin que se lo pidan
molesta, y la vibración no está disponible en todos los teléfonos. Recomiendo no usar
ninguno; si la familia quiere sonido, que sea uno solo (al confirmar el pedido), apagado
por defecto.

## 4. Qué no usar aquí

Todo [JUICIO], contra la plataforma («oficio, no lujo; para gente que trabaja») y la
lista de «lo que nunca se hace» del sistema.

| Efecto de moda | Dónde aparece | Por qué no |
|---|---|---|
| Brillos que recorren bordes o botones | Shimmer Button, Border Beam, Shiny Button | Es lenguaje de producto de tecnología; en bucle, además, rompe la regla de «nada en bucle» |
| Luz que sigue al cursor | Spotlight Card | Brillo sin significado; en táctil no existe |
| Degradados y fondos animados | Categorías de fondos de Aceternity y React Bits | El sistema prohíbe degradados; gastan batería y no dicen nada |
| Partículas y chispas | Click Spark | Festejan cada clic; aquí un clic es trabajo, no premio |
| Vidrio esmerilado | Liquid Glass Button, barras «glassmorphic» de 21st.dev | Choca con el acero y el color plano; el desenfoque de fondo es caro |
| Tarjetas en 3D | Tilted Card | Mueve el blanco que se quiere tocar; el sistema excluye 3D |
| Botones magnéticos | Magnetic Button | Un botón que se mueve es más difícil de atinar |
| Cursor personalizado | Categoría «Cursor & Pointer» | Quita una señal que el sistema operativo ya da bien; no existe en táctil |
| Texto que se escribe o aparece palabra por palabra | Text Generate Effect | Obliga a esperar para leer; contradice «llegas, comes y te vas» |
| Texto de ejemplo que rota y texto que se desvanece | Vanish Input | Distrae en el momento de escribir y borra lo que la persona puso |
| Franjas que corren sin fin | Marquee | Bucle; lo que se mueve solo más de 5 s necesita forma de pausarse |
| Scroll secuestrado, parallax fuerte | Categoría «Scroll & Parallax» | Prohibido por el sistema; puede marear |
| Cargadores con mensajes que rotan | Multi Step Loader | Admite que se hace esperar |
| Deslizar para confirmar | Slide Commit | Más lento y menos accesible que un botón |
| Desenfoque al entrar | Blur Fade (la parte del desenfoque) | Caro de pintar y no agrega nada a un deslizamiento corto |

Regla para decidir uno nuevo: **si se quita la animación y no se pierde ninguna
información, sobra.**

## 5. Mapa de aplicación por vista

Prioridad: **A** = levanta mucho con poco riesgo; **B** = vale la pena después; **C** =
opcional. Todo [JUICIO].

| Vista | Interacción | Qué explica o confirma | Patrón de referencia | Técnica | Prioridad |
|---|---|---|---|---|---|
| **L1 Cabecera** | La franja de colores se abre bajo el enlace con cursor o foco, y queda fija en la sección actual | Dónde estoy | Pill Nav | CSS `scaleX`; sección actual con `IntersectionObserver` | A |
| | En celular, se esconde al bajar y vuelve al subir | Más pantalla para el contenido | Floating Navbar | `transform` según el scroll | C |
| **L2 Héroe** | El titular entra por renglón, una vez; las charolas de la barra llegan escalonadas | Qué es y que hay comida lista | Text Animate, Animated List | CSS con retraso por variable | A |
| **L3 Cómo funciona** | Cada paso entra al verse; la palomita se traza en el último | El orden: rompes, calientas, comes | Blur Fade (sin desenfoque) | `animation-timeline: view()` con respaldo de `IntersectionObserver` | B |
| **L4 Charolas** | Entrada escalonada; el resaltado viaja de una charola a otra; el vapor sale al pasar | Que es una sola barra; cuál estoy viendo | Card Hover Effect | `element.animate()` sobre un resaltado único | B |
| | Esqueleto de charolas mientras responde Redis | Ya viene | Skeleton | CSS; aparece tras 200 ms | A |
| **L5 Envío** | El ticket se despliega renglón por renglón al verse | Qué incluye | Animated List | CSS escalonado | C |
| **L6 Taquería** | La foto o el pizarrón entra con un recorte que se abre | Que es un lugar real | Fade Content | `clip-path` con `view()` | C |
| **L7 Pie** | Ninguna | — | — | — | — |
| **T1 Cabecera de tienda** | El contador del carrito rueda al cambiar y da un pulso corto cuando llega la bolsa | Que sí se agregó | Number Ticker, Counter | Dígito que sube con `overflow: hidden` | A |
| | El indicador de vista activa se desliza | A dónde me moví | Tabs | `view-transition-name` | B |
| **T2 Catálogo** | Fundido entre vistas; la charola se convierte en la ficha del guiso | Que es el mismo guiso, más grande | (API del navegador) | `startViewTransition` | B |
| **Tarjeta de guiso** | El botón «Agregar» se vuelve selector de cantidad en su lugar; el número rueda | Cuántos llevo, sin ir al carrito | Number Field, Stateful Button | Cambio de contenido con `opacity` en ancho fijo | A |
| | Sin existencia: la charola se «tapa» y el botón no aparece | Se acabó | — | Cambio de estado sin animación | A |
| **T3 Iniciar sesión** | El botón pasa por enviando → listo; si falla, el campo se sacude y el mensaje aparece junto a él | Que se envió; cuál campo está mal | Stateful Button | `data-estado`; vaivén de 240 ms | A |
| **T4 Crear cuenta** | Lo mismo; el requisito de la contraseña se palomea mientras se escribe | Qué falta, antes de enviar | Stateful Button | Validación al escribir, `stroke-dashoffset` | A |
| **T5 Agregar al carrito** | Ya existe el empacado. Ajustes: el contador sube **cuando la bolsa llega**; desde la segunda vez seguida del mismo guiso, versión corta (solo la bolsa volando, ~500 ms) | Qué es el producto, la primera vez; después, solo que se agregó | — | Ya está en CSS | A |
| **T6 Carrito** | Entra como panel desde la derecha; los renglones se animan al quitar o cambiar; el total rueda | Qué cambió y cuánto es | Drawer, AutoAnimate | `<dialog>`, AutoAnimate o `startViewTransition` | A |
| | El tiempo restante cambia de color y da un pulso al bajar de 5 minutos y de 1 minuto; se reinicia a la vista al cambiar una cantidad | Que se va a vaciar, y que ya se renovó | — | Clase por umbral; sin parpadeo continuo | A |
| | Quitar un guiso muestra aviso con «Deshacer» | Que se puede corregir | Toast undo, Sonner | Aviso con `role="status"` | B |
| **T7 Confirmar pedido** | El botón pasa a enviando → la palomita se traza → la vista cambia al pedido creado | Que quedó | Stateful Button | `data-estado` + `startViewTransition` | A |
| | Si un guiso se quedó sin existencia, su renglón se marca y la vista se desplaza hasta él | Cuál falló y por qué | — | `scrollIntoView` + resaltado de 1 s | A |
| **T8 Mis pedidos** | El detalle se abre en el mismo renglón; el pedido recién hecho llega resaltado | Qué tenía; cuál es el nuevo | Animated List | `grid-template-rows: 0fr → 1fr` | B |
| | Sin pedidos: estado vacío con una acción | Qué hacer ahora | Empty | Contenido, sin animación | A |
| **T9 Administración** | El renglón guardado se palomea; el nuevo entra a la lista; borrar pide mantener presionado (confirmación normal con teclado) | Que se guardó; evita borrar por error | Hold Button, AutoAnimate | `pointerdown` con relleno de 800 ms | B |
| **T10 Cerrar sesión** | Fundido a la vista sin sesión; carrito y pedidos salen de la cabecera | Que ya salí | — | `startViewTransition` | C |
| **X1 No encontrada** | Ninguna animación; una charola tapada y el camino de regreso | Que no hay nada aquí y a dónde ir | Empty | — | A (contenido) |

Entre landing y tienda: `@view-transition { navigation: auto }` como mejora opcional
(prioridad C), porque su disponibilidad es limitada.

## 6. Lista corta final

Las diez que más levantan el sitio con menos riesgo, en orden:

1. **Botón con estado** (enviando → listo o error) en iniciar sesión, crear cuenta y
   confirmar pedido. Es puro CSS y quita la duda de «¿sí se envió?».
2. **«Agregar» que se vuelve selector de cantidad** en la charola, con el número rodando.
3. **Contador del carrito que rueda y pulsa cuando llega la bolsa,** y empacado en
   versión corta desde la segunda vez seguida.
4. **Carrito como panel lateral con `<dialog>`:** foco, Esc y fondo los pone el
   navegador.
5. **Tiempo restante con umbrales** (5 y 1 minuto) y reinicio visible al cambiar una
   cantidad. Es lo propio de esta tienda.
6. **Altas y bajas animadas en el carrito** con AutoAnimate (una línea, licencia MIT), y
   el total rodando.
7. **Error junto al campo, con sacudida corta,** en los dos formularios y en el renglón
   sin existencia al confirmar.
8. **Esqueleto con forma de charola** que aparece solo si la respuesta tarda.
9. **Entrada escalonada** de charolas y titular por renglón en la landing, con las
   variables de tiempo y curva únicas.
10. **Transición entre vistas de la tienda** con `startViewTransition`, y la charola que
    se convierte en ficha.

Antes de la primera: definir las cinco variables de tiempo y curva de la sección 3, para
que todo lo demás las use.

## Lo que no se pudo verificar

- Ninguna demostración se vio en movimiento.
- De 21st.dev solo se leyeron listados con nombres; el sitio de Motion Primitives y la
  documentación de Animate UI no se pudieron abrir.
- Las guías de movimiento de Material Design y de Apple no entregaron contenido.
- El comportamiento de apilado y de arrastre de Sonner y Vaul no estaba en el texto
  leído; Vaul figura como no mantenido.
- La versión sin framework de NumberFlow hay que confirmarla antes de adoptarla.
- La licencia de las piezas gratuitas de Aceternity y de cada pieza de 21st.dev no está
  declarada: por eso se recomiendan solo como referencia.
- Ninguna receta de la sección 2 se probó en el sitio.
