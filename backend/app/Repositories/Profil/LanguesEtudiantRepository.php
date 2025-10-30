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

    public function create(array $data): LanguesEtudiant
    {
        return $this->model->create($data);
    }

    public function deleteByEtudiantId(string $etudiantId): void
    {
        $this->model->where('id_profil_etudiant', $etudiantId)->delete();
    }

    public function generateLanguesEtudiantId(): string
    {
        $lastLangue = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastLangue ? (int) substr($lastLangue->id, 4) : 0;
        return sprintf('LET-%05d', $lastId + 1);
    }
}
