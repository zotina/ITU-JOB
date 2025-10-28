<?php

namespace App\Repositories\Filtre;

use Illuminate\Support\Facades\DB;

class FiltreRepository
{
    public function filterCompaniesByDistance(float $latitude, float $longitude, int $radius)
    {
        
        $haversine = "(6371 * acos(
            cos(radians($latitude)) * cos(radians(profil_recruteur.latitude))
            * cos(radians(profil_recruteur.longitude) - radians($longitude))
            + sin(radians($latitude)) * sin(radians(profil_recruteur.latitude))
        ))";

        return DB::table('profil_recruteur')
            ->select([
                'profil_recruteur.id',
                'profil_recruteur.nom_entreprise',
                'profil_recruteur.ville',
                'profil_recruteur.pays',
                'profil_recruteur.latitude',
                'profil_recruteur.longitude',
                DB::raw("$haversine AS distance"),
                DB::raw('COUNT(offres_emploi.id) AS nombre_offres_disponibles'),
            ])
            ->leftJoin('offres_emploi', 'profil_recruteur.id', '=', 'offres_emploi.id_profil_recruteur')
            ->whereNotNull('profil_recruteur.latitude')
            ->whereNotNull('profil_recruteur.longitude')
            ->groupBy(
                'profil_recruteur.id',
                'profil_recruteur.nom_entreprise',
                'profil_recruteur.ville',
                'profil_recruteur.pays',
                'profil_recruteur.latitude',
                'profil_recruteur.longitude'
            )
            ->havingRaw("$haversine <= $radius")
            ->orderByRaw("$haversine ASC")
            ->get();
    }
}