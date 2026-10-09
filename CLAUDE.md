# Instrucciones para Claude Code

Proyecto: aplicación web de asistencia escolar. Frontend React + TS + Vite en `frontend/`. Backend PHP + MySQL/MariaDB gestionado **manualmente** por el equipo. Documentación en español.

## Responsabilidades
- Claude Code desarrolla el **frontend** (`frontend/`): componentes, páginas, servicios de API, validaciones, estilos responsive, pruebas y documentación.
- Los cambios de PHP/SQL se entregan como **paquetes revisables** en `backend-changes/<paquete>/` (ver `backend-changes/_plantilla/README.md`). El equipo los implementa a mano.

## Prohibido
- Desplegar a Hostinger, conectarse por FTP/SFTP/SSH o configurar GitHub Actions de despliegue.
- Ejecutar SQL o migraciones contra producción. Pedir o guardar credenciales de producción.
- Modificar el backend existente sin autorización explícita.
- Asumir que un endpoint existe: comprobar el contrato en `backend-changes/*/api-contract.md`.
- Presentar como guardada una operación que el backend no confirmó.
- Hacer merge automático.

## Convenciones del frontend
- Servicios en `src/services/`. Las implementaciones demo van en `src/services/demo/` y se eligen solo en `createServices()`.
- Errores mediante `ApiError` (`src/services/apiClient.ts`). En la interfaz, usar `errorToMessage` y nunca mostrar mensajes 5xx del servidor.
- Las variables `VITE_*` son públicas: nunca secretos.

## Comprobaciones antes de cada commit
```bash
cd frontend && npm run lint && npm run typecheck && npm test && npm run build
bash backend-changes/base-api/tests/lint.sh
```
Actualizar `docs/resultados-pruebas.md` con los resultados reales.

## Git
Rama de trabajo: `feature/asistencia` (creada desde `development`). Rama por defecto del remoto: `main`.
