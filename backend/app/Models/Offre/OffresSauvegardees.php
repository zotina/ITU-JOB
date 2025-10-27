<?php

namespace App\Models\Offre;

use App\Models\Profil\ProfilEtudiant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OffresSauvegardees extends Model
{
    protected $table = 'offres_sauvegardees';
    protected $primaryKey = ['id_profil_etudiant', 'id_offre_emploi'];
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id_profil_etudiant',
        'id_offre_emploi',
        'date_sauvegarde',
        'notes',
    ];

    protected $casts = [
        'date_sauvegarde' => 'datetime',
    ];

    public function profilEtudiant(): BelongsTo
    {
        return $this->belongsTo(ProfilEtudiant::class, 'id_profil_etudiant', 'id');
    }

    public function offreEmploi(): BelongsTo
    {
        return $this->belongsTo(OffreEmploi::class, 'id_offre_emploi', 'id');
    }
}
