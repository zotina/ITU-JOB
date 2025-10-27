<?php

namespace App\Models\Offre;

use App\Models\Profil\ProfilRecruteur;
use App\Repositories\Offre\OffreEmploiRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OffreEmploi extends Model
{
    protected $table = 'offres_emploi';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'id_profil_recruteur',
        'titre',
        'slug',
        'description',
        'type_contrat',
        'mode_travail',
        'niveau_experience',
        'ville',
        'pays',
        'code_pays',
        'latitude',
        'longitude',
        'salaire_min',
        'salaire_max',
        'devise_salaire',
        'periode_salaire',
        'statut',
        'date_publication',
        'date_expiration',
        'nb_vues',
        'nb_candidatures',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = app(OffreEmploiRepository::class)->generateOffreEmploiId();
            }
        });
    }

    public function profilRecruteur(): BelongsTo
    {
        return $this->belongsTo(ProfilRecruteur::class, 'id_profil_recruteur', 'id');
    }

    public function competencesRequises(): HasMany
    {
        return $this->hasMany(CompetenceRequiseOffre::class, 'id_offre_emploi', 'id');
    }

    public function candidatures(): HasMany
    {
        return $this->hasMany(Candidature::class, 'id_offre_emploi', 'id');
    }

    public function offresSauvegardees(): HasMany
    {
        return $this->hasMany(OffresSauvegardees::class, 'id_offre_emploi', 'id');
    }
}
