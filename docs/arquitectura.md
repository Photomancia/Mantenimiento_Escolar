# Arquitectura

## Visión general

```
Navegador ──► Frontend (React + TS, archivos estáticos)
                  │  fetch JSON  ──►  /api/*  (PHP, mismo dominio)
                  │                       │ PDO + consultas preparadas
                  │                       ▼
                  │                 MySQL / MariaDB (phpMyAdmin)
```

- El frontend **nunca** se conecta a la base de datos ni contiene credenciales.
- Toda la comunicación usa una API HTTP con JSON y un [formato de error estándar](../backend-changes/base-api/api-contract.md#formato-estándar-de-error).
- El frontend y la API se publican en el **mismo dominio** (`/` y `/api`). Así se evita CORS y la sesión puede usar cookies `HttpOnly`.

## Responsabilidades

| Parte | Responsable | Ubicación |
|---|---|---|
| Frontend (React, TS, Vite) | Claude Code | `frontend/` |
| Propuestas de PHP y SQL | Claude Code las prepara; el equipo las revisa | `backend-changes/` |
| Backend en producción y base de datos | Equipo (manual) | Hostinger |
| Publicación | Equipo (manual) | Hostinger |

## Frontend (`frontend/`)

```
src/
├── main.tsx               # carga la configuración y monta la app
├── App.tsx                # rutas
├── config/env.ts          # lee y valida las variables VITE_*
├── components/            # Layout, DemoBanner, ApiStatusCard, LoadingState, ErrorMessage…
├── pages/                 # HomePage, AsistenciaPage, NotFoundPage
├── services/
│   ├── apiClient.ts       # fetch + timeout + errores normalizados (ApiError)
│   ├── healthService.ts   # servicio real: GET /health
│   ├── demo/              # implementaciones de demostración (separadas)
│   ├── index.ts           # createServices(config): elige api o demo
│   ├── servicesContext.ts
│   └── ServicesProvider.tsx
├── hooks/                 # useServices, useAsync (cargando / error / reintentar)
├── types/api.ts           # tipos del contrato de API
├── styles/global.css      # estilos responsive (mobile-first)
└── test/setup.ts
```

### Decisiones

- **Inyección de servicios:** las pantallas obtienen los servicios con `useServices()`. Elegir entre la API real y el modo demo se hace en un único punto (`createServices`), y las pruebas pueden inyectar un `fetch` simulado.
- **Errores:** `apiClient` convierte cualquier fallo (HTTP, red, timeout, respuesta no JSON) en un `ApiError` con un mensaje seguro. En los errores 5xx nunca se muestra el texto del servidor.
- **Modo demo:**
  - Solo se activa con `VITE_APP_MODE=demo`.
  - Muestra un aviso permanente "MODO DEMO".
  - No hace llamadas de red.
  - Una compilación de producción en modo demo se bloquea, salvo que se defina `VITE_DEMO_EN_PRODUCCION=true`.
- **Configuración inválida:** se muestra una pantalla de error de configuración en lugar de fallar silenciosamente.
- **Sin dependencias de UI:** solo React y React Router, para mantener el paquete ligero.

## Variables de entorno del frontend

| Variable | Llega al navegador | Uso |
|---|---|---|
| `VITE_APP_MODE` | Sí | `api` (por defecto) o `demo`. |
| `VITE_API_BASE_URL` | Sí | URL base de la API. Obligatoria en modo `api`. |
| `VITE_API_TIMEOUT_MS` | Sí | Timeout por petición (por defecto 15000). |
| `VITE_DEMO_EN_PRODUCCION` | Sí | Autoriza el modo demo en producción. |
| `API_PROXY_TARGET` | **No** | Solo para el servidor de desarrollo: destino del proxy `/api`. |

> Las variables `VITE_*` se incrustan en el JavaScript público. **Nunca** deben contener secretos.

## Seguridad

- **Validación:** el frontend valida para mejorar la experiencia de uso. El backend valida **siempre** de forma independiente.
- **Permisos:** la interfaz oculta acciones, pero los permisos los decide el backend.
- **Datos de menores y firmas:** solo mediante endpoints autenticados. Las firmas no se guardan en carpetas públicas. Ver [`backend-changes/asistencia/README.md`](../backend-changes/asistencia/README.md#requisitos-de-seguridad-ya-definidos).
- **Sesión:** cookies con `credentials: 'same-origin'`. La protección CSRF (cabecera `X-CSRF-Token`) se implementará con la autenticación.
- **Visibilidad:** `index.html` lleva `noindex` para que los buscadores no indexen la aplicación.
