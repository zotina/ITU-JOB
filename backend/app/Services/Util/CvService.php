<?php

namespace App\Services\Util;

use App\Repositories\Profil\ProfilEtudiantRepository;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Smalot\PdfParser\Parser;

class CvService
{
    private string $groqApiKey;
    protected $profilEtudiantRepository;

    public function __construct(ProfilEtudiantRepository $profilEtudiantRepository)
    {
        $this->groqApiKey = env('GROQ_API_KEY');
        $this->profilEtudiantRepository = $profilEtudiantRepository;
    }

    /**
     * Import a CV from a PDF and return a structured profile.
     *
     * @param UploadedFile $cvPdf
     * @return array
     */
    public function importCvEnProfil(UploadedFile $cvPdf): array
    {
        $parser = new Parser();
        $pdf = $parser->parseFile($cvPdf->getRealPath());
        $cvText = $pdf->getText();
        Log::debug('Extracted CV Text:', ['cvText' => $cvText]);

        $prompt = $this->createGroqPrompt($cvText);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->groqApiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama-3.3-70b-versatile',
            'messages' => [
                ['role' => 'system', 'content' => 'You are an expert CV parsing assistant. Your sole task is to extract information from the provided CV text and return it ONLY as a single, valid JSON object. Do not include any introductory text, explanations, or markdown formatting. Just the JSON.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            'temperature' => 0.1,
            'max_tokens' => 4096,
        ]);

        if ($response->failed()) {
            Log::error('Groq API request failed', ['response' => $response->body()]);
            return ['error' => 'Failed to connect to Groq API', 'details' => $response->body()];
        }

        $content = $response->json('choices.0.message.content');
        Log::debug('Raw content from Groq API:', ['content' => $content]);

        $jsonContent = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::error('Failed to decode JSON from Groq API', ['error' => json_last_error_msg(), 'content' => $content]);
            return ['error' => 'Invalid JSON response from AI', 'details' => json_last_error_msg()];
        }

        return $jsonContent;
    }

    private function createGroqPrompt(string $cvText): string
    {
        return <<<PROMPT
Analyze the following CV text and extract the information into a valid JSON object. Do not add any comments or introductory text. The output must be only the JSON.

The JSON structure should be as follows:

{
  "info_personnel": {
    "titre": "string (e.g., Développeur Full-Stack)",
    "bio": "string (a short summary)",
    "date_naissance": "YYYY-MM-DD",
    "ville": "string",
    "pays": "string",
    "linkedin_url": "string (full URL)",
    "github_url": "string (full URL)",
    "portfolio_url": "string (full URL)"
  },
  "formations": [
    {
      "diplome": "string",
      "etablissement": "string",
      "domaine_etude": "string",
      "date_debut": "YYYY-MM-DD",
      "date_fin": "YYYY-MM-DD (or null if ongoing)",
      "description": "string"
    }
  ],
  "experiences": [
    {
      "titre_poste": "string",
      "nom_entreprise": "string",
      "type_contrat": "string (e.g., CDI, Stage)",
      "date_debut": "YYYY-MM-DD",
      "date_fin": "YYYY-MM-DD (or null if ongoing)",
      "description": "string (bullet points are good)"
    }
  ],
  "competences": [
    {
      "nom_competence": "string",
      "categorie": "string (e.g., Frontend, Backend, DevOps)",
      "niveau": "string (e.g., Débutant, Intermédiaire, Avancé, Expert)"
    }
  ],
  "projets": [
    {
      "nom_projet": "string",
      "description": "string",
      "url_projet": "string",
      "technologies": ["string"]
    }
  ],
  "langues": [
    {
      "nom_langue": "string",
      "niveau": "string (e.g., A1, B2, C1, Natif)"
    }
  ],
  "soft_skills": [
    {
      "nom_soft_skill": "string"
    }
  ]
}

Here is the CV text to analyze:

---
{$cvText}
---

Remember, respond with ONLY the JSON object.
PROMPT;
    }

    /**
     * Export a student profile to a PDF CV.
     *
     * @param string $idProfilEtudiant
     * @param string|null $categoriCompetence
     * @return string
     */
    public function exportProfilEnCV(string $idProfilEtudiant, ?string $categoriCompetence = null): string
    {
        $profil = $this->profilEtudiantRepository->getProfilEtudiant($idProfilEtudiant);

        if (!$profil) {
            throw new \Exception('Profil etudiant not found');
        }

        if ($categoriCompetence) {
            $profil->competences = $profil->competences->where('categorie', $categoriCompetence);
            $profil->experiences = $profil->experiences->where('categorie', $categoriCompetence);
            $profil->formations = $profil->formations->where('categorie', $categoriCompetence);
            $profil->projets = $profil->projets->where('categorie', $categoriCompetence);
        }

        $html = view('cv.template', ['profil' => $profil])->render();

        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return base64_encode($dompdf->output());
    }
}