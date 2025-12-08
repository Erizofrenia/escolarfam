<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Deshabilitar CSRF para API
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Siempre devolver JSON para rutas API
        $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
            return $request->is('api/*') || $request->expectsJson();
        });
        
        // Manejar errores de conexión a BD
        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                $status = 500;
                $message = 'Error interno del servidor';
                
                if ($e instanceof \Illuminate\Database\QueryException) {
                    $message = 'Error de conexión a la base de datos. Verifica que MySQL esté corriendo.';
                } elseif ($e instanceof NotFoundHttpException) {
                    $status = 404;
                    $message = 'Ruta no encontrada';
                } elseif ($e instanceof \Illuminate\Validation\ValidationException) {
                    return response()->json([
                        'message' => 'Error de validación',
                        'errors' => $e->errors()
                    ], 422);
                }
                
                return response()->json([
                    'message' => $message,
                    'error' => config('app.debug') ? $e->getMessage() : null
                ], $status);
            }
        });
    })->create();
