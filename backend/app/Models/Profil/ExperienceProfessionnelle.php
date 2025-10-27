<?php

namespace App\Models\Profil;

use App\Repositories\Profil\ExperienceProfessionnelleRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExperienceProfessionnelle extends Model
{
    protected $table = 'experience_professionnelle';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'id_profil_etudiant',
        'titre_poste',
        'nom_entreprise',
        'type_contrat',
        'date_debut',
        'date_fin',
        'en_cours',
        'description',
        'ville',
        'pays',
        'ordre_affichage',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = app(ExperienceProfessionnelleRepository::class)->generateExperienceProfessionnelleId();
            }
        });
    }

    public function profilEtudiant(): BelongsTo
    {
        return $this->belongsTo(ProfilEtudiant::class, 'id_profil_etudiant', 'id');
    }
}
