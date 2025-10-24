import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Flame, Eye, Users, ArrowRight, Building2, MapPin } from 'lucide-react';

const StudentTopJobs = () => {
  const trendingJobs = [
    {
      title: 'Full Stack Developer',
      company: 'TechHub Morocco',
      location: 'Casablanca',
      views: 1250,
      applications: 89,
      salary: '120k - 150k MAD',
      trend: '+45%',
      isHot: true,
      tags: ['React', 'Node.js', 'MongoDB'],
    },
    {
      title: 'DevOps Engineer',
      company: 'CloudNative Inc',
      location: 'Rabat',
      views: 980,
      applications: 67,
      salary: '140k - 170k MAD',
      trend: '+38%',
      isHot: true,
      tags: ['Docker', 'Kubernetes', 'AWS'],
    },
    {
      title: 'Data Scientist',
      company: 'AI Solutions',
      location: 'Marrakech',
      views: 875,
      applications: 54,
      salary: '130k - 160k MAD',
      trend: '+32%',
      isHot: true,
      tags: ['Python', 'ML', 'TensorFlow'],
    },
    {
      title: 'Mobile Developer',
      company: 'AppFactory',
      location: 'Casablanca',
      views: 720,
      applications: 45,
      salary: '110k - 140k MAD',
      trend: '+28%',
      isHot: false,
      tags: ['React Native', 'iOS', 'Android'],
    },
    {
      title: 'UI/UX Designer',
      company: 'DesignStudio',
      location: 'Remote',
      views: 650,
      applications: 38,
      salary: '100k - 130k MAD',
      trend: '+25%',
      isHot: false,
      tags: ['Figma', 'UI Design', 'Prototyping'],
    },
    {
      title: 'Backend Developer',
      company: 'ServerTech',
      location: 'Tanger',
      views: 590,
      applications: 32,
      salary: '115k - 145k MAD',
      trend: '+22%',
      isHot: false,
      tags: ['Java', 'Spring Boot', 'PostgreSQL'],
    },
  ];

  const popularSkills = [
    { skill: 'React', demand: 95, jobs: 342 },
    { skill: 'Python', demand: 92, jobs: 318 },
    { skill: 'AWS', demand: 88, jobs: 287 },
    { skill: 'Docker', demand: 85, jobs: 265 },
    { skill: 'TypeScript', demand: 82, jobs: 243 },
    { skill: 'Node.js', demand: 80, jobs: 231 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Flame className="w-6 h-6 text-orange-500" />
        <h2 className="text-xl font-bold">Postes les plus recherchés</h2>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">+32%</p>
                <p className="text-sm text-muted-foreground">Offres ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12.5k</p>
                <p className="text-sm text-muted-foreground">Vues totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3.2k</p>
                <p className="text-sm text-muted-foreground">Candidatures</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des postes tendance */}
      <Card>
        <CardHeader>
          <CardTitle>Top postes de la semaine</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingJobs.map((job, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg">{job.title}</h4>
                      {job.isHot && (
                        <Badge className="bg-orange-500 text-white gap-1">
                          <Flame className="w-3 h-3" />
                          Hot
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      <span>{job.company}</span>
                      <span>•</span>
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    {job.trend}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary">{tag}</Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{job.views} vues</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{job.applications} candidatures</span>
                    </div>
                  </div>
                  <span className="font-medium text-primary">{job.salary}</span>
                </div>

                <Button className="w-full gap-2">
                  Postuler maintenant
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Compétences les plus demandées */}
      <Card>
        <CardHeader>
          <CardTitle>Compétences les plus demandées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {popularSkills.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.skill}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{item.jobs} offres</span>
                  <Badge variant="secondary">{item.demand}%</Badge>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all" 
                  style={{ width: `${item.demand}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentTopJobs;
