<?php

namespace App\Http\Controllers;

use App\Models\SolicitudRecogida;
use App\Models\Notificacion;
use App\Models\LogActividad;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RecogidaController extends Controller
{
    /**
     * Crear solicitud de recogida
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_padre' => 'required|integer',
            'id_hijo' => 'required|integer'
        ]);

        $idPadre = $request->id_padre;
        $idHijo = $request->id_hijo;
        $observaciones = $request->observaciones;

        // Verificar si ya existe una solicitud pendiente
        $existente = SolicitudRecogida::where('id_padre', $idPadre)
            ->where('id_hijo', $idHijo)
            ->where('estado', 'pendiente')
            ->first();

        if ($existente) {
            return response()->json([
                'message' => 'Ya existe una alerta pendiente para este hijo',
                'ya_existe' => true,
                'id_solicitud' => $existente->id_solicitud
            ]);
        }

        // Obtener información del hijo y su maestro
        $hijoData = DB::table('usuarios as u')
            ->leftJoin('asignaciones_grupos as ag', function ($join) {
                $join->on('u.id_usuario', '=', 'ag.id_usuario')
                    ->where('ag.activa', '=', 1);
            })
            ->leftJoin('grupos as g', 'ag.id_grupo', '=', 'g.id_grupo')
            ->where('u.id_usuario', $idHijo)
            ->select('u.nombre_completo', 'u.id_escuela', 'ag.id_grupo', 'g.id_maestro')
            ->first();

        if (!$hijoData) {
            return response()->json(['message' => 'Hijo no encontrado'], 404);
        }

        // Obtener nombre del padre
        $padre = Usuario::find($idPadre);
        $nombrePadre = $padre ? $padre->nombre_completo : 'Padre de familia';

        // Crear solicitud
        $solicitud = SolicitudRecogida::create([
            'id_padre' => $idPadre,
            'id_hijo' => $idHijo,
            'observaciones' => $observaciones ?? "{$nombrePadre} ha llegado por {$hijoData->nombre_completo}"
        ]);

        // Crear notificación para el maestro
        if ($hijoData->id_maestro) {
            Notificacion::create([
                'id_usuario' => $hijoData->id_maestro,
                'tipo' => 'recogida',
                'titulo' => 'Solicitud de Recogida',
                'contenido' => "{$nombrePadre} ha llegado para recoger a {$hijoData->nombre_completo}"
            ]);
        }

        // Registrar en logs
        LogActividad::registrar([
            'id_usuario' => $idPadre,
            'id_escuela' => $hijoData->id_escuela,
            'accion' => 'Solicitud de recogida creada',
            'tabla_afectada' => 'solicitudes_recogida',
            'id_registro' => $solicitud->id_solicitud,
            'detalles' => [
                'id_hijo' => $idHijo,
                'nombre_hijo' => $hijoData->nombre_completo,
                'id_maestro' => $hijoData->id_maestro
            ]
        ]);

        return response()->json([
            'message' => 'Alerta de recogida enviada exitosamente',
            'id_solicitud' => $solicitud->id_solicitud,
            'ya_existe' => false
        ]);
    }

    /**
     * Obtener solicitudes pendientes para un maestro
     */
    public function getByMaestro($id)
    {
        $solicitudes = DB::table('solicitudes_recogida as sr')
            ->join('usuarios as hijo', 'sr.id_hijo', '=', 'hijo.id_usuario')
            ->join('usuarios as padre', 'sr.id_padre', '=', 'padre.id_usuario')
            ->leftJoin('asignaciones_grupos as ag', function ($join) {
                $join->on('hijo.id_usuario', '=', 'ag.id_usuario')
                    ->where('ag.activa', '=', 1);
            })
            ->leftJoin('grupos as g', 'ag.id_grupo', '=', 'g.id_grupo')
            ->where('g.id_maestro', $id)
            ->where('sr.estado', 'pendiente')
            ->select(
                'sr.*',
                'hijo.nombre_completo as nombre_hijo',
                'hijo.foto_perfil as foto_hijo',
                'padre.nombre_completo as nombre_padre',
                'padre.foto_perfil as foto_padre',
                'g.nombre_grupo'
            )
            ->orderBy('sr.fecha_solicitud', 'desc')
            ->get();

        return response()->json($solicitudes);
    }

    /**
     * Obtener historial del día para un maestro
     */
    public function getHistorial($id)
    {
        $hoy = now()->toDateString();

        $historial = DB::table('solicitudes_recogida as sr')
            ->join('usuarios as hijo', 'sr.id_hijo', '=', 'hijo.id_usuario')
            ->join('usuarios as padre', 'sr.id_padre', '=', 'padre.id_usuario')
            ->leftJoin('asignaciones_grupos as ag', function ($join) {
                $join->on('hijo.id_usuario', '=', 'ag.id_usuario')
                    ->where('ag.activa', '=', 1);
            })
            ->leftJoin('grupos as g', 'ag.id_grupo', '=', 'g.id_grupo')
            ->where('g.id_maestro', $id)
            ->whereDate('sr.fecha_solicitud', $hoy)
            ->select(
                'sr.*',
                'hijo.nombre_completo as nombre_hijo',
                'padre.nombre_completo as nombre_padre',
                'g.nombre_grupo'
            )
            ->orderBy('sr.fecha_solicitud', 'desc')
            ->get();

        return response()->json($historial);
    }

    /**
     * Obtener solicitudes de un hijo
     */
    public function getByHijo($id)
    {
        $solicitudes = SolicitudRecogida::with(['padre', 'aprobador'])
            ->where('id_hijo', $id)
            ->orderBy('fecha_solicitud', 'desc')
            ->get();

        return response()->json($solicitudes);
    }

    /**
     * Aprobar solicitud de recogida
     */
    public function aprobar(Request $request, $id)
    {
        $solicitud = SolicitudRecogida::find($id);

        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        $solicitud->estado = 'aprobada';
        $solicitud->id_aprobador = $request->id_aprobador;
        $solicitud->persona_recoge = $request->nombre_recoge;
        $solicitud->parentesco_recoge = $request->parentesco_recoge;
        $solicitud->save();

        return response()->json(['message' => 'Solicitud aprobada']);
    }

    /**
     * Rechazar solicitud de recogida
     */
    public function rechazar(Request $request, $id)
    {
        $solicitud = SolicitudRecogida::find($id);

        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        $solicitud->estado = 'rechazada';
        $solicitud->id_aprobador = $request->id_aprobador;
        $solicitud->save();

        return response()->json(['message' => 'Solicitud rechazada']);
    }

    /**
     * Actualizar persona que recoge
     */
    public function actualizarPersona(Request $request, $id)
    {
        $solicitud = SolicitudRecogida::find($id);

        if (!$solicitud) {
            return response()->json(['message' => 'Solicitud no encontrada'], 404);
        }

        $solicitud->persona_recoge = $request->persona_recoge;
        $solicitud->parentesco_recoge = $request->parentesco_recoge;
        $solicitud->save();

        return response()->json(['message' => 'Persona alternativa actualizada']);
    }
}
