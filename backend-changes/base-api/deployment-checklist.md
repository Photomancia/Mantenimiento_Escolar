# Checklist de publicación manual — `base-api`

> Ejecutar a mano. Claude Code **no** accede a Hostinger ni ejecuta nada en producción.
> Leyenda: ✅ verificado en local · ⚠️ depende del entorno real de Hostinger (sin verificar).

## 0. Antes de empezar

- [ ] ✅ En local: `bash backend-changes/base-api/tests/lint.sh` da OK.
- [ ] ✅ En local: `bash backend-changes/base-api/tests/smoke-test.sh http://localhost:8000/api` da todo OK.
- [ ] ⚠️ Confirmar la versión de PHP del hosting (hPanel → Avanzado → Configuración de PHP). Debe ser **≥ 8.1** y tener `pdo_mysql`.
- [ ] ⚠️ Comprobar si ya existe `public_html/api/`. Si existe, **parar** y revisar su contenido antes de continuar.

## 1. Copias de seguridad

- [ ] ⚠️ Descargar una copia de `public_html/` (o al menos de `public_html/api/` si existe).
- [ ] ⚠️ Exportar la base de datos desde phpMyAdmin (Exportar → SQL). Este paquete no la modifica, pero conviene tener una copia reciente.
- [ ] Anotar la fecha y la ubicación de las copias.

## 2. Base de datos

- [ ] Este paquete **no tiene scripts SQL**.
- [ ] ⚠️ Crear (o reutilizar) una base de datos y un usuario desde hPanel → Bases de datos MySQL. El usuario solo debe tener permisos sobre esa base de datos.

## 3. Archivos a subir (en este orden)

| # | Origen (repositorio) | Destino en el hosting |
|---|---|---|
| 1 | `backend-changes/base-api/php/app/` (carpeta completa) | ⚠️ `<privado>/app/`, fuera de `public_html` (p. ej. `/home/<usuario>/mantenimiento_app/app/`) |
| 2 | `backend-changes/base-api/php/config/config.example.php` | ⚠️ `<privado>/config/config.php`, **renombrado** y editado con los datos reales **directamente en el servidor** |
| 3 | `backend-changes/base-api/php/api/index.php` | `public_html/api/index.php` |
| 4 | `backend-changes/base-api/php/api/.htaccess` | `public_html/api/.htaccess` |

**No subir:** `tests/`, archivos `.md` ni `config.example.php` dentro de `public_html`.

## 4. Configuración

- [ ] En `<privado>/config/config.php`: `app_env => 'production'`, datos de la base de datos y `allowed_origins => []`.
- [ ] ⚠️ Si `app/` **no** está en `public_html/app/`, editar en `public_html/api/index.php` la línea `$appRoot = ...` con la ruta absoluta real. Ejemplo: `'/home/<usuario>/mantenimiento_app/app'`.
- [ ] ⚠️ Permisos: archivos 644 y carpetas 755. `config.php` puede ser 640 si el hosting lo permite.

## 5. Pruebas después de publicar

- [ ] Abrir `https://TU-DOMINIO/api/health` en el navegador: debe mostrar JSON con `"database":"ok"`.
- [ ] Desde Git Bash: `EXPECT_DB=ok bash backend-changes/base-api/tests/smoke-test.sh https://TU-DOMINIO/api`.
- [ ] `https://TU-DOMINIO/api/` **no** debe listar archivos.
- [ ] `https://TU-DOMINIO/app/config.php` (o la ruta equivalente) **no** debe ser accesible: debe devolver 403 o 404.
- [ ] Revisar el log de errores de PHP en hPanel: no debe haber errores nuevos.

## 6. Verificar que el resto sigue funcionando

- [ ] Cargar la página principal del sitio y cualquier otra aplicación alojada en el mismo dominio.
- [ ] Si el frontend ya está publicado: la tarjeta "Estado del servidor" muestra "Conectada" y "Disponible".

## 7. Reversión

1. Borrar `public_html/api/index.php` y `public_html/api/.htaccess`, o restaurar la copia del paso 1 si ya había una carpeta `api/`.
2. Borrar `<privado>/app/` y `<privado>/config/config.php`.
3. La base de datos no se modificó: no hay nada que revertir ahí.
4. Comprobar que el sitio vuelve a funcionar como antes.

Riesgo de pérdida de datos en la reversión: **ninguno** (el paquete no escribe datos).
