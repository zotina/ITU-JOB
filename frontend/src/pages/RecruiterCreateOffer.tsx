import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { useAuth } from '@/hooks/useAuth';
import { dataProvider } from '@/data/dataProvider';
import { JobOffer } from '@/services/firebaseService';

const RecruiterCreateOffer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [anonymousPost, setAnonymousPost] = useState(false);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]); // For main requirements
  const [newRequirement, setNewRequirement] = useState('');
  const [niceToHave, setNiceToHave] = useState<string[]>([]); // For nice to have requirements
  const [newNiceToHave, setNewNiceToHave] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]); // For benefits
  const [newBenefit, setNewBenefit] = useState('');
  const [experience, setExperience] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les valeurs pré-remplies depuis les paramètres de l'URL
  useEffect(() => {
    const prefilledTitle = searchParams.get('title');
    const prefilledType = searchParams.get('type');
    const prefilledLocation = searchParams.get('location');
    const prefilledDescription = searchParams.get('description');
    const prefilledTechnologies = searchParams.get('technologies');
    const prefilledRequirements = searchParams.get('requirements');
    const prefilledNiceToHave = searchParams.get('niceToHave');
    const prefilledBenefits = searchParams.get('benefits');
    const prefilledExperience = searchParams.get('experience');
    const prefilledSalary = searchParams.get('salary');

    if (prefilledTitle) setTitle(prefilledTitle);
    if (prefilledType) setType(prefilledType);
    if (prefilledLocation) setLocation(prefilledLocation);
    if (prefilledDescription) setDescription(prefilledDescription);
    if (prefilledTechnologies) setTechnologies(prefilledTechnologies.split(',').map(t => t.trim()).filter(t => t));
    if (prefilledRequirements) setRequirements(prefilledRequirements.split(',').map(r => r.trim()).filter(r => r));
    if (prefilledNiceToHave) setNiceToHave(prefilledNiceToHave.split(',').map(n => n.trim()).filter(n => n));
    if (prefilledBenefits) setBenefits(prefilledBenefits.split(',').map(b => b.trim()).filter(b => b));
    if (prefilledExperience) setExperience(prefilledExperience);
    
    // Gérer le salaire qui peut être au format "min - max" ou un seul chiffre
    if (prefilledSalary) {
      const salaryMatch = prefilledSalary.match(/(\d+)(?:\s*[-–]\s*(\d+))?/);
      if (salaryMatch) {
        const [, min, max] = salaryMatch;
        if (min) setSalaryMin(min);
        if (max) setSalaryMax(max);
      } else {
        // Si le salaire n'est pas dans un format numérique, on le met dans le champ min
        setSalaryMin(prefilledSalary);
      }
    }
  }, [searchParams]);

  const handleAddTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      setTechnologies([...technologies, newTech.trim()]);
      setNewTech('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (req: string) => {
    setRequirements(requirements.filter(r => r !== req));
  };

  const handleAddNiceToHave = () => {
    if (newNiceToHave.trim() && !niceToHave.includes(newNiceToHave.trim())) {
      setNiceToHave([...niceToHave, newNiceToHave.trim()]);
      setNewNiceToHave('');
    }
  };

  const handleRemoveNiceToHave = (item: string) => {
    setNiceToHave(niceToHave.filter(i => i !== item));
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (benefit: string) => {
    setBenefits(benefits.filter(b => b !== benefit));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vous devez être connecté pour créer une offre');
      return;
    }
    
    if (!title || !type || !location || !description) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get recruiter's company information
      const recruiterProfile = await dataProvider.getUserProfile(user.id);
      const companyName = recruiterProfile?.company?.name || recruiterProfile?.companyName || company;
      const recruiterId = user.id;
      
      // Format salary
      const salary = salaryMin && salaryMax 
        ? `${salaryMin} - ${salaryMax} MGA`
        : salaryMin 
          ? `${salaryMin} MGA`
          : 'Non spécifié';
      
      // Create the offer object
      const newOffer: Omit<JobOffer, 'id' | 'matchingScore' | 'nbCandidatures'> = {
        title,
        company: companyName,
        location,
        salary,
        type,
        technologies,
        description,
        status: 'active',
        postedDate: new Date().toISOString().split('T')[0],
        deadline,
        requirements: [...requirements, ...(experience ? [experience] : [])], // Combine requirements and experience
        niceToHave,
        benefits
      };
      
      // Add to Firestore using the dataProvider
      await dataProvider.createOffer(newOffer, user.id);
      toast.success('Offre créée avec succès !');
      navigate('/recruiter/offers');
    } catch (error) {
      console.error('Error creating offer:', error);
      toast.error('Erreur lors de la création de l\'offre');
    } finally {
      setIsSubmitting(false);
    }
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required={!anonymousPost}
                />
              </div>
            )}

            {/* Type de contrat */}
            <div className="space-y-2">
              <Label htmlFor="type">Type de contrat *</Label>
              <Select value={type} onValueChange={setType} required>
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  // placeholder="Ex: 35000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">Salaire maximum</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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

            {/* Exigences principales */}
            <div className="space-y-2">
              <Label>Exigences principales</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter une exigence"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRequirement();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddRequirement}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {requirements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {requirements.map((req) => (
                    <Badge key={req} variant="secondary" className="gap-1">
                      {req}
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(req)}
                        className="ml-1 hover:bg-muted rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Souhaits (Nice to have) */}
            <div className="space-y-2">
              <Label>Souhaits (Nice to have)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter un souhait"
                  value={newNiceToHave}
                  onChange={(e) => setNewNiceToHave(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNiceToHave();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddNiceToHave}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {niceToHave.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {niceToHave.map((item) => (
                    <Badge key={item} variant="outline" className="gap-1">
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveNiceToHave(item)}
                        className="ml-1 hover:bg-muted rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Avantages */}
            <div className="space-y-2">
              <Label>Avantages</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter un avantage"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddBenefit();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddBenefit}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {benefits.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {benefits.map((benefit) => (
                    <Badge key={benefit} variant="secondary" className="gap-1">
                      {benefit}
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(benefit)}
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
              <Select value={experience} onValueChange={setExperience}>
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
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Création en cours...</span>
                  </>
                ) : (
                  'Publier l\'offre'
                )}
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