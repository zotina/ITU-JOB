import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import logoItu from '@/assets/logo-itu.png';

const StudentRegistrationPage = () => {
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
          <CardTitle className="text-2xl font-bold text-gray-text">Inscription Étudiant</CardTitle>
          <CardDescription>
            Créez votre compte pour accéder aux opportunités de stage et d'emploi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Prénom</Label>
                <Input id="first-name" placeholder="Jean" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Nom</Label>
                <Input id="last-name" placeholder="Dupont" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email ITU</Label>
              <Input
                id="email"
                type="email"
                placeholder="jean.dupont@itu.edu"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirmer</Label>
                <Input id="confirm-password" type="password" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="level">Niveau d'études</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="l1">Licence 1</SelectItem>
                    <SelectItem value="l2">Licence 2</SelectItem>
                    <SelectItem value="l3">Licence 3</SelectItem>
                    <SelectItem value="m1">Master 1</SelectItem>
                    <SelectItem value="m2">Master 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="specialization">Spécialisation</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dev">Développement</SelectItem>
                    <SelectItem value="data">Data Science</SelectItem>
                    <SelectItem value="cyber">Cybersécurité</SelectItem>
                    <SelectItem value="network">Réseaux</SelectItem>
                    <SelectItem value="design">Design UX/UI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                J'accepte les <a href="#" className="text-primary underline">conditions d'utilisation</a>
              </label>
            </div>
            <Button type="submit" className="w-full mt-4 bg-[#3F8BDB] hover:bg-[#2c70b8]">
              Créer mon compte étudiant
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

export default StudentRegistrationPage;