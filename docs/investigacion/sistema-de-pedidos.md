# Sistema de pedidos para restaurantes — investigación

**Fecha:** 18-nov-2026 · **Autor:** chat de Investigación · **Para qué:** alimenta el plan
que escribe Coordinación. No decide nada: ordena lo encontrado y propone.

**Cómo leerlo.** Todas las fuentes se consultaron el **18-nov-2026**; cuando la página
trae fecha propia, va junto al enlace. **Verificado** = se leyó en la página. **Solo
buscador** = la cifra salió del resumen de un buscador y la página no se abrió; hay que
reconfirmarla. **Interpretación:** = lectura nuestra, no dato. Las páginas se leyeron con
una herramienta que resume, así que las cifras clave conviene reconfirmarlas a mano antes
de publicarlas o cotizar con ellas.

Este documento **no repite** [reparto-a-domicilio.md](reparto-a-domicilio.md) (proveedores
de reparto en Cabo, flujo base de Uber Direct, tabla de pagos inicial, impresión en cocina,
obligaciones básicas y comisiones de Uber Eats); lo amplía.

Nada de aquí es asesoría legal ni fiscal.

---

## Resumen (una página)

**Qué se quiere.** Un sistema propio de pedidos (menú, domicilio o recoger, pago,
seguimiento) como el que Justo le da a Taquería Orinoco, primero para Los Tacos May (Cabo
San Lucas, cierra a las 4 a. m.) y después para vender a otros negocios.

**Hallazgos principales**

1. **Justo sigue activo en México.** La tienda de Orinoco funciona y dice «Powered by»
   Justo, y getjusto.com muestra el logo «Justo México» (**verificado**). Un resultado de
   buscador sobre un «cese de operaciones en México» en diciembre de 2025 casi seguro
   habla de **Jüsto** (justo.mx), un súper en línea sin relación. No está verificado y no
   se debe decir que Justo salió de México.
2. **El mercado cobra suscripción con 0 % de comisión en el canal propio.** El dinero
   extra sale del reparto, los pagos y el marketplace (Justo, GloriaFood, Ordering.co). En
   México, OlaClick publica planes de **MXN 200 a 2,800 al mes** (**verificado**). Justo
   solo publica precios de Chile, en UF + IVA.
3. **Las funciones básicas son las mismas en todos.** Lo que se necesita para abrir es
   poco: menú con modificadores, horario que cruza la medianoche, pausa, agotado, una
   bandeja de pedidos que suena hasta que alguien acepta, página de estado y pago en
   línea.
4. **Reparto: Uber Direct alcanza para varios negocios.** La firma de webhooks
   (`x-uber-signature`, HMAC-SHA256), la ruta de cancelar y la API de **Direct
   Organizations** están confirmadas. El precio vigente en México no está publicado. Hace
   falta un modo «repartidor propio» desde el día uno.
5. **Cobro: el restaurante debe ser el comerciante.** Mercado Pago (OAuth de marketplace)
   y Stripe Connect permiten que el dinero entre directo a la cuenta de cada restaurante.
   Así el estudio nunca tiene dinero de terceros y, según nuestra lectura, se aleja del
   supuesto de retención del art. 18-J de la LIVA (lo tiene que confirmar un contador).
6. **La infraestructura es barata; los avisos no.** Con 50 restaurantes, la
   infraestructura cuesta entre US$5 y US$50 al mes. Dos SMS por pedido costarían unos
   US$10,900 al mes. Conclusión: el estado del pedido va en la web y los avisos, por
   correo o WhatsApp.
7. **Choque con el contrato del estudio.** `nucleo/AGENTS.md` dice «No SaaS, no producto
   de suscripción». Vender esto por mes lo contradice y necesita un ADR de Alejandro
   **antes** de programar.

**Recomendaciones**

- Separar dos cosas: **(a)** el canal de pedidos de Los Tacos May, que se puede hacer ya
  como proyecto de cliente, y **(b)** el producto para otros negocios, que espera el ADR.
- Diseñar desde el inicio con `tenant_id` en todas las tablas y un sistema compartido,
  aunque haya un solo cliente. No se decidió la plataforma: la opción tentativa es
  Cloudflare, por ONZA.
- Primera versión: pago en línea con la cuenta propia de la taquería, recoger en barra,
  domicilio con Uber Direct **solo si cotiza a las 4 a. m.** y, si no, con repartidor
  propio. En cocina, tableta y una impresora LAN de unos MXN 1,100 a 2,900.
- Antes de programar: cotizar Uber Direct a Cabo de madrugada, pedir cotización a Justo y
  a OlaClick como referencia, y que la familia conteste la lista `PENDIENTE-CLIENTE` del
  final.

---

## 1. Qué ofrece el mercado

### Justo, a fondo

**Qué es.** Justo es una startup chilena que pasó de «tienda en línea + reparto» a una suite
completa. Su portada muestra estos módulos: tienda propia con pagos y seguimiento de envíos,
reservas, lealtad, app propia con reparto, punto de venta con inventario y mesas,
«Commander» (junta pedidos de WhatsApp y otros canales), marketing, logística y «Justo AI».
Ofrece prueba gratis de 7 días. Clientes que muestra: Under Pizza, Sushi Ryge, Just Burger,
Dunkin' y otros. No da número de clientes ni lista de países (**verificado**,
[getjusto.com](https://getjusto.com/), © 2026).

**Precios (solo Chile).** La página de planes compara planes de Chile en UF/CLP, «de lista
+ IVA». No hay precios en MXN (**verificado**, [getjusto.com/planes](https://getjusto.com/planes)):

| Plan | Mensual | Alta (una vez) | Qué agrega |
|---|---|---|---|
| Inicia | UF 0,5 | UF 0 | — |
| Apps | UF 1 | UF 1 | 30 canales de venta |
| Ecom | UF 2 | UF 2,5 | Tienda y constructor de sitio |
| PDV | UF 3 | UF 5 | Punto de venta, pantalla de cocina, mesas, kiosko |
| 360 | UF 4 | UF 2,5 | Ecom + PDV |
| Élite | UF 7 | UF 5 | App propia y «conexión IA (MCP)» |

**Comisiones (verificado, misma página).**
- **0 %** en su plataforma, app propia y Commander, en todos los planes.
- Reparto JustoDelivery: 7 % (5 % en Élite).
- Pago en línea JustoPay: 1,8 % + CLP 500 (CLP 185 en Élite).
- Venta dentro de su marketplace JustoApp: 13 % (10 % en Élite).
- Logística en el pago: CLP 2.000 por 2 km + CLP 227 por cada 0,5 km.
- Bot de IA: CLP 37 por conversación de 24 h.

La página no nombra pasarelas, impresoras ni nivel de soporte.

**Interpretación:** el modelo de Justo es una suscripción barata con 0 % en el canal
propio, y gana con los extras por transacción (reparto, pagos, marketplace). No
convertimos UF a pesos: el tipo de cambio no se verificó.

**La tienda de Orinoco (verificado).** En
[pido.taqueriaorinoco.com/pedir](https://pido.taqueriaorinoco.com/pedir):
- el título dice «Pide - Taquería Orinoco»;
- el pie dice «Powered by» con el logo de Justo;
- navegación: Inicio, Ordenar y Ubicaciones;
- categorías: tacos, costras, especiales, complementos, postres y bebidas;
- notas tipo «toppings aparte», que sugieren modificadores con costo;
- inicio de sesión con cuenta Justo.

El recorrido paso a paso ya está en [domicilio.md](../diseno/domicilio.md#flujo-de-referencia-orinoco).
De ahí en adelante, pago, propina y seguimiento **no se vieron** porque los locales
estaban cerrados.

**Historia en México.**
- En abril de 2020, Contxto publicó que Justo planeaba entrar a México en tres meses
  (**verificado**, [Contxto, 30-abr-2020](https://www.contxto.com/en/chile/startup-justo-expand-mexico-help-smes/)).
- Habría empezado en México en agosto de 2020 con 30 restaurantes, y para 2022 estaría en
  cinco países con más de 10 mil restaurantes (**solo buscador**,
  [Xataka México](https://www.xataka.com.mx/aplicaciones/justo-app-entrega-comida-a-domicilio-llegara-agosto-para-competir-uber-eats-rappi-mexico),
  [El CEO](https://elceo.com/tecnologia/justo-la-startup-chilena-que-llega-competir-con-comisiones-mas-bajas-en-delivery/)).
- En 2020 levantó US$2,3 millones (**solo buscador**,
  [LatamList](https://latamlist.com/chilean-startup-justo-raises-2-3m-for-latam-expansion/)).
- En mayo de 2025 lanzó herramientas de IA (**solo buscador**,
  [G5 Noticias, 13-may-2025](https://g5noticias.cl/2025/05/13/con-foco-en-la-ia-justo-busca-que-restaurantes-ofrezcan-una-mejor-experiencia-a-sus-clientes/)).

**El conflicto del «cese de operaciones».** Un resultado de buscador habla de un adiós a
México el 15-dic-2025
([Tus Buenas Noticias, 16-dic-2025](https://www.tusbuenasnoticias.com/noticias/economia/2025/12/16/54647-justo-se-despide-de-mexico-que-pasara-con-tus-pedidos);
otro resumen lo atribuye a CB Insights). **No se abrió y no está verificado.** Hay un
homónimo: **Jüsto** (justo.mx), un supermercado en línea mexicano
([Xataka](https://www.xataka.com.mx/comercio-electronico/justo-llega-a-uber-eats-mexico-nueva-opcion-para-hacer-todo-super-salir-app/amp),
[caso de Adyen](https://www.adyen.com/es_MX/centro-de-informacion/adyen-la-clave-digital-para-las-entregas-exitosas-de-justo-supermercado-digital)).
Al 18-nov-2026, getjusto.com y la tienda de Orinoco funcionan. **Interpretación:** la nota
casi seguro es sobre Jüsto. Justo (getjusto.com, software para restaurantes) se ve activo
en México. Para cerrar la duda, hay que abrir la nota.

### Comparables

| Plataforma | Cobro publicado | Comisión en canal propio | Qué destaca | Fuente |
|---|---|---|---|---|
| **Justo** | UF 0,5–7/mes + IVA (Chile); alta UF 0–5 | 0 % | Suite completa; extras de reparto, pagos y marketplace | [planes](https://getjusto.com/planes), **verificado** |
| **OlaClick** (LatAm) | MXN 200 / 500 / 1,203 / 2,800 al mes, pagando el año por adelantado (de lista: 235.30 / 588 / 1,415 / 3,294) | Respuesta de su FAQ no capturada | Todos con punto de venta, menú digital y CRM; dominio .com el primer año; chatbot de WhatsApp; facturación; gestor de cocina; soporte por WhatsApp según el plan | [pricing.olaclick.app](https://pricing.olaclick.app/), **verificado**, sin fecha |
| **GloriaFood** (Oracle) | Gratis. Extras: punto de venta US$49/mes por sucursal (2 años), pagos en línea US$29/mes, marketing US$19/mes | Sin comisión | Zonas dibujadas, pedidos programados, cupones, menú QR | [pricing](https://www.gloriafood.com/pricing), **verificado** |
| **Owner.com** (EE. UU./Canadá) | US$249/mes + 5 % al restaurante, o US$499/mes sin él; el comensal paga 5 % | 5 % (plan Flex) | Alta incluida, soporte 24/7, app de marca | [pricing](https://www.owner.com/pricing), **verificado** |
| **Ordering.co** | No público («Request pricing») | Dice no cobrar comisión | Marca blanca, app de repartidores, zonas; soporte de 24–48 h (24/7 solo Enterprise); hecho para que agencias revendan | [pricing](https://www.ordering.co/pricing), **verificado** |
| **Parrot** (México) | «Desde $1,500 al mes», moneda no clara | — | Punto de venta, pagos, integra Rappi, Uber Eats y DiDi, tienda propia | [TrustRadius](https://www.trustradius.com/products/parrot-connect/reviews), **solo buscador** |
| **ChowNow** (EE. UU.) | Cifras de terceros: unos US$229 / 319 / 409 al mes | — | Reparto «Flex» con Uber Direct y DoorDash | [GetApp](https://www.getapp.com/all-software/a/chownow/), **solo buscador** |

**GloriaFood cierra.** El fin de servicio sería el 31-mar-2027 según un resumen de la
página de Oracle, o el 30-abr-2027 según terceros (**solo buscador**,
[Oracle F&B](https://www.oracle.com/sa/food-beverage/),
[Ordering.co blog](https://blog.ordering.co/whats-actually-happening-with-gloriafood)).
Según terceros, los datos no se conservan después
([gosnappy.io](https://gosnappy.io/blog/gloriafood-is-shutting-down-what-restaurant-operators-should-do/)).

**No se obtuvieron precios de:** Cluvi, Pedix y Soft Restaurant (sus páginas fallaron), ni
de Flipdish, Toteat o Fudo (no se investigaron).

### El hueco para un estudio pequeño en México

**Interpretación:** en funciones no hay hueco. OlaClick ya ofrece punto de venta, cocina,
WhatsApp y facturación desde MXN 200, y Justo agrega app, lealtad e IA. El hueco está en el
**servicio local en persona**:
- alta del menú y fotos hechas por alguien de la zona;
- SEO local y dominio propio;
- soporte por WhatsApp en el horario real del restaurante, incluida la madrugada;
- conocer cómo funciona el reparto en Cabo.

Owner.com dice en su propio blog que sirve más para restaurantes que ya venden que para
uno nuevo (**solo buscador**,
[Owner blog](https://www.owner.com/blog/online-ordering-system-for-restaurants)). Eso
refuerza que el diferenciador es el acompañamiento.

El cierre de GloriaFood abre una ventana corta para captar restaurantes que tienen que
migrar.

---

## 2. Lista maestra de funciones

**Interpretación:** las etiquetas son nuestras, no salen de ninguna fuente.
- **Abrir** = indispensable para abrir con una taquería.
- **2.º cliente** = hace falta para venderle a un segundo negocio.
- **Después** = puede esperar.

Las fuentes de cada función están en la columna de la derecha. «Domicilio» quiere decir que
ya existe en el prototipo de [domicilio.md](../diseno/domicilio.md).

### Tienda del cliente

| Función | Etiqueta | Referencia |
|---|---|---|
| Menú primero, por categorías; «+» agrega sin abrir | Abrir | Orinoco (visto); domicilio |
| Detalle con grupos de modificadores (obligatorio u opcional, tope, costo) y nota para cocina | Abrir | Orinoco, Toks; domicilio |
| Elegir domicilio o recoger, con tiempo estimado | Abrir | Orinoco; domicilio |
| Pedir como invitado (sin cuenta) | Abrir | Baymard lo recomienda por defecto (**solo buscador**, [Baymard](https://baymard.com/learn/checkout-flow-ux-optimization)) |
| Costos completos antes de pagar (envío, cuota, propina) | Abrir | LFPC art. 76 Bis fr. V (§5) |
| Confirmación con número de pedido visible | Abrir | **Solo buscador**, [Baymard](https://baymard.com/learn/audit-checkout-flow-hidden-friction) |
| Página de estado del pedido, en el sitio propio, por enlace y sin cuenta | Abrir | Seguimiento: la función de autoservicio más importante en el estudio de Baymard (**solo buscador**, [Baymard](https://baymard.com/research/self-service)) |
| Aviso «cerrado hasta…» y no dejar pagar con el local cerrado | Abrir | Orinoco (visto) |
| Contacto `tel:` / `wa.me` del local | Abrir | Regla del estudio; LFPC 76 Bis fr. III |
| Dirección con mapa y pin; compartir ubicación | 2.º cliente | Orinoco, Toks (vistos); necesita un servicio de mapas |
| Pedido programado | 2.º cliente | Flipdish (**solo buscador**); Toks (términos) |
| Varias sucursales con buscador | 2.º cliente | Orinoco, Toks |
| Cuentas, direcciones favoritas, historial | Después | Toks |
| Cupones, lealtad, marketing por correo | Después | GloriaFood, Owner, ChowNow |
| App nativa de marca | Después | Justo Élite, Owner |
| Pedido en mesa por QR | Después | ChowNow, GloriaFood |

### Panel del restaurante

| Función | Etiqueta | Referencia |
|---|---|---|
| Editar menú, precios, modificadores y fotos | Abrir | Todos |
| Horario por modo (domicilio o recoger) que **cruza la medianoche**, con «día comercial» y hora de corte | Abrir | Toast, Selflane (§6) |
| Excepciones por fecha (festivos, cerrado) | Abrir | Toast (**verificado**) |
| Pausar con reanudación automática | Abrir | GloriaFood (**verificado**), Square |
| Agotado por platillo u opción, «hasta mañana» o hasta una fecha | Abrir | GloriaFood (**verificado**) |
| Tiempo de preparación y «modo ocupado» (+10/15/20 min) | Abrir | Square, Owner (§6) |
| Zonas de entrega con costo y pedido mínimo | Abrir | §3 |
| Alerta «abierto pero no hay nada que pedir» | 2.º cliente | Caso de Square (§6) |
| Límite de pedidos por franja de 10–15 min | 2.º cliente | Owner (**verificado**), Flipdish |
| Usuarios y roles (dueño, barra) | 2.º cliente | Uber Direct `role_assignments` como modelo |

### Cocina y pantalla de pedidos

| Función | Etiqueta | Referencia |
|---|---|---|
| Bandeja única de pedidos con **sonido que se repite** hasta aceptar | Abrir | §6 |
| Aceptar o rechazar con motivo; estados recibido → preparando → listo | Abrir | GloriaFood (**verificado**) |
| Impresión automática de la comanda (impresora LAN) | Abrir | GloriaFood (**verificado**) |
| Indicador de en línea y de impresora (desconectada, sin papel) | Abrir | GloriaFood (**verificado**), yo-facturo (**solo buscador**) |
| Pedido de prueba | Abrir | GloriaFood (**verificado**) |
| Aviso de escalamiento (WhatsApp o llamada) si no se acepta en N minutos | 2.º cliente | Interpretación de §6 |
| Pantalla de cocina por estaciones | Después | OlaClick, Justo PDV |
| Impresión en la nube sin tableta (Star CloudPRNT, Epson Server Direct Print) | Después | §6 |

### Reparto

| Función | Etiqueta | Referencia |
|---|---|---|
| Modo «repartidor propio»: estado a mano y enlace para el repartidor | Abrir | §3 |
| Uber Direct: cotizar, crear **solo con el pago confirmado**, webhook, cancelar | Abrir si cotiza en Cabo; si no, 2.º cliente | §3 |
| Mostrar el `tracking_url` del repartidor | Abrir (con Uber) | [reparto-a-domicilio.md §5](reparto-a-domicilio.md) |
| Costo al cliente por zona, independiente del costo real del reparto, con tope | Abrir | Ordering.co, Fudo (§3) |
| Devolución a la tienda (`returned`) y su costo | Abrir (con Uber) | Fudo (§3) |
| Suborganización de Uber Direct por restaurante | 2.º cliente | §3 |
| Varios proveedores de reparto | Después | Ordering.co |

### Pagos

| Función | Etiqueta | Referencia |
|---|---|---|
| Pago en línea con la cuenta propia del restaurante (página alojada de la pasarela) | Abrir | §4 |
| Webhook de pago con firma, idempotencia y conciliación | Abrir | escalera §3.3 |
| Pago al recoger (efectivo o tarjeta en barra) | Abrir | Interpretación (§4) |
| Propina | Abrir | Toks (términos); domicilio |
| Reembolso total o parcial desde el panel | Abrir | §4 |
| Cuenta conectada por restaurante (OAuth de Mercado Pago o Stripe Connect) | 2.º cliente | §4 |
| Comisión de la plataforma descontada de cada venta | Después (depende del ADR y del contador) | §4, §5 |

### Avisos

| Función | Etiqueta | Referencia |
|---|---|---|
| Correo de confirmación con enlace al estado | Abrir | §7 (Resend) |
| WhatsApp en hitos (aceptado, en camino, listo) | 2.º cliente | §7 |
| SMS | Después, y solo si el restaurante lo paga | §7 (costo) |

### Reportes

| Función | Etiqueta | Referencia |
|---|---|---|
| Ventas del día por canal y forma de pago; exportar CSV para el contador | Abrir | Interpretación |
| Platillos más vendidos, horas pico, cancelados | 2.º cliente | Owner, ChowNow (**solo buscador**) |
| Conciliación de comisiones (pasarela, reparto) | 2.º cliente | §4 |

### Varias sucursales

| Función | Etiqueta | Referencia |
|---|---|---|
| Sucursales con horario, teléfono, menú y agotados propios | 2.º cliente (la familia tiene más taquerías, `PENDIENTE-CLIENTE`) | Toast, Ordering.co |
| Asignar la sucursal por dirección | 2.º cliente | Toks (visto) |

### Varios negocios

| Función | Etiqueta | Referencia |
|---|---|---|
| `tenant_id` en todos los datos desde el inicio | Abrir (barato hoy, caro después) | §7 |
| Subdominio por negocio | 2.º cliente | §7 |
| Dominio propio del negocio con certificado automático | 2.º cliente | §7 |
| Alta de negocio, marca (logo, colores) y textos legales por negocio | 2.º cliente | Ordering.co (**solo buscador**) |
| Cobro de la suscripción del estudio (con LFPC 76 Bis fr. VIII–IX) | 2.º cliente, tras el ADR | §5, §8 |
| Panel del estudio (soporte, ver como el negocio) | 2.º cliente | Interpretación |

---

## 3. Reparto

Lo básico (proveedores en Cabo, flujo cotizar → crear → avisos, Robo Courier, la tarifa de
2023 de $49 + impuestos hasta 3 km) está en [reparto-a-domicilio.md](reparto-a-domicilio.md).
Aquí va lo nuevo.

### Uber Direct: lo que se confirmó

**Alta y costo en México.** La página de México no da cifra. Dice que no hay costos
iniciales ni mínimo mensual y que el precio varía según los productos que se usen. El alta
se hace en el panel o con un socio
([página MX](https://merchants.ubereats.com/mx/es/services/uber-direct/),
[registro](https://merchants.ubereats.com/mx/es/s/signup/direct/), **verificado**, sin
fecha). La página no publica documentos de alta (RFC, constancia, cuenta) ni política de
cancelación. No se encontró una tarifa más nueva que la de 2023: una nota que el buscador
fechaba en 2026 es del 30-may-2023 y no da precio
([The Logistics World](https://thelogisticsworld.com/actualidad-logistica/uber-direct-servicio-de-ultima-milla-para-pymes),
**verificado**).

**La API (verificado en documentación oficial):**

| Pieza | Qué se confirmó | Fuente |
|---|---|---|
| Cotizar / crear / estados | Igual que en [reparto-a-domicilio.md §5](reparto-a-domicilio.md) | — |
| Costos en la respuesta | `user_fees_summary` en Create Delivery (17-abr-2025); se corrigió su estructura y `amount_in_cents` pasó a `amount` (19-jul-2025) | [changelog](https://developer.uber.com/docs/deliveries/changelog) |
| **Cancelar** | `POST /customers/{customer_id}/deliveries/{delivery_id}/cancel`. Datos del repartidor en la respuesta (26-jul-2023); motivo de cancelación opcional (8-dic-2025). El changelog no menciona costo por cancelar | [changelog](https://developer.uber.com/docs/deliveries/changelog) |
| **Firma de webhooks** | Cada aviso trae `x-uber-signature`: HMAC-SHA256 en hexadecimal del cuerpo **crudo**, con la «Webhook Signing Key» de ese webhook (se copia en el panel, menú Edit). Los avisos de estado y de repartidor también aceptan `x-postmates-signature`; los de reembolso exigen `x-uber-signature`. Advierte no usar parsers que reescriban escapes Unicode | [guía de webhooks](https://developer.uber.com/docs/deliveries/guides/webhooks), © 2026 |
| **Sandbox** | Tiene límite de peticiones desde el 27-oct-2025 (cuadra con el límite de 200 cada 10 min ya documentado) | [changelog](https://developer.uber.com/docs/deliveries/changelog) |
| **Direct Organizations** (varios negocios) | Hitos: Create Organization API (14-abr-2023); `contract_type` (1-sep-2024); alta autoservicio con `CONTRACT_TYPE_PARENT` (17-abr-2025); `role_assignments` por tienda y organización (22-sep-2025); `billing_information` (27-oct-2025); webhook de política de cobro `direct.organization` para suborganizaciones (28-oct-2026) | [changelog](https://developer.uber.com/docs/deliveries/changelog) |

El cuerpo para crear una organización no se vio en la referencia oficial, que carga con
JavaScript. Un espejo de terceros describe suborganizaciones bajo una organización raíz,
con scope `direct.organizations` y `POST /direct/organizations` (**solo buscador**,
[espejo qodex](https://developers.qodex.ai/uber-direct/uber-organizations-api)). Ojo:
`developer.uber.com/docs/organizations/...` es de **Uber for Business**, otro producto
([página](https://developer.uber.com/docs/organizations/self-serve-org-onboarding),
**verificado**).

**Interpretación:**
- Verificar la firma toma pocas líneas: se guarda el cuerpo crudo antes de parsear el
  JSON, se calcula el HMAC y se compara en tiempo constante.
- Una cuenta de plataforma con una suborganización por restaurante parece el camino
  documentado para atender a varios negocios. Falta confirmar con Uber si está abierto en
  México y cómo se reparte el cobro (`contract_type`).

**Cómo lo hace un proveedor de software en México: Fudo + Uber Direct**
([ayuda de Fudo](https://intercom.help/fudoapp/es/articles/12460852-servicio-de-logistica-uber-direct),
**verificado**, © 2025):
- funciona en Chile y México;
- el comercio registra una tarjeta de crédito en el portal de Uber Direct y cada entrega
  se le carga ahí;
- el pago en efectivo existe solo en México: el cliente paga el 100 % del envío y Fudo le
  paga al comercio los jueves, descontando los envíos de la semana anterior;
- el comercio absorbe el envío o lo pasa al cliente, completo o en parte; Fudo sugiere un
  costo fijo para distancias cortas y la tarifa del proveedor para lejanas;
- si no se puede entregar, el pedido regresa solo a la tienda **y el comercio paga el
  regreso**.

### Alternativas, y cuáles tienen API

- **iVoy:** solo CDMX, Guadalajara y Puebla; no se encontró API pública (**solo buscador**,
  [WeShip](https://www.weship.com/en/paqueterias-mx/ivoy)).
- **99minutos:** nada que lo ligue a Baja California Sur (búsqueda sin resultado).
- **Rappi Cargo:** aparece entre las integraciones de Ordering.co sin decir el país
  (**verificado**, [Ordering.co](https://www.ordering.co/uber-direct-integration)). En
  México sigue sin confirmarse.
- **Integraciones de Ordering.co (verificado, misma página):** Borzo, DoorDash Drive,
  Lalamove, PedidosYa Courier, Shipday, Stuart, Yango y otros, además de Uber Direct.
- **Señal local:** un resultado de buscador habla de una plataforma nueva en Cabo San Lucas
  con 207 vehículos de tres sitios de taxi. No tiene nombre y no se abrió (**solo
  buscador**, sin enlace confirmado).
- **No se revisaron:** DiDi Entrega Business API, Mensajeros Urbanos, Skydropx/Envia a
  demanda y Tookan.

**Interpretación:** fuera de Uber Direct, no se confirmó ningún servicio de reparto con API
en Cabo. El modo «repartidor propio» (estado a mano y enlace al celular del repartidor) no
es un extra: es lo que evita que la taquería se quede sin reparto si Uber no tiene
repartidores a las 4 a. m.

### Cómo lo resuelven Justo y similares

- **Justo:** anuncia app con reparto, una sección de logística y «Sé un Justo Driver», pero
  no nombra proveedor de reparto ni zonas. `/logistica` dio 404 (**verificado**,
  [getjusto.com](https://www.getjusto.com/)). Sus planes cobran la logística por km (§1).
- **Owner.com:** no tiene repartidores propios; manda a DoorDash Drive o Uber Direct. Unos
  US$7 por entrega se pasan al costo, y recomienda que el restaurante absorba unos $3
  (**solo buscador**, fuentes de competidores:
  [Sauce](https://www.getsauce.com/post/owner-com-pricing-fees),
  [Dupple, jul-2026](https://dupple.com/reviews/owner)).
- **ChowNow Flex:** tarifa plana por pedido, repartida entre Uber Direct y DoorDash
  (**solo buscador**,
  [ChowNow 2026](https://get.chownow.com/blog/best-food-delivery-software-2026/)).
- **Flipdish:** Uber Direct con precio por distancia (**verificado**,
  [flipdish.com/uber-direct](https://www.flipdish.com/uber-direct)).
- **Ordering.co:** proveedor de reparto por tienda y zona con horario; el comercio fija
  cuánto paga el cliente por zona; cotiza en el pago (**verificado**,
  [Ordering.co](https://www.ordering.co/uber-direct-integration)).

**Interpretación:** el patrón común separa dos cosas:
1. El **costo real** del reparto lo paga el restaurante, con su tarjeta o descontado de lo
   que se le deposita.
2. Lo que **paga el cliente** es una regla aparte, por zona, que configura el restaurante.

### Zonas y costos de envío

Hay tres patrones: **radio** (círculo), **polígono** dibujado (o KML) y **tramos por
distancia**. Cada zona tiene costo y pedido mínimo; si dos zonas se enciman, gana la más
chica (**solo buscador**: [Appfront](https://help.appfront.ai/en/articles/10289880-setting-up-delivery-areas),
[Redbox](https://support.redbox.systems/docs/delivery-zones),
[Fleksa](https://fleksa.com/docs/how-to/delivery-zones)). Algunos integradores aconsejan
zonas chicas para Uber Direct, de unas 2 millas como máximo (**solo buscador**,
[StoreKit](https://storekit.com/docs/guides/integrations/delivery/uber-direct)).
GloriaFood recomienda mínimos que suben con la distancia (**solo buscador**,
[GloriaFood](https://gloriafood.com/food-delivery-business)).

**Interpretación:** el modelo más simple que cubre todo es una zona con estos datos:
- tipo: radio en km o polígono;
- costo y mínimo, en centavos;
- horario;
- una opción para pasar al cliente la cotización real, con un tope.

En Cabo, la costa y el corredor hacen engañoso el radio, así que el polígono
probablemente haga falta pronto.

---

## 4. Cobro en línea en México

### Comisiones

| Pasarela | Tarjeta nacional | Efectivo / SPEI | Otros | Cómo se obtuvo |
|---|---|---|---|---|
| **Stripe MX** | 3.6 % + MXN 3.00 | «Transferencias y otros métodos locales» 4 % + MXN 3.00 (no separa OXXO ni SPEI) | +0.5 % tarjeta internacional; +2 % conversión; disputa MXN 150; Connect con comisiones propias: 0.25 % | **Verificado**, [stripe.com/mx/pricing](https://stripe.com/mx/pricing). La página dice que ciertas comisiones no incluyen IVA |
| **Conekta** (PyMEs) | 3.4 % + $3.00 + IVA | Efectivo 2.6 % + $3.00 (mínimo $5.40; además, el cliente paga $10–13 en tienda); SPEI $12.50 | 3DS $1.50; meses sin intereses por banco (BBVA 3 MSI: 4.9 %) | **Verificado**, [conekta.com/pricing](https://www.conekta.com/pricing), «vigentes desde el 1 de julio de 2024» |
| **PayPal MX** | 3.95 % + 4.00 MXN; todo sujeto a IVA | — | Tasa menor por volumen solo con aprobación (p. ej. 3.65 % de 50,000 a 249,999.99 MXN al mes, **solo buscador**) | **Verificado**, [PDF oficial, 13-oct-2026](https://www.paypalobjects.com/marketing/ua/pdf/MX/es/mx-merchant-fees-es-13-october-2026.pdf) |
| **Mercado Pago** | 3.49 % + IVA al instante; 3.19 % a 14 días; 2.95 % a 30 días; más $4.00 por venta | Efectivo 3.79 % + IVA; SPEI 3.49 % + IVA | Las páginas oficiales no coinciden entre sí: una versión dice 7 días en vez de 14 | **Solo buscador**, [tienda online](https://www.mercadopago.com.mx/como-cobrar/tienda-online), [link de pago](https://www.mercadopago.com.mx/herramientas-para-vender/link-de-pago); la página de costos dio 403 |
| **Openpay** (BBVA) | 2.9 % + $2.50 + impuestos | SPEI $8 | Las cifras de meses sin intereses no coinciden | **Solo buscador**, [Openpay](https://site.openpay.mx/en/pricing.html). Ojo: [reparto-a-domicilio.md §6](reparto-a-domicilio.md) leyó **2.55 % + $1.90** en la [página de BBVA](https://www.bbva.mx/empresas/productos/medios-de-cobro/pago-electronico-Openpay.html). Las fuentes no coinciden: reconfirmar |
| **Clip** | 3.6 % + IVA | No confirmado | — | **Solo buscador**, [App Store](https://apps.apple.com/mx/app/clip/id771245360), [Tiendanube](https://www.tiendanube.com/mx/blog/clip) |

**Interpretación:**
- Con un ticket de $200, la parte fija de $3 o $4 suma entre 1.5 y 2 puntos.
- El IVA sobre la comisión sube un 3.6 % a cerca de 4.18 %. El cálculo coincide con
  [calcforlife](https://calcforlife.com/es/calculadora-clip-comisiones/).

### Tiempos de depósito

| Pasarela | Plazo | Cómo se obtuvo |
|---|---|---|
| **Conekta** | Primer depósito en los primeros 10 días hábiles tras el primer pago | **Verificado**, [pricing](https://www.conekta.com/pricing) |
| **Mercado Pago** | Al instante, a 14 o a 30 días, según la comisión que se elija. Los contracargos pueden retrasarlo | **Solo buscador**, [released-money](https://www.mercadopago.com.mx/developers/es/docs/checkout-api-payments/additional-content/reports/released-money) |
| **Stripe** | Depósitos periódicos, sin días exactos | **Verificado** |
| **Clip** | 48 h o 24 h según el plan; en otra parte habla de «dos días hábiles» | **Solo buscador** |
| **Openpay, PayPal** | No encontrado | — |

### Cobrar a nombre de cada restaurante

**Mercado Pago, marketplace (solo buscador, documentación MX)**
([Checkout Pro](https://mercadopago.com.mx/developers/en/docs/checkout-pro/how-tos/integrate-marketplace),
[Checkout API](https://www.mercadopago.com.mx/developers/es/docs/checkout-api-payments/how-tos/integrate-marketplace.md)):
- cada restaurante conecta su cuenta por **OAuth**, y la plataforma cobra con el token de
  ese vendedor;
- la comisión de la plataforma va en `marketplace_fee` (Checkout Pro) o `application_fee`
  (Checkout API);
- Mercado Pago descuenta primero su comisión y después la de la plataforma;
- la modalidad Split 1:1 solo mueve dinero entre cuentas de Mercado Pago y limita los
  reembolsos
  ([split 1:1](https://www.mercadopago.com.mx/developers/es/docs/split-payments/split-1-1/integration-configuration/integrate-marketplace)).

**Stripe Connect** ([Connect MX](https://stripe.com/mx/connect)):
- **verificado:** hay página en español para México con cargos directos, cargos a un
  destino y cargos con transferencias separadas, usando `application_fee_amount`;
- **solo buscador:** México aparece en la lista de cuentas Express
  ([Express](https://docs.stripe.com/connect/express-accounts));
- **solo buscador:** algunas páginas están marcadas como legacy, porque Stripe orienta
  ahora a Accounts v2;
- **solo buscador:** la transferencia bancaria de México no acepta `on_behalf_of` sin
  acceso especial ([MX bank transfers](https://docs.stripe.com/payments/mx-bank-transfers)).

**Sin documentación de marketplace para México:** Conekta, Openpay y PayPal Commerce
Platform.

**Interpretación:** con OAuth o cargos directos, el restaurante es el comerciante: el cobro
y el depósito quedan a su nombre y su RFC, y el estudio nunca tiene el dinero de los
pedidos.

### Propinas, reembolsos y pago contra entrega

- **Reembolsos.**
  - Stripe: reembolsar no cuesta, salvo en transferencias, y no devuelve su comisión
    (**verificado**, [pricing](https://stripe.com/mx/pricing)).
  - PayPal: el reembolso completo no cobra comisión, pero tampoco devuelve la ya cobrada
    (**verificado**, [PDF](https://www.paypalobjects.com/marketing/ua/pdf/MX/es/mx-merchant-fees-es-13-october-2026.pdf)).
  - Mercado Pago: hasta 180 días después del pago y con saldo suficiente en la cuenta
    (**solo buscador**,
    [devoluciones](https://www.mercadopago.com.mx/developers/es/docs/checkout-api-payments/payment-management/cancellations-and-refunds/introduction)).
- **Propinas:** ninguna pasarela tiene guía oficial. **Interpretación:** sumarla como un
  renglón del cargo y registrarla aparte en el pedido.
- **Pago contra entrega:** sin fuente oficial de pasarela. Fudo sí ofrece efectivo con Uber
  Direct en México (§3). **Interpretación:** con repartidor propio, o al recoger, el
  efectivo funciona. Con Uber Direct hay que confirmarlo; hoy solo se sabe por Fudo.
- **3-D Secure:** Conekta lo cobra a $1.50 (**verificado**). No se encontró si es
  obligatorio en México.
- **Links de pago:** existen en Mercado Pago, BBVA y Clip (**solo buscador**,
  [BBVA](https://www.bbva.mx/personas/productos/zona-de-cobro/link-de-pago.html)).

### Recomendación para empezar

**Interpretación:**
1. **Los Tacos May:** usar la página de pago alojada (Checkout Pro o Stripe Checkout) en la
   **cuenta propia de la taquería**, con webhook. No hace falta marketplace para un solo
   cliente.
2. Escribir el código como si cada negocio tuviera sus propias credenciales de pasarela,
   para que el paso a OAuth (Mercado Pago) o Connect (Stripe) sea un cambio de alta, no de
   diseño.
3. **Mercado Pago o Stripe:** Mercado Pago tiene el único marketplace con OAuth documentado
   para México y es la pasarela que ya nombra la escalera del estudio. Stripe tiene mejor
   documentación y tarifa verificada. La decisión depende de las tarifas reales que vea la
   familia en su panel (decisión 5).

---

## 5. Obligaciones

**No es asesoría legal ni fiscal.** Son lecturas de los textos para llevarle preguntas
concretas a un contador y a un abogado.

### Facturas (CFDI)

- **De los pedidos.** **Interpretación:** el restaurante vende la comida, así que a él le
  toca emitir el CFDI al cliente que lo pida, o la factura global por las ventas al
  público. Las guías de terceros describen la factura global así (**solo buscador**,
  [Facturama](https://facturama.mx/docs/es/cfdi40/factura-global),
  [Aspel](https://saeportaldeclientes.aspel.com.mx/wp-content/uploads/2023/06/S002_Factura-global-notas-venta-aspel-SAE80CFDI40.pdf)):
  - RFC XAXX010101000, «PUBLICO EN GENERAL», régimen 616, uso S01;
  - periodo diario, semanal, quincenal o mensual;
  - se emite dentro de las 72 h siguientes al cierre, según Aspel.

  La regla del SAT está citada en [reparto-a-domicilio.md §6](reparto-a-domicilio.md). Una
  función útil del panel: exportar ventas por periodo para el contador.
- **De la suscripción del estudio.** **Interpretación:** el estudio factura su propio
  servicio a cada restaurante.
- **De las comisiones de las pasarelas.** PayPal manda a registrarse en un portal externo,
  paypal.detecno.com, para recibir factura de sus comisiones (**verificado** en el PDF). Ese
  dominio no es de PayPal: verificarlo antes de usarlo.

### Retención de IVA a plataformas (LIVA 18-J)

Verificado en la [LIVA (Diputados)](https://www.diputados.gob.mx/LeyesBiblio/pdf/LIVA.pdf),
versión con última reforma DOF 12-11-2021:
- el art. 18-B fr. II define como servicio digital la intermediación entre quienes ofrecen
  bienes o servicios y quienes los demandan;
- el art. 1o.-A BIS manda a los residentes en México que la presten a cumplir el art. 18-J;
- el art. 18-J fr. II aplica **cuando la plataforma cobra el precio por cuenta del
  vendedor**: retiene a personas físicas el 50 % del IVA (100 % si no dan RFC);
- la fr. I pide mostrar el IVA por separado o con la leyenda «IVA incluido».

El Paquete Económico 2026 trae cambios para plataformas digitales (**solo buscador**,
[EY](https://www.ey.com/content/dam/ey-unified-site/ey-com/es-mx/technical/tax/documents/ey-tax-flas-paquete-economico-2026-plataformas-digitales.pdf)):
la versión leída puede estar desactualizada.

**Interpretación (necesita contador):**
- Si el dinero entra directo a la cuenta del restaurante y el estudio no cobra el precio
  por él, no se cumple el supuesto de la retención.
- Si la comisión del estudio se descuenta de cada venta (`marketplace_fee`), el caso se
  parece más a una intermediación.
- Que el estudio sea o no «intermediario» lo decide un contador, no este documento.
- Tampoco se leyó el art. 113-A de la LISR (retención de ISR a plataformas).

### Datos personales (LFPDPPP)

Verificado en el [texto vigente](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf)
(ley del 20-mar-2025, última reforma DOF 14-11-2025):
- **encargado** es quien trata datos por cuenta del responsable (art. 2 fr. XII);
- pasarle datos al encargado no es transferencia (art. 2 fr. XX);
- la autoridad es la Secretaría Anticorrupción y Buen Gobierno (art. 2 fr. XV);
- el aviso de privacidad (art. 15) debe tener: identidad y domicilio del responsable;
  datos que se tratan; finalidades; cómo limitar su uso; cómo ejercer los derechos ARCO; y
  cómo se avisan los cambios;
- el titular puede pedir indemnización por incumplimientos del responsable o del encargado
  (art. 53).

**Interpretación:** cada restaurante es **responsable** de los datos de sus clientes y
necesita su propio aviso. El estudio, que los trata por cuenta del restaurante, es
**encargado**, y conviene un contrato que lo delimite. No se ubicó el artículo con las
obligaciones específicas del encargado ni si ya salió el reglamento nuevo.

### Términos de servicio y Ley Federal de Protección al Consumidor

Verificado en la [LFPC](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPC.pdf), última
reforma DOF 12-12-2025. El art. 76 Bis pide:
- confidencialidad de los datos y medios de seguridad (fr. I y II);
- domicilio, teléfonos y medios para reclamar antes de la compra (fr. III);
- prohibición de prácticas engañosas (fr. IV);
- todos los costos y cargos antes de pagar (fr. V).

**Nuevo (DOF 12-12-2025):**
- **fr. VIII:** los cobros recurrentes automáticos se informan de forma destacada, con
  consentimiento expreso, y la renovación se avisa con **5 días naturales** de
  anticipación;
- **fr. IX:** el consumidor debe poder **cancelar de inmediato**.

**Interpretación:** las fracciones VIII y IX pegan a la suscripción del estudio si un
restaurante cuenta como consumidor. El cobro mensual tendría que avisar antes de renovar y
dejar cancelar en un paso. El art. 76 Bis 1 remite a una norma mexicana de comercio
electrónico; probablemente es la NMX-COE-001-SCFI-2018 (no verificado).

### Seguridad de tarjetas (PCI DSS)

Con redirección a la página de pago de la pasarela o con su formulario incrustado
(iframe), el comercio puede usar el cuestionario corto **SAQ A**. Para el iframe hay un
criterio nuevo sobre scripts, y los requisitos 6.4.3 y 11.6.1 salieron de SAQ A. La fecha
de vigencia varía entre fuentes: 31-mar o 1-abr-2025 (**solo buscador**,
[FAQ 1588 de PCI SSC](https://www.pcisecuritystandards.org/faqs/1588/),
[SecurityMetrics](https://chat.securitymetrics.com/blog/big-changes-for-saq-a); el PDF
oficial dio 403).

**Interpretación:** redirigir a la página alojada de la pasarela es lo más simple. Nunca
tocar datos de tarjeta, como ya manda la escalera.

### Alcohol en Baja California Sur

Verificado en la
[ley estatal (PDF de Tesorería de Los Cabos)](https://www.tesoreria.loscabos.gob.mx/wp-content/uploads/2020/02/LEY-QUE-REGULA-EL-ALMACENAJE-DISTRIBUCIÓN-VENTA-Y-CONSUMO-DE-BEBIDAS-ALCOHOLICAS-EN-EL-ESTADO-DE-BAJA-CALIFORNIA-SUR.pdf),
última reforma BOGE 31-oct-2016:
- los restaurantes solo pueden vender bebidas de baja graduación con alimentos y con
  autorización en la licencia (art. 12);
- vender fuera del establecimiento está prohibido, salvo la excepción del art. 12;
- los restaurantes con alcohol abren de 07:00 a 01:00 (art. 19 fr. IV); después, solo
  pagando horas extra;
- está prohibido vender a menores.

**Interpretación:** el alcohol a domicilio queda muy limitado y no cabe en el horario
hasta las 4 a. m. El menú conocido de Los Tacos May
([datos.md](../negocio/datos.md)) solo lista tacos; si se vende otra cosa es
`PENDIENTE-CLIENTE`. Para venderle a otros negocios: dejar el alcohol fuera, o bloquearlo
por horario y por negocio. Puede haber reformas o reglamentos municipales posteriores que
no se encontraron.

---

## 6. Operación en la taquería

### Cómo llega el pedido a la cocina

Los sistemas reales usan cuatro caminos, a veces combinados:

1. **App en teléfono o tableta** que suena y pide aceptar. La de GloriaFood corre en
   Android 8+ (4 GB de RAM recomendados) o iOS 12+, muestra si el equipo está en línea,
   permite rechazar con motivo y crear pedidos de prueba, y **acepta solo al imprimir** con
   una impresora compatible (**verificado**,
   [GloriaFood](https://gloriafood.com/order-taking-app-for-restaurants), actualizado
   27-nov-2025).
2. **Impresión automática** desde esa app a una impresora térmica. GloriaFood recomienda
   **LAN**: el Bluetooth se desconecta seguido y el USB es poco fiable, y la impresora y el
   equipo deben estar en la misma red (**verificado**,
   [impresión](https://www.gloriafood.com/auto-printing-setup-2),
   [recibos](https://www.gloriafood.com/how-to-print-restaurant-receipts)).
3. **Impresión en la nube sin tableta.** La impresora consulta al servidor: Star
   CloudPRNT y Epson Server Direct Print, solo en ciertos modelos (**solo buscador**,
   [Star](https://starmicronics.com/online-order-printing-solutions-labels-receipts-food-delivery-apps/),
   [Hospitality Tech](https://hospitalitytech.com/ordermark-certifies-epson-smart-printer-its-online-order-consolidation-system)).
4. **Pantalla de cocina o WhatsApp,** como en OlaClick (**solo buscador**,
   [OlaClick KDS](https://olaclick.com/en/kitchen-display-systems/)).

### Equipo barato, con precios en MXN encontrados

Precios de listados vistos el 18-nov-2026 (**solo buscador**; cambian a diario):

| Equipo | Precio visto | Fuente |
|---|---|---|
| Térmica 80 mm genérica, autocorte, USB + Ethernet | $1,111 en oferta ($1,425 de lista); otra variante $1,289 | [Mercado Libre](https://listado.mercadolibre.com.mx/impresora-termica-80-mm-autocorte) |
| Volteck PDV-81i (USB/BT/RJ45/Wi-Fi) | $1,610–1,620 | [Mercado Libre](https://listado.mercadolibre.com.mx/impresora-tickets-wifi) |
| Genérica USB + BT + RJ45 + Wi-Fi, autocorte | $2,199 | Mercado Libre (mismo listado) |
| 3nStar RPT004 (USB/Ethernet) | $2,298 | [Mercado Libre](https://listado.mercadolibre.com.mx/impresora-de-comandas) |
| TechZone TZPOIMW | desde $2,429.00 | [Intercompras](https://intercompras.com/p/impresora-recibos-techzone-tzpoimw-termica-directa-mm-usb-wi-fi-rj-rj-mms-408145) |
| 3nStar RPT006W (USB/Wi-Fi/Ethernet) | $2,907 | Mercado Libre |
| Sunmi 80 mm (Wi-Fi/BT/Ethernet) | $4,059.00 | [Cyberpuerta](https://www.cyberpuerta.mx/Punto-de-Venta-POS/Impresoras-de-Tickets/SUNMI-80MM-Impresora-de-Tickets-Transferencia-Termica-Wi-Fi-Bluetooth-Ethernet-205-x-205-DPI.html) |
| Epson TM-M30III | $6,699 | Mercado Libre |
| La impresora de tickets más vendida de Mercado Libre (probablemente de 58 mm Bluetooth) | $340 | [El Imparcial, 3-sep-2026](https://www.elimparcial.com/dinero/2026/09/03/mercado-libre-reduce-a-340-pesos-el-precio-de-la-impresora-termica-para-tickets-de-negocio-mas-vendida-en-su-plataforma/) |

No se encontraron precios en MXN de equipos Sunmi de mano o de mostrador (en Europa, unos
€208 a €640, **solo buscador**), ni de tabletas Android baratas.

**Interpretación:**
- Lo más barato y fiable: una tableta o teléfono Android con la página del panel abierta y
  una impresora LAN de 80 mm.
- Ese arreglo depende de un solo equipo, que debe estar con la página abierta, el sonido
  encendido y sin suspenderse. Hay que agregar:
  - aviso por fuera (WhatsApp o llamada) si un pedido no se acepta en N minutos;
  - indicador de impresora desconectada o sin papel. Sin él, la falta de papel no se nota
    hasta que alguien la ve (**solo buscador**,
    [yo-facturo](https://yo-facturo.com/blog/impresora-de-cocina-comandera-como-conectarla/)).
- La impresión en la nube quita la tableta, pero exige modelos Star o Epson mucho más
  caros.

### Horario hasta las 4 a. m.

**Cómo lo resuelven otras plataformas.**
- **Toast:** horario por modo, hasta tres intervalos al día. Puede pasar de la
  medianoche mientras termine antes de la «hora de cierre» del día comercial. Maneja
  excepciones por fecha y deja de aceptar «lo antes posible» al cierre menos el tiempo de
  preparación (**verificado**,
  [Toast](https://doc.toasttab.com/doc/platformguide/adminConfigureOnlineOrderingHoursOverview.html)).
  Su API **no** valida el horario de los pedidos (**solo buscador**).
- **Storekit:** obliga a partir la noche en dos días.
- **Selflane:** permite cerrar hasta las 5 a. m.
- **SkyTab:** acepta horarios continuos (**solo buscador**,
  [Storekit](https://docs.storekit.com/guides/store-settings/opening-hours),
  [Selflane](https://docs.selflane.com/biz/settings/hours),
  [SkyTab](https://shift4.zendesk.com/hc/en-us/articles/19415171145747-Set-up-Late-Night-Scheduling-for-SkyTab-Online)).
- **Square:** en un caso, una tienda abierta de 11 p. m. a 2 a. m. no recibía pedidos
  después de la medianoche porque los productos quedaban «no disponibles» (**solo
  buscador**,
  [Square Community](https://community.squareup.com/t5/Online-Store/How-can-I-keep-my-online-store-open-after-midnite/m-p/311010)).

**Interpretación, el modelo para Los Tacos May:**
- un «día comercial» con hora de corte, por ejemplo las 05:00;
- si el cierre es anterior a la apertura, el cierre cae al día siguiente;
- los festivos van como excepciones por fecha comercial;
- **validar siempre en el servidor;**
- las pruebas automáticas deben cubrir las 23:59, 00:00, 03:59 y 04:00;
- avisar al dueño si queda «abierto pero sin nada que pedir».

### Pausa, agotado, tiempos y límite de pedidos

- **Pausa:** GloriaFood pausa un servicio o todos, por un rato o hasta el fin del día, con
  aviso al cliente. Marca agotado hasta mañana, hasta una fecha o sin fin (**verificado**).
  Square pausa hasta una hora elegida. En un caso, pausar desde el punto de venta mostró
  «agotado» en toda la tienda (**solo buscador**,
  [Square](https://squareup.com/help/us/en/article/8325-manage-order-timing-with-square),
  [caso](https://community.squareup.com/t5/Online-Store/Pausing-online-orders-results-in-Out-of-Stock-message-across-the/m-p/651146)).
- **Modo ocupado:**
  - Square suma 10, 15 o 20 minutos (**solo buscador**);
  - Owner suma de 5 en 5 y se apaga solo a los 60 minutos (**solo buscador**,
    [Owner](https://help.owner.com/en/articles/11954845-how-can-i-change-prep-times-for-peak-hours-and-large-orders)).
- **Límite de pedidos:**
  - Owner pone un tope por ventana de 15 minutos. Cuando se llena, avisa «más ocupado que
    de costumbre», suma 15 minutos y pasa los pedidos «lo antes posible» a la siguiente
    franja libre (**verificado**,
    [Owner](https://help.owner.com/en/articles/15083053-how-do-i-limit-how-many-orders-my-kitchen-accepts-at-once));
  - Flipdish usa ventanas de 10 minutos (**solo buscador**).
- **Aceptar solo o a mano:** en GloriaFood, aceptar va ligado a imprimir (**verificado**).
  En Deliverect se acepta solo por defecto (**solo buscador**).

**Interpretación:** la pausa siempre lleva hora de reanudación. Como la taquería sirve en
menos de 10 minutos con guisos ya hechos ([datos.md](../negocio/datos.md)), el tiempo de
preparación será corto y el cuello de botella probablemente sea armar y empacar, no
cocinar. Eso es `PENDIENTE-CLIENTE`.

### Errores típicos al lanzar

Todos de **solo buscador**:
- pedidos perdidos en «la tableta que nadie miraba», y errores al volver a capturar a mano
  ([Toast](https://pos.toasttab.com/au/blog/on-the-line/tablet-hell-in-restaurants),
  [Checkmate](https://www.itsacheckmate.com/blog/prevent-food-delivery-order-errors));
- avisos que nadie ve en hora pico y pedidos nunca confirmados
  ([Foodhub](https://foodhubforbusiness.com/us/blogs/why-restaurants-lose-orders/));
- menú en línea que no coincide con el real (Checkmate);
- lanzar sin avisar a nadie, instrucciones de recoger poco claras y pocas formas de pago
  ([Restolabs](https://www.restolabs.com/blog/7-missteps-to-avoid-when-launching-a-restaurant-online-ordering-and-delivery),
  [Sunday](https://sundayapp.com/?p=113823)).

No se encontraron fuentes sobre zonas mal trazadas, empaque o reembolsos.

**Interpretación, mitigaciones:**
- una sola bandeja con sonido que se repite;
- escalamiento si nadie acepta;
- indicadores de impresora y conexión;
- botones de agotado a un toque;
- pausa con tiempo;
- pedidos de prueba antes de abrir;
- el QR y el anuncio en la barra el mismo día del lanzamiento.

---

## 7. Arquitectura

**Aparte:** el proyecto escolar de TacosMay (Express + Redis) vive en la rama `escolar` y
**no se toca**. Nada de esto lo modifica.

### Sistema compartido o instalación por cliente

**Interpretación:**
- Con una sola persona, una instalación por cliente multiplica por N los despliegues, las
  migraciones y los parches. Un **sistema compartido** (un código, un despliegue, una base
  de datos con `tenant_id` en cada tabla y el negocio resuelto por el dominio) se actualiza
  una vez para todos.
- La instalación por cliente solo vale si un negocio exige por contrato su propio código y
  sus datos aparte.
- Lo mismo aplica aunque solo exista Los Tacos May: meter `tenant_id` hoy cuesta poco;
  meterlo después cuesta una migración.

**Subdominio o dominio propio.**
- El subdominio comodín (`negocio.plataforma.mx`) es gratis e inmediato.
- El dominio propio (`pido.negocio.com` con CNAME) necesita que la plataforma emita el
  certificado. Opciones:
  - **Cloudflare for SaaS:** 100 dominios incluidos, luego US$0.10 por dominio, máximo
    50,000 (**verificado**,
    [planes](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/),
    actualizada 14-ago-2026);
  - **Vercel:** 50 dominios por proyecto en Hobby; «ilimitados» en Pro, con límite blando
    de 100,000 (**verificado**, [Vercel limits](https://vercel.com/docs/limits),
    16-sep-2026);
  - **Caddy con TLS a demanda** en un servidor propio (interpretación).
- **Interpretación:** subdominio por defecto y dominio propio como extra.

**Aislamiento de datos (interpretación; la documentación de RLS no se releyó):**
- `tenant_id` con seguridad por filas (RLS) en Postgres es lo más simple de operar, y RLS
  es la red si un filtro se olvida.
- En SQLite (D1 o Turso) no hay RLS, así que el filtro vive en una sola capa de acceso.
- Una base por negocio da aislamiento fuerte y es barata en D1: las primeras 100,000 bases
  van incluidas y luego cuestan US$0.10 por base al mes, incluso vacías (**verificado**,
  [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/),
  13-nov-2026). A cambio, son N migraciones.

**Tiempo real (interpretación):** el pedido cambia de estado pocas veces, así que consultar
cada 10–15 s alcanza para la página del cliente, como dice la escalera (empezar con
polling, luego SSE, al final WebSockets). La pantalla de cocina es la que más se beneficia
de empuje: SSE, Supabase Realtime o un Durable Object por negocio.

**Colas y webhooks.** La escalera del estudio ya lo dice para el nivel 3
([escalera.md §3.3](../../../BIBLIA_ECOSISTEMA/nucleo/tecnica/escalera.md)):
- tabla `jobs` + cron cada minuto;
- verificar la firma de todo webhook entrante;
- reintentos y `event_id` único para no procesar dos veces.

Cola gestionada, si hace falta:
- Cloudflare Queues: 1 millón de operaciones al mes incluidas, luego US$0.40 por millón
  (**verificado**, misma página de Workers);
- QStash: 1,000 mensajes al día gratis, luego US$1 por 100 mil (**verificado**,
  [Upstash](https://upstash.com/pricing/qstash)).

### Tres opciones

| | Opción 1 · Cloudflare (Workers + D1 + Durable Objects + CF for SaaS) | Opción 2 · Vercel + Supabase (Postgres con RLS y Realtime) | Opción 3 · VPS Hostinger con Node/Express, Postgres y Redis propios |
|---|---|---|---|
| A favor | Costo plano; sin cobro por tráfico; cola y tiempo real nativos; **el estudio ya opera ONZA aquí**; una base por negocio es barata | Es la escalera del estudio tal cual; RLS en la base; Realtime incluido; Node completo | Precio en MXN predecible; Node completo; reutiliza lo aprendido en TacosMay; sin límites de proveedor |
| Riesgos | «Workers no es Node»: hay librerías que no corren y los SDK de pasarela pueden necesitar `fetch` directo (interpretación); sin RLS; más amarre a Cloudflare | Costo fijo más alto; el plan gratis de Supabase se pausa tras una semana sin uso; las funciones necesitan pooler hacia Postgres; dos facturas | Alejandro se vuelve el administrador del servidor (parches, respaldos, caídas de madrugada); un solo punto de falla; la renovación casi duplica el precio |

### Costo mensual estimado (estimación, no cotización)

**Supuestos (interpretación):**
- 600 pedidos al mes por negocio;
- unas 100 mil peticiones al mes por negocio;
- 20 filas escritas por pedido;
- 1 correo por pedido;
- precios oficiales verificados el 18-nov-2026, en USD salvo Hostinger;
- no se convierte moneda.

| Concepto | 1 negocio | 10 negocios | 50 negocios |
|---|---|---|---|
| Pedidos al mes | 600 | 6,000 | 30,000 |
| Peticiones al mes | ~0.1 M | ~1 M | ~5 M |
| **Op. 1** Workers Paid US$5 (incluye 10 M de peticiones) ([precios](https://developers.cloudflare.com/workers/platform/pricing/)) | US$5 | US$5 | US$5 |
| **Op. 2** Vercel Pro US$20 + Supabase Pro US$25 ([Vercel](https://vercel.com/pricing), [Supabase](https://supabase.com/pricing)) | ~US$45 | ~US$45 | ~US$45–50 |
| **Op. 3** Hostinger KVM 2 MXN 150.99 promo (24 meses pagados por adelantado; renueva a MXN 273.99); KVM 4 MXN 210.99 (renueva a MXN 525.99) ([Hostinger](https://www.hostinger.com/mx/vps-hosting)) | MXN 150.99 | MXN 150.99 | MXN 210.99 |

Otros precios verificados:
- Turso: Free US$0 (100 bases), Developer US$4.99 al mes
  ([Turso](https://turso.tech/pricing));
- Neon: Free con 100 proyectos ([Neon](https://neon.com/pricing), 4-nov-2026);
- Upstash Redis: Free con 500 mil comandos al mes
  ([Upstash](https://upstash.com/pricing/redis)).

**Avisos (lo que sí escala):**

| Canal | Tarifa | 1 negocio | 10 | 50 | Fuente |
|---|---|---|---|---|---|
| Correo (Resend) | Free: 3,000 al mes (tope de 100 al día); Pro: US$20 por 50 mil | US$0 | US$20 | US$20 | [Resend](https://resend.com/pricing), **verificado** |
| WhatsApp, 2 avisos por pedido | US$0.0085 por mensaje utility (**no oficial**) | ~US$10 | ~US$102 | ~US$510 | [Teramont](https://teramont.net/blog/whatsapp-business-platform-service-message-pricing-2026), blog de terceros |
| SMS Twilio, 2 por pedido | US$0.1819 por segmento (la página no rotula la moneda; se asume USD), más número a US$6.5 al mes | ~US$218 | ~US$2,183 | ~US$10,914 | [Twilio MX](https://www.twilio.com/en-us/sms/pricing/mx), «pricing current as of November 2026» |

**Lo oficial de WhatsApp** ([Meta](https://developers.facebook.com/docs/whatsapp/pricing),
**verificado**):
- cobra por mensaje entregado desde el 1-jul-2025;
- desde el 1-oct-2026 cobra los mensajes de servicio, con 1,000 gratis al mes por número;
- desde la misma fecha cobra las plantillas utility dentro de la ventana de atención.

La tarifa de México está en un archivo que no se pudo abrir.

**Interpretación:** con estos números, la infraestructura no decide la opción. Lo que
decide es cuánto tiempo de operación le cuesta a una sola persona (la opción 3 es la más
cara en tiempo) y la compatibilidad con librerías (la opción 1 es la más estricta). El
estado va en la web, los avisos por correo o WhatsApp en hitos, y **nunca SMS** salvo que
el negocio lo pague aparte.

### Proyectos de código abierto

Datos de la API de GitHub, **verificado** el 18-nov-2026:

| Proyecto | Licencia | Lenguaje | Nota |
|---|---|---|---|
| [TastyIgniter](https://github.com/tastyigniter/TastyIgniter) | MIT | PHP/Laravel | Pedidos y reservas de restaurante; release v4.5.1 (14-nov-2026). El más cercano en dominio |
| [Medusa](https://github.com/medusajs/medusa) | MIT, salvo materiales Enterprise | Node | Comercio general, pesado para Workers |
| [Saleor](https://github.com/saleor/saleor) | BSD-3-Clause | Python | Comercio con GraphQL |
| [Bagisto](https://github.com/bagisto/bagisto) | MIT | PHP/Laravel | Tiene marketplace |
| [Vendure](https://github.com/vendurehq/vendure) | GPLv3 o licencia comercial | Node/TS | Copyleft |
| [Odoo](https://github.com/odoo/odoo) | LGPLv3 | Python | Incluye punto de venta de restaurante |
| [ERPNext](https://github.com/frappe/erpnext) / [URY](https://github.com/ury-erp/ury) | GPL-3.0 / AGPL-3.0 | Python | URY: punto de venta de restaurante; AGPL obliga a publicar el código si se ofrece como servicio |
| [Enatega](https://github.com/enatega/food-delivery-multivendor) | MIT en el repo, pero el README dice que la API y el backend son propietarios | — | No sirve como base completa |

**Interpretación:** ninguno sale listo en el stack del estudio. TastyIgniter y Saleor
sirven como **referencia del modelo de datos** (menú, modificadores, horarios, estados), no
como base. Para un servicio propio conviene MIT o BSD; AGPL y GPL traen obligaciones (no es
asesoría legal).

### Recomendación (no decidido)

**Interpretación:**
- Sistema compartido con `tenant_id` desde el primer día.
- Subdominio por defecto y dominio propio como extra.
- Polling para el cliente y SSE o Durable Object para la cocina.
- Tabla `jobs` con webhooks idempotentes.
- **Tentativa: opción 1 (Cloudflare)**, porque el estudio ya la opera con ONZA y es la más
  barata.
- **Opción 2** si la pasarela elegida o alguna librería exige Node completo, o si se quiere
  RLS.
- La opción 3 no se recomienda para una sola persona con clientes que abren de madrugada.

**No decidido.** La regla dura 8 de AGENTS.md pide aprobación explícita para cualquier
servicio de pago nuevo.

---

## 8. Negocio del estudio

### Cómo cobran los competidores (§1)

Tres modelos:
1. **Gratis con extras pagados:** GloriaFood (cierra en 2027).
2. **Suscripción latinoamericana:** OlaClick, MXN 200 a 2,800 al mes; Justo, UF 0,5 a 7 +
   IVA, con alta de UF 0 a 5.
3. **Suscripción de EE. UU.:** Owner, US$249 o 499, más 5 % al comensal.

Casi todos dicen **0 % en el canal propio** y ganan con los extras: pagos, reparto
(Justo 5–7 %), marketplace (Justo 10–13 %) y logística por km.

**Soporte prometido:**
- Owner: 24/7 con especialista;
- Ordering.co: 24–48 h (24/7 solo en Enterprise);
- OlaClick: WhatsApp según el plan.

No hay datos públicos de márgenes, bajas ni número de clientes de ningún competidor.

### Margen y soporte

**Interpretación:**
- El costo directo por negocio es chico: infraestructura de US$0.1 a 5 al mes, más correo
  y WhatsApp (§7).
- El costo real es el **soporte en horario de restaurante**: noches, fines de semana y,
  con Los Tacos May, hasta las 4 a. m. Un pedido perdido a las 3 a. m. se reclama en ese
  momento.
- También pesa el alta de cada negocio: menú, modificadores, fotos y zonas.
- Si el estudio monta su propio «JustoPay» (comisión sobre pagos), el margen se come entre
  las comisiones de la pasarela (§4) y el riesgo fiscal del 18-J (§5).

### Rango de entrada para México

**Interpretación, no dato:** el precio público de entrada va de MXN 200 a 1,200 al mes
(OlaClick). Un estudio local podría entrar en unos **MXN 500 a 1,500 al mes**, con 0 % en
canal propio, alta cobrada aparte y diferenciado por el servicio en persona. No hay cifra
de mercado que lo respalde: es una hipótesis para validar con el segundo cliente.

### Riesgos principales

**Interpretación:**
- competir contra OlaClick (MXN 200) y GloriaFood (gratis hasta 2027) con un producto
  menos maduro;
- soporte nocturno para una sola persona;
- el reparto depende de Uber Direct o de los repartidores del restaurante;
- comisiones de pasarela;
- el mercado se agrupa hacia suites con punto de venta, y sin punto de venta hay riesgo de
  bajas;
- cerrar el producto deja negocios sin canal: GloriaFood muestra el costo de cerrar sin
  sucesor ([gosnappy](https://gosnappy.io/blog/gloriafood-is-shutting-down-what-restaurant-operators-should-do/)),
  así que se necesita un plan de salida y exportación de datos.

### Choque con el contrato del estudio

> `C:\estudio\BIBLIA_ECOSISTEMA\nucleo\AGENTS.md` dice hoy que el oficio se acota a negocio
> real con local y termina con «No SaaS, no producto de suscripción».

Vender este sistema por mes a otros negocios **lo contradice**. Los clientes sí encajan:
son negocios con puerta. **El choque está en el modelo de cobro.** Hace falta una decisión
explícita de Alejandro, con su ADR, antes de construir la parte de varios negocios.

**Interpretación, tres salidas posibles:**
- **(a)** un ADR que permita un producto de suscripción solo para negocios con local, con
  sus límites;
- **(b)** cobrar implementación + mantenimiento mensual por cliente, que ya es el modelo
  del estudio, con el sistema compartido como herramienta interna y sin marca de
  plataforma;
- **(c)** hacer solo el canal de Los Tacos May como proyecto de cliente.

La regla dura 8 (servicios de pago nuevos con aprobación) aplica en los tres casos.

---

## 9. Nueva imagen de Los Tacos May

No se diseña nada aquí. Esto es lo que la marca necesita para un sistema de pedidos y qué
de [docs/diseno/](../diseno/) ya sirve.

### Lo que hace falta (`PENDIENTE-CLIENTE` salvo que se diga)

| Qué | Para qué | Estado hoy |
|---|---|---|
| **Foto real de cada taco** servido, con la misma luz y encuadre, de los 14 guisos | Tarjetas del menú y detalle del platillo | Solo hay imágenes generadas con IA en [pruebas/](../diseno/pruebas/), marcadas para sustituirse antes de vender ([materiales.md](../diseno/materiales.md)) |
| **Menú vigente con precios**, nombres confirmados y qué lleva cada taco (salsas, extras, qué se puede quitar) | Menú y modificadores | El pizarrón tiene unos 10 meses; «Corazón de vaca enamorada» sin confirmar ([datos.md](../negocio/datos.md)) |
| **Empaque para llevar y para domicilio** (qué usan hoy y si mantiene caliente; NOM-251, plásticos en BCS) | Promesa de entrega y fotos | Sin dato; ver [reparto-a-domicilio.md §6](reparto-a-domicilio.md) |
| **Materiales en el local con QR** (cartel en la barra, calcomanía, volante en la bolsa) | Lanzamiento: el error típico es lanzar sin avisar (§6) | No existe; se diseña con el sistema de abajo |
| **Foto de frente del letrero** | Logotipo y cactus definitivos | Pendiente ([materiales.md](../diseno/materiales.md)) |
| **Teléfono y WhatsApp de la barra**, horario completo y demás sucursales | Contacto (LFPC), horario y sucursales | Pendientes ([datos.md](../negocio/datos.md)) |
| **Razón social, aviso de privacidad y términos** | Pago y obligaciones (§5) | Pendientes |
| Icono y nombre corto de la página de pedidos | Pestaña, acceso directo, imagen para compartir | Se resuelve con el sistema de identidad |

### Lo que ya se puede usar tal cual

- [sistema.md](../diseno/sistema.md): logotipo y versiones, color base y **un color por
  guiso**, tipografía, **pictogramas de despacho**, retícula, fotografía de comida, voz,
  movimiento y lo que nunca se hace. Es la base visual de la página de pedidos. El logotipo
  sigue provisional hasta tener la foto del letrero.
- [marca.md](../diseno/marca.md) y [plataforma.md](../diseno/plataforma.md): idea central,
  personalidad, voz y razones para creer. Ojo: [datos.md](../negocio/datos.md) corrige
  que el primer público no necesariamente conoce la barra.
- [textos.md](../diseno/textos.md): inventario de textos y reglas (carrito vacío, errores
  generales, «no encontrado») que se reutilizan en el flujo de pedido.
- [domicilio.md](../diseno/domicilio.md): el flujo completo ya adaptado de Orinoco y Toks,
  y la interfaz `reparto.js`. Es el punto de partida funcional.
- [direccion-de-arte.md](../diseno/direccion-de-arte.md) y
  [materiales.md](../diseno/materiales.md): criterio para fotos e imágenes, y la lista de
  material real que falta.
- [logos.md](../diseno/logos.md) y [logos-tacos.md](../diseno/logos-tacos.md): exploración
  y recomendación de logotipo, todavía por aprobar.
- [empacado.md](../diseno/empacado.md): coreografía de agregar, quitar y confirmar, y
  reglas de teclado y lector de pantalla del carrito. Es del guiso empacado, pero el patrón
  de agregar y confirmar sirve igual.

---

## Las 10 decisiones antes de programar

| # | Decisión | Recomendación |
|---|---|---|
| 1 | **¿El estudio vende software por suscripción?** Choca con «No SaaS» de AGENTS.md | ADR explícito. Mientras no exista, construir solo el canal de Los Tacos May como proyecto de cliente (salida b o c de §8) |
| 2 | **¿Construir o contratar** (Justo, OlaClick) para Los Tacos May? | Pedir cotización a Justo México y probar OlaClick como referencia antes de decidir; construir solo si se quiere el producto o si las cuotas no cuadran |
| 3 | **¿Dónde vive el sistema?** ¿En el repo TacosMay o aparte? | Repo aparte del estudio, compartido y con `tenant_id`; TacosMay lo consume. La rama `escolar` no se toca |
| 4 | **¿Quién recibe el dinero de los pedidos?** | Siempre la cuenta propia del restaurante; el estudio nunca recibe dinero de terceros. Confirmar con un contador lo del 18-J |
| 5 | **¿Qué pasarela?** | Mercado Pago (Checkout Pro con la cuenta de la taquería; OAuth de marketplace después), si las tarifas reales del panel lo confirman; Stripe como alternativa |
| 6 | **¿Cómo se reparte?** | Modo repartidor propio desde el día uno, y Uber Direct solo después de cotizar desde la barra del centro a mediodía, de noche y a las 4 a. m. |
| 7 | **¿Se acepta efectivo o pago al recibir?** | Sí al recoger y con repartidor propio; con Uber Direct, solo pago en línea hasta que Uber confirme el efectivo en México |
| 8 | **¿Qué plataforma técnica?** | Tentativa: opción 1 (Cloudflare, como ONZA); opción 2 si se necesita Node completo o RLS. Subdominio por defecto. No decidido; pide aprobación por la regla 8 |
| 9 | **¿Cómo llega el pedido a la barra?** | Tableta o teléfono Android con el panel, sonido que se repite, impresora LAN de 80 mm (MXN 1,100–2,900 en listados) y aviso por WhatsApp si nadie acepta |
| 10 | **¿Cómo se avisa al cliente?** | Página de estado por enlace y correo; WhatsApp solo en hitos cuando haya número de negocio; nunca SMS salvo que el negocio lo pague |

---

## Lo que no se pudo verificar

**Páginas que fallaron**
- getjusto.com/precios (404; la ruta buena es /planes) y getjusto.com/logistica (404).
- Precios de OlaClick en su dominio principal (404); Pedix (404); Cluvi (sin contenido);
  Soft Restaurant (error de certificado).
- Mercado Pago, página de costos (403) y documento de marketplace en una ruta (404).
- PayPal, página de comisiones (403; sí se leyó el PDF).
- Openpay (sin contenido o falla de DNS) y Clip, precios (404).
- PDF de SAQ A de PCI (403) y PDF del SAT sobre intermediación (redirigía a una IP
  privada).
- Tarifas de WhatsApp para México: Meta remite a un archivo sin enlace visible y
  whatsappbusiness.com las carga con JavaScript.
- Referencia oficial de Uber Direct para cancelar y para crear organizaciones (carga con
  JavaScript); el artículo de Fudo sobre cancelar no se abrió.
- La página de ChowNow sobre errores comunes (404).

**Datos que solo vienen del buscador**
- La nota del «adiós de Justo a México» (15/16-dic-2025).
- Historia y cifras de Justo en México (2020–2022) y su ronda de inversión.
- Todas las tarifas de Mercado Pago, Openpay y Clip.
- Los depósitos de Mercado Pago y Clip.
- La documentación de marketplace de Mercado Pago y las cuentas Express de Stripe en
  México.
- La fecha de cierre de GloriaFood.
- El precio de Parrot y las cifras de ChowNow y de reparto de Owner.
- Las reglas de zonas y mínimos de otros proveedores.
- Los criterios de SAQ A y la factura global.
- Los precios de impresoras en Mercado Libre.
- Impresión en la nube (Star, Epson).
- Las recomendaciones de Baymard.
- El espejo de la API de organizaciones de Uber.
- La plataforma de taxis en Cabo.

**Datos que nadie ha confirmado**
- Tarifa vigente de Uber Direct en México.
- Costo de cancelar con Uber Direct en México.
- Requisitos de alta de Uber Direct en México.
- Si Direct Organizations está abierto en México.
- Si Uber Direct cotiza en Cabo a las 4 a. m.
- Tarifa oficial de WhatsApp para México.
- Cambios de 2026 a la LIVA sobre plataformas digitales.
- Reglamento nuevo de la LFPDPPP.
- Reformas a la ley de alcohol de BCS después de 2016.
- Tipo de cambio para comparar UF, USD y MXN (por eso no se convirtió nada).

---

## `PENDIENTE-CLIENTE` (preguntas para la familia)

Se suman a las 11 de [reparto-a-domicilio.md](reparto-a-domicilio.md#pendiente-cliente),
sin repetirlas:

1. **Menú vigente:** nombres confirmados, precios actuales y si son los mismos en barra, para
   llevar y a domicilio.
2. **Qué lleva cada taco:** salsas, extras con costo, qué se puede quitar y si hay
   tortilla o tamaño a elegir.
3. **Horario completo** por día (apertura y cierre), días de descanso y festivos.
4. **Las demás taquerías:** direcciones, horarios, teléfonos y si tendrían pedidos en
   línea.
5. **Quién vigila los pedidos** en la barra de madrugada y en qué equipo (¿hay Wi-Fi
   estable en el local?).
6. **Tiempo real de armar un pedido** para llevar y cuántos pedidos aguanta la barra en
   hora pico.
7. **Repartidor propio:** ¿tienen o tendrían uno? ¿A qué horas?
8. **Formas de pago que aceptan hoy** (efectivo, terminal, transferencia) y si ya tienen
   cuenta de Mercado Pago, Clip u otra.
9. **Régimen fiscal y quién lleva la contabilidad**, para la factura global y la pasarela.
   No se escribe en el repositorio.
10. **Razón social y domicilio** para el aviso de privacidad y los términos.
11. **Teléfono y WhatsApp de la barra** para clientes y repartidores.
12. **Bebidas u otros productos** además de tacos, y si alguno es alcohol.
13. **Fotos:** si se puede fotografiar cada taco en el local y cuándo.
14. **Empaque** para llevar que usan hoy.
15. **Cuota de servicio y propina:** si quieren cobrar cuota y si la propina va al personal.
