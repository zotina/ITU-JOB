<?php

namespace App\Models\Profil;

use App\Repositories\Profil\LanguesEtudiantRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LanguesEtudiant extends Model
{
    protected $table = 'langues_etudiant';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'id_profil_etudiant',
        'nom_langue',
        'niveau',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = app(LanguesEtudiantRepository::class)->generateLanguesEtudiantId();
            }
        });
    }

    public function profilEtudiant(): BelongsTo
    {
        return $this->belongsTo(ProfilEtudiant::class, 'id_profil_etudiant', 'id');
    }
}
