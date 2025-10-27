<?php

namespace App\Models\Profil;

use App\Repositories\Profil\SoftSkillsEtudiantRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SoftSkillsEtudiant extends Model
{
    protected $table = 'soft_skills_etudiant';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'id_profil_etudiant',
        'nom_soft_skill',
        'niveau',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = app(SoftSkillsEtudiantRepository::class)->generateSoftSkillsEtudiantId();
            }
        });
    }

    public function profilEtudiant(): BelongsTo
    {
        return $this->belongsTo(ProfilEtudiant::class, 'id_profil_etudiant', 'id');
    }
}
