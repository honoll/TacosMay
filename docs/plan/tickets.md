# Tickets — TacosMay

Fuente de verdad del trabajo. Entrega: semana del 17–20 nov 2026.

## Bloqueos que solo Alejandro puede quitar
- 🔲 **Crear la base en Redis Cloud** (plan gratis) y poner `REDIS_URL` en `.env`. Sin esto
  nada se puede verificar contra la nube.
- 🔲 **Fecha y hora exactas** de la exposición.
- 🔲 Menú y precios reales de TacosMay (`PENDIENTE-CLIENTE`; no bloquea la entrega: el seed
  usa datos de ejemplo).

## Backend
- 🔲 B1 Esqueleto con la estructura de 2026backA + conexión a Redis por `REDIS_URL`
- 🔲 B2 Usuarios y JWT (registro, login, `protect`, `soloAdmin`)
- 🔲 B3 CRUD de guisos + populares
- 🔲 B4 Carrito con TTL
- 🔲 B5 Pedidos (checkout transaccional)
- 🔲 B6 Seed (`npm run seed`) + README + `.env.example`

## Frontend
- 🔲 F1 Catálogo + populares
- 🔲 F2 Registro / login
- 🔲 F3 Carrito con cuenta regresiva de expiración
- 🔲 F4 Checkout + mis pedidos
- 🔲 F5 Panel admin (alta, edición y baja de guisos)

## Investigación
- 🔲 I1 Viabilidad: empaque al vacío, vida útil, cadena de frío, paqueterías, regulación
- 🔲 I2 Competencia y precios de referencia en México
- 🔲 I3 Insumos para el PDF: dominio del problema y justificación Clave-Valor vs SQL

## Coordinación
- 🔲 C1 Integrar y correr el flujo completo de la demo contra la nube
- 🔲 C2 PDF de diseño y justificación (5 secciones obligatorias de la rúbrica)
- 🔲 C3 Guion de demo (4 min) y preguntas probables de la defensa

## Cambios al contrato
_(propuestas de backend/frontend; coordinación las aplica en `docs/contrato.md`)_

## Después (fuera de la entrega)
- Pagos, cotización real de envío por código postal, lotes con fecha de caducidad,
  panel de pedidos para la cocina, marca y diseño propios.
