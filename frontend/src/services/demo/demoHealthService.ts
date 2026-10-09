import type { HealthService } from '../healthService'

/**
 * Implementación de demostración. No contacta con ningún backend ni simula
 * que exista uno: devuelve explícitamente `source: 'demo'`.
 */
export function createDemoHealthService(): HealthService {
  return {
    async check() {
      return { source: 'demo' }
    },
  }
}
