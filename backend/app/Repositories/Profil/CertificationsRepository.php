<?php

namespace App\Repositories\Profil;

use App\Models\Profil\Certifications;

class CertificationsRepository
{
    protected $model;

    public function __construct(Certifications $model)
    {
        $this->model = $model;
    }

    public function generateCertificationsId(): string
    {
        $lastCertification = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastCertification ? (int) substr($lastCertification->id, 4) : 0;
        return sprintf('CER-%05d', $lastId + 1);
    }
}
