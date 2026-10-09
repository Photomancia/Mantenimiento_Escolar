import { Link } from 'react-router-dom'
import { ApiStatusCard } from '../components/ApiStatusCard'

export function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>Asistencia escolar</h1>
        <p>Registro y consulta de la asistencia diaria de los alumnos.</p>
      </section>

      <div className="grid">
        <section className="card" aria-labelledby="modules-title">
          <h2 id="modules-title">Módulos</h2>
          <ul className="module-list">
            <li>
              <Link to="/asistencia">Asistencia</Link>
              <span className="badge badge--warning">En preparación</span>
            </li>
          </ul>
        </section>
        <ApiStatusCard />
      </div>
    </>
  )
}
