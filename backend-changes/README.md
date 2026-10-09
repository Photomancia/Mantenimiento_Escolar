# Cambios de backend propuestos (implementación manual)

Esta carpeta contiene **propuestas** de cambios en PHP y MySQL/MariaDB para que el equipo las revise e implemente **a mano**.

- Nada de lo que hay aquí está publicado en Hostinger.
- Ningún script SQL se ha ejecutado contra producción.
- Esta carpeta **no** es el backend en producción: es un paquete de entrega.

## Paquetes

| Paquete | Estado | Requiere PHP | Requiere SQL | Descripción |
|---|---|---|---|---|
| [`base-api/`](base-api/) | Propuesto, probado en local | Sí | No | Estructura de la API y `GET /health`. |
| [`asistencia/`](asistencia/) | Análisis, sin código | Pendiente | Pendiente | Necesidades y preguntas abiertas del módulo de asistencia. |

## Estructura de cada paquete

Ver [`_plantilla/README.md`](_plantilla/README.md). Solo se crean los archivos que la funcionalidad necesita.

```
<paquete>/
├── README.md                # qué hace, archivos, destinos, variables, riesgos
├── api-contract.md          # contrato de los endpoints
├── php/                     # archivos PHP completos
├── sql/                     # scripts numerados: 001_..., 002_...
├── tests/                   # comprobaciones reproducibles
└── deployment-checklist.md  # pasos manuales de publicación y reversión
```

## Reglas

1. El frontend **no** se considera integrado con una funcionalidad hasta que el backend correspondiente esté publicado y verificado.
2. Sin credenciales reales en ningún archivo. Solo plantillas `*.example.php`.
3. PHP con PDO y consultas preparadas. Errores sin información sensible.
4. Cada script SQL indica en su cabecera: orden, tablas afectadas, dependencias, si se puede repetir, si requiere mantenimiento y el riesgo de su reversión.
