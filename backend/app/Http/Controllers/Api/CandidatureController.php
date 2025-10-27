<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Candidature\CandidatureService;
use App\Repositories\Utilisateur\UserRepository;
use Illuminate\Http\Request;

class CandidatureController extends Controller
{
    protected $candidatureService;
    protected $userRepository;

    public function __construct(CandidatureService $candidatureService,UserRepository $userRepository)
    {
        $this->candidatureService = $candidatureService;
        $this->userRepository =$userRepository ;
    }

    public function getEtudiantCandidatures(Request $request)
    {
        $user = $this->userRepository->find($request->input('userId'));
        $profilEtudiant = $user->profilEtudiant;

        if (!$profilEtudiant) {
            return response()->json(['message' => 'Profil etudiant not found for this user'], 404);
        }

        $candidatures = $this->candidatureService->getEtudiantCandidatures($profilEtudiant->id);

        return response()->json($candidatures);
    }
}
