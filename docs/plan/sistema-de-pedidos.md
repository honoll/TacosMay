# Plan — sistema de pedidos del estudio (primer cliente: Los Tacos May)

**Fecha:** 18-nov-2026 · **Estado:** propuesta para que Alejandro la apruebe; nada de esto
está construido.
**Se apoya en:** [investigación](../investigacion/sistema-de-pedidos.md) (mercado, reparto,
cobro, obligaciones, arquitectura), [domicilio.md](../diseno/domicilio.md) (flujos de Toks y
Orinoco ya llevados al prototipo `/domicilio/`) y
[reparto-a-domicilio.md](../investigacion/reparto-a-domicilio.md).

Lo que aquí es **estimación** o **recomendación** lo dice. Los precios y tarifas vienen de la
investigación, con sus reservas (varios salieron solo del buscador).

## 1. Qué se va a construir

Un sistema propio de pedidos para negocios de comida con local: el cliente pide desde la
página del negocio (a domicilio o para recoger), paga, y sigue su pedido; el negocio lo
recibe en la barra, lo acepta, lo prepara y lo entrega o lo manda con repartidor. Es lo que
Justo le da a Taquería Orinoco, hecho por el estudio.

- **Primer cliente:** Los Tacos May, barra del centro de Cabo San Lucas, con imagen nueva.
- **Después:** el mismo sistema para otros negocios, vendido por el estudio.
- **No es:** un marketplace tipo Uber Eats, un punto de venta, ni facturación electrónica.
  Tampoco reemplaza la tienda de guisos empacados; esa convive.

**El proyecto escolar no se toca.** Vive en la rama `escolar` de `honoll/TacosMay`
(Express + Redis). Este sistema no usa ese código de servidor.

## 2. Decisiones

### Ya tomadas por Alejandro (18-nov-2026)
| Decisión | Efecto |
|---|---|
| Se construye, no se contrata Justo ni OlaClick | El estudio queda como dueño del código |
| Se quiere vender a otros negocios | El diseño es para varios negocios desde el primer día |
| El proyecto escolar queda aparte | Rama `escolar` creada y publicada |

### Por tomar antes de programar
Cada una con mi recomendación. Las tres primeras **bloquean** el arranque.

| # | Decisión | Recomendación | Por qué |
|---|---|---|---|
| D1 | **ADR: el estudio vende un producto por mensualidad.** Hoy `nucleo/AGENTS.md` dice «No SaaS, no producto de suscripción» | Escribir el ADR que lo permita **solo para negocios con local**, cobrando instalación + mensualidad, con plan de salida (exportar datos) | Sin ADR, el sistema contradice el contrato del estudio. Yo lo redacto; tú lo apruebas |
| D2 | **Dónde vive el código** | Repositorio nuevo del estudio en `C:\estudio\`, privado, separado de TacosMay | Si se va a vender a otros, no puede vivir dentro del repo de un cliente ni junto a una entrega escolar |
| D3 | **Plataforma técnica** | Cloudflare (Workers + D1), como ONZA; con una prueba de dos días antes de comprometerse (§4) | Costo plano de unos US$5 al mes hasta 50 negocios y el estudio ya la opera. El riesgo es que Workers no es Node; la prueba lo despeja. Es un servicio de pago: pide tu aprobación (regla 8) |
| D4 | Quién recibe el dinero de los pedidos | Siempre la cuenta del restaurante; el estudio nunca toca dinero de terceros | Evita custodiar dinero y el supuesto de retención de IVA a plataformas. **Lo confirma un contador** |
| D5 | Pasarela de pago | Mercado Pago con la cuenta de la taquería; Stripe como alternativa | Es la que la gente ya conoce en México. Tarifas reales por confirmar en el panel |
| D6 | Reparto | Repartidor propio desde el día uno; Uber Direct cuando se haya cotizado desde la barra a mediodía, de noche y a las 4 a. m. | Nadie ha confirmado que Uber Direct cotice en Cabo de madrugada ni su precio en México |
| D7 | Pago al recibir | Sí al recoger y con repartidor propio; con Uber Direct solo pago en línea | Un repartidor de Uber no cobra por el negocio |
| D8 | Cómo llega el pedido a la barra | Tableta o teléfono con el panel, sonido que se repite hasta aceptar, impresora térmica de red | Es lo que usan los negocios chicos y cuesta poco (impresora MXN 1,100–2,900 en listados, sin confirmar) |
| D9 | Avisos al cliente | Página de estado por enlace + correo. WhatsApp solo en hitos y cuando haya número de negocio. Nunca SMS | Dos SMS por pedido con 50 negocios costarían unos US$10,900 al mes |
| D10 | Nombre del producto | Por decidir; mientras, nombre de trabajo «pedidos» | No bloquea |
| D11 | Precio para otros negocios | Hipótesis: instalación aparte + MXN 500–1,500 al mes, 0 % de comisión | Es interpretación, no dato de mercado; se valida con el segundo cliente |

## 3. Qué hace el sistema, por versión

La lista completa de funciones está en la investigación §2. Aquí, qué entra en cada versión.

### V0 — ya existe (prototipo)
`/domicilio/` en el sitio: menú por secciones, «+» directo, detalle con modificadores, orden
editable, propina, domicilio o recoger, invitado, número de pedido, seguimiento, cancelar e
historial. Todo simulado en el navegador; sirve para mostrarlo y como **especificación de
pantallas**.

### V1 — abrir con Los Tacos May (indispensable)
**Para el cliente**
- Menú por secciones con foto, precio y disponibilidad en vivo.
- Detalle del producto: modificadores obligatorios y opcionales, con tope y con costo; nota.
- Orden editable, propina, cuota de servicio si el negocio la quiere.
- Recoger en la barra o a domicilio, con zonas de entrega y costo por zona.
- Pedido como invitado: nombre y teléfono. Sin cuenta obligatoria.
- Pago en línea o al recibir, según el modo (D7).
- Página de estado por enlace, que se actualiza sola; correo de confirmación.
- Avisos de «cerrado», «abrimos a las…», producto agotado y tiempo estimado.

**Para el negocio (panel en tableta o teléfono)**
- Bandeja de pedidos: suena y repite hasta aceptar; aceptar con tiempo de preparación o
  rechazar con motivo; marcar listo, en camino y entregado.
- Menú: productos, secciones, modificadores, fotos, precios; **agotado** con un toque.
- Horario por día, incluido el que cruza la medianoche (cierra a las 4 a. m.); **pausar**
  pedidos; límite de pedidos simultáneos.
- Zonas y costo de entrega; datos del local.
- Impresión de la comanda.
- Historial y corte del día (pedidos, total, forma de pago, propinas).

**Para el estudio**
- Alta de un negocio a mano (sin autoservicio), con su marca: logotipo, colores, tipografía.
- Bitácora de errores y de webhooks; exportar los datos de un negocio.

### V2 — para vender al segundo negocio
- Varias sucursales por negocio (elegir local, buscador, horarios y teléfono por local).
- Uber Direct integrado: cotizar, crear, estados, cancelar.
- Pago conectado: cada negocio enlaza su cuenta de Mercado Pago (OAuth) sin que el estudio
  configure llaves a mano.
- Dominio propio del negocio; subdominio por defecto.
- Cupones, pedido programado, cuentas de cliente con direcciones guardadas y «pedir otra vez».
- Reportes: ventas por día y hora, productos más pedidos, tiempos.
- Alta de negocios desde un panel del estudio y cobro de la mensualidad.

### V3 — puede esperar
Lealtad, reseñas, WhatsApp completo, aplicación instalable, integración con punto de venta,
varios idiomas, facturación al cliente final.

## 4. Arquitectura propuesta

Recomendada, sujeta a D3 y a la prueba de dos días.

**La prueba (antes de escribir el sistema).** En un Worker de pruebas: crear un cobro de
Mercado Pago en modo de pruebas y recibir su webhook con firma verificada; pedir una
cotización al entorno de pruebas de Uber Direct; imprimir un texto en una impresora de red
desde el navegador de la tableta. Si las tres salen con `fetch` y sin librerías de Node, se
queda Cloudflare. Si no, se pasa a la opción 2 (Vercel + Supabase, unos US$45 al mes).

**Piezas**
| Pieza | Qué es | Con qué |
|---|---|---|
| Tienda del cliente | Páginas estáticas que leen la marca y el menú del negocio por su dominio | Se parte del prototipo `/domicilio/` (sin paso de compilación) |
| Panel del negocio | Aplicación web para tableta y teléfono, con sesión | Mismo estilo de código que la tienda |
| API | Una sola, con el negocio resuelto por dominio | Worker |
| Base de datos | Una base compartida; **todas las tablas llevan `tenant_id`** y se filtran en una sola capa de acceso | D1 |
| Tiempo real | Cliente: consulta cada 10–15 s. Cocina: empuje (SSE o un Durable Object por negocio) | — |
| Tareas en segundo plano | Tabla `jobs` + cron cada minuto; reintentos | Como dice la escalera del estudio, nivel 3 |
| Webhooks | Mercado Pago y Uber Direct: firma verificada e `event_id` único para no procesar dos veces | — |
| Archivos | Fotos del menú | R2 |
| Correo | Confirmación y estado | Resend (gratis hasta 3,000 al mes) |

**Modelo de datos (primer corte).** `tenants` (negocio, marca, dominio) · `locations`
(sucursal, dirección, horarios, pausa) · `menu_sections`, `products`, `modifier_groups`,
`modifiers` (con tope, obligatorio, costo, agotado) · `delivery_zones` · `customers`
(opcional) · `orders`, `order_items`, `order_item_modifiers` (con el precio del momento) ·
`order_events` (cada cambio de estado, quién y cuándo) · `payments` · `deliveries` ·
`staff_users` · `jobs` · `webhook_events`. Los modelos de TastyIgniter (MIT) y Saleor (BSD)
sirven de referencia, no de base.

**Estados del pedido.** `creado` → `pago_pendiente` | `pagado` → `aceptado` →
`en_preparacion` → `listo` → `entregado` (recoger) o `en_camino` → `entregado` (domicilio).
Salidas: `rechazado`, `cancelado`, `reembolsado`. Cada cambio se guarda en `order_events` y
es lo que ve la página de estado. Un pedido que nadie acepta en N minutos avisa por otro
canal y, pasado el límite, se cancela y se devuelve el cobro.

**Reglas que no se negocian**
- Los precios y totales se calculan en el servidor; el navegador nunca manda un total.
- El dinero se guarda en centavos, enteros.
- Ninguna llave en el repositorio; todo por variables de entorno.
- Datos de tarjeta: nunca pasan por el sistema; el pago ocurre en la página de la pasarela.
- Todo acceso a datos pasa por la capa que exige `tenant_id`; hay una prueba que falla si
  una consulta lo omite.
- Exportar los datos de un negocio existe desde V1 (plan de salida).

## 5. Fases

Las duraciones son **estimación** de trabajo con los chats del estudio, no compromiso.
Cada fase cierra con sus pruebas pasando y con algo que se puede enseñar. Las compuertas
marcadas **(tú)** no las puedo pasar sin ti.

### Fase 0 — Decisiones y trámites · ~1 semana, después del examen
- [ ] **(tú)** Aprobar D1 (ADR), D2 (repositorio) y D3 (plataforma).
- [ ] Redactar el ADR y actualizar `nucleo/AGENTS.md` al aprobarse.
- [ ] Crear el repositorio y su `CLAUDE.md`; nota en Cerebro.
- [ ] Hacer la prueba técnica de dos días (§4) y escribir su resultado.
- [ ] **(tú)** Cuenta de Mercado Pago de la taquería en modo de pruebas; alta en
      direct.uber.com; cotizar tres entregas reales desde la barra (mediodía, noche, 4 a. m.).
- [ ] **(tú, con la familia)** Contestar la lista de §8.
- [ ] **(tú)** Una consulta con contador: quién cobra, factura global y retención.
- **Terminado cuando:** las tres decisiones están firmadas, la prueba tiene resultado y hay
  menú vigente con precios.

### Fase 1 — Cimientos y menú · ~2 semanas
- [ ] Esqueleto: API, base con migraciones, capa de acceso con `tenant_id`, pruebas, CI.
- [ ] Negocio «Los Tacos May» dado de alta con su marca; la tienda lo carga por dominio.
- [ ] Menú real en la base; la tienda del prototipo deja de usar datos fijos y lee la API.
- [ ] Panel: iniciar sesión, editar menú, agotado, horario y pausa.
- **Terminado cuando:** desde el panel se cambia un precio o se marca agotado y la tienda lo
  refleja; cerrar el horario muestra «cerrado».

### Fase 2 — Pedir para recoger, pago al recibir · ~2 semanas
- [ ] Crear pedido en el servidor con totales recalculados; número de pedido; invitado.
- [ ] Bandeja en el panel con sonido, aceptar/rechazar, tiempos, listo y entregado.
- [ ] Página de estado por enlace; correo de confirmación.
- [ ] Reglas de horario, pausa, límite de pedidos y pedido sin aceptar.
- **Terminado cuando:** un pedido de prueba recorre todos los estados entre un teléfono y
  una tableta. **Esta fase ya es usable en la barra** sin pasarela ni reparto.

### Fase 3 — Pago en línea · ~1–2 semanas
- [ ] Cobro con Mercado Pago en la cuenta de la taquería; webhook con firma; pedido pagado
      solo cuando la pasarela lo confirma.
- [ ] Reembolso al rechazar o cancelar; propina; conciliación en el corte del día.
- **Terminado cuando:** pagos de prueba aprobados, rechazados y reembolsados dejan el pedido
  en el estado correcto, incluso si el webhook llega dos veces o tarde.
- **(tú)** Pasar de pruebas a cobros reales.

### Fase 4 — Domicilio · ~2 semanas
- [ ] Dirección con mapa y zonas de entrega con costo. Proveedor de mapas por decidir
      (servicio de pago: tu aprobación).
- [ ] Modo repartidor propio: asignar, en camino, entregado, cobro al recibir.
- [ ] Uber Direct detrás de la misma interfaz que ya tiene el prototipo (`cotizar`,
      `crearEntrega`, `estado`, `cancelar`), si la cotización de Fase 0 lo justifica.
- **Terminado cuando:** un pedido a domicilio de prueba se cotiza, se asigna y se sigue hasta
  entregado en los dos modos.

### Fase 5 — La barra · ~1 semana
- [ ] Comanda impresa; aviso por otro canal si nadie acepta; modo de poca señal.
- [ ] **(tú)** Comprar tableta o usar un teléfono, e impresora; probar el Wi-Fi del local.
- **Terminado cuando:** una persona de la barra recibe, acepta e imprime sin ayuda.

### Fase 6 — Lanzamiento en la taquería · ~2 semanas
- [ ] Imagen nueva aplicada (§6) y materiales con QR en el local.
- [ ] Aviso de privacidad, términos y datos de contacto publicados.
- [ ] Piloto cerrado con familia y conocidos; después, solo recoger; después, domicilio.
- [ ] Guía de una página para la barra y a quién llamar si falla.
- **(tú)** Decidir la fecha de apertura al público.
- **Terminado cuando:** una semana de pedidos reales sin pedidos perdidos.

### Fase 7 — Producto para otros negocios · ~3 semanas o más
- [ ] Lo de V2 que pida el segundo cliente, en ese orden.
- [ ] Página de venta del producto, precio y contrato de servicio.
- **Empieza solo** con la taquería operando y con un segundo negocio interesado.

**Total estimado hasta abrir en la taquería: 10 a 12 semanas de trabajo**, contando desde
que se aprueben las decisiones. La fase que más depende de terceros es la 0.

## 6. Nueva imagen de Los Tacos May

Corre en paralelo a las fases 1 a 5 y debe estar lista para la 6.

| Qué | Estado | Quién |
|---|---|---|
| Plataforma de marca («Ya está hecho»), ruta visual «La barra», tipografías, color por guiso | Hecho | — |
| Logotipo definitivo | **(tú)** elegir: 4B + 4C actuales o la variante con tacos (recomendada T3 + sello T5) | Marca |
| Foto de frente del letrero, para ajustar el cactus | Falta | Familia |
| Fotos reales de cada taco servido | Falta; hoy hay imágenes generadas, que no deben usarse para vender | Familia + dirección de arte ya escrita |
| Menú vigente con precios y qué lleva cada taco | Falta | Familia |
| Empaque para llevar y para domicilio | Sin dato | Familia; Marca propone |
| Materiales del local: cartel con QR en la barra, calcomanía, volante en la bolsa | Por diseñar | Marca |
| Página de pedidos con la marca: icono, nombre corto, imagen para compartir | Por diseñar | Marca + Frontend |
| Textos de la página de pedidos | Reglas ya escritas en `textos.md` | Frontend |

## 7. Riesgos

| Riesgo | Qué se hace |
|---|---|
| Soporte de madrugada para una sola persona | Alertas automáticas, modo «pausar» a un toque, guía en la barra y teléfono de respaldo; no prometer 24/7 a otros clientes |
| Uber Direct no cotiza en Cabo o de madrugada | Repartidor propio es el modo base, no el plan B |
| Workers no corre una librería necesaria | Prueba de dos días antes; opción 2 lista |
| Un pedido pagado que nadie ve | Sonido repetido, segundo canal, cancelación con reembolso automático |
| Competir con OlaClick (MXN 200 al mes) | No competir en precio: instalación en persona, marca cuidada, negocio local |
| Obligaciones fiscales y de datos personales | Contador en Fase 0; aviso de privacidad y términos antes de abrir; el estudio no custodia dinero |
| Que el producto se abandone y deje negocios sin canal | Exportación de datos desde V1 y cláusula de salida en el contrato |
| Distraerse del examen | Nada de esto empieza antes de la exposición |

## 8. Lo que hay que pedirle a la familia

La lista completa (15 preguntas, más 11 de reparto) está al final de la
[investigación](../investigacion/sistema-de-pedidos.md). Las que bloquean la Fase 1:

1. Menú vigente con precios, y si cambian a domicilio.
2. Qué lleva cada taco: salsas, extras con costo, qué se puede quitar.
3. Horario completo por día y días de descanso.
4. Quién atiende los pedidos en la barra, sobre todo de madrugada, y si hay Wi-Fi estable.
5. Cuánto tardan en armar un pedido y cuántos aguantan en hora pico.
6. Si tienen o tendrían repartidor propio.
7. Qué formas de pago aceptan hoy y si ya tienen Mercado Pago.
8. Teléfono y WhatsApp de la barra.

Datos fiscales (régimen, razón social) se piden pero **no se escriben en el repositorio**.

## 9. Costos

**Estimación**, con las reservas de la investigación.

| Concepto | Costo |
|---|---|
| Infraestructura (Cloudflare) | ~US$5 al mes hasta 50 negocios |
| Correo | US$0 hasta 3,000 al mes; luego US$20 |
| Pasarela | Comisión por cobro, a cargo del restaurante; tarifa por confirmar |
| Reparto | Por entrega, a cargo del cliente o del restaurante; tarifa de Uber Direct sin publicar |
| Mapas | Por decidir en Fase 4 |
| Equipo en la barra | Tableta o teléfono + impresora de red (MXN 1,100–2,900 en listados, sin confirmar) |
| Contador | Una consulta |

## 10. Cómo se trabaja

- Un repositorio nuevo con su contrato; este chat coordina y los chats de área construyen,
  en Opus 5.5 salvo que haga falta más.
- Un solo chat escribe en cada carpeta. Ramas por fase con PR; `main` siempre desplegable.
- Cada fase: pruebas automáticas de lo que mueve dinero y estados, y una prueba de punta a
  punta por flujo.
- Ningún servicio de pago se contrata sin tu aprobación explícita.
- Los datos del negocio son reales o van marcados `PENDIENTE-CLIENTE`.

## 11. Lo que sigue, en orden

1. Presentar el examen.
2. Que apruebes D1, D2 y D3.
3. Fase 0: ADR, repositorio, prueba técnica y lista de la familia.
