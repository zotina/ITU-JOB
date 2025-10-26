<?php

namespace App\Repositories;

use App\Models\Offre;

class OffreRepository
{
    protected $model;

    public function __construct(Offre $model)
    {
        $this->model = $model;
    }

    public function generateOffreId(): string
    {
        $lastOffre = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastOffre ? (int) substr($lastOffre->id, 6) : 0;
        return sprintf('OFFRE-%05d', $lastId + 1);
    }

    public function getPublishedOffers(int $perPage = 15)
    {
        return $this->model
            ->where('statut', 'publiee')
            ->orderBy('date_publication', 'desc')
            ->paginate($perPage);
    }
}
