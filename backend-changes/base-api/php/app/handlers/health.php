<?php
/**
 * GET /health — estado de la API y de la conexión a la base de datos.
 * Destino previsto: <carpeta privada>/app/handlers/health.php
 *
 * Público (sin autenticación). No revela detalles del error de conexión:
 * solo "ok" o "unavailable". El motivo real se escribe en el log del servidor.
 */

declare(strict_types=1);

return static function (array $config): void {
    $database = 'unavailable';
    try {
        $pdo = db_connect($config['db']);
        $pdo->query('SELECT 1')->fetchColumn();
        $database = 'ok';
    } catch (Throwable $e) {
        error_log('[mantenimiento-api] health: base de datos no disponible: ' . $e->getMessage());
    }

    json_response(200, [
        'status' => $database === 'ok' ? 'ok' : 'degraded',
        'service' => 'mantenimiento-escolar-api',
        'version' => (string) $config['version'],
        'database' => $database,
        'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
    ]);
};
