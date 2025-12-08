<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ConsultaController extends Controller
{
    /**
     * Obtener grupos de una escuela
     */
    public function getGrupos($idEscuela)
    {
        $grupos = DB::table('grupos as g')
            ->leftJoin('usuarios as m', 'g.id_maestro', '=', 'm.id_usuario')
            ->where('g.id_escuela', $idEscuela)
            ->where('g.activo', 1)
            ->select(
                'g.*',
                'm.nombre_completo as nombre_maestro'
            )
            ->orderBy('g.nivel')
            ->orderBy('g.grado')
            ->orderBy('g.seccion')
            ->get();

        return response()->json($grupos);
    }

    /**
     * Obtener asignaturas de una escuela
     */
    public function getAsignaturas($idEscuela = null)
    {
        $query = DB::table('asignaturas')->where('activa', 1);

        if ($idEscuela) {
            $query->where(function ($q) use ($idEscuela) {
                $q->where('id_escuela', $idEscuela)
                  ->orWhereNull('id_escuela');
            });
        }

        $asignaturas = $query->orderBy('nombre_asignatura')->get();

        return response()->json($asignaturas);
    }

    /**
     * Obtener alumnos de un grupo
     */
    public function getAlumnosGrupo($idGrupo)
    {
        $alumnos = DB::table('asignaciones_grupos as ag')
            ->join('usuarios as u', 'ag.id_usuario', '=', 'u.id_usuario')
            ->where('ag.id_grupo', $idGrupo)
            ->where('ag.activa', 1)
            ->where('u.rol', 'alumno')
            ->where('u.activo', 1)
            ->select(
                'u.id_usuario',
                'u.nombre_completo',
                'u.foto_perfil',
                'u.email'
            )
            ->orderBy('u.nombre_completo')
            ->get();

        return response()->json($alumnos);
    }

    /**
     * Obtener maestros de una escuela
     */
    public function getMaestros($idEscuela)
    {
        $maestros = DB::table('usuarios')
            ->where('id_escuela', $idEscuela)
            ->where('rol', 'maestro')
            ->where('activo', 1)
            ->select('id_usuario', 'nombre_completo', 'foto_perfil', 'email', 'asignacion')
            ->orderBy('nombre_completo')
            ->get();

        return response()->json($maestros);
    }

    /**
     * Obtener padres de una escuela
     */
    public function getPadres($idEscuela)
    {
        $padres = DB::table('usuarios')
            ->where('id_escuela', $idEscuela)
            ->where('rol', 'padre')
            ->where('activo', 1)
            ->select('id_usuario', 'nombre_completo', 'foto_perfil', 'email')
            ->orderBy('nombre_completo')
            ->get();

        return response()->json($padres);
    }

    /**
     * Buscar usuarios por nombre
     */
    public function buscarUsuarios(Request $request)
    {
        $query = $request->query('q', '');
        $rol = $request->query('rol');
        $idEscuela = $request->query('id_escuela');

        $usuarios = DB::table('usuarios')
            ->where('activo', 1)
            ->where('nombre_completo', 'like', "%{$query}%")
            ->when($rol, function ($q) use ($rol) {
                return $q->where('rol', $rol);
            })
            ->when($idEscuela, function ($q) use ($idEscuela) {
                return $q->where('id_escuela', $idEscuela);
            })
            ->select('id_usuario', 'nombre_completo', 'rol', 'foto_perfil')
            ->limit(20)
            ->get();

        return response()->json($usuarios);
    }

    /**
     * Estadísticas generales de una escuela
     */
    public function getEstadisticas($idEscuela)
    {
        $stats = [
            'total_alumnos' => DB::table('usuarios')
                ->where('id_escuela', $idEscuela)
                ->where('rol', 'alumno')
                ->where('activo', 1)
                ->count(),
            'total_maestros' => DB::table('usuarios')
                ->where('id_escuela', $idEscuela)
                ->where('rol', 'maestro')
                ->where('activo', 1)
                ->count(),
            'total_padres' => DB::table('usuarios')
                ->where('id_escuela', $idEscuela)
                ->where('rol', 'padre')
                ->where('activo', 1)
                ->count(),
            'total_grupos' => DB::table('grupos')
                ->where('id_escuela', $idEscuela)
                ->where('activo', 1)
                ->count(),
            'recogidas_hoy' => DB::table('solicitudes_recogida as sr')
                ->join('usuarios as h', 'sr.id_hijo', '=', 'h.id_usuario')
                ->where('h.id_escuela', $idEscuela)
                ->whereDate('sr.fecha_solicitud', now()->toDateString())
                ->count(),
            'tickets_abiertos' => DB::table('consultas_tickets')
                ->where('id_escuela', $idEscuela)
                ->whereIn('estado', ['abierto', 'en_proceso'])
                ->count()
        ];

        return response()->json($stats);
    }

    // ========== ENDPOINTS DE CONSULTAS/TICKETS ==========

    /**
     * Obtener consultas/tickets de una escuela
     */
    public function getConsultasEscuela($idEscuela, Request $request)
    {
        $query = DB::table('consultas_tickets as c')
            ->leftJoin('usuarios as u', 'c.id_usuario', '=', 'u.id_usuario')
            ->where('c.id_escuela', $idEscuela);

        // Filtros opcionales
        if ($request->has('estado') && $request->estado !== 'todos') {
            $query->where('c.estado', $request->estado);
        }
        if ($request->has('categoria')) {
            $query->where('c.categoria', $request->categoria);
        }
        
        // Filtro de archivados - el estado 'archivado' es parte del enum
        if ($request->has('archivados')) {
            $archivados = $request->archivados == 'true' || $request->archivados == '1';
            if ($archivados) {
                $query->where('c.estado', 'archivado');
            } else {
                $query->where('c.estado', '!=', 'archivado');
            }
        } else {
            // Por defecto no mostrar archivados
            $query->where('c.estado', '!=', 'archivado');
        }

        $consultas = $query->select(
            'c.id_ticket',
            'c.id_usuario',
            'c.id_escuela',
            'c.asunto',
            'c.contenido',
            'c.categoria',
            'c.prioridad',
            'c.estado',
            'c.fecha_creacion',
            'c.fecha_actualizacion',
            'u.nombre_completo as usuario_nombre',
            'u.rol as usuario_rol',
            'u.foto_perfil as usuario_foto'
        )
        ->orderBy('c.fecha_creacion', 'desc')
        ->get();

        return response()->json($consultas);
    }

    /**
     * Crear una nueva consulta/ticket
     */
    public function storeConsulta(Request $request)
    {
        $request->validate([
            'id_escuela' => 'required|integer',
            'id_usuario' => 'required|integer',
            'asunto' => 'required|string',
            'contenido' => 'required|string'
        ]);

        // Mapear prioridad del frontend a los valores válidos de la BD
        $prioridadMap = [
            'normal' => 'media',
            'urgente' => 'alta',
            'baja' => 'baja',
            'media' => 'media',
            'alta' => 'alta'
        ];
        $prioridad = $prioridadMap[$request->prioridad] ?? 'media';

        // Mapear categoría a valores válidos del enum
        $categoriaMap = [
            'tecnico' => 'tecnico',
            'academico' => 'academico',
            'administrativo' => 'administrativo',
            'general' => 'general'
        ];
        $categoria = $categoriaMap[$request->categoria] ?? 'general';

        $id = DB::table('consultas_tickets')->insertGetId([
            'id_escuela' => $request->id_escuela,
            'id_usuario' => $request->id_usuario,
            'asunto' => $request->asunto,
            'contenido' => $request->contenido,
            'categoria' => $categoria,
            'prioridad' => $prioridad,
            'estado' => 'abierto',
            'fecha_creacion' => now()
        ]);

        return response()->json([
            'message' => 'Consulta creada',
            'id' => $id
        ], 201);
    }

    /**
     * Obtener una consulta específica
     */
    public function getConsulta($id)
    {
        $consulta = DB::table('consultas_tickets as c')
            ->leftJoin('usuarios as u', 'c.id_usuario', '=', 'u.id_usuario')
            ->where('c.id_ticket', $id)
            ->select(
                'c.id_ticket',
                'c.id_usuario',
                'c.id_escuela',
                'c.asunto',
                'c.contenido',
                'c.categoria',
                'c.prioridad',
                'c.estado',
                'c.fecha_creacion',
                'c.fecha_actualizacion',
                'u.nombre_completo as usuario_nombre',
                'u.rol as usuario_rol',
                'u.foto_perfil as usuario_foto'
            )
            ->first();

        if (!$consulta) {
            return response()->json(['message' => 'Consulta no encontrada'], 404);
        }

        // Obtener respuestas de la tabla respuestas_tickets
        $respuestas = DB::table('respuestas_tickets as r')
            ->join('usuarios as u', 'r.id_usuario', '=', 'u.id_usuario')
            ->where('r.id_ticket', $id)
            ->select(
                'r.id_respuesta',
                'r.id_ticket',
                'r.id_usuario',
                'r.contenido',
                'r.fecha_respuesta',
                'u.nombre_completo as usuario_nombre',
                'u.rol as usuario_rol',
                'u.foto_perfil as usuario_foto'
            )
            ->orderBy('r.fecha_respuesta', 'asc')
            ->get();

        $consulta->respuestas = $respuestas;

        return response()->json($consulta);
    }

    /**
     * Responder a una consulta
     */
    public function responderConsulta(Request $request, $id)
    {
        $request->validate([
            'id_usuario' => 'required|integer',
            'contenido' => 'required|string'
        ]);

        // Verificar que existe la consulta
        $consulta = DB::table('consultas_tickets')->where('id_ticket', $id)->first();
        if (!$consulta) {
            return response()->json(['message' => 'Consulta no encontrada'], 404);
        }

        // Insertar respuesta en la tabla correcta: respuestas_tickets
        $respuestaId = DB::table('respuestas_tickets')->insertGetId([
            'id_ticket' => $id,
            'id_usuario' => $request->id_usuario,
            'contenido' => $request->contenido,
            'fecha_respuesta' => now()
        ]);

        // Actualizar estado a "respondido" si estaba "abierto" o "en_proceso"
        if (in_array($consulta->estado, ['abierto', 'en_proceso'])) {
            DB::table('consultas_tickets')
                ->where('id_ticket', $id)
                ->update([
                    'estado' => 'respondido',
                    'fecha_actualizacion' => now()
                ]);
        }

        return response()->json([
            'message' => 'Respuesta agregada',
            'id' => $respuestaId
        ], 201);
    }

    /**
     * Archivar una consulta (cambiar estado a 'archivado')
     */
    public function archivarConsulta($id)
    {
        $updated = DB::table('consultas_tickets')
            ->where('id_ticket', $id)
            ->update([
                'estado' => 'archivado',
                'fecha_actualizacion' => now()
            ]);

        if (!$updated) {
            return response()->json(['message' => 'Consulta no encontrada'], 404);
        }

        return response()->json(['message' => 'Consulta archivada']);
    }

    /**
     * Cambiar estado de una consulta
     */
    public function updateEstadoConsulta(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:abierto,en_proceso,respondido,archivado'
        ]);

        $updated = DB::table('consultas_tickets')
            ->where('id_ticket', $id)
            ->update([
                'estado' => $request->estado,
                'fecha_actualizacion' => now()
            ]);

        if (!$updated) {
            return response()->json(['message' => 'Consulta no encontrada'], 404);
        }

        return response()->json(['message' => 'Estado actualizado']);
    }

    /**
     * Estadísticas de consultas por escuela
     */
    public function getConsultasStats($idEscuela)
    {
        $stats = [
            'total' => DB::table('consultas_tickets')
                ->where('id_escuela', $idEscuela)
                ->count(),
            'abiertos' => DB::table('consultas_tickets')
                ->where('id_escuela', $idEscuela)
                ->where('estado', 'abierto')
                ->count(),
            'en_proceso' => DB::table('consultas_tickets')
                ->where('id_escuela', $idEscuela)
                ->where('estado', 'en_proceso')
                ->count(),
            'respondidos' => DB::table('consultas_tickets')
                ->where('id_escuela', $idEscuela)
                ->where('estado', 'respondido')
                ->count(),
            'archivados' => DB::table('consultas_tickets')
                ->where('id_escuela', $idEscuela)
                ->where('estado', 'archivado')
                ->count(),
            'por_categoria' => DB::table('consultas_tickets')
                ->where('id_escuela', $idEscuela)
                ->select('categoria', DB::raw('COUNT(*) as total'))
                ->groupBy('categoria')
                ->get()
        ];

        return response()->json($stats);
    }

    /**
     * Exportar consultas (devuelve datos para CSV/Excel)
     */
    public function exportConsultas($idEscuela, Request $request)
    {
        $query = DB::table('consultas_tickets as c')
            ->leftJoin('usuarios as u', 'c.id_usuario', '=', 'u.id_usuario')
            ->leftJoin(DB::raw('(SELECT id_ticket, COUNT(*) as num_respuestas FROM respuestas_tickets GROUP BY id_ticket) r'), 'c.id_ticket', '=', 'r.id_ticket')
            ->where('c.id_escuela', $idEscuela);

        if ($request->has('estado') && $request->estado !== 'todos') {
            $query->where('c.estado', $request->estado);
        }
        if ($request->has('fecha_inicio')) {
            $query->whereDate('c.fecha_creacion', '>=', $request->fecha_inicio);
        }
        if ($request->has('fecha_fin')) {
            $query->whereDate('c.fecha_creacion', '<=', $request->fecha_fin);
        }

        $consultas = $query->select(
            'c.id_ticket',
            'u.nombre_completo as usuario',
            'u.rol as rol_usuario',
            'c.asunto',
            'c.contenido',
            'c.categoria',
            'c.prioridad',
            'c.estado',
            'c.fecha_creacion',
            'c.fecha_actualizacion',
            DB::raw('COALESCE(r.num_respuestas, 0) as num_respuestas')
        )
        ->orderBy('c.fecha_creacion', 'desc')
        ->get();

        return response()->json($consultas);
    }

    /**
     * Eliminar una consulta/ticket
     */
    public function deleteConsulta($id)
    {
        // Primero eliminar las respuestas asociadas
        DB::table('respuestas_tickets')->where('id_ticket', $id)->delete();
        
        // Luego eliminar el ticket
        $deleted = DB::table('consultas_tickets')->where('id_ticket', $id)->delete();

        if (!$deleted) {
            return response()->json(['message' => 'Consulta no encontrada'], 404);
        }

        return response()->json(['message' => 'Consulta eliminada']);
    }
}
