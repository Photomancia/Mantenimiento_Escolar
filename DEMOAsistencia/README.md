# DEMOAsistencia

Front-end de demostración (React + Vite) del proceso de asistencia escolar, basado en el diagrama de flujo:

1. **Ingreso** — El padre llega con el niño → ¿se encuentra registrado? (si no, se realiza el registro) → se registra la hora de entrada → firma obligatoria del padre → el niño ingresa a la escuela.
2. **Jornada** — Transcurso de la jornada → ¿ocurrió algún incidente? → se registra en bitácora y se notifica a los padres.
3. **Retiro** — El padre retira al niño → se registra la hora de salida → firma obligatoria del padre → se verifica el estado del niño → registro de retiro exitoso.
4. **Bitácora / Panel** — Vista general del estado de los alumnos, incidentes y movimientos de entrada/salida.

Todos los datos son valores predeterminados en memoria (`src/data.js`); no hay backend. El botón "Reiniciar demo" restaura los valores iniciales.

## Ejecutar

```bash
cd DEMOAsistencia
npm install
npm run dev
```
