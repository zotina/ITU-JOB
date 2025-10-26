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
        Schema::create('offres', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('id_recruteur');
            $table->foreign('id_recruteur')->references('id')->on('utilisateur')->onDelete('cascade');
            $table->string('titre');
            $table->text('description');
            $table->string('lieu');
            $table->string('type_contrat');
            $table->decimal('salaire_min', 10, 2)->nullable();
            $table->decimal('salaire_max', 10, 2)->nullable();
            $table->enum('statut', ['brouillon', 'publiee', 'archivee'])->default('brouillon');
            $table->timestamp('date_publication')->nullable();
            $table->timestamp('date_limite')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offres');
    }
};
