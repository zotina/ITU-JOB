<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Offre;
use App\Models\Utilisateur\Utilisateur;

class OffreSeeder extends Seeder
{
    
    public function run(): void
    {
        Offre::create([
            'id_recruteur' => 'USR-000002',
            'titre' => 'Développeur Full-Stack Senior',
            'description' => 'Nous recherchons un développeur Full-Stack expérimenté pour rejoindre notre équipe dynamique. Vous travaillerez sur des projets innovants et stimulants.',
            'lieu' => 'Antananarivo, Madagascar',
            'type_contrat' => 'CDI',
            'salaire_min' => 3000000,
            'salaire_max' => 4500000,
            'statut' => 'publiee',
            'date_publication' => now(),
            'date_limite' => now()->addMonth(),
        ]);

        Offre::create([
            'id_recruteur' => 'USR-000002',
            'titre' => 'Stagiaire en Marketing Digital',
            'description' => 'Une opportunité passionnante pour un étudiant en marketing de mettre en pratique ses compétences. Vous assisterez l\'équipe marketing dans diverses tâches.',
            'lieu' => 'Télétravail',
            'type_contrat' => 'Stage',
            'salaire_min' => 500000,
            'salaire_max' => 800000,
            'statut' => 'publiee',
            'date_publication' => now()->subDays(5),
            'date_limite' => now()->addWeeks(2),
        ]);

        Offre::create([
            'id_recruteur' => 'USR-000002',
            'titre' => 'Chef de Projet Technique',
            'description' => 'Nous cherchons un chef de projet pour superviser nos projets de développement logiciel. Expérience en gestion d\'équipe requise.',
            'lieu' => 'Fianarantsoa, Madagascar',
            'type_contrat' => 'CDD',
            'salaire_min' => 2500000,
            'salaire_max' => 3500000,
            'statut' => 'brouillon', 
            'date_publication' => null,
            'date_limite' => null,
        ]);
    }
}