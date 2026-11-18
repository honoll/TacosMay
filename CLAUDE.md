# TacosMay

Guisos de las taquerías de la familia de Alejandro, empacados al vacío y enviados a todo
México: romper la bolsa, calentar y comer. Hoy es el **proyecto final de Bases de Datos
Avanzadas (Anáhuac, 40 % de la materia)**; está hecho para poder crecer a negocio real.

- **Entrega y exposición: semana del 17 al 20 de noviembre de 2026.** Alcance = la rúbrica
  ([docs/rubrica.md](docs/rubrica.md)) y nada más. Lo que no suma puntos se anota en
  `docs/plan/tickets.md` como «después», no se construye.
- **Decisiones tomadas (no se reabren sin Alejandro):** modelo Clave-Valor con **Redis**
  en la nube (Redis Cloud, plan gratis) · driver oficial `redis` (node-redis) · backend
  Node + Express con la estructura de <https://github.com/honoll/2026backA> · frontend
  estático sin build, servido por el mismo Express.
- Sistema del estudio: `C:\estudio\BIBLIA_ECOSISTEMA` (`00-INDICE.md`, `nucleo/AGENTS.md`,
  `MAQUINAS.md`). Este archivo manda en lo particular.

## Un chat por área

| Chat | Carpeta que toca | Qué entrega |
|---|---|---|
| **Coordinación** | `CLAUDE.md`, `docs/contrato.md`, `docs/plan/` | Contrato entre áreas, tickets, integración, PDF final |
| **Backend** | `backend/`, `package.json`, `.env.example`, `README.md` | API + Redis + seed |
| **Frontend** | `frontend/` | La tienda que se usa en la demo en vivo |
| **Investigación** | `docs/investigacion/` | Viabilidad del negocio + insumos para el PDF |

Reglas entre chats:
1. **Cada chat toca solo su carpeta** y commitea solo sus rutas (`git add <su carpeta>`).
   Todos trabajan en `main` del mismo checkout: nada de `git add -A`, nada de cambiar de rama.
2. **[docs/contrato.md](docs/contrato.md) es la frontera** entre backend y frontend (claves
   de Redis y endpoints). Si a un área le estorba, lo propone en
   `docs/plan/tickets.md` → sección «Cambios al contrato»; coordinación lo edita.
3. Estado y pendientes: [docs/plan/tickets.md](docs/plan/tickets.md). Se actualiza al
   terminar cada ticket, con evidencia.

## Reglas de código (pedido expreso de Alejandro)

- **Código que se reusa, no código por escribir código.** Antes de crear una función,
  busca si ya existe una que sirva. Una sola forma de hacer cada cosa: un cliente de
  Redis, un constructor de claves, un validador, un `fetch` en el frontend.
- Lo más simple que cumpla la rúbrica. Sin capas, opciones ni dependencias «por si acaso».
- Credenciales solo por variables de entorno (`.env` ignorado; `.env.example` al día).
  Es criterio de la rúbrica (25 %).
- **Datos del negocio reales o marcados.** El menú, precios y marca reales están
  `PENDIENTE-CLIENTE`; el seed usa datos de ejemplo y lo dice.
  **Excepción (Alejandro, 18-nov-2026):** el inicio es la versión que se le presenta a la
  familia, así que puede llevar contenido de muestra inventado (cocineros, instalaciones,
  tiempos, preguntas frecuentes). Lo real se queda real, nada inventado se atribuye a
  familiares reales, y todo lo inventado se lista en `docs/negocio/contenido-de-muestra.md`
  y se marca con `data-muestra` para sustituirlo. La excepción no cubre la tienda, el
  backend ni el sistema de pedidos.
- Docs y commits en español; identificadores en inglés salvo datos de negocio
  (`guisos`, `precio_centavos`). Commits convencionales, **sin firma de IA**. Push al terminar.
- «Listo» = lo corriste contra Redis en la nube y pegas la salida. Si no pudiste, dilo.
