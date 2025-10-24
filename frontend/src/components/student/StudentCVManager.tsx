import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, FileText, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StudentCVManager = () => {
  const { toast } = useToast();
  const [selectedSector, setSelectedSector] = useState('general');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleImportCV = () => {
    // Simuler l'import
    setImportStatus('success');
    toast({
      title: "CV importé avec succès",
      description: "Votre profil a été mis à jour avec les informations de votre CV.",
    });
  };

  const handleExportCV = (sector: string) => {
    toast({
      title: "Export en cours",
      description: `Génération du CV optimisé pour le secteur ${sector}...`,
    });
    // Simuler l'export
    setTimeout(() => {
      toast({
        title: "CV exporté",
        description: "Votre CV est prêt à être téléchargé.",
      });
    }, 1500);
  };

  const sectors = [
    { value: 'general', label: 'Général' },
    { value: 'tech', label: 'Technologie' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'healthcare', label: 'Santé' },
    { value: 'education', label: 'Éducation' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold">Gestion du CV</h2>
      </div>

      {/* Import CV */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importer un CV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Importez votre CV pour remplir automatiquement votre profil avec l'IA
          </p>
          
          {importStatus === 'success' && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Import réussi</p>
                <p className="text-xs text-green-700 mt-1">
                  Votre profil a été mis à jour avec les informations suivantes : expériences, compétences, formations
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button onClick={handleImportCV} className="w-full gap-2">
              <Upload className="w-4 h-4" />
              Choisir un fichier CV (PDF, DOCX)
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Formats acceptés : PDF, DOCX - Taille max : 5 MB
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Export CV */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exporter votre profil en CV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Générez un CV professionnel à partir de votre profil
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Format standard
              </label>
              <Button onClick={() => handleExportCV('general')} variant="outline" className="w-full gap-2">
                <Download className="w-4 h-4" />
                Télécharger CV Standard (PDF)
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Export adaptatif par secteur (IA)
              </label>
              <div className="space-y-3">
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector.value} value={sector.value}>
                        {sector.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => handleExportCV(selectedSector)} 
                  className="w-full gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Générer CV optimisé pour {sectors.find(s => s.value === selectedSector)?.label}
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-medium">Export adaptatif</p>
                <p className="text-xs text-blue-700 mt-1">
                  L'IA optimise votre CV en fonction du secteur choisi : mise en avant des compétences pertinentes, 
                  ajustement du vocabulaire et restructuration du contenu.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historique des exports */}
      <Card>
        <CardHeader>
          <CardTitle>Derniers exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { date: '15 Jan 2024', type: 'Technologie', downloads: 3 },
              { date: '10 Jan 2024', type: 'Général', downloads: 5 },
              { date: '05 Jan 2024', type: 'Finance', downloads: 2 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">CV {item.type}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{item.downloads} téléchargements</Badge>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentCVManager;
