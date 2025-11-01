<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\CandidatureController;
use App\Http\Controllers\Api\OffreController;
use App\Http\Controllers\Api\ProfilController;
use App\Http\Controllers\Util\NotificationController;
use App\Http\Controllers\Util\ChatbotController;
use App\Http\Controllers\Api\FiltreController;
use App\Http\Controllers\Api\RecommandationController;


Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
});


Route::middleware(['jwt.auth'])->group(function () {
    // role etudiant 
    Route::middleware(['jwt.auth', 'role:etudiant'])
    ->group(function () {
        Route::post('/profils/etudiant/{id}', [ProfilController::class, 'updateProfilEtudiant']);
        Route::get('/candidatures/etudiant', [CandidatureController::class, 'getEtudiantCandidatures']);
        Route::get('/offres', [OffreController::class, 'index']);
        Route::get('/offres/sauvegardees', [OffreController::class, 'listerSauvegardes']);
        Route::get('/offres/{id}', [OffreController::class, 'show']);
        Route::post('/offres/{id}/postuler', [OffreController::class, 'postuler']);
        Route::post('/offres/{id}/sauvegarder', [OffreController::class, 'sauvegarder']);
        Route::delete('/offres/{id}/sauvegarder', [OffreController::class, 'retirerSauvegarde']);
        Route::get('/profils/etudiant/{id}/recommandations', [RecommandationController::class, 'getRecommandations']);
    });
    //role recruteur
    Route::middleware(['jwt.auth', 'role:recruteur'])
    ->group(function () {
        Route::post('/profils/recruteur/{id}', [ProfilController::class, 'updateProfilRecruteur']);
    });
    //all
    Route::get('/profils/recruteur/{id}', [ProfilController::class, 'showRecruteur']);
    Route::get('/profils/etudiant/{id}', [ProfilController::class, 'showEtudiant']);
    Route::prefix('notifications')->group(function () {
        Route::get('/non-lues', [NotificationController::class, 'getNonLues']);    
        Route::get('/count-non-lues', [NotificationController::class, 'countNonLues']);
        Route::get('/lire-tous', [NotificationController::class, 'tousMarquerCommeLue']);
        Route::patch('/{id}/lire', [NotificationController::class, 'marquerCommeLue']);
        Route::post('/envoyer', [NotificationController::class, 'envoyer']);
    });
    Route::prefix('chatbot')->group(function () {
    Route::post('/message', [ChatbotController::class, 'message']);
    });
    Route::prefix('filtre')->group(function () {
        Route::get('/companies', [FiltreController::class, 'filterCompanies']);
    });

});