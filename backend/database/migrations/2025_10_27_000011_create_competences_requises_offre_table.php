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
        Schema::create('competences_requises_offre', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('id_offre_emploi', 50);
            
            $table->string('nom_competence', 100);
            $table->boolean('est_obligatoire')->default(true);
            $table->string('niveau_requis', 50)->nullable();
            
            $table->timestamps();
            
            $table->foreign('id_offre_emploi')->references('id')->on('offres_emploi')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competences_requises_offre');
    }
};
