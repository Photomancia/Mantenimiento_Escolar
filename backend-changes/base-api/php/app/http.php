<?php
/**
 * Utilidades HTTP: respuestas JSON, errores con formato estándar, CORS y enrutado.
 * Destino previsto: <carpeta privada>/app/http.php
 */

declare(strict_types=1);

function send_common_headers(): void
{
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    header('Referrer-Policy: no-referrer');
}

function json_response(int $status, array $body): void
{
    http_response_code($status);
    send_common_headers();
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
}

/** Error con el formato del contrato: { "error": { "code", "message", "fields"? } } */
function json_error(int $status, string $code, string $message, ?array $fields = null): void
{
    $error = ['code' => $code, 'message' => $message];
    if ($fields !== null) {
        $error['fields'] = $fields;
    }
    json_response($status, ['error' => $error]);
}

/**
 * Añade cabeceras CORS solo si el origen está en la lista permitida.
 * Con la lista vacía (recomendado: frontend y API en el mismo dominio) no se
 * añade ninguna cabecera y el navegador bloquea peticiones de otros orígenes.
 */
function apply_cors(array $allowedOrigins): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Accept, X-CSRF-Token');
    }
}

/** Ruta solicitada relativa a la carpeta del front controller (p. ej. "/health"). */
function request_path(): string
{
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $base = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');
    if ($base !== '' && str_starts_with($path, $base)) {
        $path = substr($path, strlen($base));
    }
    if (str_starts_with($path, '/index.php')) {
        $path = substr($path, strlen('/index.php'));
    }
    $path = '/' . trim($path, '/');
    return $path;
}

/**
 * Despacha la petición a un manejador. $routes: ["MÉTODO /ruta" => archivo.php].
 * Cada archivo de manejador debe devolver una función fn(array $config): void.
 */
function dispatch(array $routes, array $config): void
{
    apply_cors($config['allowed_origins']);

    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $path = request_path();

    if ($method === 'OPTIONS') {
        http_response_code(204);
        return;
    }

    $key = $method . ' ' . $path;
    if (isset($routes[$key])) {
        $handler = require $routes[$key];
        $handler($config);
        return;
    }

    $allowed = [];
    foreach (array_keys($routes) as $route) {
        [$routeMethod, $routePath] = explode(' ', $route, 2);
        if ($routePath === $path) {
            $allowed[] = $routeMethod;
        }
    }
    if ($allowed !== []) {
        header('Allow: ' . implode(', ', $allowed));
        json_error(405, 'METHOD_NOT_ALLOWED', 'Método no permitido.');
        return;
    }

    json_error(404, 'NOT_FOUND', 'Recurso no encontrado.');
}
