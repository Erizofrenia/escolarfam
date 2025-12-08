<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;

    protected $fillable = [
        'id_escuela',
        'nombre_completo',
        'nombre_usuario',
        'email',
        'password_hash',
        'rol',
        'foto_perfil',
        'activo',
        'asignacion'
    ];

    protected $hidden = [
        'password_hash'
    ];

    protected $casts = [
        'activo' => 'boolean',
        'fecha_registro' => 'datetime',
        'ultimo_acceso' => 'datetime'
    ];

    // Relaciones
    public function escuela()
    {
        return $this->belongsTo(Escuela::class, 'id_escuela', 'id_escuela');
    }

    public function hijos()
    {
        return $this->belongsToMany(Usuario::class, 'relaciones_familiares', 'id_padre', 'id_hijo')
            ->withPivot('parentesco', 'autorizado_recogida');
    }

    public function padres()
    {
        return $this->belongsToMany(Usuario::class, 'relaciones_familiares', 'id_hijo', 'id_padre')
            ->withPivot('parentesco', 'autorizado_recogida');
    }

    public function grupos()
    {
        return $this->belongsToMany(Grupo::class, 'asignaciones_grupos', 'id_usuario', 'id_grupo')
            ->withPivot('activa', 'fecha_asignacion');
    }

    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class, 'id_usuario', 'id_usuario');
    }

    public function mensajesEnviados()
    {
        return $this->hasMany(Mensaje::class, 'id_remitente', 'id_usuario');
    }

    public function mensajesRecibidos()
    {
        return $this->hasMany(Mensaje::class, 'id_destinatario', 'id_usuario');
    }

    public function personasConfianza()
    {
        return $this->hasMany(PersonaConfianza::class, 'id_padre', 'id_usuario');
    }

    public function solicitudesRecogida()
    {
        return $this->hasMany(SolicitudRecogida::class, 'id_padre', 'id_usuario');
    }

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('activo', 1);
    }

    public function scopePorRol($query, $rol)
    {
        return $query->where('rol', $rol);
    }

    public function scopeStaff($query)
    {
        return $query->whereIn('rol', ['maestro', 'admin']);
    }
}
