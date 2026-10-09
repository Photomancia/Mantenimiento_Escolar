# Paquete `asistencia` — Análisis previo (sin implementar)

**Estado:** ANÁLISIS. No hay código PHP ni SQL todavía.
**Motivo:** las reglas del proyecto impiden crear tablas de negocio definitivas antes de definir la funcionalidad. Este documento recoge lo que falta decidir y una **propuesta preliminar** de endpoints para discutir con el equipo.

## Endpoints que el frontend necesitará y que NO existen

| Necesidad | Endpoint propuesto (borrador) | Estado |
|---|---|---|
| Iniciar y cerrar sesión de docentes o personal | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | No existe |
| Obtener el token CSRF | `GET /auth/csrf` (o incluido en `/auth/me`) | No existe |
| Listar los grupos o cursos del usuario | `GET /grupos` | No existe |
| Listar los alumnos de un grupo | `GET /grupos/{id}/alumnos` | No existe |
| Consultar la asistencia de un grupo en una fecha | `GET /grupos/{id}/asistencia?fecha=YYYY-MM-DD` | No existe |
| Guardar la asistencia del día | `PUT /grupos/{id}/asistencia?fecha=YYYY-MM-DD` | No existe |
| Firmas (si se requieren) | Por definir: almacenamiento privado y descarga autenticada | No existe |

Mientras no existan, la pantalla de asistencia del frontend muestra "Módulo pendiente". **Ninguna operación se presenta como guardada.**

## Preguntas abiertas para el equipo

1. **Usuarios y roles:** ¿quién usa la aplicación (docentes, dirección, administración, familias)? ¿Qué puede ver y hacer cada rol?
2. **Autenticación:** ¿sesión PHP con cookie (recomendado si el frontend y la API están en el mismo dominio) o tokens? ¿Existe ya un sistema de usuarios?
3. **Estados de asistencia:** ¿presente / ausente / tarde / justificado? ¿Hace falta registrar la hora o un motivo?
4. **Firmas:** ¿qué se firma (entrada y salida del niño, justificantes) y quién firma (familia, docente)? ¿Imagen o trazo vectorial?
5. **Estructura escolar:** ¿cursos, grupos, aulas, turnos? ¿Un alumno puede estar en varios grupos?
6. **Edición:** ¿se puede modificar la asistencia de días pasados? ¿Hace falta registro de auditoría (quién cambió qué y cuándo)?
7. **Retención de datos:** ¿cuánto tiempo se conservan los registros y las firmas?
8. **Normativa:** al tratarse de datos de menores, confirmar los requisitos legales de protección de datos aplicables al centro.

## Requisitos de seguridad ya definidos

- Autenticación obligatoria en todos los endpoints con datos de alumnos.
- Autorización **en el backend**: un docente solo accede a sus grupos. La interfaz no es una garantía de permisos.
- Protección CSRF en todas las operaciones que modifican datos (`POST/PUT/PATCH/DELETE`), mediante la cabecera `X-CSRF-Token`.
- Cookies de sesión `HttpOnly`, `Secure` y `SameSite=Lax` o `Strict`.
- Las firmas y los archivos privados se guardan **fuera de `public_html`** y solo se sirven mediante un endpoint autenticado. Nunca mediante URLs públicas.
- Mensajes de error sin datos personales ni detalles internos.
- Validación completa en PHP con consultas preparadas, independiente de la validación del frontend.

## Siguiente paso

Cuando el equipo responda a las preguntas, este paquete se completará con:

```
asistencia/
├── README.md
├── api-contract.md          # contrato definitivo
├── php/                     # handlers y utilidades de autenticación
├── sql/                     # 001_..., 002_... con verificación y reversión
├── tests/
└── deployment-checklist.md
```
