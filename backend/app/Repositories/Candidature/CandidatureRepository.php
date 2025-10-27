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
}
