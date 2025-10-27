<?php

namespace App\Models\Profil;

use App\Repositories\Profil\CertificationsRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certifications extends Model
{
    protected $table = 'certifications';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'id_profil_etudiant',
        'nom_certification',
        'organisme',
        'date_obtention',
        'date_expiration',
        'url_credential',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = app(CertificationsRepository::class)->generateCertificationsId();
            }
        });
    }

    public function profilEtudiant(): BelongsTo
    {
        return $this->belongsTo(ProfilEtudiant::class, 'id_profil_etudiant', 'id');
    }
}
