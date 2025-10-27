<?php

namespace App\Repositories\Profil;

use App\Models\Profil\ProfilRecruteur;

class ProfilRecruteurRepository
{
    protected $model;

    public function __construct(ProfilRecruteur $model)
    {
        $this->model = $model;
    }

    public function generateProfilRecruteurId(): string
    {
        $lastProfil = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastProfil ? (int) substr($lastProfil->id, 4) : 0;
        return sprintf('REC-%05d', $lastId + 1);
    }
    
    public function getProfilRecruteur($id)
    {
        return $this->model->with('utilisateur')->find($id);
    }
    
}
