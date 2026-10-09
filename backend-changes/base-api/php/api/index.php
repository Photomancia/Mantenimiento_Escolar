<?php
/**
 * Punto de entrada único de la API (front controller).
 *
 * Destino previsto: public_html/api/index.php (junto a su .htaccess).
 * Todas las rutas /api/* llegan aquí mediante la reescritura de .htaccess
 * (Apache) o como script router del servidor integrado de PHP (local).
 *
 * Requiere PHP >= 8.1.
 */

declare(strict_types=1);

// Ubicación del código privado (app/). Por defecto, la carpeta hermana ../app.
// En producción se recomienda colocar app/ FUERA de public_html y ajustar esta
// ruta o definir la variable de entorno MANTENIMIENTO_APP_ROOT.
$appRoot = getenv('MANTENIMIENTO_APP_ROOT') ?: dirname(__DIR__) . '/app';

require $appRoot . '/bootstrap.php';

$routes = [
    'GET /health' => $appRoot . '/handlers/health.php',
];

dispatch($routes, $config);
