<?php

namespace App\Repositories\Profil;

use App\Models\Profil\CompetencesEtudiant;

class CompetencesEtudiantRepository
{
    protected $model;

    public function __construct(CompetencesEtudiant $model)
    {
        $this->model = $model;
    }

    public function create(array $data): CompetencesEtudiant
    {
        return $this->model->create($data);
    }

    public function deleteByEtudiantId(string $etudiantId): void
    {
        $this->model->where('id_profil_etudiant', $etudiantId)->delete();
    }

    public function generateCompetencesEtudiantId(): string
    {
        $lastCompetence = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastCompetence ? (int) substr($lastCompetence->id, 4) : 0;
        return sprintf('CET-%05d', $lastId + 1);
    }
}
