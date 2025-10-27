<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Utilisateur\UserRepository;
use App\Services\Candidature\CandidatureService;
use App\Services\Offre\OffreEmploiService;
use App\Services\Offre\OffreSauvegardeeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OffreController extends Controller
{
    protected $offreEmploiService;
    protected $candidatureService;
    protected $offreSauvegardeeService;
    protected $userRepository;

    public function __construct(
        OffreEmploiService $offreEmploiService, 
        CandidatureService $candidatureService, 
        OffreSauvegardeeService $offreSauvegardeeService,
        UserRepository $userRepository
    ) {
        $this->offreEmploiService = $offreEmploiService;
        $this->candidatureService = $candidatureService;
        $this->offreSauvegardeeService = $offreSauvegardeeService;
        $this->userRepository =$userRepository ;
    }

    public function index()
    {
        $offres = $this->offreEmploiService->listerOffres();
        return response()->json($offres);
    }

    public function show(string $id)
    {
        $offre = $this->offreEmploiService->voirOffre($id);
        if (!$offre) {
            return response()->json(['message' => 'Offre not found'], 404);
        }
        return response()->json($offre);
    }

    public function postuler(Request $request, string $id)
    {
        $user = $this->userRepository->find($request->input('userId'));
        $profilEtudiant = $user->profilEtudiant;

        if (!$profilEtudiant) {
            return response()->json(['message' => 'Profil etudiant not found for this user'], 404);
        }

        try {
            $candidature = $this->candidatureService->postuler($id, $profilEtudiant->id);
            return response()->json($candidature, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error during application', 'error' => $e->getMessage()], 500);
        }
    }

    public function sauvegarder(Request $request, string $id)
    {
        $user = $this->userRepository->find($request->input('userId'));
        $profilEtudiant = $user->profilEtudiant;

        if (!$profilEtudiant) {
            return response()->json(['message' => 'Profil etudiant not found for this user'], 404);
        }

        $notes = $request->input('notes');

        try {
            $offreSauvegardee = $this->offreSauvegardeeService->sauvegarderOffre($profilEtudiant->id, $id, $notes);
            return response()->json($offreSauvegardee, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error while saving offer', 'error' => $e->getMessage()], 500);
        }
    }

    public function retirerSauvegarde(Request $request,string $id)
    {
        $user = $this->userRepository->find($request->input('userId'));
        $profilEtudiant = $user->profilEtudiant;

        if (!$profilEtudiant) {
            return response()->json(['message' => 'Profil etudiant not found for this user'], 404);
        }

        try {
            $this->offreSauvegardeeService->retirerOffreSauvegardee($profilEtudiant->id, $id);
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error while unsaving offer', 'error' => $e->getMessage()], 500);
        }
    }

    public function listerSauvegardes(Request $request)
    {
        $user = $this->userRepository->find($request->input('userId'));
        $profilEtudiant = $user->profilEtudiant;

        if (!$profilEtudiant) {
            return response()->json(['message' => 'Profil etudiant not found for this user'], 404);
        }

        $offres = $this->offreSauvegardeeService->listerOffresSauvegardees($profilEtudiant->id);
        return response()->json($offres);
    }
}
