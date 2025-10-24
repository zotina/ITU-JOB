import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import RecruiterSidebar from '@/components/sidebars/RecruiterSidebar';
import NotificationsPopover from '@/components/ui/notifications-popover';

interface RecruiterLayoutProps {
  children: React.ReactNode;
}

const RecruiterLayout = ({ children }: RecruiterLayoutProps) => {
  const [notifications] = useState(7);
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('offers')) return 'Mes Offres';
    if (path.includes('candidates')) return 'Candidatures';
    if (path.includes('notifications')) return 'Notifications';
    if (path.includes('analytics')) return 'Analytiques';
    if (path.includes('chatbot')) return 'Assistant IA';
    if (path.includes('profile')) return 'Mon Profil';
    return 'Tableau de bord';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/30">
        <RecruiterSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold text-foreground">{getPageTitle()}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <NotificationsPopover count={notifications} />
            </div>
          </header>
          
          {/* Contenu principal */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default RecruiterLayout;