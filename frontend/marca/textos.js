// Inventario de textos con propuesta: la misma tabla que docs/diseno/textos.md, generada de la misma fuente.
// NUEVOS: pictogramas que faltan, en la retícula del sistema (24, margen 2).
export const RESUMEN = {"total": 164, "cuenta": {"Igual": 102, "Quitar": 3, "Ícono + etiqueta": 16, "Ícono solo": 2, "Más corto": 22, "Alternativas": 10, "Reescribir": 9}, "diez": ["Quitar «Ya está hecho» del paso 1 de «Cómo funciona»: hoy la frase sale tres veces y la tercera la gasta.", "El carrito de la cabecera como ícono con su número y su reloj, y fuera de la cabecera «Cómo funciona» y «La taquería» (quedan en el pie). Solo con esto la cabecera con sesión todavía no cabía a 375 px; con «Pedidos» e ícono de persona (aprobados después) sí cabe (W2).", "Un solo botón principal: «Pedir guisos» en el héroe, en «Todas las charolas» y en el cierre (hoy son tres textos distintos para lo mismo).", "Una sola palabra para la existencia: «quedan 5» en tarjeta, ficha y administración (hoy «disponibles», «en existencia» y «stock»).", "Los dos párrafos del envío, de 305 caracteres a 170, conservando el porqué del congelado y el «no prometemos».", "Los tres pasos de «Cómo funciona», cada uno en un título y una línea de menos de 50 caracteres.", "El error de red dice qué hacer: «No pudimos conectar. Revisa tu internet y dale otra vez.»", "Sin «Redis», «TTL» ni «base de datos» frente al cliente (carrito vencido, nota del reloj, bajadas de la landing); para la exposición, decisión de Alejandro.", "La bajada del héroe sin repetir el nombre del logotipo: «Los guisos de la taquería, en bolsa. Rompes, calientas y comes.»", "Los mensajes del servidor en la voz del sitio: «Ese correo ya tiene cuenta. Entra con él.» y «Solo quedan 5.»"]};
export const SECCIONES = [
 {
  "titulo": "Cabecera (igual en las tres páginas)",
  "nota": "Son los mismos textos en la landing, la tienda y «no encontrado».",
  "filas": [
   {
    "donde": "Logotipo, nombre accesible",
    "actual": "Los Tacos May, inicio",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Dice qué es y a dónde lleva.",
    "picto": null,
    "n": 21
   },
   {
    "donde": "Navegación, nombre accesible",
    "actual": "Principal",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Lo usa el lector de pantalla para saltar entre zonas.",
    "picto": null,
    "n": 9
   },
   {
    "donde": "Enlace",
    "actual": "Inicio",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "El logotipo ya lleva al inicio, pero no todos lo saben.",
    "picto": null,
    "n": 6
   },
   {
    "donde": "Enlace",
    "actual": "Guisos",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Corto y es lo que se vende.",
    "picto": null,
    "n": 6
   },
   {
    "donde": "Enlace",
    "actual": "Cómo funciona",
    "problema": "En celular la fila de enlaces no cabe y se desliza (W2)",
    "tipo": "Quitar",
    "propuesta": "Quitarlo de la cabecera: queda en el héroe («Cómo funciona») y en el pie.",
    "picto": null,
    "aplicado": "Sí",
    "n": 13
   },
   {
    "donde": "Enlace",
    "actual": "La taquería",
    "problema": "Igual que el anterior: alarga la fila en celular",
    "tipo": "Quitar",
    "propuesta": "Quitarlo de la cabecera; queda en el pie. Con estos dos fuera, la cabecera cabe a 375 px sin deslizar.",
    "picto": null,
    "aplicado": "Sí",
    "n": 11
   },
   {
    "donde": "Zona de cuenta, nombre accesible",
    "actual": "Tu cuenta",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 9
   },
   {
    "donde": "Enlace, sin sesión",
    "actual": "Entrar",
    "problema": "",
    "tipo": "Ícono + etiqueta",
    "propuesta": "Persona + «Entrar».",
    "picto": "Persona",
    "n": 6
   },
   {
    "donde": "Enlace, con sesión",
    "actual": "Mis pedidos",
    "problema": "Alarga la fila en celular",
    "tipo": "Ícono + etiqueta",
    "propuesta": "Caja + «Pedidos».",
    "picto": "Caja",
    "aplicado": "Aprobado después, para W2.",
    "n": 11
   },
   {
    "donde": "Enlace, administrador",
    "actual": "Admin",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Solo lo ve quien administra; corto.",
    "picto": null,
    "n": 5
   },
   {
    "donde": "Enlace, con sesión",
    "actual": "(nombre de la persona)",
    "problema": "Un nombre largo empuja la fila",
    "tipo": "Ícono + etiqueta",
    "propuesta": "Persona + el nombre, recortado a 12 caracteres con «…» (el completo, en su nombre accesible).",
    "picto": "Persona",
    "aplicado": "Aprobado después, para W2. En celular, solo el ícono (el nombre completo va para lector) y «Salir» queda en «Tu cuenta».",
    "n": 22
   },
   {
    "donde": "Botón, con sesión",
    "actual": "Salir",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Corto y claro. El ícono de «salir» no es universal: va con texto.",
    "picto": null,
    "n": 5
   },
   {
    "donde": "Botón del carrito",
    "actual": "Carrito",
    "problema": "Es la palabra más repetida del sitio y ocupa lugar en celular",
    "tipo": "Ícono solo",
    "propuesta": "Ícono de carrito + el número + el reloj. Nombre accesible: «Carrito, 3 guisos». Objetivo táctil de 44 px.",
    "picto": "Carrito",
    "aplicado": "Sí",
    "n": 7
   },
   {
    "donde": "Botón del carrito, para lector",
    "actual": "… guisos",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Completa el nombre accesible («Carrito 3 guisos»).",
    "picto": null,
    "n": 8
   },
   {
    "donde": "Enlace para teclado (landing y «no encontrado»)",
    "actual": "Saltar al contenido",
    "problema": "Falta en la tienda",
    "tipo": "Igual",
    "propuesta": "Igual, y agregarlo también a la tienda.",
    "picto": null,
    "n": 19
   }
  ]
 },
 {
  "titulo": "Pie (igual en las tres páginas)",
  "nota": "",
  "filas": [
   {
    "donde": "Logotipo, texto alternativo",
    "actual": "Los Tacos May",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 13
   },
   {
    "donde": "Dirección (enlace al mapa)",
    "actual": "José María Morelos S/N, Local 3, Centro, 23450 Cabo San Lucas, B.C.S.",
    "problema": "Parte en tres renglones en celular",
    "tipo": "Ícono + etiqueta",
    "propuesta": "Lugar + la dirección igual (es el dato real; no se acorta).",
    "picto": "Lugar",
    "n": 69
   },
   {
    "donde": "Navegación, nombre accesible",
    "actual": "Pie de página",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 13
   },
   {
    "donde": "Enlaces",
    "actual": "Inicio · Guisos · Cómo funciona · La taquería · Carrito · Entrar",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "En el pie sí caben, y reciben a los dos que salen de la cabecera.",
    "picto": null,
    "n": 64
   },
   {
    "donde": "Enlace",
    "actual": "Envíos y preguntas",
    "problema": "Largo para un enlace; se repite en 4 lugares",
    "tipo": "Más corto",
    "propuesta": "«Preguntas».",
    "picto": null,
    "n": 18
   },
   {
    "donde": "Nota",
    "actual": "Los guisos empacados y sus precios son de ejemplo mientras se confirma la carta real.",
    "problema": "Larga; la regla dice que se conserva",
    "tipo": "Más corto",
    "propuesta": "«Guisos empacados y precios de ejemplo: la carta real está por confirmarse.»",
    "picto": null,
    "n": 85
   }
  ]
 },
 {
  "titulo": "Títulos de pestaña y para compartir",
  "nota": "",
  "filas": [
   {
    "donde": "Landing, pestaña y al compartir",
    "actual": "Los Tacos May — Guisos de taquería ya hechos, al vacío",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Menos de 60 caracteres: se lee completo en el buscador.",
    "picto": null,
    "n": 54
   },
   {
    "donde": "Landing, descripción y al compartir",
    "actual": "Los guisos de Los Tacos May, la taquería de Cabo San Lucas, ya hechos y empacados al vacío. Rompes la bolsa, calientas y comes.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Menos de 155 caracteres; dice qué, de quién y cómo.",
    "picto": null,
    "n": 127
   },
   {
    "donde": "Tienda, pestaña inicial",
    "actual": "Los Tacos May — Tienda",
    "problema": "Solo se ve un instante: cada vista pone el suyo",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 22
   },
   {
    "donde": "Tienda, pestaña de cada vista",
    "actual": "Guisos · Tu carrito · Mis pedidos · Administrar guisos · Tu cuenta · Iniciar sesión · Crear cuenta · Envíos y preguntas — Los Tacos May",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Cortos y con la marca al final. «Envíos y preguntas» pasa a «Preguntas» si se acepta en el pie.",
    "picto": null,
    "n": 135
   },
   {
    "donde": "Tienda, pestaña de una ficha",
    "actual": "(nombre del guiso) — Los Tacos May",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 34
   },
   {
    "donde": "«No encontrado», pestaña",
    "actual": "No encontramos esa página — Los Tacos May",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 41
   },
   {
    "donde": "Anuncio al cambiar de página (lector)",
    "actual": "Página: (título)",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 16
   }
  ]
 },
 {
  "titulo": "Landing · héroe y la barra que gira",
  "nota": "",
  "filas": [
   {
    "donde": "Titular",
    "actual": "Ya está hecho.",
    "problema": "Se repite en el cierre y en el paso 1 de «Cómo funciona»: tres veces",
    "tipo": "Alternativas",
    "propuesta": "Ver «Textos de marca».",
    "picto": null,
    "n": 14
   },
   {
    "donde": "Bajada",
    "actual": "Guisos de Los Tacos May, en bolsa. Rompes, calientas y comes.",
    "problema": "Repite el nombre que está justo arriba en el logotipo",
    "tipo": "Alternativas",
    "propuesta": "Ver «Textos de marca».",
    "picto": null,
    "aplicado": "Con la alternativa 1.",
    "n": 61
   },
   {
    "donde": "Botón principal",
    "actual": "Pedir guisos",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Directo. Propongo que sea el único texto del botón principal en todo el sitio.",
    "picto": null,
    "n": 12
   },
   {
    "donde": "Enlace",
    "actual": "Cómo funciona",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 13
   },
   {
    "donde": "Fila que gira, nombre accesible",
    "actual": "Guisos de la barra",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 18
   },
   {
    "donde": "Número de charola",
    "actual": "02 · 08 · 09",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Es el número del pizarrón: parte del sistema.",
    "picto": null,
    "n": 12
   },
   {
    "donde": "Botón de la fila que gira",
    "actual": "Pausar (las charolas que giran)",
    "problema": "",
    "tipo": "Ícono solo",
    "propuesta": "Pausa / reanudar (universal). Nombre accesible: «Pausar las charolas» / «Reanudar las charolas».",
    "picto": "Pausa",
    "n": 31
   }
  ]
 },
 {
  "titulo": "Landing · lo que más sale",
  "nota": "",
  "filas": [
   {
    "donde": "Título",
    "actual": "Lo que más sale",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Así se habla en la barra.",
    "picto": null,
    "n": 15
   },
   {
    "donde": "Bajada",
    "actual": "El orden lo ponen los pedidos de la tienda, contados en vivo.",
    "problema": "Explica la técnica; larga",
    "tipo": "Más corto",
    "propuesta": "«Por pedidos, en vivo.» (para la exposición, el «en vivo» es la prueba de Redis).",
    "picto": null,
    "n": 61
   },
   {
    "donde": "Dato de la charola",
    "actual": "4 porciones · 12 en existencia · 3 vendidos",
    "problema": "Tres renglones en una charola de celular",
    "tipo": "Más corto",
    "propuesta": "«4 porciones · quedan 12». Lo vendido, solo como etiqueta en esta fila.",
    "picto": null,
    "aplicado": "En parte: «quedan 12»; lo vendido sigue en la charola.",
    "n": 43
   },
   {
    "donde": "Botón de la charola",
    "actual": "Pedir (nombre del guiso)",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 24
   },
   {
    "donde": "Sin existencia",
    "actual": "Se acabó por hoy",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Voz de la barra.",
    "picto": null,
    "n": 16
   }
  ]
 },
 {
  "titulo": "Landing · cómo funciona",
  "nota": "",
  "filas": [
   {
    "donde": "Título",
    "actual": "Cómo funciona",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Coincide con el enlace que lleva aquí.",
    "picto": null,
    "n": 13
   },
   {
    "donde": "Paso 1, título",
    "actual": "Ya está hecho",
    "problema": "Tercera vez que sale la frase",
    "tipo": "Alternativas",
    "propuesta": "Ver «Textos de marca».",
    "picto": null,
    "aplicado": "Quedó «Sale de la barra».",
    "n": 13
   },
   {
    "donde": "Paso 1, texto",
    "actual": "El guiso sale de la barra de la taquería, donde se sirve todos los días.",
    "problema": "Largo para una tarjeta",
    "tipo": "Más corto",
    "propuesta": "Ver «Textos de marca».",
    "picto": null,
    "aplicado": "Sí",
    "n": 72
   },
   {
    "donde": "Paso 2, título",
    "actual": "Rompe la bolsa",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 14
   },
   {
    "donde": "Paso 2, texto",
    "actual": "Va empacado al vacío, por porciones. Lo único que queda es abrirla.",
    "problema": "",
    "tipo": "Más corto",
    "propuesta": "Ver «Textos de marca».",
    "picto": null,
    "aplicado": "Sí",
    "n": 67
   },
   {
    "donde": "Paso 2, etiqueta de la bolsa",
    "actual": "(nombre del guiso)",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Nombre del guiso: no se cambia.",
    "picto": null,
    "n": 18
   },
   {
    "donde": "Paso 3, título",
    "actual": "Calienta y taquea",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 17
   },
   {
    "donde": "Paso 3, texto",
    "actual": "A la sartén o a la olla, como recalientas cualquier guiso, y a la tortilla.",
    "problema": "",
    "tipo": "Más corto",
    "propuesta": "Ver «Textos de marca».",
    "picto": null,
    "aplicado": "Sí",
    "n": 75
   },
   {
    "donde": "Número del paso",
    "actual": "1 · 2 · 3",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 9
   }
  ]
 },
 {
  "titulo": "Landing · todas las charolas",
  "nota": "",
  "filas": [
   {
    "donde": "Título",
    "actual": "Todas las charolas",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "La metáfora de la barra.",
    "picto": null,
    "n": 18
   },
   {
    "donde": "Bajada",
    "actual": "Precios y existencias se leen de la base de datos cada vez que abres esta página.",
    "problema": "Habla de la base de datos al cliente; larga",
    "tipo": "Más corto",
    "propuesta": "«Precios y existencias, en vivo.»",
    "picto": null,
    "aplicado": "Sí",
    "n": 81
   },
   {
    "donde": "Cargando",
    "actual": "Leyendo el menú…",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 16
   },
   {
    "donde": "Sin JavaScript",
    "actual": "El menú se consulta en vivo y necesita JavaScript. También puedes verlo en la tienda.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Solo lo ve quien no tiene JavaScript; dice qué hacer.",
    "picto": null,
    "n": 85
   },
   {
    "donde": "Botón",
    "actual": "Pedir en la tienda",
    "problema": "Tercer texto distinto para lo mismo («Pedir guisos», «Ir a la tienda»)",
    "tipo": "Reescribir",
    "propuesta": "«Pedir guisos».",
    "picto": null,
    "aplicado": "Sí",
    "n": 18
   },
   {
    "donde": "Botón, si falla",
    "actual": "Volver a intentar",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 17
   },
   {
    "donde": "Error",
    "actual": "No pudimos leer el menú. Dale otra vez, o entra a la tienda.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Dice qué pasó y qué hacer, con la voz.",
    "picto": null,
    "n": 60
   },
   {
    "donde": "Vacío",
    "actual": "Todavía no hay guisos en el menú.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 33
   }
  ]
 },
 {
  "titulo": "Landing · el envío",
  "nota": "El ticket ya es franco: dice qué falta. Lo largo son los dos párrafos.",
  "filas": [
   {
    "donde": "Título",
    "actual": "El envío, sin cuentos",
    "problema": "Dos renglones en celular",
    "tipo": "Alternativas",
    "propuesta": "Ver «Textos de marca».",
    "picto": null,
    "n": 21
   },
   {
    "donde": "Ticket",
    "actual": "Formato · Al vacío, congelado",
    "problema": "Dato sin confirmar: que se venda congelado es recomendación de Investigación (PENDIENTE-CLIENTE)",
    "tipo": "Ícono + etiqueta",
    "propuesta": "Congelado + «Al vacío, congelado» (con su PENDIENTE hasta confirmarlo).",
    "picto": "Congelado",
    "n": 29
   },
   {
    "donde": "Ticket",
    "actual": "A dónde llega · Por confirmar",
    "problema": "",
    "tipo": "Ícono + etiqueta",
    "propuesta": "Lugar + «Por confirmar».",
    "picto": "Lugar",
    "n": 29
   },
   {
    "donde": "Ticket",
    "actual": "Cuánto cuesta · Por confirmar",
    "problema": "",
    "tipo": "Ícono + etiqueta",
    "propuesta": "Precio + «Por confirmar».",
    "picto": "Precio",
    "n": 29
   },
   {
    "donde": "Ticket",
    "actual": "En cuántos días · Por confirmar",
    "problema": "",
    "tipo": "Ícono + etiqueta",
    "propuesta": "Reloj + «Por confirmar».",
    "picto": "Reloj",
    "n": 31
   },
   {
    "donde": "Párrafo",
    "actual": "El vacío le saca el aire a la bolsa, pero no conserva por sí solo: lo que cuida al guiso es el frío. Por eso va congelado y así se queda hasta que tú rompes la bolsa.",
    "problema": "Largo",
    "tipo": "Más corto",
    "propuesta": "Ver «Textos de marca».",
    "picto": null,
    "aplicado": "Sí",
    "n": 166
   },
   {
    "donde": "Párrafo",
    "actual": "Lo que dice «por confirmar» todavía no lo publicamos. Preferimos no prometerlo antes de tenerlo seguro; cuando lo esté, va a aparecer aquí.",
    "problema": "Largo",
    "tipo": "Más corto",
    "propuesta": "Ver «Textos de marca».",
    "picto": null,
    "aplicado": "Sí",
    "n": 139
   },
   {
    "donde": "Fuentes",
    "actual": "Sobre vacío y congelación: guías de inocuidad de USDA-FSIS y de la FSA del Reino Unido.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Son las fuentes reales; respaldan lo que se dice.",
    "picto": null,
    "n": 87
   }
  ]
 },
 {
  "titulo": "Landing · la taquería y el pizarrón",
  "nota": "",
  "filas": [
   {
    "donde": "Título (solo lector)",
    "actual": "May y la taquería",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 17
   },
   {
    "donde": "Dato 1",
    "actual": "May es una persona · Así le dicen al dueño desde siempre.",
    "problema": "",
    "tipo": "Alternativas",
    "propuesta": "Ver «Textos de marca».",
    "picto": null,
    "n": 57
   },
   {
    "donde": "Dato 2",
    "actual": "Unos 22 años en Cabo San Lucas · La taquería empezó ahí y ahí sigue.",
    "problema": "El año exacto es PENDIENTE-CLIENTE: «unos» se queda",
    "tipo": "Alternativas",
    "propuesta": "Ver «Textos de marca».",
    "picto": null,
    "n": 68
   },
   {
    "donde": "Dato 3",
    "actual": "Menos de 10 minutos · Los guisos ya están hechos y calientes: entras, comes y te vas.",
    "problema": "Largo",
    "tipo": "Alternativas",
    "propuesta": "Ver «Textos de marca».",
    "picto": null,
    "n": 85
   },
   {
    "donde": "Dirección",
    "actual": "José María Morelos S/N, Local 3, Centro, 23450 Cabo San Lucas, B.C.S.",
    "problema": "",
    "tipo": "Ícono + etiqueta",
    "propuesta": "Lugar + la dirección (dato real).",
    "picto": "Lugar",
    "n": 69
   },
   {
    "donde": "Pizarrón, título",
    "actual": "En el pizarrón de la taquería",
    "problema": "Largo para un título de pizarrón",
    "tipo": "Más corto",
    "propuesta": "«El pizarrón».",
    "picto": null,
    "n": 29
   },
   {
    "donde": "Pizarrón, los 14 guisos",
    "actual": "Corazón de vaca enamorada … Barbacoa de borrego",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Nombres de los guisos: no se cambian.",
    "picto": null,
    "n": 47
   },
   {
    "donde": "Pizarrón, nota",
    "actual": "Esto es lo que se sirve en la taquería. Lo que ya puedes pedir empacado está en las charolas en vivo.",
    "problema": "Larga",
    "tipo": "Más corto",
    "propuesta": "«Esto se sirve en la barra. Lo empacado está en las charolas en vivo.»",
    "picto": null,
    "n": 101
   }
  ]
 },
 {
  "titulo": "Landing · cierre",
  "nota": "",
  "filas": [
   {
    "donde": "Título",
    "actual": "Ya está hecho.",
    "problema": "Repite el titular (a propósito, como remate)",
    "tipo": "Alternativas",
    "propuesta": "Ver «Textos de marca».",
    "picto": null,
    "n": 14
   },
   {
    "donde": "Bajada",
    "actual": "Tú nomás escoge.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Corta, de tú y es el único guiño de la sección.",
    "picto": null,
    "n": 16
   },
   {
    "donde": "Botón",
    "actual": "Ir a la tienda",
    "problema": "Distinto del botón principal",
    "tipo": "Reescribir",
    "propuesta": "«Pedir guisos».",
    "picto": null,
    "aplicado": "Sí",
    "n": 14
   }
  ]
 },
 {
  "titulo": "Tienda · catálogo y tarjeta",
  "nota": "",
  "filas": [
   {
    "donde": "Título",
    "actual": "Guisos de taquería empacados al vacío",
    "problema": "Dos renglones en celular; la cabecera ya dice dónde estás",
    "tipo": "Más corto",
    "propuesta": "«Guisos empacados».",
    "picto": null,
    "n": 37
   },
   {
    "donde": "Grupos",
    "actual": "Lo que más sale · De $200 · Todos los guisos",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Agrupado por precio como el pizarrón.",
    "picto": null,
    "n": 44
   },
   {
    "donde": "Esqueleto, nombre accesible",
    "actual": "Cargando los guisos",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 19
   },
   {
    "donde": "Vacío",
    "actual": "Todavía no hay guisos en el catálogo.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 37
   },
   {
    "donde": "Tarjeta, etiqueta",
    "actual": "3 vendidos",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 10
   },
   {
    "donde": "Tarjeta, descripción",
    "actual": "(la del guiso)",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Solo sale si es propia de ese guiso.",
    "picto": null,
    "n": 14
   },
   {
    "donde": "Tarjeta, dato",
    "actual": "4 porciones · 5 disponibles",
    "problema": "«disponibles» aquí, «en existencia» en la landing, «stock» en administración: tres palabras para lo mismo",
    "tipo": "Más corto",
    "propuesta": "«4 porciones · quedan 5».",
    "picto": null,
    "aplicado": "Sí",
    "n": 27
   },
   {
    "donde": "Tarjeta, botón",
    "actual": "Agregar (nombre del guiso al carrito)",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "El verbo exacto; el nombre completo lo oye el lector.",
    "picto": null,
    "n": 37
   },
   {
    "donde": "Selector de cantidad",
    "actual": "− · número · +",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Ya son íconos universales con nombre accesible («Quitar uno», «Agregar uno»).",
    "picto": null,
    "n": 14
   },
   {
    "donde": "Selector, nombre accesible",
    "actual": "(guiso) en tu carrito",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 21
   },
   {
    "donde": "Sin existencia",
    "actual": "Se acabó por hoy",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 16
   },
   {
    "donde": "Aviso al agregar",
    "actual": "Agregado al carrito: (guiso).",
    "problema": "Repite lo que ya dice la bolsa que vuela al carrito",
    "tipo": "Quitar",
    "propuesta": "Quitarlo cuando corre el empacado; dejarlo con movimiento reducido (ahí no hay animación que lo diga).",
    "picto": null,
    "n": 29
   },
   {
    "donde": "Aviso, sin sesión",
    "actual": "Inicia sesión para agregar guisos al carrito.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Dice qué pasa y qué hacer.",
    "picto": null,
    "n": 45
   }
  ]
 },
 {
  "titulo": "Tienda · ficha de un guiso",
  "nota": "",
  "filas": [
   {
    "donde": "Regreso (en todas las vistas)",
    "actual": "← Seguir comprando",
    "problema": "Se repite en cada vista",
    "tipo": "Ícono + etiqueta",
    "propuesta": "Atrás + «Guisos».",
    "picto": "Atras",
    "n": 18
   },
   {
    "donde": "Dato",
    "actual": "4 porciones · 5 disponibles",
    "problema": "Igual que en la tarjeta",
    "tipo": "Más corto",
    "propuesta": "«4 porciones · quedan 5».",
    "picto": null,
    "aplicado": "Sí",
    "n": 27
   },
   {
    "donde": "Bloque",
    "actual": "Cómo se calienta · A la sartén o a la olla, como recalientas cualquier guiso.",
    "problema": "Instrucción general hasta tener la de cada guiso (PENDIENTE-CLIENTE)",
    "tipo": "Igual",
    "propuesta": "Ya lleva su pictograma (Calienta) con etiqueta.",
    "picto": "Calienta",
    "n": 77
   },
   {
    "donde": "Bloque",
    "actual": "Cómo se conserva · Va empacado al vacío y congelado. Guárdalo en el congelador hasta que lo vayas a usar.",
    "problema": "Largo",
    "tipo": "Más corto",
    "propuesta": "«Al vacío y congelado. Guárdalo en el congelador hasta usarlo.»",
    "picto": "Congelado",
    "n": 105
   },
   {
    "donde": "Enlace",
    "actual": "Envíos y preguntas",
    "problema": "",
    "tipo": "Más corto",
    "propuesta": "«Preguntas».",
    "picto": null,
    "n": 18
   },
   {
    "donde": "Sección",
    "actual": "Otros guisos",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 12
   },
   {
    "donde": "Guiso que no existe",
    "actual": "Ese guiso ya no está en la barra · Puede que se haya retirado del menú.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Dice qué pasó; el botón de abajo dice qué hacer.",
    "picto": null,
    "n": 71
   }
  ]
 },
 {
  "titulo": "Tienda · iniciar sesión y crear cuenta",
  "nota": "",
  "filas": [
   {
    "donde": "Títulos",
    "actual": "Iniciar sesión · Crear cuenta",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 29
   },
   {
    "donde": "Etiquetas",
    "actual": "Nombre · Correo · Contraseña",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Las etiquetas de un formulario son texto siempre.",
    "picto": null,
    "n": 28
   },
   {
    "donde": "Botones",
    "actual": "Entrar · Crear mi cuenta",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 24
   },
   {
    "donde": "Cambio",
    "actual": "¿No tienes cuenta? Créala · ¿Ya tienes cuenta? Entra",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 52
   },
   {
    "donde": "Lado, nombre accesible",
    "actual": "Para qué sirve tu cuenta",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 24
   },
   {
    "donde": "Lado, título",
    "actual": "Con tu cuenta",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 13
   },
   {
    "donde": "Lado, lista",
    "actual": "Agregas guisos a tu carrito. · Confirmas tu pedido. · Ves tus pedidos anteriores.",
    "problema": "",
    "tipo": "Ícono + etiqueta",
    "propuesta": "Charola + «Agregas guisos» · Listo + «Confirmas tu pedido» · Caja + «Ves tus pedidos».",
    "picto": "Charola",
    "n": 81
   },
   {
    "donde": "Error de campo",
    "actual": "Este campo no puede ir vacío.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Dice qué falta.",
    "picto": null,
    "n": 29
   },
   {
    "donde": "Error de campo",
    "actual": "Escribe un correo válido, como nombre@ejemplo.com.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Dice qué hacer con un ejemplo.",
    "picto": null,
    "n": 50
   },
   {
    "donde": "Errores de número",
    "actual": "Escribe un número. · Escribe un número entero. · Usa máximo dos decimales. · Revisa este campo.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 95
   },
   {
    "donde": "Error al entrar",
    "actual": "El correo o la contraseña no coinciden.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "No dice cuál de los dos (es lo seguro).",
    "picto": null,
    "n": 39
   },
   {
    "donde": "Error al crear (viene del servidor)",
    "actual": "Ese email ya está registrado",
    "problema": "Dice «email» y el resto del sitio dice «correo»; no dice qué hacer",
    "tipo": "Reescribir",
    "propuesta": "«Ese correo ya tiene cuenta. Entra con él.» (se traduce en la tienda, como el 401).",
    "picto": null,
    "aplicado": "Se traduce en la tienda (js/api.js), sin tocar el backend.",
    "n": 28
   },
   {
    "donde": "Aviso al entrar",
    "actual": "Hola, (nombre).",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "De tú y corto.",
    "picto": null,
    "n": 15
   },
   {
    "donde": "Aviso",
    "actual": "Inicia sesión para continuar.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 29
   }
  ]
 },
 {
  "titulo": "Tienda · tu cuenta",
  "nota": "",
  "filas": [
   {
    "donde": "Título",
    "actual": "Tu cuenta",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 9
   },
   {
    "donde": "Datos",
    "actual": "(nombre) · (correo) · Rol: administrador",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 40
   },
   {
    "donde": "Enlace",
    "actual": "Ver mis pedidos",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 15
   },
   {
    "donde": "Botón",
    "actual": "Cerrar sesión",
    "problema": "En la cabecera el mismo botón dice «Salir»",
    "tipo": "Reescribir",
    "propuesta": "«Salir», igual que en la cabecera.",
    "picto": null,
    "n": 13
   }
  ]
 },
 {
  "titulo": "Tienda · carrito y panel del carrito",
  "nota": "",
  "filas": [
   {
    "donde": "Título",
    "actual": "Tu carrito",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 10
   },
   {
    "donde": "Tiempo",
    "actual": "Tu carrito expira en 14:59",
    "problema": "",
    "tipo": "Ícono + etiqueta",
    "propuesta": "Reloj + «Expira en 14:59» (como en el panel).",
    "picto": "Reloj",
    "n": 26
   },
   {
    "donde": "Nota del tiempo",
    "actual": "Cada cambio renueva el tiempo. Si llega a cero, Redis borra el carrito solo (TTL).",
    "problema": "«Redis» y «TTL» son jerga para el cliente; para la exposición sí sirven",
    "tipo": "Más corto",
    "propuesta": "«Cada cambio renueva el tiempo; en cero, se vacía solo.» Decide Alejandro: si quiere que la demo lo diga en pantalla, se queda como está hasta después del examen.",
    "picto": null,
    "aplicado": "Sin las siglas; la cuenta regresiva se queda.",
    "n": 82
   },
   {
    "donde": "Renglón",
    "actual": "(guiso) · $200 c/u",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 18
   },
   {
    "donde": "Renglón, etiqueta",
    "actual": "Cantidad (de guiso)",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 19
   },
   {
    "donde": "Renglón, botón",
    "actual": "Quitar (guiso)",
    "problema": "",
    "tipo": "Ícono + etiqueta",
    "propuesta": "Bote + «Quitar» (el bote no es universal fuera de una computadora: va con texto).",
    "picto": "Quitar",
    "n": 14
   },
   {
    "donde": "Total",
    "actual": "Total: $400",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 11
   },
   {
    "donde": "Botones",
    "actual": "Confirmar pedido · Vaciar carrito",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 33
   },
   {
    "donde": "Vacío",
    "actual": "Tu carrito está vacío · Las charolas, no. Escoge tus guisos y aquí los juntamos.",
    "problema": "Dos frases donde basta una",
    "tipo": "Alternativas",
    "propuesta": "Ver «Textos de marca».",
    "picto": null,
    "n": 80
   },
   {
    "donde": "Aviso al quitar",
    "actual": "Quitaste (guiso). · Deshacer",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Corto y con salida.",
    "picto": null,
    "n": 28
   },
   {
    "donde": "Aviso al confirmar",
    "actual": "Pedido #7 confirmado por $400.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 30
   },
   {
    "donde": "Error, sin existencia (servidor)",
    "actual": "No hay stock suficiente de (guiso) (quedan 5)",
    "problema": "«stock»; ya va junto a la cantidad, así que repite el nombre",
    "tipo": "Reescribir",
    "propuesta": "«Solo quedan 5.» junto a la cantidad (se traduce en la tienda).",
    "picto": null,
    "aplicado": "Quedó «Solo quedan 5 de <guiso>.» (con el nombre, porque también sale como aviso general); se traduce en js/api.js.",
    "n": 45
   },
   {
    "donde": "Aviso, carrito vencido",
    "actual": "Tu carrito expiró por inactividad y Redis lo borró (TTL).",
    "problema": "Jerga; no dice qué hacer",
    "tipo": "Reescribir",
    "propuesta": "«Tu carrito se vació por inactividad. Vuelve a agregar tus guisos.» (misma decisión de la demo que arriba).",
    "picto": null,
    "aplicado": "Sí",
    "n": 57
   },
   {
    "donde": "Panel, título y cerrar",
    "actual": "Tu carrito · ✕ (Cerrar el carrito)",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "El ✕ ya es ícono universal con nombre accesible.",
    "picto": "Cerrar",
    "n": 34
   },
   {
    "donde": "Panel, tiempo",
    "actual": "Expira en 14:59",
    "problema": "",
    "tipo": "Ícono + etiqueta",
    "propuesta": "Reloj + «Expira en 14:59».",
    "picto": "Reloj",
    "n": 15
   },
   {
    "donde": "Panel, vacío",
    "actual": "Tu carrito está vacío. Las charolas, no.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Una frase y un guiño: así debería quedar también la vista del carrito.",
    "picto": null,
    "n": 40
   },
   {
    "donde": "Panel, botones",
    "actual": "Ver carrito · Seguir comprando",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 30
   }
  ]
 },
 {
  "titulo": "Tienda · mis pedidos",
  "nota": "",
  "filas": [
   {
    "donde": "Título",
    "actual": "Mis pedidos",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 11
   },
   {
    "donde": "Renglón",
    "actual": "Pedido #7 · 17 nov · 2 guisos · $400",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 36
   },
   {
    "donde": "Lado",
    "actual": "¿Otro guiso? · Ver guisos",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Un guiño y una salida.",
    "picto": null,
    "n": 25
   },
   {
    "donde": "Vacío",
    "actual": "Todavía no tienes pedidos · Cuando confirmes el primero, aquí va a quedar.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 74
   }
  ]
 },
 {
  "titulo": "Tienda · administración",
  "nota": "Solo la ve quien administra. Lo que importa es que sea claro y use las mismas palabras que el resto.",
  "filas": [
   {
    "donde": "Título",
    "actual": "Administrar guisos",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 18
   },
   {
    "donde": "Formulario, título",
    "actual": "Nuevo guiso · Editar «(guiso)»",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 30
   },
   {
    "donde": "Etiqueta",
    "actual": "Stock",
    "problema": "Anglicismo; el resto del sitio dirá «quedan»",
    "tipo": "Reescribir",
    "propuesta": "«Existencias».",
    "picto": null,
    "aplicado": "Sí",
    "n": 5
   },
   {
    "donde": "Etiquetas",
    "actual": "Nombre · Descripción · Precio (pesos) · Porciones",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 49
   },
   {
    "donde": "Botones",
    "actual": "Agregar guiso · Guardar cambios · Cancelar",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 42
   },
   {
    "donde": "Lista, título",
    "actual": "Guisos en el catálogo",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 21
   },
   {
    "donde": "Renglón",
    "actual": "$200 · 4 porciones · stock 5",
    "problema": "",
    "tipo": "Reescribir",
    "propuesta": "«$200 · 4 porciones · quedan 5».",
    "picto": null,
    "aplicado": "Sí",
    "n": 28
   },
   {
    "donde": "Renglón, botón",
    "actual": "Editar (guiso)",
    "problema": "",
    "tipo": "Ícono + etiqueta",
    "propuesta": "Lápiz + «Editar».",
    "picto": "Editar",
    "n": 14
   },
   {
    "donde": "Renglón, botón",
    "actual": "Eliminar (guiso)",
    "problema": "",
    "tipo": "Ícono + etiqueta",
    "propuesta": "Bote + «Eliminar».",
    "picto": "Quitar",
    "n": 16
   },
   {
    "donde": "Confirmación",
    "actual": "¿Eliminar? · Sí, eliminar · No",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 30
   },
   {
    "donde": "Marca",
    "actual": "✓ Guardado",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 10
   },
   {
    "donde": "Avisos",
    "actual": "Guardado: (guiso). · Agregado: (guiso). · Eliminado: (guiso).",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 61
   },
   {
    "donde": "Error (servidor)",
    "actual": "Solo un administrador puede hacer esto",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 38
   },
   {
    "donde": "Error (servidor)",
    "actual": "Dato faltante o inválido: (campo) ((tipo))",
    "problema": "Técnico; casi nunca sale porque la tienda valida antes",
    "tipo": "Igual",
    "propuesta": "Se queda como respaldo.",
    "picto": null,
    "n": 42
   }
  ]
 },
 {
  "titulo": "Tienda · envíos y preguntas",
  "nota": "",
  "filas": [
   {
    "donde": "Título",
    "actual": "Envíos y preguntas",
    "problema": "",
    "tipo": "Más corto",
    "propuesta": "«Preguntas».",
    "picto": null,
    "n": 18
   },
   {
    "donde": "Pregunta y respuesta",
    "actual": "¿Cómo vienen los guisos? · Empacados al vacío y congelados. Rompes la bolsa, calientas y comes.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 95
   },
   {
    "donde": "Pregunta y respuesta",
    "actual": "¿Ya hacen envíos? · Todavía no. A dónde llega, cuánto cuesta y en cuántos días está por confirmar; cuando esté seguro, va a aparecer aquí.",
    "problema": "Larga",
    "tipo": "Más corto",
    "propuesta": "«Todavía no. A dónde, cuánto cuesta y en cuántos días: por confirmar.»",
    "picto": null,
    "n": 138
   },
   {
    "donde": "Pregunta y respuesta",
    "actual": "¿Se paga en la página? · No. La tienda todavía no cobra: confirmar un pedido lo deja registrado en «Mis pedidos».",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Franca y dice qué pasa.",
    "picto": null,
    "n": 113
   },
   {
    "donde": "Pregunta y respuesta",
    "actual": "¿Por qué mi carrito tiene reloj? · El carrito se guarda por un tiempo y el reloj dice cuánto le queda. Cada cambio lo renueva; si llega a cero, se vacía solo.",
    "problema": "Larga",
    "tipo": "Más corto",
    "propuesta": "«Se guarda un rato y el reloj dice cuánto le queda. Cada cambio lo renueva.»",
    "picto": null,
    "n": 158
   },
   {
    "donde": "Pregunta y respuesta",
    "actual": "¿Los precios son los reales? · Los guisos empacados y sus precios son de ejemplo mientras se confirma la carta real.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Es la nota que la regla pide conservar.",
    "picto": null,
    "n": 116
   },
   {
    "donde": "Botón",
    "actual": "Ver guisos",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 10
   }
  ]
 },
 {
  "titulo": "Avisos y errores generales",
  "nota": "",
  "filas": [
   {
    "donde": "Error de red",
    "actual": "No se pudo conectar con el servidor.",
    "problema": "No dice qué hacer",
    "tipo": "Reescribir",
    "propuesta": "«No pudimos conectar. Revisa tu internet y dale otra vez.»",
    "picto": null,
    "aplicado": "Sí",
    "n": 36
   },
   {
    "donde": "Sesión vencida",
    "actual": "Tu sesión venció. Inicia sesión de nuevo.",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "",
    "picto": null,
    "n": 41
   },
   {
    "donde": "Cerrar un aviso",
    "actual": "✕ (Cerrar el aviso)",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Ícono universal con nombre accesible.",
    "picto": "Cerrar",
    "n": 19
   },
   {
    "donde": "Errores 401 del servidor",
    "actual": "Acceso no autorizado, …",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "No llegan a la pantalla: la tienda los convierte en «Tu sesión venció».",
    "picto": null,
    "n": 23
   }
  ]
 },
 {
  "titulo": "Animación de empacado",
  "nota": "La bolsa lleva el número de charola y el nombre del guiso; no tiene más texto.",
  "filas": [
   {
    "donde": "Etiqueta de la bolsa",
    "actual": "(número) · (nombre del guiso)",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Nombre del guiso: no se cambia.",
    "picto": null,
    "n": 29
   }
  ]
 },
 {
  "titulo": "Página de «no encontrado»",
  "nota": "",
  "filas": [
   {
    "donde": "Título",
    "actual": "Aquí no hay nada servido.",
    "problema": "",
    "tipo": "Alternativas",
    "propuesta": "Ver «Textos de marca».",
    "picto": null,
    "n": 25
   },
   {
    "donde": "Texto",
    "actual": "No encontramos la página que buscas. Puede que la dirección esté mal escrita o que ya no exista.",
    "problema": "Largo",
    "tipo": "Más corto",
    "propuesta": "«Esta página no existe o cambió de lugar.»",
    "picto": null,
    "n": 96
   },
   {
    "donde": "Botones",
    "actual": "Ir al inicio · Ver los guisos",
    "problema": "",
    "tipo": "Igual",
    "propuesta": "Dos salidas claras.",
    "picto": null,
    "n": 29
   }
  ]
 }
];
export const MARCA = [
 {
  "tema": "El titular «Ya está hecho.»",
  "hoy": "Sale tres veces en la landing: el titular, el cierre y el título del paso 1 de «Cómo funciona».",
  "alts": [
   "Dejarlo en el héroe y en el cierre, y quitarlo del paso 1 (el titular y el remate se contestan; el paso 1 lo gasta).",
   "Dejarlo solo en el héroe; el cierre usa otra frase de la plataforma.",
   "Dejarlo en las tres (como está)."
  ],
  "rec": "La 1. Repetirlo al principio y al final es un recurso conocido (abre y cierra); la tercera vez, en el paso 1, ya no remata nada y le quita fuerza.",
  "aplicado": "Aplicado el 17-nov-2026, con la 1."
 },
 {
  "tema": "La bajada del héroe",
  "hoy": "«Guisos de Los Tacos May, en bolsa. Rompes, calientas y comes.» (61)",
  "alts": [
   "«Los guisos de la taquería, en bolsa. Rompes, calientas y comes.» (63): quita el nombre que ya está en el logotipo y dice «taquería», que es la prueba.",
   "«El guiso de la barra, ahora en bolsa. Tú nomás calientas.» (57)",
   "«Guiso de taquería, empacado al vacío. Rompes, calientas y comes.» (64)"
  ],
  "rec": "La 1: se queda con la promesa en tres verbos y cambia lo único que sobraba.",
  "aplicado": "Aplicado el 17-nov-2026, con la 1."
 },
 {
  "tema": "Los títulos de sección",
  "hoy": "«Lo que más sale» · «Cómo funciona» · «Todas las charolas» · «El envío, sin cuentos» · «May y la taquería» (solo lector)",
  "alts": [
   "Dejar todos menos el del envío.",
   "Envío: «Envío, sin cuentos» (18; cabe en un renglón a 375 px).",
   "Envío: «Lo que falta del envío» (22; más literal)."
  ],
  "rec": "Los cuatro primeros se quedan: son voz de la barra y claros. El del envío pasa a «Envío, sin cuentos»."
 },
 {
  "tema": "Los tres pasos de «Cómo funciona»",
  "hoy": "1 «Ya está hecho» · El guiso sale de la barra de la taquería, donde se sirve todos los días. (72) / 2 «Rompe la bolsa» · Va empacado al vacío, por porciones. Lo único que queda es abrirla. (67) / 3 «Calienta y taquea» · A la sartén o a la olla, como recalientas cualquier guiso, y a la tortilla. (75)",
  "alts": [
   "1 «Sale de la barra» · Se guisa y se sirve en la taquería todos los días. (50) / 2 «Rompe la bolsa» · Al vacío, por porciones. Nomás ábrela. (37) / 3 «Calienta y taquea» · En sartén u olla, como cualquier guiso. (39)",
   "1 «Hecho en la taquería» · El mismo guiso que se sirve en la barra. (42) / 2 y 3 como la 1.",
   "Títulos solos en tres verbos, como la etiqueta de la bolsa: «Rompe.» «Calienta.» «Taquea.», con el paso de la barra como bajada de la sección."
  ],
  "rec": "La 1: cada tarjeta queda en un título y una línea de menos de 50 caracteres, y el paso 1 deja de repetir el titular.",
  "aplicado": "Aplicado el 17-nov-2026, con la 1."
 },
 {
  "tema": "«El envío, sin cuentos»: las dos líneas",
  "hoy": "Párrafo de 166 y párrafo de 139 caracteres.",
  "alts": [
   "«El vacío saca el aire; lo que cuida al guiso es el frío. Por eso va congelado hasta que rompes la bolsa.» (104) y «Lo que dice «por confirmar» no lo prometemos hasta tenerlo seguro.» (66)",
   "Una sola línea: «Va congelado: el vacío saca el aire y el frío lo cuida. Lo demás, cuando esté seguro.» (85)",
   "Dejarlas como están (son francas, solo largas)."
  ],
  "rec": "La 1: conserva el porqué del congelado (es lo que da confianza) y la promesa de no prometer, con la mitad de texto.",
  "aplicado": "Aplicado el 17-nov-2026, con la 1."
 },
 {
  "tema": "Los tres datos de la taquería",
  "hoy": "«May es una persona» · Así le dicen al dueño desde siempre. / «Unos 22 años en Cabo San Lucas» · La taquería empezó ahí y ahí sigue. / «Menos de 10 minutos» · Los guisos ya están hechos y calientes: entras, comes y te vas.",
  "alts": [
   "«Le dicen May» · Es el apodo del dueño de toda la vida. / «Unos 22 años en Cabo» · Ahí empezó y ahí sigue. / «Menos de 10 minutos» · Llegas, comes y te vas.",
   "«May es el dueño» · Así le dicen desde siempre. / los otros dos como la 1.",
   "Dejar los títulos y acortar solo el tercer texto a «Llegas, comes y te vas.»"
  ],
  "rec": "La 1. «Llegas, comes y te vas» es una de las frases de la plataforma y es literal de la barra. «Unos 22 años» se queda con «unos»: el año exacto sigue PENDIENTE-CLIENTE."
 },
 {
  "tema": "El cierre",
  "hoy": "«Ya está hecho.» · «Tú nomás escoge.» · botón «Ir a la tienda»",
  "alts": [
   "Igual, con el botón «Pedir guisos» (el mismo del héroe).",
   "«El guiso ya está.» · «Tú nomás calienta.» · «Pedir guisos»",
   "«Tú nomás escoge.» como título, sin bajada."
  ],
  "rec": "La 1: el titular contesta al del héroe y la bajada es el único guiño; solo se unifica el botón."
 },
 {
  "tema": "El carrito vacío",
  "hoy": "«Tu carrito está vacío» · «Las charolas, no. Escoge tus guisos y aquí los juntamos.»",
  "alts": [
   "«Tu carrito está vacío» · «Las charolas, no.» (como el panel; un guiño por pantalla)",
   "«Todavía no agregas guisos» · «Las charolas están llenas.»",
   "Dejarlo como está."
  ],
  "rec": "La 1: el botón de abajo («Ver guisos») ya dice qué hacer; la segunda frase sobraba."
 },
 {
  "tema": "La página de «no encontrado»",
  "hoy": "«Aquí no hay nada servido.» · «No encontramos la página que buscas. Puede que la dirección esté mal escrita o que ya no exista.» (96)",
  "alts": [
   "Dejar el título y acortar: «Esta página no existe o cambió de lugar.» (40)",
   "«Esta charola está vacía.» · igual que la 1.",
   "«Se acabó… o nunca hubo.» · igual que la 1."
  ],
  "rec": "La 1: el título ya tiene la voz; lo de abajo solo tiene que decir qué pasó, y los dos botones dicen qué hacer."
 }
];
export const ICONOS = [
 {
  "que": "Carrito de la cabecera",
  "como": "Ícono solo",
  "picto": "Carrito",
  "por": "Universal en una tienda. Lleva su número y su nombre accesible «Carrito, N guisos»."
 },
 {
  "que": "Cerrar (panel del carrito, aviso)",
  "como": "Ícono solo",
  "picto": "Cerrar",
  "por": "Universal. Ya está como «✕»; se dibuja con la retícula para que pese igual que lo demás."
 },
 {
  "que": "Más y menos (cantidad)",
  "como": "Ícono solo",
  "picto": null,
  "por": "Universal; ya están."
 },
 {
  "que": "Pausa y reanudar (la barra que gira)",
  "como": "Ícono solo",
  "picto": "Pausa",
  "por": "Universal en contenido que se mueve. Reanudar: «Sigue»."
 },
 {
  "que": "Regreso a los guisos",
  "como": "Ícono + etiqueta",
  "picto": "Atras",
  "por": "La flecha sola es universal para «atrás», pero aquí no es el atrás del navegador: lleva a los guisos. Con etiqueta «Guisos»."
 },
 {
  "que": "Entrar / tu cuenta",
  "como": "Ícono + etiqueta",
  "picto": "Persona",
  "por": "La persona se entiende como «cuenta», pero no dice si entras o ya entraste."
 },
 {
  "que": "Mis pedidos",
  "como": "Ícono + etiqueta",
  "picto": "Caja",
  "por": "Del sistema. Sin etiqueta podría ser «envíos»."
 },
 {
  "que": "Quitar del carrito, eliminar un guiso",
  "como": "Ícono + etiqueta",
  "picto": "Quitar",
  "por": "El bote no es universal en celular para todos; con etiqueta."
 },
 {
  "que": "Editar un guiso",
  "como": "Ícono + etiqueta",
  "picto": "Editar",
  "por": "El lápiz se entiende, pero en administración conviene no adivinar."
 },
 {
  "que": "Tiempo del carrito",
  "como": "Ícono + etiqueta",
  "picto": "Reloj",
  "por": "Del sistema. El reloj solo no dice que el carrito expira."
 },
 {
  "que": "Datos del envío (formato, a dónde, cuánto, en cuántos días)",
  "como": "Ícono + etiqueta",
  "picto": "Congelado · Lugar · Precio · Reloj",
  "por": "Ayudan a leer el ticket de un vistazo; el texto se queda."
 },
 {
  "que": "Dirección",
  "como": "Ícono + etiqueta",
  "picto": "Lugar",
  "por": "Del sistema; marca que es un lugar al que se llega."
 },
 {
  "que": "Para qué sirve tu cuenta (lista)",
  "como": "Ícono + etiqueta",
  "picto": "Charola · Listo · Caja",
  "por": "Del sistema."
 },
 {
  "que": "Salir",
  "como": "Texto",
  "picto": null,
  "por": "El ícono de «salir» (puerta, flecha) se confunde con «atrás» o «compartir»."
 },
 {
  "que": "Confirmar pedido, Vaciar carrito, Agregar",
  "como": "Texto",
  "picto": null,
  "por": "Son acciones con consecuencia: el verbo exacto no se cambia por un dibujo."
 },
 {
  "que": "Nombres de guiso, precios, porciones",
  "como": "Texto",
  "picto": null,
  "por": "Son el producto y datos: siempre texto."
 },
 {
  "que": "Mensajes de error y avisos",
  "como": "Texto",
  "picto": null,
  "por": "Tienen que decir qué pasó y qué hacer."
 }
];
export const NUEVOS = {
 "Carrito": "<path d=\"M2 4h3l2.2 10.6a1.6 1.6 0 0 0 1.6 1.3h9.6a1.6 1.6 0 0 0 1.6-1.2L22 7H6.2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><circle cx=\"9.5\" cy=\"20\" r=\"1.8\"/><circle cx=\"18\" cy=\"20\" r=\"1.8\"/>",
 "Persona": "<circle cx=\"12\" cy=\"7.5\" r=\"4.5\"/><path d=\"M3 21.5a9 7.5 0 0 1 18 0z\"/>",
 "Pausa": "<rect x=\"5\" y=\"3\" width=\"5\" height=\"18\" rx=\"1.5\"/><rect x=\"14\" y=\"3\" width=\"5\" height=\"18\" rx=\"1.5\"/>",
 "Sigue": "<path d=\"M6 3.7v16.6a1.2 1.2 0 0 0 1.8 1l13-8.3a1.2 1.2 0 0 0 0-2L7.8 2.7A1.2 1.2 0 0 0 6 3.7z\"/>",
 "Atras": "<path d=\"M20 12H5M11 5l-7 7 7 7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>",
 "Cerrar": "<path d=\"M5 5l14 14M19 5L5 19\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>",
 "Editar": "<path d=\"M3 21l1.2-5.4L15.6 4.2a2.2 2.2 0 0 1 3.1 0l1.1 1.1a2.2 2.2 0 0 1 0 3.1L8.4 19.8z\"/>",
 "Quitar": "<path d=\"M3 6h18M9 6V3.5h6V6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M5.5 8h13l-1.2 13.1a1 1 0 0 1-1 .9H7.7a1 1 0 0 1-1-.9z\"/>",
 "Precio": "<path fill-rule=\"evenodd\" d=\"M2 3.5A1.5 1.5 0 0 1 3.5 2h7.4a1.5 1.5 0 0 1 1.1.4l9.6 9.6a1.5 1.5 0 0 1 0 2.1l-7.5 7.5a1.5 1.5 0 0 1-2.1 0L2.4 12a1.5 1.5 0 0 1-.4-1.1zM7.5 5.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z\"/>"
};
export const NUEVO_NOMBRE = {"Carrito": "Carrito", "Persona": "Persona (cuenta)", "Pausa": "Pausa", "Sigue": "Reanudar", "Atras": "Atrás", "Cerrar": "Cerrar", "Editar": "Editar (lápiz)", "Quitar": "Quitar (bote)", "Precio": "Precio (etiqueta)"};
