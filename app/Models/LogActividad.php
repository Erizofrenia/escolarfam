<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogActividad extends Model
{
    protected $table = 'logs_actividad';
    protected $primaryKey = 'id_log';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'id_escuela',
        'accion',
        'tabla_afectada',
        'id_registro',
        'detalles',
        'ip_address',
        'user_agent'
    ];

    protected $casts = [
        'detalles' => 'array',
        'fecha_accion' => 'datetime'
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    public function escuela()
    {
        return $this->belongsTo(Escuela::class, 'id_escuela', 'id_escuela');
    }

    // Método estático para crear log
    public static function registrar($datos)
    {
        return self::create([
            'id_usuario' => $datos['id_usuario'] ?? null,
            'id_escuela' => $datos['id_escuela'] ?? null,
            'accion' => $datos['accion'] ?? '',
            'tabla_afectada' => $datos['tabla_afectada'] ?? null,
            'id_registro' => $datos['id_registro'] ?? null,
            'detalles' => $datos['detalles'] ?? null,
            'ip_address' => $datos['ip_address'] ?? request()->ip(),
            'user_agent' => $datos['user_agent'] ?? request()->userAgent()
        ]);
    }
}
