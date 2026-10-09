export default function Pasos({ pasos, actual }) {
  return (
    <ol className="pasos">
      {pasos.map((p, i) => (
        <li key={p} className={i < actual ? 'hecho' : i === actual ? 'activo' : ''}>
          <span className="num">{i < actual ? '✓' : i + 1}</span>
          <span className="txt">{p}</span>
        </li>
      ))}
    </ol>
  )
}
