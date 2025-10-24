<?php

namespace App\Repositories\Utilisateur;

use App\Models\Utilisateur\Role;
use Illuminate\Database\Eloquent\Model;

class RoleRepository
{
    protected $model;

    public function __construct(Role $model)
    {
        $this->model = $model;
    }

    public function generateRoleId(): string
    {
        $lastRole = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastRole ? (int) substr($lastRole->id, 3) : 0;
        return sprintf('ROL%05d', $lastId + 1);
    }
}