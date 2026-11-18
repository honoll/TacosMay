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
