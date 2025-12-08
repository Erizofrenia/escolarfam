<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use Illuminate\Http\Request;

class NotificacionController extends Controller
{
    /**
     * Obtener notificaciones de un usuario
     */
    public function index($idUsuario)
    {
        $notificaciones = Notificacion::where('id_usuario', $idUsuario)
            ->orderBy('fecha_creacion', 'desc')
            ->get();

        return response()->json($notificaciones);
    }

    /**
     * Crear notificación
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_usuario' => 'required|integer',
            'tipo' => 'required|in:recogida,mensaje,alerta,sistema',
            'titulo' => 'required|string'
        ]);

        $notificacion = Notificacion::create($request->all());

        return response()->json([
            'message' => 'Notificación creada',
            'id' => $notificacion->id_notificacion
        ], 201);
    }

    /**
     * Marcar notificación como leída
     */
    public function marcarLeida($id)
    {
        $notificacion = Notificacion::find($id);

        if (!$notificacion) {
            return response()->json(['message' => 'Notificación no encontrada'], 404);
        }

        $notificacion->leida = true;
        $notificacion->save();

        return response()->json(['message' => 'Notificación marcada como leída']);
    }

    /**
     * Marcar todas las notificaciones como leídas
     */
    public function marcarTodasLeidas($idUsuario)
    {
        Notificacion::where('id_usuario', $idUsuario)
            ->where('leida', 0)
            ->update(['leida' => 1]);

        return response()->json(['message' => 'Todas las notificaciones marcadas como leídas']);
    }

    /**
     * Obtener contador de no leídas
     */
    public function getNoLeidas($idUsuario)
    {
        $total = Notificacion::where('id_usuario', $idUsuario)
            ->where('leida', 0)
            ->count();

        return response()->json(['total' => $total]);
    }

    /**
     * Eliminar notificación
     */
    public function destroy($id)
    {
        $notificacion = Notificacion::find($id);

        if (!$notificacion) {
            return response()->json(['message' => 'Notificación no encontrada'], 404);
        }

        $notificacion->delete();

        return response()->json(['message' => 'Notificación eliminada']);
    }
}
