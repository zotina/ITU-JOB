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

    public function search(array $filters = [])
    {
        $query = $this->model->with('profilRecruteur', 'competencesRequises')->where('statut', 'publiee');

        if (!empty($filters['type_contrat'])) {
            $query->where('type_contrat', $filters['type_contrat']);
        }

        if (!empty($filters['ville'])) {
            $query->where('ville', 'like', '%' . $filters['ville'] . '%');
        }

        if (!empty($filters['mot_cles'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('titre', 'like', '%' . $filters['mot_cles'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['mot_cles'] . '%');
            });
        }

        if (!empty($filters['technologie'])) {
            $query->whereHas('competencesRequises', function ($q) use ($filters) {
                $q->where('nom_competence', 'like', '%' . $filters['technologie'] . '%');
            });
        }

        return $query->get();
    }

    public function findOffreById(string $id)
    {
        return $this->model->with('profilRecruteur', 'competencesRequises')->find($id);
    }
}
