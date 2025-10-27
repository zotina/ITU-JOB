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
        Schema::create('formation', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('id_profil_etudiant', 50);
            
            $table->string('diplome', 255);
            $table->string('etablissement', 255);
            $table->string('domaine_etude', 100)->nullable();
            
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->boolean('en_cours')->default(false);
            
            $table->text('description')->nullable();
            $table->string('ville', 100)->nullable();
            $table->string('pays', 100)->nullable();
            
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
        Schema::dropIfExists('formation');
    }
};
