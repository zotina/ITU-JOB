import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Target, Lightbulb, Star, ArrowRight, Briefcase, Brain, Globe, Code, GraduationCap, GitBranch, Cloud } from 'lucide-react';
import { addApplication } from '@/data/applicationStore';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProfileData } from '@/hooks/useProfileData';
import { AIRecommendationsService, ProfileImprovement, JobRecommendation, MarketTrend } from '@/services/aiRecommendationsService';
import { useAuth } from '@/hooks/useAuth';

// Map icon names to actual icon components
const getIconComponent = (iconName: string) => {
  switch(iconName.toLowerCase()) {
    case 'trendingup':
      return TrendingUp;
    case 'globe':
      return Globe;
    case 'briefcase':
      return Briefcase;
    case 'code':
      return Code;
    case 'graduationcap':
      return GraduationCap;
    case 'gitbranch':
      return GitBranch;
    case 'cloud':
      return Cloud;
    case 'brain':
      return Brain;
    default:
      return Star;
  }
};

const StudentRecommendations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profileData } = useProfileData();
  const { user } = useAuth();
  const [loading, setLoading] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load or generate AI recommendations
  useEffect(() => {
    const loadRecommendations = async () => {
      if (!user) {
        setError('Utilisateur non authentifié');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to load existing recommendations from Firestore
        let aiRecs = await AIRecommendationsService.loadRecommendations(user.id);
        
        // If no recommendations exist, generate new ones
        if (!aiRecs) {
          aiRecs = await AIRecommendationsService.generateAndSaveRecommendations(
            user.id, 
            profileData
          );
          toast({
            title: "Nouvelles recommandations générées",
            description: "Vos recommandations AI ont été mises à jour.",
          });
        } else {
          // Check if recommendations are outdated (older than 24 hours)
          // Handle both string and Date formats for lastUpdated
          const lastUpdatedValue = typeof aiRecs.lastUpdated === 'string' ? 
            new Date(aiRecs.lastUpdated) : 
            aiRecs.lastUpdated instanceof Date ? 
              aiRecs.lastUpdated : 
              new Date();
              
          const now = new Date();
          const hoursDiff = (now.getTime() - lastUpdatedValue.getTime()) / (1000 * 60 * 60);
          
          if (hoursDiff > 24) {
            // Regenerate recommendations if they're older than 24 hours
            aiRecs = await AIRecommendationsService.generateAndSaveRecommendations(
              user.id, 
              profileData
            );
            toast({
              title: "Recommandations actualisées",
              description: "Vos recommandations AI ont été actualisées avec les dernières tendances.",
            });
          }
        }
        
        setRecommendations(aiRecs);
      } catch (err) {
        console.error('Error loading AI recommendations:', err);
        setError('Erreur lors du chargement des recommandations. Veuillez réessayer.');
        toast({
          title: "Erreur",
          description: "Impossible de charger les recommandations. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [user, profileData, toast]);

  const handleApply = (job: JobRecommendation, index: number) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Veuillez vous connecter pour postuler.",
        variant: "destructive",
      });
      return;
    }

    setLoading(index);
    setTimeout(() => {
      addApplication({
        company: job.company,
        position: job.title,
        location: job.location,
        salary: job.salary,
        type: 'CDI',
      });
      setLoading(null);
      toast({ title: "Succès", description: "Candidature envoyée !" });
      setTimeout(() => navigate('/student/applications'), 1000);
    }, 1500);
  };

  // Function to refresh recommendations
  const refreshRecommendations = async () => {
    if (!user) {
      setError('Utilisateur non authentifié');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate and save new recommendations
      const newRecs = await AIRecommendationsService.generateAndSaveRecommendations(
        user.id, 
        profileData
      );
      
      setRecommendations(newRecs);
      toast({
        title: "Recommandations actualisées",
        description: "Vos recommandations AI ont été mises à jour avec les dernières tendances du marché.",
      });
    } catch (err) {
      console.error('Error refreshing AI recommendations:', err);
      setError('Erreur lors de l\'actualisation des recommandations. Veuillez réessayer.');
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser les recommandations. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Recommandations IA pour votre profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <Button onClick={refreshRecommendations} className="mt-4">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Recommandations IA pour votre profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aucune recommandation disponible.</p>
            <Button onClick={refreshRecommendations} className="mt-4">
              Générer des recommandations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'text-green-600 bg-green-50';
    if (match >= 80) return 'text-blue-600 bg-blue-50';
    return 'text-orange-600 bg-orange-50';
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Recommandations IA</h2>
        <Button 
          variant="outline" 
          onClick={refreshRecommendations}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Actualiser
        </Button>
      </div>

      {/* Recommendations Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Votre Profil en Chiffres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-700">
                {recommendations.jobRecommendations.length}
              </div>
              <div className="text-sm text-blue-600">Offres Recommandées</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-700">
                {recommendations.profileImprovements.length}
              </div>
              <div className="text-sm text-green-600">Suggestions d'Amélioration</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-700">
                {recommendations.marketTrends.length}
              </div>
              <div className="text-sm text-purple-600">Tendances du Marché</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations for Profile Improvement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Recommandations IA pour votre profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Basé sur l'analyse de milliers de profils réussis et des tendances du marché
          </p>

          {recommendations.profileImprovements.map((improvement: ProfileImprovement, index: number) => {
            const IconComponent = getIconComponent(improvement.icon);
            return (
              <div key={improvement.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getPriorityColor(improvement.priority)}`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{improvement.title}</h4>
                      <Badge className="bg-green-500 text-white">{improvement.impact}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {improvement.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Job Recommendations (Top 5 by matching score) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Postes recommandés pour vous
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ces offres correspondent particulièrement bien à votre profil (Top 5 par matching)
          </p>

          {recommendations.jobRecommendations.map((job: JobRecommendation, index: number) => (
            <div key={job.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">{job.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{job.company}</span>
                      <span className="text-sm text-muted-foreground">• {job.location}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full font-bold ${getMatchColor(job.match)}`}>
                    {job.match}% match
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary">{tag}</Badge>
                  ))}
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Pourquoi ce poste ?</strong> {job.reason}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium text-primary">{job.salary}</span>
                  <Button 
                    size="sm" 
                    className="gap-2" 
                    onClick={() => handleApply(job, index)} 
                    disabled={loading === index}
                  >
                    {loading === index ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {loading === index ? 'Envoi...' : 'Postuler'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Tendances du Marché
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Les tendances clés à connaître pour orienter votre carrière
          </p>

          {recommendations.marketTrends.map((trend: MarketTrend, index: number) => (
            <div key={trend.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{trend.title}</h4>
                <Badge className={`bg-${trend.impact.toLowerCase() === 'high' ? 'red' : 'yellow'}-500 text-white`}>
                  Croissance: {trend.growthRate}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {trend.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {trend.techStack.map((tech, techIndex) => (
                  <Badge key={techIndex} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentRecommendations;