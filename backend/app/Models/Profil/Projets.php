<?php

namespace App\Models\Profil;

use App\Repositories\Profil\ProjetsRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Projets extends Model
{
    protected $table = 'projets';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'id_profil_etudiant',
        'nom_projet',
        'description',
        'url_projet',
        'url_github',
        'image_apercu_url',
        'date_debut',
        'date_fin',
        'technologies',
        'ordre_affichage',
    ];

    protected $casts = [
        'technologies' => 'json',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = app(ProjetsRepository::class)->generateProjetsId();
            }
        });
    }

    public function profilEtudiant(): BelongsTo
    {
        return $this->belongsTo(ProfilEtudiant::class, 'id_profil_etudiant', 'id');
    }
}
