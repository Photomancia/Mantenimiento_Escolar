# Frontend — Mantenimiento Escolar

React 19 + TypeScript + Vite. Requiere Node.js ≥ 22.12.

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (modo API, proxy `/api` → `API_PROXY_TARGET`). |
| `npm run dev:demo` | Servidor de desarrollo en **modo demo** (datos ficticios, sin backend). |
| `npm test` | Pruebas (Vitest + Testing Library). |
| `npm run lint` | Lint (oxlint). |
| `npm run typecheck` | Comprobación de tipos. |
| `npm run build` | Compilación de producción en `dist/`. |
| `npm run preview` | Sirve `dist/` en local. |

Configuración: copia `.env.example` como `.env.local`. Más detalles en [`../docs/`](../docs/).
