<?php

namespace App\Repositories\Offre;

use App\Models\Offre\OffresSauvegardees;

class OffresSauvegardeesRepository
{
    protected $model;

    public function __construct(OffresSauvegardees $model)
    {
        $this->model = $model;
    }
}
