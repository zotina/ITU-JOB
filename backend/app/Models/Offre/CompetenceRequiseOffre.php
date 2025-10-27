<?php

namespace App\Models\Offre;

use App\Repositories\Offre\CompetenceRequiseOffreRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompetenceRequiseOffre extends Model
{
    protected $table = 'competences_requises_offre';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'id_offre_emploi',
        'nom_competence',
        'est_obligatoire',
        'niveau_requis',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = app(CompetenceRequiseOffreRepository::class)->generateCompetenceRequiseOffreId();
            }
        });
    }

    public function offreEmploi(): BelongsTo
    {
        return $this->belongsTo(OffreEmploi::class, 'id_offre_emploi', 'id');
    }
}
