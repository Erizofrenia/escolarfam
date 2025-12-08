<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Grupo;
use App\Models\AsignacionGrupo;
use App\Models\RelacionFamiliar;
use App\Models\Asignatura;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /**
     * Verificar password compatible con Node.js bcrypt ($2b$) y PHP bcrypt ($2y$)
     */
    private function checkPassword($password, $hash)
    {
        // Node.js bcrypt usa $2b$, PHP usa $2y$ - son compatibles
        // Convertir $2b$ a $2y$ para que PHP lo reconozca
        $compatibleHash = $hash;
        if (str_starts_with($hash, '$2b$')) {
            $compatibleHash = '$2y$' . substr($hash, 4);
        }
        
        return password_verify($password, $compatibleHash);
    }

    /**
     * Login de usuario
     */
    public function login(Request $request)
    {
        $request->validate([
            'nombre_usuario' => 'required|string',
            'password' => 'required|string'
        ]);

        $usuario = Usuario::where('nombre_usuario', $request->nombre_usuario)
            ->where('activo', 1)
            ->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        if (!$this->checkPassword($request->password, $usuario->password_hash)) {
            return response()->json(['message' => 'Contraseña incorrecta'], 401);
        }

        // Actualizar último acceso
        $usuario->ultimo_acceso = now();
        $usuario->save();

        // Obtener información adicional según el rol
        $datosAdicionales = $this->obtenerDatosAdicionales($usuario);

        return response()->json([
            'message' => 'Login exitoso',
            'usuario' => array_merge($usuario->toArray(), $datosAdicionales)
        ]);
    }

    /**
     * Registro completo de usuario
     */
    public function register(Request $request)
    {
        $request->validate([
            'nombre_usuario' => 'required|string',
            'nombre_completo' => 'required|string',
            'password' => 'required|string|min:4',
            'rol' => 'required|in:alumno,padre,maestro,admin'
        ]);

        DB::beginTransaction();

        try {
            $idEscuela = $request->id_escuela ?? 1;
            $email = $request->email ?? $request->nombre_usuario . '@temporal.local';
            $passwordHash = Hash::make($request->password);

            // Crear usuario principal
            $usuario = Usuario::create([
                'id_escuela' => $idEscuela,
                'nombre_usuario' => $request->nombre_usuario,
                'nombre_completo' => $request->nombre_completo,
                'email' => $email,
                'password_hash' => $passwordHash,
                'rol' => $request->rol
            ]);

            $grupoId = $request->id_grupo;
            $tutorId = $request->id_tutor;

            // ========== REGISTRO DE ALUMNO ==========
            if ($request->rol === 'alumno') {
                // Si un maestro está registrando, validar que el grupo sea suyo
                if ($request->id_registrador_rol === 'maestro' && $request->id_grupo) {
                    $idMaestro = $request->id_registrador;
                    $grupoAsignado = AsignacionGrupo::where('id_usuario', $idMaestro)
                        ->where('id_grupo', $request->id_grupo)
                        ->where('activa', 1)
                        ->exists();
                    
                    if (!$grupoAsignado) {
                        DB::rollBack();
                        return response()->json([
                            'message' => 'No tienes permiso para registrar alumnos en este grupo'
                        ], 403);
                    }
                }

                // Si se crea nuevo grupo
                if ($request->nuevo_grupo && isset($request->nuevo_grupo['nombre_grupo'])) {
                    $grupo = Grupo::create([
                        'id_escuela' => $idEscuela,
                        'nombre_grupo' => $request->nuevo_grupo['nombre_grupo'],
                        'grado' => $request->nuevo_grupo['grado'] ?? 1,
                        'seccion' => $request->nuevo_grupo['seccion'] ?? 'A',
                        'nivel' => $request->nuevo_grupo['nivel'] ?? 'primaria',
                        'id_maestro' => $request->nuevo_grupo['id_maestro'] ?? null
                    ]);
                    $grupoId = $grupo->id_grupo;
                }

                // Asignar alumno a grupo
                if ($grupoId) {
                    AsignacionGrupo::create([
                        'id_usuario' => $usuario->id_usuario,
                        'id_grupo' => $grupoId
                    ]);

                    // Actualizar asignación con nombre del grupo
                    $grupo = Grupo::find($grupoId);
                    if ($grupo) {
                        $usuario->asignacion = $grupo->nombre_grupo;
                        $usuario->save();
                    }
                }

                // Si se crea nuevo tutor (padre)
                if ($request->nuevo_tutor && isset($request->nuevo_tutor['nombre_completo'])) {
                    $tutorPasswordHash = Hash::make($request->nuevo_tutor['password'] ?? 'padre123');
                    $tutorEmail = $request->nuevo_tutor['email'] ?? $request->nuevo_tutor['nombre_usuario'] . '@temporal.local';

                    $tutor = Usuario::create([
                        'id_escuela' => $idEscuela,
                        'nombre_usuario' => $request->nuevo_tutor['nombre_usuario'],
                        'nombre_completo' => $request->nuevo_tutor['nombre_completo'],
                        'email' => $tutorEmail,
                        'password_hash' => $tutorPasswordHash,
                        'rol' => 'padre'
                    ]);
                    $tutorId = $tutor->id_usuario;
                }

                // Crear relación familiar
                if ($tutorId) {
                    RelacionFamiliar::create([
                        'id_padre' => $tutorId,
                        'id_hijo' => $usuario->id_usuario,
                        'parentesco' => $request->parentesco ?? 'tutor'
                    ]);
                }
            }

            // ========== REGISTRO DE MAESTRO ==========
            if ($request->rol === 'maestro') {
                $grupoId = null;

                // Si se especifica crear un nuevo grupo
                if ($request->nuevo_grupo) {
                    $nuevoGrupo = $request->nuevo_grupo;
                    
                    // Verificar si ya existe un grupo con el mismo nombre en la escuela
                    $grupoExistente = Grupo::where('id_escuela', $idEscuela)
                        ->where('nombre_grupo', $nuevoGrupo['nombre_grupo'])
                        ->first();
                    
                    if ($grupoExistente) {
                        $grupoId = $grupoExistente->id_grupo;
                    } else {
                        // Crear el nuevo grupo
                        $grupo = Grupo::create([
                            'id_escuela' => $idEscuela,
                            'nombre_grupo' => $nuevoGrupo['nombre_grupo'],
                            'grado' => $nuevoGrupo['grado'] ?? null,
                            'seccion' => $nuevoGrupo['seccion'] ?? null,
                            'nivel' => $nuevoGrupo['nivel'] ?? null,
                            'id_maestro' => $usuario->id_usuario, // Asignar este maestro como titular
                            'activo' => 1
                        ]);
                        $grupoId = $grupo->id_grupo;
                    }
                } elseif ($request->id_grupo) {
                    // Usar grupo existente
                    $grupoId = $request->id_grupo;
                    
                    // Actualizar el grupo para asignar a este maestro como titular si no tiene
                    $grupo = Grupo::find($grupoId);
                    if ($grupo && !$grupo->id_maestro) {
                        $grupo->id_maestro = $usuario->id_usuario;
                        $grupo->save();
                    }
                }

                // Asignar al maestro al grupo
                if ($grupoId) {
                    // Verificar si ya existe la asignación
                    $asignacionExistente = AsignacionGrupo::where('id_usuario', $usuario->id_usuario)
                        ->where('id_grupo', $grupoId)
                        ->first();
                    
                    if (!$asignacionExistente) {
                        AsignacionGrupo::create([
                            'id_usuario' => $usuario->id_usuario,
                            'id_grupo' => $grupoId,
                            'activa' => 1
                        ]);
                    }
                }

                // ========== GUARDAR MATERIA PRINCIPAL ==========
                if ($request->materia_principal) {
                    $materiaPrincipal = trim($request->materia_principal);
                    
                    // Guardar la materia principal en el campo asignacion del usuario
                    $usuario->asignacion = $materiaPrincipal;
                    $usuario->save();
                    
                    // Verificar si la materia existe, si no, crearla en la tabla asignaturas
                    $asignaturaExistente = Asignatura::where('nombre_asignatura', $materiaPrincipal)
                        ->where(function($q) use ($idEscuela) {
                            $q->where('id_escuela', $idEscuela)
                              ->orWhereNull('id_escuela');
                        })
                        ->first();
                    
                    if (!$asignaturaExistente) {
                        Asignatura::create([
                            'nombre_asignatura' => $materiaPrincipal,
                            'id_escuela' => $idEscuela,
                            'activa' => 1
                        ]);
                    }
                }

                // Crear nuevas asignaturas si se especifican
                $nuevasAsignaturasIds = [];
                if ($request->nuevas_asignaturas && is_array($request->nuevas_asignaturas)) {
                    foreach ($request->nuevas_asignaturas as $asig) {
                        if (!empty($asig['nombre_asignatura'])) {
                            $asignatura = Asignatura::firstOrCreate(
                                ['nombre_asignatura' => trim($asig['nombre_asignatura'])],
                                ['id_escuela' => $idEscuela, 'activa' => 1]
                            );
                            $nuevasAsignaturasIds[] = $asignatura->id_asignatura;
                        }
                    }
                }

                // Asignar asignaturas existentes al maestro
                if ($grupoId && $request->asignaturas && is_array($request->asignaturas)) {
                    foreach ($request->asignaturas as $idAsig) {
                        DB::table('maestro_asignaturas')->insertOrIgnore([
                            'id_maestro' => $usuario->id_usuario,
                            'id_asignatura' => $idAsig,
                            'id_grupo' => $grupoId
                        ]);
                    }
                }

                // Asignar nuevas asignaturas creadas
                if ($grupoId && count($nuevasAsignaturasIds) > 0) {
                    foreach ($nuevasAsignaturasIds as $idAsig) {
                        DB::table('maestro_asignaturas')->insertOrIgnore([
                            'id_maestro' => $usuario->id_usuario,
                            'id_asignatura' => $idAsig,
                            'id_grupo' => $grupoId
                        ]);
                    }
                }

                // Soporte legacy: Asignar múltiples grupos y asignaturas
                if ($request->grupos_asignados && is_array($request->grupos_asignados)) {
                    foreach ($request->grupos_asignados as $grupo) {
                        // Asignar al grupo
                        AsignacionGrupo::firstOrCreate([
                            'id_usuario' => $usuario->id_usuario,
                            'id_grupo' => $grupo['id_grupo']
                        ]);

                        // Asignar asignaturas en ese grupo
                        if (isset($grupo['asignaturas']) && is_array($grupo['asignaturas'])) {
                            foreach ($grupo['asignaturas'] as $idAsig) {
                                DB::table('maestro_asignaturas')->insertOrIgnore([
                                    'id_maestro' => $usuario->id_usuario,
                                    'id_asignatura' => $idAsig,
                                    'id_grupo' => $grupo['id_grupo']
                                ]);
                            }
                        }
                    }
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Usuario registrado exitosamente',
                'id_usuario' => $usuario->id_usuario,
                'usuario' => $usuario
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al registrar usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verificar token/sesión (simplificado para compatibilidad)
     */
    public function verifyToken(Request $request)
    {
        $idUsuario = $request->query('id_usuario');

        if (!$idUsuario) {
            return response()->json(['valid' => false, 'message' => 'ID de usuario requerido'], 400);
        }

        $usuario = Usuario::where('id_usuario', $idUsuario)
            ->where('activo', 1)
            ->first();

        if (!$usuario) {
            return response()->json(['valid' => false, 'message' => 'Usuario no encontrado'], 404);
        }

        return response()->json([
            'valid' => true,
            'usuario' => $usuario
        ]);
    }

    /**
     * Obtener datos adicionales según el rol del usuario
     */
    private function obtenerDatosAdicionales(Usuario $usuario)
    {
        $datos = [];

        switch ($usuario->rol) {
            case 'padre':
                // Obtener hijos
                $hijos = DB::table('relaciones_familiares as rf')
                    ->join('usuarios as u', 'rf.id_hijo', '=', 'u.id_usuario')
                    ->leftJoin('asignaciones_grupos as ag', function ($join) {
                        $join->on('u.id_usuario', '=', 'ag.id_usuario')
                            ->where('ag.activa', '=', 1);
                    })
                    ->leftJoin('grupos as g', 'ag.id_grupo', '=', 'g.id_grupo')
                    ->where('rf.id_padre', $usuario->id_usuario)
                    ->where('u.activo', 1)
                    ->select('u.id_usuario', 'u.nombre_completo', 'u.foto_perfil', 'rf.parentesco', 'g.nombre_grupo')
                    ->get();
                $datos['hijos'] = $hijos;
                
                // Calcular asignación para padre: "Padre de X, Y y Z"
                if (count($hijos) > 0) {
                    $nombresHijos = $hijos->pluck('nombre_completo')->toArray();
                    if (count($nombresHijos) === 1) {
                        $datos['asignacion_calculada'] = "Padre/Madre de " . $nombresHijos[0];
                    } elseif (count($nombresHijos) === 2) {
                        $datos['asignacion_calculada'] = "Padre/Madre de " . $nombresHijos[0] . " y " . $nombresHijos[1];
                    } else {
                        $ultimoHijo = array_pop($nombresHijos);
                        $datos['asignacion_calculada'] = "Padre/Madre de " . implode(", ", $nombresHijos) . " y " . $ultimoHijo;
                    }
                } else {
                    $datos['asignacion_calculada'] = "Sin hijos registrados";
                }
                break;

            case 'alumno':
                // Obtener grupo
                $grupo = DB::table('asignaciones_grupos as ag')
                    ->join('grupos as g', 'ag.id_grupo', '=', 'g.id_grupo')
                    ->where('ag.id_usuario', $usuario->id_usuario)
                    ->where('ag.activa', 1)
                    ->select('g.*')
                    ->first();
                $datos['grupo'] = $grupo;
                
                // Calcular asignación para alumno: "Nivel - Grado° Sección" o nombre del grupo
                if ($grupo) {
                    $nivel = $grupo->nivel ? ucfirst($grupo->nivel) : '';
                    $grado = $grupo->grado ? $grupo->grado . '°' : '';
                    $seccion = $grupo->seccion ?? '';
                    
                    if ($nivel && $grado) {
                        $datos['asignacion_calculada'] = "{$nivel} {$grado} {$seccion}";
                    } else {
                        $datos['asignacion_calculada'] = $grupo->nombre_grupo;
                    }
                } else {
                    $datos['asignacion_calculada'] = "Sin grupo asignado";
                }
                break;

            case 'maestro':
                // Obtener grupos asignados
                $datos['grupos'] = DB::table('asignaciones_grupos as ag')
                    ->join('grupos as g', 'ag.id_grupo', '=', 'g.id_grupo')
                    ->where('ag.id_usuario', $usuario->id_usuario)
                    ->where('ag.activa', 1)
                    ->select('g.*')
                    ->get();
                
                // Para maestro, usar el campo asignacion de la tabla (materia principal)
                $datos['asignacion_calculada'] = $usuario->asignacion ?? 'Sin materia asignada';
                break;
                
            case 'admin':
                // Para admin/director, usar el campo asignacion o "Director"
                $datos['asignacion_calculada'] = $usuario->asignacion ?? 'Director';
                break;
        }

        return $datos;
    }

    /**
     * Verificar si un nombre de usuario está disponible
     */
    public function checkUsername($username)
    {
        $exists = Usuario::where('nombre_usuario', $username)->exists();
        
        return response()->json([
            'disponible' => !$exists,
            'mensaje' => $exists ? 'El nombre de usuario ya está en uso' : 'Nombre de usuario disponible'
        ]);
    }

    /**
     * Cambiar contraseña del usuario
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'id_usuario' => 'required|integer',
            'currentPassword' => 'required|string',
            'newPassword' => 'required|string|min:4'
        ]);

        $usuario = Usuario::find($request->id_usuario);

        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        // Verificar contraseña actual
        if (!$this->checkPassword($request->currentPassword, $usuario->password_hash)) {
            return response()->json(['error' => 'La contraseña actual es incorrecta'], 401);
        }

        // Actualizar contraseña
        $usuario->password_hash = Hash::make($request->newPassword);
        $usuario->save();

        return response()->json([
            'message' => 'Contraseña actualizada correctamente'
        ]);
    }
}
