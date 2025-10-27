<?php

namespace App\Repositories\Profil;

use App\Models\Profil\Projets;

class ProjetsRepository
{
    protected $model;

    public function __construct(Projets $model)
    {
        $this->model = $model;
    }

    public function generateProjetsId(): string
    {
        $lastProjet = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastProjet ? (int) substr($lastProjet->id, 4) : 0;
        return sprintf('PRO-%05d', $lastId + 1);
    }
}
