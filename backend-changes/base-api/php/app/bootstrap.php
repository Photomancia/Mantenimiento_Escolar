<?php
/**
 * Inicialización común: errores, configuración y utilidades HTTP.
 * Destino previsto: <carpeta privada>/app/bootstrap.php
 */

declare(strict_types=1);

// Nunca mostrar errores de PHP en la respuesta: se registran en el log.
ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

require __DIR__ . '/config.php';
require __DIR__ . '/http.php';
require __DIR__ . '/db.php';

$config = load_config(__DIR__);

set_exception_handler(static function (Throwable $e): void {
    // El detalle va al log del servidor; el cliente recibe un mensaje genérico.
    error_log('[mantenimiento-api] ' . get_class($e) . ': ' . $e->getMessage()
        . ' en ' . $e->getFile() . ':' . $e->getLine());
    if (!headers_sent()) {
        json_error(500, 'INTERNAL_ERROR', 'Error interno del servidor.');
    }
});
