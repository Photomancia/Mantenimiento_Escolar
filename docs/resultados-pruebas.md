# Resultados de pruebas

## Fase 1: base del proyecto (2026-10-09)

**Entorno:** contenedor Linux de desarrollo con Node.js 22.22.0, npm 10.9.4, PHP 8.3.6 CLI, MariaDB 10.11.14 (local, temporal) y Chromium (Playwright).
**Producción:** no se ha probado nada en Hostinger ni se ha publicado nada.

### Frontend

| Comprobación | Comando | Resultado |
|---|---|---|
| Instalación limpia | `npm ci` | ✅ OK, 0 vulnerabilidades (`npm audit`) |
| Lint | `npm run lint` (oxlint) | ✅ 0 avisos, 0 errores |
| Tipos | `npm run typecheck` | ✅ Sin errores |
| Pruebas | `npm test` | ✅ 3 archivos, **23/23 pruebas** |
| Compilación de producción | `npm run build` | ✅ `dist/`: index.html 0,52 kB · CSS 3,67 kB · JS 268 kB (85 kB gzip) |

Pruebas automatizadas incluidas:

- **Configuración (`env.test.ts`, 9):** modo por defecto, URL obligatoria en modo API, URLs no válidas, modos desconocidos, bloqueo del modo demo en producción y validación del timeout.
- **Cliente HTTP (`apiClient.test.ts`, 9):** URL base, cuerpo JSON, errores 4xx con `fields`, ocultación de mensajes 5xx (p. ej. `SQLSTATE`), errores no JSON, respuestas 200 no JSON, fallo de red, timeout y 204.
- **Aplicación (`App.test.tsx`, 5):** el modo demo muestra el aviso y no llama a la red; el modo API muestra el estado de `/health`; error y botón Reintentar; navegación a Asistencia; página 404.

### Comprobaciones manuales en el navegador (Chromium headless)

| Caso | Resultado |
|---|---|
| `npm run dev` + backend PHP local con MariaDB | ✅ "Estado del servidor": API **Conectada**, BD **Disponible**, versión 0.1.0 |
| Vista móvil (375 px) y escritorio (1280 px) | ✅ Sin desbordamiento horizontal (`scrollWidth` = ancho de la ventana) |
| `npm run dev:demo` | ✅ Aviso "MODO DEMO" visible. La página de asistencia muestra "Módulo pendiente" |
| `vite preview` del build de producción | ✅ Arranca en modo API con `/api` y consulta el backend |
| Build de producción con `--mode demo` | ✅ Bloqueado: muestra "Error de configuración" |
| Build sin `VITE_API_BASE_URL` | ✅ Muestra "Error de configuración" (antes de añadir `.env.production`) |

### Backend propuesto (`backend-changes/base-api`)

| Comprobación | Comando | Resultado |
|---|---|---|
| Sintaxis PHP | `bash backend-changes/base-api/tests/lint.sh` | ✅ 7 archivos sin errores (PHP 8.3.6) |
| Humo sin base de datos | `smoke-test.sh http://localhost:8000/api` | ✅ 7/7. `/health` → `degraded` / `unavailable` |
| Humo con MariaDB 10.11 | `EXPECT_DB=ok smoke-test.sh http://localhost:8001/api` | ✅ 8/8. `/health` → `ok` / `ok` |

Casos que cubre la prueba de humo: 200 en `/health`, campos del contrato, `Content-Type` JSON, 404 en rutas desconocidas, 405 en `POST /health` y formato estándar de error.

### Seguridad

- ✅ No hay credenciales en los archivos versionados (búsqueda de patrones `password/secret/token/api_key`). Las únicas coincidencias en el JS compilado son los nombres de tipos de input de React (`type="password"`).
- ✅ `.env.local`, `.env.*.local` y `backend-changes/**/config/config.php` están en `.gitignore`.
- ✅ Los errores 5xx no muestran al usuario el texto del servidor.

### No verificado

- ⚠️ PHP 8.1 y 8.2 (solo se probó con 8.3).
- ⚠️ Apache y `.htaccess`: se probó con el servidor integrado de PHP. No se ha probado `mod_rewrite` ni `Require all denied`.
- ⚠️ Entorno real de Hostinger: rutas, permisos, versión de PHP/MySQL y variables de entorno.
- ⚠️ Navegadores reales en dispositivos móviles (solo se usó Chromium headless con viewport de 375 px).
- No hay scripts SQL en esta fase, así que no hay nada que probar contra un esquema.
