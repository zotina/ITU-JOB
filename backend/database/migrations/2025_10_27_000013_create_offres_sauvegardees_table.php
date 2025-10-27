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
        Schema::create('offres_sauvegardees', function (Blueprint $table) {
            $table->string('id_profil_etudiant', 50);
            $table->string('id_offre_emploi', 50);
            
            $table->timestamp('date_sauvegarde')->useCurrent();
            $table->text('notes')->nullable();
            
            $table->primary(['id_profil_etudiant', 'id_offre_emploi']);
            
            $table->foreign('id_profil_etudiant')->references('id')->on('profil_etudiant')->onDelete('cascade');
            $table->foreign('id_offre_emploi')->references('id')->on('offres_emploi')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offres_sauvegardees');
    }
};
