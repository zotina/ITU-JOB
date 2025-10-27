<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            RoleSeeder::class,
            UtilisateurSeeder::class,
            ProfilEtudiantSeeder::class,
            ProfilRecruteurSeeder::class,
            OffreEmploiSeeder::class,
        ]);
    }
}