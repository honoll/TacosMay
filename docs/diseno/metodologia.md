# Metodología — landing premium de Los Tacos May

Cómo se lleva la landing de «correcta» a «premium», paso por paso, con qué se entrega en
cada paso y cuándo se da por bueno. No repite la doctrina del estudio: la aplica.

- Doctrina que manda (no se copia aquí): `C:\estudio\BIBLIA_ECOSISTEMA\nucleo\diseno\`
  (`direccion-de-escena.md`, `movimiento.md`, `criterios-medibles.md`),
  `nucleo/proceso/04-disenar.md` y `playbooks/scroll-rigs.md`.
- Lo que este documento añade: **producción de materiales** (fotos, ilustración y animación
  hechas por Alejandro, parte con Gemini), que la doctrina todavía no cubre.
- Pendiente de absorber: `docs/investigacion/landing-premium.md` (lo está escribiendo el chat
  de Investigación). Se lee antes del paso 6; si contradice algo de aquí, se corrige aquí.

## Qué significa «premium» en este proyecto

No es lujo ni minimalismo caro. Es **una taquería de barrio contada con mucho oficio**:

1. **Material propio.** Su rótulo, su nopal, su pizarrón, sus guisos fotografiados. Nada de
   stock, nada que sirva igual para otra taquería.
2. **Un mundo coherente.** Todo parece pintado por la misma mano: letra, personaje, íconos,
   texturas y fotos comparten luz, color y trazo.
3. **Movimiento que cuenta algo.** Pocos momentos, bien hechos: cada animación explica el
   producto o le da vida al personaje. Lo demás se queda quieto.
4. **Acabado.** Tipografía afinada, espacios consistentes, estados cuidados (cargando, error,
   vacío), rápido en un celular de gama media.
5. **Honestidad.** La comida que se muestra como producto es foto real. Lo que no se sabe
   del negocio no se inventa.

## Los pasos

| # | Paso | Entregable | Se da por bueno cuando |
|---|---|---|---|
| 1 | **Estrategia** | Primera sección de `guion-landing.md`: para quién es, qué debe lograr la página, la frase que la resume | Alejandro lee la frase y dice «sí, eso somos». Se puede enunciar el antes y el después de quien visita |
| 2 | **Marca** | `marca.md`: idea central, voz, personaje, paleta, tipografía, texturas, estilo de foto e ilustración, qué no es | **Aprobada por Alejandro y su familia** (es su marca). Contrastes AA calculados. Nada copiado de otra taquería |
| 3 | **Guion** | `guion-landing.md`: escena por escena, con intención, material, movimiento, técnica y versión de celular | Cada escena dice en una línea de dónde a dónde lleva a la persona; hay un solo punto focal por escena; sobra cualquier escena que no pueda decirlo |
| 4 | **Pedido de materiales** | `materiales.md`: lista priorizada con prompts, formatos y nombres de archivo | Alejandro puede producir cada pieza sin preguntar nada. Queda claro qué es indispensable y qué es mejora |
| 5 | **Producción y control** | Archivos en `frontend/media/originales/` | Cada pieza pasa la revisión de abajo («Control de calidad de materiales») |
| 6 | **Prototipo gris** | La página con estructura, tipografía y coreografía reales, y marcadores rotulados donde va cada material | El recorrido completo funciona en celular y escritorio con los marcadores; los tiempos del scroll se sienten bien antes de meter imágenes |
| 7 | **Construcción** | Medios optimizados en `frontend/media/` y la página final | Presupuesto de peso cumplido (abajo); sin JavaScript y con movimiento reducido la página sigue completa |
| 8 | **Pulido** | Cinco pasadas, una por tema (abajo) | Cada pasada cierra con su lista revisada; Alejandro la ve en su celular y en su laptop |
| 9 | **Verificación** | F6 en `docs/plan/tickets.md` con evidencia | Los criterios medibles del estudio con números; la prueba de genericidad; la tienda sigue pasando `node frontend/js/api.test.mjs` |
| 10 | **Aprender** | Notas de qué funcionó, para el estudio | Lo reutilizable queda anotado para `evidencia/patrones-candidatos/` (lo decide Alejandro) |

**Regla de avance:** no se construye la versión final (paso 7) sin marca aprobada (paso 2) y
sin los materiales indispensables (paso 5). El prototipo gris sí puede adelantarse.

## Producción de materiales (lo que añade este proyecto)

### Quién hace qué
- **Alejandro produce:** fotos reales, y con Gemini las ilustraciones, el personaje, las
  texturas y los videos cortos de animación.
- **El chat de frontend:** escribe el pedido exacto, revisa cada pieza, la optimiza y la monta.

### La regla de honestidad
- **Foto real obligatoria:** todo lo que se presente como «esto es lo que te llega» o «esto
  se sirve en la taquería».
- **IA permitida:** personaje, ilustración, íconos, texturas, fondos, animación y retoque de
  fotos reales (limpiar fondo, corregir luz) **sin cambiar la comida**.
- **Provisional marcado:** si una imagen generada ocupa el lugar de una foto real mientras
  llega, lleva `PENDIENTE-CLIENTE` en el código y un rótulo visible; nunca se presenta como
  el producto.

### Cómo se mantiene todo «de la misma mano»
1. **Una hoja de estilo primero.** La primera pieza generada es la hoja del personaje
   (material 4). Aprobada esa, **se adjunta como referencia en todos los prompts siguientes**,
   junto con la foto del rótulo.
2. **Un mismo bloque de estilo** copiado al final de cada prompt (está en `materiales.md`).
3. **Animación a partir de video, no de cuadros sueltos.** Pedir cuadro por cuadro a un
   generador de imágenes da un personaje distinto en cada cuadro. Se pide **un video corto**
   con cámara fija y fondo liso, y de ahí se extraen los cuadros.
4. **Lotes:** cuatro variantes por pieza, se elige una, se corrige con un segundo prompt
   («igual, pero…») en vez de empezar de cero.

### Control de calidad de materiales
Una pieza se acepta si cumple todo:
- [ ] Se parece al rótulo real (colores, contorno negro, carácter del nopal).
- [ ] No trae texto generado (las letras las pone la página), ni marcas de agua visibles en
      la zona útil, ni manos o dedos deformes.
- [ ] Fondo liso del color pedido, o fondo real limpio en las fotos.
- [ ] Resolución y proporción pedidas; sin recortar al sujeto.
- [ ] Fotos de comida: enfocadas, sin flash, sin filtro, se entiende qué guiso es.
- [ ] En video: cámara quieta, el sujeto no cambia de forma, el primer y el último cuadro
      sirven como imagen fija.

Si falla, se devuelve con una sola corrección concreta, no con «hazla mejor».

## Decisiones técnicas de este proyecto

### Peldaño de movimiento
La doctrina manda subir de peldaño solo con justificación. Aquí queda así:

| Recurso | Peldaño | Por qué |
|---|---|---|
| Respuesta de botones, enlaces y estados | CSS | Es usabilidad |
| Íconos animados (taco, bolsa, tortilla) | CSS con hojas de sprites y `steps()` | El arte es de mapa de bits (viene de Gemini); un sprite pesa poco y no necesita librería |
| Entradas puntuales (menú, pizarrón) | CSS + `IntersectionObserver` | Ya resuelto en la versión actual |
| Escena firma: secuencia de imágenes ligada al scroll, y coreografía del héroe | **GSAP + ScrollTrigger**, guardado en `frontend/vendor/` | Aquí sí hay orquestación: anclado, avance por cuadros en `<canvas>`, y varias capas coordinadas. Es el único lugar donde se paga la librería |

No se usa: scroll suavizado por JavaScript, audio, cursores personalizados, ni animación en
bucle sin pausa.

### Presupuesto de peso (celular con datos)
- Lo que se necesita para ver el héroe: **menos de 350 KB** (HTML, CSS, fuente y la imagen
  principal en AVIF/WebP con respaldo).
- Fuente de títulos: menos de 100 KB.
- Secuencia de la escena firma: se carga **después** del héroe y solo al acercarse; unos 48
  cuadros a 720 px de ancho en celular (meta: 1.2 MB) y 72 a 1280 px en escritorio (meta: 3 MB).
- Sprites de íconos: menos de 60 KB cada uno.
- Ningún video bloquea el héroe; los bucles llevan imagen fija de respaldo.

### Optimización de lo que entregue Alejandro
Los originales se quedan en `frontend/media/originales/` (no se enlazan desde la página). De
ahí salen, con comandos de una sola vez y sin paso de build: imágenes en AVIF y WebP en dos o
tres anchos, cuadros extraídos de los videos, y hojas de sprites. Qué herramientas hay en la
máquina se revisa al empezar el paso 7.

## Las cinco pasadas de pulido (paso 8)
1. **Texto:** cada frase suena a letrero de taquería; cero relleno; ningún dato inventado.
2. **Tipografía y espacio:** tamaños, cortes de línea de los títulos en 375 y 1280, ritmo
   vertical consistente.
3. **Movimiento:** duración y curva de cada animación; nada compite con el punto focal;
   prueba con movimiento reducido.
4. **Estados y accesibilidad:** foco visible, teclado, lector de pantalla, cargando, error,
   vacío, sin JavaScript.
5. **Rendimiento:** pesos contra presupuesto, carga diferida, Lighthouse.

## Quién aprueba qué
- **Alejandro y su familia:** la marca (paso 2), las fotos y todo lo que diga algo del negocio.
- **Alejandro:** el guion (paso 3) y la validación visual de los pasos 6 a 8.
- **Frontend:** técnica, accesibilidad, rendimiento y la verificación con números.
