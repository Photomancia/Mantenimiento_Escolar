import { useCallback, useEffect, useState } from 'react'

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: unknown }

/**
 * Ejecuta una función asíncrona al montar el componente y expone su estado
 * (cargando / éxito / error) junto con `reload` para reintentar.
 * La petición en curso se cancela al desmontar.
 */
export function useAsync<T>(fn: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fn(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setState({ status: 'success', data })
      },
      (error: unknown) => {
        if (!controller.signal.aborted) setState({ status: 'error', error })
      },
    )
    return () => controller.abort()
  }, [fn, attempt])

  const reload = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }, [])
  return { state, reload }
}
