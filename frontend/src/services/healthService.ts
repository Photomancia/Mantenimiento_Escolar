import type { HealthResponse } from '../types/api'
import type { ApiClient } from './apiClient'

/**
 * Resultado de la comprobación de estado. `source` indica de dónde proviene:
 * en modo demo NO se consulta ningún servidor y la interfaz debe decirlo.
 */
export type HealthCheckResult =
  | { source: 'api'; data: HealthResponse }
  | { source: 'demo' }

export interface HealthService {
  check(signal?: AbortSignal): Promise<HealthCheckResult>
}

/** Implementación real: GET {API}/health (contrato en backend-changes/base-api). */
export function createApiHealthService(client: ApiClient): HealthService {
  return {
    async check(signal) {
      const data = await client.request<HealthResponse>('/health', { signal })
      return { source: 'api', data }
    },
  }
}
