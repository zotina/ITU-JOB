
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\auth\AuthController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
});