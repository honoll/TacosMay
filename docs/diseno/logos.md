# Exploración de logotipos — Los Tacos May

Alejandro vio la landing en la ruta 3 y el logotipo no lo convenció: «el cactus puede ser
solo la silueta o algo así diferente, un logo que combine ambas cosas». Ya no pide un calco
fiel del letrero. Lo que no cambia: el nombre **«May»** (el apodo de su papá) y **un cactus**,
para una taquería rápida de gente que trabaja, con oficio y sin pretensión
([plataforma.md](plataforma.md), [sistema.md](sistema.md)).

- **Verlos:** `http://localhost:5000/marca/logos.html` (código en `frontend/marca/logos.js`,
  `logos-vista.js` y `logos.css`; enlazado desde `/marca/`).
- **Estado:** exploración para elegir. **Ninguno está aplicado** al sistema, a la landing ni a
  la tienda.
- **Cómo están hechos:** las letras de «May» y el cactus son **dibujo propio en vector**,
  construido por coordenadas (no es una fuente). «Los Tacos» va en Barlow Condensed, la
  tipografía del sistema. En el concepto 7, «Los» y «Tacos» van en Alfa Slab One.
- **Cómo se revisaron:** convertí cada dibujo a imagen y lo miré (en color, en blanco sobre
  negro y a 24 px), y corregí lo que salía mal. **No se han visto en la página**, con sus
  fuentes y en sus siete contextos.

## Qué hace que el cactus sea «el de May»
Tres rasgos del letrero, que se conservan en todos los conceptos donde hay cactus:
**el brazo izquierdo tendido casi horizontal, el derecho que sube, y el sombrero ladeado.**
Un cactus simétrico con sombrero derecho es el de cualquier souvenir; este no lo es.

## Los siete conceptos

| # | Nombre | Familia | La idea | Conserva del letrero | Deja | Riesgo principal |
|---|---|---|---|---|---|---|
| 1 | **El cactus de May** | Silueta + nombre | El cactus reducido a su silueta, con sombrero y dos ojos; al lado, «May» en letra pesada | La postura, el sombrero, la mirada; «May» rojo | Color del cactus, rayas, chapas, contorno, escalonado | Sigue cerca del cliché «cactus con sombrero»; lo salva la postura |
| 2 | **La placa** | Silueta, máxima síntesis | Tres cápsulas y una raya ladeada por sombrero, dentro de una placa. Es un ícono | La postura y la inclinación del sombrero | La cara, las flores, lo pintado | Tan sintético que puede leerse como un cactus cualquiera |
| 3 | **La Y es el cactus** | Marca combinada | La «Y» de «May» es el cactus: sus dos brazos, flores en las puntas y el sombrero en la horquilla | Brazos desiguales, flores, sombrero | El cactus como figura aparte; la cara | Si el sombrero pesa de más, la «Y» deja de leerse |
| 4 | **El cactus lleva el nombre** | Marca combinada | El cuerpo del cactus es una placa con «May» calado; le salen los brazos y lleva el sombrero | Sombrero, brazos desiguales, flores | El rojo de «May»; la silueta alta | Se vuelve mascota más que logotipo; «Los Tacos» queda fuera |
| 5 | **La charola de May** | Cactus + producto | La charola del sistema con «May» grabado y el cactus saliendo de ella | El cactus con sombrero; «May» | El rojo de «May»; el letrero | **Se lee como una maceta.** Ver abajo |
| 6 | **May, a secas** | Solo letras | «May» con remates cuadrados, pesado, sin símbolo; el cactus queda como sello aparte | Los remates cuadrados; el rojo | El cactus dentro del logotipo | Pierde lo más simpático de la marca |
| 7 | **El letrero** | Lo más cercano a lo pintado | Tres renglones que suben, «May» rojo con contorno y más grosor abajo, el cactus a un lado | El escalonado, el contorno, el amarillo, el cactus con cara | Nada: es la referencia | El más complejo; el que peor aguanta 24 px y una tinta |

Cada uno se muestra grande, a 24 px, a una tinta en negro, en blanco sobre oscuro, sobre el
rojo de la marca, en la cabecera de la landing y en la etiqueta de la bolsa.

## Lo que vi al revisarlos

- **3** es el que mejor une las dos cosas: sigue leyéndose «MAY» de un vistazo y el cactus no
  es un adorno pegado, es una letra. Su versión chica (la «Y» sola) funciona como sello.
- **1** es claro y simpático; los ojos le dan carácter, pero a 24 px se pierden y queda la
  silueta, que sigue leyéndose.
- **2** es el más limpio a 24 px: está hecho para eso.
- **4** quedó como un personaje chaparro con el nombre en la panza. Tiene gracia, pero es
  una mascota; como firma de una etiqueta pesa mucho.
- **5** tiene un problema que no se arregla con ajustes: **un cactus saliendo de un
  recipiente se lee como planta en maceta**, no como comida servida. Lo dejo en la página
  para que se vea por qué no, pero no lo recomiendo.
- **6** es correcto y sobrio. Los remates están resueltos de forma sencilla; si se eligiera,
  la letra pediría un segundo pase de dibujo.
- **7** se sostiene grande y se cae en chico, como era de esperarse.

## Recomendación

**Primera opción: el 3, «La Y es el cactus».**
1. Es lo que pidió Alejandro al pie de la letra: un logotipo que combina las dos cosas.
2. Es **solo de esta marca**: funciona porque el nombre termina en «Y». Nadie más puede usarlo.
3. Es compacto: una palabra. Cabe en la cabecera, en la etiqueta y en un sello.
4. Aguanta una tinta, y deja un símbolo chico natural (la «Y» con sombrero).
5. Va con la ruta 3: letra pesada y de despacho, sin adorno; el cactus entra sin volverla caricatura.

**Segunda opción: el 1, «El cactus de May», con el 2 como su ícono.** Es el camino seguro:
símbolo y nombre separados, fáciles de usar cada uno por su lado. Si la familia quiere
seguir viendo «al cactus» como personaje, es este.

Lo que haría falta al elegir, en cualquiera de los dos:
- Un **segundo pase de dibujo** de las letras (curvas, espacios entre letras, el hueco de la
  «A») y del sombrero, viéndolo en pantalla con Alejandro.
- Versiones del sistema: horizontal, sello, una tinta, sobre claro y sobre oscuro; área de
  respeto y tamaños mínimos (lo que hoy dice [sistema.md](sistema.md), sección 1, se reescribe).
- Decidir si «May» sigue en rojo con el cactus en negro, o todo a una tinta.

## Parecidos con otras marcas

Revisé cada uno contra lo que conozco de marcas de taquerías, comida mexicana y cadenas:
**no reconozco en ninguno el logotipo de otra empresa.** Dos avisos honestos:

- **El 4** (sombrero sobre una placa con el nombre) pertenece a un tipo muy usado en
  restaurantes mexicanos en general. No copia a ninguno que yo identifique, pero es el menos
  distintivo por género.
- **El 2** es un cactus mínimo en una placa: el género «ícono de cactus» está muy poblado. Lo
  distinguen la postura y el sombrero ladeado, que son pocos rasgos.

Es una revisión de memoria, no una búsqueda de marcas registradas. **Antes de registrar el
elegido hace falta una búsqueda formal** (`PENDIENTE-CLIENTE`).

## Verificación
- `node --check` de `logos.js`, `logos-vista.js` y `marca.js` sin errores.
- La página se armó con un DOM simulado: 651 etiquetas que abren y 651 que cierran, sin
  valores vacíos, anclas resueltas, sin ids repetidos, ninguna clase sin regla.
- Los siete dibujos se convirtieron a imagen y se revisaron a la vista.
- **Sin verificar:** la página en el navegador (375 px y escritorio), los dibujos con las
  fuentes del sistema (en mi revisión «Los Tacos» salió con una fuente genérica), y el
  contorno del concepto 7, que en la página depende del CSS.

---

# Segundo pase: el 3 y el 4 (17-nov-2026)

Alejandro eligió seguir con dos: «entre el 3 y el 4 se ven muy bien, solo hay que seguir
mejorándolos».

- **Verlo:** `http://localhost:5000/marca/logos-2.html` (enlazado desde `/marca/` y desde
  `logos.html`). Código: `frontend/marca/logos-2.js` (dibujos) y `logos-2-vista.js`.
- **Sigue sin aplicarse ninguno** al sistema, a la landing ni a la tienda.

## Qué se redibujó
- **Letras de «May»:** pesos parejos (28 de 100 de alto), el hueco de la «A» más abierto y la
  barra más delgada, esquinas redondeadas un poco más. Espacios ajustados letra por letra: «M»
  y «A» casi juntas, y la «A» y la «Y» metidas una en otra, porque sus diagonales dejan aire.
- **El cactus:** se corrigió la postura. En el primer pase el brazo izquierdo quedaba más alto;
  ahora el **izquierdo es el corto y bajo** y el **derecho el largo y alto**, como en el letrero.
- **El sombrero:** copa en pico más baja y ala más ancha; en el 4 era demasiado grande y
  tapaba el texto, y se redujo.
- **Una tinta:** el sombrero y las flores llevan un **filo del color del fondo** que los
  despega de la letra. Sin él, en negro o en blanco el sombrero se fundía con la «Y».
- **«Los Tacos»:** ya no es texto que depende de que cargue la fuente; es el **trazo real de
  Barlow Condensed SemiBold** convertido a dibujo, así que se revisó con la fuente verdadera.

## Variantes del 3 · La Y es el cactus
| | Qué cambia | A favor | En contra |
|---|---|---|---|
| **3A** | Sombrero en la horquilla, flores en las puntas, «Los Tacos» arriba | Es la que más se lee como cactus sin dejar de ser «Y» | El sombrero ocupa el centro de la letra: a tamaños muy chicos se empasta |
| **3B** | Sombrero colgado del brazo alto; sin flores ni «Los Tacos» | La «Y» más limpia; la más corta | Sin flores se lee «una Y con sombrero», menos cactus |
| **3C** | «MA» en rojo y la «Y» en negro, flores rojas, «Los Tacos» abajo | El cactus se ve de inmediato | Parte la palabra en dos colores: puede leerse «MA» + figura |
| **3D** | Sin sombrero, solo brazos y flores; «Los Tacos» a la izquierda, en una línea | La más sobria; cabe en una cabecera baja | Pierde el sombrero, que es medio personaje |

## Variantes del 4 · El cactus lleva el nombre
| | Qué cambia | A favor | En contra |
|---|---|---|---|
| **4A** | Pastilla baja con «Los Tacos» y «May» calados dentro | Todo en una pieza; resuelve dónde va «Los Tacos» | Sigue siendo una mancha negra grande |
| **4B** | El cuerpo es un marco; «May» en rojo; «Los Tacos» abajo | Pesa la mitad y «May» recupera su rojo | El marco fino se pierde en chico |
| **4C** | De pie: tronco alto con las tres letras apiladas | Deja de ser chaparro: es un cactus y es un sello | Leer en vertical es más lento; no sirve como firma de una línea |

## Los dos juntos
**Fundirlos en una pieza no funciona:** los dos ya unen cactus y nombre, así que juntarlos
pone un cactus dentro de otro y se duplica el sombrero.

**Como sistema, sí:** el 3 firma y el 4 sella. La palabra (3A) va donde hay que leer el
nombre: cabecera, etiqueta, caja. El cactus de pie (4C) va donde hace falta un símbolo: ícono
de pestaña, cierre de la caja, esquina de la etiqueta. Comparten letras y sombrero, así que
se reconocen como de la misma marca. Nunca van pegados.

## Recomendación
**El sistema: 3A como logotipo y 4C como sello.**
1. No obliga a escoger entre los dos que le gustaron a Alejandro: cada uno hace lo que hace bien.
2. **3A** es el más equilibrado del 3: se lee «MAY» de un vistazo y cactus al segundo.
3. **4C** resuelve el diagnóstico del 4 (chaparro y pesado) cambiando la proporción en vez de
   adelgazarlo, y es lo que mejor funciona a 24 px.

**Segunda opción: el 3A solo,** con la «Y» como sello. Más simple; pierde al cactus de cuerpo
entero.

Si se prefiere el 4 como logotipo principal, que sea el **4B** (con 4C de sello); el 4A queda
como versión compacta.

Decisiones que le tocan a Alejandro: sombrero en la horquilla o en el brazo (3A o 3B); con
flores o sin ellas; cactus rojo o negro (3A o 3C).

## Verificación del segundo pase
- Todos los dibujos se convirtieron a imagen y se revisaron a la vista, en color, en blanco
  sobre negro y a 24 px de alto; se corrigieron el sombrero del 4 (tapaba «Los Tacos») y la
  fusión del sombrero con la «Y» a una tinta.
- `node --check` de los módulos; la página armada con un DOM simulado: 463 etiquetas que
  abren y 463 que cierran, sin valores vacíos, sin ids repetidos, ninguna clase sin regla.
- **Sin verificar:** la página en el navegador (los contextos de cabecera, etiqueta y pestaña
  solo se armaron, no se vieron); el sello del 3 sobre rojo; parecidos con marcas registradas
  (sigue siendo revisión de memoria).

