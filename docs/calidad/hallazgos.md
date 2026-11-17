# Hallazgos de la revisión

Registro de lo encontrado al ejecutar [plan-de-revision.md](plan-de-revision.md). Estado:
🔴 abierto · 🟡 corregido, falta volver a verlo · ✅ corregido y visto.

## Vuelta 1 — 17-nov-2026: navegación (inventario de enlaces)

| # | Dónde | Gravedad | Hallazgo | Estado |
|---|---|---|---|---|
| N1 | T1 Tienda | Bloquea | No hay ninguna forma de volver al inicio del sitio: ningún enlace de la tienda lleva a `/` | 🔴 |
| N2 | T1 Tienda | Grave | El logotipo de la tienda lleva a `#catalogo`, no al inicio del sitio | 🔴 |
| N3 | Tienda, todas las vistas | Grave | La tienda no tiene pie de página | 🔴 |
| N4 | T1 Tienda | Grave | Sin sesión no se ve el carrito en la cabecera ni se sabe que existe | 🔴 |
| N5 | L1 Landing | Menor | La cabecera no tiene acceso a «Entrar» ni al carrito; solo «Tienda» | 🔴 |
| N6 | L7 Landing | Menor | El pie solo trae dirección; faltan los enlaces principales | 🔴 |
| N7 | Sitio | Menor | No hay página de «no encontrado»: una dirección equivocada no ofrece volver | 🔴 |

## Vueltas anteriores (ya corregidas)

| Dónde | Hallazgo | Estado |
|---|---|---|
| Todo el sitio | Los diez SVG del logotipo eran XML inválido y no se pintaban | ✅ |
| T1 Tienda | Al cargar se desplazaba y escondía la cabecera con el logotipo | ✅ |
| L3 Landing | El sello sobre la etiqueta de la bolsa era ilegible | ✅ |
| T2 Tienda | Descripción en fuente del sistema; una sola columna en celular | ✅ |
| L1 Landing | Cabecera de tres renglones en celular | ✅ |
