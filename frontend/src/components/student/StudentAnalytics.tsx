import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Eye, FileText, CheckCircle } from 'lucide-react';
import { mockAnalytics } from '@/data/mockData';

const StudentAnalytics = () => {
  const analytics = mockAnalytics.student;

  const stats = [
    {
      title: 'Candidatures envoyées',
      value: analytics.applications,
      icon: FileText,
      color: 'text-blue-500',
      trend: '+3 cette semaine'
    },
    {
      title: 'Réponses reçues',
      value: analytics.responses,
      icon: CheckCircle,
      color: 'text-green-500',
      trend: '+2 cette semaine'
    },
    {
      title: 'Entretiens planifiés',
      value: analytics.interviews,
      icon: Users,
      color: 'text-purple-500',
      trend: '+1 cette semaine'
    },
    {
      title: 'Vues de profil',
      value: analytics.profileViews,
      icon: Eye,
      color: 'text-orange-500',
      trend: '+12 cette semaine'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Tableau de bord analytique</h1>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-xs text-green-600">{stat.trend}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>



      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations pour améliorer votre profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900">Compétences en demande</h4>
            <p className="text-sm text-blue-700 mt-1">
              Ajoutez Docker et Kubernetes à vos compétences pour augmenter votre matching de 15%
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900">Profil complet</h4>
            <p className="text-sm text-green-700 mt-1">
              Votre profil est à 92% complet. Ajoutez des certifications pour le finaliser.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAnalytics;