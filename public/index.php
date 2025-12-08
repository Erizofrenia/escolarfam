<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the request is for API or static files
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// If request is for a static file that exists, let it be served
if ($uri !== '/' && file_exists(__DIR__.$uri)) {
    // Check if it's a PHP file (shouldn't serve directly)
    if (pathinfo($uri, PATHINFO_EXTENSION) === 'php') {
        // Continue to Laravel for PHP files
    } else {
        return false; // Serve the static file directly
    }
}

// If request is NOT for API, serve index.html (SPA)
if (!str_starts_with($uri, '/api')) {
    // Serve the static frontend
    if (file_exists(__DIR__.'/index.html') && $uri === '/') {
        readfile(__DIR__.'/index.html');
        exit;
    }
    // For other non-API routes, also serve index.html (SPA routing)
    if (!file_exists(__DIR__.$uri) && file_exists(__DIR__.'/index.html')) {
        readfile(__DIR__.'/index.html');
        exit;
    }
}

// For API requests, bootstrap Laravel
require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);
