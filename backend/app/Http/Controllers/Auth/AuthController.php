<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\AuthService;
use App\Services\Auth\JwtService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    private $authService;
    private $jwtService;

    public function __construct(AuthService $authService, JwtService $jwtService)
    {
        $this->authService = $authService;
        $this->jwtService = $jwtService;
    }

    public function login(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'emailOUnumero' => 'required|string',
                'mot_de_passe' => 'required|string|min:6',
            ]);

            $result = $this->authService->login($request->emailOUnumero, $request->mot_de_passe);

            return $this->successResponse($result['message'], [
                'token_data' => $result['token_data'],
                'user' => $result['user'],
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse( $e->getMessage(), 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'telephone' => 'required|string',
            ]);

            $bearerToken = $request->bearerToken();
            if (!$bearerToken) {
                return $this->errorResponse('Access token required.', 401);
            }

            $this->authService->logout($bearerToken, $request->telephone);

            return $this->successResponse('Logged out successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse( $e->getMessage(), 500);
        }
    }
}