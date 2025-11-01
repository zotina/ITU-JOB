<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Profil\ProfilService;
use App\Services\Recommandation\RecommandationService;
use Illuminate\Http\Request;

class RecommandationController extends Controller
{
    protected $profilService;
    protected $recommandationService;

    public function __construct(ProfilService $profilService, RecommandationService $recommandationService)
    {
        $this->profilService = $profilService;
        $this->recommandationService = $recommandationService;
    }

    public function getRecommandations(Request $request, string $id)
    {
        try {
            $recommandations = $this->profilService->getRecommandations($id);
            return response()->json($recommandations);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la récupération des recommandations: ' . $e->getMessage()], 500);
        }
    }

    public function getOffreRecommandations(Request $request)
    {
        $request->validate([
            'profil_etudiant_id' => 'required|string|exists:profil_etudiant,id',
        ]);

        try {
            $recommandations = $this->recommandationService->recommanderOffres($request->profil_etudiant_id);
            return response()->json($recommandations);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la récupération des recommandations d\'offres: ' . $e->getMessage()], 500);
        }
    }
}
