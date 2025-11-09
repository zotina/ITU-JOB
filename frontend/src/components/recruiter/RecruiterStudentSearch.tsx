import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Briefcase, Star, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '@/data/mockData';
import { getStudentProfile } from '@/data/mockData';
import { ProfileData } from '@/hooks/useProfileData';

const RecruiterStudentSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Obtenir les données des étudiants depuis les profils complets
  const allStudents = useMemo(() => {
    // Pour chaque utilisateur étudiant, récupérer les informations pertinentes
    const studentUsers = mockUsers.filter(user => user.type === 'student');
    
    return studentUsers.map(user => {
      // Récupérer le profil complet de l'étudiant
      const fullProfile = getStudentProfile();

      // Extraire les compétences techniques avec vérification de nullité
      const allSkills = fullProfile.technicalSkills ? fullProfile.technicalSkills.flatMap(category => 
        category.skills.map(skill => skill.name)
      ) : [];

      // Extraire les langues avec vérification de nullité
      const languages = fullProfile.languages ? fullProfile.languages.map(lang => lang.name) : [];

      // Extraire les projets avec vérification de nullité
      const projects = fullProfile.projects ? fullProfile.projects.map(project => project.title) : [];

      // Extraire les expériences avec vérification de nullité
      const experiences = fullProfile.experiences ? fullProfile.experiences.map(exp => exp.title) : [];

      // Extraire les formations (pour le niveau d'études) avec vérification de nullité
      const formations = fullProfile.formations || [];

      return {
        id: user.id,
        name: fullProfile.personalInfo.name,
        email: user.email,
        title: fullProfile.personalInfo.title || 'N/A',
        level: formations.length > 0 ? formations[0].degree : 'N/A',
        skills: allSkills,
        availability: fullProfile.personalInfo.availability || 'N/A',
        location: fullProfile.personalInfo.location || 'N/A',
        matchScore: Math.floor(Math.random() * 40) + 60, // Score aléatoire entre 60 et 100 pour la démo
        avatar: fullProfile.personalInfo.profileImage,
        description: fullProfile.personalInfo.description || 'Aucune description disponible',
        languages: languages,
        projects: projects,
        experiences: experiences,
        formations: formations,
      };
    });
  }, []);

  // Filtrer les étudiants
  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      // Recherche textuelle
      const matchesSearch = searchTerm === '' ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        student.experiences.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase())) ||
        student.projects.some(project => project.toLowerCase().includes(searchTerm.toLowerCase())) ||
        student.formations.some(formation => formation.degree.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtre par compétence
      const matchesSkill = skillFilter === 'all' ||
        student.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));

      // Filtre par disponibilité
      const matchesAvailability = availabilityFilter === 'all' ||
        student.availability.toLowerCase().includes(availabilityFilter.toLowerCase());

      // Filtre par niveau d'études
      const matchesLevel = levelFilter === 'all' ||
        student.level.toLowerCase().includes(levelFilter.toLowerCase()) ||
        (levelFilter === 'licence' && student.level.toLowerCase().includes('licence')) ||
        (levelFilter === 'master' && student.level.toLowerCase().includes('master')) ||
        (levelFilter === 'doctorat' && student.level.toLowerCase().includes('doctorat'));

      // Filtre par localisation
      const matchesLocation = locationFilter === 'all' ||
        student.location.toLowerCase().includes(locationFilter.toLowerCase());

      return matchesSearch && matchesSkill && matchesAvailability && matchesLevel && matchesLocation;
    });
  }, [allStudents, searchTerm, skillFilter, availabilityFilter, levelFilter, locationFilter]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Moteur de recherche étudiants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchInput
            placeholder="Rechercher par nom, compétence, ou diplôme..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Compétences" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les compétences</SelectItem>
                {Array.from(new Set(allStudents.flatMap(s => s.skills))).slice(0, 10).map(skill => (
                  <SelectItem key={skill} value={skill.toLowerCase()}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Disponibilité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les disponibilités</SelectItem>
                <SelectItem value="disponible">Disponible immédiatement</SelectItem>
                <SelectItem value="1month">Dans 1 mois</SelectItem>
                <SelectItem value="3months">Dans 3 mois</SelectItem>
              </SelectContent>
            </Select>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Niveau d'études" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="licence">Licence</SelectItem>
                <SelectItem value="master">Master</SelectItem>
                <SelectItem value="doctorat">Doctorat</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Localisation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les localisations</SelectItem>
                {Array.from(new Set(allStudents.map(s => s.location))).map(location => (
                  <SelectItem key={location} value={location.toLowerCase()}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.level}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{student.matchScore}% match</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {student.skills.slice(0, 5).map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                    {student.skills.length > 5 && (
                      <Badge variant="secondary">+{student.skills.length - 5}</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{student.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{student.availability}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/recruiter/student-profile/${student.id}`)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Voir profil
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecruiterStudentSearch;
