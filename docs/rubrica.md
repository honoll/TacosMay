# Rúbrica — Desarrollo e Integración de Aplicaciones con Bases de Datos NoSQL en la Nube

Proyecto final individual de Bases de Datos Avanzadas (SIS 2404). Resumen fiel del enunciado.

## Requisitos técnicos
- Un solo paradigma: Clave-Valor (Redis Cloud, DynamoDB, Upstash, Cosmos Table) **o**
  Grafo (Neo4j AuraDB, Neptune, Memgraph). → Elegido: **Clave-Valor, Redis Cloud**.
- La base debe estar en un servicio administrado en la nube. **No se acepta localhost
  durante la evaluación.**
- Cualquier lenguaje, con el **SDK/driver oficial** del motor.
- Operaciones mínimas: **CRUD completo** + consultas propias del paradigma (para
  Clave-Valor: **TTL/expiración** o **estructuras compuestas**).

## Entregables
**A. PDF de diseño y justificación**, con esta estructura obligatoria:
1. Introducción y dominio del problema (caso de uso y contexto funcional).
2. Justificación del paradigma: por qué Clave-Valor y no un SGBD relacional.
3. Arquitectura: diagrama de bloques (Cliente/Backend, SDK de conexión, base en la nube).
4. Diseño del modelo NoSQL: convención de nombres de claves (namespaces), estructuras de
   los valores (Hashes, Sets, Lists, JSON), estrategias de TTL y políticas de persistencia.
5. Catálogo de consultas: código sintácticamente correcto de las consultas clave.

**B. Código fuente** (repo de GitHub o zip): modular, limpio y documentado; `README.md`
con requerimientos, instalación y ejecución; **script de seed** para poblar la base.

## Examen: 8 a 10 minutos
- **Demo en vivo (4 min):** la app conectada en tiempo real a la nube, flujo completo y
  persistencia de datos.
- **Defensa técnica (4–6 min):** código de integración, consultas y arquitectura; preguntas
  sobre decisiones de diseño, manejo del driver, consistencia y rendimiento.

## Ponderación
| Criterio | % |
|---|---|
| Justificación del modelo (rigor frente al relacional) | 15 |
| Diseño NoSQL (claves/valores según buenas prácticas del motor) | 20 |
| Código e integración cloud (calidad, uso del SDK, conexión estable, credenciales por variables de entorno) | 25 |
| Documentación técnica (estructura del PDF, diagramas, consultas) | 20 |
| Exposición y defensa | 20 |
