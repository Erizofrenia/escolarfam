<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\EscuelaController;
use App\Http\Controllers\RecogidaController;
use App\Http\Controllers\MensajeController;
use App\Http\Controllers\NotificacionController;
use App\Http\Controllers\PersonaConfianzaController;
use App\Http\Controllers\AvisoController;
use App\Http\Controllers\ConfigController;
use App\Http\Controllers\ConsultaController;
use App\Http\Controllers\AmigoController;
use App\Http\Controllers\AsistenciaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Test endpoint
Route::get('/test', function () {
    return response()->json(['message' => 'Servidor Laravel funcionando correctamente 🚀']);
});

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/verify-token', [AuthController::class, 'verifyToken']);
    Route::get('/check-username/{username}', [AuthController::class, 'checkUsername']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
});

// Usuarios routes
Route::prefix('usuarios')->group(function () {
    Route::get('/', [UsuarioController::class, 'index']);
    Route::get('/staff/directorio', [UsuarioController::class, 'directorio']);
    Route::get('/escuela/{id}', [UsuarioController::class, 'getByEscuela']);
    Route::get('/escuela/{id}/todos-grupos', [UsuarioController::class, 'getTodosGrupos']);
    Route::get('/escuela/{id}/personal-docente', [UsuarioController::class, 'getPersonalDocente']);
    Route::get('/grupos/{id}/estudiantes', [UsuarioController::class, 'getEstudiantesGrupo']);
    Route::get('/{id}', [UsuarioController::class, 'show']);
    Route::get('/{id}/hijos', [UsuarioController::class, 'getHijos']);
    Route::get('/{id}/padres', [UsuarioController::class, 'getPadres']);
    Route::get('/{id}/grupos-asignados', [UsuarioController::class, 'getGruposAsignados']);
    Route::get('/{id}/grupo', [UsuarioController::class, 'getGrupo']);
    Route::get('/{id}/info-recogida', [UsuarioController::class, 'getInfoRecogida']);
    Route::post('/', [UsuarioController::class, 'store']);
    Route::put('/{id}', [UsuarioController::class, 'update']);
    Route::patch('/{id}/email', [UsuarioController::class, 'updateEmail']);
    Route::post('/{id}/upload-foto', [UsuarioController::class, 'uploadFoto']);
    Route::delete('/{id}', [UsuarioController::class, 'destroy']);
});

// Escuelas routes
Route::prefix('escuelas')->group(function () {
    Route::get('/', [EscuelaController::class, 'index']);
    Route::get('/{id}', [EscuelaController::class, 'show']);
    Route::post('/', [EscuelaController::class, 'store']);
    Route::put('/{id}', [EscuelaController::class, 'update']);
    Route::delete('/{id}', [EscuelaController::class, 'destroy']);
});

// Recogidas routes
Route::prefix('recogidas')->group(function () {
    Route::post('/', [RecogidaController::class, 'store']);
    Route::get('/maestro/{id}', [RecogidaController::class, 'getByMaestro']);
    Route::get('/historial/{id}', [RecogidaController::class, 'getHistorial']);
    Route::get('/hijo/{id}', [RecogidaController::class, 'getByHijo']);
    Route::put('/{id}/aprobar', [RecogidaController::class, 'aprobar']);
    Route::put('/{id}/rechazar', [RecogidaController::class, 'rechazar']);
    Route::put('/{id}/actualizar-persona', [RecogidaController::class, 'actualizarPersona']);
});

// Mensajes routes
Route::prefix('mensajes')->group(function () {
    Route::get('/conversaciones/{idUsuario}', [MensajeController::class, 'getConversaciones']);
    Route::get('/no-leidos/{idUsuario}', [MensajeController::class, 'getNoLeidos']);
    Route::get('/{idUsuario1}/{idUsuario2}', [MensajeController::class, 'getMensajes']);
    Route::post('/', [MensajeController::class, 'store']);
    Route::put('/marcar-leidos/{idRemitente}/{idDestinatario}', [MensajeController::class, 'marcarLeidos']);
});

// Notificaciones routes
Route::prefix('notificaciones')->group(function () {
    Route::get('/{idUsuario}', [NotificacionController::class, 'index']);
    Route::get('/no-leidas/{idUsuario}', [NotificacionController::class, 'getNoLeidas']);
    Route::post('/', [NotificacionController::class, 'store']);
    Route::put('/{id}/leida', [NotificacionController::class, 'marcarLeida']);
    Route::put('/marcar-todas/{idUsuario}', [NotificacionController::class, 'marcarTodasLeidas']);
    Route::delete('/{id}', [NotificacionController::class, 'destroy']);
});

// Personas de confianza routes
Route::prefix('personas-confianza')->group(function () {
    Route::get('/{idPadre}', [PersonaConfianzaController::class, 'index']);
    Route::post('/', [PersonaConfianzaController::class, 'store']);
    Route::put('/{id}', [PersonaConfianzaController::class, 'update']);
    Route::put('/{id}/predeterminada', [PersonaConfianzaController::class, 'setPredeterminada']);
    Route::delete('/{id}', [PersonaConfianzaController::class, 'destroy']);
});

// Avisos routes
Route::prefix('avisos')->group(function () {
    Route::get('/stream', [AvisoController::class, 'stream']);
    Route::post('/', [AvisoController::class, 'store']);
    Route::get('/escuela/{idEscuela}', [AvisoController::class, 'getByEscuela']);
    Route::get('/padre/{idPadre}', [AvisoController::class, 'getByPadre']);
    Route::put('/{id}/estado', [AvisoController::class, 'updateEstado']);
    Route::post('/{id}/responder', [AvisoController::class, 'responder']);
    Route::get('/{id}/respuestas', [AvisoController::class, 'getRespuestas']);
});

// Config routes
Route::prefix('config')->group(function () {
    Route::get('/escuela/{idEscuela}', [ConfigController::class, 'getByEscuela']);
    Route::put('/escuela/{idEscuela}', [ConfigController::class, 'updateByEscuela']);
    Route::post('/escuela/{idEscuela}/logo', [ConfigController::class, 'uploadLogo']);
    Route::get('/escuela/{idEscuela}/logs', [ConfigController::class, 'getLogs']);
    Route::get('/escuela/{idEscuela}/logs/stats', [ConfigController::class, 'getLogsStats']);
    Route::post('/escuela/{idEscuela}/logs', [ConfigController::class, 'createLog']);
});

// Consultas routes
Route::prefix('consultas')->group(function () {
    Route::get('/grupos/{idEscuela}', [ConsultaController::class, 'getGrupos']);
    Route::get('/asignaturas/{idEscuela?}', [ConsultaController::class, 'getAsignaturas']);
    Route::get('/alumnos-grupo/{idGrupo}', [ConsultaController::class, 'getAlumnosGrupo']);
    Route::get('/maestros/{idEscuela}', [ConsultaController::class, 'getMaestros']);
    Route::get('/padres/{idEscuela}', [ConsultaController::class, 'getPadres']);
    Route::get('/buscar-usuarios', [ConsultaController::class, 'buscarUsuarios']);
    Route::get('/estadisticas/{idEscuela}', [ConsultaController::class, 'getEstadisticas']);
    
    // Tickets/consultas endpoints
    Route::get('/escuela/{idEscuela}', [ConsultaController::class, 'getConsultasEscuela']);
    Route::get('/escuela/{idEscuela}/stats', [ConsultaController::class, 'getConsultasStats']);
    Route::get('/escuela/{idEscuela}/export', [ConsultaController::class, 'exportConsultas']);
    Route::post('/', [ConsultaController::class, 'storeConsulta']);
    Route::get('/{id}', [ConsultaController::class, 'getConsulta']);
    Route::post('/{id}/responder', [ConsultaController::class, 'responderConsulta']);
    Route::put('/{id}/archivar', [ConsultaController::class, 'archivarConsulta']);
    Route::put('/{id}/estado', [ConsultaController::class, 'updateEstadoConsulta']);
    Route::delete('/{id}', [ConsultaController::class, 'deleteConsulta']);
});

// Amigos routes
Route::prefix('amigos')->group(function () {
    Route::get('/{idUsuario}', [AmigoController::class, 'index']);
    Route::post('/solicitud', [AmigoController::class, 'enviarSolicitud']);
    Route::get('/buscar/{idUsuario}', [AmigoController::class, 'buscar']);
    Route::delete('/{idUsuario}/{idAmigo}', [AmigoController::class, 'destroy']);
});

// Asistencia routes
Route::prefix('asistencia')->group(function () {
    Route::get('/grupo/{idGrupo}/fecha/{fecha}', [AsistenciaController::class, 'getByGrupoFecha']);
    Route::post('/', [AsistenciaController::class, 'store']);
    Route::post('/masivo', [AsistenciaController::class, 'storeMasivo']);
    Route::get('/alumno/{idAlumno}/mes/{mes?}', [AsistenciaController::class, 'getHistorialAlumno']);
});

// Grupos routes (CRUD)
Route::prefix('grupos')->group(function () {
    Route::get('/escuela/{idEscuela}', [UsuarioController::class, 'getGruposEscuela']);
    Route::get('/{id}', [UsuarioController::class, 'getGrupoDetalle']);
    Route::post('/', [UsuarioController::class, 'createGrupo']);
    Route::put('/{id}', [UsuarioController::class, 'updateGrupo']);
    Route::delete('/{id}', [UsuarioController::class, 'deleteGrupo']);
    Route::post('/{id}/asignar-alumno', [UsuarioController::class, 'asignarAlumnoGrupo']);
    Route::delete('/{idGrupo}/quitar-alumno/{idAlumno}', [UsuarioController::class, 'quitarAlumnoGrupo']);
});

// Relaciones familiares routes
Route::prefix('relaciones')->group(function () {
    Route::get('/alumno/{idAlumno}', [UsuarioController::class, 'getRelacionesAlumno']);
    Route::post('/', [UsuarioController::class, 'createRelacion']);
    Route::delete('/{idPadre}/{idHijo}', [UsuarioController::class, 'deleteRelacion']);
});

// Asignaturas routes (CRUD)
Route::prefix('asignaturas')->group(function () {
    Route::get('/escuela/{idEscuela}', [UsuarioController::class, 'getAsignaturasEscuela']);
    Route::post('/', [UsuarioController::class, 'createAsignatura']);
    Route::put('/{id}', [UsuarioController::class, 'updateAsignatura']);
    Route::delete('/{id}', [UsuarioController::class, 'deleteAsignatura']);
});
