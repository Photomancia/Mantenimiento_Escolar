import { useServices } from '../hooks/useServices'
import { useAsync } from '../hooks/useAsync'
import { ErrorMessage } from './ErrorMessage'
import { LoadingState } from './LoadingState'

export function ApiStatusCard() {
  const { health } = useServices()
  const { state, reload } = useAsync(health.check)

  return (
    <section className="card" aria-labelledby="api-status-title">
      <h2 id="api-status-title">Estado del servidor</h2>
      {state.status === 'loading' && <LoadingState label="Comprobando conexión…" />}
      {state.status === 'error' && <ErrorMessage error={state.error} onRetry={reload} />}
      {state.status === 'success' && state.data.source === 'demo' && (
        <p className="badge badge--warning">
          Sin backend: la aplicación funciona en modo demo y no consulta ningún servidor.
        </p>
      )}
      {state.status === 'success' && state.data.source === 'api' && (
        <dl className="status-list">
          <div>
            <dt>API</dt>
            <dd>
              <span className={state.data.data.status === 'ok' ? 'badge badge--ok' : 'badge badge--warning'}>
                {state.data.data.status === 'ok' ? 'Conectada' : 'Con incidencias'}
              </span>
            </dd>
          </div>
          <div>
            <dt>Base de datos</dt>
            <dd>
              <span className={state.data.data.database === 'ok' ? 'badge badge--ok' : 'badge badge--error'}>
                {state.data.data.database === 'ok' ? 'Disponible' : 'No disponible'}
              </span>
            </dd>
          </div>
          <div>
            <dt>Versión</dt>
            <dd>{state.data.data.version}</dd>
          </div>
        </dl>
      )}
    </section>
  )
}
