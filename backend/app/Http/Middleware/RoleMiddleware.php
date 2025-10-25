<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $userRole = $request->get('auth_user_role');

        if (!$userRole) {
            return response()->json([
                'status' => false,
                'message' => 'Rôle utilisateur non identifié.'
            ], 403);
        }
        
        if (!in_array($userRole, $roles)) {
            return response()->json([
                'status' => false,
                'message' => 'Accès interdit. Vous n\'avez pas les permissions nécessaires.',
                'required_role' => implode(' ou ', $roles),
                'your_role' => $userRole
            ], 403);
        }

        return $next($request);
    }
}