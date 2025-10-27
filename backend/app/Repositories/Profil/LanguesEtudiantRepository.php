<?php

namespace App\Repositories\Profil;

use App\Models\Profil\LanguesEtudiant;

class LanguesEtudiantRepository
{
    protected $model;

    public function __construct(LanguesEtudiant $model)
    {
        $this->model = $model;
    }

    public function generateLanguesEtudiantId(): string
    {
        $lastLangue = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastLangue ? (int) substr($lastLangue->id, 4) : 0;
        return sprintf('LET-%05d', $lastId + 1);
    }
}
