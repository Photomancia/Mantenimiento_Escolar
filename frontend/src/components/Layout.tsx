import { NavLink, Outlet } from 'react-router-dom'
import { useServices } from '../hooks/useServices'
import { DemoBanner } from './DemoBanner'

export function Layout() {
  const { mode } = useServices()

  return (
    <div className="layout">
      {mode === 'demo' && <DemoBanner />}
      <header className="header">
        <div className="container header__inner">
          <NavLink to="/" className="brand">
            Mantenimiento Escolar
          </NavLink>
          <nav aria-label="Principal">
            <ul className="nav">
              <li>
                <NavLink to="/" end>
                  Inicio
                </NavLink>
              </li>
              <li>
                <NavLink to="/asistencia">Asistencia</NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">Mantenimiento Escolar · Gestión de asistencia escolar</div>
      </footer>
    </div>
  )
}
