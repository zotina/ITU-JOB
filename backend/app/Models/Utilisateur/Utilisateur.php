<?php

namespace App\Models\Utilisateur;

use App\Models\Profil\ProfilEtudiant;
use App\Models\Profil\ProfilRecruteur;
use App\Repositories\Utilisateur\UserRepository;
use Illuminate\Database\Eloquent\Model;

class Utilisateur extends Model
{
    protected $table = 'utilisateur';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'mot_de_passe_hash',
        'email',
        'prenom',
        'nom',
        'telephone',
        'adresse',
        'est_actif',
        'date_creation',
        'date_derniere_connexion',
        'id_role'
    ];

    protected $hidden = [
        'mot_de_passe_hash'
    ];

    protected $casts = [
        'est_actif' => 'integer',
        'date_creation' => 'datetime',
        'date_derniere_connexion' => 'datetime'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = app(UserRepository::class)->generateUserId();
            }

            if (empty($model->date_creation)) {
                $model->date_creation = now();
            }
        });
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'id_role');
    }

    public function profilEtudiant()
    {
        return $this->hasOne(ProfilEtudiant::class, 'id_utilisateur');
    }

    public function profilRecruteur()
    {
        return $this->hasOne(ProfilRecruteur::class, 'id_utilisateur');
    }

    public function isEtudiant(): bool
    {
        return $this->role->val === Role::ETUDIANT;
    }

    public function isRecruteur(): bool
    {
        return $this->role->val === Role::RECRUTEUR;
    }

    public function hasRole(string $role): bool
    {
        return $this->role->val === $role;
    }
    
    public function updatePassword(string $newPassword): bool
    {
        $this->mot_de_passe_hash = bcrypt($newPassword);
        return $this->save();
    }
}