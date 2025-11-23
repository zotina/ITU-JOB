import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/search-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Briefcase, Star, User, Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { chatbotService } from '@/services/chatbotService';
import { useAuth } from '@/hooks/useAuth';

const RecruiterStudentSearch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInitialized, setSearchInitialized] = useState(false);

  // Effectuer la recherche d'étudiants avec le service IA
  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredStudents([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Utiliser le service de chatbot pour effectuer la recherche d'étudiants
      const result = await chatbotService.chat(
        `Recherche d'étudiants: ${searchQuery}`, 
        user?.id || '', 
        'recruteur'
      );
      
      if (result.success && result.data && result.data.etudiants) {
        setFilteredStudents(result.data.etudiants);
      } else {
        setFilteredStudents([]);
      }
    } catch (error) {
      console.error('Error searching students:', error);
      setFilteredStudents([]);
    } finally {
      setIsLoading(false);
      setSearchInitialized(true);
    }
  };

  // Gérer la soumission de la recherche (appui sur Entrée ou clic sur le bouton)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <div className="space-y-6">
     <Card>
        <CardHeader>
          <CardTitle className="text-center">Moteur de recherche étudiants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-8 py-6">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="flex items-center gap-3 w-full max-w-5xl mx-auto">
              <div className="flex-1">
                <SearchInput
                  placeholder="Recherche en langage naturel : ex. 'développeur React Antananarivo disponible immédiatement' ou 'master intelligence artificielle Python'"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="text-base w-full h-12"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="h-12 w-[140px] shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredStudents.length === 0 && searchInitialized ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Aucun étudiant ne correspond à votre recherche. Essayez avec d'autres critères.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {filteredStudents.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {filteredStudents.length} étudiant{filteredStudents.length > 1 ? 's' : ''} trouvé{filteredStudents.length > 1 ? 's' : ''} pour "{searchQuery}"
              </p>
            )}
            <div className="grid grid-cols-1 gap-4">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="hover:shadow-elegant transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.name?.split(' ').map(n => n[0]).join('') || 'US'}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">{student.title || 'Étudiant'} , {student.level || 'N/A'}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {student.skills?.slice(0, 5).map((skill: string) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                          {student.skills && student.skills.length > 5 && (
                            <Badge variant="secondary">+{student.skills.length - 5}</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{student.location || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{student.availability || 'N/A'}</span>
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