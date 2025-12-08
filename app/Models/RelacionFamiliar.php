<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RelacionFamiliar extends Model
{
    protected $table = 'relaciones_familiares';
    protected $primaryKey = 'id_relacion';
    public $timestamps = false;

    protected $fillable = [
        'id_padre',
        'id_hijo',
        'parentesco',
        'autorizado_recogida'
    ];

    protected $casts = [
        'autorizado_recogida' => 'boolean'
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
}
