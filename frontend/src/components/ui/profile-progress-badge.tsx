
import { ProfileData } from "@/hooks/useProfileData";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";

interface ProfileProgressBadgeProps {
  profileData: ProfileData;
  startEditing: () => void;
}

const calculateCompletion = (profileData: ProfileData): number => {
  let score = 0;
  const weights = {
    personalInfo: 40,
    technicalSkills: 15,
    languages: 10,
    softSkills: 10,
    projects: 10,
    experiences: 15,
  };

  const personalInfoFields = [
    "name", "title", "description", "email", "phone", 
    "location", "linkedin", "availability", "profileImage"
  ];
  let personalInfoScore = 0;
  personalInfoFields.forEach(field => {
    if (profileData.personalInfo[field as keyof typeof profileData.personalInfo]) {
      personalInfoScore += 1;
    }
  });
  score += (personalInfoScore / personalInfoFields.length) * weights.personalInfo;

  if (profileData.technicalSkills && profileData.technicalSkills.length > 0 && profileData.technicalSkills.some(s => s.skills.length > 0)) {
    score += weights.technicalSkills;
  }

  if (profileData.languages && profileData.languages.length > 0) {
    score += weights.languages;
  }

  if (profileData.softSkills && profileData.softSkills.length > 0) {
    score += weights.softSkills;
  }

  if (profileData.projects && profileData.projects.length > 0) {
    score += weights.projects;
  }

  if (profileData.experiences && profileData.experiences.length > 0) {
    score += weights.experiences;
  }

  return Math.round(score);
};

const getContextualMessage = (percentage: number): string => {
  if (percentage < 50) return "Boostez votre visibilité !";
  if (percentage <= 80) return "Presque parfait !";
  if (percentage <= 95) return "Excellent profil !";
  return "Profil exceptionnel !";
};

const CompletionDetails = ({ profileData, startEditing }: { profileData: ProfileData, startEditing: () => void }) => {
  const personalInfoFields = [
    "name", "title", "description", "email", "phone", 
    "location", "linkedin", "availability", "profileImage"
  ];
  const personalInfoCompletion = Math.round(
    (Object.values(profileData.personalInfo).filter(value => !!value).length / personalInfoFields.length) * 100
  );

  const technicalSkillsCompletion = (profileData.technicalSkills && profileData.technicalSkills.length > 0 && profileData.technicalSkills.some(s => s.skills.length > 0)) ? 100 : 0;
  const languagesCompletion = (profileData.languages && profileData.languages.length > 0) ? 100 : 0;
  const softSkillsCompletion = (profileData.softSkills && profileData.softSkills.length > 0) ? 100 : 0;
  const projectsCompletion = (profileData.projects && profileData.projects.length > 0) ? 100 : 0;
  const experiencesCompletion = (profileData.experiences && profileData.experiences.length > 0) ? 100 : 0;

  return (
    <div className="p-4 bg-card text-foreground rounded-lg shadow-xl border w-80">
      <h3 className="font-bold text-lg mb-4">Détails de la progression</h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-sm">Informations personnelles</h4>
            <span className="text-xs font-bold text-primary">{personalInfoCompletion}%</span>
          </div>
          <Progress value={personalInfoCompletion} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-sm">Compétences techniques</h4>
            <span className="text-xs font-bold text-primary">{technicalSkillsCompletion}%</span>
          </div>
          <Progress value={technicalSkillsCompletion} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-sm">Langues</h4>
            <span className="text-xs font-bold text-primary">{languagesCompletion}%</span>
          </div>
          <Progress value={languagesCompletion} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-sm">Soft Skills</h4>
            <span className="text-xs font-bold text-primary">{softSkillsCompletion}%</span>
          </div>
          <Progress value={softSkillsCompletion} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-sm">Projets</h4>
            <span className="text-xs font-bold text-primary">{projectsCompletion}%</span>
          </div>
          <Progress value={projectsCompletion} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-sm">Expériences</h4>
            <span className="text-xs font-bold text-primary">{experiencesCompletion}%</span>
          </div>
          <Progress value={experiencesCompletion} />
        </div>
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
  const completionPercentage = calculateCompletion(profileData);
  const message = getContextualMessage(completionPercentage);
  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completionPercentage / 100) * circumference;

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
              <span className="text-2xl font-bold text-primary transition-all duration-500 group-hover:scale-110">{completionPercentage}%</span>
            </div>
          </div>
          <p className="text-sm font-medium text-center text-foreground">{message}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="center" className="w-auto p-0 border-0">
        <CompletionDetails profileData={profileData} startEditing={startEditing} />
      </PopoverContent>
    </Popover>
  );
};
