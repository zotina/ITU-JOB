import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Mail, User, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { dataProvider } from '@/data/dataProvider';
import { JobOffer } from '@/services/firebaseService';
import { AIRecommendationsService } from '@/services/aiRecommendationsService';

interface RecommendedProfilesProps {
  offerTitle: string;
  offerId?: string; // Optional offerId to fetch specific offer
}

const RecommendedProfiles = ({ offerTitle, offerId }: RecommendedProfilesProps) => {
  const navigate = useNavigate();
  const [recommendedStudents, setRecommendedStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Load recommended students when dialog is opened
  useEffect(() => {
    const loadRecommendedStudents = async () => {
      if (dialogOpen && offerId) {
        setLoading(true);
        try {
          // Get the specific offer
          const offer: JobOffer | null = await dataProvider.getOfferById(offerId);
          if (offer) {
            // Generate AI-matched recommendations for this offer
            const topStudents = await AIRecommendationsService.generateStudentRecommendationsForOffer(offer, 4);
            setRecommendedStudents(topStudents);
          } else {
            // If offer not found, use empty array
            setRecommendedStudents([]);
          }
        } catch (error) {
          console.error('Error loading recommended students:', error);
          setRecommendedStudents([]);
        } finally {
          setLoading(false);
        }
      }
    };

    loadRecommendedStudents();
  }, [dialogOpen, offerId]);

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // Reset when closing to avoid showing old data
      setRecommendedStudents([]);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
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
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : recommendedStudents.length > 0 ? (
            recommendedStudents.map((student) => (
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
                        {student.skills.slice(0, 5).map((skill: string) => ( // Show only first 5 skills
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {student.skills.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{student.skills.length - 5}
                          </Badge>
                        )}
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
            ))
          ) : !loading && recommendedStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun profil recommandé trouvé pour cette offre.</p>
              <p className="text-sm mt-1">Les profils seront analysés par l'IA pour trouver les meilleurs matchs.</p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecommendedProfiles;
