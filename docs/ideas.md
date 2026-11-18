# Banco de ideas — Los Tacos May

Ideas que no están aprobadas ni en el plan. Se anotan aquí para no perderlas; ninguna se
construye hasta que Alejandro la saque del banco. Lo que ya está decidido vive en
`docs/plan/tickets.md`.

## 1. Pedidos de tacos a domicilio en Cabo San Lucas, desde la misma web

**Anotada:** 17-nov-2026, idea de Alejandro.

**La idea:** que la página no solo venda guisos al vacío para envío, sino que también sirva
para pedir los tacos de la taquería y que lleguen a la casa del cliente dentro de Cabo San
Lucas, como en Uber Eats.

**El modelo que tiene en mente:** la cadena de restaurantes Toks. En su página web el
cliente hace el pedido directo al restaurante, y al momento de entregarlo el pedido pasa a
ser una entrega de Uber: la plataforma solo lleva el producto.

**Por qué importa:** vender dentro de Uber Eats obliga a subir el precio de cada taco para
cubrir la comisión de la plataforma, y el cliente termina pagando más. Si el pedido se hace
en la web propia, se cobra al precio de la taquería y la plataforma solo cobra el envío.

**Lo que haría falta averiguar** (nada de esto está investigado todavía):
- Qué servicio permite «solo entrega» para un pedido hecho fuera de su app, y si opera en
  Cabo San Lucas: Uber, Rappi u otro. Requisitos para darse de alta como negocio.
- Cuánto cobra por entrega, quién lo paga (cliente o taquería) y cómo se cotiza antes de
  confirmar el pedido.
- Cómo se conecta con la web: si hay una interfaz para programadores, qué datos pide
  (dirección, horario, contenido) y cómo avisa del estado de la entrega.
- Zona de cobertura, horarios (la taquería del centro vende hasta las 4 a. m.) y tiempos.
- Cómo lo hace Toks en concreto, y qué otras taquerías o cadenas en México lo hacen igual.
- Pago: en línea o contra entrega; quién cobra y cómo se concilia.

**Lo que cambiaría en el proyecto:**
- Dos tipos de venta en la misma tienda: guiso empacado con envío nacional y tacos
  preparados con entrega local el mismo día. Carritos, existencias y tiempos distintos.
- El menú de tacos con sus precios vigentes (los del pizarrón tienen unos 10 meses).
- Dirección de entrega, cobertura por zona y seguimiento del pedido.
- En la cocina: cómo llega el pedido a la taquería y quién lo prepara y lo entrega al repartidor.
- Cobro en línea, que hoy la tienda no tiene.

**Relación con lo actual:** refuerza la idea central de la marca («Ya está hecho»: rápido,
para gente que trabaja) y usa la sucursal del centro como punto de salida. No es parte de
la entrega de la materia.
