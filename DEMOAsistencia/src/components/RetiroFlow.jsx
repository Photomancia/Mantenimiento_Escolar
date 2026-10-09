import { useState } from 'react'
import Pasos from './Pasos.jsx'
import FirmaPad from './FirmaPad.jsx'
import { horaActual } from '../data.js'

const PASOS = ['Padre retira al niño', 'Hora de salida', 'Firma de retiro', 'Verificar estado', 'Retiro exitoso']
const CHEQUEOS = [
  'El niño se encuentra en buen estado físico',
  'Se entregan mochila y pertenencias',
  'El padre fue informado de las novedades del día',
]

export default function RetiroFlow({ ninos, padres, bitacora, onRetiro }) {
  const [paso, setPaso] = useState(0)
  const [ninoId, setNinoId] = useState('')
  const [hora, setHora] = useState(null)
  const [firma, setFirma] = useState(null)
  const [chequeos, setChequeos] = useState([])
  const [error, setError] = useState('')

  const presentes = ninos.filter((n) => n.estado === 'presente')
  const nino = ninos.find((n) => n.id === ninoId)
  const padre = nino && padres.find((p) => p.id === nino.padreId)
  const incidentes = bitacora.filter((i) => i.ninoId === ninoId)

  const reiniciar = () => {
    setPaso(0); setNinoId(''); setHora(null); setFirma(null); setChequeos([]); setError('')
  }

  const siguiente = (validar, mensaje) => {
    if (!validar) return setError(mensaje)
    setError('')
    setPaso((p) => p + 1)
  }

  const verificar = () => {
    if (chequeos.length !== CHEQUEOS.length) return setError('Debe verificar todos los puntos del estado del niño.')
    onRetiro(ninoId, padre.id, hora, firma)
    setError('')
    setPaso(4)
  }

  const toggle = (c) => setChequeos((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]))

  return (
    <section className="card">
      <h2>Retiro de alumno</h2>
      <Pasos pasos={PASOS} actual={paso} />
      {error && <div className="alerta error">{error}</div>}

      {paso === 0 && (
        <div className="bloque">
          <h3>Padre retira al niño</h3>
          <label>
            Alumno a retirar
            <select value={ninoId} onChange={(e) => setNinoId(e.target.value)}>
              <option value="">{presentes.length ? 'Seleccionar…' : 'No hay alumnos en la escuela'}</option>
              {presentes.map((n) => <option key={n.id} value={n.id}>{n.nombre} ({n.grado})</option>)}
            </select>
          </label>
          {nino && (
            <dl className="resumen">
              <dt>Padre / tutor autorizado</dt><dd>{padre.nombre} — DNI {padre.documento}</dd>
              <dt>Hora de entrada</dt><dd>{nino.entrada}</dd>
              <dt>Medicamentos</dt><dd>{nino.historialMedico || 'No necesita'}</dd>
            </dl>
          )}
          <div className="acciones">
            <button className="btn" onClick={() => siguiente(ninoId, 'Seleccione el alumno a retirar.')}>Continuar</button>
          </div>
        </div>
      )}

      {paso === 1 && (
        <div className="bloque">
          <h3>Se registra hora de salida</h3>
          <div className="hora">{hora ?? '--:--'}</div>
          <div className="acciones">
            {!hora
              ? <button className="btn" onClick={() => setHora(horaActual())}>Registrar hora de salida</button>
              : <button className="btn" onClick={() => setPaso(2)}>Continuar a firma</button>}
          </div>
        </div>
      )}

      {paso === 2 && (
        <div className="bloque">
          <h3>Firma de padre obligatoria al retirar</h3>
          <p className="muted">{padre.nombre} retira a {nino.nombre} a las {hora}.</p>
          <FirmaPad onChange={setFirma} />
          <div className="acciones">
            <button className="btn" onClick={() => siguiente(firma, 'La firma del padre es obligatoria para el retiro.')}>Confirmar firma</button>
          </div>
        </div>
      )}

      {paso === 3 && (
        <div className="bloque">
          <h3>Verificar estado del niño</h3>
          <div className="alerta ok">Firma registrada correctamente.</div>
          {incidentes.length > 0 && (
            <div className="alerta warn">
              <strong>Incidentes del día:</strong>
              <ul>
                {incidentes.map((i) => <li key={i.id}>{i.hora} · {i.tipo}: {i.descripcion}</li>)}
              </ul>
            </div>
          )}
          <div className="checks">
            {CHEQUEOS.map((c) => (
              <label key={c} className="check">
                <input type="checkbox" checked={chequeos.includes(c)} onChange={() => toggle(c)} /> {c}
              </label>
            ))}
          </div>
          <div className="acciones">
            <button className="btn" onClick={verificar}>Confirmar retiro</button>
          </div>
        </div>
      )}

      {paso === 4 && (
        <div className="bloque centro">
          <div className="exito">✓</div>
          <h3>Registro de retiro exitoso</h3>
          <p className="muted">{nino.nombre} fue retirado por {padre.nombre} a las {hora}.</p>
          <button className="btn" onClick={reiniciar}>Registrar otro retiro</button>
        </div>
      )}
    </section>
  )
}
