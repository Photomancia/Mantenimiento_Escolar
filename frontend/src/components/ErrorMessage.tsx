import { errorToMessage } from '../services/apiClient'

interface ErrorMessageProps {
  error: unknown
  onRetry?: () => void
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <div className="alert alert--error" role="alert">
      <p>{errorToMessage(error)}</p>
      {onRetry && (
        <button type="button" className="button button--secondary" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}
