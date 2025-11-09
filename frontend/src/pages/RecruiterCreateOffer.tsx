import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const RecruiterCreateOffer = () => {
  const navigate = useNavigate();
  const [anonymousPost, setAnonymousPost] = useState(false);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');

  const handleAddTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      setTechnologies([...technologies, newTech.trim()]);
      setNewTech('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Offre créée avec succès !');
    navigate('/recruiter/offers');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/recruiter/offers')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Créer une nouvelle offre</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'offre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Publication anonyme */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="anonymous" className="text-base font-medium">
                  Publication anonyme
                </Label>
                <p className="text-sm text-muted-foreground">
                  Permet aux partenaires de l'ITU de publier sans créer de compte
                </p>
              </div>
              <Switch
                id="anonymous"
                checked={anonymousPost}
                onCheckedChange={setAnonymousPost}
              />
            </div>

            {/* Titre du poste */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre du poste *</Label>
              <Input
                id="title"
                placeholder="Ex: Développeur Full Stack"
                required
              />
            </div>

            {/* Entreprise */}
            {!anonymousPost || anonymousPost!=null && (
              <div className="space-y-2">
                <Label htmlFor="company">Entreprise *</Label>
                <Input
                  id="company"
                  placeholder="Nom de l'entreprise"
                  required
                />
              </div>
            )}

            {/* Type de contrat */}
            <div className="space-y-2">
              <Label htmlFor="type">Type de contrat *</Label>
              <Select required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cdi">CDI</SelectItem>
                  <SelectItem value="cdd">CDD</SelectItem>
                  <SelectItem value="stage">Stage</SelectItem>
                  <SelectItem value="alternance">Alternance</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Localisation */}
            <div className="space-y-2">
              <Label htmlFor="location">Localisation *</Label>
              <Input
                id="location"
                placeholder="Ex: Antananarivo, Madagascar"
                required
              />
            </div>

            {/* Salaire */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Salaire minimum</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  // placeholder="Ex: 35000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">Salaire maximum</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  // placeholder="Ex: 45000"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description du poste *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez le poste, les missions, et les responsabilités..."
                rows={6}
                required
              />
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <Label>Technologies et compétences</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter une technologie"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTechnology();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTechnology}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="gap-1">
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnology(tech)}
                        className="ml-1 hover:bg-muted rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Niveau d'expérience */}
            <div className="space-y-2">
              <Label htmlFor="experience">Niveau d'expérience requis</Label>
              <Select>
                <SelectTrigger id="experience">
                  <SelectValue placeholder="Sélectionner le niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior (0-2 ans)</SelectItem>
                  <SelectItem value="intermediate">Intermédiaire (2-5 ans)</SelectItem>
                  <SelectItem value="senior">Senior (5+ ans)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date limite de candidature */}
            <div className="space-y-2">
              <Label htmlFor="deadline">Date limite de candidature</Label>
              <Input
                id="deadline"
                type="date"
              />
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Publier l'offre
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => toast.info('Offre sauvegardée en brouillon')}
              >
                Sauvegarder en brouillon
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/recruiter/offers')}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default RecruiterCreateOffer;
