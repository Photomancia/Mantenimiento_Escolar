const ETIQUETAS = { ausente: 'Sin ingresar', presente: 'En la escuela', retirado: 'Retirado' }
const CLASES = { ausente: 'neutral', presente: 'info', retirado: 'ok' }

export default function Panel({ ninos, padres, bitacora }) {
  const contar = (e) => ninos.filter((n) => n.estado === e).length

  return (
    <>
      <div className="stats">
        <div className="stat"><span>{ninos.length}</span>Alumnos</div>
        <div className="stat"><span>{contar('presente')}</span>En la escuela</div>
        <div className="stat"><span>{contar('retirado')}</span>Retirados</div>
        <div className="stat"><span>{bitacora.length}</span>Incidentes</div>
      </div>
      <section className="card">
        <h2>Estado de alumnos</h2>
        <table className="tabla">
          <thead><tr><th>Alumno</th><th>Grado</th><th>Padre / tutor</th><th>Medicamentos</th><th>Entrada</th><th>Salida</th><th>Estado</th></tr></thead>
          <tbody>
            {ninos.map((n) => (
              <tr key={n.id}>
                <td>{n.nombre}</td>
                <td>{n.grado}</td>
                <td>{padres.find((p) => p.id === n.padreId)?.nombre}</td>
                <td>{n.historialMedico ? <span className="badge warn" title={n.historialMedico}>💊 Sí</span> : <span className="muted">No</span>}</td>
                <td>{n.entrada ?? '—'}</td>
                <td>{n.salida ?? '—'}</td>
                <td><span className={`badge ${CLASES[n.estado]}`}>{ETIQUETAS[n.estado]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
