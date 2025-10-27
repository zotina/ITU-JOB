<?php

namespace App\Services\Candidature;

use App\Repositories\Candidature\CandidatureRepository;
use App\Repositories\Offre\OffreEmploiRepository;
use App\Models\Candidature\Candidature;
use Illuminate\Support\Facades\DB;

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
        try {
            DB::beginTransaction();

            $candidature = $this->model->create([
                'id_offre_emploi' => $idOffre,
                'id_profil_etudiant' => $idProfilEtudiant,
            ]);

            $offre = $this->offreEmploiRepository->findOffreById($idOffre);
            if ($offre) {
                $offre->increment('nb_candidatures');
            }

            DB::commit();

            return $candidature;
        } catch (\Exception $e) {
            DB::rollBack();
            
            throw $e;
        }
    }
}