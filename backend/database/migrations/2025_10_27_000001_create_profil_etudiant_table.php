<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profil_etudiant', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('id_utilisateur', 50)->unique();
            
            $table->text('photo_profil_url')->nullable();
            $table->string('titre', 255)->nullable();
            $table->text('bio')->nullable();
            $table->date('date_naissance')->nullable();
            
            $table->string('ville', 100)->nullable();
            $table->string('pays', 100)->nullable();
            $table->char('code_pays', 2)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            $table->text('linkedin_url')->nullable();
            $table->text('github_url')->nullable();
            $table->text('portfolio_url')->nullable();
            
            $table->string('disponibilite', 50)->nullable();
            $table->string('type_recherche', 50)->nullable();
            $table->decimal('taux_journalier', 10, 2)->nullable();
            
            $table->string('mobilite', 50)->nullable();
            $table->string('teletravail_preference', 50)->nullable();
            $table->decimal('salaire_minimum_souhaite', 10, 2)->nullable();
            $table->char('devise_salaire', 3)->default('EUR');
            
            $table->integer('profil_complete_pourcentage')->default(0);
            $table->integer('nb_vues_profil')->default(0);
            
            $table->timestamps();
            
            $table->foreign('id_utilisateur')->references('id')->on('utilisateur')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profil_etudiant');
    }
};
