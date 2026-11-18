# Pasada de calidad, 18-nov-2026 (noche)

Todas las páginas a 390 (celular emulado), 1234 y 1440: inicio, tienda (lista, ficha, carrito, pedidos, entrar,
admin), `/domicilio/` (menú y orden), `/proyecto/`, `/marca/` y 404. Chrome sin ventana con movimiento reducido;
sesión, carrito y pedidos simulados solo en ese Chrome (en el sitio publicado no se creó ni se tocó nada).
Además de mirar las capturas se midió en cada página qué elemento se sale de la pantalla o de su caja.

**Ninguna página se desplaza de lado** en ningún tamaño (`scrollWidth === innerWidth` en las 36).

## Arreglado

| Dónde | Qué estaba mal | Arreglo |
|---|---|---|
| Cabecera, celular, con sesión | «Salir» aparecía al final de la fila (con cuenta de admin, cortado en el borde): la regla que lo esconde pesaba lo mismo que `:is(a, .salir)` y perdía por ir antes | `button.salir` (`barra.css`) |
| Inicio, 900–1300 | «4 a. m.» de las cifras medía hasta 55 px más que su tercio y se salía de la raya | tamaño topado al ancho de las cifras (`12.5cqi`); en 390 y 1440 queda igual |
| Carrito, celular | «Cantidad» arriba a la derecha y su casilla abajo a la izquierda | renglón angosto: el nombre solo y los controles juntos debajo (consulta de contenedor) |
| Administrar guisos, celular y 1440 | «Editar» a la derecha y «Eliminar» abajo a la izquierda | la misma regla; en 1234, un renglón como antes |
| 404 | La cola de la «Q» de «AQUÍ» tocaba «SERVIDO» (interlineado .84 heredado del inicio) | `.92` |

## Visto y dejado como está

- **Entrar (escritorio):** el formulario va centrado a lo alto junto al recuadro gris, que llena el alto: es a
  propósito, no se movió.
- **Las ollas del héroe y la raya punteada de los pasos** salen de su caja a propósito (recortadas por la sección).
- **`/marca/`** es la exploración de marca, con su propio estilo: no se tocó.
- **El cierre grande «Ya está hecho.» y la rejilla lista + bolsa:** sin cambios.

## No comprobado

Safari ni un iPhone de verdad (no hay WebKit en esta máquina). El panel del navegador seguía oculto: todo se
vio en capturas, no en vivo.
