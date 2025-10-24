<?php

namespace App\Repositories\Utilisateur;

use App\Models\Utilisateur\Utilisateur;
use Illuminate\Database\Eloquent\Model;

class UserRepository
{
    protected $model;

    public function __construct(Utilisateur $model)
    {
        $this->model = $model;
    }

    public function findByTelephone(string $telephone): ?Utilisateur
    {
        return $this->model->where('telephone', $telephone)->first();
    }

    public function findByEmail(string $email): ?Utilisateur
    {
        return $this->model->where('email', $email)->first();
    }

    public function existsByTelephone(string $telephone): bool
    {
        return $this->model->where('telephone', $telephone)->exists();
    }

    public function existsByEmail(string $email): bool
    {
        return $this->model->where('email', $email)->exists();
    }

    public function create(array $data): Utilisateur
    {
        return $this->model->create($data);
    }

    public function find(string $id): ?Utilisateur
    {
        return $this->model->find($id);
    }

    public function generateUserId(): string
    {
        $lastUser = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastUser ? (int) substr($lastUser->id, 3) : 0;
        return sprintf('UTI%05d', $lastId + 1);
    }
}