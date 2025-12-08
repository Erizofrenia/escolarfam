<?php

namespace App\Http\Controllers;

use App\Models\Mensaje;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MensajeController extends Controller
{
    /**
     * Obtener conversaciones del usuario
     */
    public function getConversaciones($idUsuario)
    {
        // Obtener lista de contactos con los que ha conversado
        $contactos = DB::table('mensajes')
            ->selectRaw("
                CASE 
                    WHEN id_remitente = ? THEN id_destinatario 
                    ELSE id_remitente 
                END as id_contacto
            ", [$idUsuario])
            ->where('id_remitente', $idUsuario)
            ->orWhere('id_destinatario', $idUsuario)
            ->groupBy('id_contacto')
            ->pluck('id_contacto');

        $conversaciones = [];
        
        foreach ($contactos as $idContacto) {
            // Obtener datos del contacto
            $contacto = DB::table('usuarios')
                ->where('id_usuario', $idContacto)
                ->select('id_usuario', 'nombre_completo', 'foto_perfil', 'rol')
                ->first();
            
            if (!$contacto) continue;

            // Obtener último mensaje
            $ultimoMensaje = DB::table('mensajes')
                ->where(function($q) use ($idUsuario, $idContacto) {
                    $q->where('id_remitente', $idUsuario)->where('id_destinatario', $idContacto);
                })
                ->orWhere(function($q) use ($idUsuario, $idContacto) {
                    $q->where('id_remitente', $idContacto)->where('id_destinatario', $idUsuario);
                })
                ->orderBy('fecha_envio', 'desc')
                ->first();

            // Contar mensajes no leídos
            $noLeidos = DB::table('mensajes')
                ->where('id_remitente', $idContacto)
                ->where('id_destinatario', $idUsuario)
                ->where('leido', 0)
                ->count();

            $conversaciones[] = [
                'id_contacto' => $contacto->id_usuario,
                'nombre_contacto' => $contacto->nombre_completo,
                'foto_contacto' => $contacto->foto_perfil,
                'rol_contacto' => $contacto->rol,
                'ultimo_mensaje' => $ultimoMensaje ? $ultimoMensaje->contenido : null,
                'ultima_fecha' => $ultimoMensaje ? $ultimoMensaje->fecha_envio : null,
                'no_leidos' => $noLeidos
            ];
        }

        // Ordenar por fecha del último mensaje (más reciente primero)
        usort($conversaciones, function($a, $b) {
            return strtotime($b['ultima_fecha'] ?? '1970-01-01') - strtotime($a['ultima_fecha'] ?? '1970-01-01');
        });

        return response()->json($conversaciones);
    }

    /**
     * Obtener mensajes de una conversación
     */
    public function getMensajes($idUsuario1, $idUsuario2)
    {
        $mensajes = Mensaje::where(function ($query) use ($idUsuario1, $idUsuario2) {
                $query->where('id_remitente', $idUsuario1)
                      ->where('id_destinatario', $idUsuario2);
            })
            ->orWhere(function ($query) use ($idUsuario1, $idUsuario2) {
                $query->where('id_remitente', $idUsuario2)
                      ->where('id_destinatario', $idUsuario1);
            })
            ->orderBy('fecha_envio', 'asc')
            ->get();

        return response()->json($mensajes);
    }

    /**
     * Enviar mensaje
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_remitente' => 'required|integer',
            'id_destinatario' => 'required|integer',
            'contenido' => 'required|string'
        ]);

        $mensaje = Mensaje::create([
            'id_remitente' => $request->id_remitente,
            'id_destinatario' => $request->id_destinatario,
            'asunto' => $request->asunto,
            'contenido' => $request->contenido,
            'tipo' => $request->tipo ?? 'personal'
        ]);

        return response()->json([
            'message' => 'Mensaje enviado',
            'id' => $mensaje->id_mensaje
        ], 201);
    }

    /**
     * Marcar mensajes como leídos
     */
    public function marcarLeidos($idRemitente, $idDestinatario)
    {
        Mensaje::where('id_remitente', $idRemitente)
            ->where('id_destinatario', $idDestinatario)
            ->where('leido', 0)
            ->update(['leido' => 1]);

        return response()->json(['message' => 'Mensajes marcados como leídos']);
    }

    /**
     * Obtener contador de mensajes no leídos
     */
    public function getNoLeidos($idUsuario)
    {
        $total = Mensaje::where('id_destinatario', $idUsuario)
            ->where('leido', 0)
            ->count();

        return response()->json(['total' => $total]);
    }
}
