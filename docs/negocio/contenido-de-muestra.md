# Contenido de muestra del inicio

El inicio (`frontend/index.html`) es la versión que Alejandro le presenta a su familia. Por eso puede llevar
contenido **inventado** para que se vea completo (regla en `CLAUDE.md`, 18-nov-2026). Todo lo inventado está
aquí y, en el HTML, lleva `data-muestra` para encontrarlo con una búsqueda. Cuando la familia dé los datos,
se sustituye y se borra de esta lista.

**Lo que sí es real** (no se toca): Los Tacos May; May es el apodo del papá de Alejandro; unos 22 años en
Cabo San Lucas; barra de guisos a baño maría; entrar y salir en menos de diez minutos; gente que trabaja;
centro de Cabo; cierra a las 4 a. m.; el cactus del letrero; la dirección; los nombres de los guisos; los tres
que más piden (chorizo con huevo, rajas, carne en salsa roja). Fuente: [datos.md](datos.md).

Ningún dato inventado se atribuye a May ni a familiares reales.

## Lista

| Sección (ancla) | Qué es de muestra | Texto en la página |
|---|---|---|
| May y la taquería (`#taqueria`) | Tres personas de la barra, con nombre y una línea cada una | **Chayo** (mole y carne en salsa roja; llega antes que nadie), **Toño** (plancha y tortillas), **Lupita** (barra de noche, hasta el cierre) |
| May y la taquería | Una cita | «Aquí nadie espera: el guiso ya está.» — Chayo |
| May y la taquería | La cocina | Dos estufas de seis quemadores, ollas de peltre y de aluminio, baño maría de ocho ollas |
| May y la taquería | Foto de una persona sirviendo | Imagen generada `sirviendo` (A3); no es nadie real |
| De la olla a tu casa (`#como`) | Foto del sellado | Imagen generada `sellado` (A2) |
| Cómo calentarlo (`#calentar`) | Tiempos | Baño maría **8–10** min (bolsa cerrada), sartén **5–7** min, microondas **2–3** min (fuera de la bolsa) |
| Preguntas (`#preguntas`) | ¿Cuánto dura? | Congelado, hasta **seis meses**; descongelado en el refri, tres o cuatro días |
| Preguntas | ¿Y si llega mal? | Foto el mismo día y **te reponemos** el guiso o te devolvemos lo que pagaste |
| Preguntas | ¿Lleva conservadores? | No; lo cuidan el vacío y el frío |

**No es de muestra** (se quedó como está, porque contradiría a la tienda): el envío sigue «por confirmar» en
«¿A dónde envían?», igual que en la ayuda de la tienda, que dice que todavía no se hacen envíos. (La sección
«El envío, sin cuentos» se quitó el 18-nov: la contestan las preguntas.)

**Aviso a la vista:** una sola línea en el pie de todas las páginas dice que las fotos de ambiente y parte del
contenido del inicio son de muestra (antes había cinco descargos sueltos bajo fotos y bloques).

## Las imágenes generadas

En `frontend/media/originales/` (anotadas en su `LEEME.txt`) y, recortadas a 4:3, en `frontend/media/ambiente/`.
Se generaron el 18-nov-2026 con `herramientas/generar-imagen.ps1` (Antigravity), sin imagen de referencia.

| Archivo | Dónde va | Qué muestra |
|---|---|---|
| `A1-banio-maria.jpg` | (no se usa) | La barra a baño maría: se quitó del inicio el 18-nov porque su luz fría no casaba con las otras dos (docs/calidad/critica-diseno.md) |
| `A2-sellado.jpg` → `ambiente/sellado*.webp` | De la olla a tu casa | Manos con guantes y una porción sellada al vacío junto a la selladora |
| `A3-sirviendo.jpg` → `ambiente/sirviendo*.webp` | May y la taquería | Un cocinero de mandil sirviendo guiso en tortillas (sin cara reconocible) |
