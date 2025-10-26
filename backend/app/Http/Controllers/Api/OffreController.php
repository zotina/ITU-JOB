<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\OffreService;
use Illuminate\Http\Request;

class OffreController extends Controller
{
    protected $offreService;

    public function __construct(OffreService $offreService)
    {
        $this->offreService = $offreService;
    }

    public function index()
    {
        $offres = $this->offreService->listPublishedOffers();
        return response()->json($offres);
    }
}
