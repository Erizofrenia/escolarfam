<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonaConfianza extends Model
{
    protected $table = 'personas_confianza';
    protected $primaryKey = 'id_persona';
    public $timestamps = false;

    protected $fillable = [
        'id_padre',
        'nombre_completo',
        'parentesco',
        'telefono',
        'predeterminada',
        'activa'
    ];

    protected $casts = [
        'predeterminada' => 'boolean',
        'activa' => 'boolean',
        'fecha_registro' => 'datetime'
    ];

    // Relaciones
    public function padre()
    {
        return $this->belongsTo(Usuario::class, 'id_padre', 'id_usuario');
    }

    // Scopes
    public function scopeActivas($query)
    {
        return $query->where('activa', 1);
    }

    public function scopePredeterminadas($query)
    {
        return $query->where('predeterminada', 1);
    }
}
