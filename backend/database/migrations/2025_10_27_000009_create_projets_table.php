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
        Schema::create('projets', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('id_profil_etudiant', 50);
            
            $table->string('nom_projet', 255);
            $table->text('description');
            $table->text('url_projet')->nullable();
            $table->text('url_github')->nullable();
            $table->text('image_apercu_url')->nullable();
            
            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();
            
            $table->json('technologies')->nullable();
            
            $table->integer('ordre_affichage')->default(0);
            
            $table->timestamps();
            
            $table->foreign('id_profil_etudiant')->references('id')->on('profil_etudiant')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projets');
    }
};
