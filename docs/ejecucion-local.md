# Ejecución local

Requisitos: **Node.js ≥ 22.12** (probado con 22.22; Vitest lo exige), npm, Git Bash.
Para el backend: **PHP ≥ 8.1** con `pdo_mysql`, y MySQL o MariaDB local (XAMPP, Laragon o similar).

## 1. Frontend

```bash
cd frontend
npm install
```

La configuración por defecto está en `.env.development` (desarrollo) y `.env.production` (compilación). Para cambiar algo **solo en tu equipo**, copia `.env.example` como `.env.local` (no se sube a Git).

### a) Modo demo (sin backend)

```bash
npm run dev:demo
```

Abre http://localhost:5173. Arriba aparece el aviso **MODO DEMO**. No se hace ninguna llamada al servidor y nada se guarda.

### b) Modo API (con el backend PHP local)

```bash
npm run dev
```

Abre http://localhost:5173. Las peticiones a `/api/*` se reenvían a `API_PROXY_TARGET` (por defecto `http://localhost:8000`). Si el backend no está arrancado, la tarjeta "Estado del servidor" muestra un error y el botón **Reintentar**.

## 2. Backend PHP local

El código propuesto está en `backend-changes/base-api/php/`. Para probarlo en local:

```bash
cd backend-changes/base-api/php
cp config/config.example.php config/config.php    # edita los datos de tu BD LOCAL
php -S localhost:8000 -t . api/index.php
```

Comprueba que funciona: http://localhost:8000/api/health

> `config/config.php` está en `.gitignore`. **Nunca** lo subas a GitHub.

También puedes pasar la configuración por variables de entorno, sin crear el archivo:

```bash
DB_NAME=mantenimiento_escolar_local DB_USER=mant_local DB_PASS=tu_clave_local \
  php -S localhost:8000 -t . api/index.php
```

## 3. Base de datos local

Usa una base de datos **solo local**, distinta de la de producción. No intentes conectar desde localhost a la base de datos de Hostinger.

En phpMyAdmin local (pestaña SQL) o en la consola de MySQL:

```sql
CREATE DATABASE IF NOT EXISTS mantenimiento_escolar_local
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'mant_local'@'localhost' IDENTIFIED BY 'elige_una_clave_local';
GRANT ALL PRIVILEGES ON mantenimiento_escolar_local.* TO 'mant_local'@'localhost';
```

Por ahora no hay tablas que crear. Las tablas de asistencia se definirán en `backend-changes/asistencia/sql/` cuando se cierren los requisitos.

> Si PHP conecta por `127.0.0.1` y MySQL distingue `localhost` de `127.0.0.1`, crea el usuario para el host que corresponda.

## 4. URL de la API

| Escenario | `VITE_API_BASE_URL` | Notas |
|---|---|---|
| Desarrollo con proxy (recomendado) | `/api` | `API_PROXY_TARGET=http://localhost:8000` |
| Producción, mismo dominio | `/api` | Valor por defecto de `.env.example`. |
| API en otro dominio | `https://api.ejemplo.com/api` | Requiere `allowed_origins` en el backend (CORS). |

## 5. Pruebas

```bash
# Frontend
cd frontend
npm test            # pruebas unitarias y de componentes (Vitest)
npm run lint        # oxlint
npm run typecheck   # TypeScript
npm run build       # compilación de producción en dist/

# Backend (desde la raíz del repositorio)
bash backend-changes/base-api/tests/lint.sh
bash backend-changes/base-api/tests/smoke-test.sh http://localhost:8000/api
EXPECT_DB=ok bash backend-changes/base-api/tests/smoke-test.sh http://localhost:8000/api   # exige BD conectada
```

## 6. Funciones que dependen de cambios pendientes

| Función | Depende de | Estado |
|---|---|---|
| Tarjeta "Estado del servidor" | `base-api` (`GET /health`) | Funciona en local. **No publicada.** |
| Módulo de asistencia | Paquete `asistencia` (auth, grupos, alumnos, registros) | Sin definir. La pantalla muestra "Módulo pendiente". |
