<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Notificacion;

class AvisoController extends Controller
{
    // Mapeos de tipos de aviso
    private $tipoAvisoToCategoria = [
        'llegar_tarde' => 'academico',
        'enfermo' => 'academico',
        'emergencia' => 'administrativo',
        'cita_medica' => 'academico',
        'tarea_pendiente' => 'academico',
        'material_faltante' => 'academico',
        'evento_familiar' => 'administrativo',
        'cambio_recogida' => 'administrativo',
        'general' => 'general',
        'personalizado' => 'general'
    ];

    private $tipoAvisoToPrioridad = [
        'llegar_tarde' => 'alta',
        'enfermo' => 'alta',
        'emergencia' => 'alta',
        'cita_medica' => 'media',
        'tarea_pendiente' => 'baja',
        'material_faltante' => 'baja',
        'evento_familiar' => 'media',
        'cambio_recogida' => 'alta',
        'general' => 'baja',
        'personalizado' => 'media'
    ];

    private $tipoAvisoToTitulo = [
        'llegar_tarde' => 'Llegada Tardía',
        'enfermo' => 'Alumno Enfermo',
        'emergencia' => 'Emergencia Familiar',
        'cita_medica' => 'Cita Médica',
        'tarea_pendiente' => 'Tarea Pendiente',
        'material_faltante' => 'Material Faltante',
        'evento_familiar' => 'Evento Familiar',
        'cambio_recogida' => 'Cambio en Recogida',
        'general' => 'Aviso General',
        'personalizado' => 'Aviso Personalizado'
    ];

    /**
     * Crear nuevo aviso (ticket + mensajes)
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_padre' => 'required|integer',
            'id_hijo' => 'required|integer',
            'tipo_aviso' => 'required|string',
            'mensaje' => 'required|string',
            'id_escuela' => 'required|integer'
        ]);

        $idPadre = $request->id_padre;
        $idHijo = $request->id_hijo;
        $tipoAviso = $request->tipo_aviso;
        $mensaje = $request->mensaje;
        $idEscuela = $request->id_escuela;

        // Obtener datos del padre e hijo
        $padre = DB::table('usuarios')
            ->where('id_usuario', $idPadre)
            ->select('nombre_completo', 'email')
            ->first();

        $hijo = DB::table('usuarios')
            ->where('id_usuario', $idHijo)
            ->select('nombre_completo')
            ->first();

        if (!$padre || !$hijo) {
            return response()->json(['error' => 'Padre o hijo no encontrado'], 404);
        }

        // 1. Crear ticket
        $categoria = $this->tipoAvisoToCategoria[$tipoAviso] ?? 'general';
        $prioridad = $this->tipoAvisoToPrioridad[$tipoAviso] ?? 'media';
        $tituloTipo = $this->tipoAvisoToTitulo[$tipoAviso] ?? 'Aviso';

        $asunto = "{$tituloTipo} - {$hijo->nombre_completo}";
        $contenido = "**Tipo de aviso:** {$tituloTipo}\n**Estudiante:** {$hijo->nombre_completo}\n**Padre/Madre:** {$padre->nombre_completo} ({$padre->email})\n**Mensaje:**\n{$mensaje}";

        $ticketId = DB::table('consultas_tickets')->insertGetId([
            'id_usuario' => $idPadre,
            'id_escuela' => $idEscuela,
            'asunto' => $asunto,
            'contenido' => $contenido,
            'categoria' => $categoria,
            'prioridad' => $prioridad,
            'estado' => 'abierto',
            'fecha_creacion' => now()
        ]);

        // 2. Obtener maestros del hijo
        $maestros = DB::table('asignaciones_grupos as ag')
            ->join('grupos as g', 'ag.id_grupo', '=', 'g.id_grupo')
            ->join('usuarios as m', 'g.id_maestro', '=', 'm.id_usuario')
            ->where('ag.id_usuario', $idHijo)
            ->where('ag.activa', 1)
            ->select('m.id_usuario', 'm.nombre_completo')
            ->get();

        // 3. Enviar mensaje y notificación a cada maestro
        $mensajesEnviados = 0;
        foreach ($maestros as $maestro) {
            // Crear mensaje
            DB::table('mensajes')->insert([
                'id_remitente' => $idPadre,
                'id_destinatario' => $maestro->id_usuario,
                'asunto' => $asunto,
                'contenido' => $mensaje,
                'tipo' => 'sistema',
                'fecha_envio' => now()
            ]);

            // Crear notificación
            Notificacion::create([
                'id_usuario' => $maestro->id_usuario,
                'tipo' => 'alerta',
                'titulo' => $asunto,
                'contenido' => "Aviso de {$padre->nombre_completo} sobre {$hijo->nombre_completo}"
            ]);

            $mensajesEnviados++;
        }

        return response()->json([
            'success' => true,
            'id_ticket' => $ticketId,
            'maestros_notificados' => $mensajesEnviados,
            'message' => "Aviso enviado a {$mensajesEnviados} maestro(s)"
        ]);
    }

    /**
     * Obtener avisos de una escuela
     */
    public function getByEscuela($idEscuela)
    {
        $avisos = DB::table('consultas_tickets as ct')
            ->join('usuarios as u', 'ct.id_usuario', '=', 'u.id_usuario')
            ->where('ct.id_escuela', $idEscuela)
            ->select('ct.*', 'u.nombre_completo as nombre_usuario')
            ->orderBy('ct.fecha_creacion', 'desc')
            ->get();

        return response()->json($avisos);
    }

    /**
     * Obtener avisos enviados por un padre
     */
    public function getByPadre($idPadre)
    {
        $avisos = DB::table('consultas_tickets')
            ->where('id_usuario', $idPadre)
            ->orderBy('fecha_creacion', 'desc')
            ->get();

        return response()->json($avisos);
    }

    /**
     * Actualizar estado de un ticket/aviso
     */
    public function updateEstado(Request $request, $id)
    {
        DB::table('consultas_tickets')
            ->where('id_ticket', $id)
            ->update([
                'estado' => $request->estado,
                'fecha_actualizacion' => now()
            ]);

        return response()->json(['message' => 'Estado actualizado']);
    }

    /**
     * Responder a un ticket
     */
    public function responder(Request $request, $id)
    {
        $request->validate([
            'id_usuario' => 'required|integer',
            'contenido' => 'required|string'
        ]);

        DB::table('respuestas_tickets')->insert([
            'id_ticket' => $id,
            'id_usuario' => $request->id_usuario,
            'contenido' => $request->contenido,
            'fecha_respuesta' => now()
        ]);

        // Actualizar estado del ticket
        DB::table('consultas_tickets')
            ->where('id_ticket', $id)
            ->update([
                'estado' => 'respondido',
                'fecha_actualizacion' => now()
            ]);

        return response()->json(['message' => 'Respuesta enviada']);
    }

    /**
     * Obtener respuestas de un ticket
     */
    public function getRespuestas($id)
    {
        $respuestas = DB::table('respuestas_tickets as rt')
            ->join('usuarios as u', 'rt.id_usuario', '=', 'u.id_usuario')
            ->where('rt.id_ticket', $id)
            ->select('rt.*', 'u.nombre_completo', 'u.rol', 'u.foto_perfil')
            ->orderBy('rt.fecha_respuesta', 'asc')
            ->get();

        return response()->json($respuestas);
    }

    /**
     * Stream de avisos (simulación de SSE con polling)
     * En PHP estándar no es práctico usar SSE, así que devolvemos los avisos recientes
     */
    public function stream(Request $request)
    {
        $idEscuela = $request->query('id_escuela');
        $lastId = $request->query('last_id', 0);
        $roles = $request->query('roles', '');

        $query = DB::table('consultas_tickets as t')
            ->leftJoin('usuarios as u', 't.id_usuario', '=', 'u.id_usuario')
            ->where('t.id_escuela', $idEscuela)
            ->where('t.id_ticket', '>', $lastId)
            ->whereIn('t.estado', ['abierto', 'pendiente', 'en_proceso']);

        $avisos = $query->select(
            't.*',
            'u.nombre_completo',
            'u.rol',
            'u.foto_perfil'
        )
        ->orderBy('t.fecha_creacion', 'desc')
        ->limit(50)
        ->get();

        return response()->json([
            'avisos' => $avisos,
            'timestamp' => now()->toISOString()
        ]);
    }
}
