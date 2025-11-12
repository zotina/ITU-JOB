import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  Briefcase, 
  MessageCircle, 
  User, 
  MapPin,
  GraduationCap,
  LogOut,
  FileText,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  { title: 'Offres', url: '/student/offers', icon: Briefcase },
  { title: 'Mes Candidatures', url: '/student/applications', icon: FileText },
  { title: 'Mes Rendez-vous', url: '/student/appointments', icon: Calendar },
  { title: 'Assistant IA', url: '/student/chatbot', icon: MessageCircle },
  { title: 'Localisation', url: '/student/location', icon: MapPin },
  { title: 'Mon Profil', url: '/student/profile', icon: User },
];

const StudentSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary' : 'hover:bg-muted/50';

  return (
    <Sidebar className={state === 'collapsed' ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent>
        {/* En-tête */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            {state !== 'collapsed' && (
              <div>
                <h2 className="font-semibold text-foreground">ITU Jobs</h2>
                <p className="text-sm text-muted-foreground">
                  {user ? `${user.prenom} ${user.nom}` : 'Étudiant'}
                </p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-3 h-5 w-5" />
                      {state !== 'collapsed' && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bouton déconnexion */}
        <div className="mt-auto p-4">
          <Button 
            variant="outline" 
            className="w-full" 
            size="sm"
            onClick={() => window.location.href = '/login'}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {state !== 'collapsed' && "Déconnexion"}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default StudentSidebar;