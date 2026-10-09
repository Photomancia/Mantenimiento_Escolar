export function ConfigErrorScreen({ message }: { message: string }) {
  return (
    <main className="container main">
      <div className="alert alert--error" role="alert">
        <h1>Error de configuración</h1>
        <p>{message}</p>
      </div>
    </main>
  )
}
