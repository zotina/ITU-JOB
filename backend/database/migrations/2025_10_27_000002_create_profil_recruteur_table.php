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
        Schema::create('profil_recruteur', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('id_utilisateur', 50)->unique();
            
            $table->string('nom_entreprise', 255);
            $table->string('slug_entreprise', 255)->unique();
            $table->text('logo_url')->nullable();
            $table->text('banniere_url')->nullable();
            $table->text('description_entreprise')->nullable();
            
            $table->text('site_web')->nullable();
            $table->string('secteur_activite', 100)->nullable();
            $table->string('taille_entreprise', 50)->nullable();
            $table->integer('annee_creation')->nullable();
            
            $table->string('ville', 100)->nullable();
            $table->string('pays', 100)->nullable();
            $table->char('code_pays', 2)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            $table->string('nom_contact', 100)->nullable();
            $table->string('poste_contact', 100)->nullable();
            $table->string('email_contact', 255)->nullable();
            $table->string('telephone_contact', 50)->nullable();
            
            $table->text('linkedin_url')->nullable();
            $table->text('twitter_url')->nullable();
            $table->text('facebook_url')->nullable();
            
            $table->integer('nb_offres_actives')->default(0);
            $table->integer('nb_candidatures_recues')->default(0);
            $table->integer('nb_entretiens_planifies')->default(0);
            $table->integer('nb_embauches')->default(0);
            
            $table->timestamps();
            
            $table->foreign('id_utilisateur')->references('id')->on('utilisateur')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profil_recruteur');
    }
};
