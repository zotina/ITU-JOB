<?php

namespace App\Services\Candidature;

use App\Repositories\Candidature\CandidatureRepository;
use App\Repositories\Offre\OffreEmploiRepository;
use App\Models\Candidature\Candidature;

class CandidatureService
{
    protected $candidatureRepository;
    protected $offreEmploiRepository;
    protected $model;

    public function __construct(CandidatureRepository $candidatureRepository, OffreEmploiRepository $offreEmploiRepository,Candidature $model)
    {
        $this->candidatureRepository = $candidatureRepository;
        $this->offreEmploiRepository = $offreEmploiRepository;
        $this->model = $model;
    }

    public function postuler(string $idOffre, string $idProfilEtudiant)
    {
        $existingCandidature = $this->candidatureRepository->checkExistingCandidature($idOffre, $idProfilEtudiant);

        if ($existingCandidature) {
            throw new \Exception('Vous avez deja un candidature en cours sur cette offre');
        }

        $offre = $this->offreEmploiRepository->findOffreById($idOffre);
        if ($offre) {
            $offre->increment('nb_candidatures');
        }
        
        return  $this->model->create([
            'id_offre_emploi' => $idOffre,
            'id_profil_etudiant' => $idProfilEtudiant,
            'statut' => 'en attente',
        ]);
    }

    public function getEtudiantCandidatures(string $idProfilEtudiant)
    {
        $candidatures = $this->candidatureRepository->getByEtudiantId($idProfilEtudiant);

        $metadata = [
            'total' => $candidatures->count(),
            'acceptee' => $candidatures->where('statut', 'acceptee')->count(),
            'en_attente' => $candidatures->where('statut', 'en attente')->count(),
            'refusee' => $candidatures->where('statut', 'refusee')->count(),
        ];

        return [
            'data' => $candidatures,
            'metadata' => $metadata,
        ];
    }
}