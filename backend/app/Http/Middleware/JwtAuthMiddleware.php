<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\Auth\JwtService;
use Illuminate\Support\Facades\Log;

class JwtAuthMiddleware
{
    private $jwtService;

    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    
    public function handle(Request $request, Closure $next, ...$guards)
    {
        $token = $request->bearerToken();
        $telephone = $request->header('X-Phone-Number') ?? $request->get('telephone');

        if (!$token) {
            return response()->json([
                'status' => false,
                'message' => 'Token d\'accès requis.'
            ], 401);
        }

        if (!$telephone) {
            return response()->json([
                'status' => false,
                'message' => 'Numéro de téléphone requis.'
            ], 400);
        }

        $tokenData = $this->jwtService->validateAccessToken($token, $telephone);

        if (!$tokenData) {
            return response()->json([
                'status' => false,
                'message' => 'Token invalide ou expiré.'
            ], 401);
        }

        
        $request->merge([
            'auth_user_id' => $tokenData['user_id'],
            'auth_user_email' => $tokenData['email'],
            'auth_user_telephone' => $tokenData['telephone'],
            'auth_user_role' => $tokenData['role'], 
            'auth_user_data' => $tokenData
        ]);

        Log::debug('Utilisateur authentifié via JWT', [
            'user_id' => $tokenData['user_id'],
            'telephone' => $telephone
        ]);

        return $next($request);
    }
}