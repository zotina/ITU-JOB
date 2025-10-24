import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const StudentChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Bonjour ! Je suis votre assistant IA. Je peux vous aider avec vos candidatures, analyser les offres d\'emploi, et vous donner des conseils pour améliorer votre profil. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');

  const quickActions = [
    'Analyser une offre d\'emploi',
    'Améliorer mon CV',
    'Préparer un entretien',
    'Suggestions de compétences'
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulation d'une réponse du bot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getBotResponse(newMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setNewMessage('');
  };

  const getBotResponse = (userInput: string): string => {
    const responses = [
      'C\'est une excellente question ! Basé sur votre profil, je recommande de vous concentrer sur les technologies React et TypeScript qui sont très demandées.',
      'Pour cette offre, votre score de matching est de 87%. Vous pourriez améliorer vos chances en ajoutant des compétences en Docker.',
      'Je vois que vous avez de l\'expérience en développement web. Avez-vous pensé à postuler pour des postes de Lead Developer ?',
      'Votre profil est très solide ! Je suggère de mettre en avant vos projets personnels dans vos candidatures.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleQuickAction = (action: string) => {
    setNewMessage(action);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Assistant IA</h1>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              Assistant Carrière
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions rapides */}
            <div className="p-4 border-t bg-muted/30">
              <p className="text-sm font-medium mb-2">Actions rapides :</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action)}
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} size="icon">
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

export default StudentChatbot;