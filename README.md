# Mantenimiento Escolar

Aplicación web responsive para gestionar la **asistencia escolar** de niños.

- **Frontend:** React + TypeScript + Vite (`frontend/`)
- **Backend:** PHP (API JSON) con PDO
- **Base de datos:** MySQL / MariaDB, administrada con phpMyAdmin
- **Hosting:** Hostinger, con publicación **siempre manual**

> **Estado:** fase 1 (base del proyecto). El módulo de asistencia todavía **no** está implementado.

## Estructura

```
.
├── frontend/          # Aplicación React + TypeScript + Vite
├── backend-changes/   # Propuestas de PHP/SQL para implementación MANUAL por el equipo
│   ├── base-api/      #   API base + GET /health (probado en local, no publicado)
│   ├── asistencia/    #   Análisis y preguntas abiertas (sin código)
│   └── _plantilla/    #   Estructura de referencia para nuevos paquetes
└── docs/
    ├── arquitectura.md
    ├── ejecucion-local.md
    ├── publicacion-manual.md
    ├── resultados-pruebas.md
    └── hostinger/spa.htaccess
```

## Inicio rápido

```bash
cd frontend
npm install
npm run dev:demo     # sin backend, con datos ficticios (aviso "MODO DEMO")
# o bien, con el backend PHP local en http://localhost:8000:
npm run dev
```

Abre http://localhost:5173. Instrucciones completas en [docs/ejecucion-local.md](docs/ejecucion-local.md).

## Documentación

- [Arquitectura](docs/arquitectura.md)
- [Ejecución local (frontend, backend, base de datos, pruebas)](docs/ejecucion-local.md)
- [Publicación manual en Hostinger](docs/publicacion-manual.md)
- [Resultados de pruebas](docs/resultados-pruebas.md)
- [Cambios de backend propuestos](backend-changes/README.md)

## Reglas del proyecto

- El frontend se comunica **solo** con la API HTTP. Nunca con MySQL directamente.
- Sin credenciales en el repositorio. Las variables `VITE_*` son públicas.
- Los cambios de PHP y SQL se entregan como paquetes revisables en `backend-changes/` y los publica el equipo a mano.
- No hay despliegues automáticos a Hostinger.
