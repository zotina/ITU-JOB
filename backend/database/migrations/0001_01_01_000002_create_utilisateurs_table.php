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
        Schema::create('utilisateur', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('mot_de_passe_hash', 255);
            $table->string('email', 100)->unique();
            $table->string('prenom', 50)->nullable();
            $table->string('nom', 50)->nullable();
            $table->string('telephone', 20)->nullable();
            $table->text('adresse')->nullable();
            $table->integer('est_actif')->default(1);
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamp('date_derniere_connexion')->nullable();
            $table->string('id_role', 50);

            // Index pour les performances
            $table->index('email');
            $table->index('telephone');
            $table->index('est_actif');
            $table->index('id_role');
            
            // Clé étrangère vers role
            $table->foreign('id_role')
                  ->references('id')
                  ->on('role')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilisateur');
    }
};