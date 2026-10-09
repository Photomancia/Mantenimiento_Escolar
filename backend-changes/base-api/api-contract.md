# Contrato de API — Base

**Estado:** propuesto. El código PHP de este paquete lo implementa, pero **no está publicado** en Hostinger.
**Versión del contrato:** 0.1.0

## Convenciones generales (aplican a todos los módulos)

| Aspecto | Regla |
|---|---|
| URL base | `/api` en el mismo dominio que el frontend (configurable en el frontend con `VITE_API_BASE_URL`). |
| Formato | JSON UTF-8 en peticiones y respuestas. `Content-Type: application/json; charset=utf-8`. |
| Fechas | Fechas: `YYYY-MM-DD`. Fecha y hora: ISO 8601 en UTC (`2026-10-09T08:00:00Z`). |
| Identificadores | Enteros positivos. |
| Caché | Las respuestas llevan `Cache-Control: no-store`. |
| Errores | Siempre con el formato estándar (ver abajo). Nunca trazas, SQL ni rutas del servidor. |
| Autenticación | **Pendiente de definir** (ver `backend-changes/asistencia/README.md`). `GET /health` es público. |

### Formato estándar de error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Revisa los datos introducidos.",
    "fields": { "fecha": "La fecha es obligatoria." }
  }
}
```

- `code`: identificador estable en MAYÚSCULAS para que el frontend decida qué hacer.
- `message`: texto en español apto para mostrar al usuario. Sin datos internos.
- `fields`: opcional, solo en errores de validación (422).

### Códigos HTTP y códigos de error comunes

| HTTP | `code` | Cuándo |
|---|---|---|
| 400 | `BAD_REQUEST` | JSON mal formado o parámetros imposibles de interpretar. |
| 401 | `UNAUTHENTICATED` | Sin sesión válida. |
| 403 | `FORBIDDEN` | Sesión válida pero sin permiso para el recurso. |
| 404 | `NOT_FOUND` | Ruta o recurso inexistente. |
| 405 | `METHOD_NOT_ALLOWED` | Método no soportado en la ruta. Incluye la cabecera `Allow`. |
| 409 | `CONFLICT` | Choca con datos existentes (p. ej. registro duplicado). |
| 422 | `VALIDATION_ERROR` | Datos con formato correcto pero valores no válidos. Incluye `fields`. |
| 500 | `INTERNAL_ERROR` | Error inesperado. El detalle solo va al log del servidor. |
| 503 | `SERVICE_UNAVAILABLE` | Servicio temporalmente no disponible. |

El frontend **no** muestra el `message` de los errores 5xx: siempre usa un texto genérico.

---

## `GET /health`

Comprueba que la API responde y si puede conectar con la base de datos.

- **Permisos:** público. No devuelve datos personales.
- **Parámetros:** ninguno.
- **Cuerpo de entrada:** ninguno.

### Respuesta `200 OK`

| Campo | Tipo | Descripción |
|---|---|---|
| `status` | `"ok"` \| `"degraded"` | `degraded` si la base de datos no está disponible. |
| `service` | string | Siempre `"mantenimiento-escolar-api"`. |
| `version` | string | Versión del backend. |
| `database` | `"ok"` \| `"unavailable"` | Resultado de `SELECT 1`. No incluye el motivo del fallo. |
| `timestamp` | string | Hora del servidor en ISO 8601 UTC. |

Se responde `200` también cuando la base de datos falla, para que el frontend pueda mostrar el estado. El motivo real se escribe en el log de PHP.

### Ejemplos (ficticios)

```http
GET /api/health HTTP/1.1
Accept: application/json
```

```json
{
  "status": "ok",
  "service": "mantenimiento-escolar-api",
  "version": "0.1.0",
  "database": "ok",
  "timestamp": "2026-10-09T08:00:00Z"
}
```

Base de datos caída:

```json
{
  "status": "degraded",
  "service": "mantenimiento-escolar-api",
  "version": "0.1.0",
  "database": "unavailable",
  "timestamp": "2026-10-09T08:00:00Z"
}
```

### Errores

| HTTP | `code` | Caso |
|---|---|---|
| 405 | `METHOD_NOT_ALLOWED` | Método distinto de `GET` (por ejemplo `POST /health`). |
| 500 | `INTERNAL_ERROR` | Fallo inesperado de PHP. |

### Uso en el frontend

`frontend/src/services/healthService.ts` → tarjeta "Estado del servidor" de la página de inicio.
