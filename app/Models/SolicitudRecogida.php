<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SolicitudRecogida extends Model
{
    protected $table = 'solicitudes_recogida';
    protected $primaryKey = 'id_solicitud';
    public $timestamps = false;

    protected $fillable = [
        'id_padre',
        'id_hijo',
        'estado',
        'observaciones',
        'persona_recoge',
        'parentesco_recoge',
        'id_aprobador'
    ];

    protected $casts = [
        'fecha_solicitud' => 'datetime'
    ];

    // Relaciones
    public function padre()
    {
        return $this->belongsTo(Usuario::class, 'id_padre', 'id_usuario');
    }

    public function hijo()
    {
        return $this->belongsTo(Usuario::class, 'id_hijo', 'id_usuario');
    }

    public function aprobador()
    {
        return $this->belongsTo(Usuario::class, 'id_aprobador', 'id_usuario');
    }

    // Scopes
    public function scopePendientes($query)
    {
        return $query->where('estado', 'pendiente');
    }

    public function scopeAprobadas($query)
    {
        return $query->where('estado', 'aprobada');
    }
}
