export default function Bitacora({ bitacora, movimientos, ninos, padres }) {
  const nombreNino = (id) => ninos.find((n) => n.id === id)?.nombre ?? '—'
  const nombrePadre = (id) => padres.find((p) => p.id === id)?.nombre ?? '—'

  return (
    <div className="columnas">
      <section className="card">
        <h2>Bitácora de incidentes</h2>
        <table className="tabla">
          <thead><tr><th>Hora</th><th>Alumno</th><th>Tipo</th><th>Descripción</th><th>Padres</th></tr></thead>
          <tbody>
            {bitacora.map((i) => (
              <tr key={i.id}>
                <td>{i.hora}</td>
                <td>{nombreNino(i.ninoId)}</td>
                <td><span className="badge warn">{i.tipo}</span></td>
                <td>{i.descripcion}</td>
                <td>{i.notificado ? <span className="badge ok">Notificado</span> : 'Pendiente'}</td>
              </tr>
            ))}
            {!bitacora.length && <tr><td colSpan={5} className="muted">Sin incidentes registrados.</td></tr>}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>Registro de entradas y salidas</h2>
        <table className="tabla">
          <thead><tr><th>Hora</th><th>Movimiento</th><th>Alumno</th><th>Padre / tutor</th><th>Firma</th></tr></thead>
          <tbody>
            {[...movimientos].reverse().map((m) => (
              <tr key={m.id}>
                <td>{m.hora}</td>
                <td><span className={`badge ${m.tipo === 'Entrada' ? 'info' : 'ok'}`}>{m.tipo}</span></td>
                <td>{nombreNino(m.ninoId)}</td>
                <td>{nombrePadre(m.padreId)}</td>
                <td>{m.firma ? <img src={m.firma} alt="firma" className="mini-firma" /> : <span className="muted">registrada</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
