<?php
/**
 * PLANTILLA de configuración. Copiar como config.php en la carpeta privada
 * (fuera de public_html) y rellenar con los datos del entorno.
 *
 *   Local:      backend-changes/base-api/php/config/config.php (ignorado por Git)
 *   Producción: p. ej. /home/<usuario>/mantenimiento_app/config/config.php
 *
 * NUNCA subir config.php con datos reales a GitHub.
 */

return [
    // 'development' en local, 'production' en Hostinger.
    'app_env' => 'development',

    'db' => [
        'host' => '127.0.0.1',
        'port' => 3306,
        'name' => 'mantenimiento_escolar_local',
        'user' => 'CAMBIAR_USUARIO',
        'pass' => 'CAMBIAR_CONTRASEÑA',
        'charset' => 'utf8mb4',
    ],

    // Solo si el frontend se sirve desde OTRO dominio. Con el mismo dominio, dejar vacío.
    'allowed_origins' => [],
];
