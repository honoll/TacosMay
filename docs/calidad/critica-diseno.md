# Crítica de diseño: inicio y tienda (18-nov-2026)

Alejandro vio el inicio nuevo y la tienda en su iPhone: «se ve poco profesional». No señaló una cosa: es el
conjunto. Esta crítica sigue el método del estudio (skill `dirigir-diseno`: la prueba de genericidad y el
repertorio genérico de `BIBLIA_ECOSISTEMA/evidencia/patrones-candidatos/repertorio-generico-de-ia.md`, cuya
señal de alarma es la **acumulación** de rasgos, no uno solo).

**Cómo se vio.** Capturas de página completa con Chrome por su protocolo de depuración, emulando un celular
de verdad (390 × 844, táctil, ×2) y un escritorio (1440 × 900), **con movimiento reducido** para no capturar
animaciones a medias, y bajando la página antes para que carguen las fotos diferidas. El panel del navegador de
esta sesión estaba **oculto**, por eso no se usaron sus capturas. Las capturas: `capturas/antes/` y
`capturas/despues/`.

**Contra qué se comparó.** Lo que Alejandro señaló como bien hecho: la tienda de pedidos de Orinoco
(<https://pido.taqueriaorinoco.com/pedir>) y la referencia del héroe (`docs/diseno/referencias/heroe-platos-gemini.png`).
La portada de Orinoco (<https://taqueriaorinoco.com/>) no sirve de modelo de oficio: es una página hecha a mano,
roja y saturada; lo que gusta de Orinoco es su tienda. Lo que la tienda de Orinoco hace bien no es adorno sino
**contención**: una sola tarjeta (blanca, filo gris de 1 px, esquinas chicas), un solo color de acento (rojo),
un solo botón redondo «+», un solo tamaño por nivel de texto, el mismo aire entre tarjetas y entre secciones.

## Por qué hoy se ve poco profesional (de más a menos peso)

1. **Demasiados lenguajes visuales a la vez.** En una sola página conviven: la charola con marco de acero de
   6 px, número y vapor; tarjetas blancas con filo negro de 2 px (personas de la barra); una tarjeta con sombra
   dura negra (tacos a domicilio); tarjetas oscuras con filo gris (cómo calentarlo); un ticket de papel con
   filo punteado sobre banda gris (el envío); fotos con marco de acero. Seis tratamientos de caja distintos: no
   se lee como un sistema, se lee como piezas pegadas. Es el rasgo que más pesa.
2. **El botón principal está en todas partes.** La franja de cuatro colores (la firma de la marca) va en «Pedir
   guisos», en cada «Pedir» de las charolas, en cada «Agregar» de «Otros guisos», en «Cómo llegar», en el
   carrito de la cabecera. Seis o siete franjas por pantalla: la firma deja de significar «esto es lo
   importante» y se vuelve ruido.
3. **El héroe en escritorio termina mal.** La caja de las ollas corta los círculos con una línea recta y abajo
   queda una franja vacía de unos 60 px antes de la siguiente sección: parece un error de maquetación, no un
   recorte intencional (en la referencia el corte coincide con el borde de la sección).
4. **Avisos de «muestra» a la vista en cada foto.** «Imagen de muestra, generada…» en cursiva gris bajo cada
   foto, más «Contenido de muestra…» y «Tiempos de muestra…»: cinco descargos en la página. Honestos, pero se ven
   a borrador. El registro de lo inventado ya vive en `docs/negocio/contenido-de-muestra.md` y en `data-muestra`.
5. **Fotos de ambiente que no son de una misma sesión.** La barra a baño maría es de luz fluorescente fría y
   encuadre de ¾; el cocinero sirviendo y el sellado son de luz cálida, cerrados. Juntas en la misma sección (dos
   fotos apiladas en celular) se nota que salen de generadores distintos.
6. **Escala tipográfica sin regla.** Los títulos de sección usan cinco tamaños (la taquería hasta 5,4 rem, el
   envío 3 rem, preguntas 4 rem, el cierre 15 rem); los subtítulos de nivel 3 otros seis (1,35 / 1,4 / 1,5 / 1,6
   / 1,8 / 2,6 rem); el texto corrido va de 17 a 19 px y las notas a 13–15 px en cursiva. Nada repite, así que
   nada se siente decidido.
7. **Fondos de sección en parches.** Crema, gris acero, negro, gris con papel crema dentro, crema, crema con
   filo, negro: cada sección con su fondo y su propio aire arriba y abajo. Sin ritmo.
8. **Secciones con forma de plantilla.** Personas de la barra = círculo de color con inicial + nombre + línea,
   en tarjetas iguales (avatar de iniciales, rasgo de plantilla). Cómo calentarlo = tres tarjetas iguales con
   icono. Es el bloque `título → 3 tarjetas` del repertorio genérico.
9. **«El envío, sin cuentos» no aporta.** Una sección entera con tres «Por confirmar» y dos enlaces en azul por
   defecto del navegador (USDA, FSA). Se ve sin terminar y repite lo que ya dicen las preguntas.
10. **El encabezado de «De la olla a tu casa» flota.** En escritorio el título queda arriba y su entrada abajo,
    separados por el alto de la foto: la columna parece desordenada.
11. **Tienda: jerarquía plana en cada renglón.** Nombre con número, chip «N vendidos», precio, porciones,
    «quedan N», barra de existencias y el «+», todo dentro de un filo negro de 2 px: cinco niveles pesando casi
    igual. Orinoco: nombre, descripción, precio y «+».
12. **Tienda en escritorio: la lista no cae en la retícula.** La lista empieza 40 px más adentro que la
    cabecera, y la bolsa vacía ocupa media pantalla.
13. **Ruido en las charolas.** El vapor en la esquina de cada charola y el número de color sobre la foto, en
    tarjetas de 160 px de ancho, compiten con el nombre.
14. **El pie es una nube de nueve enlaces.** Sin columnas ni agrupación; con la dirección subrayada larga.
15. **El cierre repite el héroe.** «Ya está hecho.» a 15 rem otra vez, con una banda negra casi vacía.

**Prueba de genericidad** (antes): si se cambia el nombre, el héroe con las ollas y los guisos del pizarrón
sigue siendo de esta taquería; las secciones nuevas (tarjetas con iniciales, tres tarjetas con icono, ticket
«sin cuentos») no: sirven igual para cualquier marca de comida. La identidad está en el héroe y en las charolas;
lo demás está en piloto automático.

## Qué se hizo (commits `b877f65` y `1fa8f15`)

Primero el sistema, en las hojas compartidas; después cada pantalla.

| # | Problema | Qué se hizo |
|---|---|---|
| 1 | Seis lenguajes de caja | Una regla: **rayas, no cajas**. Cifras, personas de la barra, cita, cómo calentarlo, preguntas y tacos a domicilio usan el mismo filo negro de 2 px (y uno gris de 1 px entre renglones). Fuera la sombra dura, las tarjetas con filo negro y las tarjetas oscuras. El marco de acero queda **solo para la comida** (ollas y charolas). |
| 2 | La franja en todos los botones | La franja va solo en el botón principal de cada pantalla. Dentro de una charola o un renglón el botón es liso (`barra.css`); los «Pedir» de «Lo que más sale» son secundarios (contorno). |
| 3 | El héroe termina en un corte con hueco | En ancho el héroe ya no tiene aire abajo: el corte de las ollas cae exactamente en la raya de la sección siguiente, como en la referencia. La pausa del giro va dentro de la caja de ollas, junto a «Toca una olla». |
| 4 | Cinco descargos de «muestra» | Fuera de la vista. Una sola línea en el pie de todas las páginas lo dice; lo inventado sigue marcado con `data-muestra` y listado en `docs/negocio/contenido-de-muestra.md`. |
| 5 | Fotos de sesiones distintas | Una foto por sección y las dos de luz cálida: sale la del baño maría (fluorescente fría). Un solo tratamiento: sin marco, esquinas de 8 px. |
| 6 | Escala tipográfica sin regla | Cuatro tamaños en `barra.css` (`--t-seccion`, `--t-sub`, `--t-texto`, `--t-nota`); todos los títulos de sección usan el mismo. |
| 7 | Fondos en parches | Crema en todas las secciones, el mismo aire (`--aire-seccion`) y la misma raya entre ellas; una sola banda oscura (cómo calentarlo) y el cierre oscuro que se une al pie. |
| 8 | Secciones de plantilla | Personas sin avatar de iniciales: nombre y una línea, en lista con rayas. Cómo calentarlo: tres columnas con el tiempo en grande, sin tarjetas. El movimiento de entrada se quitó de casi todo (entrar todo igual hace que nada destaque): solo las cifras y el trazo del proceso. |
| 9 | «El envío, sin cuentos» | Quitada. La contestan las preguntas «¿Cómo llega?» y «¿A dónde envían?». Con ella se fueron los enlaces azules por defecto. |
| 10 | El título del proceso flota | Título y entrada en un solo bloque, centrado junto a la foto. |
| 11 | Tienda: renglón con todo al mismo peso | Filo gris de 1,5 px en vez del negro de 2 px y sin sombra; «N vendidos» como dato chico, sin chip. |
| 12 | Tienda: la lista fuera de la retícula | La lista empieza donde empieza la cabecera (columna flexible + bolsa de 400 px). |
| 13 | Ruido en las charolas | Fuera el vapor de la esquina. |
| 14 | El pie, una nube de enlaces | Enlaces en columnas (2 en celular, 3 en escritorio); la dirección con subrayado fino. |
| 15 | El cierre repite el héroe | Franja: «Ya está hecho.» al tamaño de sección, la línea y el botón en un renglón. |

**Sin tocar, y por qué:**
- **La charola con número de color** (marco de acero, número): es la identidad de la ruta «La barra» y de la
  tienda. Se le quitó el vapor, no el marco.
- **La bolsa vacía grande en la tienda de escritorio:** es el concepto de la bolsa con compartimentos
  (`docs/diseno/empacado.md`); achicarla es una decisión de diseño de Alejandro, no un ajuste.
- **La barra de existencias en cada renglón:** enseña el `stock` de Redis en la demo del examen.
- **Las cajas grises «Cómo se calienta / Cómo se conserva» de la ficha:** contenido de la tienda; quedan para
  la siguiente pasada (mismo criterio de rayas).
- **La cabecera:** su estructura es compartida por las cinco páginas y la vigilan las pruebas de navegación; solo
  cambió por el sistema (franja).

**Prueba de genericidad (después).** Con el nombre cambiado, lo que queda es: ollas de guiso con aro de acero
vistas desde arriba, los guisos del pizarrón, «22 años · <10 minutos · 4 a. m.», el proceso de la olla a la
bolsa y el tiempo de calentado. Las tarjetas con iniciales y el ticket «sin cuentos», que eran lo intercambiable,
se fueron. Sigue habiendo dos piezas tipo plantilla: las preguntas en acordeón y la sección de dirección; son
convención útil, no adorno.

**Comprobado** (capturas de `capturas/despues/`, página completa, movimiento reducido): a 390 y a 1440, inicio,
lista de la tienda, ficha, carrito, entrar y registro; `scrollWidth === innerWidth` en las doce. Pruebas de
`frontend/` pasando. **No comprobado:** el movimiento (las capturas van sin él) ni en un iPhone de verdad.
