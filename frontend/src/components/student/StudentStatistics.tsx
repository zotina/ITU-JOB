import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Eye, FileText, CheckCircle } from 'lucide-react';
import { mockAnalytics } from '@/data/mockData';

const StudentStatistics = () => {
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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold">Statistiques du profil</h2>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Score de matching */}
      <Card>
        <CardHeader>
          <CardTitle>Score de matching</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Compatibilité avec les offres</span>
              <span className="text-2xl font-bold text-primary">87%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '87%' }} />
            </div>
            <p className="text-sm text-muted-foreground">
              Votre profil correspond bien aux offres disponibles dans votre secteur
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tendances */}
      <Card>
        <CardHeader>
          <CardTitle>Tendances du mois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm font-medium text-green-900">Visibilité du profil</span>
              <Badge className="bg-green-500">+45%</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-sm font-medium text-blue-900">Taux de réponse</span>
              <Badge className="bg-blue-500">+22%</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
              <span className="text-sm font-medium text-purple-900">Engagement recruteurs</span>
              <Badge className="bg-purple-500">+18%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentStatistics;
