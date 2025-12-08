<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grupo extends Model
{
    protected $table = 'grupos';
    protected $primaryKey = 'id_grupo';
    public $timestamps = false;

    protected $fillable = [
        'id_escuela',
        'nombre_grupo',
        'id_maestro',
        'grado',
        'seccion',
        'activo',
        'nivel'
    ];

    protected $casts = [
        'activo' => 'boolean'
    ];

    // Relaciones
    public function escuela()
    {
        return $this->belongsTo(Escuela::class, 'id_escuela', 'id_escuela');
    }

    public function maestro()
    {
        return $this->belongsTo(Usuario::class, 'id_maestro', 'id_usuario');
    }

    public function usuarios()
    {
        return $this->belongsToMany(Usuario::class, 'asignaciones_grupos', 'id_grupo', 'id_usuario')
            ->withPivot('activa', 'fecha_asignacion');
    }

    public function alumnos()
    {
        return $this->usuarios()->where('rol', 'alumno');
    }

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('activo', 1);
    }
}
