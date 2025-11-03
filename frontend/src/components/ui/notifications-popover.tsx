import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card } from '@/components/ui/card';
import { mockNotifications, Notification } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

interface NotificationsPopoverProps {
  count: number;
}

const NotificationsPopover = ({ count }: NotificationsPopoverProps) => {
  const navigate = useNavigate();
  
  // Utiliser les notifications de mockData mais trier par ordre de récence (les plus récentes d'abord)
  const notifications = [...mockNotifications].sort((a, b) => 
    a.read === b.read ? 0 : a.read ? 1 : -1 // Mettre les non lues en premier
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {count > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
              {count}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Notifications</h3>
            <Badge variant="secondary">{count}</Badge>
          </div>
          
          <div className="space-y-2">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-3 cursor-pointer hover:bg-accent transition-colors ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
                onClick={() => {
                  // Marquer la notification comme lue
                  // (Dans une application réelle, on ferait une requête API pour mettre à jour l'état)
                  
                  // Rediriger en fonction du type
                  switch (notification.type) {
                    case 'candidate_application':
                      navigate(`/recruiter/candidates?offerId=${notification.target}`);
                      break;
                    case 'offer_published':
                      navigate(`/recruiter/offers`);
                      // Pourrait éventuellement scroller à l'offre spécifique ou afficher un badge
                      break;
                    case 'message':
                      // Rediriger vers la page de message (à implémenter)
                      navigate(`/recruiter/messages`); // ou une autre page pertinente
                      break;
                    default:
                      console.log('Unknown notification type');
                  }
                }}
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </Card>
            ))}
          </div>
          
          <Button variant="outline" className="w-full" size="sm">
            Voir toutes les notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
