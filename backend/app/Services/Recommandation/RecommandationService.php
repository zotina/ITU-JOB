<?php

namespace App\Services\Recommandation;

use App\Models\Profil\ProfilEtudiant;

class RecommandationService
{
    public function getRecommandations(ProfilEtudiant $profil)
    {
        $recommandations = [];

        $recommandations['elements_manquants'] = $this->getSuggestionElementManquante($profil);
        $recommandations['qualite_contenu'] = $this->analyzeContentQuality($profil);
        $recommandations['optimisation_mots_cles'] = $this->analyzeKeywordsOptimization($profil);
        $recommandations['incoherences_logiques'] = $this->detectInconsistencies($profil);

        return $recommandations;
    }

    private function getSuggestionElementManquante($profil)
    {
        $suggestions_map = [
            'info_personnel' => [
                'title' => 'Complétez vos informations personnelles',
                'priority' => 'haute',
                'actions' => array_filter([
                    !$profil->photo_profil_url ? '📸 Ajoutez une photo de profil professionnelle' : null,
                    !$profil->titre ? '💼 Ajoutez un titre professionnel accrocheur' : null,
                    (!$profil->bio || strlen($profil->bio) < 100) ? '✍️ Rédigez une bio détaillée (min 100 caractères)' : null,
                    !$profil->linkedin_url ? '🔗 Ajoutez votre profil LinkedIn' : null,
                ]),
            ],
            'formation' => [
                'title' => 'Enrichissez vos formations',
                'priority' => 'moyenne',
                'actions' => array_filter([
                    $profil->formations()->count() == 0 ? '🎓 Ajoutez au moins une formation' : null,
                    $profil->formations()->count() < 2 ? '➕ Ajoutez d\'autres formations ou certifications' : null,
                    '📝 Ajoutez des descriptions détaillées à vos formations',
                    '📍 Précisez la localisation de vos établissements',
                ]),
            ],
            'experience' => [
                'title' => 'Valorisez vos expériences',
                'priority' => 'haute',
                'actions' => array_filter([
                    $profil->experiences()->count() == 0 ? '💼 Ajoutez au moins une expérience professionnelle' : null,
                    '📄 Rédigez des descriptions détaillées (min 100 caractères)',
                    '📌 Précisez le type de contrat et la localisation',
                    '📅 Complétez les dates de début et fin',
                ]),
            ],
            'competence' => [
                'title' => 'Développez vos compétences',
                'priority' => 'haute',
                'actions' => array_filter([
                    $profil->competences()->count() < 3 ? '⚡ Ajoutez au moins 3 compétences techniques' : null,
                    $profil->competences()->count() < 8 ? '➕ Ajoutez plus de compétences (idéal: 8-12)' : null,
                    '📊 Précisez votre niveau pour chaque compétence',
                    '⏱️ Indiquez vos années d\'expérience par compétence',
                ]),
            ],
            'soft_skills' => [
                'title' => 'Ajoutez vos soft skills',
                'priority' => 'moyenne',
                'actions' => array_filter([
                    $profil->softSkills()->count() < 3 ? '🌟 Ajoutez au moins 3 soft skills' : null,
                    '📈 Précisez votre niveau pour chaque soft skill',
                ]),
            ],
            'langue' => [
                'title' => 'Complétez vos langues',
                'priority' => 'basse',
                'actions' => array_filter([
                    $profil->langues()->count() < 2 ? '🌍 Ajoutez au moins 2 langues (dont votre langue maternelle)' : null,
                    '📊 Précisez votre niveau pour chaque langue',
                ]),
            ],
        ];
        
        return $suggestions_map;
    }

    private function analyzeContentQuality($profil)
    {
        $recommendations = [];
        
        // Analyser la qualité des descriptions d\'expériences
        foreach ($profil->experiences as $exp) {
            if ($exp->description) {
                $word_count = str_word_count($exp->description);
                $has_numbers = preg_match('/\d+/', $exp->description);
                $has_results = preg_match('/résultat|impact|amélioration|augmentation|réduction/i', $exp->description);
                
                if ($word_count < 30) {
                    $recommendations[] = [
                        'type' => 'content_quality',
                        'priority' => 'haute',
                        'section' => 'experience',
                        'title' => '📝 Enrichissez vos descriptions d\'expériences',
                        'message' => "Votre expérience \"{$exp->titre_poste}\" contient seulement {$word_count} mots.",
                        'tip' => 'Visez 50-100 mots avec des verbes d\'action (développé, géré, optimisé...)' ,
                        'impact' => '+8% visibilité',
                        'example' => "Au lieu de : \"Développement d'une application\"\nÉcrivez : \"Développé une application mobile React Native utilisée par 5000+ utilisateurs, réduisant le temps de traitement de 40%\""
                    ];
                }
                
                if (!$has_numbers) {
                    $recommendations[] = [
                        'type' => 'quantify_achievements',
                        'priority' => 'moyenne',
                        'section' => 'experience',
                        'title' => '📊 Quantifiez vos réalisations',
                        'message' => "Ajoutez des chiffres à \"{$exp->titre_poste}\"",
                        'tip' => 'Mentionnez : nombre d\'utilisateurs, croissance %, taille d\'équipe, budget géré...',
                        'impact' => '+12% crédibilité',
                        'examples' => [
                            '✅ "Géré une équipe de 5 développeurs"',
                            '✅ "Augmenté les performances de 35%"',
                            '✅ "Traité 10 000+ requêtes par jour"'
                        ]
                    ];
                }
                
                if (!$has_results) {
                    $recommendations[] = [
                        'type' => 'add_impact',
                        'priority' => 'haute',
                        'section' => 'experience',
                        'title' => '🎯 Mettez en avant vos résultats',
                        'message' => "Décrivez l\'impact de votre travail chez {$exp->nom_entreprise}",
                        'tip' => 'Utilisez la formule : Action + Résultat + Impact',
                        'impact' => '+15% attractivité',
                        'example' => "\"Optimisé la base de données → temps de réponse réduit de 50% → satisfaction client +25%\""
                    ];
                }
            }
        }
        
        return $recommendations;
    }

    private function analyzeKeywordsOptimization($profil)
    {
        $recommendations = [];
        
        // Analyser les mots-clés dans le titre et la bio
        $titre_words = str_word_count(strtolower($profil->titre ?? ''), 1);
        $bio_words = str_word_count(strtolower($profil->bio ?? ''), 1);
        
        // Mots-clés puissants pour développeurs
        $powerful_keywords = [
            'senior', 'lead', 'expert', 'full-stack', 'architect',
            'agile', 'scrum', 'devops', 'cloud', 'microservices'
        ];
        
        $found_keywords = array_intersect($powerful_keywords, array_merge($titre_words, $bio_words));
        
        if (count($found_keywords) < 2) {
            $recommendations[] = [
                'type' => 'seo_optimization',
                'priority' => 'moyenne',
                'section' => 'info_personnel',
                'title' => '🔍 Optimisez votre visibilité dans les recherches',
                'message' => 'Utilisez des mots-clés stratégiques dans votre titre et bio',
                'impact' => '+25% apparitions recherches',
                'keywords_to_add' => [
                    'Full-Stack Developer' => 'Si vous maîtrisez front et back',
                    'Expert React/Node.js' => 'Mettez vos techno principales',
                    'Spécialiste Cloud AWS' => 'Valorisez vos domaines d\'expertise',
                    'Agile/Scrum' => 'Si vous utilisez ces méthodologies'
                ],
                'tip' => 'Les recruteurs cherchent souvent par mots-clés précis'
            ];
        }
        
        // Vérifier la densité de mots-clés dans la bio
        if ($profil->bio && strlen($profil->bio) > 0) {
            $tech_words = ['développement', 'code', 'application', 'projet', 'équipe'];
            $tech_count = 0;
            foreach ($tech_words as $word) {
                if (stripos($profil->bio, $word) !== false) {
                    $tech_count++;
                }
            }
            
            if ($tech_count < 3) {
                $recommendations[] = [
                    'type' => 'bio_enhancement',
                    'priority' => 'moyenne',
                    'section' => 'info_personnel',
                    'title' => '✍️ Améliorez votre bio pour les recruteurs',
                    'message' => 'Votre bio manque de mots-clés techniques',
                    'structure_ideale' => [
                        '1. Qui êtes-vous ? → "Développeur Full-Stack passionné"',
                        '2. Expertise → "spécialisé en React et Node.js"',
                        '3. Expérience → "avec 3 ans d\'expérience en startup"',
                        '4. Recherche → "à la recherche d\'un poste en CDI"'
                    ],
                    'impact' => '+10% taux de lecture',
                ];
            }
        }
        
        return $recommendations;
    }

    private function detectInconsistencies($profil)
    {
        $inconsistencies = [];

        // Incohérence entre années d\'expérience et statut (junior/senior)
        $total_experience_years = 0;
        foreach ($profil->experiences as $exp) {
            $start = new \DateTime($exp->date_debut);
            $end = $exp->date_fin ? new \DateTime($exp->date_fin) : new \DateTime();
            $diff = $start->diff($end);
            $total_experience_years += $diff->y + ($diff->m / 12);
        }

        $is_junior = stripos($profil->titre, 'junior') !== false || stripos($profil->bio, 'junior') !== false;
        $is_senior = stripos($profil->titre, 'senior') !== false || stripos($profil->bio, 'senior') !== false || stripos($profil->titre, 'lead') !== false;

        if ($is_junior && $total_experience_years > 3) {
            $inconsistencies[] = [
                'type' => 'logic_inconsistency',
                'priority' => 'moyenne',
                'section' => 'info_personnel',
                'title' => '🤔 Incohérence détectée : Expérience vs Titre',
                'message' => "Vous avez plus de 3 ans d\'expérience mais votre titre indique 'Junior'.",
                'tip' => "Pensez à retirer le terme 'Junior' ou à le remplacer par 'Confirmé' ou 'Medior'.",
            ];
        }

        if ($is_senior && $total_experience_years < 5) {
            $inconsistencies[] = [
                'type' => 'logic_inconsistency',
                'priority' => 'moyenne',
                'section' => 'info_personnel',
                'title' => '🤔 Incohérence détectée : Expérience vs Titre',
                'message' => "Votre titre est 'Senior' mais vous avez moins de 5 ans d\'expérience.",
                'tip' => "Assurez-vous que vos expériences reflètent bien un niveau Senior, ou ajustez votre titre.",
            ];
        }

        return $inconsistencies;
    }
}
