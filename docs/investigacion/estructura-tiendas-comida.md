# Cómo están estructuradas las tiendas de comida empacada

Fecha de consulta: **17 de noviembre de 2026**. Sirve para reestructurar la tienda y la
landing de Los Tacos May, sobre todo en escritorio.

## Cómo se hizo y qué límites tiene

- **Texto:** se leyó el HTML de la portada, un listado, una página de producto y, donde
  existían, carrito, cuenta y envíos de cada sitio.
- **Retícula:** se abrieron diez listados en un navegador a 1440 px y a 375 px de ancho y
  se contaron por programa las tarjetas por renglón. El conteo es automático: si la página
  tiene carruseles, puede contar de más (pasó con Picard, marcado abajo).
- **No se miraron capturas con detalle:** proporciones, tamaños de foto y composición de
  la página de producto vienen del texto, no de verlas.
- **[VISTO]** = leído en el sitio o medido. **[JUICIO]** = interpretación mía.
- No se copia texto ni imagen de ningún sitio.

## 1. La muestra

Catorce tiendas leídas y tres que no se pudieron abrir.

| # | Sitio | País | Qué vende | Por qué entra | Qué se leyó |
|---|---|---|---|---|---|
| 1 | [Lappe Cocina](https://lappecocina.com/) | México | Comida casera congelada al alto vacío | El competidor más parecido; tienda de una sola página | Portada y zonas |
| 2 | [Risto](https://risto.mx/) | México | Comida congelada al alto vacío | Negocio chico que vende por WhatsApp, sin carrito | Portada |
| 3 | [Freshbox](https://freshbox.mx/collections/all) | México | Carnes y mariscos congelados al vacío | Único con envío nacional en frío documentado | Portada, listado (medido), carrito, preguntas frecuentes |
| 4 | [Carnes Ramos](https://tienda.carnesramos.com.mx/) | México | Cortes de carne | Tienda Shopify mexicana típica | Portada |
| 5 | [El Cerdito](https://elcerdito.mx/) | México | Cochinita al alto vacío | Marca regional con sitio de folleto | Portada |
| 6 | [Mosaic](https://www.mosaicfoods.com/collections/veggie-bowls) | EE. UU. | Comidas congeladas por caja | Congelado directo al consumidor, por paquetes | Portada, listado (medido), paquete, cuenta |
| 7 | [Fly By Jing](https://flybyjing.com/collections/shop) | EE. UU. | Salsas de marca | Marca chica con tienda muy trabajada | Portada, listado (medido), producto, carrito, cuenta, preguntas |
| 8 | [Somos](https://eatsomos.com/collections/all) | EE. UU. | Comida mexicana empacada | Misma categoría cultural | Portada, listado (medido), carrito |
| 9 | [COOK](https://www.cookfood.net/menu/main-meals/bestsellers) | Reino Unido | Comidas preparadas congeladas | Referente grande del congelado listo | Portada, listado (medido), producto, canasta, cuenta, envíos |
| 10 | [Picard](https://www.picard.fr/rayons/plats-cuisines) | Francia | Congelados | El catálogo más grande y el más completo en ficha | Portada, listado (medido), producto, cuenta, servicios |
| 11 | [Gran Luchito](https://gran.luchito.com/our-products/) | Reino Unido | Salsas mexicanas | Marca sin carrito: manda a comprar a otros | Portada y listado |
| 12 | [Nosh](https://nosh.jp/menu) | Japón | Comidas congeladas por suscripción | Modelo «plan primero» | Portada, menú (medido), producto, acceso |
| 13 | [Liv Up](https://www.livup.com.br/marmitas) | Brasil | Comidas congeladas | Referente latinoamericano | Portada, listado (medido), producto, zona de entrega |
| 14 | [Frizata](https://www.frizata.com/) | Argentina | Congelados | Portada que ya es el catálogo | Portada (parcial) |

**No se pudieron abrir:** [Goldbelly](https://www.goldbelly.com/) y
[Factor](https://www.factor75.com/) (verificación contra bots, tanto en lectura como en
navegador; no se intentó saltarla) y [Licious](https://www.licious.in/) (solo muestra un
acceso con número de celular). Goldbelly era el caso más cercano —restaurantes que mandan
su comida congelada— y queda pendiente de mirar a mano.

En Freshbox, Carnes Ramos, Somos y Mosaic varias páginas respondieron «demasiadas
peticiones» al leerlas como texto; de esas se tiene el listado medido pero no la página de
producto.

## 2. Anatomía, página por página

### Inicio

[VISTO] Orden que más se repite, de arriba abajo:

1. **Barra de aviso** con la condición de envío (Freshbox, Fly By Jing, Carnes Ramos, Liv
   Up, COOK).
2. **Encabezado.**
3. **Héroe** con una sola acción.
4. **Producto con precio.**
5. **Cómo funciona,** en 3 o 4 pasos (Lappe, Mosaic, Freshbox, Nosh).
6. **Prueba:** reseñas o testimonios.
7. **Pie.**

Cuánto producto se ve en la portada y si se puede comprar ahí:

| Portada | Productos | ¿Se agrega al carrito desde la portada? |
|---|---|---|
| Frizata | ~50 o más | Sí |
| Fly By Jing | ~25 | Sí |
| Nosh | ~20 | No: primero se elige plan |
| Freshbox | ~18 | Sí |
| Lappe | 16 | Sí, con una ventana para elegir sabor |
| COOK | 12 | No: «vista rápida» |
| Liv Up | ~26 | Sí |
| Picard | 10 | Sí |
| Carnes Ramos | 8 | No se vio botón |
| Somos | 0, solo 4 categorías | No |
| Gran Luchito, El Cerdito, Risto | 0 | No tienen carrito |

**Patrón dominante [JUICIO]:** quien vende de verdad en su sitio pone producto con precio
y botón en la portada; las portadas sin producto son de marcas que venden en
supermercado (Somos, Gran Luchito) o por teléfono (El Cerdito, Risto). Las tiendas con
catálogo chico (Lappe, Frizata) usan la portada como catálogo.

**Variante de congelados:** preguntar **primero a dónde se entrega** (Frizata, Liv Up,
COOK, Picard, Mosaic). Aparece arriba de todo o en la ficha del producto.

### Catálogo o listado

[VISTO] Tarjetas por renglón, medidas a 1440 px y a 375 px:

| Sitio | Escritorio | Celular | Ancho de tarjeta en escritorio | Filtros |
|---|---|---|---|---|
| Freshbox | 4 | 2 | ~310 px | Sí, panel a la izquierda |
| COOK | 4 | 2 | ~337 px | Sí |
| Fly By Jing | 4 | 2 | ~267 px | No |
| Somos | 4 | 1 | ~299 px | Sí |
| Mosaic | 4 | 1 | ~254 px | No |
| Liv Up | 4 | 1 | ~285 px | No |
| Nosh | 4 | 2 | — | Sí |
| Picard | no fiable (el conteo incluyó carruseles); tarjetas de ~218 px | 2 (tarjetas de ~170 px) | ~218 px | Sí, el más completo |

**Patrón dominante:** **cuatro columnas en escritorio** en siete de siete medibles;
en celular, **dos** (cuatro sitios) o **una** (tres sitios). Tarjetas de 250 a 340 px.
Nadie pasa de cuatro, salvo Picard, que tiene 319 productos en una sola categoría.

[VISTO] Qué lleva la tarjeta:

| Elemento | Quién lo pone |
|---|---|
| Foto, nombre y precio | Todos los que venden |
| **Gramaje o porción** | Lappe, Freshbox, Carnes Ramos, COOK (personas y gramos), Picard (peso y precio por kilo), Liv Up, Frizata. No lo pone Fly By Jing |
| **Botón de agregar** | Freshbox, Fly By Jing, Picard, Liv Up, Frizata, COOK (uno por tamaño). No lo ponen Nosh ni Gran Luchito |
| Selector de cantidad en la tarjeta | Solo Picard |
| Etiquetas (nuevo, oferta, más vendido) | Freshbox, Fly By Jing, Picard, Frizata, Nosh |
| Íconos de atributo (picante, vegetariano, microondas) | COOK, Liv Up, Nosh |
| Calificación con estrellas | Freshbox, Carnes Ramos, Picard, Nosh |
| Datos nutrimentales en la tarjeta | Liv Up, Nosh |

[VISTO] Filtros y orden: solo los tienen los catálogos grandes. Picard filtra por tipo,
formato, modo de cocción y tiempo; Nosh, por categoría y por alérgenos; Lappe, Liv Up y
Frizata no filtran: **agrupan en secciones con título** dentro de la misma página.

**[JUICIO]** Con catorce guisos no hacen falta filtros. Lo que sí usa todo catálogo chico
es agrupar.

### Página de producto

[VISTO] ¿Existe?

- **Sí, una por producto:** Fly By Jing, COOK, Picard, Nosh, Liv Up, Mosaic, y por
  plataforma Freshbox, Carnes Ramos y Somos (no leídas).
- **No, se vende todo desde el listado:** Lappe (una ventana para elegir sabor), Risto,
  El Cerdito, y Frizata en lo leído.

Es decir: **toda tienda con carrito propio y catálogo estable tiene página por producto,**
menos Lappe, que es la más artesanal.

[VISTO] Qué secciones lleva:

| Sección | COOK | Picard | Liv Up | Nosh | Fly By Jing | Mosaic |
|---|---|---|---|---|---|---|
| Galería de fotos | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tamaños o porciones a elegir | ✓ (1, 2, 4 personas) | — | — | — | ✓ (paquetes) | — |
| Descripción | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| **Ingredientes** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Alérgenos** | ✓ | ✓ | ✓ | ✓ | — | — |
| **Cómo calentar** | ✓ (horno, desde congelado) | ✓ (horno, freidora de aire) | ✓ (microondas) | ✓ (descongelado) | — (no aplica) | ✓ (microondas, estufa, horno) |
| **Información nutrimental** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Conservación** | solo descongelado | ✓ (refrigerador 24 h, congelador a −18 °C, no recongelar) | ✓ (a −18 °C) | ✓ | — | no dice |
| Reseñas | ✓ | ✓ (680 en el ejemplo) | — | ✓ | ✓ (2,461) | ✓ |
| Productos relacionados | ✓ («completa tu comida») | ✓ | — | ✓ | — | — |
| Consulta de cobertura en la ficha | ✓ | — | — | — | — | ✓ |

**Patrón dominante:** las seis fichas de comida leídas llevan **ingredientes e
información nutrimental**; las cinco de congelado llevan **cómo calentar**; cuatro de
cinco, **conservación**. Reseñas y relacionados son de las grandes.

### Carrito

[VISTO]

| Forma | Quién |
|---|---|
| **Panel lateral o desplegable** sobre la página | Lappe, Freshbox, Carnes Ramos, Somos, Liv Up |
| **Página completa** | COOK, Fly By Jing (además de su panel), Somos y Freshbox también la tienen |
| Sin carrito | Risto, El Cerdito, Gran Luchito; Nosh y Mosaic venden por plan o paquete |

Cómo comunican los mínimos y el envío:

- **Pedido mínimo** dicho antes de pagar: Lappe ($550), COOK (£45), Picard (€25).
- **Umbral de envío gratis** en la barra de aviso y en el carrito: Freshbox (arriba de
  $2,000 en CDMX), Fly By Jing (arriba de 75 USD), Picard (€100), Liv Up (primer pedido).
- **Paquetes armados:** Mosaic vende cajas con número fijo de comidas, Liv Up vende kits,
  Fly By Jing tiene un armador de paquete.

**Patrón dominante [JUICIO]:** panel lateral para no sacar a la gente del catálogo, más
una página completa para revisar antes de pagar. El mínimo o el umbral de envío siempre
está a la vista, porque en congelado el envío es caro y la caja tiene que llenarse.

### Cuenta

[VISTO]

| Cómo separan registro e inicio de sesión | Quién |
|---|---|
| **Dos páginas con dirección propia** | Fly By Jing (`/account/login` y `/account/register`); es el estándar de Shopify, que también usan Freshbox, Carnes Ramos y Somos (redirigen a una cuenta alojada por la plataforma, no leída) |
| Una dirección con dos modos | Picard (la misma página con modo de alta), COOK («Entrar · Registrarse» en una página) |
| Entrar en una página y el alta dentro del flujo de compra | Mosaic, Nosh |
| Sin cuenta: solo un formulario de entrega | Lappe |

Qué piden al registrarse: Fly By Jing, cuatro campos (nombre, apellido, correo,
contraseña). Nosh, teléfono o correo y contraseña. Lappe no pide cuenta: nombre, teléfono
y dirección.

Compra como invitado: **ningún sitio lo dice en las páginas leídas.** No se llegó a la
pantalla de pago de ninguno (habría que meter datos), así que queda sin verificar.

**Patrón dominante [JUICIO]:** entrar y registrarse van separados, cada uno con su
dirección, y el formulario de alta es corto. Nadie los pone lado a lado en una sola vista.
La cuenta se pide al pagar, no para mirar ni para llenar el carrito.

### Pago y envío

No se vio ninguna pantalla de pago. Lo que sí se leyó es cómo comunican el envío antes:

| Qué | Cómo |
|---|---|
| **Cobertura** | Consulta por código postal antes de comprar (COOK, Picard, Mosaic, Frizata, Liv Up); página con mapa y lista de ciudades (Liv Up); mapa con buscador de colonia (Lappe); una frase («solo Estados Unidos continental», Fly By Jing) |
| **Costo** | Tarifa fija dicha en preguntas frecuentes: Freshbox ($150 CDMX, $500 nacional), Fly By Jing (8 USD), Picard (€6) |
| **Tiempos** | Días fijos de entrega (Lappe: domingo y lunes, con hora de corte); despacho y tránsito en días (Fly By Jing); horario de entrega (Freshbox) |
| **Cadena de frío** | Freshbox dice con qué va (hielera y geles); Picard pone un sello de garantía en el pie; COOK, Liv Up y Mosaic casi no lo explican en lo leído |

### Navegación y pie

[VISTO] Encabezado:

- **Izquierda o centro:** el logotipo y de 3 a 7 enlaces: tienda (con categorías
  desplegables si hay muchas), paquetes, historia, recetas o cómo funciona.
- **Derecha, siempre:** cuenta y carrito; la búsqueda solo en catálogos grandes
  (Freshbox, Fly By Jing, Picard, Carnes Ramos, Somos). Lappe, Mosaic y Nosh no tienen
  búsqueda.
- El carrito muestra el número de piezas (Lappe, Fly By Jing) o el importe (COOK, Picard).
- Las tiendas de una página (Lappe) usan el menú como anclas a secciones y un botón de
  «pedir».

Pie, grupos que se repiten: ayuda (preguntas, envíos, contacto), la marca (historia),
legal (privacidad, términos), redes y medios de pago. En México, además, WhatsApp.

### Confianza

[VISTO] Dónde responden las tres preguntas:

| Pregunta | Dónde se contesta |
|---|---|
| **¿Llega bien?** | Preguntas frecuentes (Freshbox: empaque y qué hacer); garantía de reembolso en la portada (Mosaic, Picard); reseñas (COOK, Fly By Jing, Picard) |
| **¿Cuánto dura?** | Portada (Lappe: seis meses congelado); preguntas frecuentes (Freshbox: doce meses, y días una vez descongelado); ficha de producto (Picard) |
| **¿Cómo lo caliento?** | **Ficha de producto,** con los pasos por método (COOK, Picard, Liv Up, Mosaic, Nosh); en la portada como promesa de tiempo (Lappe) |

**Patrón [JUICIO]:** lo de cada guiso va en su ficha; lo del envío va una sola vez, en una
página de ayuda enlazada desde la barra de aviso, el carrito y el pie.

## 3. Qué cambia de verdad en escritorio

[VISTO] salvo lo marcado:

1. **Columnas:** de 1 o 2 en celular a 4 en escritorio. Las tarjetas no se estiran: se
   quedan entre 250 y 340 px y entran más.
2. **Filtros:** en escritorio, panel fijo a la izquierda del listado (Freshbox, Picard);
   en celular se esconden tras un botón. [JUICIO sobre el celular: no se abrió el panel.]
3. **Menú:** en escritorio, enlaces a la vista y categorías que se despliegan (COOK,
   Picard, Somos, Freshbox); en celular, un botón de menú. Se vio en las dos capturas que
   se tomaron (Freshbox y COOK).
4. **Buscador:** en COOK es un campo ancho en el encabezado en escritorio y una franja
   propia bajo el encabezado en celular.
5. **Carrito:** panel que entra por un lado sin tapar el catálogo; en celular ocupa toda
   la pantalla. [JUICIO: los paneles se detectaron en el código, no se abrieron.]
6. **Página de producto en dos columnas** (fotos a un lado, datos y botón al otro) y
   **carrito en dos columnas** (lista y resumen). [JUICIO: es la convención y coincide con
   la regla del sistema de marca, pero no se vio en la muestra.]

Lo que **no** se encontró en ningún sitio: carrito siempre visible como columna fija,
comparador de productos, ni más de cuatro columnas en un catálogo chico.

## 4. Diferencias por región

| Región | Lo que se vio | ¿Aplica a Los Tacos May? |
|---|---|---|
| **México** | WhatsApp en casi todos (Lappe, Risto, Freshbox, El Cerdito); negocios chicos sin carrito ni cuenta; entrega por zonas y días fijos; el envío nacional en frío es la excepción (solo Freshbox) | **Sí.** WhatsApp como canal de dudas y de pedido es lo esperado. Los días fijos de entrega encajan con una cocina chica. El número de WhatsApp es `PENDIENTE-CLIENTE` |
| **Estados Unidos** | Cajas y paquetes de tamaño fijo (Mosaic), suscripción o membresía (Fly By Jing), umbral de envío gratis, tiendas Shopify con cuenta alojada | **En parte.** La caja de tamaño fijo sirve: llena la hielera y justifica el envío. La suscripción, no: ni el backend ni el negocio están para eso |
| **Reino Unido y Francia** | Código postal antes de comprar; recoger en tienda (COOK, Picard); fichas con alérgenos y tabla nutrimental completas; puntajes nutrimentales y ambientales (Picard) | **Recoger en la taquería, sí,** y es lo más barato de ofrecer. Lo demás depende de la norma mexicana |
| **Japón** | Plan primero y menú después; filtro por alérgenos; acceso con LINE | **No.** Es un modelo de suscripción |
| **Brasil y Argentina** | Portada que ya es catálogo, con botón de agregar en cada tarjeta; consulta de zona al entrar; kits | **Sí:** es el modelo más cercano para un catálogo de catorce guisos |

Etiquetado: lo que la ficha debe decir en México (ingredientes, contenido neto, caducidad,
conservación, sellos) está en [viabilidad.md](viabilidad.md), sección 6. La ficha en
línea debería repetir lo de la etiqueta. [JUICIO]

## 5. Recomendación para Los Tacos May

Todo es **[JUICIO]** apoyado en las secciones anteriores. Respeta la ruta «La barra» de
[sistema.md](../diseno/sistema.md): la charola es la tarjeta y la retícula ya coincide con
la muestra.

### Mapa del sitio

| Vista | Ruta sugerida | ¿Ahora? | ¿Toca backend? |
|---|---|---|---|
| **Inicio** (landing) | `/` | Ya existe: ajustar | No |
| **Los guisos** (catálogo) | `/tienda/#/guisos` | Ya existe: reestructurar | No |
| **Un guiso** (ficha) | `/tienda/#/guisos/:id` | **Sí, nueva** | No para lo básico (`GET /guisos/:id` ya existe). **Sí** para ingredientes, cómo calentar, conservación, alérgenos y foto |
| **Carrito** | Panel lateral + `/tienda/#/carrito` | Sí: separar en panel y página | No |
| **Entrar** | `/tienda/#/entrar` | **Sí, separar** | No |
| **Crear cuenta** | `/tienda/#/registro` | **Sí, separar** | No |
| **Mis pedidos** | `/tienda/#/pedidos` | Ya existe | No |
| **Envíos y preguntas** | `/tienda/#/ayuda` | Sí, como página de texto | No. El contenido es `PENDIENTE-CLIENTE` |
| **Administración** | `/tienda/#/admin` | Ya existe | No |

**Lo que no debe tener:**

- **Buscador ni filtros:** son catorce guisos. Solo los tienen los catálogos grandes.
- **Suscripción, reseñas, lista de deseos, comparador, blog de recetas.**
- **Consulta por código postal:** hasta que haya cobertura real que consultar.
- **Página de pago:** no hay pagos; el pedido se confirma desde el carrito.

**Para después:** compra como invitado (hoy el carrito es `tm:carrito:{userId}` y todo
pide token: cambiaría el contrato), cajas armadas de tamaño fijo, recoger en la taquería
como opción de entrega, y fotos reales por guiso.

### Inicio

Orden, igual en los dos tamaños: barra de aviso → encabezado → héroe → **los guisos que
más salen, con precio y botón** → cómo funciona en tres pasos → la taquería (prueba) →
pie.

- **Escritorio:** héroe en dos columnas (ya lo dice el sistema); una fila de cuatro o
  cinco charolas con botón de agregar; los tres pasos en una fila.
- **Celular:** todo apilado; charolas de dos en dos.
- **Por qué:** las portadas que venden muestran producto con precio y botón (Freshbox,
  Fly By Jing, Liv Up, Frizata, Picard); el bloque de «cómo funciona» lo usan Lappe,
  Mosaic, Freshbox y Nosh.
- **Ojo:** agregar al carrito hoy pide sesión. Sin sesión, el botón lleva a «Entrar» y
  regresa; no se esconde.
- La barra de aviso solo se pone cuando haya una condición de envío confirmada.

### Los guisos (catálogo)

- **Escritorio:** cuatro charolas por renglón hasta 1280 px y cinco arriba, como ya fija
  el sistema; seis a partir de 1600 px es más de lo que hace nadie en la muestra y
  conviene revisarlo con las charolas reales. Agrupadas en **secciones con título**
  siguiendo el pizarrón (por precio), no con filtros. Una fila de «los que más salen»
  arriba (`GET /guisos/populares`).
- **Celular:** dos por renglón.
- **La charola lleva:** color o foto, número, nombre, **porciones**, **precio**, y
  **botón de agregar**; cuando ya está en el carrito, el botón se vuelve selector de
  cantidad. Si `stock` es 0, dice que se acabó y no hay botón.
- Toda la charola enlaza a la ficha; el botón no.
- **Por qué:** cuatro columnas es lo que hacen los siete listados medidos; la porción en
  la tarjeta la ponen siete tiendas; agrupar en vez de filtrar es lo que hacen Lappe, Liv
  Up y Frizata.

### Un guiso (ficha) — la que hoy no existe

- **Escritorio, dos columnas:** a la izquierda la charola grande (foto cuando la haya); a
  la derecha, fija al bajar, nombre, porciones, precio, cantidad y agregar. Debajo, a todo
  lo ancho y en este orden: qué es, **cómo se calienta**, **cómo se conserva y cuánto
  dura**, ingredientes y alérgenos, y «otros guisos».
- **Celular:** una columna en ese mismo orden, con el botón de agregar fijo abajo.
- **Por qué:** todas las tiendas con carrito propio tienen ficha; las seis leídas llevan
  ingredientes; las cinco de congelado, cómo calentar. Es donde se contesta «¿cómo lo
  caliento?» y «¿cuánto dura?».
- **Ahora, sin tocar backend:** nombre, descripción, porciones, precio, existencia,
  botón, y un bloque general de calentado y conservación igual para todos (texto
  `PENDIENTE-CLIENTE`).
- **Con backend:** campos nuevos en `tm:guiso:{id}`: `ingredientes`, `calentado`,
  `conservacion`, `alergenos`, `imagen`. Es propuesta para «Cambios al contrato»; el
  contenido de cada uno es `PENDIENTE-CLIENTE`.

### Carrito

- **Panel lateral** que se abre al agregar, sin salir del catálogo: lista corta, total,
  **el tiempo que le queda** (es lo propio de esta tienda) y dos botones: seguir y ver el
  carrito.
- **Página completa:** en escritorio, dos columnas (lista con cantidades a la izquierda;
  a la derecha el resumen con total, tiempo restante y confirmar, fijo al bajar). En
  celular, la lista y debajo el resumen, con confirmar fijo abajo.
- **Por qué:** cinco tiendas usan panel y las que cobran en serio tienen además página.
  El mínimo o el envío a la vista es regla en la muestra; aquí todavía no hay mínimo ni
  costo, así que ese renglón queda reservado y no se inventa.
- El `409` de «sin existencia» se muestra en el renglón del guiso, no como aviso general.

### Entrar y crear cuenta

- **Dos vistas con dirección propia,** cada una con un solo formulario y un enlace a la
  otra. En escritorio, formulario angosto (unos 420 px) centrado o en la columna derecha,
  con una frase de la marca a la izquierda; en celular, solo el formulario.
- **Entrar:** correo y contraseña. **Crear cuenta:** nombre, correo y contraseña, que es
  justo lo que pide `POST /users`.
- Se pide al agregar el primer guiso o al confirmar, y **regresa a donde estaba**.
- **Por qué:** Fly By Jing y las tiendas Shopify los separan en dos páginas; el alta más
  corta leída pide cuatro campos; ninguna los pone juntos en una vista.

### Mis pedidos

Lista del más nuevo al más viejo. En escritorio, tabla (fecha, guisos, total) con el
detalle que se abre en el mismo renglón; en celular, una tarjeta por pedido. Sin cambios
de backend.

### Envíos y preguntas

Una sola página de texto con las tres preguntas en este orden: ¿a dónde llega y cuánto
cuesta?, ¿cómo llega y cuánto dura?, ¿cómo lo caliento? Enlazada desde el pie, el carrito
y cada ficha. **Todo su contenido es `PENDIENTE-CLIENTE`:** mientras no se sepa, la página
dice lo que sí es cierto (dónde está la taquería) y que el envío aún no está abierto.

### Encabezado y pie

- **Encabezado:** logotipo a la izquierda; al centro, Los guisos · Cómo funciona · La
  taquería; a la derecha, cuenta (dice «Entrar» o el nombre) y carrito con número de
  piezas. En celular: logotipo, carrito y botón de menú. Administración solo aparece para
  quien tiene rol de administrador.
- **Pie:** ayuda (envíos y preguntas), la taquería (dirección y horario), legal, y
  WhatsApp y redes cuando existan (`PENDIENTE-CLIENTE`).

### Orden de trabajo sugerido

1. Separar Entrar y Crear cuenta.
2. Ficha de guiso con lo que ya hay.
3. Carrito como panel más página en dos columnas.
4. Catálogo agrupado en secciones, con botón que se vuelve selector.
5. Página de envíos y preguntas.
6. Proponer a coordinación los campos nuevos del guiso.

## Lo que no se pudo verificar

- Goldbelly, Factor y Licious no se abrieron.
- Ninguna pantalla de pago ni la compra como invitado.
- La composición de la página de producto y del carrito en escritorio (dos columnas) no
  se vio: es convención y regla del sistema, no observación.
- Los paneles de carrito y de filtros se detectaron en el código pero no se abrieron.
- El conteo de columnas es automático; el de Picard no es fiable.
- Páginas de producto de Freshbox, Carnes Ramos y Somos, y la página de cuenta alojada de
  Shopify.
