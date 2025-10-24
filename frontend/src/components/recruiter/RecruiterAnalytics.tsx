import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Briefcase, UserCheck, Clock } from 'lucide-react';
import { mockAnalytics } from '@/data/mockData';

const RecruiterAnalytics = () => {
  const analytics = mockAnalytics.recruiter;

  const stats = [
    {
      title: 'Offres actives',
      value: analytics.activeOffers,
      icon: Briefcase,
      color: 'text-blue-500',
      trend: '+2 ce mois'
    },
    {
      title: 'Total candidatures',
      value: analytics.totalApplications,
      icon: Users,
      color: 'text-green-500',
      trend: '+15 cette semaine'
    },

    {
      title: 'Entretiens planifiés',
      value: analytics.interviews,
      icon: Clock,
      color: 'text-orange-500',
      trend: '+3 cette semaine'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Analytiques Recrutement</h1>
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

      {/* Performance des offres */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Taux de conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Candidatures → Présélection</span>
                <span className="font-semibold">18%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '18%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Présélection → Entretien</span>
                <span className="font-semibold">65%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Entretien → Embauche</span>
                <span className="font-semibold">27%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '27%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Matching moyen des candidatures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{analytics.averageMatchingScore}%</p>
              <p className="text-muted-foreground mt-2">Score de compatibilité moyen</p>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  +5% par rapport au mois dernier
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offres les plus performantes */}
      <Card>
        <CardHeader>
          <CardTitle>Offres les plus attractives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: 'Développeur Frontend React', applications: 45, views: 234 },
              { title: 'Développeur Full Stack', applications: 38, views: 198 },
              { title: 'Data Scientist Junior', applications: 29, views: 156 }
            ].map((offer, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{offer.title}</h4>
                  <p className="text-sm text-muted-foreground">{offer.views} vues</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{offer.applications}</p>
                  <p className="text-sm text-muted-foreground">candidatures</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterAnalytics;