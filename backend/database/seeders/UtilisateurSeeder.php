<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UtilisateurSeeder extends Seeder
{
    public function run(): void
    {
        $utilisateurs = [
            [
                'id' => 'USR-000001',
                'email' => 'user@gmail.com',
                'mot_de_passe_hash' => bcrypt('admin123'),
                'prenom' => 'Zo Tina',
                'nom' => 'R.',
                'telephone' => '+261382010328',
                'adresse' => 'Antananarivo, Madagascar',
                'est_actif' => 1,
                'date_creation' => now(),
                'date_derniere_connexion' => null,
                'id_role' => 'ROLE-000001',
            ],
            [
                'id' => 'USR-000002',
                'email' => 'admin@gmail.com',
                'mot_de_passe_hash' => bcrypt('admin123'),
                'prenom' => 'Ny Haritina',
                'nom' => 'R.',
                'telephone' => '+261387036058',
                'adresse' => 'Fianarantsoa, Madagascar',
                'est_actif' => 1,
                'date_creation' => now(),
                'date_derniere_connexion' => null,
                'id_role' => 'ROLE-000002',
            ],
        ];

        DB::table('utilisateur')->insert($utilisateurs);
    }
}
