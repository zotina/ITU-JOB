<?php

namespace App\Models;

use App\Models\Utilisateur\Utilisateur;
use App\Repositories\OffreRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Offre extends Model
{
    protected $table = 'offres';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'id_recruteur',
        'titre',
        'description',
        'lieu',
        'type_contrat',
        'salaire_min',
        'salaire_max',
        'statut',
        'date_publication',
        'date_limite',
    ];

    protected $casts = [
        'date_publication' => 'datetime',
        'date_limite' => 'datetime',
        'salaire_min' => 'decimal:2',
        'salaire_max' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = app(OffreRepository::class)->generateOffreId();
            }
        });
    }

    public function recruteur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_recruteur', 'id');
    }
}
