<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\CandidatureController;
use App\Http\Controllers\Api\OffreController;
use App\Http\Controllers\Api\ProfilController;
use App\Http\Controllers\Util\NotificationController;
use App\Http\Controllers\Util\ChatbotController;


Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
});


Route::middleware(['jwt.auth'])->group(function () {
    Route::get('/offres', [OffreController::class, 'index']);
    Route::get('/offres/sauvegardees', [OffreController::class, 'listerSauvegardes']);
    Route::get('/offres/{id}', [OffreController::class, 'show']);
    Route::post('/offres/{id}/postuler', [OffreController::class, 'postuler']);
    Route::post('/offres/{id}/sauvegarder', [OffreController::class, 'sauvegarder']);
    Route::delete('/offres/{id}/sauvegarder', [OffreController::class, 'retirerSauvegarde']);

    Route::get('/profils/recruteur/{id}', [ProfilController::class, 'showRecruteur']);
    Route::get('/profils/etudiant/{id}', [ProfilController::class, 'showEtudiant']);
    Route::middleware(['jwt.auth', 'role:etudiant'])
        ->put('/profils/etudiant/{id}/position', [ProfilController::class, 'updateEtudiantPosition']);
    Route::middleware(['jwt.auth', 'role:recruteur'])
        ->put('/profils/recruteur/{id}/position', [ProfilController::class, 'updateRecruteurPosition']);

    Route::get('/candidatures/etudiant', [CandidatureController::class, 'getEtudiantCandidatures']);
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
});