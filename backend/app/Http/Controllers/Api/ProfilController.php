<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Profil\ProfilService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class ProfilController extends Controller
{
    protected $profilService;

    public function __construct(ProfilService $profilService)
    {
        $this->profilService = $profilService;
    }

    public function showRecruteur(string $id)
    {
        Log::warning('Recuteur id', ['id' => $id]);

        $profil = $this->profilService->getProfilRecruteur($id);
        if (!$profil) {
            return response()->json(['message' => 'Profil recruteur not found'], 404);
        }
        return response()->json($profil);
    }

    public function showEtudiant(string $id)
    {
        $profil = $this->profilService->getProfilEtudiant($id);
        if (!$profil) {
            return response()->json(['message' => 'Profil etudiant not found'], 404);
        }
        return response()->json($profil);
    }

    public function updateEtudiantPosition(Request $request, string $id)
    {
        try {
            $profil = $this->profilService->updateEtudiantPosition($id, $request->all());
            if (!$profil) {
                return response()->json(['message' => 'Profil etudiant not found'], 404);
            }
            return response()->json($profil);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    public function updateRecruteurPosition(Request $request, string $id)
    {
        try {
            $profil = $this->profilService->updateRecruteurPosition($id, $request->all());
            if (!$profil) {
                return response()->json(['message' => 'Profil recruteur not found'], 404);
            }
            return response()->json($profil);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }
}
