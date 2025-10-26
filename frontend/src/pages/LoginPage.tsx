import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Lock, GraduationCap, Building2 } from 'lucide-react';
import logoItu from '@/assets/logo-itu.png';
import { useAuth } from '@/context/AuthContext';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ emailOUnumero: email, mot_de_passe: password });
    } catch (err) {
      // Error is already handled in useAuth hook, but you can add component-specific logic here if needed
    }
  };

  return (
    <div className="min-h-screen bg-gray-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-md border-0">
        <CardContent className="pt-12 pb-8 px-8">
          {/* Logo ITU */}
          <div className="flex justify-center mb-8">
            <img 
              src={logoItu} 
              alt="ITUniversity Logo" 
              className="h-20 object-contain"
            />
          </div>

          {/* Titre */}
          <h2 className="text-center text-gray-text font-semibold text-xl mb-6">
            Identifiez-vous!
          </h2>

          {/* Formulaire */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
              <Input
                type="email"
                placeholder="Adresse électronique"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 border-gray-border focus:border-new-green focus:ring-new-green"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 border-gray-border focus:border-new-green focus:ring-new-green"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          {/* Bouton */}
          <div className="flex justify-center">
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-12 bg-[#3F8BDB] hover:bg-[#2c70b8] text-white font-medium rounded-md transition-smooth"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </div>

          {/* Liens d'inscription */}
          <div className="mt-6 pt-6 border-t border-gray-border">
            <p className="text-center text-sm text-gray-text mb-3">
              Pas encore de compte ?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/register/student')}
                className="h-11 border-gray-border hover:border-[#3F8BDB] hover:text-[#3F8BDB]"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Étudiant
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/register/recruiter')}
                className="h-11 border-gray-border hover:border-[#3F8BDB] hover:text-[#3F8BDB]"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Recruteur
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;