# Guion de la exposición — TacosMay

8 a 10 minutos: **4 de demo en vivo** + **4 a 6 de defensa técnica**. Rúbrica en
[rubrica.md](rubrica.md); respaldo de todo lo que se dice en
[TacosMay-Diseno-y-Justificacion.pdf](TacosMay-Diseno-y-Justificacion.pdf).

> La tienda está hoy en `http://localhost:5000`. Cuando entre la landing (ticket F6) se
> muda a `http://localhost:5000/tienda/`: ajustar las direcciones de este guion ese día.

## Antes de pasar al frente (10 minutos antes)

1. Internet funcionando (la base está en la nube; sin red no hay demo).
2. En `C:\estudio\TacosMay`: `npm run seed` y luego `npm start`. Debe decir `Redis conectado`.
   El seed deja la base limpia: 6 guisos de ejemplo, el admin y cero pedidos.
3. Abrir el `.env` en el editor **solo para ti** y tener a la mano el correo y la contraseña
   del admin. **No proyectar el `.env`**: trae la contraseña de Redis.
4. Dos ventanas del navegador ya abiertas en la tienda: una **normal** (cliente A) y una
   **de incógnito** (cliente B). En cada una, crear la cuenta de prueba desde antes para no
   gastar tiempo de demo escribiendo formularios.
5. La consola de Redis Cloud abierta en otra pestaña, en la base, para enseñar las claves.
   `PENDIENTE`: confirmar un día antes desde dónde se ven las claves y su TTL en la consola
   (Redis Insight); si no se ve, se omite el paso 3 de la demo y no pasa nada.
6. El editor abierto en `backend/models/pedidosModel.js`.
7. Zoom del navegador al 125 % para que se lea desde atrás.

## Demo en vivo (4:00)

| Min | Qué haces | Qué dices |
|---|---|---|
| 0:00 | Tienda abierta en el catálogo. Señalas la terminal con `Redis conectado`. | «TacosMay vende los guisos de las taquerías de mi familia empacados al vacío. La tienda corre aquí, pero **todos los datos están en Redis Cloud**; no hay nada en localhost.» |
| 0:25 | Cliente A: agregas **2 de Mole con pollo** (tiene stock 3) y abres el carrito. Señalas la cuenta regresiva. | «El carrito es un Hash con **TTL de 30 minutos**. Esa cuenta regresiva es el `TTL` que devuelve Redis. Si abandono el carrito, Redis lo borra solo; yo no programé ninguna limpieza.» |
| 0:55 | Cambias la cantidad de otro guiso; el contador vuelve a 30:00. | «Cada cambio renueva la expiración con `EXPIRE`.» |
| 1:10 | Pestaña de Redis Cloud: muestras `tm:carrito:{id}` con su TTL y un `tm:guiso:{id}`. | «Así se ve en la base: claves con prefijo `tm:`, el carrito con su tiempo de vida y el guiso como Hash.» |
| 1:35 | Ventana de incógnito (cliente B): agregas **2 de Mole con pollo** y lo dejas en el carrito. | «Otro cliente quiere las mismas porciones. Quedan 3 y entre los dos piden 4.» |
| 1:50 | Cliente A: **Confirmar pedido**. Sale «Pedido #1 confirmado». Vas a tus pedidos y al catálogo: el mole queda con stock 1 y aparece en **Los más pedidos**. | «El pedido es una transacción `MULTI/EXEC`: descuenta stock, suma al ranking, que es un Sorted Set, guarda el pedido y borra el carrito, todo o nada.» |
| 2:25 | Cliente B: **Confirmar pedido**. Sale el error de stock insuficiente. | «El segundo cliente recibe un 409: no se vendió de más. Si hubieran confirmado en el mismo instante, `WATCH` cancela la transacción del que llegó tarde.» |
| 2:50 | Cierras sesión, entras como admin. **Nuevo guiso** → lo editas (cambias el precio) → lo eliminas. | «CRUD completo desde la interfaz: crear, leer, actualizar y eliminar. Al eliminar, el guiso sale también del índice y del ranking en la misma transacción.» |
| 3:30 | En la terminal: `Ctrl+C`, luego `npm start`. Recargas la tienda: el pedido #1 y el stock en 1 siguen ahí. | «Apagué y prendí la aplicación y los datos persisten, porque viven en el servicio en la nube y no en mi proceso.» |
| 3:55 | Fin. | «Eso es el flujo completo.» |

**Opcional, ver la expiración de verdad:** pon `CARRITO_TTL_SEGUNDOS=20` en `.env` y reinicia
el servidor. Agrega un guiso, deja correr la cuenta y a los 20 segundos la tienda avisa que
el carrito expiró y Redis lo borró. Sirve como cierre de la demo o como respuesta en la
defensa. Ojo: con 20 segundos, los pasos de 0:25 a 1:50 no alcanzan (el carrito de A se
borraría antes de confirmar), así que úsalo **después** del flujo principal o quita la
variable para la demo y actívala solo al final.

**Si algo falla:**
- *No conecta a Redis:* revisa la red; mientras, explica la arquitectura con la figura 1 del PDF.
- *Datos raros de un ensayo anterior:* `npm run seed` tarda segundos y deja todo limpio.
- *Se te va el tiempo:* salta el paso de Redis Cloud (1:10) y el de renovar el TTL (0:55).
  No saltes el segundo cliente ni el reinicio: son los que prueban concurrencia y persistencia.

## Defensa técnica (4 a 6 minutos)

Recorre el código en este orden, 30 a 40 segundos por archivo:

1. **`backend/config/redis.js`** — un solo cliente del driver oficial `redis`, creado con
   `REDIS_URL` desde variables de entorno, con manejador de errores. Si falta la variable
   el servidor no arranca, para no conectarse por omisión a localhost.
2. **`backend/config/keys.js`** — el único lugar donde se arman las claves; la convención
   `tm:{entidad}:{id}`.
3. **`backend/models/carritoModel.js`** — `hSet` + `expire` + `ttl`: la consulta
   especializada de TTL.
4. **`backend/models/pedidosModel.js`** — `watch`, `multi`, `exec` y `WatchError`: el
   control de concurrencia. Menciona que `armarPedido` es una función pura con prueba.
5. **`backend/models/guisosModel.js`** — `populares` con el Sorted Set y `remove` limpiando
   índices.

### Preguntas probables y respuesta corta

Verificadas contra el código actual. Más detalle y fuentes en
[investigacion/insumos-pdf.md](investigacion/insumos-pdf.md), sección (d).

1. **¿Por qué Clave-Valor y no SQL?** Leer por clave, expirar, rankear y descontar son
   primitivas de Redis; en SQL la expiración y el ranking siempre ordenado hay que
   construirlos. A cambio pierdo joins, consultas no previstas e integridad referencial, y
   lo compenso desnormalizando el pedido y validando en una sola capa.
2. **¿Quién borra el carrito?** Redis. Al intentar leer una clave vencida y con un muestreo
   periódico de claves con TTL.
3. **¿Agregar un guiso reinicia el TTL?** No solo: `HSET` no toca el TTL. Por eso llamo a
   `EXPIRE` después de cada cambio.
4. **¿Cómo evitas vender de más?** Bloqueo optimista: `WATCH` sobre el carrito y los
   guisos, valido el stock y aplico todo en `MULTI/EXEC`. Si algo cambió en medio, Redis no
   aplica nada, el driver lanza `WatchError` y respondo 409. **No reintento**: el cliente
   vuelve a confirmar.
5. **¿Es ACID? ¿Hay rollback?** Los comandos del `EXEC` corren en serie y aislados, pero no
   hay rollback si uno falla. Por eso valido todo antes de encolar.
6. **¿Por qué una conexión aparte para el checkout?** `WATCH` es por conexión, y el cliente
   compartido atiende otras peticiones al mismo tiempo. Uso `client.duplicate()` y la cierro
   al terminar.
7. **¿El carrito aparta el stock?** No. Se revisa al agregar y se descuenta al confirmar.
   Un apartado real sería otra clave con TTL. Es un límite declarado en el PDF.
8. **¿Por qué no `KEYS tm:guiso:*` para listar?** Recorre toda la base y bloquea el
   servidor. Mantengo el Set `tm:guisos` como índice; el seed usa `SCAN`.
9. **¿Qué pasa si Redis se reinicia?** En el plan gratuito no hay persistencia en disco: se
   podrían perder los datos y se repuebla con el seed. En producción usaría AOF cada segundo.
10. **¿Dónde están las credenciales?** En `.env`, fuera del repositorio; `.env.example`
    documenta las variables. La conexión de la demo va sin TLS; en producción, `rediss://`.
11. **¿Dónde está el cuello de botella?** En la red hacia la nube, no en Redis. Por eso las
    lecturas de varios guisos se lanzan juntas y no una por una.
12. **¿Por qué los items del pedido van en JSON?** Se leen siempre completos, nunca se
    modifican y deben conservar el precio del momento de la compra.

## Ensayo

Cronométralo al menos dos veces completo, con las dos ventanas. Si la demo pasa de 4:00,
recorta lo que dices, no los pasos.
