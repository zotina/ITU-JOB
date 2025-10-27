<?php

namespace App\Repositories\Profil;

use App\Models\Profil\SoftSkillsEtudiant;

class SoftSkillsEtudiantRepository
{
    protected $model;

    public function __construct(SoftSkillsEtudiant $model)
    {
        $this->model = $model;
    }

    public function generateSoftSkillsEtudiantId(): string
    {
        $lastSoftSkill = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastSoftSkill ? (int) substr($lastSoftSkill->id, 4) : 0;
        return sprintf('SKE-%05d', $lastId + 1);
    }
}
