<?php

namespace App\Repositories\Util;

use App\Models\Util\Notification;

class NotificationRepository
{
    protected $model;

    public function __construct(Notification $model)
    {
        $this->model = $model;
    }

    public function generateNotificationId(): string
    {
        $lastNotification = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastNotification ? (int) substr($lastNotification->id, 6) : 0;
        return sprintf('NOTIF-%05d', $lastId + 1);
    }

    public function getNotificationsNonLues(string $idUtilisateur)
    {
        return $this->model
            ->parReceveur($idUtilisateur)
            ->nonLues()
            ->orderBy('date_creation', 'desc')
            ->get();
    }

    public function compterNonLues(string $idUtilisateur): int
    {
        return $this->model
            ->parReceveur($idUtilisateur)
            ->nonLues()
            ->count();
    }

    public function marquerCommeLue(string $idNotification): bool
    {
        $notification = $this->model->find($idNotification);
        
        if ($notification) {
            return $notification->update([
                'statut' => 'lu',
                'date_lecture' => now()
            ]);
        }
        
        return false;
    }

    public function tousMarquerCommeLue(string $idUtilisateur): bool
    {
        try {
            $updated = Notification::where('id_receveur', $idUtilisateur)
                ->where('statut', 'envoye')
                ->update(['statut' => 'lu', 'date_lecture' => now()]);

            return $updated > 0;
        } catch (\Exception $e) {
            return false;
        }
    }
}