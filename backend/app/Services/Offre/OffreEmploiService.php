<?php

namespace App\Services\Offre;

use App\Models\Profil\ProfilEtudiant;
use App\Repositories\Offre\OffreEmploiRepository;

class OffreEmploiService
{
    protected $offreEmploiRepository;

    public function __construct(OffreEmploiRepository $offreEmploiRepository)
    {
        $this->offreEmploiRepository = $offreEmploiRepository;
    }

    public function listerOffres(array $filters = [], ?ProfilEtudiant $profilEtudiant = null)
    {
        $offres = $this->offreEmploiRepository->search($filters);

        if ($profilEtudiant) {
            $competencesEtudiant = $profilEtudiant->competences->pluck('nom_competence')->toArray();

            $offres->each(function ($offre) use ($competencesEtudiant) {
                $competencesRequises = $offre->competencesRequises->pluck('nom_competence')->toArray();
                $offre->matching_percentage = $this->calculateMatchingPercentage($competencesEtudiant, $competencesRequises);
            });
        }

        return $offres;
    }

    private function calculateMatchingPercentage(array $competencesEtudiant, array $competencesRequises): float
    {
        if (count($competencesRequises) === 0) {
            return 100.0;
        }

        $matches = count(array_intersect($competencesEtudiant, $competencesRequises));

        return round(($matches / count($competencesRequises)) * 100, 2);
    }

    public function voirOffre(string $id)
    {
        return $this->offreEmploiRepository->findOffreById($id);
    }
}
