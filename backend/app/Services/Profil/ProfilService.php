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

            $profil = $this->profilEtudiantRepository->getProfilEtudiant($id);

            $progressionMap= $this->calculateProfileProgression($profil);
            $this->profilEtudiantRepository->update($id, [
                'progression' => $progressionMap['progression'],
                'progression_metadata' => $progressionMap['progression_metadata'],
            ]);

            return $this->getProfilEtudiant($id);
        });
    }

    private function calculateProfileProgression($profil)
    {
        $progression_details = [];
        
        // ==========================================
        // 1. INFORMATIONS PERSONNELLES (20%)
        // ==========================================
        $info_score = 0;
        
        $info_score += $profil->photo_profil_url ? 15 : 0;
        $info_score += $profil->titre ? 15 : 0;
        $info_score += ($profil->bio && strlen($profil->bio) >= 100) ? 20 : 
                    (strlen($profil->bio ?? '') >= 50 ? 10 : 0);
        $info_score += $profil->date_naissance ? 10 : 0;
        $info_score += ($profil->ville && $profil->pays) ? 15 : 0;
        $info_score += $profil->linkedin_url ? 10 : 0;
        $info_score += $profil->disponibilite ? 10 : 0;
        $info_score += $profil->type_recherche ? 5 : 0;
        
        $info_percentage = min(100, $info_score);
        $progression_details['info_personnel'] = $info_percentage;
        
        // ==========================================
        // 2. FORMATIONS (15%)
        // ==========================================
        $formation_score = 0;
        $formations = $profil->formations;
        
        if ($formations->count() > 0) {
            // Base : au moins une formation
            $formation_score += 40;
            
            // Bonus pour plusieurs formations
            $formation_score += min(20, ($formations->count() - 1) * 10);
            
            // Qualité des formations
            foreach ($formations->take(3) as $formation) {
                if ($formation->description && strlen($formation->description) >= 50) {
                    $formation_score += 8;
                }
                if ($formation->domaine_etude) {
                    $formation_score += 4;
                }
                if ($formation->ville && $formation->pays) {
                    $formation_score += 4;
                }
                if ($formation->date_debut && $formation->date_fin) {
                    $formation_score += 4;
                }
            }
        }
        
        $formation_percentage = min(100, $formation_score);
        $progression_deails['formation'] = $formation_percentage;
        
        // ==========================================
        // 3. EXPÉRIENCES PROFESSIONNELLES (25%)
        // ==========================================
        $experience_score = 0;
        $experiences = $profil->experiences;
        
        if ($experiences->count() > 0) {
            // Base : au moins une expérience
            $experience_score += 35;
            
            // Bonus pour plusieurs expériences
            $experience_score += min(20, ($experiences->count() - 1) * 10);
            
            // Qualité des expériences
            foreach ($experiences->take(3) as $exp) {
                if ($exp->description && strlen($exp->description) >= 100) {
                    $experience_score += 10;
                }
                if ($exp->type_contrat) {
                    $experience_score += 3;
                }
                if ($exp->ville && $exp->pays) {
                    $experience_score += 3;
                }
                if ($exp->date_debut) {
                    $experience_score += 4;
                }
            }
        }
        
        $experience_percentage = min(100, $experience_score);
        $progression_details['experience'] = $experience_percentage;
        
        // ==========================================
        // 4. COMPÉTENCES TECHNIQUES (25%)
        // ==========================================
        $competence_score = 0;
        $competences = $profil->competences;
        
        if ($competences->count() > 0) {
            // Base : au moins 3 compétences
            if ($competences->count() >= 3) {
                $competence_score += 40;
            } else {
                $competence_score += $competences->count() * 13;
            }
            
            // Bonus quantité (jusqu'à 10 compétences)
            $competence_score += min(25, max(0, $competences->count() - 3) * 3.5);
            
            // Qualité : niveau précisé
            $avec_niveau = $competences->where('niveau_int', '>', 0)->count();
            $competence_score += min(20, $avec_niveau * 2);
            
            // Qualité : niveau avancé/expert
            $niveau_expert = $competences->where('niveau_int', '>=', 4)->count();
            $competence_score += min(10, $niveau_expert * 5);
            
            // Qualité : expérience précisée
            $avec_experience = $competences->where('annees_experience', '>', 0)->count();
            $competence_score += min(5, $avec_experience * 1);
        }
        
        $competence_percentage = min(100, $competence_score);
        $progression_details['competence'] = $competence_percentage;
        
        // ==========================================
        // 5. SOFT SKILLS (10%)
        // ==========================================
        $soft_skills_score = 0;
        $soft_skills = $profil->softSkills;
        
        if ($soft_skills->count() > 0) {
            // Base : au moins 3 soft skills
            if ($soft_skills->count() >= 3) {
                $soft_skills_score += 60;
            } else {
                $soft_skills_score += $soft_skills->count() * 20;
            }
            
            // Bonus quantité (jusqu'à 6 soft skills)
            $soft_skills_score += min(30, max(0, $soft_skills->count() - 3) * 10);
            
            // Qualité : niveau précisé
            $avec_niveau = $soft_skills->where('niveau', '!=', null)->count();
            $soft_skills_score += min(10, $avec_niveau * 2);
        }
        
        $soft_skills_percentage = min(100, $soft_skills_score);
        $progression_details['soft_skills'] = $soft_skills_percentage;
        
        // ==========================================
        // 6. LANGUES (5%)
        // ==========================================
        $langue_score = 0;
        $langues = $profil->langues;
        
        if ($langues->count() > 0) {
            // Base : au moins 2 langues
            if ($langues->count() >= 2) {
                $langue_score += 60;
            } else {
                $langue_score += 30;
            }
            
            // Bonus quantité
            $langue_score += min(25, max(0, $langues->count() - 2) * 12.5);
            
            // Qualité : niveau précisé
            $avec_niveau = $langues->where('niveau_int', '>', 0)->count();
            $langue_score += min(15, $avec_niveau * 5);
        }
        
        $langue_percentage = min(100, $langue_score);
        $progression_details['langue'] = $langue_percentage;
        
        // ==========================================
        // CALCUL PROGRESSION GLOBALE (moyenne pondérée)
        // ==========================================
        $weights = [
            'info_personnel' => 0.20,  // 20%
            'formation' => 0.15,       // 15%
            'experience' => 0.25,      // 25%
            'competence' => 0.25,      // 25%
            'soft_skills' => 0.10,     // 10%
            'langue' => 0.05,          // 5%
        ];
        
        $progression_totale = 
            ($info_percentage * $weights['info_personnel']) +
            ($formation_percentage * $weights['formation']) +
            ($experience_percentage * $weights['experience']) +
            ($competence_percentage * $weights['competence']) +
            ($soft_skills_percentage * $weights['soft_skills']) +
            ($langue_percentage * $weights['langue']);
        
        $progression_totale = round($progression_totale, 1);
        
        return [
            'progression' => $progression_totale,
            'progression_metadata' => $progression_details,
        ];
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

