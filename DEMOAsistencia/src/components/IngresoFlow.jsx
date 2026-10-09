import { useState } from 'react'
import Pasos from './Pasos.jsx'
import FirmaPad from './FirmaPad.jsx'
import { horaActual } from '../data.js'

const PASOS = ['Padre llega con niño', '¿Registrado?', 'Hora de entrada', 'Firma de ingreso', 'Ingreso a escuela']

export default function IngresoFlow({ padres, ninos, onRegistrar, onIngreso }) {
  const [paso, setPaso] = useState(0)
  const [padreId, setPadreId] = useState('')
  const [ninoId, setNinoId] = useState('')
  const [registrado, setRegistrado] = useState(null)
  const [form, setForm] = useState({ padre: '', documento: '', telefono: '', email: '', nino: '', grado: '' })
  const [hora, setHora] = useState(null)
  const [firma, setFirma] = useState(null)
  const [error, setError] = useState('')

  const ausentes = ninos.filter((n) => n.padreId === padreId && n.estado === 'ausente')
  const padre = padres.find((p) => p.id === padreId)
  const nino = ninos.find((n) => n.id === ninoId)

  const reiniciar = () => {
    setPaso(0); setPadreId(''); setNinoId(''); setRegistrado(null)
    setForm({ padre: '', documento: '', telefono: '', email: '', nino: '', grado: '' })
    setHora(null); setFirma(null); setError('')
  }

  const avanzarLlegada = () => {
    if (registrado === null) return setError('Indique si el padre se encuentra registrado.')
    if (registrado && (!padreId || !ninoId)) return setError('Seleccione el padre y el niño que ingresa.')
    setError('')
    setPaso(registrado ? 2 : 1)
  }

  const guardarRegistro = (e) => {
    e.preventDefault()
    const faltan = Object.entries(form).filter(([k, v]) => k !== 'email' && !v.trim())
    if (faltan.length) return setError('Complete todos los campos obligatorios (*).')
    const { padreId: pId, ninoId: nId } = onRegistrar(form)
    setPadreId(pId); setNinoId(nId); setError('')
    setPaso(2)
  }

  const confirmarFirma = () => {
    if (!firma) return setError('La firma del padre es obligatoria para el ingreso.')
    setError('')
    setPaso(4)
  }

  const finalizar = () => {
    onIngreso(ninoId, padreId, hora, firma)
    setPaso(5)
  }

  return (
    <section className="card">
      <h2>Ingreso de alumno</h2>
      <Pasos pasos={PASOS} actual={paso} />
      {error && <div className="alerta error">{error}</div>}

      {paso === 0 && (
        <div className="bloque">
          <h3>Padre llega con niño</h3>
          <p className="decision">¿Se encuentra registrado?</p>
          <div className="opciones">
            <label className={`opcion ${registrado === true ? 'sel' : ''}`}>
              <input type="radio" checked={registrado === true} onChange={() => setRegistrado(true)} /> Sí
            </label>
            <label className={`opcion ${registrado === false ? 'sel' : ''}`}>
              <input type="radio" checked={registrado === false} onChange={() => setRegistrado(false)} /> No
            </label>
          </div>
          {registrado && (
            <div className="grid2">
              <label>
                Padre / tutor
                <select value={padreId} onChange={(e) => { setPadreId(e.target.value); setNinoId('') }}>
                  <option value="">Seleccionar…</option>
                  {padres.map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre} — DNI {p.documento}</option>
                  ))}
                </select>
              </label>
              <label>
                Niño que ingresa
                <select value={ninoId} onChange={(e) => setNinoId(e.target.value)} disabled={!padreId}>
                  <option value="">{padreId && !ausentes.length ? 'Sin niños pendientes de ingreso' : 'Seleccionar…'}</option>
                  {ausentes.map((n) => (
                    <option key={n.id} value={n.id}>{n.nombre} ({n.grado})</option>
                  ))}
                </select>
              </label>
            </div>
          )}
          <div className="acciones">
            <button className="btn" onClick={avanzarLlegada}>Continuar</button>
          </div>
        </div>
      )}

      {paso === 1 && (
        <form className="bloque" onSubmit={guardarRegistro}>
          <h3>Realizar registros</h3>
          <p className="muted">El padre no se encuentra registrado. Complete los datos para darlo de alta junto al niño.</p>
          <div className="grid2">
            <label>Nombre del padre / tutor *<input value={form.padre} onChange={(e) => setForm({ ...form, padre: e.target.value })} /></label>
            <label>Documento *<input value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} /></label>
            <label>Teléfono *<input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} /></label>
            <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label>Nombre del niño *<input value={form.nino} onChange={(e) => setForm({ ...form, nino: e.target.value })} /></label>
            <label>Grado / sala *<input value={form.grado} onChange={(e) => setForm({ ...form, grado: e.target.value })} /></label>
          </div>
          <div className="acciones">
            <button type="button" className="btn btn-sec" onClick={() => { setError(''); setPaso(0) }}>Volver</button>
            <button type="submit" className="btn">Guardar registro</button>
          </div>
        </form>
      )}

      {paso === 2 && (
        <div className="bloque">
          <h3>Registrar hora de entrada</h3>
          <Resumen padre={padre} nino={nino} />
          <div className="hora">{hora ?? '--:--'}</div>
          <div className="acciones">
            {!hora ? (
              <button className="btn" onClick={() => setHora(horaActual())}>Registrar hora de entrada</button>
            ) : (
              <button className="btn" onClick={() => setPaso(3)}>Continuar a firma</button>
            )}
          </div>
        </div>
      )}

      {paso === 3 && (
        <div className="bloque">
          <h3>Firma de padre obligatoria al ingresar</h3>
          <p className="muted">{padre?.nombre} deja a {nino?.nombre} a las {hora}.</p>
          <FirmaPad onChange={setFirma} />
          <div className="acciones">
            <button className="btn" onClick={confirmarFirma}>Confirmar firma</button>
          </div>
        </div>
      )}

      {paso === 4 && (
        <div className="bloque">
          <h3>Niño ingresa a escuela</h3>
          <div className="alerta ok">Firma registrada correctamente.</div>
          <Resumen padre={padre} nino={nino} hora={hora} />
          <div className="acciones">
            <button className="btn" onClick={finalizar}>Confirmar ingreso</button>
          </div>
        </div>
      )}

      {paso === 5 && (
        <div className="bloque centro">
          <div className="exito">✓</div>
          <h3>{nino?.nombre} ingresó a la escuela a las {hora}</h3>
          <p className="muted">Inicia el transcurso de la jornada.</p>
          <button className="btn" onClick={reiniciar}>Registrar otro ingreso</button>
        </div>
      )}
    </section>
  )
}

function Resumen({ padre, nino, hora }) {
  return (
    <dl className="resumen">
      <dt>Padre / tutor</dt><dd>{padre?.nombre}</dd>
      <dt>Niño</dt><dd>{nino?.nombre} ({nino?.grado})</dd>
      {hora && (<><dt>Hora de entrada</dt><dd>{hora}</dd></>)}
    </dl>
  )
}
