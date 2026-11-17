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
