import { useState } from 'react'
import Panel from './components/Panel.jsx'
import IngresoFlow from './components/IngresoFlow.jsx'
import JornadaPanel from './components/JornadaPanel.jsx'
import RetiroFlow from './components/RetiroFlow.jsx'
import Bitacora from './components/Bitacora.jsx'
import {
  PADRES_INICIALES, NINOS_INICIALES, BITACORA_INICIAL, MOVIMIENTOS_INICIALES, horaActual, nuevoId,
} from './data.js'

const SECCIONES = [
  { id: 'panel', nombre: 'Panel' },
  { id: 'ingreso', nombre: 'Ingreso' },
  { id: 'jornada', nombre: 'Jornada' },
  { id: 'retiro', nombre: 'Retiro' },
  { id: 'bitacora', nombre: 'Bitácora' },
]

export default function App() {
  const [seccion, setSeccion] = useState('panel')
  const [padres, setPadres] = useState(PADRES_INICIALES)
  const [ninos, setNinos] = useState(NINOS_INICIALES)
  const [bitacora, setBitacora] = useState(BITACORA_INICIAL)
  const [movimientos, setMovimientos] = useState(MOVIMIENTOS_INICIALES)
  const [demoKey, setDemoKey] = useState(0)

  const registrar = (form) => {
    const padreId = nuevoId('p')
    const ninoId = nuevoId('n')
    setPadres((ps) => [...ps, { id: padreId, nombre: form.padre, documento: form.documento, telefono: form.telefono, email: form.email }])
    setNinos((ns) => [...ns, { id: ninoId, nombre: form.nino, grado: form.grado, padreId, estado: 'ausente', entrada: null, salida: null }])
    return { padreId, ninoId }
  }

  const ingreso = (ninoId, padreId, hora, firma) => {
    setNinos((ns) => ns.map((n) => (n.id === ninoId ? { ...n, estado: 'presente', entrada: hora } : n)))
    setMovimientos((ms) => [...ms, { id: nuevoId('m'), ninoId, padreId, tipo: 'Entrada', hora, firma }])
  }

  const incidente = ({ ninoId, tipo, descripcion }) => {
    setBitacora((bs) => [...bs, { id: nuevoId('i'), ninoId, tipo, descripcion, hora: horaActual(), notificado: true }])
  }

  const retiro = (ninoId, padreId, hora, firma) => {
    setNinos((ns) => ns.map((n) => (n.id === ninoId ? { ...n, estado: 'retirado', salida: hora } : n)))
    setMovimientos((ms) => [...ms, { id: nuevoId('m'), ninoId, padreId, tipo: 'Salida', hora, firma }])
  }

  const reiniciarDemo = () => {
    setPadres(PADRES_INICIALES); setNinos(NINOS_INICIALES)
    setBitacora(BITACORA_INICIAL); setMovimientos(MOVIMIENTOS_INICIALES)
    setDemoKey((k) => k + 1); setSeccion('panel')
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="marca">
          <span className="logo">🏫</span>
          <div>
            <h1>DEMO Asistencia</h1>
            <small>Control de ingreso y retiro escolar</small>
          </div>
        </div>
        <button className="btn btn-sec btn-sm" onClick={reiniciarDemo}>Reiniciar demo</button>
      </header>

      <nav className="tabs">
        {SECCIONES.map((s) => (
          <button key={s.id} className={seccion === s.id ? 'activo' : ''} onClick={() => setSeccion(s.id)}>
            {s.nombre}
          </button>
        ))}
      </nav>

      <main key={demoKey}>
        {seccion === 'panel' && <Panel ninos={ninos} padres={padres} bitacora={bitacora} />}
        {seccion === 'ingreso' && <IngresoFlow padres={padres} ninos={ninos} onRegistrar={registrar} onIngreso={ingreso} />}
        {seccion === 'jornada' && <JornadaPanel ninos={ninos} padres={padres} bitacora={bitacora} onIncidente={incidente} />}
        {seccion === 'retiro' && <RetiroFlow ninos={ninos} padres={padres} bitacora={bitacora} onRetiro={retiro} />}
        {seccion === 'bitacora' && <Bitacora bitacora={bitacora} movimientos={movimientos} ninos={ninos} padres={padres} />}
      </main>

      <footer className="pie">Fin de jornada · Datos de demostración, no se guardan en servidor.</footer>
    </div>
  )
}
