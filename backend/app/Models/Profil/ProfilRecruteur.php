<?php

namespace App\Models\Profil;

use App\Models\Utilisateur\Utilisateur;
use App\Models\Offre\OffreEmploi;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Repositories\Profil\ProfilRecruteurRepository;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProfilRecruteur extends Model
{
    protected $table = 'profil_recruteur';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'id_utilisateur',
        'nom_entreprise',
        'slug_entreprise',
        'logo_url',
        'banniere_url',
        'description_entreprise',
        'site_web',
        'secteur_activite',
        'taille_entreprise',
        'annee_creation',
        'ville',
        'pays',
        'code_pays',
        'latitude',
        'longitude',
        'nom_contact',
        'poste_contact',
        'email_contact',
        'telephone_contact',
        'linkedin_url',
        'twitter_url',
        'facebook_url',
        'nb_offres_actives',
        'nb_candidatures_recues',
        'nb_entretiens_planifies',
        'nb_embauches',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = app(ProfilRecruteurRepository::class)->generateProfilRecruteurId();
            }
        });
    }

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur', 'id');
    }

    public function offresEmploi(): HasMany
    {
        return $this->hasMany(OffreEmploi::class, 'id_profil_recruteur', 'id');
    }
}
