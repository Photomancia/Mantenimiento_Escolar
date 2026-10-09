export function AsistenciaPage() {
  return (
    <section className="card">
      <h1>Asistencia</h1>
      <p className="badge badge--warning">Módulo pendiente</p>
      <p>
        Este módulo todavía no está disponible. Para implementarlo se necesitan
        endpoints del backend que aún no existen (alumnos, grupos y registros de
        asistencia).
      </p>
      <p>
        El detalle está en <code>backend-changes/asistencia/README.md</code>.
      </p>
    </section>
  )
}
