<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asignatura extends Model
{
    protected $table = 'asignaturas';
    protected $primaryKey = 'id_asignatura';
    public $timestamps = false;

    protected $fillable = [
        'nombre_asignatura',
        'id_escuela',
        'activa'
    ];

    protected $casts = [
        'activa' => 'boolean'
    ];

    // Scopes
    public function scopeActivas($query)
    {
        return $query->where('activa', 1);
    }
}
