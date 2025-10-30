<?php

namespace App\Services\Profil;

use App\Repositories\Profil\ProfilRecruteurRepository;
use App\Repositories\Profil\ProfilEtudiantRepository;
use App\Repositories\Profil\CompetencesEtudiantRepository;
use App\Repositories\Profil\LanguesEtudiantRepository;
use App\Repositories\Profil\SoftSkillsEtudiantRepository;
use App\Repositories\Profil\ExperienceProfessionnelleRepository;
use App\Repositories\Profil\FormationRepository;
use App\Services\Util\ProfileImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfilService
{
    protected $profilRecruteurRepository;
    protected $profilEtudiantRepository;
    protected $competencesEtudiantRepository;
    protected $languesEtudiantRepository;
    protected $softSkillsEtudiantRepository;
    protected $experienceProfessionnelleRepository;
    protected $formationRepository;
    protected $profileImageService;

    public function __construct(
        ProfilRecruteurRepository $profilRecruteurRepository,
        ProfilEtudiantRepository $profilEtudiantRepository,
        CompetencesEtudiantRepository $competencesEtudiantRepository,
        LanguesEtudiantRepository $languesEtudiantRepository,
        SoftSkillsEtudiantRepository $softSkillsEtudiantRepository,
        ExperienceProfessionnelleRepository $experienceProfessionnelleRepository,
        FormationRepository $formationRepository,
        ProfileImageService $profileImageService
    ) {
        $this->profilRecruteurRepository = $profilRecruteurRepository;
        $this->profilEtudiantRepository = $profilEtudiantRepository;
        $this->competencesEtudiantRepository = $competencesEtudiantRepository;
        $this->languesEtudiantRepository = $languesEtudiantRepository;
        $this->softSkillsEtudiantRepository = $softSkillsEtudiantRepository;
        $this->experienceProfessionnelleRepository = $experienceProfessionnelleRepository;
        $this->formationRepository = $formationRepository;
        $this->profileImageService = $profileImageService;
    }

    public function getProfilRecruteur(string $id)
    {
        return $this->profilRecruteurRepository->getProfilRecruteur($id);
    }

    public function getProfilEtudiant(string $id)
    {
        return $this->profilEtudiantRepository->getProfilEtudiant($id);
    }

    public function updateProfilEtudiant(Request $request, string $id)
    {
        return DB::transaction(function () use ($request, $id) {
            $data = $request->all();

            if (isset($data['info_personnel'])) {
                $this->profilEtudiantRepository->update($id, $data['info_personnel']);
            }

            if ($request->hasFile('photo')) {
                $this->profileImageService->uploadProfileImage(
                    file: $request->file('photo'),
                    tableName: 'profil_etudiant',
                    columnName: 'photo_profil_url',
                    userId: $id,
                    role: 'etudiant'
                );
            }

            if (isset($data['competences_etudiant'])) {
                $this->competencesEtudiantRepository->deleteByEtudiantId($id);
                foreach ($data['competences_etudiant'] as $competence) {
                    $competence['id_profil_etudiant'] = $id;
                    $this->competencesEtudiantRepository->create($competence);
                }
            }

            if (isset($data['langues_etudiant'])) {
                $this->languesEtudiantRepository->deleteByEtudiantId($id);
                foreach ($data['langues_etudiant'] as $langue) {
                    $langue['id_profil_etudiant'] = $id;
                    $this->languesEtudiantRepository->create($langue);
                }
            }

            if (isset($data['soft_skills_etudiant'])) {
                $this->softSkillsEtudiantRepository->deleteByEtudiantId($id);
                foreach ($data['soft_skills_etudiant'] as $softSkill) {
                    $softSkill['id_profil_etudiant'] = $id;
                    $this->softSkillsEtudiantRepository->create($softSkill);
                }
            }

            if (isset($data['experience_professionnelle'])) {
                $this->experienceProfessionnelleRepository->deleteByEtudiantId($id);
                foreach ($data['experience_professionnelle'] as $experience) {
                    $experience['id_profil_etudiant'] = $id;
                    $this->experienceProfessionnelleRepository->create($experience);
                }
            }

            if (isset($data['formation'])) {
                $this->formationRepository->deleteByEtudiantId($id);
                foreach ($data['formation'] as $formation) {
                    $formation['id_profil_etudiant'] = $id;
                    $this->formationRepository->create($formation);
                }
            }

            return $this->getProfilEtudiant($id);
        });
    }

    public function updateProfilRecruteur(Request $request, string $id)
    {
        return DB::transaction(function () use ($request, $id) {
            $data = $request->all();

            if (isset($data['info_personnel'])) {
                $this->profilRecruteurRepository->update($id, $data['info_personnel']);
            }

            if ($request->hasFile('logo')) {
                $this->profileImageService->uploadProfileImage(
                    file: $request->file('logo'),
                    tableName: 'profil_recruteur',
                    columnName: 'logo_url',
                    userId: $id,
                    role: 'recruteur'
                );
            }

            return $this->getProfilRecruteur($id);
        });
    }
}

