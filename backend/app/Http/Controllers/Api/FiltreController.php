<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Filtre\FiltreService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class FiltreController extends Controller
{
    protected $filtreService;

    public function __construct(FiltreService $filtreService)
    {
        $this->filtreService = $filtreService;
    }

    public function filterCompanies(Request $request)
    {
        try {
            $companies = $this->filtreService->filterCompanies($request->all());
            return response()->json($companies);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }
}
