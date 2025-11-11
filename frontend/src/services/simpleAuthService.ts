// src/services/simpleAuthService.ts
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import {
  LoginRequest,
  LoginResponse,
  ApiResponse,
  User as UserType
} from '@/types/auth';

class SimpleAuthService {
  private currentUser: UserType | null = null;
  private isAuthenticatedState: boolean = false;

  constructor() {
    // Listen for auth state changes
    onAuthStateChanged(getAuth(), async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        this.currentUser = await this.getUserProfile(firebaseUser.uid);
        this.isAuthenticatedState = !!this.currentUser;
      } else {
        this.currentUser = null;
        this.isAuthenticatedState = false;
      }
    });
  }

  getCurrentUser(): UserType | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedState && this.currentUser !== null;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const email = credentials.emailOUnumero;
      const password = credentials.mot_de_passe;

      // First, try to find the user in Firestore by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return {
          status: false,
          message: 'Utilisateur non trouvé',
          data: null
        };
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // For this simple implementation, we'll use Firebase Auth for the actual authentication
      // but get user data from Firestore
      try {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password);

        // Format the user data to match the expected interface
        const user: UserType = {
          id: parseInt(userDoc.id.substring(0, 8), 16) || 1, // Convert ID to number
          prenom: userData.name?.split(' ')[0] || 'Prénom',
          nom: userData.name?.split(' ').slice(1).join(' ') || 'Nom',
          email: userData.email,
          telephone: userData.phone || '', // You can add phone to user data if needed
          role: userData.role || 'student',
          created_at: userData.createdAt || new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        this.currentUser = user;
        this.isAuthenticatedState = true;

        // Store in session for persistence
        sessionStorage.setItem('currentUser', JSON.stringify(user));

        return {
          status: true,
          message: 'Connexion réussie',
          token_data: {
            access_token: 'simple_auth_token',
            refresh_token: 'simple_refresh_token',
            expires_in: 3600,
            token_type: 'Bearer'
          },
          user: user
        };
      } catch (authError: any) {
        return {
          status: false,
          message: 'Mot de passe incorrect',
          data: null
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        status: false,
        message: error.message || 'Erreur de connexion',
        data: null
      };
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear session
      sessionStorage.removeItem('currentUser');
      this.currentUser = null;
      this.isAuthenticatedState = false;
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  private async getUserProfile(userId: string): Promise<UserType | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          id: parseInt(userDoc.id.substring(0, 8), 16) || 1, // Convert ID to number
          prenom: userData.name?.split(' ')[0] || 'Prénom',
          nom: userData.name?.split(' ').slice(1).join(' ') || 'Nom',
          email: userData.email,
          telephone: userData.phone || '',
          role: userData.role || 'student',
          created_at: userData.createdAt || new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
}

export const simpleAuthService = new SimpleAuthService();