<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Profil\ProfilService;
use Illuminate\Http\Request;

class RecommandationController extends Controller
{
    protected $profilService;

    public function __construct(ProfilService $profilService)
    {
        $this->profilService = $profilService;
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
}
