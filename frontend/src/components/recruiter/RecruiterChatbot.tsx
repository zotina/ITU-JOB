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

const RecruiterChatbot = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initial conversation flow with more realistic messages based on recruiter's current needs
  const initialMessages: Message[] = [
    {
      id: '1',
      type: 'bot',
      content: 'Bonjour ! Je suis votre assistant IA pour le recrutement. Je constate que vous avez publié 2 offres actuellement : "Développeur Full Stack" et "Ingénieur DevOps". L\'offre "Développeur Full Stack" a reçu 24 candidatures avec un taux de réponse de 85%, tandis que "Ingénieur DevOps" a 15 candidatures avec un taux de réponse de 67%. Souhaitez-vous analyser les candidatures ou créer une nouvelle offre ?',
      timestamp: new Date(Date.now() - 60000) // 1 minute ago
    },
    {
      id: '2',
      type: 'user',
      content: 'Bonjour, je voudrais analyser les candidatures pour le poste de Développeur Full Stack',
      timestamp: new Date(Date.now() - 50000) // 50 seconds ago
    },
    {
      id: '3',
      type: 'bot',
      content: 'Voici l\'analyse des 24 candidatures pour le poste de "Développeur Full Stack" :\n\n- 8 candidats ont un score de matching > 85%\n- 5 candidats ont des entretiens programmés\n- 3 candidats sont en attente de test technique\n- Les compétences les plus courantes : React (90%), Node.js (85%), JavaScript (80%)\n\nLe candidat avec le meilleur score est Andriamalala Raviro avec 92% de matching. Souhaitez-vous voir le profil détaillé de ce candidat ou planifier des entretiens ?',
      timestamp: new Date(Date.now() - 40000) // 40 seconds ago
    },
    {
      id: '4',
      type: 'user',
      content: 'Oui, montrez-moi le profil d\'Andriamalala Raviro et planifions un entretien',
      timestamp: new Date(Date.now() - 30000) // 30 seconds ago
    },
    {
      id: '5',
      type: 'bot',
      content: 'Profil d\'Andriamalala Raviro (Score: 92%) :\n- Expérience : 3 ans en développement Java et Spring Boot\n- Compétences : Java, Spring Boot, React, TypeScript, PostgreSQL\n- Dernier poste : Développeur Full Stack chez une entreprise de technologie\n- Formation : Ingénieur en Informatique\n\nPour planifier l\'entretien, quand souhaitez-vous le programmer ? Je peux vous proposer :\n- Mardi 12 novembre à 10h\n- Mercredi 13 novembre à 14h\n- Jeudi 14 novembre à 9h\n\nSouhaitez-vous également envoyer un test technique à ce candidat avant l\'entretien ?',
      timestamp: new Date(Date.now() - 20000) // 20 seconds ago
    },
    {
      id: '6',
      type: 'user',
      content: 'Planifions l\'entretien pour mercredi 13 novembre à 14h et envoyons un test technique',
      timestamp: new Date(Date.now() - 10000) // 10 seconds ago
    },
    {
      id: '7',
      type: 'bot',
      content: 'Entretien planifié pour Andriamalala Raviro le mercredi 13 novembre à 14h. L\'invitation a été envoyée avec un lien de confirmation. Le test technique portera sur :\n- Développement d\'une API REST avec Spring Boot\n- Création d\'un composant React avec gestion d\'état\n- Durée : 2 heures\n- Délai de soumission : 3 jours ouvrables\n\nSouhaitez-vous créer une nouvelle offre d\'emploi ou analyser d\'autres candidatures ?',
      timestamp: new Date()
    }
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    'Analyser les candidatures Développeur Full Stack',
    'Planifier les entretiens',
    'Créer une nouvelle offre',
    'Envoyer un test technique'
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
    
    // Context-aware responses based on recruiter input
    if (lowerInput.includes('candidature') || lowerInput.includes('analyser') || lowerInput.includes('profil')) {
      return 'J\'ai identifié 8 candidats avec un score de matching > 85% pour votre offre "Développeur Full Stack". Le candidat le mieux classé est Andriamalala Raviro avec 92%. Les compétences clés parmi les meilleurs candidats sont : React (90%), Node.js (85%), Java (78%), et PostgreSQL (75%). Souhaitez-vous voir les profils détaillés de ces candidats ?';
    } else if (lowerInput.includes('offre') || lowerInput.includes('emploi') || lowerInput.includes('publier')) {
      return 'Basé sur les données du marché, je recommande d\'ajouter ces éléments à votre offre : détails sur les avantages (télétravail, formation), technologies spécifiques (React 18, Node.js 18), et une description claire de la culture d\'entreprise. Cela augmente l\'attractivité de 30%. Souhaitez-vous que je vous aide à rédiger une offre optimisée ?';
    } else if (lowerInput.includes('entretien') || lowerInput.includes('planifier')) {
      return 'Pour les entretiens, je vous recommande cette structure : 10 min pour une brève présentation de l\'entreprise, 20 min pour des questions techniques, 15 min pour des questions comportementales, et 5 min pour répondre aux questions du candidat. Souhaitez-vous que je vous propose un créneau pour les prochains entretiens ?';
    } else if (lowerInput.includes('sourcing') || lowerInput.includes('trouver') || lowerInput.includes('candidat')) {
      return 'Pour trouver plus de candidats, je suggère : de publier sur des plateformes spécialisées comme GitHub Jobs, de participer à des meetups techniques locaux, d\'établir un programme de parrainage, et d\'améliorer la visibilité de votre entreprise sur les réseaux professionnels. J\'ai identifié 25 profils pertinents sur la plateforme. Souhaitez-vous que je vous envoie les coordonnées de 5 d\'entre eux ?';
    } else if (lowerInput.includes('test') || lowerInput.includes('technique')) {
      return 'Pour le poste de "Développeur Full Stack", je recommande un test technique de 2 heures comprenant : une API REST avec Spring Boot (30%), un composant React avec gestion d\'état (40%), et une base de données PostgreSQL (30%). Souhaitez-vous que je vous génère un exemple de test technique ?';
    } else {
      const responses = [
        'Basé sur l\'analyse des candidatures, je recommande de prioriser les candidats avec un score de matching supérieur à 85%. Je peux vous fournir un classement détaillé.',
        'Pour améliorer votre offre, ajoutez des détails sur les avantages et la culture d\'entreprise. Cela augmente l\'attractivité de 30%.',
        'J\'ai identifié 15 profils correspondant à vos critères. Voulez-vous que je les classe par pertinence ?',
        'Pour cette position, je suggère de poser des questions techniques sur React et des questions comportementales sur le travail en équipe.',
        'Je recommande d\'organiser les entretiens en 3 étapes : technique, comportemental, et avec l\'équipe. Cela augmente le taux de réussite de 40%.',
        'Considérez l\'option d\'un test technique en amont pour gagner du temps. Je peux vous proposer des modèles de test adaptés à votre poste.'
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
          <h1 className="text-2xl font-bold">Assistant IA Recrutement</h1>
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

export default RecruiterChatbot;