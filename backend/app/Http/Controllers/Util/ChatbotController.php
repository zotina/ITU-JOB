<?php

namespace App\Http\Controllers\Util;

use App\Http\Controllers\Controller;
use App\Services\Util\ChatbotService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChatbotController extends Controller
{
    private ChatbotService $chatbotService;

    public function __construct(ChatbotService $chatbotService)
    {
        $this->chatbotService = $chatbotService;
    }

    
    public function message(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'user_id' => 'required|string|exists:utilisateur,id'
        ]);

        $response = $this->chatbotService->chat(
            $validated['message'],
            $validated['user_id']
        );

        return response()->json($response);
    }
}