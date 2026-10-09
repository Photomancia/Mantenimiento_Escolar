import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="card">
      <h1>Página no encontrada</h1>
      <p>
        La página que buscas no existe. <Link to="/">Volver al inicio</Link>
      </p>
    </section>
  )
}
