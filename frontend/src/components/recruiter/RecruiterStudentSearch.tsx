import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/search-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Briefcase, Star, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecruiterStudentSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  const mockStudents = [
    {
      id: 1,
      name: 'Marie Dubois',
      level: 'Licence 3',
      skills: ['React', 'TypeScript', 'Node.js'],
      availability: 'Disponible immédiatement',
      location: 'Paris',
      matchScore: 95,
      avatar: '',
    },
    {
      id: 2,
      name: 'Thomas Martin',
      level: 'Master 1',
      skills: ['Python', 'Django', 'PostgreSQL'],
      availability: 'Disponible en juin',
      location: 'Lyon',
      matchScore: 88,
      avatar: '',
    },
    {
      id: 3,
      name: 'Sophie Bernard',
      level: 'Master 2',
      skills: ['Angular', 'Java', 'Spring Boot'],
      availability: 'Disponible immédiatement',
      location: 'Marseille',
      matchScore: 92,
      avatar: '',
    },
  ];

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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Compétences" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les compétences</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
              </SelectContent>
            </Select>

            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Disponibilité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les disponibilités</SelectItem>
                <SelectItem value="immediate">Immédiat</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {mockStudents.map((student) => (
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
                    {student.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
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
                    <Button size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Contacter
                    </Button>
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
