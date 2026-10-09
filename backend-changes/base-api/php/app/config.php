<?php
/**
 * Carga de configuración.
 * Destino previsto: <carpeta privada>/app/config.php
 *
 * Orden de prioridad (de menor a mayor):
 *   1. Valores por defecto de este archivo.
 *   2. Archivo de configuración privado (por defecto ../config/config.php
 *      respecto a app/, o la ruta indicada en MANTENIMIENTO_CONFIG).
 *   3. Variables de entorno (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS,
 *      APP_ENV, ALLOWED_ORIGINS).
 *
 * Las credenciales NUNCA se guardan en el repositorio.
 */

declare(strict_types=1);

function load_config(string $appDir): array
{
    $config = [
        'app_env' => 'production',
        'version' => '0.1.0',
        'db' => [
            'host' => '127.0.0.1',
            'port' => 3306,
            'name' => '',
            'user' => '',
            'pass' => '',
            'charset' => 'utf8mb4',
        ],
        // Orígenes permitidos para CORS. Vacío = solo mismo dominio (recomendado).
        'allowed_origins' => [],
    ];

    $file = getenv('MANTENIMIENTO_CONFIG') ?: dirname($appDir) . '/config/config.php';
    if (is_file($file)) {
        $fromFile = require $file;
        if (is_array($fromFile)) {
            $config = array_replace_recursive($config, $fromFile);
        }
    }

    $envMap = [
        'APP_ENV' => ['app_env'],
        'DB_HOST' => ['db', 'host'],
        'DB_PORT' => ['db', 'port'],
        'DB_NAME' => ['db', 'name'],
        'DB_USER' => ['db', 'user'],
        'DB_PASS' => ['db', 'pass'],
    ];
    foreach ($envMap as $var => $path) {
        $value = getenv($var);
        if ($value === false) {
            continue;
        }
        if (count($path) === 1) {
            $config[$path[0]] = $value;
        } else {
            $config[$path[0]][$path[1]] = $value;
        }
    }
    $origins = getenv('ALLOWED_ORIGINS');
    if ($origins !== false) {
        $config['allowed_origins'] = array_values(array_filter(array_map('trim', explode(',', $origins))));
    }
    $config['db']['port'] = (int) $config['db']['port'];

    return $config;
}
