import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import logoItu from '@/assets/logo-itu.png';

const RecruiterRegistrationPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-bg p-4">
      <Card className="mx-auto max-w-lg w-full bg-white shadow-md border-0">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={logoItu} 
              alt="ITUniversity Logo" 
              className="h-16 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-text">Inscription Recruteur</CardTitle>
          <CardDescription>
            Créez votre compte recruteur pour trouver les meilleurs talents de l'ITU.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Nom de l'entreprise</Label>
              <Input id="company-name" placeholder="Tech Innovators Inc." required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@tech-innovators.com"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Site web de l'entreprise (optionnel)</Label>
              <Input id="website" placeholder="https://tech-innovators.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="industry">Secteur d'activité</Label>
                    <Input id="industry" placeholder="Ex: ESN, Fintech, Gaming" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="company-size">Taille de l'entreprise</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une taille" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1-10">1-10 employés</SelectItem>
                            <SelectItem value="11-50">11-50 employés</SelectItem>
                            <SelectItem value="51-200">51-200 employés</SelectItem>
                            <SelectItem value="201-500">201-500 employés</SelectItem>
                            <SelectItem value="500+">500+ employés</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex items-center space-x-2 mt-4">
                <Checkbox id="terms" />
                <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    J'accepte les <a href="#" className="text-primary underline">conditions d'utilisation</a> et la <a href="#" className="text-primary underline">politique de confidentialité</a>.
                </label>
            </div>
            <Button type="submit" className="w-full mt-4 bg-[#3F8BDB] hover:bg-[#2c70b8]">
              Créer mon compte recruteur
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Vous avez déjà un compte?{" "}
            <Link to="/login" className="underline text-[#3F8BDB] hover:text-[#2c70b8]">
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RecruiterRegistrationPage;
