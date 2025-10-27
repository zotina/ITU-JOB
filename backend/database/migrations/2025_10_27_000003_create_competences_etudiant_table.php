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
        Schema::create('competences_etudiant', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('id_profil_etudiant', 50);
            
            $table->string('nom_competence', 100);
            $table->string('categorie', 50)->nullable();
            $table->string('niveau', 50)->nullable();
            $table->decimal('annees_experience', 3, 1)->nullable();
            
            $table->timestamps();
            
            $table->foreign('id_profil_etudiant')->references('id')->on('profil_etudiant')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competences_etudiant');
    }
};
