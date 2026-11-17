# Guion de la landing — Los Tacos May

La página escena por escena: qué siente y entiende quien la visita, qué material lleva, qué
se mueve y con qué técnica, y cómo se ve en celular. Los materiales (**M1, M2…**) están
descritos en [materiales.md](materiales.md); la marca, en [marca.md](marca.md).

**Estado: propuesta.** Se construye cuando la marca esté aprobada y lleguen los materiales
indispensables.

## Estrategia

- **Para quién:** (1) quien ya comió en Los Tacos May y quiere esos guisos en su casa;
  (2) quien no la conoce y llega con antojo y con desconfianza de comprar comida en línea.
- **Qué debe lograr:** que en cinco segundos se entienda qué es, que se antoje, que se confíe
  en que detrás hay una taquería real, y que se llegue a la tienda.
- **La frase:** *Los guisos de Los Tacos May, en bolsa: rompes, calientas y taqueas.*
- **Intensidad:** expresiva (así la pidió Alejandro), con los límites del estudio: el scroll
  es de quien visita, nada se mueve en bucle sin motivo, y la página funciona sin movimiento.
- **Recorrido:** argumental. Qué es → cómo se come → qué hay → por qué confiar → de dónde
  viene → pedir.

## Mapa de escenas

| # | Escena | La persona pasa de… a… | Peso |
|---|---|---|---|
| 1 | El letrero (héroe) | «¿qué es esto?» → «guisos de una taquería, en bolsa» | Aire, grande |
| 2 | Cinta | pausa | Ligera |
| 3 | Modo de uso (**firma**) | «¿y cómo se come?» → «son tres gestos, y ya se me antojó» | La más fuerte |
| 4 | Los guisos, en vivo | «¿qué guisos hay?» → «quiero ese» | Densa |
| 5 | Viaja congelado | «¿y sí llega bien?» → «entiendo por qué va congelado y qué falta confirmar» | Aire, oscura |
| 6 | La taquería | «es un producto» → «es de una taquería de verdad, en Cabo» | Media |
| 7 | Cierre | convencida → en la tienda | Aire, grande |

Ritmo: grande → fuerte → densa → aire → media → grande. El movimiento fuerte vive en la
escena 3; las demás tienen un gesto cada una, o ninguno.

---

## Escena 1 — El letrero

- **Siente:** que la reciben. **Entiende:** qué es y de quién.
- **Se ve:** pared de tablones de madera. El letrero «Los Tacos May» pintado, el nopal al
  lado, y sobre una mesa la bolsa al vacío. Título, una línea de apoyo, el botón del taco y
  la línea de confianza («De nuestra taquería en el centro de Cabo San Lucas»).
- **Material:** letrero redibujado (M13; mientras, la fuente), nopal (M4, luego M7), foto real
  de la bolsa (M3; mientras, la ilustración actual rotulada como ilustración), madera (M1 o M12).
- **Se mueve:** al cargar, el letrero se pinta de izquierda a derecha como brochazo; el nopal
  levanta el sombrero una vez; la bolsa cae a la mesa con un rebote corto. Después, quieto.
  El nopal vuelve a saludar si se pasa el cursor o el foco por la marca.
- **Técnica:** CSS (máscara que avanza, sprite del nopal con `steps()`). El héroe **no espera
  a JavaScript** y el título no se anima, para no retrasar la carga.
- **Celular:** letrero y nopal arriba, título, botón a todo lo ancho; la bolsa asoma abajo.
  Todo cabe en la primera pantalla.
- **Sin movimiento o sin JavaScript:** la misma imagen, ya completa.

## Escena 2 — Cinta

Franja negra con «Rompe · Calienta · Taquea» en amarillo. Quieta. Separa el saludo de la
explicación y anuncia la escena que sigue.

## Escena 3 — Modo de uso (firma)

- **Siente:** antojo. **Entiende:** que no hay que cocinar.
- **Se ve:** tres pasos (1. Rompe la bolsa · 2. Calienta · 3. Taquea) junto a una imagen
  grande que avanza con el scroll: la bolsa se rasga, el guiso cae a la sartén y echa vapor,
  y termina en un taco servido.
- **Material:** video real grabado desde arriba (M6), convertido en secuencia de cuadros. Si
  todavía no existe el producto empacado: tres clips ilustrados (M6b), rotulados como ilustración.
- **Se mueve:** la sección se queda anclada mientras el scroll recorre la secuencia; el paso
  activo se resalta. Hay reposo al principio y al final para que la primera y la última
  imagen se asienten; cada paso se queda quieto un tramo y cambia rápido al siguiente.
- **Técnica:** `position: sticky` + `<canvas>` que dibuja el cuadro según el avance, con
  GSAP y ScrollTrigger guardados en `frontend/vendor/`. Es el único lugar donde se justifica
  la librería: anclado, cuadros y rótulos coordinados. Los cuadros se cargan al acercarse,
  no al abrir la página.
- **Celular:** imagen arriba (proporción 4:5), pasos abajo; 48 cuadros a 720 px. En pantallas
  muy bajas no se ancla.
- **Sin movimiento o sin JavaScript:** tres fotos fijas (los cuadros clave), cada una con su
  paso. El contenido es el mismo.
- `PENDIENTE-CLIENTE`: instrucciones exactas de calentado y qué hacer si llega descongelado.

## Escena 4 — Los guisos, en vivo

- **Siente:** que hay de dónde escoger. **Entiende:** qué puede pedir hoy y cuánto cuesta.
- **Se ve:** primero «Lo que más sale»: el número uno grande con su foto, los demás en fila.
  Después «Todo el menú» como pizarrón: nombre, puntos y precio; al tocar un renglón se abre
  su foto y su descripción. Botón del taco hacia la tienda.
- **Datos:** `GET /api/guisos/populares` y `GET /api/guisos` con el mismo `api()` de la
  tienda. Nombres, precios, porciones y existencias salen de ahí; nada escrito a mano.
- **Material:** fotos reales de cada guiso (M2). La API no trae imagen: la foto se busca por
  el nombre del guiso (`frontend/media/guisos/<nombre-en-minúsculas-con-guiones>.webp`); si no
  hay, el renglón va sin foto. Nunca una foto generada en su lugar.
- **Se mueve:** los renglones se escriben de izquierda a derecha la primera vez que entran a
  pantalla; la foto se descubre con borde de brochazo.
- **Estados:** cargando = la tortilla que se voltea y «Leyendo el menú…»; error = el nopal
  apenado (M9), el mensaje y «Volver a intentar»; vacío = «Todavía no hay guisos en el menú».
- **Técnica:** CSS + `IntersectionObserver` (ya está hecho).
- **Celular:** una columna; el número uno ocupa el ancho; los renglones tienen 48 px de alto
  como mínimo.

## Escena 5 — Viaja congelado

- **Siente:** tranquilidad. **Entiende:** por qué va congelado, y que no se le promete nada
  que no esté confirmado.
- **Se ve:** bloque negro, título grande, el nopal con frío (M8), dos párrafos y las fuentes.
- **Texto:** el actual (el vacío no conserva solo; lo que cuida al guiso es el frío), más la
  frase franca sobre lo que aún no se publica: cobertura, costo y tiempos.
- **Se mueve:** la escarcha se forma en la orilla del bloque una sola vez al entrar.
- **Técnica:** CSS.
- `PENDIENTE-CLIENTE`: confirmar que se vende congelado; cobertura, costo, tiempos, días de
  despacho, origen y vida útil.

## Escena 6 — La taquería

- **Siente:** cercanía. **Entiende:** que hay un lugar y una familia.
- **Se ve:** fotos reales del local (M11) en una tira que se desliza con el dedo; el pizarrón
  con los guisos que se sirven ahí (sin precios); la dirección enlazada al mapa con el nopal
  señalándola.
- **Se mueve:** nada automático. La tira se desliza con el gesto normal del dispositivo.
- **Técnica:** desplazamiento nativo con `scroll-snap`; sin librería.
- **Celular:** tira horizontal; el pizarrón debajo.
- `PENDIENTE-CLIENTE`: horario completo, demás taquerías, historia, año de inicio.

## Escena 7 — Cierre

Bloque rojo. «Rompe la bolsa.» en letra de rótulo, el botón del taco en grande y el nopal
despidiéndose con el sombrero. Debajo, el pie: dirección y, cuando existan, los contactos
como enlaces (`PENDIENTE-CLIENTE`).

---

## Sistema de botones e íconos animados

Idea: **cada acción tiene su dibujo, y el dibujo hace lo que la acción promete.** Los
botones siguen siendo enlaces o botones reales, con su texto visible; el dibujo acompaña,
nunca sustituye al texto.

| Elemento | Dibujo | Al pasar el cursor o el foco | Al presionar |
|---|---|---|---|
| **Pedir guisos / Ir a la tienda** (principal) | Taco cerrado | El taco se abre y deja ver el guiso; al salir, se cierra | El botón se hunde |
| **Ver cómo se come** | Bolsa al vacío | Se le rasga la esquina | — |
| **Tienda** (cabecera) | Taco chico | Se abre | — |
| **Dirección / mapa** | Nopal señalando | Mueve el brazo | — |
| **Volver a intentar** | Tortilla | Da una vuelta | Da una vuelta |
| **Cargando** (no es botón) | Tortilla en el comal | Se voltea mientras carga | — |
| **Enlaces de texto** | Subrayado de brocha | Se pinta de izquierda a derecha | — |

### Comportamiento
- **Táctil (sin cursor):** el dibujo se anima una vez cuando el botón entra a la pantalla y
  otra al tocarlo. Tocar navega de inmediato: la animación nunca hace esperar.
- **Teclado:** el foco dispara lo mismo que el cursor, y además se ve el anillo de foco azul
  de 3 px. Enter y espacio funcionan como en cualquier enlace o botón.
- **Movimiento reducido:** el dibujo queda fijo en su cuadro más claro (el taco, abierto).
- **Lector de pantalla:** el nombre es el texto visible; el dibujo va oculto para el lector.
  «Cargando» se anuncia con texto.
- **Sin JavaScript:** el cursor y el foco siguen animando (es CSS); solo se pierde la
  animación al entrar a pantalla.
- **Tamaño:** botón de 52 px de alto como mínimo, dibujo de 40 px, zona táctil de 44 px o más.

### Técnica (un solo mecanismo para todos)
Cada dibujo es una **hoja de sprites** (una tira de 12 cuadros en una sola imagen) animada
con CSS `steps()`. Una sola clase recibe la hoja y el número de cuadros; así el taco, la
bolsa y la tortilla comparten el mismo código. Las hojas salen de videos cortos generados
por Alejandro (M5, M10), de los que se extraen los cuadros. **Mientras llegan**, el
prototipo usa versiones provisionales dibujadas en SVG, rotuladas como provisionales.

---

## Orden de carga y rendimiento

1. HTML, CSS, fuente y la imagen del héroe: es lo único que se pide al abrir.
2. Después: sprites de botones y el menú en vivo.
3. Al acercarse a la escena 3: GSAP y la secuencia de cuadros.
4. Al acercarse a cada una: fotos de guisos y de la taquería (carga diferida).

Presupuestos de peso: en [metodologia.md](metodologia.md).

## Lo que se conserva de la versión actual
El mismo `api()`, `money()` y `esc()` de la tienda; los estados de cargando, error y vacío;
el contenido completo sin JavaScript; todo el movimiento dentro de la preferencia de
movimiento; la tienda en `/tienda/` sin tocar.

## Lo que este guion necesita de Alejandro
1. Aprobar o cambiar el orden y el contenido de las escenas.
2. Decir si **ya existe una bolsa empacada real** para fotografiar y grabar (de eso depende
   que la escena 3 sea real o ilustrada).
3. Producir los materiales indispensables de [materiales.md](materiales.md).
