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
        Schema::table('langues_etudiant', function (Blueprint $table) {
            $table->integer('niveau_int')->nullable()->after('niveau');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('langues_etudiant', function (Blueprint $table) {
            $table->dropColumn('niveau_int');
        });
    }
};
