<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProfilEtudiantSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('profil_etudiant')->insert([
            [
                'id' => 'ETU-00001',
                'id_utilisateur' => 'USR-000001',
                'titre' => 'Développeur Full Stack Junior',
                'bio' => 'Passionné par le développement web et les nouvelles technologies. A la recherche d\'opportunités stimulantes.',
                'date_naissance' => '2002-05-15',
                'ville' => 'Antananarivo',
                'pays' => 'Madagascar',
                'disponibilite' => 'immédiate',
                'type_recherche' => 'stage',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
