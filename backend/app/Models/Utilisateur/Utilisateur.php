<?php

namespace App\Models\Utilisateur;

use App\Repositories\Utilisateur\UserRepository;
use Illuminate\Database\Eloquent\Model;
use App\Models\Interaction\Like;
use App\Models\Vente\Annonce;

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

    public function likes()
    {
        return $this->hasMany(Like::class, 'id_utilisateur', 'id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'id_role');
    }

    public function likedAnnonces()
    {
        return $this->belongsToMany(
            Annonce::class,
            'IF_likes',
            'id_utilisateur',
            'id_annonce'
        )->withTimestamps();
    }

    
    public function hasLiked(string $annonceId): bool
    {
        return $this->likes()
            ->where('id_annonce', $annonceId)
            ->exists();
    }
    
    public function updatePassword(string $newPassword): bool
    {
        $this->mot_de_passe_hash = bcrypt($newPassword);
        return $this->save();
    }
}