import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/search-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Briefcase, Star, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockUsers, mockCandidates } from '@/data/mockData';

const RecruiterStudentSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Obtenir les données des étudiants depuis les données des candidats
  const allStudents = useMemo(() => {
    // Pour chaque utilisateur étudiant, récupérer les informations pertinentes
    const studentUsers = mockUsers.filter(user => user.type === 'student');
    
    return studentUsers.map(user => {
      // Trouver le candidat correspondant dans mockCandidates
      const candidate = mockCandidates.find(c => c.id === user.id) || mockCandidates[0]; // fallback to first if not found
      
      return {
        id: user.id,
        name: candidate?.name || user.name || 'Utilisateur Anonyme',
        email: user.email,
        title: candidate?.title || 'N/A',
        level: candidate?.experience + ' d\'experiences'|| 'N/A',
        skills: candidate?.skills || [],
        availability: candidate?.availability || 'N/A',
        location: candidate?.location || 'N/A',
        matchScore: candidate?.matchingScore || Math.floor(Math.random() * 40) + 60,
        avatar: '',
        description: `Candidat avec ${candidate?.experience || 'expérience'} en ${candidate?.title || 'domaine'}`,
        languages: [],
        projects: [],
        experiences: [],
        formations: [],
      };
    });
  }, []);

  // Filtrer les étudiants avec recherche intelligente en langage naturel
  const filteredStudents = useMemo(() => {
    if (searchQuery === '') {
      return allStudents;
    }

    const query = searchQuery.toLowerCase();
    const searchTerms = query.split(' ').filter(term => term.length > 2);

    return allStudents.filter(student => {
      // Recherche dans tous les champs pertinents
      const searchableContent = [
        student.name,
        student.title,
        student.level,
        student.location,
        student.availability,
        student.description,
        ...student.skills,
        ...student.languages,
        ...student.projects,
        ...student.experiences,
        ...student.formations.map(f => `${f.degree} ${f.field} ${f.institution}`)
      ].join(' ').toLowerCase();

      // Vérifier si tous les termes de recherche sont présents
      return searchTerms.every(term => searchableContent.includes(term));
    });
  }, [allStudents, searchQuery]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Moteur de recherche étudiants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <SearchInput
              placeholder="Recherche en langage naturel : ex. 'développeur React Paris disponible immédiatement' ou 'master intelligence artificielle Python'"
              value={searchQuery}
              onChange={setSearchQuery}
              className="text-base"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Aucun étudiant ne correspond à votre recherche. Essayez avec d'autres critères.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {filteredStudents.length} étudiant{filteredStudents.length > 1 ? 's' : ''} trouvé{filteredStudents.length > 1 ? 's' : ''}
            </p>
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
                            <p className="text-sm text-muted-foreground">{student.title} , {student.level}</p>
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
          </>
        )}
      </div>
    </div>
  );
};

export default RecruiterStudentSearch;