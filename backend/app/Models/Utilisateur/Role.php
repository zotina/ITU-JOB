<?php

namespace App\Models\Utilisateur;

use App\Repositories\Utilisateur\RoleRepository;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'role';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'val',
        'description'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = app(RoleRepository::class)->generateRoleId();
            }
        });
    }

    public function utilisateurs()
    {
        return $this->hasMany(Utilisateur::class, 'id_role');
    }
}