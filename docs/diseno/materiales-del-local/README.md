# Materiales del local y de la página de pedidos — Los Tacos May (18-nov-2026)

Lo de `docs/plan/sistema-de-pedidos.md` §6 marcado «Por diseñar | Marca»: los materiales del local,
la marca de la página de pedidos y una propuesta de empaque. Hecho con el sistema que ya existe
([sistema.md](../sistema.md): ruta 3 «La barra», Barlow Condensed y Barlow, la franja de cuatro
colores, la charola). **Es una propuesta:** nada se ha impreso ni está enlazado desde la tienda ni
desde `/domicilio/`.

- **Verlo:** `http://localhost:5000/marca/materiales/`, con cada pieza en las dos versiones del
  logotipo, lado a lado.
- **Imprimir:** los PDF de esta carpeta, a tamaño real y con el logotipo en uso.
- **Código:** `frontend/marca/materiales/`. Las piezas están en `piezas.js` y el logotipo en
  `logo.js`; `armar.mjs` arma todo y `rasterizar.py` saca los PNG y los PDF con PyMuPDF.

## El logotipo se cambia en un solo lugar
No está elegido: puede quedar el **4B + 4C** de hoy o pasar a **T3 + sello T5**, el de los tacos
([logos-tacos.md](../logos-tacos.md)). Cada pieza usa tres tamaños del logotipo:
- **grande**: cartel, bolsa e imagen para compartir.
- **línea**: volante y ticket.
- **chico**: calcomanía e íconos.

Para cambiarlo, edita `ELEGIDO` en `frontend/marca/materiales/logo.js` (`'vigente'` o `'tacos'`)
y corre:

```
node frontend/marca/materiales/armar.mjs
```

Eso rehace los PDF, los íconos, la imagen para compartir y la página. La comparación de las dos
versiones sale siempre. Hoy está en **`'vigente'`**.

El texto se guarda como trazos dibujados con las fuentes de la marca, así que los SVG y los PDF
no dependen de fuentes instaladas. Para convertirlo, `armar.mjs` usa `fontkitten`, que **no es
dependencia de TacosMay**: se toma de `C:\estudio\LaVictoria_Web\node_modules`. En otra máquina,
apunta la variable `FONTKITTEN` a una copia de `fontkitten/dist/index.js`.

## Las piezas

| Pieza | Medida | PDF | Qué lleva |
|---|---|---|---|
| **Cartel de la barra** | Carta, 216 × 279 mm | `cartel.pdf` | Logotipo grande · «Escanea y pide.» · «Desde tu celular, directo a la barra.» · QR de 66 mm · tres pasos (Escanea, Escoge, Sigue tu pedido) · franja al pie |
| **Calcomanía de cierre** | Redonda, 60 mm (64 con margen) | `calcomania.pdf` (a color, sobre etiqueta crema) · `calcomania-carton.pdf` (a una tinta, para imprimir sobre cartón) | Sello · «Cerrado en la barra» |
| **Volante para la bolsa** | ¼ de carta, 108 × 140 mm (salen 4 por hoja) | `volante.pdf` | Logotipo en línea · «La próxima, pídelos desde tu celular.» · QR de 38 mm · «Gracias por venir.» · franja |
| **Etiqueta del pedido** | Ticket térmico de 80 mm, en negro | `ticket-llevar.pdf` · `ticket-domicilio.pdf` | Para llevar o a domicilio en banda negra, número de pedido, datos, lo que lleva y el total. «—» = lo que pone cada pedido |

- **El QR es un hueco.** Tiene el tamaño y las tres esquinas de un QR real, pero no trae código
  porque la página de pedidos aún no tiene dirección (`PENDIENTE-CLIENTE`). Cuando exista, se
  genera el QR real del mismo tamaño y se pone en su lugar en `piezas.js` (función `qr`).
  Distancia de lectura: unos 60 cm el del cartel y unos 40 cm el del volante (regla de 10 a 1).
- **Los textos** siguen la voz del sistema (de tú, frases cortas, sin prometer). No prometen
  envío, horario, cobertura ni precio. «Directo a la barra» describe cómo funciona el sistema: el
  pedido llega a la barra (decisión D8 del plan).
- **Por qué «Cerrado en la barra»:** la calcomanía hace de sello. Si llega rota, el cliente sabe
  que alguien abrió la bolsa en el camino; por eso el ticket de domicilio dice «Si el sello llega
  roto, avísanos.»

## La página de pedidos
Los archivos están en `frontend/marca/materiales/pedidos/` y usan el logotipo en uso:

| Archivo | Para qué |
|---|---|
| `icono.svg` | Pestaña del navegador: el sello sobre una placa crema redondeada |
| `icono-180.png` | Ícono de pantalla de inicio en iPhone (`apple-touch-icon`) |
| `icono-192.png` · `icono-512.png` | Android e instalación |
| `icono-maskable-512.png` | Android con recorte: el logotipo va dentro del círculo seguro |
| `compartir.png` | Imagen para compartir, 1200 × 630 (WhatsApp, redes): logotipo, «Pide tus tacos.», las tres charolas que más salen (02, 08, 09) con número y nombre, y la franja. Sin fotos generadas |
| `manifest.webmanifest` | Nombre **«Los Tacos May — Pedidos»**, nombre corto **«Tacos May»** (9 letras; Android corta a unas 12), crema de fondo y negro de tema |

**Para Frontend** (no lo apliqué: `/domicilio/` no es carpeta de Marca). En el `<head>` de la
página de pedidos:

```html
<link rel="icon" type="image/svg+xml" href="/marca/materiales/pedidos/icono.svg">
<link rel="apple-touch-icon" href="/marca/materiales/pedidos/icono-180.png">
<link rel="manifest" href="/marca/materiales/pedidos/manifest.webmanifest">
<meta name="theme-color" content="#141210">
<meta name="apple-mobile-web-app-title" content="Tacos May">
<meta property="og:title" content="Los Tacos May — Pide tus tacos">
<meta property="og:image" content="/marca/materiales/pedidos/compartir.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<!-- PENDIENTE-CLIENTE: dominio; og:image y og:url deben ser direcciones absolutas -->
```

El manifiesto apunta `start_url` y `scope` a `/domicilio/`, el prototipo actual. Cuando el sistema
de pedidos tenga su dominio, se cambian ahí (y en `armar.mjs`, que lo genera).

## Empaque (propuesta)
La familia no ha dicho qué usa hoy para llevar ni para domicilio, así que esto es una propuesta para
platicarla con ellos, no algo decidido:

- **Bolsa de papel** en cartón natural, impresa a una tinta con el logotipo grande en negro y la
  franja al pie. Más barato todavía: una bolsa lisa con un **sello de goma** del logotipo, que es la
  misma pieza a una tinta.
- **Calcomanía en el doblez:** a una tinta sobre cartón para llevar; a color para domicilio, porque
  se nota más si llega rota.
- **Etiqueta del pedido**, impresa en la barra por la impresora térmica de 80 mm (decisión D8 del
  plan) y pegada a la bolsa. A domicilio lleva además teléfono, dirección y referencias.
- La medida de la bolsa depende de cuántos tacos van por pedido: `PENDIENTE-CLIENTE`.

En la página se ven los dos empaques, para llevar y a domicilio, con cada logotipo.

## Lo que necesita a Alejandro o a la familia
1. **El logotipo:** 4B + 4C o T3 + sello T5. Basta cambiar una palabra en `logo.js` y volver a armar.
2. **El dominio de la página de pedidos**, para generar el QR real y las direcciones absolutas de
   `og:image` (`PENDIENTE-CLIENTE`).
3. **Qué empaque usan hoy** y cuántos tacos van en un pedido típico, para fijar la bolsa.
4. **Si habrá domicilio desde el primer día.** Hasta saberlo, el cartel y el volante no lo
   mencionan.
5. Si están de acuerdo con «Cerrado en la barra» y «Gracias por venir» (voz de la barra), o cómo lo
   dicen ellos.

## Verificación
- Los 24 SVG (12 piezas × 2 versiones) y `pedidos/icono.svg` pasan un parseo XML estricto
  (Python `xml.etree`).
- Cada pieza se convirtió a imagen con PyMuPDF y se revisó a la vista en las dos versiones. Con eso
  se corrigió:
  - el acento de la «Í» del volante, que tocaba el renglón de arriba;
  - el hueco del QR, que estaba descentrado;
  - «Pedido» y «Nombre», que se enciman en el ticket;
  - la bolsa, que parecía vaso;
  - las charolas de la imagen para compartir, que estaban chicas.
- Los PDF miden lo que deben: 216 × 279, 108 × 140, 64 × 64, 80 × 141 y 80 × 157 mm.
- En `index.html` existen todos los archivos que enlaza, no hay ids repetidos y todas las anclas
  resuelven.
- **Sin verificar:**
  - La página `/marca/materiales/` en el navegador, en especial que no haya scroll horizontal a
    375 px. No se abrió.
  - Una impresión real: colores en papel y que el QR mida lo que debe al imprimir «tamaño real».
  - El ícono instalado en un celular.
  - El texto en trazos no lleva el interletraje de la fuente. En mayúsculas condensadas casi no se
    nota, pero conviene verlo impreso.
