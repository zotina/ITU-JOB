<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProfilRecruteurSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('profil_recruteur')->insert([
            [
                'id' => 'REC-00001',
                'id_utilisateur' => 'USR-000002',
                'nom_entreprise' => 'TechStart Solutions',
                'slug_entreprise' => 'techstart-solutions',
                'description_entreprise' => 'Leader dans les solutions innovantes pour le web.',
                'secteur_activite' => 'technologie',
                'ville' => 'Antananarivo',
                'pays' => 'Madagascar',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
