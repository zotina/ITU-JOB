<?php

namespace App\Models\Util;

use App\Models\Utilisateur\Utilisateur;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Repositories\Util\NotificationRepository;

class Notification extends Model
{
    protected $table = 'notification';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'id_receveur',
        'id_emetteur',
        'message',
        'statut',
        'date_envoi',
        'date_lecture',
        'erreur',
        'tentatives',
        'url_redirect'
    ];

    protected $casts = [
        'date_creation' => 'datetime',
        'date_envoi' => 'datetime',
        'date_lecture' => 'datetime',
        'tentatives' => 'integer'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = app(NotificationRepository::class)->generateNotificationId();
            }
        });
    }

    
    public function receveur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_receveur', 'id');
    }

    public function emetteur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_emetteur', 'id');
    }

    
    public function scopeNonLues($query)
    {
        return $query->where('statut', '!=', 'lu');
    }

    public function scopeParReceveur($query, $idReceveur)
    {
        return $query->where('id_receveur', $idReceveur);
    }
}