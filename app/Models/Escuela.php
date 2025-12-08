<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Escuela extends Model
{
    protected $table = 'escuelas';
    protected $primaryKey = 'id_escuela';
    public $timestamps = false;

    protected $fillable = [
        'nombre_escuela',
        'direccion',
        'telefono',
        'codigo_postal',
        'sitio_web',
        'activa'
    ];

    protected $casts = [
        'activa' => 'boolean',
        'fecha_creacion' => 'datetime'
    ];

    // Relaciones
    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'id_escuela', 'id_escuela');
    }

    public function grupos()
    {
        return $this->hasMany(Grupo::class, 'id_escuela', 'id_escuela');
    }

    public function configuraciones()
    {
        return $this->hasMany(Configuracion::class, 'id_escuela', 'id_escuela');
    }

    // Scopes
    public function scopeActivas($query)
    {
        return $query->where('activa', 1);
    }
}
