import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card } from '@/components/ui/card';

interface NotificationsPopoverProps {
  count: number;
}

const NotificationsPopover = ({ count }: NotificationsPopoverProps) => {
  const notifications = [
    {
      id: 1,
      title: 'Nouvelle candidature reçue',
      message: 'Jean Dupont a postulé pour le poste de Développeur Full Stack',
      time: 'Il y a 5 minutes',
      unread: true,
    },
    {
      id: 2,
      title: 'Offre validée',
      message: 'Votre offre "Développeur React" a été validée et publiée',
      time: 'Il y a 2 heures',
      unread: true,
    },
  ];

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
                className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                  notification.unread ? 'border-l-4 border-l-primary' : ''
                }`}
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
