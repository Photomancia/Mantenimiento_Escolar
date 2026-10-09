import { describe, expect, it } from 'vitest'
import { loadConfig, parseConfig } from './env'

describe('parseConfig', () => {
  it('usa modo api por defecto y elimina la barra final de la URL', () => {
    expect(parseConfig({ VITE_API_BASE_URL: '/api/' })).toEqual({
      mode: 'api',
      apiBaseUrl: '/api',
      apiTimeoutMs: 15000,
    })
  })

  it('acepta URLs absolutas', () => {
    expect(parseConfig({ VITE_API_BASE_URL: 'https://ejemplo.test/api' }).apiBaseUrl).toBe(
      'https://ejemplo.test/api',
    )
  })

  it('exige VITE_API_BASE_URL en modo api', () => {
    expect(() => parseConfig({ VITE_APP_MODE: 'api' })).toThrow(/VITE_API_BASE_URL/)
  })

  it('rechaza URLs sin esquema ni barra inicial', () => {
    expect(() => parseConfig({ VITE_API_BASE_URL: 'ejemplo.test/api' })).toThrow()
  })

  it('rechaza modos desconocidos', () => {
    expect(() => parseConfig({ VITE_APP_MODE: 'prod', VITE_API_BASE_URL: '/api' })).toThrow(
      /VITE_APP_MODE/,
    )
  })

  it('permite el modo demo sin URL de API en desarrollo', () => {
    expect(parseConfig({ VITE_APP_MODE: 'demo' }).mode).toBe('demo')
  })

  it('bloquea el modo demo en producción salvo que se autorice explícitamente', () => {
    expect(() => parseConfig({ VITE_APP_MODE: 'demo', PROD: true })).toThrow(/producción/)
    expect(
      parseConfig({ VITE_APP_MODE: 'demo', PROD: true, VITE_DEMO_EN_PRODUCCION: 'true' }).mode,
    ).toBe('demo')
  })

  it('valida el timeout', () => {
    expect(parseConfig({ VITE_API_BASE_URL: '/api', VITE_API_TIMEOUT_MS: '5000' }).apiTimeoutMs).toBe(5000)
    expect(() => parseConfig({ VITE_API_BASE_URL: '/api', VITE_API_TIMEOUT_MS: 'abc' })).toThrow()
  })
})

describe('loadConfig', () => {
  it('devuelve el error en lugar de lanzarlo', () => {
    expect(loadConfig({})).toEqual({ ok: false, error: expect.stringMatching(/VITE_API_BASE_URL/) })
  })
})
