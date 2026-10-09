# Plantilla de paquete de cambios de backend

Copia esta estructura al crear un paquete nuevo (`backend-changes/<nombre>/`). Borra las secciones que no apliquen.

## README.md del paquete

```markdown
# Paquete `<nombre>`

**Estado:** PROPUESTO | PROBADO EN LOCAL | PUBLICADO (fecha, responsable)
**Depende de:** <otros paquetes>

## Qué incluye
## Archivos PHP
| Archivo | Destino previsto | Propósito | Dependencias | Variables de entorno | Endpoints | Validaciones y permisos | PHP mínimo | Riesgos |
## Scripts SQL
| Orden | Archivo | Tablas afectadas | ¿Se puede repetir? | ¿Requiere mantenimiento? | Reversión y riesgo de pérdida de datos |
## Pruebas
## Riesgos y requisitos previos
```

## Cabecera obligatoria de cada script SQL

```sql
-- =====================================================================
-- Paquete:        <nombre>
-- Script:         001_<descripcion>.sql
-- Orden:          1 de N
-- Base de datos:  <nombre de la BD>  (NO ejecutar en producción sin revisión)
-- Tablas:         <tablas creadas o modificadas>
-- Depende de:     <scripts previos>
-- Repetible:      Sí/No (motivo)
-- Mantenimiento:  Sí/No (si bloquea tablas o requiere parar el servicio)
-- Reversión:      ver 001_<descripcion>.rollback.sql — ¿pierde datos? Sí/No
-- =====================================================================
```

Cada script incluye al final **consultas de verificación** (`SELECT` o `SHOW CREATE TABLE`) para comprobar el resultado en phpMyAdmin.

## deployment-checklist.md

Debe cubrir:

1. Archivos PHP a revisar y subir.
2. Scripts SQL a ejecutar.
3. Orden.
4. Copias de seguridad.
5. Configuración.
6. Pruebas posteriores.
7. Verificación general.
8. Reversión.

Marca con ⚠️ los pasos que dependen del entorno real de Hostinger y no se han verificado.
