<?php

namespace App\Services\Profil;

use App\Repositories\Profil\ProfilRecruteurRepository;
use App\Repositories\Profil\ProfilEtudiantRepository;

class ProfilService
{
    protected $profilRecruteurRepository;
    protected $profilEtudiantRepository;
    protected $model;

    public function __construct(
        ProfilRecruteurRepository $profilRecruteurRepository,
        ProfilEtudiantRepository $profilEtudiantRepository,
    ) {
        $this->profilRecruteurRepository = $profilRecruteurRepository;
        $this->profilEtudiantRepository = $profilEtudiantRepository;
    }

    public function getProfilRecruteur(string $id)
    {
        return $this->profilRecruteurRepository->getProfilRecruteur($id);
    }

    public function getProfilEtudiant(string $id)
    {
        return $this->profilEtudiantRepository->getProfilEtudiant($id);
    }
}
