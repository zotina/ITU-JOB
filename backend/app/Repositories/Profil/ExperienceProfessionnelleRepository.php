<?php

namespace App\Repositories\Profil;

use App\Models\Profil\ExperienceProfessionnelle;

class ExperienceProfessionnelleRepository
{
    protected $model;

    public function __construct(ExperienceProfessionnelle $model)
    {
        $this->model = $model;
    }

    public function create(array $data): ExperienceProfessionnelle
    {
        return $this->model->create($data);
    }

    public function deleteByEtudiantId(string $etudiantId): void
    {
        $this->model->where('id_profil_etudiant', $etudiantId)->delete();
    }

    public function generateExperienceProfessionnelleId(): string
    {
        $lastExperience = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastExperience ? (int) substr($lastExperience->id, 4) : 0;
        return sprintf('EXP-%05d', $lastId + 1);
    }
}
