<?php

namespace App\Models\Profil;

use App\Repositories\Profil\FormationRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Formation extends Model
{
    protected $table = 'formation';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'id_profil_etudiant',
        'diplome',
        'etablissement',
        'domaine_etude',
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
                $model->id = app(FormationRepository::class)->generateFormationId();
            }
        });
    }

    public function profilEtudiant(): BelongsTo
    {
        return $this->belongsTo(ProfilEtudiant::class, 'id_profil_etudiant', 'id');
    }
}
