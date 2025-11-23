import { useState, useCallback, useEffect } from 'react';
import { chatbotService, ChatbotResponse } from '@/services/chatbotService';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

// Types pour les messages
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'conversational' | 'action';
}

// Type pour l'état du chatbot
export interface ChatbotState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentAction: string | null;
  actionData: any | null;
}

// Hook personnalisé pour le chatbot
export const useChatbot = (userRole: 'etudiant' | 'recruteur' = 'etudiant') => {
  const { user } = useAuth();
  const [state, setState] = useState<ChatbotState>({
    messages: [],
    isLoading: false,
    error: null,
    currentAction: null,
    actionData: null
  });

  // Fonction pour envoyer un message à l'API du chatbot
  const sendMessage = useCallback(async (message: string) => {
    if (!user?.id) {
      setState(prev => ({
        ...prev,
        error: 'Utilisateur non authentifié'
      }));
      return;
    }

    // Ajouter le message de l'utilisateur à l'historique
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));

    try {
      // Appeler le service du chatbot
      const response: ChatbotResponse = await chatbotService.chat(message, user.id, userRole);

      // Ajouter la réponse du bot à l'historique
      const botMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: response.message,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isLoading: false,
        error: null,
        currentAction: response.action || null,
        actionData: response.data || null
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Une erreur est survenue lors de l\'envoi du message',
        currentAction: null
      }));
    }
  }, [user, userRole]);

  // Fonction pour ajouter un message système
  const addSystemMessage = useCallback((content: string) => {
    const systemMessage: ChatMessage = {
      id: `sys-${Date.now()}`,
      content,
      sender: 'bot',
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, systemMessage]
    }));
  }, []);

  // Fonction pour réinitialiser la conversation
  const resetConversation = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
      currentAction: null,
      actionData: null
    });
  }, []);

  // Fonction pour envoyer un message de bienvenue
  const sendWelcomeMessage = useCallback(() => {
    const welcomeMessage = userRole === 'etudiant' 
      ? "Bonjour ! Je suis votre assistant pour la plateforme ITU-JOB. Comment puis-je vous aider aujourd'hui ? Vous pouvez me demander de rechercher des offres, d'analyser votre profil, de gérer vos candidatures, etc." 
      : "Bonjour ! Je suis votre assistant pour la plateforme ITU-JOB. Comment puis-je vous aider aujourd'hui ? Vous pouvez me demander de gérer vos offres, de voir les candidatures, de créer une nouvelle offre, etc.";
    
    addSystemMessage(welcomeMessage);
  }, [userRole, addSystemMessage]);

  // Initialiser le message de bienvenue au montage
  useEffect(() => {
    sendWelcomeMessage();
  }, [sendWelcomeMessage]);

  return {
    ...state,
    sendMessage,
    resetConversation,
    addSystemMessage
  };
};