<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OffreEmploiSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('offres_emploi')->insert([
            [
                'id' => 'OFF-00001',
                'id_profil_recruteur' => 'REC-00001',
                'titre' => 'Développeur Frontend React',
                'slug' => 'developpeur-frontend-react',
                'description' => 'Rejoignez notre équipe dynamique pour développer des applications React modernes. Nous recherchons un développeur passionné avec de bonnes connaissances en TypeScript.',
                'type_contrat' => 'CDI',
                'mode_travail' => 'hybride',
                'niveau_experience' => 'junior',
                'ville' => 'Paris',
                'pays' => 'France',
                'salaire_min' => 35000,
                'salaire_max' => 45000,
                'statut' => 'publiee',
                'date_publication' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
