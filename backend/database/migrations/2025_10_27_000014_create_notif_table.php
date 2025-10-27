<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('notification', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('id_receveur', 50);
            $table->string('id_emetteur', 50)->nullable();
            $table->string('url_redirect', 255)->nullable();
            $table->text('message');
            $table->string('statut', 20)->default('en_attente'); 
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamp('date_envoi')->nullable();
            $table->timestamp('date_lecture')->nullable();
            $table->text('erreur')->nullable();
            $table->integer('tentatives')->default(0);
            $table->index('id_receveur');
            $table->index('id_emetteur');
            $table->index('statut');
            $table->index('date_creation');
            $table->foreign('id_receveur')
                  ->references('id')
                  ->on('utilisateur')
                  ->onDelete('cascade');
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('notification');
    }
};