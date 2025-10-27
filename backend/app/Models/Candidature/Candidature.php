<?php

namespace App\Models\Candidature;

use App\Models\Offre\OffreEmploi;
use App\Models\Profil\ProfilEtudiant;
use App\Repositories\Candidature\CandidatureRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Candidature extends Model
{
    protected $table = 'candidatures';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'id_offre_emploi',
        'id_profil_etudiant',
        'statut',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = app(CandidatureRepository::class)->generateCandidatureId();
            }
        });
    }

    public function offreEmploi(): BelongsTo
    {
        return $this->belongsTo(OffreEmploi::class, 'id_offre_emploi', 'id');
    }

    public function profilEtudiant(): BelongsTo
    {
        return $this->belongsTo(ProfilEtudiant::class, 'id_profil_etudiant', 'id');
    }
}
