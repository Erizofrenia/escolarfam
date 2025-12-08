<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AsignacionGrupo extends Model
{
    protected $table = 'asignaciones_grupos';
    protected $primaryKey = 'id_asignacion';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'id_grupo',
        'activa'
    ];

    protected $casts = [
        'activa' => 'boolean',
        'fecha_asignacion' => 'datetime'
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupo', 'id_grupo');
    }

    // Scopes
    public function scopeActivas($query)
    {
        return $query->where('activa', 1);
    }
}
