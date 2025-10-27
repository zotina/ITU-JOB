<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\OffreController;
use App\Http\Controllers\Api\ProfilController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Routes protégées par JWT
Route::middleware(['jwt.auth'])->group(function () {
    // Routes pour les offres d'emploi
    Route::get('/offres', [OffreController::class, 'index']);
    Route::get('/offres/sauvegardees', [OffreController::class, 'listerSauvegardes']);
    Route::get('/offres/{id}', [OffreController::class, 'show']);
    Route::post('/offres/{id}/postuler', [OffreController::class, 'postuler']);
    Route::post('/offres/{id}/sauvegarder', [OffreController::class, 'sauvegarder']);
    Route::delete('/offres/{id}/sauvegarder', [OffreController::class, 'retirerSauvegarde']);

    // Routes pour les profils
    Route::get('/profils/recruteur/{id}', [ProfilController::class, 'showRecruteur']);
    Route::get('/profils/etudiant/{id}', [ProfilController::class, 'showEtudiant']);
});


// Route::prefix('test')->group(function () {
    
//     // Route accessible uniquement par les étudiants
//     Route::middleware(['jwt.auth', 'role:etudiant'])
//         ->get('/hello-etudiant', [TestRoleController::class, 'helloEtudiant']);
    
//     // Route accessible uniquement par les recruteurs
//     Route::middleware(['jwt.auth', 'role:recruteur'])
//         ->get('/hello-recruteur', [TestRoleController::class, 'helloRecruteur']);
    
//     // Route accessible par tous les utilisateurs authentifiés
//     Route::middleware(['jwt.auth', 'role:etudiant,recruteur'])
//         ->get('/hello-all', [TestRoleController::class, 'helloAll']);
// });