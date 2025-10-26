<?php

namespace App\Services;

use App\Repositories\OffreRepository;

class OffreService
{
    protected $offreRepository;

    public function __construct(OffreRepository $offreRepository)
    {
        $this->offreRepository = $offreRepository;
    }

    public function listPublishedOffers()
    {
        return $this->offreRepository->getPublishedOffers();
    }
}
