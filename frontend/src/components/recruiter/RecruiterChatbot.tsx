import { useChatbot } from '@/hooks/useChatbot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import QuickActions from '../chatbot/QuickActions';

const RecruiterChatbot = () => {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    resetConversation
  } = useChatbot('recruteur');

  const handleSendMessage = (message: string) => {
    if (message.trim() === '') return;
    sendMessage(message);
  };

  const handleUserSendMessage = () => {
    const inputElement = document.getElementById('recruiter-chat-input') as HTMLInputElement;
    if (inputElement) {
      handleSendMessage(inputElement.value);
      inputElement.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserSendMessage();
    }
  };

  return (
    <div className="p-4 md:p-6 w-full">
      <div className="max-w-4xl mx-auto space-y-6 w-full px-2 md:px-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Assistant IA Recrutement</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetConversation}
            disabled={isLoading}
          >
            Nouvelle conversation
          </Button>
        </div>

        <Card className="flex flex-col min-h-[500px] max-h-[70vh] w-full">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              Assistant Recrutement
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 md:gap-3 items-start w-full ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[85%] md:max-w-[70%] p-2 md:p-3 rounded-lg break-words overflow-wrap-anywhere ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-xs md:text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</p>
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 md:gap-3 items-start w-full justify-start">
                  <div className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  </div>
                  <div className="max-w-[85%] md:max-w-[70%] p-2 md:p-3 rounded-lg bg-muted">
                    <p className="text-xs md:text-sm">En train de réfléchir...</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex gap-2 md:gap-3 items-start w-full justify-start">
                  <div className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0 bg-destructive/20 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 md:w-4 md:h-4 text-destructive" />
                  </div>
                  <div className="max-w-[85%] md:max-w-[70%] p-2 md:p-3 rounded-lg bg-destructive/20 text-destructive">
                    <p className="text-xs md:text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t bg-muted/10">
              <QuickActions 
                userRole="recruteur" 
                onActionClick={handleSendMessage} 
                disabled={isLoading} 
              />
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  id="recruiter-chat-input"
                  placeholder="Tapez votre message..."
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <Button onClick={handleUserSendMessage} size="icon" disabled={isLoading}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecruiterChatbot;