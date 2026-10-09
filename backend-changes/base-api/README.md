# Paquete `base-api` — API base y endpoint de estado

**Estado:** PROPUESTO · pendiente de revisión e implementación manual por el equipo.
**Publicado en Hostinger:** NO.

## Qué incluye

La estructura mínima de la API PHP y un único endpoint, `GET /health`. El frontend lo usa para comprobar que hay conexión con el backend y con la base de datos. No contiene lógica de negocio ni tablas.

- Contrato: [`api-contract.md`](api-contract.md)
- Publicación: [`deployment-checklist.md`](deployment-checklist.md)
- Pruebas: [`tests/`](tests/)

**SQL:** este paquete **no requiere** scripts SQL. Solo necesita una base de datos y un usuario con permiso de conexión.

## Archivos PHP

Requisitos de todos los archivos: **PHP ≥ 8.1** con la extensión `pdo_mysql`. Usan `declare(strict_types=1)`, `str_starts_with` (8.0+) y `JSON_THROW_ON_ERROR`. Se probaron en local con PHP 8.3.6 y MariaDB 10.11. **No se han probado con PHP 8.1 ni 8.2.**

| Archivo del paquete | Destino previsto | Propósito | Dependencias |
|---|---|---|---|
| `php/api/index.php` | `public_html/api/index.php` | Front controller: carga `app/` y despacha las rutas. | `app/bootstrap.php`. Variable opcional `MANTENIMIENTO_APP_ROOT`. |
| `php/api/.htaccess` | `public_html/api/.htaccess` | Envía todas las rutas `/api/*` a `index.php`. Desactiva el listado de carpetas. | Apache + `mod_rewrite` (**pendiente de confirmar en Hostinger**). |
| `php/app/bootstrap.php` | `<privado>/app/bootstrap.php` | Oculta errores al cliente, carga la configuración e instala el manejador de excepciones (500 genérico). | `config.php`, `http.php`, `db.php`. |
| `php/app/config.php` | `<privado>/app/config.php` | Lee la configuración: valores por defecto, después archivo privado y después variables de entorno. | Archivo `config/config.php` o variables `DB_*`. |
| `php/app/db.php` | `<privado>/app/db.php` | Conexión PDO con `ERRMODE_EXCEPTION`, sin emulación de consultas preparadas, `utf8mb4` y timeout de 5 s. | `pdo_mysql`. |
| `php/app/http.php` | `<privado>/app/http.php` | Respuestas JSON, formato de error, cabeceras de seguridad, CORS por lista blanca y enrutado. | — |
| `php/app/handlers/health.php` | `<privado>/app/handlers/health.php` | `GET /health`. | `db.php`. |
| `php/app/.htaccess` | `<privado>/app/.htaccess` | `Require all denied`. Protección extra si `app/` quedara dentro de `public_html`. | Apache 2.4. |
| `php/config/config.example.php` | `<privado>/config/config.php` (copia) | Plantilla de configuración **sin credenciales reales**. | — |

`<privado>` es una carpeta **fuera de `public_html`**, por ejemplo `/home/<usuario>/mantenimiento_app/`. En Hostinger hay que confirmar la ruta exacta.

Si `app/` no queda en `../app` respecto a `api/index.php`, hay que ajustar la línea `$appRoot` de `index.php` o definir `MANTENIMIENTO_APP_ROOT`.

## Configuración (variables)

| Clave en `config.php` | Variable de entorno | Obligatoria | Descripción |
|---|---|---|---|
| `app_env` | `APP_ENV` | No | `development` o `production`. |
| `db.host` | `DB_HOST` | Sí | Servidor MySQL/MariaDB. |
| `db.port` | `DB_PORT` | No | Por defecto 3306. |
| `db.name` | `DB_NAME` | Sí | Nombre de la base de datos. |
| `db.user` | `DB_USER` | Sí | Usuario. Solo con permisos sobre esta base de datos. |
| `db.pass` | `DB_PASS` | Sí | Contraseña. **Nunca en Git.** |
| `allowed_origins` | `ALLOWED_ORIGINS` (separados por comas) | No | Solo si el frontend está en otro dominio. Vacío = mismo dominio. |

Las variables de entorno tienen prioridad sobre el archivo. La ruta del archivo puede cambiarse con `MANTENIMIENTO_CONFIG`.

## Endpoints afectados

- `GET /api/health` (nuevo).
- Cualquier otra ruta bajo `/api/` responde `404 NOT_FOUND` con el formato estándar.

## Seguridad

- `display_errors=0`. Los errores se registran con `error_log` y el cliente solo recibe `INTERNAL_ERROR`.
- `/health` no revela por qué falla la base de datos.
- Cabeceras: `X-Content-Type-Options: nosniff`, `Cache-Control: no-store`, `Referrer-Policy: no-referrer`.
- CORS desactivado por defecto: solo se aceptan orígenes listados explícitamente.
- Todavía no hay autenticación porque `/health` es público. La autenticación, la autorización y la protección CSRF se definirán con el módulo de asistencia, antes de exponer datos de menores.

## Riesgos y requisitos previos

- No se ha verificado que Hostinger tenga `mod_rewrite` activo ni que permita `Require all denied` en `.htaccess`.
- No se ha verificado si Hostinger permite variables de entorno para PHP. Por eso se usa un archivo `config.php` privado.
- Si ya existe un `public_html/api/` en producción, **no sobrescribirlo** sin revisar su contenido.

## Ejecución local

Ver [`docs/ejecucion-local.md`](../../docs/ejecucion-local.md#2-backend-php-local).
