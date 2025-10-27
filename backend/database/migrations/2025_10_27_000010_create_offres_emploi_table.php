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
        Schema::create('offres_emploi', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('id_profil_recruteur', 50);
            
            $table->string('titre', 255);
            $table->string('slug', 255)->unique();
            $table->text('description');
            
            $table->string('type_contrat', 50);
            $table->string('mode_travail', 50)->default('presentiel');
            $table->string('niveau_experience', 50)->nullable();
            
            $table->string('ville', 100)->nullable();
            $table->string('pays', 100)->nullable();
            $table->char('code_pays', 2)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            $table->decimal('salaire_min', 10, 2)->nullable();
            $table->decimal('salaire_max', 10, 2)->nullable();
            $table->char('devise_salaire', 3)->default('EUR');
            $table->string('periode_salaire', 20)->default('annuel');
            
            $table->string('statut', 50)->default('brouillon');
            $table->timestamp('date_publication')->nullable();
            $table->timestamp('date_expiration')->nullable();
            
            $table->integer('nb_vues')->default(0);
            $table->integer('nb_candidatures')->default(0);
            
            $table->timestamps();
            
            $table->foreign('id_profil_recruteur')->references('id')->on('profil_recruteur')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offres_emploi');
    }
};
