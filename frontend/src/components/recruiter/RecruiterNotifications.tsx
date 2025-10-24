import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bell, Save, Edit3, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
  type: 'acceptance' | 'rejection' | 'interview';
}

const RecruiterNotifications = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Candidature acceptée',
      subject: 'Félicitations ! Votre candidature a été retenue',
      message: `Bonjour {{nom}},

Nous avons le plaisir de vous informer que votre candidature pour le poste de {{poste}} chez {{entreprise}} a été retenue.

Nous souhaitons vous rencontrer pour un entretien. Nous vous contacterons prochainement pour convenir d'un rendez-vous.

Cordialement,
L'équipe de recrutement`,
      type: 'acceptance'
    },
    {
      id: '2',
      name: 'Candidature refusée',
      subject: 'Concernant votre candidature',
      message: `Bonjour {{nom}},

Nous vous remercions pour l'intérêt que vous portez à notre entreprise et pour le temps consacré à votre candidature pour le poste de {{poste}}.

Après étude attentive de votre profil, nous avons le regret de vous informer que nous ne pouvons pas donner suite à votre candidature pour ce poste.

Nous conservons votre CV dans notre base de données et n'hésiterons pas à vous recontacter si un poste correspondant à votre profil se présentait.

Cordialement,
L'équipe de recrutement`,
      type: 'rejection'
    },
    {
      id: '3',
      name: 'Invitation entretien',
      subject: 'Invitation à un entretien - {{poste}}',
      message: `Bonjour {{nom}},

Suite à votre candidature pour le poste de {{poste}}, nous souhaitons vous rencontrer pour un entretien.

Nous vous proposons un rendez-vous le {{date}} à {{heure}} dans nos locaux situés à {{adresse}}.

Merci de confirmer votre présence en répondant à ce message.

Cordialement,
L'équipe de recrutement`,
      type: 'interview'
    }
  ]);

  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);

  const handleSave = () => {
    if (editingTemplate) {
      setTemplates(prev => 
        prev.map(template => 
          template.id === editingTemplate.id ? editingTemplate : template
        )
      );
      setEditingTemplate(null);
    }
    setIsEditing(false);
    toast({
      title: "Notifications sauvegardées",
      description: "Les modèles de notifications ont été mis à jour.",
    });
  };

  const handleEdit = (template: NotificationTemplate) => {
    setEditingTemplate({ ...template });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditingTemplate(null);
    setIsEditing(false);
  };

  const addNewTemplate = () => {
    const newTemplate: NotificationTemplate = {
      id: Date.now().toString(),
      name: 'Nouveau modèle',
      subject: '',
      message: '',
      type: 'acceptance'
    };
    setTemplates(prev => [...prev, newTemplate]);
    setEditingTemplate(newTemplate);
    setIsEditing(true);
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(template => template.id !== templateId));
    toast({
      title: "Modèle supprimé",
      description: "Le modèle de notification a été supprimé.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Gestion des Notifications</h1>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Sauvegarder
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Annuler
              </Button>
            </>
          ) : (
            <Button onClick={addNewTemplate} className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau modèle
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-muted-foreground capitalize">
                    Type: {template.type === 'acceptance' ? 'Acceptation' : 
                           template.type === 'rejection' ? 'Refus' : 'Entretien'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(template)}
                    disabled={isEditing}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteTemplate(template.id)}
                    disabled={isEditing}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {isEditing && editingTemplate?.id === template.id ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom du modèle</Label>
                    <Input
                      id="name"
                      value={editingTemplate.name}
                      onChange={(e) => setEditingTemplate({
                        ...editingTemplate,
                        name: e.target.value
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      value={editingTemplate.subject}
                      onChange={(e) => setEditingTemplate({
                        ...editingTemplate,
                        subject: e.target.value
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={editingTemplate.message}
                      onChange={(e) => setEditingTemplate({
                        ...editingTemplate,
                        message: e.target.value
                      })}
                      className="min-h-[200px]"
                    />
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Variables disponibles :</p>
                    <div className="flex flex-wrap gap-2">
                      <code className="bg-muted px-2 py-1 rounded">{'{{nom}}'}</code>
                      <code className="bg-muted px-2 py-1 rounded">{'{{poste}}'}</code>
                      <code className="bg-muted px-2 py-1 rounded">{'{{entreprise}}'}</code>
                      <code className="bg-muted px-2 py-1 rounded">{'{{date}}'}</code>
                      <code className="bg-muted px-2 py-1 rounded">{'{{heure}}'}</code>
                      <code className="bg-muted px-2 py-1 rounded">{'{{adresse}}'}</code>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sujet :</p>
                    <p className="font-medium">{template.subject}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Message :</p>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap font-sans">
                        {template.message}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecruiterNotifications;