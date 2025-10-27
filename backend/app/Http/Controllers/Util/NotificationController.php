<?php

namespace App\Http\Controllers\Util;

use App\Http\Controllers\Controller;
use App\Services\Util\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function getNonLues(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id_utilisateur' => 'required|string|exists:utilisateur,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $notifications = $this->notificationService->getNotificationsNonLues(
            $request->id_utilisateur
        );

        return response()->json([
            'success' => true,
            'data' => $notifications,
            'count' => $notifications->count()
        ]);
    }

    
    public function countNonLues(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id_utilisateur' => 'required|string|exists:utilisateur,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $count = $this->notificationService->compterNonLues($request->id_utilisateur);

        return response()->json([
            'success' => true,
            'count' => $count
        ]);
    }

    public function tousMarquerCommeLue(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id_utilisateur' => 'required|string|exists:utilisateur,id'
        ]);
        
        $resultat = $this->notificationService->tousMarquerCommeLue($request->id_utilisateur);

        if ($resultat) {
            return response()->json([
                'success' => true,
                'message' => 'Notification marquée comme lue'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Notification introuvable'
        ], 404);
    }
    
    public function marquerCommeLue(string $id): JsonResponse
    {
        $resultat = $this->notificationService->marquerCommeLue($id);

        if ($resultat) {
            return response()->json([
                'success' => true,
                'message' => 'Notification marquée comme lue'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Notification introuvable'
        ], 404);
    }

    public function envoyer(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id_receveur' => 'required|string|exists:utilisateur,id',
            'message' => 'required|string',
            'id_emetteur' => 'nullable',
            'url_redirect' => 'nullable'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $notification = $this->notificationService->notifier(
            $request->id_receveur,
            $request->message,
            $request->id_emetteur,
            $request->url_redirect,

        );

        if ($notification) {
            return response()->json([
                'success' => true,
                'message' => 'Notification envoyée',
                'data' => $notification
            ], 201);
        }

        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de l\'envoi'
        ], 500);
    }
}