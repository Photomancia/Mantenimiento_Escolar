import type { ApiErrorBody } from '../types/api'

/** Tipos de fallo que la interfaz distingue. */
export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'invalid-response'

/**
 * Error normalizado de la API. `message` es siempre un texto apto para
 * mostrar al usuario: nunca contiene trazas ni detalles internos del servidor.
 */
export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status?: number
  readonly code?: string
  readonly fields?: Record<string, string>

  constructor(
    kind: ApiErrorKind,
    message: string,
    opts: { status?: number; code?: string; fields?: Record<string, string> } = {},
  ) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = opts.status
    this.code = opts.code
    this.fields = opts.fields
  }
}

export interface ApiClientOptions {
  baseUrl: string
  timeoutMs: number
  fetchImpl?: typeof fetch
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
}

const GENERIC_MESSAGES: Record<number, string> = {
  400: 'La solicitud no es válida.',
  401: 'Tu sesión no es válida o ha caducado. Inicia sesión de nuevo.',
  403: 'No tienes permiso para realizar esta acción.',
  404: 'El recurso solicitado no existe.',
  409: 'La operación entra en conflicto con datos existentes.',
  422: 'Revisa los datos introducidos.',
  429: 'Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.',
  503: 'El servicio no está disponible temporalmente.',
}

function messageForStatus(status: number): string {
  return GENERIC_MESSAGES[status] ?? (status >= 500
    ? 'Error del servidor. Inténtalo más tarde.'
    : 'No se pudo completar la solicitud.')
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== 'object' || value === null) return false
  const err = (value as { error?: unknown }).error
  return (
    typeof err === 'object' &&
    err !== null &&
    typeof (err as { code?: unknown }).code === 'string' &&
    typeof (err as { message?: unknown }).message === 'string'
  )
}

export function createApiClient({ baseUrl, timeoutMs, fetchImpl }: ApiClientOptions) {
  const doFetch = fetchImpl ?? ((...args: Parameters<typeof fetch>) => fetch(...args))

  async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
    const controller = new AbortController()
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, timeoutMs)
    const onExternalAbort = () => controller.abort()
    opts.signal?.addEventListener('abort', onExternalAbort)

    const headers: Record<string, string> = { Accept: 'application/json' }
    if (opts.body !== undefined) headers['Content-Type'] = 'application/json'

    let response: Response
    try {
      response = await doFetch(`${baseUrl}${path}`, {
        method: opts.method ?? 'GET',
        headers,
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
        // Envía la cookie de sesión del backend (mismo dominio).
        credentials: 'same-origin',
        signal: controller.signal,
      })
    } catch (err) {
      if (timedOut) {
        throw new ApiError('timeout', 'El servidor tardó demasiado en responder.')
      }
      if (opts.signal?.aborted) throw err
      throw new ApiError(
        'network',
        'No se pudo conectar con el servidor. Comprueba tu conexión.',
      )
    } finally {
      clearTimeout(timer)
      opts.signal?.removeEventListener('abort', onExternalAbort)
    }

    if (response.status === 204) return undefined as T

    let data: unknown
    try {
      data = await response.json()
    } catch {
      if (response.ok) {
        throw new ApiError('invalid-response', 'El servidor devolvió una respuesta no válida.', {
          status: response.status,
        })
      }
      throw new ApiError('http', messageForStatus(response.status), { status: response.status })
    }

    if (!response.ok) {
      // El mensaje del backend solo se usa si respeta el contrato de error;
      // los errores 5xx muestran siempre un texto genérico.
      if (isApiErrorBody(data)) {
        const message = response.status >= 500 ? messageForStatus(response.status) : data.error.message
        throw new ApiError('http', message, {
          status: response.status,
          code: data.error.code,
          fields: data.error.fields,
        })
      }
      throw new ApiError('http', messageForStatus(response.status), { status: response.status })
    }

    return data as T
  }

  return { request }
}

export type ApiClient = ReturnType<typeof createApiClient>

/** Devuelve un mensaje seguro para el usuario a partir de cualquier error. */
export function errorToMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  return 'Ha ocurrido un error inesperado.'
}
