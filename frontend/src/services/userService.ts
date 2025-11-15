import { User } from '@/types/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Retrieves the full user profile from Firestore by user ID
 * @param userId The ID of the user to retrieve
 * @returns The user object with complete information or null if not found
 */
export const getUserProfileById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      return {
        id: userDoc.id,
        prenom: userData.prenom || userData.firstName || '',
        nom: userData.nom || userData.lastName || '',
        email: userData.email,
        telephone: userData.phone || '',
        adresse: userData.adresse || userData.address || '',
        email_verified_at: userData.email_verified_at || userData.emailVerifiedAt,
        created_at: userData.createdAt || userData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        role: userData.role || 'student'
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Retrieves the user's full name from Firestore by user ID
 * @param userId The ID of the user to retrieve the name for
 * @returns The full name (prenom + nom) of the user or null if not found
 */
export const getUserFullNameById = async (userId: string): Promise<string | null> => {
  try {
    const user = await getUserProfileById(userId);
    if (user) {
      return `${user.prenom} ${user.nom}`;
    }
    return null;
  } catch (error) {
    console.error('Error getting user full name:', error);
    return null;
  }
};