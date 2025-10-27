<?php

namespace App\Models\Profil;

use App\Repositories\Profil\CompetencesEtudiantRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompetencesEtudiant extends Model
{
    protected $table = 'competences_etudiant';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'id_profil_etudiant',
        'nom_competence',
        'categorie',
        'niveau',
        'annees_experience',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = app(CompetencesEtudiantRepository::class)->generateCompetencesEtudiantId();
            }
        });
    }

    public function profilEtudiant(): BelongsTo
    {
        return $this->belongsTo(ProfilEtudiant::class, 'id_profil_etudiant', 'id');
    }
}
