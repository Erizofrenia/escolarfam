<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asistencia extends Model
{
    protected $table = 'asistencia';
    protected $primaryKey = 'id_asistencia';
    public $timestamps = false;

    protected $fillable = [
        'id_alumno',
        'id_maestro',
        'estado',
        'fecha',
        'observaciones'
    ];

    protected $casts = [
        'fecha' => 'date',
        'hora_registro' => 'datetime'
    ];

    // Relaciones
    public function alumno()
    {
        return $this->belongsTo(Usuario::class, 'id_alumno', 'id_usuario');
    }

    public function maestro()
    {
        return $this->belongsTo(Usuario::class, 'id_maestro', 'id_usuario');
    }

    // Scopes
    public function scopePorFecha($query, $fecha)
    {
        return $query->where('fecha', $fecha);
    }

    public function scopePresentes($query)
    {
        return $query->where('estado', 'presente');
    }

    public function scopeAusentes($query)
    {
        return $query->where('estado', 'ausente');
    }
}
