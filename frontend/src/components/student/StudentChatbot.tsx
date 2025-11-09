import { useState, useEffect, useRef } from 'react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initial conversation flow with more realistic messages based on user's profile and applications
  const initialMessages: Message[] = [
    {
      id: '1',
      type: 'bot',
      content: 'Bonjour Andriamalala Raviro ! Je suis votre assistant IA carrière. Je constate que vous avez un profil solide en développement Java et Spring Boot. Actuellement, vous avez postulé à 3 offres : "Stage Développeur Web" chez Orange Madagascar, "Développeur Full Stack", et "Ingénieur DevOps". Souhaitez-vous que je vous aide à suivre vos candidatures ou à découvrir de nouvelles opportunités ?',
      timestamp: new Date(Date.now() - 60000) // 1 minute ago
    },
    {
      id: '2',
      type: 'user',
      content: 'Bonjour, je voudrais voir l\'état de mes candidatures',
      timestamp: new Date(Date.now() - 50000) // 50 seconds ago
    },
    {
      id: '3',
      type: 'bot',
      content: 'Voici l\'état de vos candidatures :\n\n1. "Stage Développeur Web" chez Orange Madagascar - En cours de traitement, réponse attendue dans 2 jours\n\n2. "Développeur Full Stack" - Entretien prévu le 15 novembre\n\n3. "Ingénieur DevOps" - En attente de votre réponse pour un entretien le 12 novembre\n\nSouhaitez-vous préparer l\'un de ces entretiens ou postuler à d\'autres offres ?',
      timestamp: new Date(Date.now() - 40000) // 40 seconds ago
    },
    {
      id: '4',
      type: 'user',
      content: 'Je veux préparer l\'entretien du 15 novembre pour le poste de Développeur Full Stack',
      timestamp: new Date(Date.now() - 30000) // 30 seconds ago
    },
    {
      id: '5',
      type: 'bot',
      content: 'Excellent choix ! Pour le poste de Développeur Full Stack, voici les technologies clés à maîtriser : React, Node.js, PostgreSQL, Docker, et Git. Je vous recommande de réviser :\n\n- Les concepts de programmation asynchrone (promises, async/await)\n\n- Les hooks React (useState, useEffect, useContext)\n\n- La gestion d\'état avec Redux ou Context API\n\n- Les principes SOLID en programmation orientée objet\n\nSouhaitez-vous que je vous propose des questions d\'entretien techniques spécifiques ?',
      timestamp: new Date(Date.now() - 20000) // 20 seconds ago
    },
    {
      id: '6',
      type: 'user',
      content: 'Oui, montrez-moi des questions techniques pour ce poste',
      timestamp: new Date(Date.now() - 10000) // 10 seconds ago
    },
    {
      id: '7',
      type: 'bot',
      content: 'Voici des questions techniques pour le poste de Développeur Full Stack :\n\n1. Pouvez-vous expliquer la différence entre React et Angular ?\n\n2. Qu\'est-ce qu\'un hook personnalisé dans React et comment le créez-vous ?\n\n3. Comment gérez-vous l\'authentification et la sécurité dans une application Full Stack ?\n\n4. Quelle est la différence entre une base de données relationnelle et une base de données NoSQL ?\n\n5. Comment optimisez-vous les performances d\'une application web ?\n\nPuis-je vous aider à préparer vos réponses à ces questions ?',
      timestamp: new Date()
    }
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    'Voir mes candidatures en cours',
    'Rechercher des offres adaptées',
    'Préparer l\'entretien du 15 novembre',
    'Optimiser mon profil'
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
    const lowerInput = userInput.toLowerCase();
    
    // Context-aware responses based on user input
    if (lowerInput.includes('offre') || lowerInput.includes('emploi') || lowerInput.includes('stage')) {
      return 'J\'ai trouvé plusieurs offres intéressantes pour vous : "Développeur Frontend React" chez Orange Madagascar, "Stage Java" chez Airtel Madagascar, et "Ingénieur Logiciel" chez Microlink Madagascar. Votre score de matching est de 88%, 85% et 82% respectivement. Souhaitez-vous plus de détails sur l\'une de ces offres ?';
    } else if (lowerInput.includes('candidature') || lowerInput.includes('postulé')) {
      return 'Actuellement, vous avez 3 candidatures en cours : "Stage Développeur Web" chez Orange Madagascar (en cours de traitement), "Développeur Full Stack" (entretien le 15 novembre), et "Ingénieur DevOps" (en attente de votre réponse pour un entretien). Voulez-vous des détails sur l\'une de ces candidatures ?';
    } else if (lowerInput.includes('entretien') || lowerInput.includes('préparer')) {
      return 'Pour bien préparer vos entretiens, je vous recommande de réviser : les concepts de programmation asynchrone, les hooks React, les principes SOLID, et la gestion d\'état. Souhaitez-vous des questions d\'entretien spécifiques à pratiquer ?';
    } else if (lowerInput.includes('cv') || lowerInput.includes('profil')) {
      return 'Votre profil est bien structuré avec des compétences clés en Java, Spring Boot, React, et PostgreSQL. Pour l\'améliorer, vous pourriez ajouter plus de détails sur vos projets personnels et les technologies émergentes que vous avez explorées. Souhaitez-vous que je vous aide à optimiser une section spécifique ?';
    } else if (lowerInput.includes('compétence') || lowerInput.includes('technologie')) {
      return 'Basé sur les offres actuelles, les compétences les plus demandées sont : React, Node.js, Java, Spring Boot, PostgreSQL, et Docker. Votre profil est déjà très aligné avec ces besoins. Pour vous démarquer, vous pourriez vous former sur Kubernetes ou sur les architectures cloud (AWS, Azure).';
    } else {
      const responses = [
        'C\'est une excellente question ! Basé sur votre profil, je recommande de vous concentrer sur les technologies React et TypeScript qui sont très demandées.',
        'Pour cette offre, votre score de matching est de 87%. Vous pourriez améliorer vos chances en ajoutant des compétences en Docker ou Kubernetes.',
        'Je vois que vous avez de l\'expérience en développement web. Avez-vous pensé à postuler pour des postes de Lead Developer ou de Tech Lead ?',
        'Votre profil est très solide ! Je suggère de mettre en avant vos projets personnels et vos contributions open-source dans vos candidatures.',
        'Puisque vous maîtrisez bien le développement backend, vous pourriez compléter avec des compétences frontend pour devenir un développeur full-stack complet.',
        'Avez-vous envisagé de participer à des hackathons ou des conférences techniques pour étoffer votre réseau professionnel ?'
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleQuickAction = (action: string) => {
    setNewMessage(action);
  };

  return (
    <div className="p-4 md:p-6 w-full">
      <div className="max-w-4xl mx-auto space-y-6 w-full px-2 md:px-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Assistant IA</h1>
        </div>

        <Card className="flex flex-col min-h-[500px] max-h-[70vh] w-full">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              Assistant Carrière
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 md:gap-3 items-start w-full ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'bot' && (
                    <div className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[85%] md:max-w-[70%] p-2 md:p-3 rounded-lg break-words overflow-wrap-anywhere ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-xs md:text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</p>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
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