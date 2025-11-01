<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Util\CvService;
use Illuminate\Http\Request;

class CvController extends Controller
{
    protected $cvService;

    public function __construct(CvService $cvService)
    {
        $this->cvService = $cvService;
    }

    public function import(Request $request)
    {
        $request->validate([
            'cv' => 'required|file|mimes:pdf|max:2048',
        ]);

        $profilData = $this->cvService->importCvEnProfil($request->file('cv'));

        return response()->json($profilData);
    }

    public function export(Request $request)
    {
        $request->validate([
            'profil_etudiant_id' => 'required|string|exists:profil_etudiant,id',
            'categorie' => 'nullable|string',
        ]);

        $base64Pdf = $this->cvService->exportProfilEnCV(
            $request->profil_etudiant_id,
            $request->categorie
        );

        return response()->json(['cv_base64' => $base64Pdf]);
    }
}
