# Publicación manual en Hostinger

> **Toda publicación es manual.** No hay GitHub Actions de despliegue ni acceso automático al hosting.
> Leyenda: ✅ verificado en local · ⚠️ depende del entorno real de Hostinger (sin verificar).

## Orden general

1. **Backend primero.** Si una versión del frontend necesita endpoints nuevos, hay que publicar y verificar antes el paquete correspondiente de `backend-changes/`, usando su `deployment-checklist.md`.
2. **Después, el frontend.**

Publicar solo el frontend **no basta** si hay cambios de backend pendientes.

## Frontend

### 1. Compilar (en tu PC)

```bash
cd frontend
npm ci
npm test
# Comprueba la configuración de producción (por defecto: VITE_APP_MODE=api, VITE_API_BASE_URL=/api)
npm run build
```

- ✅ Salida: `frontend/dist/`
- La configuración de producción está en `frontend/.env.production` (`VITE_APP_MODE=api`, `VITE_API_BASE_URL=/api`). Para un valor distinto sin modificar el repositorio, crea `frontend/.env.production.local`, que tiene prioridad. `VITE_APP_MODE` **no** debe ser `demo`: la aplicación lo bloquea con un error de configuración.

### 2. Qué subir

| Subir | No subir |
|---|---|
| **Contenido** de `frontend/dist/`: `index.html`, `favicon.svg` y la carpeta `assets/` | `frontend/src/`, `node_modules/`, `.env*`, `package*.json`, `tsconfig*`, `vite.config.ts` |
| | Cualquier archivo de `backend-changes/` (va por su propio checklist) |
| | `docs/` |

⚠️ Destino: `public_html/` (o la subcarpeta elegida). Si la aplicación va en una subcarpeta (p. ej. `/asistencia-app/`), hay que compilar con `npx vite build --base=/asistencia-app/` y ajustar `RewriteBase` en el `.htaccess`.

### 3. Rutas de React (`.htaccess`)

⚠️ Para que funcionen rutas como `/asistencia` al recargar la página, usa [`docs/hostinger/spa.htaccess`](hostinger/spa.htaccess) como `public_html/.htaccess`. **Si ya existe un `.htaccess`, fusiona las reglas a mano.**

### 4. Copia de seguridad y reversión

- Antes de subir: descarga una copia de los archivos actuales de `public_html/` que vas a reemplazar (`index.html`, `assets/`).
- Para revertir: restaura esa copia. El frontend no modifica datos, así que no hay riesgo de pérdida de datos.
- Los archivos de `assets/` llevan un hash en el nombre. Puedes borrar los antiguos una vez verificada la nueva versión.

### 5. Verificación

- [ ] La página carga sin aviso de "MODO DEMO" ni "Error de configuración".
- [ ] "Estado del servidor" muestra "Conectada" (requiere que `base-api` esté publicado).
- [ ] Recargar `/asistencia` no da 404.
- [ ] Se ve bien en móvil.
- [ ] La consola del navegador (F12) no muestra errores.

## Configuración de la API en producción

- **Recomendado:** frontend y API en el mismo dominio, con `VITE_API_BASE_URL=/api`. No hace falta CORS.
- **Si la API está en otro dominio:** `VITE_API_BASE_URL=https://.../api` y añadir el dominio del frontend en `allowed_origins` del `config.php` del backend.

## Backend

Cada paquete de `backend-changes/<paquete>/` tiene su propio `deployment-checklist.md`, que incluye las copias de seguridad, el orden, las pruebas y la reversión. Paquetes actuales:

- [`base-api`](../backend-changes/base-api/deployment-checklist.md): **pendiente de publicar**.
