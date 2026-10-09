/**
 * Tipos compartidos con el contrato de API.
 * Fuente: backend-changes/base-api/api-contract.md
 */

/** Formato estándar de error que devuelve el backend. */
export interface ApiErrorBody {
  error: {
    code: string
    message: string
    /** Errores de validación por campo (opcional). */
    fields?: Record<string, string>
  }
}

/** Respuesta de GET /health. */
export interface HealthResponse {
  status: 'ok' | 'degraded'
  service: string
  version: string
  database: 'ok' | 'unavailable'
  timestamp: string
}
