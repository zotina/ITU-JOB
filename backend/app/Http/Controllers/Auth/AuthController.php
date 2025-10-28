<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    private $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'emailOUnumero' => 'required|string',
                'mot_de_passe' => 'required|string'
            ]);

            $result = $this->authService->login($request->emailOUnumero, $request->mot_de_passe );

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

    private function successResponse(string $message, array $data = [], int $status = 200): JsonResponse
    {
        return response()->json(array_merge([
            'status' => true,
            'message' => $message,
        ], $data), $status);
    }

    private function errorResponse(string $message, int $status = 500): JsonResponse
    {
        Log::error($message);
        return response()->json([
            'status' => false,
            'message' => $message,
        ], $status);
    }
}