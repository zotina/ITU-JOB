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
        Schema::create('candidatures', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('id_offre_emploi', 50);
            $table->string('id_profil_etudiant', 50);
            $table->string('statut', 50)->default('en_attente');
            
            $table->timestamps();
            
            $table->unique(['id_offre_emploi', 'id_profil_etudiant']);
            
            $table->foreign('id_offre_emploi')->references('id')->on('offres_emploi')->onDelete('cascade');
            $table->foreign('id_profil_etudiant')->references('id')->on('profil_etudiant')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidatures');
    }
};
