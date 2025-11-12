import React, { useState } from 'react';
import { useChatbot, ChatMessage } from '@/hooks/useChatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, RotateCcw } from 'lucide-react';
import QuickActions from './QuickActions';

interface ChatbotProps {
  userRole: 'etudiant' | 'recruteur';
}

const Chatbot: React.FC<ChatbotProps> = ({ userRole }) => {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    resetConversation
  } = useChatbot(userRole);

  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    let message = '';
    switch (action) {
      case 'rechercher_offres':
        message = 'Recherche des offres d\'emploi';
        break;
      case 'analyser_profil':
        message = 'Analyse mon profil';
        break;
      case 'mes_candidatures':
        message = 'Affiche mes candidatures';
        break;
      case 'sauvegarder_offre':
        message = 'Sauvegarde une offre';
        break;
      case 'mes_offres':
        message = 'Affiche mes offres';
        break;
      case 'candidatures_offre':
        message = 'Affiche les candidatures';
        break;
      case 'stats_recrutement':
        message = 'Montre les statistiques de recrutement';
        break;
      case 'creer_offre':
        message = 'Créer une nouvelle offre';
        break;
      default:
        message = action;
    }
    
    sendMessage(message);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">
            {userRole === 'etudiant' ? 'Assistant Étudiant' : 'Assistant Recruteur'}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetConversation}
            disabled={isLoading}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Nouvelle conversation
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="text-sm">En train de réfléchir...</div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex justify-start">
                <div className="bg-destructive/20 text-destructive rounded-lg px-4 py-2">
                  <div className="text-sm">{error}</div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t space-y-3">
          <QuickActions 
            userRole={userRole} 
            onActionClick={handleQuickAction} 
            disabled={isLoading} 
          />
          
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message ici..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || inputMessage.trim() === ''}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            {userRole === 'etudiant' 
              ? "Demandez-moi de rechercher des offres, d'analyser votre profil, de gérer vos candidatures, etc." 
              : "Demandez-moi de gérer vos offres, de voir les candidatures, de créer une nouvelle offre, etc."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;