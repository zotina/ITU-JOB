<?php

namespace App\Services\Auth;

use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;

class JwtService
{
    private $tokenCachePrefix;
    private $tokenExpiration;
    private $refreshTokenExpiration;
    
    public function __construct()
    {
        $this->tokenCachePrefix = 'auth_token:';
        $this->tokenExpiration = (int) config('auth.token_expiration', 3600); 
        $this->refreshTokenExpiration =(int) config('auth.refresh_token_expiration', 604800); 
    }

    
    public function generateAccessToken(array $userData): array
    {
        $token = Str::random(60);
        $refreshToken = Str::random(80);
        $sessionKey = $this->getSessionKey($userData['telephone']);
        
        $tokenData = [
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'user_id' => $userData['id'],
            'email' => $userData['email'],
            'telephone' => $userData['telephone'],
            'prenom' => $userData['prenom'],
            'nom' => $userData['nom'],
            'adresse' => $userData['adresse'] ?? null,
            'role' => $userData['role'],
            'created_at' => Carbon::now()->toISOString(),
            'expires_at' => Carbon::now()->addSeconds($this->tokenExpiration)->toISOString(),
            'refresh_expires_at' => Carbon::now()->addSeconds($this->refreshTokenExpiration)->toISOString()
        ];

        
        Redis::setex($sessionKey, $this->tokenExpiration, json_encode($tokenData));
        
        
        $refreshKey = $this->getRefreshTokenKey($refreshToken);
        Redis::setex($refreshKey, $this->refreshTokenExpiration, json_encode([
            'user_id' => $userData['id'],
            'telephone' => $userData['telephone'],
            'access_token' => $token,
            'role' => $userData['role']
        ]));

        Log::info('Token d\'accès généré', [
            'user_id' => $userData['id'],
            'telephone' => $userData['telephone'],
            'role' => $userData['role'],
            'expires_in' => $this->tokenExpiration
        ]);

        return [
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'token_type' => 'Bearer',
            'expires_in' => $this->tokenExpiration,
            'expires_at' => $tokenData['expires_at']
        ];
    }

    
    public function validateAccessToken(string $token, string $telephone): ?array
    {
        $sessionKey = $this->getSessionKey($telephone);
        $tokenData = Redis::get($sessionKey);

        if (!$tokenData) {
            Log::warning('Token non trouvé ou expiré', ['telephone' => $telephone]);
            return null;
        }

        $decodedData = json_decode($tokenData, true);

        if (!$decodedData || $decodedData['access_token'] !== $token) {
            Log::warning('Token invalide', ['telephone' => $telephone]);
            return null;
        }

        
        if (Carbon::parse($decodedData['expires_at'])->isPast()) {
            $this->revokeToken($telephone);
            Log::info('Token expiré supprimé', ['telephone' => $telephone]);
            return null;
        }

        return $decodedData;
    }

    
    public function refreshAccessToken(string $refreshToken): ?array
    {
        $refreshKey = $this->getRefreshTokenKey($refreshToken);
        $refreshData = Redis::get($refreshKey);

        if (!$refreshData) {
            Log::warning('Refresh token non trouvé ou expiré', ['refresh_token' => substr($refreshToken, 0, 10) . '...']);
            return null;
        }

        $decodedRefreshData = json_decode($refreshData, true);
        $sessionKey = $this->getSessionKey($decodedRefreshData['telephone']);
        $currentTokenData = Redis::get($sessionKey);

        if (!$currentTokenData) {
            
            Redis::del($refreshKey);
            return null;
        }

        $currentData = json_decode($currentTokenData, true);
        
        
        $newToken = Str::random(60);
        $newRefreshToken = Str::random(80);
        
        $newTokenData = array_merge($currentData, [
            'access_token' => $newToken,
            'refresh_token' => $newRefreshToken,
            'created_at' => Carbon::now()->toISOString(),
            'expires_at' => Carbon::now()->addSeconds($this->tokenExpiration)->toISOString(),
            'refresh_expires_at' => Carbon::now()->addSeconds($this->refreshTokenExpiration)->toISOString()
        ]);

        
        Redis::setex($sessionKey, $this->tokenExpiration, json_encode($newTokenData));
        
        
        Redis::del($refreshKey);
        $newRefreshKey = $this->getRefreshTokenKey($newRefreshToken);
        Redis::setex($newRefreshKey, $this->refreshTokenExpiration, json_encode([
            'user_id' => $currentData['user_id'],
            'telephone' => $currentData['telephone'],
            'access_token' => $newToken,
             'role' => $currentData['role']
        ]));

        Log::info('Token rafraîchi', [
            'user_id' => $currentData['user_id'],
            'telephone' => $currentData['telephone'],
            'role' => $currentData['role']
        ]);

        return [
            'access_token' => $newToken,
            'refresh_token' => $newRefreshToken,
            'token_type' => 'Bearer',
            'expires_in' => $this->tokenExpiration,
            'expires_at' => $newTokenData['expires_at']
        ];
    }

    
    public function revokeToken(string $telephone): bool
    {
        $sessionKey = $this->getSessionKey($telephone);
        $tokenData = Redis::get($sessionKey);
        
        if ($tokenData) {
            $decodedData = json_decode($tokenData, true);
            
            
            Redis::del($sessionKey);
            
            
            if (isset($decodedData['refresh_token'])) {
                $refreshKey = $this->getRefreshTokenKey($decodedData['refresh_token']);
                Redis::del($refreshKey);
            }
            
            Log::info('Token révoqué', [
                'user_id' => $decodedData['user_id'] ?? null,
                'telephone' => $telephone
            ]);
            
            return true;
        }

        return false;
    }

    
    public function isTokenValid(string $token, string $telephone): bool
    {
        return $this->validateAccessToken($token, $telephone) !== null;
    }

    
    public function getUserFromToken(string $token, string $telephone): ?array
    {
        $tokenData = $this->validateAccessToken($token, $telephone);
        
        if (!$tokenData) {
            return null;
        }

        return [
            'id' => $tokenData['user_id'],
            'email' => $tokenData['email'],
            'prenom' => $tokenData['prenom'],
            'nom' => $tokenData['nom'],
            'telephone' => $tokenData['telephone'],
            'adresse' => $tokenData['adresse'],
            'role' => $tokenData['role'] ?? null
        ];
    }

    
    public function cleanupExpiredTokens(): int
    {
        $pattern = $this->tokenCachePrefix . '*';
        $keys = Redis::keys($pattern);
        $cleanedCount = 0;

        foreach ($keys as $key) {
            $tokenData = Redis::get($key);
            if ($tokenData) {
                $decodedData = json_decode($tokenData, true);
                if ($decodedData && isset($decodedData['expires_at'])) {
                    if (Carbon::parse($decodedData['expires_at'])->isPast()) {
                        Redis::del($key);
                        $cleanedCount++;
                    }
                }
            }
        }

        if ($cleanedCount > 0) {
            Log::info('Tokens expirés nettoyés', ['count' => $cleanedCount]);
        }

        return $cleanedCount;
    }

    
    private function getSessionKey(string $telephone): string
    {
        return $this->tokenCachePrefix . $telephone;
    }

    
    private function getRefreshTokenKey(string $refreshToken): string
    {
        return 'refresh_token:' . hash('sha256', $refreshToken);
    }

    
    public function extendTokenExpiration(string $telephone, int $additionalSeconds = null): bool
    {
        $sessionKey = $this->getSessionKey($telephone);
        $tokenData = Redis::get($sessionKey);
        
        if (!$tokenData) {
            return false;
        }

        $decodedData = json_decode($tokenData, true);
        $extensionTime = $additionalSeconds ?? $this->tokenExpiration;
        
        $decodedData['expires_at'] = Carbon::now()->addSeconds($extensionTime)->toISOString();
        
        Redis::setex($sessionKey, $extensionTime, json_encode($decodedData));
        
        Log::info('Token prolongé', [
            'telephone' => $telephone,
            'extension_seconds' => $extensionTime
        ]);
        
        return true;
    }
}