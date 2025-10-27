<?php

namespace App\Services\Util;

use App\Models\Util\Notification;
use App\Models\Utilisateur\Utilisateur;
use App\Repositories\Util\NotificationRepository;
use Illuminate\Support\Facades\Log;
use Exception;

class NotificationService
{
    protected $repository;

    public function __construct(NotificationRepository $repository)
    {
        $this->repository = $repository;
    }

    
    public function notifier(
        string $idReceveur, 
        string $message,
        string $id_emetteur,
        string $url_redirect
    ): ?Notification {
        try {
            
            $receveur = Utilisateur::find($idReceveur);
            if (!$receveur) {
                throw new Exception("Utilisateur receveur introuvable : {$idReceveur}");
            }

            
            $notification = Notification::create([
                'id_receveur' => $idReceveur,
                'message' => $message,
                'statut' => 'envoye',
                'id_emetteur'=>$id_emetteur,
                'url_redirect'=>$url_redirect,
                'date_envoi' => now()
            ]);

            Log::info("Notification créée", [
                'id' => $notification->id,
                'receveur' => $idReceveur
            ]);

            return $notification;

        } catch (Exception $e) {
            Log::error("Erreur notification", [
                'receveur' => $idReceveur,
                'erreur' => $e->getMessage()
            ]);
            return null;
        }
    }

    
    public function getNotificationsNonLues(string $idUtilisateur)
    {
        return $this->repository->getNotificationsNonLues($idUtilisateur);
    }

    
    public function compterNonLues(string $idUtilisateur): int
    {
        return $this->repository->compterNonLues($idUtilisateur);
    }

    
    public function marquerCommeLue(string $idNotification): bool
    {
        return $this->repository->marquerCommeLue($idNotification);
    }

    public function tousMarquerCommeLue(string $idUtilisateur): bool
    {
        return $this->repository->tousMarquerCommeLue($idUtilisateur);
    }
}