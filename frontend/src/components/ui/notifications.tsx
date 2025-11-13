import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  X, 
  Check, 
  Mail, 
  MailOpen, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle,
  ExternalLink,
  CheckCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { NotificationService, Notification } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onClick: () => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onClick }: NotificationItemProps) => {
  const [isRead, setIsRead] = useState(notification.read);
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
      case 'application':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
      case 'system':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleClick = () => {
    if (!isRead) {
      onMarkAsRead(notification.id);
      setIsRead(true);
    }
    onClick();
  };

  return (
    <div 
      className={`p-4 border-b last:border-b-0 cursor-pointer transition-colors ${
        !isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {getTypeIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm truncate">{notification.title}</h4>
            {!isRead && <Badge variant="secondary" className="ml-2">Nouveau</Badge>}
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        {!isRead && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
              setIsRead(true);
            }}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Check className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
      {notification.actionUrl && (
        <div className="flex items-center mt-2">
          <ExternalLink className="w-3 h-3 mr-1 text-blue-500" />
          <span className="text-xs text-blue-600 font-medium">Voir détails</span>
        </div>
      )}
    </div>
  );
};

interface NotificationsDropdownProps {
  className?: string;
}

const NotificationsDropdown = ({ className }: NotificationsDropdownProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load notifications
  const loadNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userNotifications = await NotificationService.getUserNotifications(user.id, 10);
      setNotifications(userNotifications);
      
      const unread = userNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  // Mark notification as read
  const markAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      await NotificationService.markAsRead(id, user.id);
      setNotifications(prev => 
        prev.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de marquer la notification comme lue',
        variant: 'destructive',
      });
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      await NotificationService.markAllAsRead(user.id);
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
      toast({
        title: 'Succès',
        description: 'Toutes les notifications ont été marquées comme lues',
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de marquer toutes les notifications comme lues',
        variant: 'destructive',
      });
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className={className} ref={dropdownRef}>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border z-50">
            <Card className="border-0 shadow-none rounded-none">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Notifications</span>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="h-8 px-2"
                      >
                        <CheckCheck className="h-4 w-4 mr-1" />
                        Tout marquer comme lu
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Mail className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Aucune notification</p>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="h-80">
                      {notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={markAsRead}
                          onClick={() => handleNotificationClick(notification)}
                        />
                      ))}
                    </ScrollArea>
                    <div className="p-2 border-t">
                      <Button
                        variant="ghost"
                        className="w-full text-center"
                        onClick={() => {
                          window.location.href = '/student/notifications';
                          setIsOpen(false);
                        }}
                      >
                        Voir toutes les notifications
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export { NotificationsDropdown, NotificationItem };