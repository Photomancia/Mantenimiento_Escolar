/**
 * Configuración del frontend leída de variables de entorno de Vite.
 *
 * IMPORTANTE: todas las variables VITE_* se incrustan en el JavaScript que
 * descarga el navegador. Nunca deben contener contraseñas, tokens ni
 * credenciales de base de datos.
 */

export type AppMode = 'api' | 'demo'

export interface AppConfig {
  /** 'api' consume el backend PHP real; 'demo' usa datos ficticios locales. */
  mode: AppMode
  /** URL base de la API, sin barra final. Ej.: "/api" o "https://dominio.com/api". */
  apiBaseUrl: string
  /** Tiempo máximo de espera de cada petición HTTP, en milisegundos. */
  apiTimeoutMs: number
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigError'
  }
}

export interface RawEnv {
  VITE_APP_MODE?: string
  VITE_API_BASE_URL?: string
  VITE_API_TIMEOUT_MS?: string
  VITE_DEMO_EN_PRODUCCION?: string
  PROD?: boolean
}

const DEFAULT_TIMEOUT_MS = 15000

/** Valida y normaliza la configuración. Lanza ConfigError si es inválida. */
export function parseConfig(env: RawEnv): AppConfig {
  const rawMode = (env.VITE_APP_MODE ?? 'api').trim().toLowerCase()
  if (rawMode !== 'api' && rawMode !== 'demo') {
    throw new ConfigError(
      `VITE_APP_MODE tiene un valor no válido ("${rawMode}"). Usa "api" o "demo".`,
    )
  }
  const mode: AppMode = rawMode

  // El modo demo nunca debe activarse en producción por accidente.
  if (mode === 'demo' && env.PROD && env.VITE_DEMO_EN_PRODUCCION !== 'true') {
    throw new ConfigError(
      'El modo demo está activado en una compilación de producción. ' +
        'Si es intencionado, define VITE_DEMO_EN_PRODUCCION=true.',
    )
  }

  const apiBaseUrl = (env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '')
  if (mode === 'api' && apiBaseUrl === '') {
    throw new ConfigError(
      'Falta VITE_API_BASE_URL. Configúrala en frontend/.env.local (ver .env.example).',
    )
  }
  if (apiBaseUrl !== '' && !/^(\/|https?:\/\/)/.test(apiBaseUrl)) {
    throw new ConfigError(
      'VITE_API_BASE_URL debe empezar por "/", "http://" o "https://".',
    )
  }

  let apiTimeoutMs = DEFAULT_TIMEOUT_MS
  if (env.VITE_API_TIMEOUT_MS) {
    apiTimeoutMs = Number(env.VITE_API_TIMEOUT_MS)
    if (!Number.isInteger(apiTimeoutMs) || apiTimeoutMs <= 0) {
      throw new ConfigError('VITE_API_TIMEOUT_MS debe ser un entero positivo.')
    }
  }

  return { mode, apiBaseUrl, apiTimeoutMs }
}

export type ConfigResult =
  | { ok: true; config: AppConfig }
  | { ok: false; error: string }

export function loadConfig(env: RawEnv = import.meta.env): ConfigResult {
  try {
    return { ok: true, config: parseConfig(env) }
  } catch (err) {
    if (err instanceof ConfigError) return { ok: false, error: err.message }
    throw err
  }
}
