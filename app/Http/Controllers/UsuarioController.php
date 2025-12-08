<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\RelacionFamiliar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UsuarioController extends Controller
{
    /**
     * Obtener todos los usuarios
     */
    public function index()
    {
        $usuarios = Usuario::all();
        return response()->json($usuarios);
    }

    /**
     * Directorio de staff (maestros y admins)
     */
    public function directorio()
    {
        $staff = Usuario::whereIn('rol', ['maestro', 'admin'])
            ->where('activo', 1)
            ->orderByRaw("CASE rol WHEN 'admin' THEN 1 WHEN 'maestro' THEN 2 END")
            ->orderBy('nombre_completo')
            ->select('id_usuario', 'nombre_completo', 'rol', 'foto_perfil', 'email', 'asignacion')
            ->get();

        return response()->json($staff);
    }

    /**
     * Obtener usuario por ID
     */
    public function show($id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json($usuario);
    }

    /**
     * Crear nuevo usuario
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre_completo' => 'required|string',
            'email' => 'required|email',
            'password_hash' => 'required|string',
            'rol' => 'required|in:alumno,padre,maestro,admin'
        ]);

        $usuario = Usuario::create($request->all());

        return response()->json([
            'message' => 'Usuario creado',
            'id' => $usuario->id_usuario
        ], 201);
    }

    /**
     * Actualizar usuario
     */
    public function update(Request $request, $id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Si solo se quiere actualizar la contraseña
        if ($request->update_password_only && $request->password) {
            $usuario->password_hash = Hash::make($request->password);
            $usuario->save();
            return response()->json(['message' => 'Contraseña actualizada']);
        }

        // Actualización normal (incluyendo asignación)
        $usuario->fill($request->only(['nombre_completo', 'email', 'rol', 'activo', 'asignacion']));
        $usuario->save();

        return response()->json(['message' => 'Usuario actualizado', 'usuario' => $usuario]);
    }

    /**
     * Actualizar solo email
     */
    public function updateEmail(Request $request, $id)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $usuario->email = $request->email;
        $usuario->save();

        return response()->json(['message' => 'Correo actualizado']);
    }

    /**
     * Subir foto de perfil
     */
    public function uploadFoto(Request $request, $id)
    {
        $request->validate([
            'foto' => 'required|image|mimes:jpeg,png,gif,webp|max:5120'
        ]);

        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $file = $request->file('foto');
        $timestamp = time();
        $extension = $file->getClientOriginalExtension();
        $filename = "perfil_{$id}_{$timestamp}.{$extension}";

        // Guardar en public/media/uploads
        $file->move(public_path('media/uploads'), $filename);

        $fotoPath = "/media/uploads/{$filename}";

        $usuario->foto_perfil = $fotoPath;
        $usuario->save();

        return response()->json([
            'message' => 'Foto actualizada',
            'foto_perfil' => $fotoPath
        ]);
    }

    /**
     * Obtener hijos de un padre
     */
    public function getHijos($id)
    {
        $hijos = DB::table('relaciones_familiares as rf')
            ->join('usuarios as u', 'rf.id_hijo', '=', 'u.id_usuario')
            ->leftJoin('asignaciones_grupos as ag', function ($join) {
                $join->on('u.id_usuario', '=', 'ag.id_usuario')
                    ->where('ag.activa', '=', 1);
            })
            ->leftJoin('grupos as g', 'ag.id_grupo', '=', 'g.id_grupo')
            ->where('rf.id_padre', $id)
            ->where('u.activo', 1)
            ->select(
                'u.id_usuario',
                'u.nombre_completo',
                'u.foto_perfil',
                'u.email',
                'rf.parentesco',
                DB::raw('COALESCE(g.nombre_grupo, u.asignacion) as nombre_grupo')
            )
            ->orderBy('u.nombre_completo')
            ->get();

        return response()->json($hijos);
    }

    /**
     * Obtener padres de un alumno
     */
    public function getPadres($id)
    {
        $padres = DB::table('relaciones_familiares as rf')
            ->join('usuarios as u', 'rf.id_padre', '=', 'u.id_usuario')
            ->where('rf.id_hijo', $id)
            ->where('u.activo', 1)
            ->select(
                'u.id_usuario',
                'u.nombre_completo',
                'u.foto_perfil',
                'u.email',
                'rf.parentesco'
            )
            ->orderBy('u.nombre_completo')
            ->get();

        return response()->json($padres);
    }

    /**
     * Eliminar usuario (soft delete - desactivar)
     */
    public function destroy($id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $usuario->activo = false;
        $usuario->save();

        return response()->json(['message' => 'Usuario desactivado']);
    }

    /**
     * Obtener todos los grupos de una escuela
     */
    public function getTodosGrupos($idEscuela)
    {
        $grupos = DB::table('grupos')
            ->where('id_escuela', $idEscuela)
            ->orderBy('nombre_grupo')
            ->get();

        return response()->json($grupos);
    }

    /**
     * Obtener grupos asignados a un maestro
     */
    public function getGruposAsignados($id)
    {
        $grupos = DB::table('asignaciones_grupos as ag')
            ->join('grupos as g', 'ag.id_grupo', '=', 'g.id_grupo')
            ->where('ag.id_usuario', $id)
            ->where('ag.activa', 1)
            ->select('g.*')
            ->orderBy('g.nombre_grupo')
            ->get();

        return response()->json($grupos);
    }

    /**
     * Obtener grupo de un alumno
     */
    public function getGrupo($id)
    {
        // Obtener el grupo del alumno
        $grupo = DB::table('asignaciones_grupos as ag')
            ->join('grupos as g', 'ag.id_grupo', '=', 'g.id_grupo')
            ->where('ag.id_usuario', $id)
            ->where('ag.activa', 1)
            ->select('g.*')
            ->first();

        if (!$grupo) {
            return response()->json(['message' => 'No tiene grupo asignado'], 404);
        }

        // Obtener el maestro del grupo
        $maestro = null;
        if ($grupo->id_maestro) {
            $maestro = DB::table('usuarios')
                ->where('id_usuario', $grupo->id_maestro)
                ->select('id_usuario', 'nombre_completo', 'foto_perfil', 'email')
                ->first();
        }

        // Obtener compañeros del grupo (otros alumnos)
        $companeros = DB::table('asignaciones_grupos as ag')
            ->join('usuarios as u', 'ag.id_usuario', '=', 'u.id_usuario')
            ->where('ag.id_grupo', $grupo->id_grupo)
            ->where('ag.activa', 1)
            ->where('u.activo', 1)
            ->where('u.rol', 'alumno')
            ->select('u.id_usuario', 'u.nombre_completo', 'u.foto_perfil')
            ->orderBy('u.nombre_completo')
            ->get();

        return response()->json([
            'grupo' => $grupo,
            'maestro' => $maestro,
            'companeros' => $companeros
        ]);
    }

    /**
     * Obtener estudiantes de un grupo
     */
    public function getEstudiantesGrupo($idGrupo)
    {
        $estudiantes = DB::table('asignaciones_grupos as ag')
            ->join('usuarios as u', 'ag.id_usuario', '=', 'u.id_usuario')
            ->where('ag.id_grupo', $idGrupo)
            ->where('ag.activa', 1)
            ->where('u.activo', 1)
            ->where('u.rol', 'alumno')
            ->select('u.*')
            ->orderBy('u.nombre_completo')
            ->get();

        return response()->json(['estudiantes' => $estudiantes]);
    }

    /**
     * Obtener personal docente de una escuela
     */
    public function getPersonalDocente($idEscuela)
    {
        $personal = Usuario::where('id_escuela', $idEscuela)
            ->whereIn('rol', ['maestro', 'admin'])
            ->where('activo', 1)
            ->orderBy('rol')
            ->orderBy('nombre_completo')
            ->get();

        return response()->json(['personal' => $personal]);
    }

    /**
     * Obtener información de recogida de un alumno
     */
    public function getInfoRecogida($id)
    {
        // Obtener el alumno
        $alumno = Usuario::find($id);
        
        if (!$alumno) {
            return response()->json(['message' => 'Alumno no encontrado'], 404);
        }

        // Obtener padres del alumno
        $padres = DB::table('relaciones_familiares as rf')
            ->join('usuarios as u', 'rf.id_padre', '=', 'u.id_usuario')
            ->where('rf.id_hijo', $id)
            ->where('u.activo', 1)
            ->select('u.id_usuario', 'u.nombre_completo', 'u.foto_perfil', 'u.email', 'rf.parentesco')
            ->get();

        // Obtener personas de confianza
        $personasConfianza = [];
        foreach ($padres as $padre) {
            $personas = DB::table('personas_confianza')
                ->where('id_padre', $padre->id_usuario)
                ->where('activa', 1)
                ->get();
            foreach ($personas as $persona) {
                $personasConfianza[] = $persona;
            }
        }

        // Obtener solicitud de recogida activa (si hay)
        $solicitudActiva = DB::table('solicitudes_recogida')
            ->where('id_alumno', $id)
            ->where('estado', 'pendiente')
            ->orderBy('fecha_solicitud', 'desc')
            ->first();

        return response()->json([
            'alumno' => $alumno,
            'padres' => $padres,
            'personas_confianza' => $personasConfianza,
            'solicitud_activa' => $solicitudActiva
        ]);
    }

    /**
     * Obtener usuarios por escuela
     */
    public function getByEscuela($idEscuela, Request $request)
    {
        $query = Usuario::where('id_escuela', $idEscuela)
            ->where('activo', 1);

        if ($request->has('rol')) {
            $query->where('rol', $request->rol);
        }

        $usuarios = $query->orderBy('nombre_completo')->get();

        return response()->json($usuarios);
    }

    // ==================== CRUD DE GRUPOS ====================

    /**
     * Obtener grupos de una escuela con detalles
     */
    public function getGruposEscuela($idEscuela)
    {
        $grupos = DB::table('grupos as g')
            ->leftJoin('usuarios as m', 'g.id_maestro', '=', 'm.id_usuario')
            ->where('g.id_escuela', $idEscuela)
            ->where('g.activo', 1)
            ->select(
                'g.*',
                'm.nombre_completo as nombre_maestro',
                'm.foto_perfil as foto_maestro',
                DB::raw('(SELECT COUNT(*) FROM asignaciones_grupos ag WHERE ag.id_grupo = g.id_grupo AND ag.activa = 1) as total_alumnos')
            )
            ->orderBy('g.nivel')
            ->orderBy('g.grado')
            ->orderBy('g.seccion')
            ->get();

        return response()->json($grupos);
    }

    /**
     * Obtener detalle de un grupo
     */
    public function getGrupoDetalle($id)
    {
        $grupo = DB::table('grupos as g')
            ->leftJoin('usuarios as m', 'g.id_maestro', '=', 'm.id_usuario')
            ->where('g.id_grupo', $id)
            ->select('g.*', 'm.nombre_completo as nombre_maestro', 'm.foto_perfil as foto_maestro')
            ->first();

        if (!$grupo) {
            return response()->json(['message' => 'Grupo no encontrado'], 404);
        }

        // Obtener alumnos del grupo
        $alumnos = DB::table('asignaciones_grupos as ag')
            ->join('usuarios as u', 'ag.id_usuario', '=', 'u.id_usuario')
            ->where('ag.id_grupo', $id)
            ->where('ag.activa', 1)
            ->where('u.activo', 1)
            ->where('u.rol', 'alumno')
            ->select('u.id_usuario', 'u.nombre_completo', 'u.foto_perfil', 'u.email', 'ag.fecha_asignacion')
            ->orderBy('u.nombre_completo')
            ->get();

        return response()->json([
            'grupo' => $grupo,
            'alumnos' => $alumnos
        ]);
    }

    /**
     * Crear grupo
     */
    public function createGrupo(Request $request)
    {
        $request->validate([
            'id_escuela' => 'required|integer',
            'nombre_grupo' => 'required|string'
        ]);

        $id = DB::table('grupos')->insertGetId([
            'id_escuela' => $request->id_escuela,
            'nombre_grupo' => $request->nombre_grupo,
            'id_maestro' => $request->id_maestro,
            'grado' => $request->grado,
            'seccion' => $request->seccion,
            'nivel' => $request->nivel ?? 'primaria',
            'activo' => 1
        ]);

        return response()->json(['message' => 'Grupo creado', 'id' => $id], 201);
    }

    /**
     * Actualizar grupo
     */
    public function updateGrupo(Request $request, $id)
    {
        $grupo = DB::table('grupos')->where('id_grupo', $id)->first();
        
        if (!$grupo) {
            return response()->json(['message' => 'Grupo no encontrado'], 404);
        }

        DB::table('grupos')->where('id_grupo', $id)->update([
            'nombre_grupo' => $request->nombre_grupo ?? $grupo->nombre_grupo,
            'id_maestro' => $request->id_maestro ?? $grupo->id_maestro,
            'grado' => $request->grado ?? $grupo->grado,
            'seccion' => $request->seccion ?? $grupo->seccion,
            'nivel' => $request->nivel ?? $grupo->nivel
        ]);

        return response()->json(['message' => 'Grupo actualizado']);
    }

    /**
     * Eliminar grupo (soft delete)
     */
    public function deleteGrupo($id)
    {
        DB::table('grupos')->where('id_grupo', $id)->update(['activo' => 0]);
        return response()->json(['message' => 'Grupo eliminado']);
    }

    /**
     * Asignar alumno a grupo
     */
    public function asignarAlumnoGrupo(Request $request, $idGrupo)
    {
        $request->validate([
            'id_usuario' => 'required|integer'
        ]);

        // Verificar que no esté ya asignado
        $existe = DB::table('asignaciones_grupos')
            ->where('id_usuario', $request->id_usuario)
            ->where('id_grupo', $idGrupo)
            ->where('activa', 1)
            ->first();

        if ($existe) {
            return response()->json(['message' => 'El alumno ya está en este grupo'], 400);
        }

        // Desactivar asignaciones anteriores
        DB::table('asignaciones_grupos')
            ->where('id_usuario', $request->id_usuario)
            ->update(['activa' => 0]);

        // Crear nueva asignación
        $id = DB::table('asignaciones_grupos')->insertGetId([
            'id_usuario' => $request->id_usuario,
            'id_grupo' => $idGrupo,
            'fecha_asignacion' => now(),
            'activa' => 1
        ]);

        return response()->json(['message' => 'Alumno asignado al grupo', 'id' => $id], 201);
    }

    /**
     * Quitar alumno de grupo
     */
    public function quitarAlumnoGrupo($idGrupo, $idAlumno)
    {
        DB::table('asignaciones_grupos')
            ->where('id_grupo', $idGrupo)
            ->where('id_usuario', $idAlumno)
            ->update(['activa' => 0]);

        return response()->json(['message' => 'Alumno quitado del grupo']);
    }

    // ==================== RELACIONES FAMILIARES ====================

    /**
     * Obtener relaciones familiares de un alumno
     */
    public function getRelacionesAlumno($idAlumno)
    {
        $relaciones = DB::table('relaciones_familiares as rf')
            ->join('usuarios as p', 'rf.id_padre', '=', 'p.id_usuario')
            ->where('rf.id_hijo', $idAlumno)
            ->where('p.activo', 1)
            ->select(
                'rf.id_relacion',
                'rf.id_padre',
                'rf.id_hijo',
                'rf.parentesco',
                'rf.autorizado_recogida',
                'p.nombre_completo',
                'p.email',
                'p.foto_perfil'
            )
            ->get();

        return response()->json($relaciones);
    }

    /**
     * Crear relación familiar
     */
    public function createRelacion(Request $request)
    {
        $request->validate([
            'id_padre' => 'required|integer',
            'id_hijo' => 'required|integer',
            'parentesco' => 'required|string'
        ]);

        // Verificar que no exista
        $existe = DB::table('relaciones_familiares')
            ->where('id_padre', $request->id_padre)
            ->where('id_hijo', $request->id_hijo)
            ->first();

        if ($existe) {
            return response()->json(['message' => 'Esta relación ya existe'], 400);
        }

        $id = DB::table('relaciones_familiares')->insertGetId([
            'id_padre' => $request->id_padre,
            'id_hijo' => $request->id_hijo,
            'parentesco' => $request->parentesco,
            'autorizado_recogida' => $request->autorizado_recogida ?? 1
        ]);

        return response()->json(['message' => 'Relación creada', 'id' => $id], 201);
    }

    /**
     * Eliminar relación familiar
     */
    public function deleteRelacion($idPadre, $idHijo)
    {
        DB::table('relaciones_familiares')
            ->where('id_padre', $idPadre)
            ->where('id_hijo', $idHijo)
            ->delete();

        return response()->json(['message' => 'Relación eliminada']);
    }

    // ==================== ASIGNATURAS ====================

    /**
     * Obtener asignaturas de una escuela
     */
    public function getAsignaturasEscuela($idEscuela)
    {
        $asignaturas = DB::table('asignaturas')
            ->where('activa', 1)
            ->orderBy('nombre_asignatura')
            ->get();

        return response()->json($asignaturas);
    }

    /**
     * Crear asignatura
     */
    public function createAsignatura(Request $request)
    {
        $request->validate([
            'nombre_asignatura' => 'required|string'
        ]);

        $id = DB::table('asignaturas')->insertGetId([
            'nombre_asignatura' => $request->nombre_asignatura,
            'activa' => 1
        ]);

        return response()->json(['message' => 'Asignatura creada', 'id' => $id], 201);
    }

    /**
     * Actualizar asignatura
     */
    public function updateAsignatura(Request $request, $id)
    {
        DB::table('asignaturas')->where('id_asignatura', $id)->update([
            'nombre_asignatura' => $request->nombre_asignatura
        ]);

        return response()->json(['message' => 'Asignatura actualizada']);
    }

    /**
     * Eliminar asignatura (soft delete)
     */
    public function deleteAsignatura($id)
    {
        DB::table('asignaturas')->where('id_asignatura', $id)->update(['activa' => 0]);
        return response()->json(['message' => 'Asignatura eliminada']);
    }
}
