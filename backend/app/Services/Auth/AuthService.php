<?php

namespace App\Services\Auth;

use App\Repositories\Utilisateur\UserRepository;
use App\Services\Auth\JwtService;
use Illuminate\Support\Facades\Hash;
use InvalidArgumentException;

class AuthService
{
    private $userRepository;
    private $jwtService;

    public function __construct(
        UserRepository $userRepository,
        JwtService $jwtService
    ) {
        $this->userRepository = $userRepository;
        $this->jwtService = $jwtService;
    }

    public function login(string $credential, string $password ): array
    {
        $user = filter_var($credential, FILTER_VALIDATE_EMAIL)
            ? $this->userRepository->findByEmail($credential)
            : $this->userRepository->findByTelephone($credential);

        if (!$user || !Hash::check($password, $user->mot_de_passe_hash)) {
            throw new InvalidArgumentException('Invalid email/phone or password.');
        }

        if (!$user->est_actif) {
            throw new InvalidArgumentException('Account is inactive. Please contact the administrator.');
        }

        $tokenData = $this->jwtService->generateAccessToken([
            'id' => $user->id,
            'email' => $user->email,
            'prenom' => $user->prenom,
            'nom' => $user->nom,
            'telephone' => $user->telephone,
            'adresse' => $user->adresse,
            'role'=> $user->role->val
        ]);

        return [
            'message' => 'Login successful.',
            'token_data' => $tokenData,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'prenom' => $user->prenom,
                'nom' => $user->nom,
                'telephone' => $user->telephone,
                'adresse' => $user->adresse,
                'date_creation' => $user->date_creation,
                'role'=> $user->role->val,
            ],
        ];
    }

    public function logout(string $token, string $telephone): void
    {
        $tokenData = $this->jwtService->validateAccessToken($token, $telephone);

        if (!$tokenData) {
            throw new InvalidArgumentException('Invalid or expired token.');
        }

        $this->jwtService->revokeToken($telephone);
    }

    public function refreshToken(string $refreshToken): array
    {
        $tokenData = $this->jwtService->refreshAccessToken($refreshToken);

        if (!$tokenData) {
            throw new InvalidArgumentException('Invalid or expired refresh token.');
        }

        return $tokenData;
    }

    public function getAuthenticatedUser(string $token, string $telephone): array
    {
        $userData = $this->jwtService->getUserFromToken($token, $telephone);

        if (!$userData) {
            throw new InvalidArgumentException('Invalid or expired token.');
        }

        return $userData;
    }

    public function changePassword(string $userId, string $currentPassword, string $newPassword): bool
    {
        $user = $this->userRepository->find($userId);

        if (!$user) {
            throw new InvalidArgumentException('Utilisateur non trouvé.');
        }

        if (!Hash::check($currentPassword, $user->mot_de_passe_hash)) {
            throw new InvalidArgumentException('Le mot de passe actuel est incorrect.');
        }

        if (Hash::check($newPassword, $user->mot_de_passe_hash)) {
            throw new InvalidArgumentException('Le nouveau mot de passe doit être différent de l\'ancien.');
        }

        $user->updatePassword($newPassword);

        return true;
    }
}