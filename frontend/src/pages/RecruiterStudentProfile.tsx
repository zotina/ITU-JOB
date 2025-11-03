import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, MapPin, Phone, Globe, Building, Calendar, User, GraduationCap, Code, Volume2, Briefcase } from 'lucide-react';
import { getStudentProfile, mockUsers } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

const RecruiterStudentProfile = () => {
  const { id } = useParams();
  const profile = getStudentProfile(); 
  const { toast } = useToast();

  // Fonction pour contacter l'étudiant (simulée)
  const handleContact = () => {
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé à l'étudiant.",
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* En-tête du profil */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {profile.personalInfo.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold">{profile.personalInfo.name}</h1>
            <p className="text-xl text-muted-foreground mt-1">{profile.personalInfo.title}</p>
            <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-4 h-4" />
              {profile.personalInfo.location}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleContact}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Contacter
            </button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne gauche - Informations personnelles et contact */}
        <div className="space-y-6 lg:col-span-1">
          {/* Informations de contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations de contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{profile.personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{profile.personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{profile.personalInfo.location}</span>
              </div>
              {profile.personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={profile.personalInfo.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    LinkedIn
                  </a>
                </div>
              )}
              {profile.personalInfo.github && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={profile.personalInfo.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    GitHub
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Disponibilité */}
          <Card>
            <CardHeader>
              <CardTitle>Disponibilité</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{profile.personalInfo.availability}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-full ${profile.personalInfo.remoteWork ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>{profile.personalInfo.remoteWork ? 'Travail à distance possible' : 'Présentiel uniquement'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne centrale - Compétences et expériences */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>À propos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{profile.personalInfo.description}</p>
            </CardContent>
          </Card>

          {/* Compétences techniques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Compétences techniques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {profile.technicalSkills.map((skillCategory, index) => (
                  <div key={index}>
                    <h4 className="font-semibold mb-2">{skillCategory.title}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillCategory.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline">
                          {skill.name} - {skill.level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Langues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Langues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((language, index) => (
                  <Badge key={index} variant="outline">
                    {language.name} - {language.level}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expériences professionnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Expériences professionnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.experiences.map((experience, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{experience.title}</h4>
                    <span className="text-sm text-muted-foreground">{experience.period}</span>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <Building className="w-4 h-4" />
                    {experience.company} • {experience.location}
                  </p>
                  <p className="text-sm mt-2">{experience.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {experience.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Formations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Formations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.formations.map((formation, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{formation.degree}</h4>
                      <p className="text-muted-foreground">{formation.institution}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{formation.period}</span>
                  </div>
                  {formation.fieldOfStudy && (
                    <p className="mt-1 text-sm">{formation.fieldOfStudy}</p>
                  )}
                  {formation.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{formation.description}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecruiterStudentProfile;