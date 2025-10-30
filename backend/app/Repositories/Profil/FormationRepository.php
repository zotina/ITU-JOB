<?php

namespace App\Repositories\Profil;

use App\Models\Profil\Formation;

class FormationRepository
{
    protected $model;

    public function __construct(Formation $model)
    {
        $this->model = $model;
    }

    public function create(array $data): Formation
    {
        return $this->model->create($data);
    }

    public function deleteByEtudiantId(string $etudiantId): void
    {
        $this->model->where('id_profil_etudiant', $etudiantId)->delete();
    }

    public function generateFormationId(): string
    {
        $lastFormation = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastFormation ? (int) substr($lastFormation->id, 4) : 0;
        return sprintf('FOR-%05d', $lastId + 1);
    }
}
