<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Amigo extends Model
{
    protected $table = 'amigos';
    protected $primaryKey = 'id_amistad';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'id_amigo'
    ];

    protected $casts = [
        'fecha_agregado' => 'datetime'
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    public function amigo()
    {
        return $this->belongsTo(Usuario::class, 'id_amigo', 'id_usuario');
    }
}
