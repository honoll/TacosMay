# Sistema de identidad — Los Tacos May · ruta 3 «La barra»

El manual de la marca. Sirve para que alguien que no estuvo en el proceso produzca una pieza
correcta. Alejandro eligió esta ruta el 17-nov-2026, y después el logotipo: **4B como
principal y 4C como sello** (la exploración está en [logos.md](logos.md)).

- **Verlo hecho:** `http://localhost:5000/marca/sistema.html` (código en `frontend/marca/`).
  Los valores viven en `frontend/marca/sistema.js`; este documento los explica.
- **De dónde sale:** [plataforma.md](plataforma.md) (idea central: **«Ya está hecho.»**) y
  [rutas.md](rutas.md). Cómo se producen las imágenes: [direccion-de-arte.md](direccion-de-arte.md).
- **Estado:** propuesta completa, **pendiente de aprobación** de Alejandro y su familia. La
  plataforma y la frase de marca tampoco están aprobadas todavía; se trabaja con «Ya está
  hecho.» y las otras dos frases quedan como candidatas.
- Lo que falta del negocio va como `PENDIENTE-CLIENTE`. Lo supuesto va como **[HIPÓTESIS]**.

## La idea en una línea

Lo que ves al llegar a la barra: **charolas calientes en fila, cada guiso con su color, y
«May» respondiendo por todas.** Todo lo demás (tipografía, pictogramas, movimiento, voz) es
de despacho: claro, rápido y sin adornos. Bien hecho, no pretencioso.

---

## 1. Logotipo

**El cactus lleva el nombre.** El cuerpo del cactus es una placa con «May» adentro; le salen
los dos brazos a distinta altura y lleva el sombrero ladeado. Es dibujo propio en vector:
ni las letras ni «Los Tacos» dependen de una fuente. Ya no se calca el letrero pintado: de él
quedan el cactus, el sombrero y el rojo de «May».

### Construcción
| Pieza | Regla |
|---|---|
| **El cuerpo** | Un marco negro de esquinas redondas, con el interior crema. Es la «placa» donde va el nombre |
| **«May»** | Mayúsculas pesadas y geométricas, dibujadas a mano en vector, en **rojo May** |
| **Los brazos** | Dos, en negro, de punta redonda: el **izquierdo corto y bajo**, el **derecho largo y alto**. Cada uno termina en una flor roja |
| **El sombrero** | Negro, de copa en pico y ala ancha, **ladeado** hacia la izquierda, asentado sobre el cuerpo |
| **«Los Tacos»** | Barlow Condensed SemiBold en mayúsculas muy espaciadas, centrado debajo. Va como trazo, dentro del archivo |

Lo que lo hace «el de May» y no un cactus cualquiera: **los brazos desiguales y el sombrero
ladeado.** No se enderezan ni se igualan.

### Versiones y cuándo va cada una
Archivos en `frontend/marca/logo/`. Cada versión existe a color, a una tinta en negro
(`-negro`) y a una tinta en blanco (`-blanco`).

| Versión | Archivo | Qué es | Cuándo |
|---|---|---|---|
| **Principal** (4B) | `principal.svg` | El cactus con «May» y «Los Tacos» debajo | Cuando hay sitio: **200 px de ancho o más** (50 mm). Portadas, pie, imagen para compartir |
| **Compacta** (4B sin texto) | `compacta.svg` | Lo mismo, sin «Los Tacos» | Cabeceras y espacios bajos: **de 96 a 200 px de ancho** (25 a 50 mm) |
| **Sello** (4C) | `sello.svg` | El cactus de pie, con M, A, Y apiladas y caladas | Todo lo chico o cuadrado: **menos de 96 px de ancho**, ícono de pestaña, esquina de etiqueta, cierre de caja. Mínimo **24 px de alto** (8 mm) |
| **Ícono** | `icono.svg` | El sello sobre una placa crema redondeada | Pestaña del navegador y accesos directos |

- **Por qué hay tres:** en chico, el marco de la principal se adelgaza y «Los Tacos» deja de
  leerse. Por eso primero se suelta el texto (compacta) y después se cambia de pieza (sello).
  El trazo del marco se engrosó de 10 a 12 para aguantar hasta 96 px.
- **Sobre claro** (crema, acero): versión a color. Sobre acero también vale `-negro`.
- **Sobre oscuro y sobre el rojo:** siempre `-blanco`. La versión a color no se usa ahí.
- **Una tinta** (`-negro`): cartón, sellos de goma, impresión barata.
- **Área de respeto:** alrededor, libre, el alto de la copa del sombrero.
- **El principal y el sello no van pegados.** Uno u otro, según el tamaño.

### Contraste
«May» en rojo sobre el interior crema: 5.3:1. Marco, brazos y sombrero en negro sobre crema:
17.0:1; sobre acero: 13.6:1. Versión en blanco sobre negro: 17.0:1; sobre el rojo: 5.3:1.
Todos pasan AA.

### Usos incorrectos
Cambiarle los colores · estirarlo, inclinarlo o girarlo · sombras suaves, brillo o
degradado · ponerlo sobre una foto o sobre un color de guiso · usar la versión a color sobre
negro o rojo · escribir «May» con una fuente en lugar del dibujo · añadirle cara, ropa o
accesorios al cactus · igualar los brazos o enderezar el sombrero.

### Pendiente
- Un repaso de dibujo viéndolo en pantalla con Alejandro (curvas de las letras, sombrero).
- Búsqueda formal de marcas registradas antes de registrarlo (`PENDIENTE-CLIENTE`).

---

## 2. Color

### Base
| Nombre | Valor | Uso | Texto encima |
|---|---|---|---|
| Acero | `#D9DCDD` | Fondo de barra, marco claro | negro 13.6:1 |
| Acero oscuro | `#6F777B` | Borde de charola, líneas | blanco 4.6:1 |
| Negro | `#141210` | Texto, botones, una tinta | blanco 18.7:1 |
| Crema | `#F7F4EE` | Papel: fondo de página, etiquetas, tickets | negro 17.0:1 |
| Rojo May | `#C8161F` | «May» y las flores del cactus, en el logotipo | blanco 5.8:1 |
| Gris texto | `#4F5659` | Texto secundario | blanco 7.5:1 |

Pares verificados (fórmula WCAG): gris texto sobre crema 6.8 y sobre acero 5.4; rojo May
sobre crema 5.3; negro sobre cartón 7.9; borde de charola sobre crema 4.2 y sobre acero 3.3
(es borde, mínimo 3).

**Proporción:** crema y acero mandan; negro para texto y botones. El rojo aparece solo en
el logotipo. El color fuerte de cada pieza lo pone el guiso.

### Un color por guiso
Los 14 del pizarrón, en su orden; el número es el de su charola. **[HIPÓTESIS]: cada color
sale hoy del nombre y de la descripción general del platillo; se fija con el guiso real
delante.** Lo mismo las recetas: `PENDIENTE-CLIENTE`.

| Charola | Guiso | Color | Texto encima |
|---|---|---|---|
| 01 | Corazón de vaca enamorada | `#7A2530` | blanco 9.8:1 |
| 02 | Chorizo con huevo | `#F2B33D` | negro 10.0:1 |
| 03 | Salpicón | `#C9D46A` | negro 11.7:1 |
| 04 | Nopalitos | `#55752B` | blanco 5.3:1 |
| 05 | Mole con pollo | `#4A2A1C` | blanco 12.8:1 |
| 06 | Bistek con papa | `#C39A5E` | negro 7.2:1 |
| 07 | Chicharrón en salsa | `#E08A3C` | negro 7.0:1 |
| 08 | Rajas con queso y crema | `#35603A` | blanco 7.3:1 |
| 09 | Carne en salsa roja | `#A8321C` | blanco 6.7:1 |
| 10 | Tinga de res | `#B9471F` | blanco 5.3:1 |
| 11 | Barbacoa | `#6B4226` | blanco 8.6:1 |
| 12 | Cabeza | `#B3A594` | negro 7.8:1 |
| 13 | Lengua | `#8A4A63` | blanco 6.5:1 |
| 14 | Barbacoa de borrego | `#3D4A26` | blanco 9.5:1 |

Reglas:
1. **El color nunca va solo.** Siempre lo acompañan el número de charola y el nombre: varios
   cafés y rojos se parecen, y hay gente que no distingue colores.
2. El texto sobre un color de guiso es negro o blanco, el que la tabla indica.
3. Los colores claros (02, 03, 06, 07, 12) van siempre dentro del marco de acero.
4. Un color de guiso no se usa para otra cosa: ni botones, ni títulos, ni fondos de sección.
5. La **franja de colores** (botón principal, cinta de la caja) usa cuatro: 09, 02, 08 y 07
   (el 05, mole, no se distingue sobre el negro del botón).

---

## 3. Tipografía

Todas con licencia SIL Open Font License, guardadas en `frontend/fuentes/` con su `OFL`.

| Papel | Fuente y peso | Tratamiento | Tamaño |
|---|---|---|---|
| **Título grande** | Barlow Condensed ExtraBold | Mayúsculas, interlínea 0.86–0.9 | de 48 a 96 px según pantalla |
| **Título de sección** | Barlow Condensed ExtraBold | Mayúsculas | 32 px |
| **Nombre de guiso** | Barlow Condensed ExtraBold | Mayúsculas, interlínea 0.95 | 20–32 px |
| **Datos y botones** | Barlow Condensed SemiBold | Mayúsculas, espaciado 0.1 em | 14–18 px |
| **Precios y números** | Barlow Condensed ExtraBold | Cifras alineadas (tabulares) | 26–40 px |
| **Texto** | Barlow Regular; SemiBold para resaltar | Frases cortas, hasta 34 em de ancho | 17 px, interlínea 1.5 |
| **Menú a plumón** | Kalam Bold y Regular | Solo en el pizarrón del menú | 18 px |

Reglas: dos familias de trabajo (Barlow Condensed y Barlow); Kalam es la excepción
registrada para el menú. Las mayúsculas angostas son para títulos y datos, nunca para un
párrafo. «May» y «Los Tacos» del logotipo **no son texto**: son dibujo, dentro de sus archivos. Rammetto One (de la landing anterior) quedó fuera del sistema y se retiró.

---

## 4. El código de tres plumones (solo en el menú)

Es de ellos: así está escrito su pizarrón. Se conserva como regla del menú y de ningún otro
lugar.

| Plumón | Valor | Qué escribe |
|---|---|---|
| **Negro titula** | `#1B1B1B` | El título del menú y de cada grupo |
| **Rojo nombra** | `#C4202A` | Los nombres de los guisos |
| **Azul cuenta** | `#1F4FA3` | Precios, cantidades y las rayas que separan grupos |

Sobre el blanco del pizarrón (`#FFFDF7`): rojo 5.8, azul 7.6. El menú se ordena **por
precio**, como el pizarrón real. El azul es además el color del anillo de foco del teclado
en todo el sitio.

---

## 5. Pictogramas de despacho

Doce, dibujados en `frontend/marca/sistema.js`: **charola, cucharón, vapor, reloj, bolsa,
rompe, calienta, taco, congelado, caja, lugar y listo.**

- **Retícula** de 24 unidades con **margen de 2**.
- **Formas llenas** y geométricas, esquinas redondeadas con radio de 1 a 2.
- **Trazo solo donde la forma es una línea** (vapor, flama, copo, palomita): grosor 2 (3 en
  la palomita), punta redonda.
- **Un solo color:** el del texto que acompañan. Nunca un color de guiso.
- Tamaño mínimo 16 px. Siempre junto a su palabra; solos, llevan nombre accesible.
- Un pictograma nuevo se dibuja con estas reglas; no se toma de un banco de íconos.

---

## 6. Retícula y composición

**La charola es el módulo.** Todo lo que muestra un guiso es una charola.

- **Anatomía:** marco de acero (1/16 del ancho, con una línea fina de acero oscuro), arriba
  el guiso (proporción 4:3: su color o su foto) con el **número arriba a la izquierda** y el
  vapor arriba a la derecha; abajo, sobre crema, nombre, datos y acción.
- **En fila:** dos por renglón en celular, cuatro desde 700 px, cinco desde 1280 px y seis
  desde 1600 px; separación de 1/8 del ancho de una charola.
- **Charola sin foto:** más baja (proporción 5:2), con el cepillado del acero sobre su color y
  el número grande. Se ve como una charola tapada, no como un hueco.
- **Ritmo:** una fila de charolas y después texto o aire. Nunca dos retículas seguidas.
- **Jerarquía:** un solo título grande por pantalla; lo importante arriba y a la izquierda.

### El lienzo es toda la pantalla (regla del 17-nov-2026)
Antes el contenido se quedaba en 1120 px y los lados quedaban vacíos. Ahora:

- **Margen que crece con la pantalla:** de 16 px en celular a 64 px en escritorio
  (`--margen: clamp(16px, 4vw, 64px)`), con un tope de 1680 px de contenido (`--ancho`). Los
  fondos (acero, negro, crema) van siempre de lado a lado.
- **El ancho se gana con columnas, no estirando:** más charolas por fila, y composiciones en
  dos columnas desde 1100 px (en el héroe, titular y texto lado a lado y la barra debajo, a todo
  lo ancho; datos y
  explicación en el ticket del envío; lista y resumen en el carrito; formulario y lista en admin).
- **El texto corrido no se estira:** un párrafo no pasa de unos 34 em de ancho en la landing
  ni de 60 em en la tienda, aunque el lienzo sea total.
- **Imágenes:** cada foto de guiso tiene dos tamaños (720 y 1024 px de ancho) y el navegador
  elige según el tamaño de la charola.
- En celular no cambia nada: una o dos columnas y 16 px de margen.

---

## 7. Materiales y texturas

| Material | Dónde | Cuándo no |
|---|---|---|
| **Acero cepillado** (líneas finas horizontales sobre `#D9DCDD`) | Fondo de la barra, marco de charola | Debajo de párrafos; como adorno suelto |
| **Papel de ticket** (crema, orilla punteada, renglones con puntos) | Datos, recibos, etiqueta, pedidos | Para títulos o para la marca |
| **Cartón natural** (`#C9A26B`) | La caja de envío, a una tinta | En pantalla, salvo para mostrar la caja |
| **Vapor** | Sobre una charola, una vez | En bucle o como fondo |

No se usan: madera (se queda en el letrero del local), texturas de papel viejo, manchas,
grano fotográfico ni brillos.

---

## 8. Fotografía de comida

Vale igual para fotos reales y para imágenes generadas.

- **Encuadre:** desde arriba, a 90°, y **el guiso llena todo el cuadro**, de orilla a
  orilla. La foto es la superficie del guiso; **el marco de acero lo pone el diseño**. Así
  todas las charolas son idénticas y solo cambia la comida.
- **Luz:** pareja, de barra, ligeramente cálida; sin sombras duras ni reflejos quemados.
- **Qué se ve:** la textura del guiso: salsa, trozos, grasa, lo que lleve. Casero y servido,
  no acomodado.
- **Qué no se ve:** platos, manteles, manos, cubiertos, tortillas alrededor, fondo
  desenfocado, cilantro o adornos puestos para la foto, texto.
- **Los otros dos estados del producto:** la **bolsa** al vacío y el **taco** servido se
  fotografían también desde arriba, sobre acero, con la misma luz.
- **Edición:** solo luz y color. La comida no se cambia.
- Lo generado de comida y de la bolsa es **provisional** y lleva en el código
  `PENDIENTE-CLIENTE: imagen generada con IA, sustituir por foto real antes de publicar o vender`.
- **No se genera** el local, la barra con gente ni personas.

---

## 9. Voz

**Principios:** de tú · frases cortas, lo importante primero · habla alguien (May y su
gente), no «la empresa» · dice lo que hay y lo que falta · un guiño como máximo por pantalla.

| Sí | No |
|---|---|
| guiso, charola, barra, servir, listo, caliente, taquear, nomás, pásale | gourmet, premium, artesanal, experiencia, exquisito, delicioso, soluciones, «auténtico sabor mexicano» |

| Dónde | Ejemplos |
|---|---|
| **Titulares** | «Ya está hecho.» · «Llegas, comes y te vas.» · «El guiso ya está. Tú nomás calienta.» |
| **Botones** | «Pedir guisos» · «Agregar» · «Ver el menú» · «Cómo llegar» |
| **Estados vacíos** | «Tu carrito está vacío. Las charolas, no.» · «Todavía no tienes pedidos.» |
| **Se acabó y errores** | «Se acabó por hoy.» · «No pudimos leer el menú. Dale otra vez.» · «Tu sesión venció. Entra de nuevo.» |
| **Etiqueta** | «Rompe. Calienta. Taquea.» · «Ya está hecho. Nomás calienta.» |

Nunca: cifras, años exactos, premios u opiniones inventadas; promesas de envío, tiempo o
precio sin confirmar. `PENDIENTE-CLIENTE`: cómo saludan y se despiden en la barra, y sus
dichos; cuando se sepan, entran aquí y mandan sobre estos ejemplos.

---

## 10. Movimiento

**Principios:** corto, seco, funcional. Nada hace esperar; lo que se mueve explica algo; con
movimiento reducido todo queda quieto y completo.

| Qué | Cómo | Qué comunica |
|---|---|---|
| **Una charola entra** | Se desliza 16 px desde la derecha y aparece, en 180 ms; en fila, una cada 40 ms | Llegan a la barra, como sobre un riel |
| **El vapor** | Tres líneas suben 8 px y aparecen, una sola vez (1.2 s) al entrar o al pasar el cursor | Está caliente |
| **Un botón responde** | La franja de colores se abre al pasar el cursor o el foco; al presionar, se hunde 2 px | Se puede accionar; se accionó |
| **Cargando** | Tres charolas chicas se llenan en secuencia | Ya viene |
| **Listo** | La palomita se traza una vez | Quedó |
| **Empacado** (al agregar al carrito, en la tienda) | El guiso cae a una bolsa, se le saca el aire, se sella, recibe su etiqueta y la bolsa vuela al carrito; unos 2 s en total, sin detener nada | Qué es el producto: guiso ya hecho, empacado al vacío |

Límites: duraciones de 120 a 250 ms para respuesta, 1.2 s como máximo para un gesto (la
única secuencia más larga es el empacado, de 2 s, y no bloquea); nada en
bucle salvo «cargando»; sin desplazamiento secuestrado ni rebotes. Todo dentro de
`prefers-reduced-motion: no-preference`. La técnica es CSS; si una escena pide más, se sube
de peldaño con justificación (regla del estudio).

---

## 11. Aplicaciones

| Pieza | Qué lleva |
|---|---|
| **Etiqueta de la bolsa** | Franja del color del guiso con su número · nombre enorme · «Guiso de taquería · al vacío» · renglones de ticket: porciones, contenido neto, lote, caducidad (`PENDIENTE-CLIENTE`) · «Rompe · Calienta · Taquea» con sus pictogramas · «Conserve en congelación» (`PENDIENTE-CLIENTE`: confirmar formato) · logotipo horizontal. Lo que exija la NOM-051 se añade cuando haya producto |
| **Caja de envío** | Cartón natural a una tinta: logotipo en negro y «Ya está hecho.»; la cinta de cierre lleva la franja de colores |
| **Héroe de la landing** | Logotipo horizontal, «Ya está hecho.» en título grande, una línea de apoyo, botón principal y una fila de charolas con los tres guisos que más salen |
| **Tarjeta de guiso en la tienda** | Una charola: color o foto, número, nombre, porciones y existencias, precio y «Agregar». Los datos salen de la API |
| **Botones** | Principal: negro con la franja de colores. Secundario: contorno negro. Enlace: subrayado grueso. Alto mínimo 48 px |
| **Imagen para compartir** | 1200 × 630, crema: logotipo y «Ya está hecho.» a la izquierda, tres charolas a la derecha. Se arma con el sistema, no se genera |

Todas están hechas en `sistema.html`.

---

## 12. Lo que nunca se hace

1. Usar el rojo de «May» en algo que no sea el logotipo.
2. Mostrar un color de guiso sin su número y su nombre.
3. Redibujar o «adornar» al cactus: cara, sarape, huaraches, bigote.
4. Degradados, brillos, sombras suaves, 3D.
5. Fotos en ángulo con plato decorado, o de banco de imágenes.
6. Palabras de lujo: gourmet, premium, artesanal, experiencia.
7. Prometer envío, tiempos o precios sin confirmar; inventar cualquier dato del negocio.
8. Movimiento que haga esperar o que no explique nada.
9. Tocar el letrero del local: la marca nueva convive con él, no lo sustituye.

---

## Lo que necesita aprobación o material

- **Aprobación de Alejandro y su familia:** la plataforma, la frase de marca y este sistema.
- **Los guisos reales delante** para fijar los 14 colores.
- **Datos de la etiqueta:** porciones, contenido neto, formato (`PENDIENTE-CLIENTE`).

## Verificación
- `node --check` de `frontend/marca/sistema.js` y `marca.js` sin errores.
- La página se armó con un DOM simulado: 720 etiquetas que abren y 720 que cierran, sin
  valores vacíos, anclas del índice resueltas, sin ids repetidos.
- Contraste calculado con las mismas funciones de la página: mínimo 5.3 en los colores de
  guiso; el resto, en las tablas de arriba.
- Movimiento solo dentro de `prefers-reduced-motion: no-preference`.
- **Sin verificar:** cómo se ve en pantalla (375 px y escritorio). El contorno de «May» usa
  `paint-order` y algunas piezas usan unidades de contenedor: piden un navegador reciente.
