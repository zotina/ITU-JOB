<?php

namespace App\Repositories\Candidature;

use App\Models\Candidature\Candidature;

class CandidatureRepository
{
    protected $model;

    public function __construct(Candidature $model)
    {
        $this->model = $model;
    }

    public function generateCandidatureId(): string
    {
        $lastCandidature = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastCandidature ? (int) substr($lastCandidature->id, 4) : 0;
        return sprintf('CAN-%05d', $lastId + 1);
    }

    public function getByEtudiantId(string $idProfilEtudiant)
    {
        return $this->model->with('offreEmploi')->where('id_profil_etudiant', $idProfilEtudiant)->get();
    }

    public function checkExistingCandidature(string $idOffre, string $idProfilEtudiant)
    {
        return $this->model->where('id_offre_emploi', $idOffre)
            ->where('id_profil_etudiant', $idProfilEtudiant)
            ->first();
    }
}
