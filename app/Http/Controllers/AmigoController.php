<?php

namespace App\Http\Controllers;

use App\Models\Amigo;
use App\Models\Notificacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AmigoController extends Controller
{
    /**
     * Obtener lista de amigos de un usuario
     */
    public function index($idUsuario)
    {
        $amigos = DB::table('amigos as a')
            ->join('usuarios as u', 'a.id_amigo', '=', 'u.id_usuario')
            ->where('a.id_usuario', $idUsuario)
            ->where('u.activo', 1)
            ->select(
                'u.id_usuario',
                'u.nombre_completo',
                'u.foto_perfil',
                'u.rol',
                'a.fecha_agregado'
            )
            ->orderBy('u.nombre_completo')
            ->get();

        return response()->json($amigos);
    }

    /**
     * Enviar solicitud de amistad
     */
    public function enviarSolicitud(Request $request)
    {
        $request->validate([
            'id_usuario' => 'required|integer',
            'id_amigo' => 'required|integer'
        ]);

        $idUsuario = $request->id_usuario;
        $idAmigo = $request->id_amigo;

        // Verificar que no sea el mismo usuario
        if ($idUsuario == $idAmigo) {
            return response()->json(['message' => 'No puedes agregarte a ti mismo'], 400);
        }

        // Verificar si ya son amigos
        $existente = Amigo::where('id_usuario', $idUsuario)
            ->where('id_amigo', $idAmigo)
            ->first();

        if ($existente) {
            return response()->json(['message' => 'Ya son amigos'], 400);
        }

        // Crear relación de amistad (bidireccional)
        Amigo::create([
            'id_usuario' => $idUsuario,
            'id_amigo' => $idAmigo
        ]);

        Amigo::create([
            'id_usuario' => $idAmigo,
            'id_amigo' => $idUsuario
        ]);

        // Notificar al nuevo amigo
        $usuario = DB::table('usuarios')
            ->where('id_usuario', $idUsuario)
            ->select('nombre_completo')
            ->first();

        Notificacion::create([
            'id_usuario' => $idAmigo,
            'tipo' => 'sistema',
            'titulo' => 'Nuevo contacto',
            'contenido' => "{$usuario->nombre_completo} te ha agregado como contacto"
        ]);

        return response()->json(['message' => 'Contacto agregado exitosamente']);
    }

    /**
     * Eliminar amigo
     */
    public function destroy($idUsuario, $idAmigo)
    {
        // Eliminar relación bidireccional
        Amigo::where('id_usuario', $idUsuario)
            ->where('id_amigo', $idAmigo)
            ->delete();

        Amigo::where('id_usuario', $idAmigo)
            ->where('id_amigo', $idUsuario)
            ->delete();

        return response()->json(['message' => 'Contacto eliminado']);
    }

    /**
     * Buscar usuarios para agregar como amigos
     */
    public function buscar(Request $request, $idUsuario)
    {
        $query = $request->query('q', '');

        // Obtener IDs de amigos actuales
        $amigosIds = Amigo::where('id_usuario', $idUsuario)
            ->pluck('id_amigo')
            ->toArray();
        
        $amigosIds[] = $idUsuario; // Excluir al propio usuario

        $usuarios = DB::table('usuarios')
            ->where('activo', 1)
            ->where('nombre_completo', 'like', "%{$query}%")
            ->whereNotIn('id_usuario', $amigosIds)
            ->select('id_usuario', 'nombre_completo', 'foto_perfil', 'rol')
            ->limit(20)
            ->get();

        return response()->json($usuarios);
    }
}
