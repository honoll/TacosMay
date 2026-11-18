# Textos del sitio — inventario y propuesta

Alejandro: «Quiero que también veamos los textos que se le puso a cada cosa […]; los únicos que no se
cambian son los nombres de los guisos, pero los demás textos pueden ser íconos algunos». Esto es
**propuesta para decidir: nada está aplicado.** Sale del código del 17-nov-2026
(`frontend/index.html`, `tienda/index.html`, `404.html`, `tienda/app.js`, `js/landing.js`,
`js/cabecera.js`, `js/api.js` y los mensajes del backend que llegan a la pantalla). Para verlo con
los íconos dibujados: `/marca/textos.html`.

Apoyo: idea central, promesa y personalidad de [plataforma.md](plataforma.md) (despachada,
trabajadora, franca, de confianza) y la voz de [sistema.md](sistema.md) §9: de tú, frases cortas,
habla alguien y no «la empresa», dice lo que hay y lo que falta, **un guiño como máximo por pantalla.**

## Resumen

- **164 textos** inventariados (los que se repiten igual en varias páginas cuentan una vez; los
  que dependen de datos, como el nombre de un guiso, cuentan por su molde).
- **Se quedan igual:** 102.
- **Más cortos:** 22. **Reescritos** (misma longitud, más claros o con la palabra del resto
  del sitio): 9.
- **Textos de marca con alternativas:** 10 (en 9 temas, abajo).
- **A ícono solo:** 2. **A ícono con etiqueta:** 16.
- **Quitar:** 3.

### Los diez cambios que más mejoran el sitio

**✅ Aplicados los diez el 17-nov-2026** (Alejandro: «Sí, aplícalos»). Lo demás de este documento sigue
como propuesta. En las tablas, cada texto cambiado dice «✅ Aplicado».

1. Quitar «Ya está hecho» del paso 1 de «Cómo funciona»: hoy la frase sale tres veces y la tercera la gasta.
2. El carrito de la cabecera como ícono con su número y su reloj, y fuera de la cabecera «Cómo funciona» y «La taquería» (quedan en el pie). Solo con esto la cabecera con sesión todavía no cabía a 375 px; con «Pedidos» e ícono de persona (aprobados después) sí cabe (W2).
3. Un solo botón principal: «Pedir guisos» en el héroe, en «Todas las charolas» y en el cierre (hoy son tres textos distintos para lo mismo).
4. Una sola palabra para la existencia: «quedan 5» en tarjeta, ficha y administración (hoy «disponibles», «en existencia» y «stock»).
5. Los dos párrafos del envío, de 305 caracteres a 170, conservando el porqué del congelado y el «no prometemos».
6. Los tres pasos de «Cómo funciona», cada uno en un título y una línea de menos de 50 caracteres.
7. El error de red dice qué hacer: «No pudimos conectar. Revisa tu internet y dale otra vez.»
8. Sin «Redis», «TTL» ni «base de datos» frente al cliente (carrito vencido, nota del reloj, bajadas de la landing); para la exposición, decisión de Alejandro.
9. La bajada del héroe sin repetir el nombre del logotipo: «Los guisos de la taquería, en bolsa. Rompes, calientas y comes.»
10. Los mensajes del servidor en la voz del sitio: «Ese correo ya tiene cuenta. Entra con él.» y «Solo quedan 5.»

## Reglas que no se tocan

- Los nombres de los guisos no cambian.
- Nada de datos inventados: ni precios, ni tiempos, ni cobertura. Lo que falta sigue diciendo
  «por confirmar» o es `PENDIENTE-CLIENTE`.
- La nota de que los guisos empacados y sus precios son de ejemplo se conserva (se puede acortar).
- Los mensajes de error siguen diciendo qué pasó y qué hacer.
- Todo ícono sin texto visible conserva su nombre accesible y un objetivo táctil de 44 px.

## Inventario, vista por vista

Columnas: dónde · texto actual · caracteres · problema · propuesta. Tipos de propuesta:
**Igual** (y por qué), **Más corto**, **Reescribir**, **Alternativas** (texto de marca, abajo),
**Ícono solo**, **Ícono + etiqueta**, **Quitar**.

### Cabecera (igual en las tres páginas)

Son los mismos textos en la landing, la tienda y «no encontrado».

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Logotipo, nombre accesible | Los Tacos May, inicio | 21 | — | **Igual**. Dice qué es y a dónde lleva. |
| Navegación, nombre accesible | Principal | 9 | — | **Igual**. Lo usa el lector de pantalla para saltar entre zonas. |
| Enlace | Inicio | 6 | — | **Igual**. El logotipo ya lleva al inicio, pero no todos lo saben. |
| Enlace | Guisos | 6 | — | **Igual**. Corto y es lo que se vende. |
| Enlace | Cómo funciona | 13 | En celular la fila de enlaces no cabe y se desliza (W2) | **Quitar**. Quitarlo de la cabecera: queda en el héroe («Cómo funciona») y en el pie. **✅ Aplicado** |
| Enlace | La taquería | 11 | Igual que el anterior: alarga la fila en celular | **Quitar**. Quitarlo de la cabecera; queda en el pie. Con estos dos fuera, la cabecera cabe a 375 px sin deslizar. **✅ Aplicado** |
| Zona de cuenta, nombre accesible | Tu cuenta | 9 | — | **Igual** |
| Enlace, sin sesión | Entrar | 6 | — | **Ícono + etiqueta**. Persona + «Entrar». |
| Enlace, con sesión | Mis pedidos | 11 | Alarga la fila en celular | **Ícono + etiqueta**. Caja + «Pedidos». **✅ Aplicado** (Aprobado después, para W2.) |
| Enlace, administrador | Admin | 5 | — | **Igual**. Solo lo ve quien administra; corto. |
| Enlace, con sesión | (nombre de la persona) | 22 | Un nombre largo empuja la fila | **Ícono + etiqueta**. Persona + el nombre, recortado a 12 caracteres con «…» (el completo, en su nombre accesible). **✅ Aplicado** (Aprobado después, para W2. En celular, solo el ícono (el nombre completo va para lector) y «Salir» queda en «Tu cuenta».) |
| Botón, con sesión | Salir | 5 | — | **Igual**. Corto y claro. El ícono de «salir» no es universal: va con texto. |
| Botón del carrito | Carrito | 7 | Es la palabra más repetida del sitio y ocupa lugar en celular | **Ícono solo**. Ícono de carrito + el número + el reloj. Nombre accesible: «Carrito, 3 guisos». Objetivo táctil de 44 px. **✅ Aplicado** |
| Botón del carrito, para lector | … guisos | 8 | — | **Igual**. Completa el nombre accesible («Carrito 3 guisos»). |
| Enlace para teclado (landing y «no encontrado») | Saltar al contenido | 19 | Falta en la tienda | **Igual**. Igual, y agregarlo también a la tienda. |

### Pie (igual en las tres páginas)

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Logotipo, texto alternativo | Los Tacos May | 13 | — | **Igual** |
| Dirección (enlace al mapa) | José María Morelos S/N, Local 3, Centro, 23450 Cabo San Lucas, B.C.S. | 69 | Parte en tres renglones en celular | **Ícono + etiqueta**. Lugar + la dirección igual (es el dato real; no se acorta). |
| Navegación, nombre accesible | Pie de página | 13 | — | **Igual** |
| Enlaces | Inicio · Guisos · Cómo funciona · La taquería · Carrito · Entrar | 64 | — | **Igual**. En el pie sí caben, y reciben a los dos que salen de la cabecera. |
| Enlace | Envíos y preguntas | 18 | Largo para un enlace; se repite en 4 lugares | **Más corto**. «Preguntas». |
| Nota | Los guisos empacados y sus precios son de ejemplo mientras se confirma la carta real. | 85 | Larga; la regla dice que se conserva | **Más corto**. «Guisos empacados y precios de ejemplo: la carta real está por confirmarse.» |

### Títulos de pestaña y para compartir

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Landing, pestaña y al compartir | Los Tacos May — Guisos de taquería ya hechos, al vacío | 54 | — | **Igual**. Menos de 60 caracteres: se lee completo en el buscador. |
| Landing, descripción y al compartir | Los guisos de Los Tacos May, la taquería de Cabo San Lucas, ya hechos y empacados al vacío. Rompes la bolsa, calientas y comes. | 127 | — | **Igual**. Menos de 155 caracteres; dice qué, de quién y cómo. |
| Tienda, pestaña inicial | Los Tacos May — Tienda | 22 | Solo se ve un instante: cada vista pone el suyo | **Igual** |
| Tienda, pestaña de cada vista | Guisos · Tu carrito · Mis pedidos · Administrar guisos · Tu cuenta · Iniciar sesión · Crear cuenta · Envíos y preguntas — Los Tacos May | 135 | — | **Igual**. Cortos y con la marca al final. «Envíos y preguntas» pasa a «Preguntas» si se acepta en el pie. |
| Tienda, pestaña de una ficha | (nombre del guiso) — Los Tacos May | 34 | — | **Igual** |
| «No encontrado», pestaña | No encontramos esa página — Los Tacos May | 41 | — | **Igual** |
| Anuncio al cambiar de página (lector) | Página: (título) | 16 | — | **Igual** |

### Landing · héroe y la barra que gira

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Titular | Ya está hecho. | 14 | Se repite en el cierre y en el paso 1 de «Cómo funciona»: tres veces | **Alternativas**. Ver «Textos de marca». |
| Bajada | Guisos de Los Tacos May, en bolsa. Rompes, calientas y comes. | 61 | Repite el nombre que está justo arriba en el logotipo | **Alternativas**. Ver «Textos de marca». **✅ Aplicado** (Con la alternativa 1.) |
| Botón principal | Pedir guisos | 12 | — | **Igual**. Directo. Propongo que sea el único texto del botón principal en todo el sitio. |
| Enlace | Cómo funciona | 13 | — | **Igual** |
| Fila que gira, nombre accesible | Guisos de la barra | 18 | — | **Igual** |
| Número de charola | 02 · 08 · 09 | 12 | — | **Igual**. Es el número del pizarrón: parte del sistema. |
| Botón de la fila que gira | Pausar (las charolas que giran) | 31 | — | **Ícono solo**. Pausa / reanudar (universal). Nombre accesible: «Pausar las charolas» / «Reanudar las charolas». |

### Landing · lo que más sale

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Título | Lo que más sale | 15 | — | **Igual**. Así se habla en la barra. |
| Bajada | El orden lo ponen los pedidos de la tienda, contados en vivo. | 61 | Explica la técnica; larga | **Más corto**. «Por pedidos, en vivo.» (para la exposición, el «en vivo» es la prueba de Redis). |
| Dato de la charola | 4 porciones · 12 en existencia · 3 vendidos | 43 | Tres renglones en una charola de celular | **Más corto**. «4 porciones · quedan 12». Lo vendido, solo como etiqueta en esta fila. **✅ Aplicado** (En parte: «quedan 12»; lo vendido sigue en la charola.) |
| Botón de la charola | Pedir (nombre del guiso) | 24 | — | **Igual** |
| Sin existencia | Se acabó por hoy | 16 | — | **Igual**. Voz de la barra. |

### Landing · cómo funciona

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Título | Cómo funciona | 13 | — | **Igual**. Coincide con el enlace que lleva aquí. |
| Paso 1, título | Ya está hecho | 13 | Tercera vez que sale la frase | **Alternativas**. Ver «Textos de marca». **✅ Aplicado** (Quedó «Sale de la barra».) |
| Paso 1, texto | El guiso sale de la barra de la taquería, donde se sirve todos los días. | 72 | Largo para una tarjeta | **Más corto**. Ver «Textos de marca». **✅ Aplicado** |
| Paso 2, título | Rompe la bolsa | 14 | — | **Igual** |
| Paso 2, texto | Va empacado al vacío, por porciones. Lo único que queda es abrirla. | 67 | — | **Más corto**. Ver «Textos de marca». **✅ Aplicado** |
| Paso 2, etiqueta de la bolsa | (nombre del guiso) | 18 | — | **Igual**. Nombre del guiso: no se cambia. |
| Paso 3, título | Calienta y taquea | 17 | — | **Igual** |
| Paso 3, texto | A la sartén o a la olla, como recalientas cualquier guiso, y a la tortilla. | 75 | — | **Más corto**. Ver «Textos de marca». **✅ Aplicado** |
| Número del paso | 1 · 2 · 3 | 9 | — | **Igual** |

### Landing · todas las charolas

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Título | Todas las charolas | 18 | — | **Igual**. La metáfora de la barra. |
| Bajada | Precios y existencias se leen de la base de datos cada vez que abres esta página. | 81 | Habla de la base de datos al cliente; larga | **Más corto**. «Precios y existencias, en vivo.» **✅ Aplicado** |
| Cargando | Leyendo el menú… | 16 | — | **Igual** |
| Sin JavaScript | El menú se consulta en vivo y necesita JavaScript. También puedes verlo en la tienda. | 85 | — | **Igual**. Solo lo ve quien no tiene JavaScript; dice qué hacer. |
| Botón | Pedir en la tienda | 18 | Tercer texto distinto para lo mismo («Pedir guisos», «Ir a la tienda») | **Reescribir**. «Pedir guisos». **✅ Aplicado** |
| Botón, si falla | Volver a intentar | 17 | — | **Igual** |
| Error | No pudimos leer el menú. Dale otra vez, o entra a la tienda. | 60 | — | **Igual**. Dice qué pasó y qué hacer, con la voz. |
| Vacío | Todavía no hay guisos en el menú. | 33 | — | **Igual** |

### Landing · el envío

El ticket ya es franco: dice qué falta. Lo largo son los dos párrafos.

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Título | El envío, sin cuentos | 21 | Dos renglones en celular | **Alternativas**. Ver «Textos de marca». |
| Ticket | Formato · Al vacío, congelado | 29 | Dato sin confirmar: que se venda congelado es recomendación de Investigación (PENDIENTE-CLIENTE) | **Ícono + etiqueta**. Congelado + «Al vacío, congelado» (con su PENDIENTE hasta confirmarlo). |
| Ticket | A dónde llega · Por confirmar | 29 | — | **Ícono + etiqueta**. Lugar + «Por confirmar». |
| Ticket | Cuánto cuesta · Por confirmar | 29 | — | **Ícono + etiqueta**. Precio + «Por confirmar». |
| Ticket | En cuántos días · Por confirmar | 31 | — | **Ícono + etiqueta**. Reloj + «Por confirmar». |
| Párrafo | El vacío le saca el aire a la bolsa, pero no conserva por sí solo: lo que cuida al guiso es el frío. Por eso va congelado y así se queda hasta que tú rompes la bolsa. | 166 | Largo | **Más corto**. Ver «Textos de marca». **✅ Aplicado** |
| Párrafo | Lo que dice «por confirmar» todavía no lo publicamos. Preferimos no prometerlo antes de tenerlo seguro; cuando lo esté, va a aparecer aquí. | 139 | Largo | **Más corto**. Ver «Textos de marca». **✅ Aplicado** |
| Fuentes | Sobre vacío y congelación: guías de inocuidad de USDA-FSIS y de la FSA del Reino Unido. | 87 | — | **Igual**. Son las fuentes reales; respaldan lo que se dice. |

### Landing · la taquería y el pizarrón

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Título (solo lector) | May y la taquería | 17 | — | **Igual** |
| Dato 1 | May es una persona · Así le dicen al dueño desde siempre. | 57 | — | **Alternativas**. Ver «Textos de marca». |
| Dato 2 | Unos 22 años en Cabo San Lucas · La taquería empezó ahí y ahí sigue. | 68 | El año exacto es PENDIENTE-CLIENTE: «unos» se queda | **Alternativas**. Ver «Textos de marca». |
| Dato 3 | Menos de 10 minutos · Los guisos ya están hechos y calientes: entras, comes y te vas. | 85 | Largo | **Alternativas**. Ver «Textos de marca». |
| Dirección | José María Morelos S/N, Local 3, Centro, 23450 Cabo San Lucas, B.C.S. | 69 | — | **Ícono + etiqueta**. Lugar + la dirección (dato real). |
| Pizarrón, título | En el pizarrón de la taquería | 29 | Largo para un título de pizarrón | **Más corto**. «El pizarrón». |
| Pizarrón, los 14 guisos | Corazón de vaca enamorada … Barbacoa de borrego | 47 | — | **Igual**. Nombres de los guisos: no se cambian. |
| Pizarrón, nota | Esto es lo que se sirve en la taquería. Lo que ya puedes pedir empacado está en las charolas en vivo. | 101 | Larga | **Más corto**. «Esto se sirve en la barra. Lo empacado está en las charolas en vivo.» |

### Landing · cierre

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Título | Ya está hecho. | 14 | Repite el titular (a propósito, como remate) | **Alternativas**. Ver «Textos de marca». |
| Bajada | Tú nomás escoge. | 16 | — | **Igual**. Corta, de tú y es el único guiño de la sección. |
| Botón | Ir a la tienda | 14 | Distinto del botón principal | **Reescribir**. «Pedir guisos». **✅ Aplicado** |

### Tienda · catálogo y tarjeta

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Título | Guisos de taquería empacados al vacío | 37 | Dos renglones en celular; la cabecera ya dice dónde estás | **Más corto**. «Guisos empacados». |
| Grupos | Lo que más sale · De $200 · Todos los guisos | 44 | — | **Igual**. Agrupado por precio como el pizarrón. |
| Esqueleto, nombre accesible | Cargando los guisos | 19 | — | **Igual** |
| Vacío | Todavía no hay guisos en el catálogo. | 37 | — | **Igual** |
| Tarjeta, etiqueta | 3 vendidos | 10 | — | **Igual** |
| Tarjeta, descripción | (la del guiso) | 14 | — | **Igual**. Solo sale si es propia de ese guiso. |
| Tarjeta, dato | 4 porciones · 5 disponibles | 27 | «disponibles» aquí, «en existencia» en la landing, «stock» en administración: tres palabras para lo mismo | **Más corto**. «4 porciones · quedan 5». **✅ Aplicado** |
| Tarjeta, botón | Agregar (nombre del guiso al carrito) | 37 | — | **Igual**. El verbo exacto; el nombre completo lo oye el lector. |
| Selector de cantidad | − · número · + | 14 | — | **Igual**. Ya son íconos universales con nombre accesible («Quitar uno», «Agregar uno»). |
| Selector, nombre accesible | (guiso) en tu carrito | 21 | — | **Igual** |
| Sin existencia | Se acabó por hoy | 16 | — | **Igual** |
| Aviso al agregar | Agregado al carrito: (guiso). | 29 | Repite lo que ya dice la bolsa que vuela al carrito | **Quitar**. Quitarlo cuando corre el empacado; dejarlo con movimiento reducido (ahí no hay animación que lo diga). |
| Aviso, sin sesión | Inicia sesión para agregar guisos al carrito. | 45 | — | **Igual**. Dice qué pasa y qué hacer. |

### Tienda · ficha de un guiso

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Regreso (en todas las vistas) | ← Seguir comprando | 18 | Se repite en cada vista | **Ícono + etiqueta**. Atrás + «Guisos». |
| Dato | 4 porciones · 5 disponibles | 27 | Igual que en la tarjeta | **Más corto**. «4 porciones · quedan 5». **✅ Aplicado** |
| Bloque | Cómo se calienta · A la sartén o a la olla, como recalientas cualquier guiso. | 77 | Instrucción general hasta tener la de cada guiso (PENDIENTE-CLIENTE) | **Igual**. Ya lleva su pictograma (Calienta) con etiqueta. |
| Bloque | Cómo se conserva · Va empacado al vacío y congelado. Guárdalo en el congelador hasta que lo vayas a usar. | 105 | Largo | **Más corto**. «Al vacío y congelado. Guárdalo en el congelador hasta usarlo.» |
| Enlace | Envíos y preguntas | 18 | — | **Más corto**. «Preguntas». |
| Sección | Otros guisos | 12 | — | **Igual** |
| Guiso que no existe | Ese guiso ya no está en la barra · Puede que se haya retirado del menú. | 71 | — | **Igual**. Dice qué pasó; el botón de abajo dice qué hacer. |

### Tienda · iniciar sesión y crear cuenta

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Títulos | Iniciar sesión · Crear cuenta | 29 | — | **Igual** |
| Etiquetas | Nombre · Correo · Contraseña | 28 | — | **Igual**. Las etiquetas de un formulario son texto siempre. |
| Botones | Entrar · Crear mi cuenta | 24 | — | **Igual** |
| Cambio | ¿No tienes cuenta? Créala · ¿Ya tienes cuenta? Entra | 52 | — | **Igual** |
| Lado, nombre accesible | Para qué sirve tu cuenta | 24 | — | **Igual** |
| Lado, título | Con tu cuenta | 13 | — | **Igual** |
| Lado, lista | Agregas guisos a tu carrito. · Confirmas tu pedido. · Ves tus pedidos anteriores. | 81 | — | **Ícono + etiqueta**. Charola + «Agregas guisos» · Listo + «Confirmas tu pedido» · Caja + «Ves tus pedidos». |
| Error de campo | Este campo no puede ir vacío. | 29 | — | **Igual**. Dice qué falta. |
| Error de campo | Escribe un correo válido, como nombre@ejemplo.com. | 50 | — | **Igual**. Dice qué hacer con un ejemplo. |
| Errores de número | Escribe un número. · Escribe un número entero. · Usa máximo dos decimales. · Revisa este campo. | 95 | — | **Igual** |
| Error al entrar | El correo o la contraseña no coinciden. | 39 | — | **Igual**. No dice cuál de los dos (es lo seguro). |
| Error al crear (viene del servidor) | Ese email ya está registrado | 28 | Dice «email» y el resto del sitio dice «correo»; no dice qué hacer | **Reescribir**. «Ese correo ya tiene cuenta. Entra con él.» (se traduce en la tienda, como el 401). **✅ Aplicado** (Se traduce en la tienda (js/api.js), sin tocar el backend.) |
| Aviso al entrar | Hola, (nombre). | 15 | — | **Igual**. De tú y corto. |
| Aviso | Inicia sesión para continuar. | 29 | — | **Igual** |

### Tienda · tu cuenta

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Título | Tu cuenta | 9 | — | **Igual** |
| Datos | (nombre) · (correo) · Rol: administrador | 40 | — | **Igual** |
| Enlace | Ver mis pedidos | 15 | — | **Igual** |
| Botón | Cerrar sesión | 13 | En la cabecera el mismo botón dice «Salir» | **Reescribir**. «Salir», igual que en la cabecera. |

### Tienda · carrito y panel del carrito

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Título | Tu carrito | 10 | — | **Igual** |
| Tiempo | Tu carrito expira en 14:59 | 26 | — | **Ícono + etiqueta**. Reloj + «Expira en 14:59» (como en el panel). |
| Nota del tiempo | Cada cambio renueva el tiempo. Si llega a cero, Redis borra el carrito solo (TTL). | 82 | «Redis» y «TTL» son jerga para el cliente; para la exposición sí sirven | **Más corto**. «Cada cambio renueva el tiempo; en cero, se vacía solo.» Decide Alejandro: si quiere que la demo lo diga en pantalla, se queda como está hasta después del examen. **✅ Aplicado** (Sin las siglas; la cuenta regresiva se queda.) |
| Renglón | (guiso) · $200 c/u | 18 | — | **Igual** |
| Renglón, etiqueta | Cantidad (de guiso) | 19 | — | **Igual** |
| Renglón, botón | Quitar (guiso) | 14 | — | **Ícono + etiqueta**. Bote + «Quitar» (el bote no es universal fuera de una computadora: va con texto). |
| Total | Total: $400 | 11 | — | **Igual** |
| Botones | Confirmar pedido · Vaciar carrito | 33 | — | **Igual** |
| Vacío | Tu carrito está vacío · Las charolas, no. Escoge tus guisos y aquí los juntamos. | 80 | Dos frases donde basta una | **Alternativas**. Ver «Textos de marca». |
| Aviso al quitar | Quitaste (guiso). · Deshacer | 28 | — | **Igual**. Corto y con salida. |
| Aviso al confirmar | Pedido #7 confirmado por $400. | 30 | — | **Igual** |
| Error, sin existencia (servidor) | No hay stock suficiente de (guiso) (quedan 5) | 45 | «stock»; ya va junto a la cantidad, así que repite el nombre | **Reescribir**. «Solo quedan 5.» junto a la cantidad (se traduce en la tienda). **✅ Aplicado** (Quedó «Solo quedan 5 de <guiso>.» (con el nombre, porque también sale como aviso general); se traduce en js/api.js.) |
| Aviso, carrito vencido | Tu carrito expiró por inactividad y Redis lo borró (TTL). | 57 | Jerga; no dice qué hacer | **Reescribir**. «Tu carrito se vació por inactividad. Vuelve a agregar tus guisos.» (misma decisión de la demo que arriba). **✅ Aplicado** |
| Panel, título y cerrar | Tu carrito · ✕ (Cerrar el carrito) | 34 | — | **Igual**. El ✕ ya es ícono universal con nombre accesible. |
| Panel, tiempo | Expira en 14:59 | 15 | — | **Ícono + etiqueta**. Reloj + «Expira en 14:59». |
| Panel, vacío | Tu carrito está vacío. Las charolas, no. | 40 | — | **Igual**. Una frase y un guiño: así debería quedar también la vista del carrito. |
| Panel, botones | Ver carrito · Seguir comprando | 30 | — | **Igual** |

### Tienda · mis pedidos

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Título | Mis pedidos | 11 | — | **Igual** |
| Renglón | Pedido #7 · 17 nov · 2 guisos · $400 | 36 | — | **Igual** |
| Lado | ¿Otro guiso? · Ver guisos | 25 | — | **Igual**. Un guiño y una salida. |
| Vacío | Todavía no tienes pedidos · Cuando confirmes el primero, aquí va a quedar. | 74 | — | **Igual** |

### Tienda · administración

Solo la ve quien administra. Lo que importa es que sea claro y use las mismas palabras que el resto.

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Título | Administrar guisos | 18 | — | **Igual** |
| Formulario, título | Nuevo guiso · Editar «(guiso)» | 30 | — | **Igual** |
| Etiqueta | Stock | 5 | Anglicismo; el resto del sitio dirá «quedan» | **Reescribir**. «Existencias». **✅ Aplicado** |
| Etiquetas | Nombre · Descripción · Precio (pesos) · Porciones | 49 | — | **Igual** |
| Botones | Agregar guiso · Guardar cambios · Cancelar | 42 | — | **Igual** |
| Lista, título | Guisos en el catálogo | 21 | — | **Igual** |
| Renglón | $200 · 4 porciones · stock 5 | 28 | — | **Reescribir**. «$200 · 4 porciones · quedan 5». **✅ Aplicado** |
| Renglón, botón | Editar (guiso) | 14 | — | **Ícono + etiqueta**. Lápiz + «Editar». |
| Renglón, botón | Eliminar (guiso) | 16 | — | **Ícono + etiqueta**. Bote + «Eliminar». |
| Confirmación | ¿Eliminar? · Sí, eliminar · No | 30 | — | **Igual** |
| Marca | ✓ Guardado | 10 | — | **Igual** |
| Avisos | Guardado: (guiso). · Agregado: (guiso). · Eliminado: (guiso). | 61 | — | **Igual** |
| Error (servidor) | Solo un administrador puede hacer esto | 38 | — | **Igual** |
| Error (servidor) | Dato faltante o inválido: (campo) ((tipo)) | 42 | Técnico; casi nunca sale porque la tienda valida antes | **Igual**. Se queda como respaldo. |

### Tienda · envíos y preguntas

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Título | Envíos y preguntas | 18 | — | **Más corto**. «Preguntas». |
| Pregunta y respuesta | ¿Cómo vienen los guisos? · Empacados al vacío y congelados. Rompes la bolsa, calientas y comes. | 95 | — | **Igual** |
| Pregunta y respuesta | ¿Ya hacen envíos? · Todavía no. A dónde llega, cuánto cuesta y en cuántos días está por confirmar; cuando esté seguro, va a aparecer aquí. | 138 | Larga | **Más corto**. «Todavía no. A dónde, cuánto cuesta y en cuántos días: por confirmar.» |
| Pregunta y respuesta | ¿Se paga en la página? · No. La tienda todavía no cobra: confirmar un pedido lo deja registrado en «Mis pedidos». | 113 | — | **Igual**. Franca y dice qué pasa. |
| Pregunta y respuesta | ¿Por qué mi carrito tiene reloj? · El carrito se guarda por un tiempo y el reloj dice cuánto le queda. Cada cambio lo renueva; si llega a cero, se vacía solo. | 158 | Larga | **Más corto**. «Se guarda un rato y el reloj dice cuánto le queda. Cada cambio lo renueva.» |
| Pregunta y respuesta | ¿Los precios son los reales? · Los guisos empacados y sus precios son de ejemplo mientras se confirma la carta real. | 116 | — | **Igual**. Es la nota que la regla pide conservar. |
| Botón | Ver guisos | 10 | — | **Igual** |

### Avisos y errores generales

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Error de red | No se pudo conectar con el servidor. | 36 | No dice qué hacer | **Reescribir**. «No pudimos conectar. Revisa tu internet y dale otra vez.» **✅ Aplicado** |
| Sesión vencida | Tu sesión venció. Inicia sesión de nuevo. | 41 | — | **Igual** |
| Cerrar un aviso | ✕ (Cerrar el aviso) | 19 | — | **Igual**. Ícono universal con nombre accesible. |
| Errores 401 del servidor | Acceso no autorizado, … | 23 | — | **Igual**. No llegan a la pantalla: la tienda los convierte en «Tu sesión venció». |

### Animación de empacado

La bolsa lleva el número de charola y el nombre del guiso; no tiene más texto.

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Etiqueta de la bolsa | (número) · (nombre del guiso) | 29 | — | **Igual**. Nombre del guiso: no se cambia. |

### Página de «no encontrado»

| Dónde | Texto actual | Car. | Problema | Propuesta |
|---|---|---|---|---|
| Título | Aquí no hay nada servido. | 25 | — | **Alternativas**. Ver «Textos de marca». |
| Texto | No encontramos la página que buscas. Puede que la dirección esté mal escrita o que ya no exista. | 96 | Largo | **Más corto**. «Esta página no existe o cambió de lugar.» |
| Botones | Ir al inicio · Ver los guisos | 29 | — | **Igual**. Dos salidas claras. |

## Textos de marca

### El titular «Ya está hecho.»

**Hoy:** Sale tres veces en la landing: el titular, el cierre y el título del paso 1 de «Cómo funciona».

1. Dejarlo en el héroe y en el cierre, y quitarlo del paso 1 (el titular y el remate se contestan; el paso 1 lo gasta).
2. Dejarlo solo en el héroe; el cierre usa otra frase de la plataforma.
3. Dejarlo en las tres (como está).

**Recomiendo:** La 1. Repetirlo al principio y al final es un recurso conocido (abre y cierra); la tercera vez, en el paso 1, ya no remata nada y le quita fuerza. **✅ Aplicado el 17-nov-2026, con la 1.**

### La bajada del héroe

**Hoy:** «Guisos de Los Tacos May, en bolsa. Rompes, calientas y comes.» (61)

1. «Los guisos de la taquería, en bolsa. Rompes, calientas y comes.» (63): quita el nombre que ya está en el logotipo y dice «taquería», que es la prueba.
2. «El guiso de la barra, ahora en bolsa. Tú nomás calientas.» (57)
3. «Guiso de taquería, empacado al vacío. Rompes, calientas y comes.» (64)

**Recomiendo:** La 1: se queda con la promesa en tres verbos y cambia lo único que sobraba. **✅ Aplicado el 17-nov-2026, con la 1.**

### Los títulos de sección

**Hoy:** «Lo que más sale» · «Cómo funciona» · «Todas las charolas» · «El envío, sin cuentos» · «May y la taquería» (solo lector)

1. Dejar todos menos el del envío.
2. Envío: «Envío, sin cuentos» (18; cabe en un renglón a 375 px).
3. Envío: «Lo que falta del envío» (22; más literal).

**Recomiendo:** Los cuatro primeros se quedan: son voz de la barra y claros. El del envío pasa a «Envío, sin cuentos».

### Los tres pasos de «Cómo funciona»

**Hoy:** 1 «Ya está hecho» · El guiso sale de la barra de la taquería, donde se sirve todos los días. (72) / 2 «Rompe la bolsa» · Va empacado al vacío, por porciones. Lo único que queda es abrirla. (67) / 3 «Calienta y taquea» · A la sartén o a la olla, como recalientas cualquier guiso, y a la tortilla. (75)

1. 1 «Sale de la barra» · Se guisa y se sirve en la taquería todos los días. (50) / 2 «Rompe la bolsa» · Al vacío, por porciones. Nomás ábrela. (37) / 3 «Calienta y taquea» · En sartén u olla, como cualquier guiso. (39)
2. 1 «Hecho en la taquería» · El mismo guiso que se sirve en la barra. (42) / 2 y 3 como la 1.
3. Títulos solos en tres verbos, como la etiqueta de la bolsa: «Rompe.» «Calienta.» «Taquea.», con el paso de la barra como bajada de la sección.

**Recomiendo:** La 1: cada tarjeta queda en un título y una línea de menos de 50 caracteres, y el paso 1 deja de repetir el titular. **✅ Aplicado el 17-nov-2026, con la 1.**

### «El envío, sin cuentos»: las dos líneas

**Hoy:** Párrafo de 166 y párrafo de 139 caracteres.

1. «El vacío saca el aire; lo que cuida al guiso es el frío. Por eso va congelado hasta que rompes la bolsa.» (104) y «Lo que dice «por confirmar» no lo prometemos hasta tenerlo seguro.» (66)
2. Una sola línea: «Va congelado: el vacío saca el aire y el frío lo cuida. Lo demás, cuando esté seguro.» (85)
3. Dejarlas como están (son francas, solo largas).

**Recomiendo:** La 1: conserva el porqué del congelado (es lo que da confianza) y la promesa de no prometer, con la mitad de texto. **✅ Aplicado el 17-nov-2026, con la 1.**

### Los tres datos de la taquería

**Hoy:** «May es una persona» · Así le dicen al dueño desde siempre. / «Unos 22 años en Cabo San Lucas» · La taquería empezó ahí y ahí sigue. / «Menos de 10 minutos» · Los guisos ya están hechos y calientes: entras, comes y te vas.

1. «Le dicen May» · Es el apodo del dueño de toda la vida. / «Unos 22 años en Cabo» · Ahí empezó y ahí sigue. / «Menos de 10 minutos» · Llegas, comes y te vas.
2. «May es el dueño» · Así le dicen desde siempre. / los otros dos como la 1.
3. Dejar los títulos y acortar solo el tercer texto a «Llegas, comes y te vas.»

**Recomiendo:** La 1. «Llegas, comes y te vas» es una de las frases de la plataforma y es literal de la barra. «Unos 22 años» se queda con «unos»: el año exacto sigue PENDIENTE-CLIENTE.

### El cierre

**Hoy:** «Ya está hecho.» · «Tú nomás escoge.» · botón «Ir a la tienda»

1. Igual, con el botón «Pedir guisos» (el mismo del héroe).
2. «El guiso ya está.» · «Tú nomás calienta.» · «Pedir guisos»
3. «Tú nomás escoge.» como título, sin bajada.

**Recomiendo:** La 1: el titular contesta al del héroe y la bajada es el único guiño; solo se unifica el botón.

### El carrito vacío

**Hoy:** «Tu carrito está vacío» · «Las charolas, no. Escoge tus guisos y aquí los juntamos.»

1. «Tu carrito está vacío» · «Las charolas, no.» (como el panel; un guiño por pantalla)
2. «Todavía no agregas guisos» · «Las charolas están llenas.»
3. Dejarlo como está.

**Recomiendo:** La 1: el botón de abajo («Ver guisos») ya dice qué hacer; la segunda frase sobraba.

### La página de «no encontrado»

**Hoy:** «Aquí no hay nada servido.» · «No encontramos la página que buscas. Puede que la dirección esté mal escrita o que ya no exista.» (96)

1. Dejar el título y acortar: «Esta página no existe o cambió de lugar.» (40)
2. «Esta charola está vacía.» · igual que la 1.
3. «Se acabó… o nunca hubo.» · igual que la 1.

**Recomiendo:** La 1: el título ya tiene la voz; lo de abajo solo tiene que decir qué pasó, y los dos botones dicen qué hacer.

## Qué puede ser ícono y qué no

Criterio: **ícono solo** únicamente cuando el significado es universal (carrito, cerrar, más y
menos, menú, buscar, mapa, atrás, pausa); para lo demás, **ícono con etiqueta corta**; y **texto**
cuando la acción tiene consecuencia o cuando el texto es dato. Se usan los pictogramas del sistema
(retícula de 24, margen de 2, formas llenas y trazo de 2 solo donde la forma es línea) y se proponen
los que faltan, dibujados igual: carrito, persona, pausa y reanudar, atrás, cerrar, editar, quitar y
precio. Están dibujados en `/marca/textos.html`.

| Qué | Cómo | Pictograma | Por qué |
|---|---|---|---|
| Carrito de la cabecera | **Ícono solo** | Carrito | Universal en una tienda. Lleva su número y su nombre accesible «Carrito, N guisos». |
| Cerrar (panel del carrito, aviso) | **Ícono solo** | Cerrar | Universal. Ya está como «✕»; se dibuja con la retícula para que pese igual que lo demás. |
| Más y menos (cantidad) | **Ícono solo** | — | Universal; ya están. |
| Pausa y reanudar (la barra que gira) | **Ícono solo** | Pausa | Universal en contenido que se mueve. Reanudar: «Sigue». |
| Regreso a los guisos | **Ícono + etiqueta** | Atras | La flecha sola es universal para «atrás», pero aquí no es el atrás del navegador: lleva a los guisos. Con etiqueta «Guisos». |
| Entrar / tu cuenta | **Ícono + etiqueta** | Persona | La persona se entiende como «cuenta», pero no dice si entras o ya entraste. |
| Mis pedidos | **Ícono + etiqueta** | Caja | Del sistema. Sin etiqueta podría ser «envíos». |
| Quitar del carrito, eliminar un guiso | **Ícono + etiqueta** | Quitar | El bote no es universal en celular para todos; con etiqueta. |
| Editar un guiso | **Ícono + etiqueta** | Editar | El lápiz se entiende, pero en administración conviene no adivinar. |
| Tiempo del carrito | **Ícono + etiqueta** | Reloj | Del sistema. El reloj solo no dice que el carrito expira. |
| Datos del envío (formato, a dónde, cuánto, en cuántos días) | **Ícono + etiqueta** | Congelado · Lugar · Precio · Reloj | Ayudan a leer el ticket de un vistazo; el texto se queda. |
| Dirección | **Ícono + etiqueta** | Lugar | Del sistema; marca que es un lugar al que se llega. |
| Para qué sirve tu cuenta (lista) | **Ícono + etiqueta** | Charola · Listo · Caja | Del sistema. |
| Salir | **Texto** | — | El ícono de «salir» (puerta, flecha) se confunde con «atrás» o «compartir». |
| Confirmar pedido, Vaciar carrito, Agregar | **Texto** | — | Son acciones con consecuencia: el verbo exacto no se cambia por un dibujo. |
| Nombres de guiso, precios, porciones | **Texto** | — | Son el producto y datos: siempre texto. |
| Mensajes de error y avisos | **Texto** | — | Tienen que decir qué pasó y qué hacer. |
