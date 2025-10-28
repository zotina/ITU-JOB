<?php

namespace App\Services\Filtre;

use App\Repositories\Filtre\FiltreRepository;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class FiltreService
{
    protected $filtreRepository;

    public function __construct(FiltreRepository $filtreRepository)
    {
        $this->filtreRepository = $filtreRepository;
    }

    public function filterCompanies(array $data)
    {
        $validator = Validator::make($data, [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $validatedData = $validator->validated();

        $companies = $this->filtreRepository->filterCompaniesByDistance(
            $validatedData['latitude'],
            $validatedData['longitude'],
            $validatedData['radius']
        );

        $totalOffres = $companies->sum('nombre_offres_disponibles');

        return [
            'metadata' => [
                'total_entreprises_localisees' => $companies->count(),
                'total_offres_disponibles' => $totalOffres,
            ],
            'data' => $companies,
        ];
    }
}
