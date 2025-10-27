<?php

namespace App\Services\Offre;

use App\Repositories\Offre\OffresSauvegardeesRepository;
use App\Models\Offre\OffresSauvegardees;
class OffreSauvegardeeService
{
    protected $offresSauvegardeesRepository;

    protected $model;

    public function __construct(OffresSauvegardeesRepository $offresSauvegardeesRepository,OffresSauvegardees $model)
    {
        $this->offresSauvegardeesRepository = $offresSauvegardeesRepository;
        $this->model = $model;
    }

    public function sauvegarderOffre(string $idProfilEtudiant, string $idOffreEmploi, ?string $notes)
    {
        return $this->model->create([
            'id_profil_etudiant' => $idProfilEtudiant,
            'id_offre_emploi' => $idOffreEmploi,
            'notes' => $notes,
        ]);
    }

    public function retirerOffreSauvegardee(string $idProfilEtudiant, string $idOffreEmploi)
    {
        return $this->model
            ->where('id_profil_etudiant', $idProfilEtudiant)
            ->where('id_offre_emploi', $idOffreEmploi)
            ->delete();
    }

    public function listerOffresSauvegardees(string $idProfilEtudiant)
    {
        return $this->model
            ->where('id_profil_etudiant', $idProfilEtudiant)
            ->with('offreEmploi.profilRecruteur')
            ->get();
    }
}
