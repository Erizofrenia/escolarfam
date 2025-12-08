<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Configuracion extends Model
{
    protected $table = 'configuraciones';
    protected $primaryKey = 'id_config';
    public $timestamps = false;

    protected $fillable = [
        'id_escuela',
        'clave_config',
        'valor_config',
        'tipo_dato'
    ];

    protected $casts = [
        'fecha_actualizacion' => 'datetime'
    ];

    // Relaciones
    public function escuela()
    {
        return $this->belongsTo(Escuela::class, 'id_escuela', 'id_escuela');
    }

    // Accessor para obtener el valor con el tipo correcto
    public function getValorAttribute()
    {
        $valor = $this->valor_config;
        
        switch ($this->tipo_dato) {
            case 'int':
                return (int) $valor;
            case 'boolean':
                return filter_var($valor, FILTER_VALIDATE_BOOLEAN);
            case 'json':
                return json_decode($valor, true);
            default:
                return $valor;
        }
    }
}
