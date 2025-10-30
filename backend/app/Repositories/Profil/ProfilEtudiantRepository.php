<?php

namespace App\Repositories\Profil;

use App\Models\Profil\ProfilEtudiant;

class ProfilEtudiantRepository
{
    protected $model;

    public function __construct(ProfilEtudiant $model)
    {
        $this->model = $model;
    }

    public function generateProfilEtudiantId(): string
    {
        $lastProfil = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastProfil ? (int) substr($lastProfil->id, 4) : 0;
        return sprintf('ETU-%05d', $lastId + 1);
    }
    public function getProfilEtudiant($id){
        return $this->model->with('utilisateur', 'competences', 'langues', 'softSkills', 'experiences', 'formations', 'certifications', 'projets')->find($id);
    }

    public function update(string $id, array $data)
    {
        $profil = $this->model->find($id);
        if ($profil) {
            $profil->update($data);
            return $profil;
        }
        return null;
    }
}
