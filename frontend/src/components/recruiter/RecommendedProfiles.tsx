import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Mail, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface RecommendedProfilesProps {
  offerTitle: string;
}

const RecommendedProfiles = ({ offerTitle }: RecommendedProfilesProps) => {
  const navigate = useNavigate();
  const recommendedStudents = [
    {
      id: 1,
      name: 'Claire Dubois',
      level: 'Master 2',
      skills: ['React', 'TypeScript', 'Node.js'],
      location: 'Paris',
      matchScore: 98,
      avatar: '',
    },
    {
      id: 2,
      name: 'Lucas Martin',
      level: 'Master 1',
      skills: ['React', 'JavaScript', 'MongoDB'],
      location: 'Lyon',
      matchScore: 95,
      avatar: '',
    },
    {
      id: 3,
      name: 'Emma Bernard',
      level: 'Licence 3',
      skills: ['React', 'CSS', 'Git'],
      location: 'Toulouse',
      matchScore: 92,
      avatar: '',
    },
    {
      id: 4,
      name: 'Hugo Petit',
      level: 'Master 2',
      skills: ['React', 'Redux', 'Testing'],
      location: 'Marseille',
      matchScore: 90,
      avatar: '',
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Star className="w-4 h-4 mr-2" />
          Profils recommandés
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profils recommandés pour : {offerTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {recommendedStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">{student.level}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{student.matchScore}%</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {student.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{student.location}</span>
                    </div>
                    
                    <div className="flex gap-2 pt-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => navigate(`/recruiter/student-profile/${student.id}`)}
                      >
                        <User className="w-4 h-4 mr-1" />
                        Voir profil
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecommendedProfiles;
