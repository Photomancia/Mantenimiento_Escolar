import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { createServices } from './services'
import { ServicesProvider } from './services/ServicesProvider'

function renderApp(services: ReturnType<typeof createServices>, path = '/') {
  return render(
    <ServicesProvider services={services}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </ServicesProvider>,
  )
}

const apiConfig = { mode: 'api' as const, apiBaseUrl: '/api', apiTimeoutMs: 1000 }

describe('App', () => {
  it('en modo demo muestra el aviso y no llama a ninguna API', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    renderApp(createServices({ mode: 'demo', apiBaseUrl: '', apiTimeoutMs: 1000 }))

    expect(screen.getByText('MODO DEMO')).toBeInTheDocument()
    expect(await screen.findByText(/no consulta ningún servidor/)).toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
    fetchSpy.mockRestore()
  })

  it('en modo api muestra el estado devuelto por /health', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({
          status: 'ok',
          service: 'mantenimiento-escolar-api',
          version: '0.1.0',
          database: 'ok',
          timestamp: '2026-10-09T08:00:00Z',
        }),
        { status: 200 },
      ),
    )
    renderApp(createServices(apiConfig, fetchImpl))

    expect(await screen.findByText('Conectada')).toBeInTheDocument()
    expect(screen.getByText('Disponible')).toBeInTheDocument()
    expect(screen.queryByText('MODO DEMO')).not.toBeInTheDocument()
  })

  it('muestra un error y permite reintentar si la API no responde', async () => {
    const fetchImpl = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ status: 'degraded', service: 's', version: '0.1.0', database: 'unavailable', timestamp: '' }),
          { status: 200 },
        ),
      )
    renderApp(createServices(apiConfig, fetchImpl))

    expect(await screen.findByRole('alert')).toHaveTextContent(/No se pudo conectar/)
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByText('No disponible')).toBeInTheDocument()
  })

  it('navega a la página de asistencia y muestra que está pendiente', async () => {
    renderApp(createServices({ mode: 'demo', apiBaseUrl: '', apiTimeoutMs: 1000 }))
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    await userEvent.click(within(nav).getByRole('link', { name: 'Asistencia' }))
    expect(screen.getByRole('heading', { name: 'Asistencia' })).toBeInTheDocument()
    expect(screen.getByText('Módulo pendiente')).toBeInTheDocument()
  })

  it('muestra la página 404 para rutas desconocidas', () => {
    renderApp(createServices({ mode: 'demo', apiBaseUrl: '', apiTimeoutMs: 1000 }), '/no-existe')
    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument()
  })
})
