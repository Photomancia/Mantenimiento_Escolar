import { useEffect, useRef, useState } from 'react'

// Lienzo de firma simple (mouse / touch).
export default function FirmaPad({ onChange }) {
  const canvasRef = useRef(null)
  const dibujando = useRef(false)
  const trazado = useRef(false)
  const [vacio, setVacio] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#1e293b'
  }, [])

  const punto = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const t = e.touches ? e.touches[0] : e
    return {
      x: ((t.clientX - rect.left) * canvasRef.current.width) / rect.width,
      y: ((t.clientY - rect.top) * canvasRef.current.height) / rect.height,
    }
  }

  const iniciar = (e) => {
    e.preventDefault()
    dibujando.current = true
    const { x, y } = punto(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const mover = (e) => {
    if (!dibujando.current) return
    e.preventDefault()
    const { x, y } = punto(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.lineTo(x, y)
    ctx.stroke()
    trazado.current = true
    if (vacio) setVacio(false)
  }

  const terminar = () => {
    if (!dibujando.current) return
    dibujando.current = false
    if (trazado.current) onChange(canvasRef.current.toDataURL())
  }

  const limpiar = () => {
    const canvas = canvasRef.current
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    trazado.current = false
    setVacio(true)
    onChange(null)
  }

  return (
    <div className="firma">
      <canvas
        ref={canvasRef}
        width={500}
        height={170}
        onMouseDown={iniciar}
        onMouseMove={mover}
        onMouseUp={terminar}
        onMouseLeave={terminar}
        onTouchStart={iniciar}
        onTouchMove={mover}
        onTouchEnd={terminar}
      />
      {vacio && <span className="firma-placeholder">Firme aquí</span>}
      <button type="button" className="btn btn-sec btn-sm" onClick={limpiar}>
        Limpiar firma
      </button>
    </div>
  )
}
