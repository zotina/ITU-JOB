import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Search, UserCheck, Briefcase, FileText, Users, BarChart3, PlusCircle } from 'lucide-react';

interface QuickActionButtonProps {
  action: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ action, label, onClick, disabled = false }) => {
  const getIcon = () => {
    switch (action) {
      case 'rechercher_offres':
        return <Search className="w-4 h-4" />;
      case 'analyser_profil':
        return <UserCheck className="w-4 h-4" />;
      case 'mes_candidatures':
        return <Briefcase className="w-4 h-4" />;
      case 'sauvegarder_offre':
        return <FileText className="w-4 h-4" />;
      case 'mes_offres':
        return <Briefcase className="w-4 h-4" />;
      case 'candidatures_offre':
        return <Users className="w-4 h-4" />;
      case 'stats_recrutement':
        return <BarChart3 className="w-4 h-4" />;
      case 'creer_offre':
        return <PlusCircle className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="text-xs py-1.5 px-3 flex items-center gap-1"
    >
      {getIcon()}
      {label}
    </Button>
  );
};

interface QuickActionsProps {
  userRole: 'etudiant' | 'recruteur';
  onActionClick: (action: string) => void;
  disabled?: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ userRole, onActionClick, disabled = false }) => {
  const actions = userRole === 'etudiant' 
    ? [
        { action: 'rechercher_offres', label: 'Rechercher offres' },
        { action: 'analyser_profil', label: 'Analyser mon profil' },
        { action: 'mes_candidatures', label: 'Mes candidatures' },
      ]
    : [
        { action: 'mes_offres', label: 'Mes offres' },
        { action: 'candidatures_offre', label: 'Candidatures' },
        { action: 'stats_recrutement', label: 'Statistiques' },
        { action: 'creer_offre', label: 'Créer offre' },
      ];

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-lg">
      {actions.map((actionItem) => (
        <QuickActionButton
          key={actionItem.action}
          action={actionItem.action}
          label={actionItem.label}
          onClick={() => onActionClick(actionItem.action)}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default QuickActions;