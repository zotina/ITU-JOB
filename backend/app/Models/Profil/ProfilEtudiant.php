<?php

namespace App\Models\Profil;

use App\Models\Utilisateur\Utilisateur;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Repositories\Profil\ProfilEtudiantRepository;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProfilEtudiant extends Model
{
    protected $table = 'profil_etudiant';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'id_utilisateur',
        'photo_profil_url',
        'titre',
        'bio',
        'date_naissance',
        'ville',
        'pays',
        'code_pays',
        'latitude',
        'longitude',
        'linkedin_url',
        'github_url',
        'portfolio_url',
        'disponibilite',
        'type_recherche',
        'taux_journalier',
        'mobilite',
        'teletravail_preference',
        'salaire_minimum_souhaite',
        'devise_salaire',
        'profil_complete_pourcentage',
        'nb_vues_profil',
        'progression',
        'progression_metadata',
    ];

    protected $casts = [
        'progression_metadata' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = app(ProfilEtudiantRepository::class)->generateProfilEtudiantId();
            }
        });
    }

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur', 'id');
    }

    public function competences(): HasMany
    {
        return $this->hasMany(CompetencesEtudiant::class, 'id_profil_etudiant', 'id');
    }

    public function langues(): HasMany
    {
        return $this->hasMany(LanguesEtudiant::class, 'id_profil_etudiant', 'id');
    }

    public function softSkills(): HasMany
    {
        return $this->hasMany(SoftSkillsEtudiant::class, 'id_profil_etudiant', 'id');
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(ExperienceProfessionnelle::class, 'id_profil_etudiant', 'id');
    }

    public function formations(): HasMany
    {
        return $this->hasMany(Formation::class, 'id_profil_etudiant', 'id');
    }

    public function certifications(): HasMany
    {
        return $this->hasMany(Certifications::class, 'id_profil_etudiant', 'id');
    }

    public function projets(): HasMany
    {
        return $this->hasMany(Projets::class, 'id_profil_etudiant', 'id');
    }

    public function candidatures(): HasMany
    {
        return $this->hasMany(Candidature::class, 'id_profil_etudiant', 'id');
    }

    public function offresSauvegardees(): HasMany
    {
        return $this->hasMany(OffresSauvegardees::class, 'id_profil_etudiant', 'id');
    }
}
