import { ProfileData } from "@/hooks/useProfileData";
 
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { calculateProfileProgression } from "@/utils/profileProgression";

const getContextualMessage = (percentage: number): string => {
  if (percentage < 50) return "Boostez votre visibilité !";
  if (percentage <= 80) return "Presque parfait !";
  if (percentage <= 95) return "Excellent profil !";
  return "Profil exceptionnel !";
};

const CompletionDetails = ({ progressionMetadata, startEditing }: { progressionMetadata: any, startEditing: () => void }) => {
  const sections = [
    { key: 'info_personnel', label: 'Informations personnelles' },
    { key: 'experience', label: 'Expériences' },
    { key: 'competence', label: 'Compétences techniques' },
    { key: 'formation', label: 'Formations' },
    { key: 'soft_skills', label: 'Soft Skills' },
    { key: 'langue', label: 'Langues' },
  ];

  return (
    <div className="p-4 bg-card text-foreground rounded-lg shadow-xl border w-80">
      <h3 className="font-bold text-lg mb-4">Détails de la progression</h3>
      <div className="space-y-3">
        {sections.map(section => (
          <div key={section.key}>
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-semibold text-sm">{section.label}</h4>
              <span className="text-xs font-bold text-primary">{progressionMetadata[section.key] || 0}%</span>
            </div>
            <Progress value={progressionMetadata[section.key] || 0} />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4">Un profil complet est la clé pour attirer les recruteurs.</p>
      <Button onClick={startEditing} className="w-full mt-4 gap-2">
        <Edit3 className="w-4 h-4" />
        Compléter le profil
      </Button>
    </div>
  );
};

export const ProfileProgressBadge = ({ profileData, startEditing }: ProfileProgressBadgeProps) => {
  const { progression, progression_metadata } = calculateProfileProgression(profileData);
  const message = getContextualMessage(progression);
  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progression / 100) * circumference;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex flex-col items-center gap-2 cursor-pointer group">
          <div className="relative w-20 h-20 md:w-24 md:h-24">
            <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
              <circle className="text-muted/20" stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
              <circle
                className="text-primary transition-all duration-500 ease-in-out group-hover:text-primary/80"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size/2} ${size/2})`}
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary transition-all duration-500 group-hover:scale-110">{progression}%</span>
            </div>
          </div>
          <p className="text-sm font-medium text-center text-foreground">{message}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="center" className="w-auto p-0 border-0">
        <CompletionDetails progressionMetadata={progression_metadata} startEditing={startEditing} />
      </PopoverContent>
    </Popover>
  );
};
