<?php
/**
 * Conexión a MySQL/MariaDB mediante PDO.
 * Destino previsto: <carpeta privada>/app/db.php
 *
 * Usar SIEMPRE consultas preparadas ($pdo->prepare + execute) con datos externos.
 */

declare(strict_types=1);

function db_connect(array $db): PDO
{
    if ($db['name'] === '' || $db['user'] === '') {
        throw new RuntimeException('Configuración de base de datos incompleta.');
    }

    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $db['host'],
        $db['port'],
        $db['name'],
        $db['charset']
    );

    return new PDO($dsn, $db['user'], $db['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_TIMEOUT => 5,
    ]);
}
