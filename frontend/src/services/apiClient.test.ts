import { describe, expect, it, vi } from 'vitest'
import { ApiError, createApiClient } from './apiClient'

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function clientWith(fetchImpl: typeof fetch, timeoutMs = 1000) {
  return createApiClient({ baseUrl: '/api', timeoutMs, fetchImpl })
}

async function catchError(p: Promise<unknown>): Promise<ApiError> {
  try {
    await p
  } catch (err) {
    if (err instanceof ApiError) return err
    throw err
  }
  throw new Error('Se esperaba un error')
}

describe('apiClient', () => {
  it('concatena la URL base y devuelve el JSON', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ hola: 'mundo' }))
    const data = await clientWith(fetchImpl).request('/health')
    expect(data).toEqual({ hola: 'mundo' })
    expect(fetchImpl).toHaveBeenCalledWith('/api/health', expect.objectContaining({ method: 'GET' }))
  })

  it('envía el cuerpo como JSON', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ ok: true }, 201))
    await clientWith(fetchImpl).request('/x', { method: 'POST', body: { a: 1 } })
    const init = (fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1]
    expect(init.body).toBe('{"a":1}')
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json')
  })

  it('usa el mensaje y los campos del contrato de error en respuestas 4xx', async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse(
        { error: { code: 'VALIDATION_ERROR', message: 'Datos no válidos', fields: { nombre: 'Obligatorio' } } },
        422,
      ),
    )
    const err = await catchError(clientWith(fetchImpl).request('/x'))
    expect(err.kind).toBe('http')
    expect(err.status).toBe(422)
    expect(err.code).toBe('VALIDATION_ERROR')
    expect(err.message).toBe('Datos no válidos')
    expect(err.fields).toEqual({ nombre: 'Obligatorio' })
  })

  it('no muestra al usuario el mensaje del servidor en errores 5xx', async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({ error: { code: 'INTERNAL', message: 'SQLSTATE[42S02] tabla x' } }, 500),
    )
    const err = await catchError(clientWith(fetchImpl).request('/x'))
    expect(err.status).toBe(500)
    expect(err.message).not.toMatch(/SQLSTATE/)
  })

  it('usa un mensaje genérico si el error no es JSON', async () => {
    const fetchImpl = vi.fn(async () => new Response('<html>Error</html>', { status: 404 }))
    const err = await catchError(clientWith(fetchImpl).request('/x'))
    expect(err.kind).toBe('http')
    expect(err.message).toBe('El recurso solicitado no existe.')
  })

  it('detecta respuestas 200 que no son JSON', async () => {
    const fetchImpl = vi.fn(async () => new Response('<?php echo 1;', { status: 200 }))
    const err = await catchError(clientWith(fetchImpl).request('/x'))
    expect(err.kind).toBe('invalid-response')
  })

  it('convierte fallos de red en ApiError de tipo network', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError('Failed to fetch')
    })
    const err = await catchError(clientWith(fetchImpl).request('/x'))
    expect(err.kind).toBe('network')
  })

  it('cancela la petición al superar el timeout', async () => {
    const fetchImpl = vi.fn(
      (_url: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
        }),
    )
    const err = await catchError(clientWith(fetchImpl as typeof fetch, 20).request('/x'))
    expect(err.kind).toBe('timeout')
  })

  it('devuelve undefined en respuestas 204', async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 204 }))
    await expect(clientWith(fetchImpl).request('/x', { method: 'DELETE' })).resolves.toBeUndefined()
  })
})
