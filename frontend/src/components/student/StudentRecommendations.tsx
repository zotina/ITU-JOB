import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Target, Lightbulb, Star, ArrowRight, Briefcase } from 'lucide-react';

const StudentRecommendations = () => {
  const profileImprovements = [
    {
      title: 'Ajoutez des compétences en demande',
      description: 'Docker et Kubernetes sont recherchés dans 45% des offres qui correspondent à votre profil',
      impact: '+15% matching',
      priority: 'high',
      icon: TrendingUp,
    },
    {
      title: 'Complétez votre section projets',
      description: 'Les profils avec des projets GitHub obtiennent 3x plus de réponses',
      impact: '+30% visibilité',
      priority: 'high',
      icon: Star,
    },
    {
      title: 'Ajoutez des certifications',
      description: 'AWS Certified ou Google Cloud certifications valorisent votre profil',
      impact: '+10% matching',
      priority: 'medium',
      icon: Target,
    },
    {
      title: 'Mettez à jour votre photo de profil',
      description: 'Les profils avec photo professionnelle reçoivent 2x plus de vues',
      impact: '+20% engagement',
      priority: 'medium',
      icon: Lightbulb,
    },
  ];

  const jobRecommendations = [
    {
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'Casablanca, Maroc',
      match: 92,
      salary: '150k - 180k MAD',
      reason: 'Correspond parfaitement à vos compétences React et TypeScript',
      tags: ['React', 'TypeScript', 'Remote'],
    },
    {
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Rabat, Maroc',
      match: 88,
      salary: '140k - 170k MAD',
      reason: 'Votre expérience en Node.js est très demandée',
      tags: ['Node.js', 'React', 'MongoDB'],
    },
    {
      title: 'DevOps Engineer',
      company: 'CloudSolutions',
      location: 'Remote',
      match: 85,
      salary: '160k - 190k MAD',
      reason: 'Vos compétences en CI/CD sont valorisées',
      tags: ['Docker', 'Kubernetes', 'AWS'],
    },
  ];

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
      {/* Recommandations IA pour amélioration du profil */}
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

          {profileImprovements.map((improvement, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${getPriorityColor(improvement.priority)}`}>
                  <improvement.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{improvement.title}</h4>
                    <Badge className="bg-green-500 text-white">{improvement.impact}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {improvement.description}
                  </p>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Appliquer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommandations de postes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Postes recommandés pour vous
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ces offres correspondent particulièrement bien à votre profil
          </p>

          {jobRecommendations.map((job, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
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
                  <Button size="sm" className="gap-2">
                    Voir l'offre
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentRecommendations;
