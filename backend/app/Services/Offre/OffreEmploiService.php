<?php

namespace App\Services\Offre;

use App\Repositories\Offre\OffreEmploiRepository;

class OffreEmploiService
{
    protected $offreEmploiRepository;

    public function __construct(OffreEmploiRepository $offreEmploiRepository)
    {
        $this->offreEmploiRepository = $offreEmploiRepository;
    }

    public function listerOffres()
    {
        return $this->offreEmploiRepository->getAllOffres();
    }

    public function voirOffre(string $id)
    {
        return $this->offreEmploiRepository->findOffreById($id);
    }
}
