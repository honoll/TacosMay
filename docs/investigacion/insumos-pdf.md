# Insumos para el PDF de la materia (I3)

Borradores para pegar en las secciones 1, 2 y 4 del PDF (`docs/rubrica.md`). Las fuentes
de Redis se consultaron el **17 de noviembre de 2026**. Todo lo que describe el diseño
sale de `docs/contrato.md`; si el contrato cambia, hay que ajustar aquí.

> **Aviso para coordinación y backend antes de la demo:** el plan gratuito de Redis Cloud
> **no tiene persistencia en disco** (ver sección c). Los datos sobreviven a reiniciar la
> app, que es lo que muestra la demo, pero no hay garantía si el nodo de Redis se
> reinicia. Hay que tener `npm run seed` a la mano y decirlo tal cual en la defensa.

## (a) Introducción y dominio del problema

*(media página, lista para pegar)*

TacosMay nace de las taquerías de una familia mexicana. La idea de negocio es vender sus
guisos ya cocidos, empacados al vacío en porciones y enviados a cualquier parte del país,
para que el cliente solo abra la bolsa, caliente y coma. En México ya hay negocios que
venden comida lista al alto vacío, pero los que venden guisos entregan solo en su ciudad y
todos lo hacen congelado; el envío nacional de referencia tarda de 24 a 48 horas en
hielera con gel refrigerante. El producto es perecedero: cada lote tiene pocas porciones y
una vida útil limitada, así que el inventario es chico, cambia rápido y no se puede vender
dos veces.

La aplicación es la tienda en línea de ese negocio. Un cliente se registra, consulta el
catálogo de guisos y los más vendidos, arma un carrito y confirma su pedido; un
administrador da de alta, edita y da de baja guisos y su existencia. El dominio impone
cuatro necesidades: (1) el catálogo se lee muchísimo más de lo que se escribe; (2) el
carrito es temporal y debe desaparecer solo si el cliente lo abandona, para no dejar
basura ni dar por comprometido producto que nadie compró; (3) la existencia debe
descontarse sin vender de más cuando dos clientes compran la última porción al mismo
tiempo; y (4) el negocio quiere ver en todo momento qué guisos se venden más. Estas cuatro
necesidades son accesos por clave conocida, con expiración y con contadores, y por eso el
proyecto usa el modelo Clave-Valor con Redis en la nube.

*(Los datos del mercado vienen de `mercado.md` y `viabilidad.md`. El menú, los precios y
el nombre real del negocio son `PENDIENTE-CLIENTE`; el seed usa datos de ejemplo.)*

## (b) Justificación del paradigma: Clave-Valor frente a relacional

### Qué pide el dominio y cómo responde cada modelo

| Necesidad | En Redis (diseño del contrato) | En un SGBD relacional | Veredicto |
|---|---|---|---|
| Carrito que expira solo | `tm:carrito:{userId}` es un Hash con TTL de 30 min; `EXPIRE` lo renueva en cada cambio y Redis lo borra sin código nuestro | Columna `expira_en` + filtrar en cada consulta + un proceso programado que borre lo vencido | Redis lo trae en el motor; en SQL hay que construirlo y operarlo |
| Ranking de más vendidos | `tm:guisos:vendidos` es un Sorted Set: `ZINCRBY` al vender, `ZREVRANGE 0 4` para el top 5; siempre está ordenado | `SELECT … SUM(cantidad) GROUP BY guiso ORDER BY … LIMIT 5` sobre el detalle de pedidos, o una tabla resumen mantenida aparte | En Redis la lectura no recalcula nada; en SQL se recalcula o se mantiene un agregado |
| Lecturas de catálogo muy frecuentes | `HGETALL tm:guiso:{id}` por clave, en memoria; el listado usa el Set `tm:guisos` como índice | `SELECT` con índice primario; rápido, pero pasa por parser, planificador y disco o caché | Ambos sirven; Redis es más directo y es justo el caso para el que existe |
| No vender de más (stock perecedero) | `WATCH` sobre el guiso + `MULTI/EXEC`: si alguien cambió el stock entre la lectura y el `EXEC`, la transacción se aborta y se reintenta | `BEGIN; SELECT … FOR UPDATE; UPDATE …; COMMIT;` con una restricción `CHECK (stock >= 0)` | **Aquí gana el relacional**: lo garantiza el motor. En Redis lo garantiza nuestro código |
| Ids consecutivos | `INCR tm:seq:{entidad}`, atómico | `SERIAL` / `AUTO_INCREMENT` | Empate |

Fuentes: expiración y TTL en [EXPIRE](https://redis.io/docs/latest/commands/expire/);
transacciones en [Transactions](https://redis.io/docs/latest/develop/using-commands/transactions/).

### Lo que se pierde, dicho con honestidad

| Se pierde | Consecuencia | Cómo lo resuelve el contrato |
|---|---|---|
| **Joins** | No se puede pedir «pedidos con sus guisos» en una consulta | El pedido guarda `items` como JSON con nombre y precio copiados al momento de la compra. Además de evitar el join, es lo correcto: un pedido no debe cambiar si después cambia el precio. El historial por usuario es la List `tm:pedidos:{userId}` |
| **Consultas ad hoc** | Solo se puede preguntar lo que se diseñó. «Ventas de marzo por guiso» o «clientes que no han vuelto» no tienen clave que las responda | Las preguntas que la app sí hace tienen estructura propia (ranking, pedidos por usuario, índice de guisos). Un reporte nuevo exige una estructura nueva o exportar los datos |
| **Integridad referencial** | Redis no impide borrar un guiso que está en un carrito, ni deja de listarlo solo | Lo cuida la aplicación: al borrar un guiso se quita también de `tm:guisos` y de `tm:guisos:vendidos` en la misma transacción; el carrito y el checkout validan que el guiso exista (`404`) y tenga stock (`409`) |
| **Esquema y tipos** | Un Hash acepta cualquier campo; todo se guarda como texto | Un solo validador en el backend y un solo constructor de claves; la API devuelve «números como números» |
| **Unicidad declarada** | No hay `UNIQUE` | El correo **es** la clave (`tm:user:{email}`): no puede haber dos |
| **Rollback** | Redis no revierte una transacción si un comando falla dentro del `EXEC` | Se valida todo antes de encolar; dentro del `MULTI` solo van comandos que no pueden fallar por tipo |
| **Durabilidad** | En el plan gratuito los datos viven solo en memoria | Se acepta para el proyecto; el seed repuebla. En producción: plan de pago con AOF (sección c) |

Un límite más, que no está en el contrato: **el carrito no aparta stock.** El stock se
revisa al agregar y se descuenta al pagar; entre un momento y otro, otro cliente puede
llevarse la última porción y el checkout responde `409`. Un apartado real sería otra clave
con TTL que reserve unidades. Para el proyecto basta con decirlo; queda como «después».

### Conclusión para pegar

Un SGBD relacional puede hacer todo lo que hace esta aplicación, y a este volumen lo haría
con holgura; el argumento no es de capacidad. Es de ajuste: las cuatro operaciones
centrales del dominio (leer por clave, expirar solo, contar y ordenar por ventas,
descontar con control de concurrencia) son primitivas del motor en Redis, mientras que en
SQL dos de ellas (expiración y ranking siempre ordenado) hay que construirlas encima. El
costo es real y se asume de forma explícita: se renuncia a los joins, a las consultas no
previstas y a que el motor cuide la integridad, y el diseño lo compensa desnormalizando
los pedidos, creando una estructura por cada consulta necesaria y concentrando las
validaciones en una sola capa del backend. Si el negocio creciera hacia reportes,
facturación o pagos, lo razonable sería añadir una base relacional para esos datos y dejar
a Redis el carrito, el ranking y el catálogo en caliente.

## (c) Políticas de persistencia: RDB frente a AOF, y el plan gratuito

Fuente: [Redis persistence](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/).

| | RDB (instantáneas) | AOF (bitácora de escrituras) |
|---|---|---|
| Qué guarda | Una foto compacta de todos los datos cada cierto tiempo | Cada comando de escritura, en orden |
| A favor | Un solo archivo, ideal para respaldos; reinicio más rápido con muchos datos | Más durable; la bitácora solo crece al final y se puede reparar; se reescribe en segundo plano |
| En contra | Si Redis se detiene mal, se pierden los últimos minutos; el `fork` puede pausar a los clientes unos milisegundos | Archivos más grandes; puede ser más lento según la política de `fsync` |
| Cuánto se puede perder | Lo escrito desde la última foto | Con `appendfsync everysec` (la política por defecto), hasta 1 segundo; con `always`, nada, pero es muy lento; con `no`, lo decide el sistema operativo |

La documentación recomienda usar las dos juntas si se quiere una seguridad comparable a
la de PostgreSQL, y dice que RDB sola basta si perder unos minutos es aceptable.

**Redis Cloud, plan gratuito** (fuente: [planes Essentials](https://redis.io/docs/latest/operate/rc/subscriptions/view-essentials-subscription/essentials-plan-details/),
tabla actualizada en diciembre de 2025):

| Límite | Valor |
|---|---|
| Memoria | 30 MB |
| Conexiones simultáneas | 30 |
| Rendimiento máximo | 100 operaciones por segundo |
| Ancho de banda mensual | 5 GB |
| Reglas de acceso por CIDR | 1 |
| **Persistencia** | **No disponible**: «Free Redis Cloud Essentials plans do not support data persistence» ([persistencia en Redis Cloud](https://redis.io/docs/latest/operate/rc/databases/configuration/data-persistence/)) |
| Alta disponibilidad y respaldos | La documentación los menciona solo para planes de pago |

En los planes Essentials de pago se puede elegir AOF cada segundo o instantánea cada 1, 6
o 12 horas; AOF en cada escritura es solo del plan Pro. La persistencia es un ajuste de la
base que se puede cambiar después de crearla (misma fuente).

**Política que conviene declarar en el PDF:** para el proyecto, sin persistencia en disco
(límite del plan gratuito, declarado) y con seed reproducible. Para producción, **AOF cada
segundo**: los pedidos y el stock son dinero, y perder como máximo un segundo es
aceptable; el carrito y el ranking se podrían reconstruir, pero viven en la misma base.

## (d) Diez preguntas probables de la defensa

1. **¿Por qué Clave-Valor y no relacional?**
   Porque las operaciones centrales (leer por clave, expirar, rankear, descontar) son
   primitivas de Redis. Un relacional también podría; aquí dos de ellas habría que
   construirlas. Se pierde joins, consultas ad hoc e integridad referencial, y el diseño
   lo compensa (tabla de la sección b).

2. **¿Cómo expira el carrito y quién lo borra?**
   La clave tiene TTL de 30 minutos y la borra Redis. Lo hace de dos formas: al intentar
   leer una clave vencida, y con un muestreo periódico de claves con TTL. La precisión es
   de 0 a 1 ms ([EXPIRE](https://redis.io/docs/latest/commands/expire/)).

3. **Si agrego un guiso al carrito, ¿se reinicia el TTL?**
   No solo. Modificar un campo con `HSET` deja el TTL intacto; por eso el backend llama a
   `EXPIRE` después de cada cambio. Lo que sí borra el TTL es reemplazar la clave completa
   (`SET`, `DEL`).

4. **¿Cómo evitas vender la última porción dos veces?**
   Con bloqueo optimista: `WATCH` sobre el guiso, leo el stock, y dentro de `MULTI/EXEC`
   descuento, sumo al ranking, creo el pedido y borro el carrito. Si otro cliente modificó
   el guiso entre mi lectura y mi `EXEC`, Redis responde nulo y no aplica nada (en
   node-redis eso llega como un `WatchError`), y se reintenta o se responde `409`.

5. **¿Las transacciones de Redis son ACID? ¿Hay rollback?**
   Son atómicas en el sentido de que los comandos se ejecutan en serie y aislados, sin
   que otro cliente se meta en medio, y si la conexión se cae antes del `EXEC` no se
   ejecuta ninguno. No hay rollback: si un comando falla dentro del `EXEC`, los demás sí
   se ejecutan ([Transactions](https://redis.io/docs/latest/develop/using-commands/transactions/)).
   Por eso se valida antes de encolar.

6. **`WATCH` vigila la clave completa. ¿Qué pasa si el admin cambia el precio durante un checkout?**
   El stock es un campo del Hash `tm:guiso:{id}`, así que cualquier cambio a ese guiso
   aborta la transacción y se reintenta con los datos nuevos. Es un falso conflicto
   ocasional, y aceptable: el cliente termina pagando el precio vigente. También la
   expiración de una clave vigilada cuenta como modificación.

7. **¿Qué consistencia ofrece? ¿Puedo leer un dato viejo?**
   Con una sola base sin réplicas, cada comando ve el resultado del anterior: no hay
   lecturas atrasadas. Lo que no hay es integridad entre claves; esa la mantiene la
   aplicación. La durabilidad es el punto débil: en el plan gratuito no hay persistencia.

8. **¿Por qué es rápido y dónde está el cuello de botella?**
   Los datos están en memoria y cada acceso es por clave. El cuello real es la red hacia
   la nube: cada comando es un viaje de ida y vuelta. Por eso el listado del catálogo lee
   los ids del Set y pide todos los Hashes en un solo envío, no uno por uno. El plan
   gratuito además limita a 100 operaciones por segundo y 30 conexiones.

9. **¿Cómo manejas el driver y la conexión?**
   Driver oficial `redis` (node-redis), un solo cliente compartido creado al arrancar con
   `REDIS_URL` desde variables de entorno, con manejador del evento `error` y reconexión
   automática. Un solo cliente también cuida el límite de 30 conexiones. Las
   transacciones con `WATCH` necesitan una conexión aislada cuando varias peticiones
   comparten el cliente: la guía oficial indica usar `createClientPool` y
   `pool.execute(async client => …)`, y atrapar `WatchError` cuando la clave vigilada
   cambió ([guía de node-redis](https://redis.io/docs/latest/develop/clients/nodejs/transpipe/)).
   *(Verificar contra `backend/` cómo quedó implementado antes de contestarlo así.)*

10. **¿Por qué no usar `KEYS tm:guiso:*` para listar?**
    Porque `KEYS` recorre todas las claves de la base y bloquea el servidor mientras lo
    hace. El Set `tm:guisos` es un índice mantenido a propósito: listar cuesta lo que
    mide el catálogo, no lo que mide la base.

Dos de reserva: **¿qué pasa si Redis se reinicia?** (en el plan gratuito se pueden perder
los datos; se corre el seed; en producción, AOF cada segundo) y **¿por qué `items` va como
JSON dentro del pedido?** (un pedido se lee siempre completo y no debe cambiar si cambia
el guiso).

## PENDIENTE-CLIENTE

- Nombre real del negocio y su historia, para la introducción (hoy dice «una familia mexicana»). `PENDIENTE-CLIENTE`
- Menú y precios reales, para que los ejemplos del PDF no sean de muestra. `PENDIENTE-CLIENTE`
- Cuántas porciones tiene un lote típico y cuánto dura, para dar cifras al argumento del stock perecedero. `PENDIENTE-CLIENTE`
- Cuánto tiempo es razonable que un carrito guarde producto (los 30 minutos son una decisión técnica, no del negocio). `PENDIENTE-CLIENTE`

Pendientes que **no** son del cliente, sino de coordinación y backend: confirmar en el
código las respuestas 6, 8 y 9 (reintento del checkout, lectura en un solo envío y
conexión dedicada para `WATCH`) y que el borrado de un guiso limpie el índice y el ranking.
