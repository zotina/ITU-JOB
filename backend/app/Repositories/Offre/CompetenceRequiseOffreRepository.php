<?php

namespace App\Repositories\Offre;

use App\Models\Offre\CompetenceRequiseOffre;

class CompetenceRequiseOffreRepository
{
    protected $model;

    public function __construct(CompetenceRequiseOffre $model)
    {
        $this->model = $model;
    }

    public function generateCompetenceRequiseOffreId(): string
    {
        $lastCompetence = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastCompetence ? (int) substr($lastCompetence->id, 4) : 0;
        return sprintf('CRO-%05d', $lastId + 1);
    }
}
