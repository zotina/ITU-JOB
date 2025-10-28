<?php

namespace App\Services\Util;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class ChatbotService
{
    private string $groqApiKey;
    private string $model = 'llama-3.3-70b-versatile';

    public function __construct()
    {
        $this->groqApiKey = env('GROQ_API_KEY');
    }

    /**
     * Traite un message simple sans historique
     */
    public function chat(string $message, string $userId): array
    {
        try {
            // 1. Obtenir le contexte utilisateur
            $userContext = $this->getUserContext($userId);
            Log::info("User context", [
                'nom' => $userContext['nom'],
                'role' => $userContext['role']
            ]);

            // 2. Détecter l'intention et extraire les paramètres
            $intent = $this->detectIntentAndExtract($message, $userContext);
            Log::info("Intent detected", [
                'needs_action' => $intent['needs_action'],
                'intent' => $intent['intent'] ?? 'unknown'
            ]);

            // 3. Exécuter l'action si nécessaire
            if ($intent['needs_action'] ?? false) {
                $actionResult = $this->executeAction($intent['action'], $intent['params'] ?? [], $userId);
                return $this->formatResponse($actionResult, $intent);
            }

            // 4. Réponse conversationnelle simple
            return $this->getConversationalResponse($message, $userContext);

        } catch (\Exception $e) {
            Log::error("Chatbot error", ['exception' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return [
                'success' => false,
                'message' => "Désolé, je rencontre un problème technique. Pouvez-vous reformuler ?",
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Détecte l'intention avec Groq
     */
    private function detectIntentAndExtract(string $message, array $userContext): array
    {
        $systemPrompt = $this->buildIntentDetectionPrompt($userContext['role']);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->groqApiKey,
            'Content-Type' => 'application/json',
        ])
        ->timeout(30)
        ->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => $this->model,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $message]
            ],
            'temperature' => 0.3,
            'max_tokens' => 500
        ]);

        if (!$response->successful()) {
            $error = $response->json('error.message') ?? 'Unknown error';
            Log::error("Groq API error", ['status' => $response->status(), 'body' => $response->body()]);
            throw new \Exception("Groq API Error: $error");
        }

        $result = $response->json();
        $content = $result['choices'][0]['message']['content'] ?? '{}';

        $decoded = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::warning("Invalid JSON from Groq", ['content' => $content]);
            return ['needs_action' => false, 'intent' => 'conversation'];
        }

        return $decoded;
    }

    /**
     * Prompt pour la détection d'intention
     */
    private function buildIntentDetectionPrompt(string $role): string
    {
        $actions = $this->getAvailableActions($role);

        return "Tu es un assistant qui analyse les demandes utilisateur et détermine l'action à effectuer.

Rôle de l'utilisateur: {$role}

Actions disponibles:
" . implode("\n", array_map(fn($a) => "- {$a['name']}: {$a['description']}", $actions)) . "

Réponds UNIQUEMENT en JSON avec cette structure:
{
    \"needs_action\": true/false,
    \"intent\": \"nom_de_l_action ou conversation\",
    \"action\": \"nom_fonction\" (si needs_action=true),
    \"params\": {paramètres extraits} (si needs_action=true),
    \"confidence\": 0-1
}

Exemples:
- \"Je cherche un stage React à Paris\" → {\"needs_action\": true, \"intent\": \"recherche\", \"action\": \"rechercher_offres\", \"params\": {\"mots_cles\": \"React\", \"ville\": \"Paris\", \"type_contrat\": \"stage\"}}
- \"Comment vas-tu?\" → {\"needs_action\": false, \"intent\": \"conversation\"}
- \"Postule à l'offre job_123\" → {\"needs_action\": true, \"intent\": \"postuler\", \"action\": \"postuler_offre\", \"params\": {\"id_offre\": \"job_123\"}}

Analyse maintenant la demande de l'utilisateur et réponds en JSON pur sans markdown.";
    }

    /**
     * Actions disponibles selon le rôle
     */
    private function getAvailableActions(string $role): array
    {
        $common = [
            ['name' => 'rechercher_offres', 'description' => 'Recherche des offres d\'emploi'],
            ['name' => 'details_offre', 'description' => 'Obtient les détails d\'une offre']
        ];

        if ($role === 'etudiant') {
            return array_merge($common, [
                ['name' => 'analyser_profil', 'description' => 'Analyse le profil étudiant'],
                ['name' => 'postuler_offre', 'description' => 'Postule à une offre'],
                ['name' => 'mes_candidatures', 'description' => 'Liste les candidatures'],
                ['name' => 'sauvegarder_offre', 'description' => 'Sauvegarde une offre']
            ]);
        }

        if ($role === 'recruteur') {
            return array_merge($common, [
                ['name' => 'creer_offre', 'description' => 'Crée une nouvelle offre'],
                ['name' => 'mes_offres', 'description' => 'Liste les offres'],
                ['name' => 'candidatures_offre', 'description' => 'Liste les candidatures'],
                ['name' => 'stats_recrutement', 'description' => 'Statistiques de recrutement']
            ]);
        }

        return $common;
    }

    /**
     * Exécute une action
     */
    private function executeAction(string $action, array $params, string $userId): array
    {
        return match($action) {
            'rechercher_offres' => $this->rechercherOffres($params),
            'details_offre' => $this->detailsOffre($params),
            'analyser_profil' => $this->analyserProfil($userId),
            'postuler_offre' => $this->postulerOffre($params, $userId),
            'mes_candidatures' => $this->mesCandidatures($userId),
            'sauvegarder_offre' => $this->sauvegarderOffre($params, $userId),
            'creer_offre' => $this->creerOffre($params, $userId),
            'mes_offres' => $this->mesOffres($userId),
            'candidatures_offre' => $this->candidaturesOffre($params, $userId),
            'stats_recrutement' => $this->statsRecrutement($userId),
            default => ['success' => false, 'message' => 'Action inconnue']
        };
    }

    /**
     * Réponse conversationnelle simple
     */
    private function getConversationalResponse(string $message, array $userContext): array
    {
        $systemPrompt = "Tu es un assistant amical pour une plateforme de recrutement ITU Jobs.
L'utilisateur est {$userContext['prenom']} ({$userContext['role']}).
Réponds de manière concise, utile et professionnelle. Propose des actions concrètes.";

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->groqApiKey,
            'Content-Type' => 'application/json',
        ])
        ->timeout(30)
        ->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => $this->model,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $message]
            ],
            'temperature' => 0.7,
            'max_tokens' => 300
        ]);

        $content = $response->successful()
            ? ($response->json()['choices'][0]['message']['content'] ?? 'Je suis là pour vous aider !')
            : 'Je suis là pour vous aider ! Que puis-je faire pour vous ?';

        return [
            'success' => true,
            'message' => $content,
            'type' => 'conversational'
        ];
    }

    /**
     * Formate la réponse après une action
     */
    private function formatResponse(array $actionResult, array $intent): array
    {
        if (!$actionResult['success']) {
            return $actionResult;
        }

        $naturalResponse = $this->generateNaturalResponse($actionResult, $intent);

        return [
            'success' => true,
            'message' => $naturalResponse,
            'data' => $actionResult['data'] ?? $actionResult,
            'action' => $intent['action']
        ];
    }

    /**
     * Génère une réponse naturelle à partir des données
     */
    private function generateNaturalResponse(array $data, array $intent): string
    {
        return match($intent['action']) {
            'rechercher_offres' => $this->formatOffresResponse($data),
            'analyser_profil' => $this->formatProfilResponse($data),
            'mes_candidatures' => $this->formatCandidaturesResponse($data),
            default => $data['message'] ?? 'Action effectuée avec succès !'
        };
    }

    private function formatOffresResponse(array $data): string
    {
        $count = $data['count'] ?? 0;
        if ($count === 0) {
            return "Je n'ai trouvé aucune offre correspondant à vos critères. Voulez-vous élargir votre recherche ?";
        }

        $response = "J'ai trouvé {$count} offre(s) pour vous :\n\n";
        foreach (array_slice($data['offres'] ?? [], 0, 5) as $offre) {
            $response .= "**{$offre['titre']}** chez {$offre['entreprise']}\n";
            $response .= "   {$offre['localisation']} | {$offre['type_contrat']} | {$offre['mode_travail']}\n";
            $response .= "   {$offre['salaire']}\n\n";
        }
        $response .= "\nDites-moi \"Détails de [titre]\" pour en savoir plus !";
        return $response;
    }

    private function formatProfilResponse(array $data): string
    {
        $taux = $data['taux_completion'] ?? 0;
        $response = "Analyse de votre profil :\n\n";
        $response .= "Complété à {$taux}%\n\n";
        if (!empty($data['suggestions'])) {
            $response .= "Suggestions d'amélioration :\n";
            foreach (array_slice($data['suggestions'], 0, 3) as $suggestion) {
                $response .= "  • {$suggestion}\n";
            }
        }
        return $response;
    }

    private function formatCandidaturesResponse(array $data): string
    {
        $total = $data['total'] ?? 0;
        if ($total === 0) {
            return "Vous n'avez pas encore de candidatures. Voulez-vous rechercher des offres ?";
        }

        $response = "Vos candidatures ({$total}) :\n\n";
        $stats = $data['par_statut'] ?? [];
        $response .= "En attente: {$stats['en_attente']}\n";
        $response .= "Examinées: {$stats['examinee']}\n";
        $response .= "Présélectionnées: {$stats['preselectionne']}\n";
        $response .= "Acceptées: {$stats['accepte']}\n";
        return $response;
    }

    // ============================================
    // ACTIONS ÉTUDIANT
    // ============================================

    private function rechercherOffres(array $params): array
    {
        $query = DB::table('offres_emploi as oe')
            ->join('profil_recruteur as pr', 'oe.id_profil_recruteur', '=', 'pr.id')
            ->where('oe.statut', 'publiee')
            ->select('oe.*', 'pr.nom_entreprise', 'pr.logo_url as entreprise_logo');

        if (!empty($params['mots_cles'])) {
            $query->where(function($q) use ($params) {
                $q->where('oe.titre', 'ILIKE', "%{$params['mots_cles']}%")
                  ->orWhere('oe.description', 'ILIKE', "%{$params['mots_cles']}%");
            });
        }

        if (!empty($params['ville'])) {
            $query->where('oe.ville', 'ILIKE', "%{$params['ville']}%");
        }

        if (!empty($params['type_contrat'])) {
            $query->where('oe.type_contrat', $params['type_contrat']);
        }

        $offres = $query->orderBy('oe.date_publication', 'desc')->limit(10)->get();

        return [
            'success' => true,
            'count' => count($offres),
            'offres' => $offres->map(fn($o) => [
                'id' => $o->id,
                'titre' => $o->titre,
                'entreprise' => $o->nom_entreprise,
                'entreprise_logo' => $o->entreprise_logo,
                'localisation' => "{$o->ville}, {$o->pays}",
                'type_contrat' => $o->type_contrat,
                'mode_travail' => $o->mode_travail,
                'salaire' => $o->salaire_min ? 
                    number_format($o->salaire_min) . ' - ' . number_format($o->salaire_max) . ' ' . $o->devise_salaire :
                    'Non communiqué'
            ])->toArray()
        ];
    }

    private function detailsOffre(array $params): array
    {
        $offre = DB::table('offres_emploi as oe')
            ->join('profil_recruteur as pr', 'oe.id_profil_recruteur', '=', 'pr.id')
            ->where('oe.id', $params['id_offre'])
            ->select('oe.*', 'pr.*')
            ->first();

        if (!$offre) {
            return ['success' => false, 'message' => 'Offre non trouvée'];
        }

        return [
            'success' => true,
            'offre' => [
                'id' => $offre->id,
                'titre' => $offre->titre,
                'description' => $offre->description,
                'entreprise' => $offre->nom_entreprise,
                'localisation' => "{$offre->ville}, {$offre->pays}",
                'type_contrat' => $offre->type_contrat,
                'mode_travail' => $offre->mode_travail
            ],
            'message' => "Voici les détails de l'offre '{$offre->titre}'"
        ];
    }

    private function analyserProfil(string $userId): array
    {
        $profil = DB::table('profil_etudiant as pe')
            ->where('id_utilisateur', $userId)
            ->first();

        if (!$profil) {
            return ['success' => false, 'message' => 'Profil non trouvé'];
        }

        $champs = ['photo_profil_url', 'titre', 'bio', 'ville', 'linkedin_url'];
        $remplis = count(array_filter($champs, fn($c) => !empty($profil->$c)));
        $taux = round(($remplis / count($champs)) * 100);

        $suggestions = [];
        if (empty($profil->photo_profil_url)) $suggestions[] = "Ajoutez une photo de profil";
        if (empty($profil->titre)) $suggestions[] = "Définissez votre titre professionnel";
        if (empty($profil->bio)) $suggestions[] = "Rédigez une bio";

        return [
            'success' => true,
            'taux_completion' => $taux,
            'suggestions' => $suggestions
        ];
    }

    private function postulerOffre(array $params, string $userId): array
    {
        $profil = DB::table('profil_etudiant')->where('id_utilisateur', $userId)->first();
        if (!$profil) {
            return ['success' => false, 'message' => 'Profil non trouvé'];
        }

        $existe = DB::table('candidatures')
            ->where('id_offre_emploi', $params['id_offre'])
            ->where('id_profil_etudiant', $profil->id)
            ->exists();

        if ($existe) {
            return ['success' => false, 'message' => 'Vous avez déjà postulé'];
        }

        DB::table('candidatures')->insert([
            'id' => Str::random(20),
            'id_offre_emploi' => $params['id_offre'],
            'id_profil_etudiant' => $profil->id,
            'cv_url' => 'cv.pdf',
            'statut' => 'en_attente',
            'date_candidature' => now()
        ]);

        return ['success' => true, 'message' => 'Candidature envoyée avec succès !'];
    }

    private function mesCandidatures(string $userId): array
    {
        $profil = DB::table('profil_etudiant')->where('id_utilisateur', $userId)->first();
        if (!$profil) {
            return ['success' => false, 'message' => 'Profil non trouvé'];
        }

        $candidatures = DB::table('candidatures as c')
            ->join('offres_emploi as oe', 'c.id_offre_emploi', '=', 'oe.id')
            ->where('c.id_profil_etudiant', $profil->id)
            ->select('c.*', 'oe.titre', 'oe.ville')
            ->get();

        $grouped = $candidatures->groupBy('statut');

        return [
            'success' => true,
            'total' => count($candidatures),
            'par_statut' => [
                'en_attente' => $grouped->get('en_attente', collect())->count(),
                'examinee' => $grouped->get('examinee', collect())->count(),
                'preselectionne' => $grouped->get('preselectionne', collect())->count(),
                'accepte' => $grouped->get('accepte', collect())->count()
            ]
        ];
    }

    private function sauvegarderOffre(array $params, string $userId): array
    {
        $profil = DB::table('profil_etudiant')->where('id_utilisateur', $userId)->first();
        
        DB::table('offres_sauvegardees')->insertOrIgnore([
            'id_profil_etudiant' => $profil->id,
            'id_offre_emploi' => $params['id_offre'],
            'date_sauvegarde' => now()
        ]);

        return ['success' => true, 'message' => 'Offre sauvegardée !'];
    }

    // ============================================
    // ACTIONS RECRUTEUR
    // ============================================

    private function creerOffre(array $params, string $userId): array
    {
        $profil = DB::table('profil_recruteur')->where('id_utilisateur', $userId)->first();
        
        $id = Str::random(20);
        DB::table('offres_emploi')->insert([
            'id' => $id,
            'id_profil_recruteur' => $profil->id,
            'titre' => $params['titre'],
            'slug' => Str::slug($params['titre']),
            'description' => $params['description'],
            'type_contrat' => $params['type_contrat'],
            'statut' => 'brouillon',
            'created_at' => now()
        ]);

        return ['success' => true, 'message' => 'Offre créée !', 'offre_id' => $id];
    }

    private function mesOffres(string $userId): array
    {
        $profil = DB::table('profil_recruteur')->where('id_utilisateur', $userId)->first();
        
        $offres = DB::table('offres_emploi')
            ->where('id_profil_recruteur', $profil->id)
            ->get();

        return [
            'success' => true,
            'total' => count($offres),
            'offres' => $offres
        ];
    }

    private function candidaturesOffre(array $params, string $userId): array
    {
        $candidatures = DB::table('candidatures as c')
            ->join('profil_etudiant as pe', 'c.id_profil_etudiant', '=', 'pe.id')
            ->where('c.id_offre_emploi', $params['id_offre'])
            ->select('c.*', 'pe.titre')
            ->get();

        return [
            'success' => true,
            'total' => count($candidatures),
            'candidatures' => $candidatures
        ];
    }

    private function statsRecrutement(string $userId): array
    {
        $profil = DB::table('profil_recruteur')->where('id_utilisateur', $userId)->first();
        
        return [
            'success' => true,
            'stats' => [
                'nb_offres_actives' => $profil->nb_offres_actives ?? 0,
                'nb_candidatures_recues' => $profil->nb_candidatures_recues ?? 0
            ]
        ];
    }

    /**
     * Récupère le contexte utilisateur
     */
    private function getUserContext(string $userId): array
    {
        $user = DB::table('utilisateur')
            ->join('role', 'utilisateur.id_role', '=', 'role.id')
            ->where('utilisateur.id', $userId)
            ->select('utilisateur.*', 'role.val as role_val')
            ->first();

        if (!$user) {
            throw new \Exception('User not found');
        }

        return [
            'id' => $user->id,
            'email' => $user->email,
            'prenom' => $user->prenom ?? 'Utilisateur',
            'nom' => $user->nom,
            'role' => $user->role_val
        ];
    }
}