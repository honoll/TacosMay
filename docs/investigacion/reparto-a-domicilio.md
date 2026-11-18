# Reparto a domicilio en Cabo San Lucas con un servicio de «solo entrega»

**Encargo (17-nov-2026).** Idea 1 de [ideas.md](../ideas.md): pedir en la web de Los Tacos
May los tacos de la taquería, al precio de la taquería, y que un repartidor externo los
lleve dentro de Cabo San Lucas cobrando solo el envío, como Toks. Alejandro: «una versión
solo de prueba para que pueda mostrar cómo quedaría y solo falte conectar cuentas». Este
documento dice con qué proveedor real se sustituye la pieza simulada
(`frontend/domicilio/reparto.js`) y qué falta para hacerlo.

Cómo leerlo: **[OFICIAL]** = página del proveedor o de la autoridad, leída. **[PRENSA]** =
medio serio, leído. **[BÚSQUEDA]** = solo lo vi en resultados de búsqueda, no abrí la
página. **[INTERPRETACIÓN]** = lectura mía. Todas las consultas son del **17-nov-2026**.
Ninguna cifra de este documento es del negocio: las del negocio son `PENDIENTE-CLIENTE`.

---

## Resumen

- **Proveedor recomendado para empezar: Uber Direct.** Es el único servicio de «solo
  entrega» con interfaz para programadores pública, entorno de pruebas con repartidor
  simulado y una página oficial que lo nombra **en Cabo San Lucas**.
- **Cobertura en Cabo: dicha, no probada.** La página de Uber para Cabo San Lucas dice
  que Uber Direct permite entregas por encargo ahí y que el reparto funciona «24/7, subject
  to delivery partner availability» (24/7, sujeto a que haya repartidores) **[OFICIAL]**.
  Esa sección parece texto que se repite en todas las ciudades **[INTERPRETACIÓN]**: hasta
  pedir una cotización con una dirección real de Cabo, a las 4 a. m. y a mediodía, no está
  confirmado.
- **Los demás:** Lalamove solo lista la Ciudad de México en su API; DiDi Entrega solo
  nombra La Paz en Baja California Sur y no anuncia API; Rappi está en Los Cabos como app de
  pedidos, pero no encontré un producto público de solo entrega para México; 99minutos y
  Envia.com no mencionan Baja California Sur.
- **Toks** cobra al cliente una cuota de servicio de $25 + IVA y un envío de $18 + IVA por
  los primeros 3 km y $5 + IVA por km adicional, y dice que puede contratar la entrega con
  terceros; **no publica quién reparte** **[OFICIAL]**.
- **El argumento central se sostiene con cifras oficiales:** Uber Eats publica comisiones
  de 25 % a 29 % por pedido a domicilio en su plataforma; Uber Direct publicó en 2023 una
  tarifa fija de $49 + impuestos hasta 3 km y $5 por km adicional **[OFICIAL]**.
- **Para conectarlo falta:** abrir la cuenta en direct.uber.com, cotizar direcciones de
  Cabo, cambiar el módulo simulado por rutas del backend, recibir los avisos de estado,
  cobrar en línea, y que la familia conteste quién empaca, zonas, horario y volumen.

---

## 1. Servicios de «solo entrega» en México

| Proveedor y producto | Cómo funciona | Interfaz para programadores | Cobro publicado |
|---|---|---|---|
| **Uber Direct** ([página de México](https://merchants.ubereats.com/mx/es/services/uber-direct/), [comunicado 2023](https://www.uber.com/mx/es/newsroom/uber-direct)) | **[OFICIAL]** Entrega «white-label» para pedidos que el negocio recibe en su web, app, WhatsApp o teléfono. Cotización → entrega → repartidor asignado → seguimiento con enlace para el cliente → prueba de entrega. Inmediata, el mismo día o programada hasta 30 días antes. Se puede pedir desde un panel web sin programar | **Sí, pública:** [documentación](https://developer.uber.com/docs/deliveries/overview), entorno de pruebas con «Robo Courier» (repartidor simulado), avisos por webhook. Detalle en §5 | **[OFICIAL, 2023]** $49 + impuestos por entrega de hasta 3 km y $5 por km adicional, para pymes; sin costo de alta ni mínimo mensual. La página actual dice «tarifas que se ajustan a tu negocio», sin cifra ([precios de socios](https://merchants.ubereats.com/mx/en/pricing)). **No encontré tarifa vigente publicada** |
| **Uber Courier / Encargo** ([Cabo San Lucas](https://www.uber.com/mx/en/b/courier-services/cabo-san-lucas-bs-mx/)) | **[OFICIAL]** Envío de paquetes desde la app de Uber, en moto o auto, con seguimiento y PIN opcional | **No** (la misma página lo dice) | Se cotiza en la app; sin tarifa publicada |
| **Lalamove** ([México](https://www.lalamove.com/es-mx/)) | **[OFICIAL]** Cotización válida 5 minutos → orden → conductor asignado → entregado, firmado o fallido; «todos los días del año a cualquier hora» | **Sí:** [documentación](https://developers.lalamove.com/), entorno de pruebas, webhooks. Cancelación solo mientras busca conductor o en los primeros 5 minutos. **La única ciudad listada es la Ciudad de México** | Parada extra $10.80; la tarifa base sale en la app |
| **DiDi Entrega** ([página](https://web.didiglobal.com/mx/entrega/)) | **[OFICIAL]** Moto, auto y «Light», con seguimiento; existe «DiDi Entrega Business» para empresas en web | **No menciona API** | «Desde $25» |
| **Rappi** ([Los Cabos](https://www.rappi.com.mx/los-cabos/restaurantes), [desarrolladores](https://dev-portal.rappi.com/en/api-reference/content/)) | **[OFICIAL]** Opera en Los Cabos con «más de 522 restaurantes», pero como app de pedidos. Su API es para integrar menús y pedidos **dentro** de Rappi | No vi entrega para pedidos de canal propio. RappiCargo existe en Perú **[BÚSQUEDA]**; no encontré equivalente en México | — |
| **99minutos** ([sitio](https://www.99minutos.com/)) | **[OFICIAL]** «Sprint y Sameday delivery», integraciones con tiendas en línea; alta por contacto comercial | Anuncia APIs (no abrí su documentación) | No publica tarifas |
| **Envia.com** ([sitio](https://envia.com/es-MX)) | **[OFICIAL]** Agregador; anuncia envíos a demanda en menos de 45 minutos | Tiene documentación (no la abrí) | No publica tarifas en esa página |
| **Shipday** ([precios](https://www.shipday.com/pricing)) | **[OFICIAL]** Despachador: organiza repartidores propios. Los repartidores de terceros solo en EE. UU., Canadá, Australia y Reino Unido | Sí, desde el plan de 49 dólares al mes | Gratis hasta 300 pedidos al mes con repartidores propios |
| **Skydropx** | Su página dio error 403 | — | — |
| **Mensajerías locales de Los Cabos** | En dos búsquedas no apareció ninguna con página propia; solo la app CaboHungry, que es un mercado de restaurantes **[BÚSQUEDA]**. Suelen trabajar por Facebook o WhatsApp **[INTERPRETACIÓN]**, y eso no se buscó | — | — |

---

## 2. Cobertura en Cabo San Lucas y horario

| Proveedor | Qué dice de Los Cabos | Madrugada |
|---|---|---|
| Uber Direct | **[OFICIAL]** La página de Cabo San Lucas dice que Uber Direct permite entregas por encargo en Cabo San Lucas. El comunicado de 2023 habla de 68 ciudades sin listarlas, y el registro en la documentación existe «in select regions» (en algunas regiones) sin lista | «24/7, subject to delivery partner availability» **[OFICIAL]** |
| Uber (contexto) | **[PRENSA]** Uber lleva 7 años en Los Cabos y Uber Eats 6; unos 500 comercios; el 40 % de los viajes ocurre entre 6 p. m. y 6 a. m. ([Quadratín, 3-sep-2025](https://mexico.quadratin.com.mx/uber-en-los-cabos/)) | El dato de viajes es de transporte de personas, no de repartos |
| Lalamove | No la menciona; la API solo lista la Ciudad de México | 24 h a nivel México |
| DiDi Entrega | En Baja California Sur solo nombra La Paz | No da horario de entregas |
| Rappi | Opera en Los Cabos como app de pedidos | No verificado |
| 99minutos, Envia.com | No mencionan Baja California Sur | No publicado |

**[INTERPRETACIÓN]** Nadie garantiza repartidor a las 4 a. m. en Cabo. La cotización de
Uber Direct devuelve error si no hay cobertura en ese momento, así que la prueba es
cotizar a esa hora desde la dirección de la taquería del centro. Hay antecedente de
conflicto entre taxistas y plataformas en Baja California Sur ([Zeta Tijuana,
14-jul-2026](https://zetatijuana.com/2026/07/simularon-apoyo-a-transportistas-pan-sobre-crisis-del-sector-en-los-cabos/)
**[PRENSA]**, sobre transporte, no sobre reparto): conviene preguntarle a Uber si afecta
la operación de reparto.

---

## 3. Qué piden para darse de alta, y qué puede hacer Alejandro hoy

**Uber Direct [OFICIAL]**
- Alta autoservicio para pymes con un formulario, sin pasar por ventas
  ([comunicado 2023](https://www.uber.com/mx/es/newsroom/uber-direct)).
- Cuenta en direct.uber.com. Las credenciales de prueba salen en la pestaña Developer, en
  modo Test. Para producción hay que capturar datos de facturación y Uber aprueba la cuenta
  ([primeros pasos](https://developer.uber.com/docs/deliveries/get-started)); el
  identificador de cliente se acuerda con un Account Manager antes de producción, y se
  exige un piloto con tiendas reales ([preguntas](https://developer.uber.com/docs/deliveries/faq),
  [resumen](https://developer.uber.com/docs/deliveries/overview)).
- **No publicado:** RFC u otros datos fiscales exactos, contrato, volumen mínimo y tiempo
  de aprobación en México.

**Paso a paso para Alejandro hoy**
1. Entrar a direct.uber.com y crear la cuenta de negocio con los datos de la taquería (no
   los escribo aquí: son de la familia).
2. Desde el panel, sin programar, pedir **una cotización** de la taquería del centro
   (José María Morelos S/N, Local 3) a dos o tres colonias de Cabo. Repetirla a mediodía, en
   la noche y cerca de las 4 a. m. Anotar precio y si sale «sin cobertura».
3. Si cotiza: en la pestaña Developer, modo Test, copiar las credenciales de prueba y
   pasarlas al backend por variable de entorno (nunca en el repositorio ni en el
   navegador).
4. Pedir por el panel una entrega real pequeña (algo que no sea comida) para ver tiempo de
   asignación y llegada.
5. Escribirle a Uber para confirmar en México: tarifa vigente, política de cancelación,
   requisitos fiscales y si hay pago contra entrega.

---

## 4. Toks y otros que venden en su web con entrega de un tercero

**Toks [OFICIAL]** ([sitio](https://www.toks.com.mx/), [términos](https://www.toks.com.mx/terminos-y-condiciones),
[app iOS](https://apps.apple.com/mx/app/toks/id6753316879))
- En la portada: «ORDENA AQUÍ», «Menú para ordenar en línea», «Toks en casa» y su app
  propia (vendedor: Restaurantes Toks SA de CV). La web rechazó la lectura automática (403);
  se abrió en el navegador.
- Términos: domicilio o recoger, **pago en línea**, radio de **5 km** desde el restaurante,
  preparación de 15 minutos. Al confirmar el pago llega un número de orden y un SMS con
  enlace de seguimiento del reparto y hora estimada.
- Costos al cliente: cuota de servicio $25 + IVA; envío $18 + IVA los primeros 3 km y
  $5 + IVA por km adicional.
- Quién entrega: se reserva «contratar los servicios de entrega con terceros». Ni los
  términos ni el [aviso de privacidad](https://www.toks.com.mx/aviso-de-privacidad)
  nombran al proveedor.
- **[INTERPRETACIÓN]** El esquema (tarifa a 3 km más $5 por km) se parece al de Uber
  Direct, y el enlace de seguimiento por SMS también; pero **no hay fuente que diga que
  Toks usa Uber Direct**. Lo único publicado que liga a Toks con Uber es su participación
  en un piloto de entregas rápidas **dentro de Uber Eats** en 2023 ([The Logistics World,
  3-nov-2023](https://thelogisticsworld.com/logistica-comercio-electronico/daniel-colunga-uber-eats-busca-la-personalizacion-y-los-altos-niveles-de-calidad-en-delivery)
  **[PRENSA]**), que no es lo mismo. Toks también vende en Uber Eats y Rappi
  **[BÚSQUEDA]**.
- **[INTERPRETACIÓN]** Toks cobra al cliente $18 + IVA por los primeros 3 km, menos que la
  tarifa pública de Uber Direct de 2023 ($49): o negoció otra tarifa, o la cuota de servicio
  de $25 cubre la diferencia. No se puede saber con lo publicado.

**Otros**
- **El Califa** tiene app propia con domicilio, pago en línea y seguimiento del repartidor
  ([App Store](https://apps.apple.com/us/app/-/id1489409047) **[OFICIAL]**); no dice quién
  reparte. Empezó con motos y repartidores propios ([The Logistics World](https://thelogisticsworld.com/logistica-comercio-electronico/uber-eats-la-plataforma-de-delivery-que-entregara-todo-incluso-tacos-de-taqueria-el-califa-por-dron)
  **[PRENSA]**) y entró en exclusiva a Uber Eats en 2022 ([Uber](https://www.uber.com/es-MX/newsroom/taqueria-el-califa-peltre-loncheria-taqueria-caifan-en-exclusiva-con-uber-eats)
  **[OFICIAL]**). Modelo mixto **[INTERPRETACIÓN]**.
- El Fogoncito, Orinoco, Los Panchos y Little Caesars solo aparecieron en Uber Eats o Rappi
  **[BÚSQUEDA]**; no encontré pedido en web propia ni proveedor publicado.
- **No encontré ninguna cadena mexicana anunciada públicamente como cliente de Uber
  Direct.** El comunicado de 2023 habla de «restaurantes» sin nombres.

---

## 5. La forma de la integración

### Lo que pide y devuelve Uber Direct [OFICIAL]

Fuente: [documentación de entregas](https://developer.uber.com/docs/deliveries/overview) y
sus guías enlazadas.

| Paso | Qué se manda | Qué regresa |
|---|---|---|
| **Token** ([autenticación](https://developer.uber.com/docs/deliveries/guides/authentication)) | `POST https://auth.uber.com/oauth/v2/token` con `client_credentials`, `scope=eats.deliveries` | Token que dura 30 días |
| **Cotizar** | `POST /v1/customers/{customer_id}/delivery_quotes` con direcciones de recogida y entrega (algunas regiones piden latitud y longitud) | Identificador `dqt_…`, costo y si la entrega es posible |
| **Crear entrega** | `POST /v1/customers/{customer_id}/deliveries` con `quote_id`, recogida y entrega (dirección, nombre, teléfono, coordenadas), `manifest_items` (lo que se lleva) | `id`, `status: "pending"` y `tracking_url` (enlace de seguimiento para el cliente; Uber pide no alterarlo) |
| **Prueba de entrega** ([guía](https://developer.uber.com/docs/deliveries/guides/proof-of-delivery), [PIN](https://developer.uber.com/docs/deliveries/guides/pincode)) | `dropoff_verification`: firma, foto, código de barras, identificación, o PIN de 4 dígitos que le llega al cliente por SMS | — |
| **Avisos** ([estados](https://developer.uber.com/docs/deliveries/daas/references/api/webhooks/delivery-status-webhook)) | Uber llama a una URL del backend: `event.delivery_status`, `event.courier_update` (ubicación del repartidor), `event.refund_request`… | Estados: `pending`, `pickup`, `pickup_complete`, `dropoff`, `delivered`, `canceled`, `returned` |
| **Pruebas** ([Robo Courier](https://developer.uber.com/docs/deliveries/guides/robocourier)) | `test_specifications.robo_courier_specification.mode` = `auto` (un evento cada 30 s) o `custom` | Recorre los estados sin repartidor real. Límite: 200 peticiones cada 10 min |

**No verificado:** la ruta exacta de cancelar (`…/deliveries/{id}/cancel`) solo la vi en un
espejo de terceros; las páginas oficiales de referencia cargan con JavaScript. Se confirma
en el panel o con la cuenta de prueba. La política de cobro por cancelar en México no está
publicada (en Reino Unido cobran si ya hay repartidor asignado **[BÚSQUEDA]**).

### Qué vive en el servidor

- **Las credenciales y el token**, siempre. Si estuvieran en el navegador, cualquiera
  podría pedir entregas a cuenta de la taquería.
- **Cotizar y crear entrega:** el navegador manda carrito y dirección al backend; el
  backend calcula el precio de los tacos con sus propios datos (no con lo que diga el
  navegador), cotiza con Uber y guarda la cotización.
- **Crear la entrega solo después de cobrar.** Si se crea antes y el pago falla, la
  taquería paga un repartidor sin venta.
- **El webhook** llega al backend, que verifica que viene de Uber (firma del aviso; el
  mecanismo exacto no lo verifiqué) y actualiza el estado del pedido. El navegador pregunta
  el estado al backend, no a Uber.

### Comparación con `reparto.js` (cotizar, crear entrega, estado, cancelar)

El módulo simulado que hizo Frontend ya separa bien la puerta del proveedor. Frente a Uber
Direct **[INTERPRETACIÓN]**:

| Tema | En `reparto.js` hoy | Con Uber Direct |
|---|---|---|
| Contacto | `destino` sin nombre ni teléfono | **Falta:** nombre y teléfono de quien recibe, y nombre y teléfono de la taquería (recogida). Sin teléfono el repartidor no puede llamar |
| Lo que se lleva | `pedido` | Pasa a `manifest_items` (nombre, cantidad, tamaño). Uber no necesita precios de los tacos |
| Cotización | `{ cotizacionId, envio_centavos, zona, vence }` | Coincide; `vence` sale de la cotización de Uber. `zona` no existe en Uber: la cobertura se decide por dirección |
| Crear | `{ entregaId, creada }` | **Falta:** `tracking_url` (el enlace de seguimiento que el cliente debe ver), y un identificador propio del pedido para no crear dos entregas si se reintenta |
| Estado | `recibido · preparando · asignado · en_camino · entregado · cancelado` | `recibido` y `preparando` son de la cocina, no del repartidor: conviene que el backend los ponga y Uber solo mueva de `asignado` en adelante. **Falta** `devuelto` (`returned`, cuando no se pudo entregar) |
| Repartidor | `{ alias, vehiculo }` | Uber manda datos del repartidor y su ubicación en `event.courier_update`; con `tracking_url` basta para la primera versión |
| Cómo se entera | La página consulta `estado()` | Uber **avisa** al backend por webhook; la página puede seguir preguntando al backend |
| Prueba de entrega | No existe | **Falta** decidir: PIN por SMS o foto |
| Cancelar | `{ ok }` | **Falta** el costo y el motivo, porque puede cobrarse |
| `abierto()` | Horario | Es de la taquería, no del proveedor: **se queda**, pero sale de los datos del negocio |
| `zonas()` | Lista de colonias | **Sobra** como regla: con Uber la cobertura la dice la cotización. Puede quedarse solo como sugerencia del formulario |

---

## 6. Lo demás que hace falta para vender de verdad

**Cobro en línea [OFICIAL]** (cifras publicadas al 17-nov-2026; confirmar en el panel
antes de presupuestar)

| Opción | Comisión por tarjeta publicada | Sin programar | Qué piden |
|---|---|---|---|
| [Mercado Pago](https://www.mercadopago.com.mx/herramientas-para-vender/link-de-pago) | 3.49 % + $4.00 al instante; 3.19 % a 7 días; 2.95 % a 30 días. La propia página no es clara en si el IVA aplica a la cuota fija | Link de pago | RFC activo y constancia de situación fiscal **[BÚSQUEDA, blog de Mercado Pago]** |
| [Stripe México](https://stripe.com/mx/pricing) | 3.6 % + $3.00 + IVA (tarjeta nacional) | Payment Links | [RFC, CLABE en pesos, domicilio en México](https://support.stripe.com/questions/required-information-to-open-your-stripe-account-in-mexico) |
| [Conekta](https://www.conekta.com/pricing) | 3.4 % + $3.00 + IVA; efectivo 2.6 % + $3.00 | Link de pago | Registro en su panel |
| [Openpay (BBVA)](https://www.bbva.mx/empresas/productos/medios-de-cobro/pago-electronico-Openpay.html) | 2.55 % + $1.90 (Visa/Mastercard) | Link de pago | Cuenta de cheques BBVA del negocio, INE, constancia fiscal de menos de 6 meses |

**[INTERPRETACIÓN]** Para comida caliente, pagar en efectivo en OXXO no sirve (el pago
tarda). Pago contra entrega con Uber Direct: no aparece en ninguna página oficial.

**Cómo llega el pedido a la cocina**
- Impresora de comandas que trae los pedidos de internet: Star CloudPRNT consulta una
  dirección del servidor cada tantos segundos ([Star](https://star-m.jp/products/s_print/sdk/StarCloudPRNT/manual/en/about.html)
  **[BÚSQUEDA]**); Epson tiene Server Direct Print en modelos de red ([Epson](https://epson.com/For-Work/Printers/POS/OmniLink-TM-m30II-NT-POS-Receipt-Printer/p/C31CJ95022)
  **[BÚSQUEDA]**).
- WhatsApp: la API de WhatsApp Cloud cobra por mensaje entregado desde julio de 2025, con
  1,000 mensajes de servicio gratis al mes por número desde octubre de 2026; pide un número
  que no esté en uso en WhatsApp ([precios](https://developers.facebook.com/docs/whatsapp/pricing),
  [números](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/phone-numbers/)
  **[OFICIAL]**). La tarifa para México está en un archivo que no abrí.
- **[INTERPRETACIÓN]** Para una prueba, lo más simple es una pantalla de pedidos en una
  tableta o teléfono de la barra que lea del mismo backend; la impresora viene después.

**Empaque para reparto**
- La NOM-251-SSA1-2009 cubre alimentos «para llevar o entregar a domicilio» y pide
  mantener lo caliente a 60 °C o más ([PDF de Salud Nuevo León](https://saludnl.gob.mx/regulacion-sanitaria/cursos/wp-content/uploads/2025/09/NOM-251.pdf)
  **[BÚSQUEDA]**; ya citada en [viabilidad.md](viabilidad.md)).
- Una guía de salud pública de Los Ángeles pide empaque con sello que muestre si se abrió y
  transporte aislado ([guía, 2022](https://admin.publichealth.lacounty.gov/eh/docs/business/guidance-food-delivery-pickup-en.pdf)
  **[OFICIAL, de EE. UU.]**). No encontré guía mexicana específica de reparto.
- Baja California Sur reformó en 2018 su ley ambiental contra bolsas, popotes y unicel, con
  plazos desde 2019 ([Zeta Tijuana](https://zetatijuana.com/2018/07/ley-contra-popotes-y-plasticos/),
  [Posta](https://www.posta.com.mx/bcs/que-paso-con-la-ley-desplastificate-en-bcs-diputado-exige-que-se-aplique-de-verdad/vl2055446)
  **[BÚSQUEDA]**). **No leí el texto vigente**: confirmarlo antes de comprar empaque de
  unicel.

**Obligaciones básicas [OFICIAL]**
- **Aviso de privacidad:** la nueva Ley Federal de Protección de Datos Personales en
  Posesión de los Particulares (DOF 20-mar-2025) pide, en su art. 15, identidad y domicilio
  del responsable, datos que se tratan, finalidades, cómo limitar su uso, cómo ejercer los
  derechos ARCO y cómo se avisan cambios; en línea basta un aviso simplificado con liga al
  completo (art. 16) ([texto](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf)).
- **Venta en línea:** la Ley Federal de Protección al Consumidor, art. 76 bis, pide dar
  antes de la compra domicilio físico, teléfonos y medios para reclamar, y todos los costos
  y cargos adicionales ([texto](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPC.pdf)). El
  envío y la cuota, si la hay, se muestran antes de pagar.
- **Factura:** al público en general se puede emitir una factura global diaria, semanal o
  mensual ([regla del SAT](https://wwwmat.sat.gob.mx/articulo/90959/regla-2.7.1.24)); si el
  cliente la pide, se le emite a su nombre **[INTERPRETACIÓN del texto]**. Lo decide quien
  lleve la contabilidad de la taquería.

---

## 7. Comisiones de las aplicaciones frente a solo entrega

| Qué | Cifra | Fuente |
|---|---|---|
| Uber Eats, plan Lite | 25 % por pedido a domicilio (+3 % si el cliente es Uber One) | [Precios de socios](https://merchants.ubereats.com/mx/en/pricing) **[OFICIAL, sin fecha de vigencia; «puede variar por región»]** |
| Uber Eats, plan Plus | 27 % (+2 % Uber One) | Misma página |
| Uber Eats, plan Premium | 29 % (+1 % Uber One) | Misma página |
| Uber Eats, recogida en Lite | 15 % | [Comunicado, 13-mar-2024](https://www.uber.com/es-MX/newsroom/uber-eats-comisiones-para-pymes-mexico) **[OFICIAL, anterior a la página de precios]** |
| Uber Direct (solo entrega) | $49 + impuestos hasta 3 km; $5 por km adicional; tarifa fija, no porcentaje | [Comunicado, 30-may-2023](https://www.uber.com/mx/es/newsroom/uber-direct) **[OFICIAL, 2023]** |
| DiDi Food | 30 % + IVA | Expansión y Forbes, 2020 **[BÚSQUEDA, no vigente probablemente]**; el PDF oficial de DiDi es imagen y no se pudo leer |
| Rappi | **No encontré cifra oficial vigente** | Solo topes temporales de 2021 en prensa **[BÚSQUEDA]** |
| PROFECO | Dice que algunos restaurantes suben precios en las apps para compensar comisiones; **no da porcentajes** | [Expansión, 5-oct-2026](https://expansion.mx/tecnologia/2026/10/05/pedir-comida-app-cuotas-servicio-profeco) **[PRENSA]** |

**Cuenta de ejemplo [INTERPRETACIÓN; aritmética, no dato del negocio].** Con el 25 % del
plan Lite, de cada $100 de tacos vendidos en Uber Eats la plataforma retiene $25; para
recibir lo mismo que en la barra, el precio en la app tendría que ser un tercio más alto.
Con solo entrega, el precio de los tacos no cambia y el envío se cotiza aparte (en 2023,
$49 + impuestos hasta 3 km), más la comisión del cobro en línea (§6). Qué conviene depende
de la distancia y del tamaño del pedido: con pedidos chicos y lejanos, el envío pesa más que
la comisión. Los precios del pizarrón tienen unos 10 meses: no los uso para la cuenta.

---

## 8. Recomendación

**Empezar con Uber Direct**, porque:
1. Es el único con página que lo nombra en Cabo San Lucas y con horario «24/7» (sujeto a
   repartidores) **[OFICIAL]**.
2. Tiene interfaz pública, entorno de pruebas con repartidor simulado y panel sin
   programar: la familia puede probar cotizaciones sin esperar al código.
3. Su forma (cotizar → crear → avisos de estado → cancelar) cabe en las cuatro funciones de
   `reparto.js` con los ajustes de §5.
4. Si un día no conviene, la puerta única de `reparto.js` permite cambiarlo.

**Confirmar primero** (antes de escribir código real):
1. Que direct.uber.com acepta una dirección de Cabo San Lucas y cotiza desde la taquería
   del centro.
2. Que cotiza a las 4 a. m.
3. La tarifa vigente en Cabo (la de 2023 puede haber cambiado) y el costo de cancelar.
4. Requisitos fiscales y de contrato en México.

**Del prototipo a una prueba real, en orden**
1. Cuenta en direct.uber.com y cotizaciones a mano desde el panel (§3).
2. Rutas del backend `/api/domicilio/cotizar`, `/entregas`, `/entregas/:id` y
   `/entregas/:id/cancelar` que llamen a Uber con las credenciales de prueba por variable
   de entorno; `reparto.js` importa un módulo que llama a esas rutas en vez del simulado.
3. Agregar nombre y teléfono, `tracking_url` y `devuelto` al contrato (§5), y webhook
   en el backend.
4. Recorrer el flujo completo con Robo Courier.
5. Cobro en línea con un link de pago o checkout (§6); crear la entrega solo con pago
   confirmado.
6. Pantalla de pedidos en la barra.
7. Aviso de privacidad, costos visibles antes de pagar, y piloto con pocas colonias y pocas
   horas; luego pedir a Uber el paso a producción.

## `PENDIENTE-CLIENTE`

1. **Volumen esperado** de pedidos a domicilio por día y por hora.
2. **Zonas** a las que quieren llegar (colonias, distancia máxima).
3. **Horario** de reparto: ¿hasta las 4 a. m. o menos? ¿qué días?
4. **Quién recibe el pedido en la barra, quién arma y empaca, y quién lo entrega al
   repartidor.**
5. **Menú y precios vigentes** de los tacos para domicilio y si son los mismos de la barra.
6. **Pedido mínimo** y si el envío lo paga el cliente completo o la taquería absorbe una
   parte.
7. **Empaque:** cuál usan hoy para llevar y si mantiene el taco caliente.
8. **Datos fiscales** para abrir las cuentas (Uber y cobro): régimen, RFC, cuenta bancaria.
   No se escriben en el repositorio.
9. **Quién factura** y si ya emiten factura global.
10. **Teléfono o WhatsApp** de la taquería para el repartidor y para reclamos (la ley pide
    medios de contacto antes de la compra).
11. Si ya usan Uber Eats, Rappi o DiDi en la taquería, y con qué comisión real.

## Lo que no pude abrir o verificar

- La tarifa vigente de Uber Direct en México, su política de cancelación y los requisitos
  fiscales: no están publicados. La página `uber.com/mx/es/business/solutions/uber-direct/`
  dio 404.
- La referencia oficial de crear y cancelar entrega (carga con JavaScript) y el mecanismo de
  firma del webhook.
- La lista de ciudades de Uber Direct en México.
- Las páginas de Uber Eats por colonia en Cabo (403), Skydropx (403), la documentación de
  99minutos y Envia.com, DiDi Entrega Business, y grupos de mandados de Cabo en redes.
- El PDF de comisiones de DiDi (imagen), cifras vigentes de Rappi y DiDi, páginas de costos
  de Mercado Pago (403) y de Clip (404), la tarifa de WhatsApp para México.
- El texto vigente de la ley ambiental de Baja California Sur sobre unicel.
- Nadie de este proyecto ha pedido todavía una cotización real a Cabo San Lucas.
