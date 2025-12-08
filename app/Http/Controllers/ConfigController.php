<?php

namespace App\Http\Controllers;

use App\Models\Configuracion;
use App\Models\Escuela;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ConfigController extends Controller
{
    /**
     * Obtener configuración de una escuela
     */
    public function getByEscuela($idEscuela)
    {
        $escuela = Escuela::find($idEscuela);

        if (!$escuela) {
            return response()->json(['message' => 'Escuela no encontrada'], 404);
        }

        $configuraciones = Configuracion::where('id_escuela', $idEscuela)->get();

        // Convertir a objeto clave-valor
        $config = [];
        foreach ($configuraciones as $conf) {
            $config[$conf->clave_config] = $conf->valor;
        }

        // Agregar datos de la escuela
        $config['escuela'] = $escuela;

        return response()->json($config);
    }

    /**
     * Actualizar configuración de una escuela
     */
    public function updateByEscuela(Request $request, $idEscuela)
    {
        $escuela = Escuela::find($idEscuela);

        if (!$escuela) {
            return response()->json(['message' => 'Escuela no encontrada'], 404);
        }

        // Actualizar datos de la escuela si se envían
        if ($request->has('nombre_escuela')) {
            $escuela->nombre_escuela = $request->nombre_escuela;
        }
        if ($request->has('direccion')) {
            $escuela->direccion = $request->direccion;
        }
        if ($request->has('telefono')) {
            $escuela->telefono = $request->telefono;
        }
        if ($request->has('codigo_postal')) {
            $escuela->codigo_postal = $request->codigo_postal;
        }
        if ($request->has('sitio_web')) {
            $escuela->sitio_web = $request->sitio_web;
        }
        $escuela->save();

        // Actualizar configuraciones específicas
        $configuraciones = $request->except(['nombre_escuela', 'direccion', 'telefono', 'codigo_postal', 'sitio_web', 'escuela']);

        foreach ($configuraciones as $clave => $valor) {
            Configuracion::updateOrCreate(
                ['id_escuela' => $idEscuela, 'clave_config' => $clave],
                [
                    'valor_config' => is_array($valor) ? json_encode($valor) : $valor,
                    'tipo_dato' => is_array($valor) ? 'json' : (is_bool($valor) ? 'boolean' : (is_int($valor) ? 'int' : 'string'))
                ]
            );
        }

        return response()->json(['message' => 'Configuración actualizada']);
    }

    /**
     * Subir logo de escuela
     */
    public function uploadLogo(Request $request, $idEscuela)
    {
        $escuela = Escuela::find($idEscuela);

        if (!$escuela) {
            return response()->json(['message' => 'Escuela no encontrada'], 404);
        }

        // Si viene como base64
        if ($request->has('logo_base64')) {
            $base64 = $request->logo_base64;
            
            // Extraer tipo de imagen y datos
            if (preg_match('/^data:image\/(\w+);base64,/', $base64, $matches)) {
                $extension = $matches[1];
                $base64 = preg_replace('/^data:image\/\w+;base64,/', '', $base64);
            } else {
                $extension = 'png';
            }

            $imageData = base64_decode($base64);
            $filename = "logo_escuela_{$idEscuela}_" . time() . ".{$extension}";
            $path = public_path("media/logos/{$filename}");

            // Crear directorio si no existe
            if (!file_exists(public_path('media/logos'))) {
                mkdir(public_path('media/logos'), 0777, true);
            }

            file_put_contents($path, $imageData);

            $logoUrl = "/media/logos/{$filename}";

            // Guardar en configuración
            Configuracion::updateOrCreate(
                ['id_escuela' => $idEscuela, 'clave_config' => 'logo_escuela'],
                ['valor_config' => $logoUrl, 'tipo_dato' => 'string']
            );

            return response()->json([
                'message' => 'Logo actualizado',
                'logo_url' => $logoUrl
            ]);
        }

        // Si viene como archivo
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = "logo_escuela_{$idEscuela}_" . time() . "." . $file->getClientOriginalExtension();
            
            $file->move(public_path('media/logos'), $filename);
            
            $logoUrl = "/media/logos/{$filename}";

            Configuracion::updateOrCreate(
                ['id_escuela' => $idEscuela, 'clave_config' => 'logo_escuela'],
                ['valor_config' => $logoUrl, 'tipo_dato' => 'string']
            );

            return response()->json([
                'message' => 'Logo actualizado',
                'logo_url' => $logoUrl
            ]);
        }

        return response()->json(['message' => 'No se proporcionó ningún logo'], 400);
    }

    /**
     * Obtener logs de actividad de una escuela
     */
    public function getLogs($idEscuela, Request $request)
    {
        $query = DB::table('logs_actividad as l')
            ->leftJoin('usuarios as u', 'l.id_usuario', '=', 'u.id_usuario')
            ->where('l.id_escuela', $idEscuela);

        // Filtros opcionales
        if ($request->has('tipo')) {
            $query->where('l.tipo_actividad', $request->tipo);
        }
        if ($request->has('fecha_inicio')) {
            $query->whereDate('l.fecha_hora', '>=', $request->fecha_inicio);
        }
        if ($request->has('fecha_fin')) {
            $query->whereDate('l.fecha_hora', '<=', $request->fecha_fin);
        }

        $logs = $query->select(
            'l.*',
            'u.nombre_completo',
            'u.rol'
        )
        ->orderBy('l.fecha_hora', 'desc')
        ->limit($request->limit ?? 100)
        ->get();

        return response()->json($logs);
    }

    /**
     * Obtener estadísticas de logs
     */
    public function getLogsStats($idEscuela)
    {
        $stats = [
            'total' => DB::table('logs_actividad')
                ->where('id_escuela', $idEscuela)
                ->count(),
            'por_tipo' => DB::table('logs_actividad')
                ->where('id_escuela', $idEscuela)
                ->select('tipo_actividad', DB::raw('COUNT(*) as total'))
                ->groupBy('tipo_actividad')
                ->get(),
            'ultimos_7_dias' => DB::table('logs_actividad')
                ->where('id_escuela', $idEscuela)
                ->where('fecha_hora', '>=', now()->subDays(7))
                ->count(),
            'hoy' => DB::table('logs_actividad')
                ->where('id_escuela', $idEscuela)
                ->whereDate('fecha_hora', today())
                ->count()
        ];

        return response()->json($stats);
    }

    /**
     * Crear un nuevo log de actividad
     */
    public function createLog(Request $request, $idEscuela)
    {
        $request->validate([
            'id_usuario' => 'required|integer',
            'tipo_actividad' => 'required|string',
            'descripcion' => 'required|string'
        ]);

        $logId = DB::table('logs_actividad')->insertGetId([
            'id_escuela' => $idEscuela,
            'id_usuario' => $request->id_usuario,
            'tipo_actividad' => $request->tipo_actividad,
            'descripcion' => $request->descripcion,
            'ip_address' => $request->ip(),
            'fecha_hora' => now()
        ]);

        return response()->json([
            'message' => 'Log creado',
            'id' => $logId
        ], 201);
    }
}
