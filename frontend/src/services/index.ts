import type { AppConfig } from '../config/env'
import { createApiClient } from './apiClient'
import { createDemoHealthService } from './demo/demoHealthService'
import { createApiHealthService, type HealthService } from './healthService'

export interface Services {
  mode: AppConfig['mode']
  health: HealthService
}

/**
 * Crea los servicios según el modo. Las implementaciones demo viven en
 * services/demo/ y nunca se mezclan con las que llaman a la API real.
 */
export function createServices(config: AppConfig, fetchImpl?: typeof fetch): Services {
  if (config.mode === 'demo') {
    return { mode: 'demo', health: createDemoHealthService() }
  }
  const client = createApiClient({
    baseUrl: config.apiBaseUrl,
    timeoutMs: config.apiTimeoutMs,
    fetchImpl,
  })
  return { mode: 'api', health: createApiHealthService(client) }
}
