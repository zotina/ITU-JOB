<?php

namespace App\Repositories\Offre;

use App\Models\Offre\OffreEmploi;

class OffreEmploiRepository
{
    protected $model;

    public function __construct(OffreEmploi $model)
    {
        $this->model = $model;
    }

    public function generateOffreEmploiId(): string
    {
        $lastOffre = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastOffre ? (int) substr($lastOffre->id, 4) : 0;
        return sprintf('OFF-%05d', $lastId + 1);
    }

    public function getAllOffres()
    {
        return $this->model->with('profilRecruteur')->where('statut', 'publiee')->get();
    }

    public function findOffreById(string $id)
    {
        return $this->model->with('profilRecruteur', 'competencesRequises')->find($id);
    }
}
