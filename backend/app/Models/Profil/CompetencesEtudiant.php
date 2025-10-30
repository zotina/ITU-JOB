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
        'niveau_int',
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

    public function setNiveauAttribute($value)
    {
        $this->attributes['niveau'] = $value;
        $this->attributes['niveau_int'] = $this->getNiveauInt($value);
    }

    private function getNiveauInt($niveau)
    {
        $mapping = [
            'debutant' => 2,
            'intermediaire' => 5,
            'avance' => 8,
            'expert' => 10,
        ];

        return $mapping[strtolower($niveau)] ?? null;
    }

    public function profilEtudiant(): BelongsTo
    {
        return $this->belongsTo(ProfilEtudiant::class, 'id_profil_etudiant', 'id');
    }
}
