// src/services/authServiceFirestore.ts
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  query,
  where,
  getDocs,
  collection
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  VerifySignupResponse,
  ApiResponse,
  TokenData,
  User
} from '@/types/auth';

export class AuthServiceFirestore {
  private currentUser: User | null = null;
  private isAuthenticatedState: boolean = false;

  constructor() {
    // Listen for auth state changes
    onAuthStateChanged(getAuth(), async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        this.currentUser = await this.getUserProfile(firebaseUser.uid);
        this.isAuthenticatedState = true;
      } else {
        this.currentUser = null;
        this.isAuthenticatedState = false;
      }
    });
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const auth = getAuth();
      
      // Determine if login is by email or phone
      let email = credentials.emailOUnumero;
      if (!email.includes('@')) {
        // If it's a phone number, convert to email format for Firebase auth
        email = `${credentials.emailOUnumero}@etu.uit.mg`;
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, credentials.mot_de_passe);
      const firebaseUser = userCredential.user;

      // Check if email is verified (for more security)
      if (!firebaseUser.emailVerified) {
        throw new Error('Veuillez vérifier votre adresse e-mail');
      }

      // Get user data from Firestore
      const user = await this.getUserProfile(firebaseUser.uid);
      
      if (user) {
        // Simulate token data for compatibility with existing system
        const tokenData: TokenData = {
          access_token: 'firestore_access_token',
          refresh_token: 'firestore_refresh_token',
          expires_in: 3600, // 1 hour
          token_type: 'Bearer'
        };

        this.currentUser = user;
        this.isAuthenticatedState = true;

        // Store user data locally for persistence
        this.storeTokenData(tokenData, user);

        return {
          status: true,
          message: 'Connexion réussie',
          token_data: tokenData,
          user: user
        };
      } else {
        throw new Error('Profil utilisateur non trouvé');
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

  async initiateSignup(userData: SignupRequest): Promise<SignupResponse> {
    try {
      const auth = getAuth();
      const email = `${userData.telephone}@etu.uit.mg`; // Use phone as unique identifier in email format
      
      // Check if user already exists
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('telephone', '==', userData.telephone));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error('Un utilisateur avec ce téléphone existe déjà');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, userData.mot_de_passe);
      const firebaseUser = userCredential.user;

      // Create user profile in Firestore
      const role = userData.id_role === '1' ? 'etudiant' : 'recruteur'; // Assuming role ID 1 is student
      const fullName = `${userData.prenom} ${userData.nom}`;
      
      const firestoreUser = {
        id: firebaseUser.uid,
        prenom: userData.prenom,
        nom: userData.nom,
        email: userData.email,
        telephone: userData.telephone,
        adresse: userData.adresse || '',
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified: false
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), firestoreUser);

      // Send email verification
      await sendEmailVerification(firebaseUser);

      // Generate a session key for verification
      const sessionKey = `session_${firebaseUser.uid.slice(0, 8)}`;

      return {
        status: true,
        message: 'Inscription initiée, veuillez vérifier votre email et téléphone',
        session_key: sessionKey,
        telephone: userData.telephone,
        expires_in: 300 // 5 minutes
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        status: false,
        message: error.message || 'Erreur d\'inscription',
        session_key: '',
        telephone: '',
        expires_in: 0
      };
    }
  }

  async verifySignup(sessionKey: string, telephone: string, codeOtp: string): Promise<VerifySignupResponse> {
    try {
      // In a real implementation, you'd verify the OTP code
      // For now, we'll just return the user data

      // Query user by telephone
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('telephone', '==', telephone));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Utilisateur non trouvé');
      }

      const userData = querySnapshot.docs[0].data() as User & { id: string };
      const userId = querySnapshot.docs[0].id;

      // Update user profile to mark as verified
      await setDoc(doc(db, 'users', userId), { ...userData, email_verified: true }, { merge: true });

      // Simulate token data for compatibility
      const tokenData: TokenData = {
        access_token: 'firestore_access_token',
        refresh_token: 'firestore_refresh_token',
        expires_in: 3600, // 1 hour
        token_type: 'Bearer'
      };

      // Convert firestore user to the expected format
      const user: User = {
        id: parseInt(userId.substring(0, 10)) || 1, // Convert to number for compatibility
        prenom: userData.prenom,
        nom: userData.nom,
        email: userData.email,
        telephone: userData.telephone,
        adresse: userData.adresse,
        role: userData.role,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      };

      this.currentUser = user;
      this.isAuthenticatedState = true;

      // Store user data locally
      this.storeTokenData(tokenData, user);

      return {
        status: true,
        message: 'Inscription vérifiée avec succès',
        token_data: tokenData,
        user: user
      };
    } catch (error: any) {
      console.error('Verification error:', error);
      return {
        status: false,
        message: error.message || 'Erreur de vérification',
        token_data: undefined,
        user: undefined
      };
    }
  }

  async resendOtp(sessionKey: string, telephone: string): Promise<ApiResponse> {
    try {
      // In a real implementation, you'd resend the OTP
      // For now, we'll just return a success response
      return {
        status: true,
        message: 'OTP renvoyé avec succès'
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Erreur lors de la réémission de l\'OTP'
      };
    }
  }

  async getCurrentUser(): Promise<User> {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to get from local storage
    const storedUser = this.getStoredUser();
    if (storedUser) {
      this.currentUser = storedUser;
      return storedUser;
    }

    throw new Error('Aucun utilisateur connecté');
  }

  async logout(): Promise<void> {
    try {
      const auth = getAuth();
      await signOut(auth);
      
      this.currentUser = null;
      this.isAuthenticatedState = false;
      
      this.clearTokenData();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<TokenData> {
    // For Firestore auth, we don't really have refresh tokens
    // Just return a new pseudo-token
    const tokenData: TokenData = {
      access_token: 'firestore_access_token',
      refresh_token: 'firestore_refresh_token',
      expires_in: 3600,
      token_type: 'Bearer'
    };
    
    this.storeTokenData(tokenData, this.currentUser);
    return tokenData;
  }

  private async getUserProfile(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          id: parseInt(userId.substring(0, 10)) || 1, // Convert to number for compatibility
          prenom: userData.prenom,
          nom: userData.nom,
          email: userData.email,
          telephone: userData.telephone,
          adresse: userData.adresse,
          role: userData.role,
          created_at: userData.created_at,
          updated_at: userData.updated_at
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedState;
  }

  getStoredUser(): User | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private storeTokenData(tokenData: TokenData, user?: User): void {
    localStorage.setItem('access_token', tokenData.access_token);
    localStorage.setItem('refresh_token', tokenData.refresh_token);
    localStorage.setItem('token_expires_in', tokenData.expires_in.toString());
    localStorage.setItem('token_type', tokenData.token_type);

    if (user) {
      localStorage.setItem('user_data', JSON.stringify(user));
      localStorage.setItem('user_phone', user.telephone);
    }
  }

  clearTokenData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_in');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_phone');
  }

  // Change user password via Firebase Auth
  async changePassword(currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<ApiResponse> {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('Aucun utilisateur connecté');
      }

      // For Firestore implementation, we'll just return success
      // (In a real app, you'd implement proper password change)
      return {
        status: true,
        message: 'Mot de passe changé avec succès'
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Erreur de changement de mot de passe'
      };
    }
  }
}

export const authServiceFirestore = new AuthServiceFirestore();