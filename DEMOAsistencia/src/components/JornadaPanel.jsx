import { useState } from 'react'
import { TIPOS_INCIDENTE } from '../data.js'

export default function JornadaPanel({ ninos, padres, bitacora, onIncidente }) {
  const presentes = ninos.filter((n) => n.estado === 'presente')
  const [ninoId, setNinoId] = useState('')
  const [tipo, setTipo] = useState(TIPOS_INCIDENTE[0])
  const [descripcion, setDescripcion] = useState('')
  const [mensaje, setMensaje] = useState(null)

  const registrar = (e) => {
    e.preventDefault()
    if (!ninoId || !descripcion.trim()) {
      return setMensaje({ tipo: 'error', texto: 'Seleccione un niño y describa el incidente.' })
    }
    onIncidente({ ninoId, tipo, descripcion: descripcion.trim() })
    const nino = ninos.find((n) => n.id === ninoId)
    const padre = padres.find((p) => p.id === nino.padreId)
    setMensaje({ tipo: 'ok', texto: `Incidente registrado en bitácora. Notificación enviada a ${padre.nombre} (${padre.telefono}).` })
    setNinoId(''); setDescripcion('')
  }

  return (
    <div className="columnas">
      <section className="card">
        <h2>Transcurso de jornada</h2>
        <p className="muted">{presentes.length} alumno(s) en la escuela.</p>
        <ul className="lista">
          {presentes.map((n) => {
            const incidentes = bitacora.filter((i) => i.ninoId === n.id).length
            return (
              <li key={n.id}>
                <div>
                  <strong>{n.nombre}</strong>
                  <span className="muted"> · {n.grado} · entrada {n.entrada}</span>
                </div>
                {incidentes > 0
                  ? <span className="badge warn">{incidentes} incidente(s)</span>
                  : <span className="badge ok">Sin novedades</span>}
              </li>
            )
          })}
          {!presentes.length && <li className="muted">No hay alumnos en la escuela.</li>}
        </ul>
      </section>

      <section className="card">
        <h2>¿Ocurrió algún incidente?</h2>
        <p className="muted">Registrar en bitácora y notificar a los padres.</p>
        {mensaje && <div className={`alerta ${mensaje.tipo}`}>{mensaje.texto}</div>}
        <form onSubmit={registrar} className="bloque">
          <label>
            Alumno
            <select value={ninoId} onChange={(e) => setNinoId(e.target.value)}>
              <option value="">Seleccionar…</option>
              {presentes.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}
            </select>
          </label>
          <label>
            Tipo de incidente
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {TIPOS_INCIDENTE.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label>
            Descripción
            <textarea rows={4} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Describa lo ocurrido…" />
          </label>
          <div className="acciones">
            <button className="btn btn-warn" type="submit">Registrar y notificar</button>
          </div>
        </form>
      </section>
    </div>
  )
}
