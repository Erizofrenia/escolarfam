<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mensaje extends Model
{
    protected $table = 'mensajes';
    protected $primaryKey = 'id_mensaje';
    public $timestamps = false;

    protected $fillable = [
        'id_remitente',
        'id_destinatario',
        'asunto',
        'contenido',
        'leido',
        'tipo'
    ];

    protected $casts = [
        'leido' => 'boolean',
        'fecha_envio' => 'datetime'
    ];

    // Relaciones
    public function remitente()
    {
        return $this->belongsTo(Usuario::class, 'id_remitente', 'id_usuario');
    }

    public function destinatario()
    {
        return $this->belongsTo(Usuario::class, 'id_destinatario', 'id_usuario');
    }

    // Scopes
    public function scopeNoLeidos($query)
    {
        return $query->where('leido', 0);
    }
}
