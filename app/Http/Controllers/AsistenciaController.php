<?php

namespace App\Http\Controllers;

use App\Models\Asistencia;
use App\Models\Notificacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AsistenciaController extends Controller
{
    /**
     * Obtener asistencia de un grupo por fecha
     */
    public function getByGrupoFecha($idGrupo, $fecha)
    {
        // Obtener alumnos del grupo
        $alumnos = DB::table('asignaciones_grupos as ag')
            ->join('usuarios as u', 'ag.id_usuario', '=', 'u.id_usuario')
            ->leftJoin('asistencia as a', function ($join) use ($fecha) {
                $join->on('u.id_usuario', '=', 'a.id_alumno')
                    ->where('a.fecha', '=', $fecha);
            })
            ->where('ag.id_grupo', $idGrupo)
            ->where('ag.activa', 1)
            ->where('u.rol', 'alumno')
            ->where('u.activo', 1)
            ->select(
                'u.id_usuario',
                'u.nombre_completo',
                'u.foto_perfil',
                'a.id_asistencia',
                'a.estado',
                'a.observaciones',
                'a.hora_registro'
            )
            ->orderBy('u.nombre_completo')
            ->get();

        return response()->json($alumnos);
    }

    /**
     * Registrar asistencia
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_alumno' => 'required|integer',
            'estado' => 'required|in:presente,tarde,ausente,justificado',
            'fecha' => 'required|date'
        ]);

        $idAlumno = $request->id_alumno;
        $fecha = $request->fecha;

        // Verificar si ya existe registro para ese alumno y fecha
        $existente = Asistencia::where('id_alumno', $idAlumno)
            ->where('fecha', $fecha)
            ->first();

        if ($existente) {
            // Actualizar registro existente
            $existente->estado = $request->estado;
            $existente->id_maestro = $request->id_maestro;
            $existente->observaciones = $request->observaciones;
            $existente->save();

            return response()->json([
                'message' => 'Asistencia actualizada',
                'id' => $existente->id_asistencia
            ]);
        }

        // Crear nuevo registro
        $asistencia = Asistencia::create([
            'id_alumno' => $idAlumno,
            'id_maestro' => $request->id_maestro,
            'estado' => $request->estado,
            'fecha' => $fecha,
            'observaciones' => $request->observaciones
        ]);

        // Notificar a los padres si el alumno está ausente
        if (in_array($request->estado, ['ausente', 'tarde'])) {
            $this->notificarPadres($idAlumno, $request->estado, $fecha);
        }

        return response()->json([
            'message' => 'Asistencia registrada',
            'id' => $asistencia->id_asistencia
        ], 201);
    }

    /**
     * Registrar asistencia masiva
     */
    public function storeMasivo(Request $request)
    {
        $request->validate([
            'fecha' => 'required|date',
            'id_maestro' => 'required|integer',
            'asistencias' => 'required|array'
        ]);

        $fecha = $request->fecha;
        $idMaestro = $request->id_maestro;
        $registrados = 0;

        foreach ($request->asistencias as $item) {
            $existente = Asistencia::where('id_alumno', $item['id_alumno'])
                ->where('fecha', $fecha)
                ->first();

            if ($existente) {
                $existente->estado = $item['estado'];
                $existente->id_maestro = $idMaestro;
                $existente->observaciones = $item['observaciones'] ?? null;
                $existente->save();
            } else {
                Asistencia::create([
                    'id_alumno' => $item['id_alumno'],
                    'id_maestro' => $idMaestro,
                    'estado' => $item['estado'],
                    'fecha' => $fecha,
                    'observaciones' => $item['observaciones'] ?? null
                ]);
            }

            // Notificar si está ausente o tarde
            if (in_array($item['estado'], ['ausente', 'tarde'])) {
                $this->notificarPadres($item['id_alumno'], $item['estado'], $fecha);
            }

            $registrados++;
        }

        return response()->json([
            'message' => "Asistencia registrada para {$registrados} alumnos"
        ]);
    }

    /**
     * Obtener historial de asistencia de un alumno
     */
    public function getHistorialAlumno($idAlumno, $mes = null)
    {
        $query = Asistencia::where('id_alumno', $idAlumno);

        if ($mes) {
            $query->whereMonth('fecha', $mes);
        }

        $historial = $query->orderBy('fecha', 'desc')->get();

        // Calcular resumen
        $resumen = [
            'presente' => $historial->where('estado', 'presente')->count(),
            'tarde' => $historial->where('estado', 'tarde')->count(),
            'ausente' => $historial->where('estado', 'ausente')->count(),
            'justificado' => $historial->where('estado', 'justificado')->count(),
            'total' => $historial->count()
        ];

        return response()->json([
            'historial' => $historial,
            'resumen' => $resumen
        ]);
    }

    /**
     * Notificar a los padres sobre ausencia/tardanza
     */
    private function notificarPadres($idAlumno, $estado, $fecha)
    {
        // Obtener padres del alumno
        $padres = DB::table('relaciones_familiares as rf')
            ->join('usuarios as p', 'rf.id_padre', '=', 'p.id_usuario')
            ->where('rf.id_hijo', $idAlumno)
            ->where('p.activo', 1)
            ->pluck('p.id_usuario');

        // Obtener nombre del alumno
        $alumno = DB::table('usuarios')
            ->where('id_usuario', $idAlumno)
            ->select('nombre_completo')
            ->first();

        $titulo = $estado === 'ausente' ? 'Ausencia registrada' : 'Llegada tardía';
        $contenido = $estado === 'ausente'
            ? "{$alumno->nombre_completo} fue marcado como ausente el día {$fecha}"
            : "{$alumno->nombre_completo} llegó tarde el día {$fecha}";

        foreach ($padres as $idPadre) {
            Notificacion::create([
                'id_usuario' => $idPadre,
                'tipo' => 'alerta',
                'titulo' => $titulo,
                'contenido' => $contenido
            ]);
        }
    }
}
