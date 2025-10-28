<?php

namespace App\Services\Profil;

use App\Repositories\Profil\ProfilRecruteurRepository;
use App\Repositories\Profil\ProfilEtudiantRepository;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ProfilService
{
    protected $profilRecruteurRepository;
    protected $profilEtudiantRepository;
    protected $model;

    public function __construct(
        ProfilRecruteurRepository $profilRecruteurRepository,
        ProfilEtudiantRepository $profilEtudiantRepository,
    ) {
        $this->profilRecruteurRepository = $profilRecruteurRepository;
        $this->profilEtudiantRepository = $profilEtudiantRepository;
    }

    public function getProfilRecruteur(string $id)
    {
        return $this->profilRecruteurRepository->getProfilRecruteur($id);
    }

    public function getProfilEtudiant(string $id)
    {
        return $this->profilEtudiantRepository->getProfilEtudiant($id);
    }

    public function updateEtudiantPosition(string $id, array $data)
    {
        $validator = Validator::make($data, [
            'ville' => 'sometimes|string|max:100',
            'pays' => 'sometimes|string|max:100',
            'code_pays' => 'sometimes|string|max:2',
            'latitude' => 'sometimes|numeric|between:-90,90',
            'longitude' => 'sometimes|numeric|between:-180,180',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $this->profilEtudiantRepository->updatePosition($id, $validator->validated());
    }

    public function updateRecruteurPosition(string $id, array $data)
    {
        $validator = Validator::make($data, [
            'ville' => 'sometimes|string|max:100',
            'pays' => 'sometimes|string|max:100',
            'code_pays' => 'sometimes|string|max:2',
            'latitude' => 'sometimes|numeric|between:-90,90',
            'longitude' => 'sometimes|numeric|between:-180,180',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $this->profilRecruteurRepository->updatePosition($id, $validator->validated());
    }
}

