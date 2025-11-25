import { dataProvider } from '@/data/dataProvider';
import { useAuth } from '@/hooks/useAuth';
import { calculateProfileProgression } from '@/utils/profileProgression';

// Fonction utilitaire pour normaliser les chaînes de caractères (enlever les accents)
function normalizeString(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Types pour la réponse du chatbot
export interface ChatbotResponse {
  success: boolean;
  message: string;
  data?: any;
  action?: string;
  type?: 'conversational' | 'action';
  error?: string;
}

// Type pour l'utilisateur
export interface UserContext {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  role: string;
}

// Type pour l'intention détectée
export interface IntentResult {
  needs_action: boolean;
  intent: string;
  action?: string;
  params?: Record<string, any>;
  confidence?: number;
}

// Type pour les actions disponibles
export interface ActionDefinition {
  name: string;
  description: string;
}

// Type pour les offres d'emploi
export interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  technologies?: string[];
  description: string;
  postedDate?: string;
  deadline?: string;
  requirements?: string[];
  niceToHave?: string[];
  benefits?: string[];
  logo?: string;
  status?: string;
}

// Type pour les candidatures
export interface Application {
  id: string;
  offerId: string;
  offerTitle: string;
  status: string;
  appliedDate: string;
}

// Service pour le chatbot
class ChatbotService {
  private groqApiKey: string;
  private model : string;

  constructor() {
     this.groqApiKey = import.meta.env.VITE_GROQ_API_KEY || '';
     this.model = import.meta.env.VITE_MODEL_GROQ || '';
     console.log("model = " + this.model);
  } 
  
  /**
   * Traite un message de l'utilisateur et retourne une réponse
   */
  async chat(message: string, userId: string, userRole: string): Promise<ChatbotResponse> {
    try {
      // 1. Obtenir le contexte utilisateur
      const userContext: UserContext = {
        id: userId,
        email: 'user@example.com', // À remplacer par les données réelles de l'utilisateur
        prenom: 'Utilisateur', // À remplacer par les données réelles de l'utilisateur
        nom: 'Test', // À remplacer par les données réelles de l'utilisateur
        role: userRole
      };

      // 2. Détecter l'intention et extraire les paramètres
      const intent = await this.detectIntentAndExtract(message, userContext);

      // 3. Exécuter l'action si nécessaire
      if (intent.needs_action && intent.action) {
        // Ajouter le message original aux paramètres pour la détection de stage
        const paramsWithOriginalMessage = {
          ...intent.params,
          original_message: message
        };
        const actionResult = await this.executeAction(intent.action, paramsWithOriginalMessage, userId, userContext);
        return this.formatResponse(actionResult, intent);
      }

      // 4. Réponse conversationnelle simple
      return await this.getConversationalResponse(message, userContext);
    } catch (error: any) {
      console.error("Chatbot error", error);
      return {
        success: false,
        message: "Désolé, je rencontre un problème technique. Pouvez-vous reformuler ?",
        error: error.message || 'Unknown error'
      };
    }
  }

  /**
   * Détecte l'intention avec l'API Groq
   */
  private async detectIntentAndExtract(message: string, userContext: UserContext): Promise<IntentResult> {
    const systemPrompt = this.buildIntentDetectionPrompt(userContext.role);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || 'Unknown error';
        console.error("Groq API error", { status: response.status, error: errorMessage });
        throw new Error(`Groq API Error: ${errorMessage}`);
      }

      const result = await response.json();
      const content = result.choices[0]?.message?.content || '{}';

      try {
        const decoded = JSON.parse(content);
        if (typeof decoded !== 'object' || decoded === null) {
          console.warn("Invalid JSON from Groq", { content });
          return { needs_action: false, intent: 'conversation' };
        }
        return decoded;
      } catch (parseError) {
        console.warn("Invalid JSON from Groq", { content, error: parseError });
        return { needs_action: false, intent: 'conversation' };
      }
    } catch (error) {
      console.error("Error detecting intent", error);
      return { needs_action: false, intent: 'conversation' };
    }
  }

  /**
   * Prompt pour la détection d'intention
   */
  private buildIntentDetectionPrompt(role: string): string {
    const actions = this.getAvailableActions(role);

    return `Tu es un assistant qui analyse les demandes utilisateur et détermine l'action à effectuer.

Rôle de l'utilisateur: ${role}

Actions disponibles:
${actions.map(a => `- ${a.name}: ${a.description}`).join('\n')}

Réponds UNIQUEMENT en JSON avec cette structure:
{
    "needs_action": true/false,
    "intent": "nom_de_l_action ou conversation",
    "action": "nom_fonction" (si needs_action=true),
    "params": {paramètres extraits} (si needs_action=true),
    "confidence": 0-1
}

Exemples:
- "Je cherche un stage React à Paris" → {"needs_action": true, "intent": "recherche", "action": "rechercher_offres", "params": {"mots_cles": "React", "ville": "Paris", "type_contrat": "stage", "original_message": "Je cherche un stage React à Paris"}}
- "Je cherche un stage en réseau" → {"needs_action": true, "intent": "recherche", "action": "rechercher_offres", "params": {"mots_cles": "réseau", "type_contrat": "stage", "original_message": "Je cherche un stage en réseau"}}
- "Je veux un stage en informatique" → {"needs_action": true, "intent": "recherche", "action": "rechercher_offres", "params": {"mots_cles": "informatique", "type_contrat": "stage", "original_message": "Je veux un stage en informatique"}}
- "Je cherche un stage en réseau informatique" → {"needs_action": true, "intent": "recherche", "action": "rechercher_offres", "params": {"mots_cles": "réseau informatique", "type_contrat": "stage", "original_message": "Je cherche un stage en réseau informatique"}}
- "Le stage est une priorité" → {"needs_action": true, "intent": "recherche", "action": "rechercher_offres", "params": {"type_contrat": "stage", "original_message": "Le stage est une priorité"}}
- "Comment vas-tu?" → {"needs_action": false, "intent": "conversation"}
- "Postule à l'offre job_123" → {"needs_action": true, "intent": "postuler", "action": "postuler_offre", "params": {"id_offre": "job_123"}}
- "Crée moi une offre pour administrateur base de données" → {"needs_action": true, "intent": "creer_offre", "action": "creer_offre", "params": {"title": "administrateur base de données", "query": "administrateur base de données"}}
- "Crée une offre de développeur full stack" → {"needs_action": true, "intent": "creer_offre", "action": "creer_offre", "params": {"title": "développeur full stack", "query": "développeur full stack"}}
- "Je veux créer une offre pour développeur React à Antananarivo, CDI, avec salaire 2M à 3M, technologies: React, Node.js, expérience: junior" → {"needs_action": true, "intent": "creer_offre", "action": "creer_offre", "params": {"title": "développeur React", "location": "Antananarivo", "type": "cdi", "salary": "2000000 - 3000000", "technologies": ["React", "Node.js"], "experience": "junior"}}
- "Créer une offre développeur mobile avec exigences: 3 ans d'expérience, Flutter, Dart, et avantages: télétravail, mutuelle" → {"needs_action": true, "intent": "creer_offre", "action": "creer_offre", "params": {"title": "développeur mobile", "requirements": ["3 ans d'expérience", "Flutter", "Dart"], "benefits": ["télétravail", "mutuelle"]}}

Analyse maintenant la demande de l'utilisateur et réponds en JSON pur sans markdown.`;
  }

  /**
   * Actions disponibles selon le rôle
   */
  private getAvailableActions(role: string): ActionDefinition[] {
    const common: ActionDefinition[] = [
      { name: 'rechercher_offres', description: 'Recherche des offres d\'emploi' },
      { name: 'details_offre', description: 'Obtient les détails d\'une offre' }
    ];

    if (role === 'etudiant') {
      return [
        ...common,
        { name: 'analyser_profil', description: 'Analyse le profil étudiant' },
        { name: 'postuler_offre', description: 'Postule à une offre' },
        { name: 'mes_candidatures', description: 'Liste les candidatures' },
        { name: 'sauvegarder_offre', description: 'Sauvegarde une offre' }
      ];
    }

    if (role === 'recruteur') {
      return [
        ...common,
        { name: 'rechercher_etudiants', description: 'Recherche des étudiants selon critères' },
        { name: 'creer_offre', description: 'Crée une nouvelle offre' },
        { name: 'mes_offres', description: 'Liste les offres' },
        { name: 'candidatures_offre', description: 'Liste les candidatures' },
        { name: 'stats_recrutement', description: 'Statistiques de recrutement' }
      ];
    }

    return common;
  }

  /**
   * Exécute une action
   */
  private async executeAction(action: string, params: Record<string, any>, userId: string, userContext: UserContext): Promise<ChatbotResponse> {
    // Ajouter les informations utilisateur aux paramètres
    const extendedParams = {
      ...params,
      userId: userId,
      userRole: userContext.role
    };

    switch (action) {
      case 'rechercher_offres':
        return await this.rechercherOffres(extendedParams);
      case 'details_offre':
        return await this.detailsOffre(extendedParams);
      case 'analyser_profil':
        return await this.analyserProfil(userId);
      case 'postuler_offre':
        return await this.postulerOffre(params, userId);
      case 'mes_candidatures':
        return await this.mesCandidatures(userId);
      case 'sauvegarder_offre':
        return await this.sauvegarderOffre(params, userId);
      case 'creer_offre':
        return await this.creerOffre(params, userId);
      case 'mes_offres':
        return await this.mesOffres(userId);
      case 'candidatures_offre':
        return await this.candidaturesOffre(params, userId);
      case 'rechercher_etudiants':
        return await this.rechercherEtudiants(params);
      case 'stats_recrutement':
        return await this.statsRecrutement(userId);
      default:
        return { success: false, message: 'Action inconnue' };
    }
  }

  /**
   * Réponse conversationnelle simple
   */
  private async getConversationalResponse(message: string, userContext: UserContext): Promise<ChatbotResponse> {
    const systemPrompt = `Tu es un assistant amical pour une plateforme de recrutement ITU Jobs.
L'utilisateur est ${userContext.prenom} (${userContext.role}).
Réponds de manière concise, utile et professionnelle. Propose des actions concrètes.`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      let content = 'Je suis là pour vous aider ! Que puis-je faire pour vous ?';
      if (response.ok) {
        const responseData = await response.json();
        content = responseData.choices[0]?.message?.content || content;
      }

      return {
        success: true,
        message: content,
        type: 'conversational'
      };
    } catch (error) {
      console.error("Error getting conversational response", error);
      return {
        success: true,
        message: 'Je suis là pour vous aider ! Que puis-je faire pour vous ?',
        type: 'conversational'
      };
    }
  }

  /**
   * Formate la réponse après une action
   */
  private formatResponse(actionResult: ChatbotResponse, intent: IntentResult): ChatbotResponse {
    if (!actionResult.success) {
      return actionResult;
    }

    const naturalResponse = this.generateNaturalResponse(actionResult, intent);

    return {
      success: true,
      message: naturalResponse,
      data: actionResult.data || actionResult,
      action: intent.action
    };
  }

  /**
   * Génère une réponse naturelle à partir des données
   */
  private generateNaturalResponse(data: ChatbotResponse, intent: IntentResult): string {
    switch (intent.action) {
      case 'rechercher_offres':
        return this.formatOffresResponse(data);
      case 'rechercher_etudiants':
        return this.formatEtudiantsResponse(data);
      case 'analyser_profil':
        return this.formatProfilResponse(data);
      case 'mes_candidatures':
        return this.formatCandidaturesResponse(data);
      default:
        return data.message || 'Action effectuée avec succès !';
    }
  }

  private formatOffresResponse(data: ChatbotResponse): string {
    const count = data.data?.count || 0;
    if (count === 0) {
      // Vérifier si une recherche de stage a été demandée
      const params = data.data?.params || {};
      if (params.type_contrat && params.type_contrat.toLowerCase().includes('stage')) {
        return "Je n'ai trouvé aucune offre de stage correspondant à vos critères. Puis-je vous proposer des offres d'emploi à temps plein ?";
      } else {
        return "Je n'ai trouvé aucune offre correspondant à vos critères. Voulez-vous élargir votre recherche ?";
      }
    }

    const offres = data.data?.offres || [];
    let response = `J'ai trouvé ${count} offre(s) pour vous :\n\n`;
    
    offres.slice(0, 5).forEach((offre: any) => {
      // Créer un lien cliquable pour le titre de l'offre
      const queryString = encodeURIComponent(offre.title || offre.titre || '');
      response += `[${offre.title || offre.titre}](/student/offers?q=${queryString}) chez ${offre.company || offre.entreprise}\n`;
      response += `   ${offre.location || offre.localisation} | ${offre.type || offre.type_contrat}\n`;
      response += `   ${offre.salary || offre.salaire}\n\n`;
    });
    
    response += "\nDites-moi \"Détails de [titre]\" pour en savoir plus !";
    return response;
  }

  private formatProfilResponse(data: ChatbotResponse): string {
    const taux = data.data?.taux_completion || 0;
    let response = "Analyse de votre profil :\n\n";
    response += `Complété à ${taux}%\n\n`;
    
    if (data.data?.suggestions && data.data.suggestions.length > 0) {
      response += "Suggestions d'amélioration :\n";
      data.data.suggestions.slice(0, 3).forEach((suggestion: string) => {
        response += `  • ${suggestion}\n`;
      });
    }
    return response;
  }

  private formatEtudiantsResponse(data: ChatbotResponse): string {
    const count = data.data?.count || 0;
    if (count === 0) {
      return "Je n'ai trouvé aucun étudiant correspondant à vos critères. Voulez-vous élargir votre recherche ?";
    }

    const etudiants = data.data?.etudiants || [];
    let response = `Trouvé ${count} étudiant(s) correspondant à votre recherche :\n\n`;
    
    etudiants.slice(0, 5).forEach((etudiant: any) => {
      // Créer un lien cliquable pour le nom de l'étudiant
      const studentId = etudiant.id || etudiant.studentId || '';
      const studentName = etudiant.name || etudiant.prenom + ' ' + etudiant.nom || etudiant.studentName || 'Étudiant';
      
      if (studentId) {
        response += `[${studentName}](/recruiter/student-profile/${studentId})\n`;
        response += `   ${etudiant.personalInfo?.title || etudiant.title || 'Étudiant'} | ${etudiant.personalInfo?.location || etudiant.location || 'Localisation non spécifiée'}\n`;
        
        // Ajout des compétences si disponibles
        if (etudiant.technicalSkills && Array.isArray(etudiant.technicalSkills)) {
          const allSkills = [];
          etudiant.technicalSkills.forEach((category: any) => {
            if (category.skills && Array.isArray(category.skills)) {
              category.skills.forEach((skill: any) => {
                allSkills.push(skill.name);
              });
            }
          });
          if (allSkills.length > 0) {
            response += `   Compétences: ${allSkills.slice(0, 3).join(', ')}\n`;
          }
        }
        response += '\n';
      } else {
        response += `${studentName}\n`;
        response += `   ${etudiant.personalInfo?.title || etudiant.title || 'Étudiant'} | ${etudiant.personalInfo?.location || etudiant.location || 'Localisation non spécifiée'}\n\n`;
      }
    });
    
    response += "\nCliquez sur un nom pour voir le profil complet de l'étudiant !";
    return response;
  }

  private formatCandidaturesResponse(data: ChatbotResponse): string {
    const total = data.data?.total || 0;
    if (total === 0) {
      return "Vous n'avez pas encore de candidatures. Voulez-vous rechercher des offres ?";
    }

    const stats = data.data?.par_statut || {};
    let response = `Vos candidatures (${total}) :\n\n`;
    response += `En attente: ${stats.en_attente || 0}\n`;
    response += `Examinées: ${stats.examinee || 0}\n`;
    response += `Présélectionnées: ${stats.preselectionne || 0}\n`;
    response += `Acceptées: ${stats.accepte || 0}\n`;
    return response;
  }

  // ============================================
  // ACTIONS RECRUTEUR
  // ============================================

  private async rechercherEtudiants(params: Record<string, any>): Promise<ChatbotResponse> {
    try {
      console.log("Rechercher étudiants avec params", params);
      // Import dynamique du service de recherche étudiante
      const { studentSearchService } = await import('./studentSearchService');
      
      // Récupérer la requête de recherche - ajout de la gestion de 'competence' et autres paramètres potentiels
      const searchQuery = params.query || params.mots_cles || params.recherche || params.competence || params.technologies || params.skills || params.domaine || '';
      
      if (!searchQuery) {
        return {
          success: false,
          message: 'Veuillez spécifier une requête de recherche'
        };
      }

      // Effectuer la recherche avec le service AI
      const searchResult = await studentSearchService.searchStudents(searchQuery);
      
      if (!searchResult.success) {
        return {
          success: false,
          message: searchResult.error || 'Erreur lors de la recherche d\'étudiants'
        };
      }

      // Formater les résultats pour le chatbot
      const results = searchResult.data;
      if (!results) {
        return {
          success: false,
          message: 'Aucun résultat de recherche'
        };
      }

      return {
        success: true,
        message: searchResult.message,
        data: {
          count: results.students.length,
          etudiants: results.students,
          queryAnalysis: results.queryAnalysis
        }
      };
    } catch (error) {
      console.error("Error searching students", error);
      return {
        success: false,
        message: "Erreur lors de la recherche d'étudiants"
      };
    }
  }

  // ============================================
  // ACTIONS ÉTUDIANT
  // ============================================

  private async rechercherOffres(params: Record<string, any>): Promise<ChatbotResponse> {
    try {
      // Récupérer les offres depuis le dataProvider (Firestore)
      const allOffers = await dataProvider.getOffers();
      
      // Récupérer le profil de l'utilisateur pour le calcul du matching
      let userProfile = null;
      if (params.userId) {
        userProfile = await dataProvider.getUserProfile(params.userId);
      }
      
      // Filtrer les offres en fonction des paramètres
      let filteredOffers = allOffers;
      
      // Filtrer par mots-clés
      if (params.mots_cles) {
        const normalizedMotsCles = normalizeString(params.mots_cles.toLowerCase());
        filteredOffers = filteredOffers.filter(offer => 
          normalizeString(offer.title.toLowerCase()).includes(normalizedMotsCles) ||
          normalizeString(offer.description.toLowerCase()).includes(normalizedMotsCles)
        );
      }
      
      // Filtrer par ville
      if (params.ville) {
        const normalizedVille = normalizeString(params.ville.toLowerCase());
        filteredOffers = filteredOffers.filter(offer => 
          normalizeString(offer.location.toLowerCase()).includes(normalizedVille)
        );
      }
      
      // Filtrer par type de contrat - si le message original contient "stage", forcer le filtre
      if (params.type_contrat) {
        const normalizedTypeContrat = normalizeString(params.type_contrat.toLowerCase());
        filteredOffers = filteredOffers.filter(offer => 
          normalizeString(offer.type.toLowerCase()).includes(normalizedTypeContrat)
        );
      } else if (params.original_message && normalizeString(params.original_message.toLowerCase()).includes('stage')) {
        // Si le message original mentionne 'stage' mais qu'aucun type_contrat n'est spécifié
        filteredOffers = filteredOffers.filter(offer => 
          normalizeString(offer.type.toLowerCase()).includes('stage')
        );
      }
      
      // Convertir les offres pour correspondre au format attendu
      // Calculer le matchingScore si un profil utilisateur est disponible
      const formattedOffers = filteredOffers.map(offer => {
        const baseOffer = {
          id: offer.id,
          title: offer.title,
          company: offer.company,
          location: offer.location,
          type: offer.type,
          salary: offer.salary,
          description: offer.description,
          technologies: offer.technologies || [],
          requirements: offer.requirements || [],
          postedDate: offer.postedDate
        };
        
        // Calculer le matchingScore si le profil utilisateur est disponible
        if (userProfile) {
          baseOffer.matchingScore = this.calculateMatchingScore(userProfile, offer);
        } else {
          // Si pas de profil utilisateur, utiliser le matchingScore du document Firestore
          baseOffer.matchingScore = offer.matchingScore || 0;
        }
        
        return baseOffer;
      });

      return {
        success: true,
        message: `Trouvé ${formattedOffers.length} offres correspondant à vos critères`,
        data: {
          count: formattedOffers.length,
          offres: formattedOffers
        }
      };
    } catch (error) {
      console.error("Error searching offers", error);
      return {
        success: false,
        message: "Erreur lors de la recherche des offres"
      };
    }
  }

  private async detailsOffre(params: Record<string, any>): Promise<ChatbotResponse> {
    try {
      if (!params.id_offre) {
        return { success: false, message: 'ID de l\'offre manquant' };
      }

      const offer = await dataProvider.getOfferById(params.id_offre);
      
      if (!offer) {
        return { success: false, message: 'Offre non trouvée' };
      }

      // Créer l'objet de base pour l'offre
      const offerDetails: any = {
        id: offer.id,
        title: offer.title,
        description: offer.description,
        company: offer.company,
        location: offer.location,
        type: offer.type,
        salary: offer.salary,
        technologies: offer.technologies || [],
        requirements: offer.requirements || [],
        postedDate: offer.postedDate
      };

      // Calculer le matching score uniquement si c'est un étudiant (pas un recruteur)
      // On suppose que params.userId est l'ID de l'utilisateur actuel
      if (params.userId && params.userRole === 'etudiant') {
        const userProfile = await dataProvider.getUserProfile(params.userId);
        if (userProfile) {
          offerDetails.matchingScore = this.calculateMatchingScore(userProfile, offer);
        }
      }

      return {
        success: true,
        message: `Voici les détails de l'offre '${offer.title}'`,
        data: {
          offre: offerDetails
        }
      };
    } catch (error) {
      console.error("Error getting offer details", error);
      return {
        success: false,
        message: "Erreur lors de la récupération des détails de l'offre"
      };
    }
  }

  private async analyserProfil(userId: string): Promise<ChatbotResponse> {
    try {
      // Récupérer le profil de l'utilisateur depuis le dataProvider (Firestore)
      const profile = await dataProvider.getUserProfile(userId);
      
      if (!profile) {
        return { success: false, message: 'Profil non trouvé' };
      }

      // Calculer la progression du profil en utilisant la fonction existante
      const profileProgression = calculateProfileProgression(profile);
      
      // Générer des suggestions d'amélioration en fonction des sections manquantes
      const suggestions: string[] = [];
      
      // Vérifier les informations personnelles
      if (!profile.personalInfo?.name) suggestions.push("Ajoutez votre nom");
      if (!profile.personalInfo?.title) suggestions.push("Définissez votre titre professionnel");
      if (!profile.personalInfo?.description || profile.personalInfo.description.length < 100) 
        suggestions.push("Rédigez une description plus détaillée de votre profil (100 caractères minimum)");
      if (!profile.personalInfo?.location) suggestions.push("Ajoutez votre localisation");
      if (!profile.personalInfo?.linkedin) suggestions.push("Ajoutez votre lien LinkedIn");
      if (!profile.personalInfo?.profileImage) suggestions.push("Ajoutez une photo de profil");

      // Vérifier les compétences techniques
      if (!profile.technicalSkills || profile.technicalSkills.length === 0) 
        suggestions.push("Ajoutez vos compétences techniques avec leur niveau d'expertise");

      // Vérifier les expériences
      if (!profile.experiences || profile.experiences.length === 0) 
        suggestions.push("Ajoutez vos expériences professionnelles");

      // Vérifier les formations
      if (!profile.formations || profile.formations.length === 0) 
        suggestions.push("Ajoutez vos formations académiques");

      // Vérifier les soft skills
      if (!profile.softSkills || profile.softSkills.length < 3) 
        suggestions.push("Ajoutez au moins 3 soft skills");

      // Vérifier les langues
      if (!profile.languages || profile.languages.length === 0) 
        suggestions.push("Ajoutez les langues que vous maîtrisez");

      return {
        success: true,
        data: {
          taux_completion: profileProgression.progression,
          suggestions
        }
      };
    } catch (error) {
      console.error("Error analyzing profile", error);
      return {
        success: false,
        message: "Erreur lors de l'analyse du profil"
      };
    }
  }

  private async postulerOffre(params: Record<string, any>, userId: string): Promise<ChatbotResponse> {
    try {
      if (!params.id_offre) {
        return { success: false, message: 'ID de l\'offre manquant' };
      }

      // Vérifier si l'utilisateur est connecté
      if (!userId) {
        return { success: false, message: 'Utilisateur non authentifié' };
      }

      // Récupérer le profil de l'utilisateur
      const profile = await dataProvider.getUserProfile(userId);
      if (!profile) {
        return { success: false, message: 'Profil non trouvé' };
      }

      // Récupérer l'offre pour obtenir les détails
      const offer = await dataProvider.getOfferById(params.id_offre);
      if (!offer) {
        return { success: false, message: 'Offre non trouvée' };
      }

      // Vérifier si la candidature existe déjà
      const applications = await dataProvider.getApplications(userId);
      const existingApplication = applications.find(app => app.offerId === params.id_offre);
      
      if (existingApplication) {
        return { success: false, message: 'Vous avez déjà postulé à cette offre' };
      }

      // Créer la candidature
      const applicationData = {
        studentId: userId,
        studentName: profile.personalInfo?.name || 'Candidat',
        company: offer.company,
        position: offer.title,
        location: offer.location,
        salary: offer.salary,
        type: offer.type,
        offerId: params.id_offre,
        status: 'pending'
      };

      await dataProvider.addApplication(applicationData);

      return { 
        success: true, 
        message: `Candidature envoyée avec succès à l'offre "${offer.title}" chez ${offer.company} !` 
      };
    } catch (error) {
      console.error("Error posting application", error);
      return {
        success: false,
        message: "Erreur lors de l'envoi de la candidature"
      };
    }
  }

  private async mesCandidatures(userId: string): Promise<ChatbotResponse> {
    try {
      if (!userId) {
        return { success: false, message: 'Utilisateur non authentifié' };
      }

      const applications = await dataProvider.getApplications(userId);
      
      // Compter les candidatures par statut
      const statusCounts: Record<string, number> = {
        pending: 0,
        accepted: 0,
        rejected: 0,
        interview: 0,
        offered: 0
      };
      
      applications.forEach(app => {
        const status = app.status || 'pending';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      return {
        success: true,
        data: {
          total: applications.length,
          par_statut: {
            en_attente: statusCounts.pending,
            examinee: statusCounts.interview,
            preselectionne: statusCounts.offered,
            accepte: statusCounts.accepted
          }
        }
      };
    } catch (error) {
      console.error("Error getting applications", error);
      return {
        success: false,
        message: "Erreur lors de la récupération des candidatures"
      };
    }
  }

  private async sauvegarderOffre(params: Record<string, any>, userId: string): Promise<ChatbotResponse> {
    // Pour l'instant, on ne fait qu'une réponse positive car le stockage des offres sauvegardées
    // n'est pas implémenté dans le dataProvider actuel
    return {
      success: true,
      message: 'Offre sauvegardée !'
    };
  }

  // ============================================
  // ACTIONS RECRUTEUR
  // ============================================

  private async creerOffre(params: Record<string, any>, userId: string): Promise<ChatbotResponse> {
    // Analyser la requête pour extraire les paramètres de l'offre à créer
    let title = params.title || params.poste || params.jobTitle || params.job_title || params.query || 'Nouveau poste';
    
    // Obtenir les informations de base à partir des paramètres ou de la requête
    let type = params.type || params.type_contrat || params.contract_type || 'cdi'; // Valeur par défaut
    let location = params.location || params.lieu || 'Antananarivo, Madagascar';
    let salary = params.salary || params.salaire || '';
    let experience = params.experience || params.level || '';
    let technologies = params.technologies || params.skills || params.competences || [];
    let requirements = params.requirements || params.exigences || [];
    let niceToHave = params.niceToHave || params.souhaits || [];
    let benefits = params.benefits || params.avantages || [];
    let description = params.description || params.desc || '';
    
    // Si ce sont des chaînes, les convertir en tableaux
    if (typeof technologies === 'string') technologies = technologies.split(',').map(t => t.trim());
    if (typeof requirements === 'string') requirements = requirements.split(',').map(r => r.trim());
    if (typeof niceToHave === 'string') niceToHave = niceToHave.split(',').map(n => n.trim());
    if (typeof benefits === 'string') benefits = benefits.split(',').map(b => b.trim());
    
    // Si nous avons seulement le titre, demander à l'IA d'analyser le poste et de générer les détails
    const fullQuery = params.query || title;
    
    if (!params.hasDetailedParams && (technologies.length === 0 || requirements.length === 0 || description === '')) {
      try {
        // Demander à l'IA d'analyser le poste et de générer un contenu détaillé
        const generationPrompt = `
        Tu es un expert RH et recruteur. Génère des détails complets pour l'offre d'emploi suivante : "${title}"
        
        Format de réponse : JSON avec les champs suivants:
        - technologies: tableau de technologies pertinentes pour ce poste
        - requirements: tableau d'exigences principales pour ce poste
        - niceToHave: tableau de compétences ou qualifications souhaitées mais non obligatoires
        - benefits: tableau d'avantages classiques pour ce poste
        - description: description détaillée du poste en format markdown avec sections "À propos du poste", "Responsabilités", et "Environnement de travail"
        - experience: niveau d'expérience approprié (junior, intermediate, senior)
        - salary: salaire approprié pour ce poste (sous forme de chaîne)
        - type: type de contrat approprié (cdi, cdd, stage, alternance, freelance)
        - location: lieu typique pour ce type de poste à Madagascar
        
        Exemple de format de données pour un développeur full stack senior:
        {
          technologies: ["React", "Node.js", "MongoDB", "Express", "TypeScript", "Docker", "AWS"],
          requirements: [
            "Minimum 3 ans d'expérience en développement web",
            "Maîtrise de React et Node.js",
            "Expérience avec les bases de données NoSQL",
            "Connaissance des API REST",
            "Expérience avec Git et CI/CD",
            "Bon niveau en anglais technique"
          ],
          niceToHave: [
            "Expérience avec TypeScript",
            "Connaissance de Docker",
            "Expérience en architecture microservices"
          ],
          benefits: [
            "Assurance santé",
            "Formation continue",
            "Équipement moderne",
            "Team building réguliers",
            "Primes de performance"
          ],
          description: "## À propos du poste...",
          experience: "senior",
          salary: "2,000,000 - 3,000,000 MGA/mois",
          type: "cdi",
          location: "Antananarivo, Madagascar"
        }
        
        Réponds en JSON pur sans commentaire.`;
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              { role: 'system', content: generationPrompt },
              { role: 'user', content: fullQuery }
            ],
            temperature: 0.5,
            max_tokens: 1000
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          const content = result.choices[0]?.message?.content || '';
          
          try {
            const parsedData = JSON.parse(content);
            
            // Ne remplacer les valeurs que si elles n'étaient pas explicitement fournies
            if (technologies.length === 0 && Array.isArray(parsedData.technologies)) {
              technologies = parsedData.technologies;
            }
            if (requirements.length === 0 && Array.isArray(parsedData.requirements)) {
              requirements = parsedData.requirements;
            }
            if (niceToHave.length === 0 && Array.isArray(parsedData.niceToHave)) {
              niceToHave = parsedData.niceToHave;
            }
            if (benefits.length === 0 && Array.isArray(parsedData.benefits)) {
              benefits = parsedData.benefits;
            }
            if (description === '' && parsedData.description) {
              description = parsedData.description;
            }
            if (experience === '' && parsedData.experience) {
              experience = parsedData.experience;
            }
            if (salary === '' && parsedData.salary) {
              salary = parsedData.salary;
            }
            if (type === 'cdi' && parsedData.type) {  // Si c'était la valeur par défaut
              type = parsedData.type;
            }
            if (location === 'Antananarivo, Madagascar' && parsedData.location) {  // Si c'était la valeur par défaut
              location = parsedData.location;
            }
          } catch (parseError) {
            console.warn("Erreur d'analyse du JSON généré par l'IA", parseError);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la génération IA des détails de l'offre", error);
        // En cas d'erreur, on continue avec les valeurs existantes
      }
    }
    
    // Créer une chaîne de requête avec les paramètres pré-remplis
    const queryParams = new URLSearchParams();
    if (title) queryParams.append('title', title);
    if (type) queryParams.append('type', type);
    if (location) queryParams.append('location', location);
    if (description) queryParams.append('description', description);
    if (Array.isArray(technologies) && technologies.length > 0) queryParams.append('technologies', technologies.join(','));
    if (Array.isArray(requirements) && requirements.length > 0) queryParams.append('requirements', requirements.join(','));
    if (Array.isArray(niceToHave) && niceToHave.length > 0) queryParams.append('niceToHave', niceToHave.join(','));
    if (Array.isArray(benefits) && benefits.length > 0) queryParams.append('benefits', benefits.join(','));
    if (experience) queryParams.append('experience', experience);
    if (salary) queryParams.append('salary', salary);

    // Créer un message avec un lien cliquable pour créer l'offre
    const redirectUrl = `/recruiter/create-offer?${queryParams.toString()}`;
    const message = `J'ai analysé votre demande pour "${title}". Cliquez sur [Nouveau poste](${redirectUrl}) pour accéder au formulaire pré-rempli.`;

    return {
      success: true,
      message: message,
      data: { 
        redirect: redirectUrl,
        title: title,
        type: type,
        location: location,
        description: description,
        technologies: technologies,
        requirements: requirements,
        niceToHave: niceToHave,
        benefits: benefits,
        experience: experience,
        salary: salary
      },
      action: 'show_create_offer_link' // Changed action type
    };
  }

  private async mesOffres(userId: string): Promise<ChatbotResponse> {
    try {
      // Récupérer toutes les offres - dans un scénario réel, vous voudriez filtrer par utilisateur
      // Pour l'instant, on suppose que les offres sont associées à un utilisateur via un champ spécifique
      // La logique exacte dépendra de votre structure Firestore
      const allOffers = await dataProvider.getOffers();
      
      // Pour l'instant, on retourne toutes les offres
      // Dans une implémentation complète, on filtrerait par ID utilisateur si cela est supporté
      return {
        success: true,
        data: {
          total: allOffers.length,
          offres: allOffers
        }
      };
    } catch (error) {
      console.error("Error getting offers", error);
      return {
        success: false,
        message: "Erreur lors de la récupération des offres"
      };
    }
  }

  private async candidaturesOffre(params: Record<string, any>, userId: string): Promise<ChatbotResponse> {
    try {
      // Vérifier si l'ID de l'offre est présent dans différents formats possibles
      const offerId = params.id_offre || params.offerId || params.offer_id;
      if (!offerId) {
        return { success: false, message: 'ID de l\'offre manquant' };
      }

      // Récupérer toutes les candidatures et filtrer par ID d'offre
      const allApplications = await dataProvider.getApplications();
      const applicationsForOffer = allApplications.filter(app => app.offerId === offerId);
      
      return {
        success: true,
        data: {
          total: applicationsForOffer.length,
          candidatures: applicationsForOffer
        }
      };
    } catch (error) {
      console.error("Error getting offer applications", error);
      return {
        success: false,
        message: "Erreur lors de la récupération des candidatures pour l'offre"
      };
    }
  }

  private async statsRecrutement(userId: string): Promise<ChatbotResponse> {
    // Pour l'instant, on retourne des statistiques factices
    // Dans une implémentation complète, on récupérerait les vraies stats
    return {
      success: true,
      data: {
        stats: {
          nb_offres_actives: 5,
          nb_candidatures_recues: 42
        }
      }
    };
  }

  /**
   * Calcule le matching score entre un profil utilisateur et une offre
   */
  private calculateMatchingScore(profile: any, offer: any): number {
    let score = 0;
    let totalWeight = 0;

    // Extraction des compétences du profil
    const profileSkills: string[] = [];
    if (profile.technicalSkills) {
      for (const skillGroup of profile.technicalSkills) {
        for (const skill of skillGroup.skills) {
          profileSkills.push(skill.name.toLowerCase());
        }
      }
    }

    // Extraction des langues du profil
    const profileLanguages: string[] = [];
    if (profile.languages) {
      for (const lang of profile.languages) {
        profileLanguages.push(lang.name.toLowerCase());
      }
    }

    // Extraction des expériences du profil
    const profileExperiences: string[] = [];
    if (profile.experiences) {
      for (const exp of profile.experiences) {
        profileExperiences.push(exp.title.toLowerCase());
        profileExperiences.push(exp.description.toLowerCase());
      }
    }

    // Vérifier les compétences techniques (40% du score)
    if (offer.technologies && Array.isArray(offer.technologies)) {
      totalWeight += 40; // Poids de 40% pour les technologies
      for (const tech of offer.technologies) {
        const normalizedTech = normalizeString(tech.toLowerCase());
        if (profileSkills.some(skill => 
          normalizeString(skill).includes(normalizedTech) || normalizedTech.includes(normalizeString(skill))
        )) {
          score += 40 / offer.technologies.length;
        }
      }
    }

    // Vérifier les exigences (30% du score)
    if (offer.requirements && Array.isArray(offer.requirements)) {
      totalWeight += 30; // Poids de 30% pour les exigences
      for (const requirement of offer.requirements) {
        const normalizedReq = normalizeString(requirement.toLowerCase());
        // Vérifier si une compétence du profil correspond à l'exigence
        if (profileSkills.some(skill => 
          normalizeString(normalizedReq).includes(normalizeString(skill)) || normalizeString(skill).includes(normalizedReq)
        )) {
          score += 10;
        }
        // Vérifier si une expérience du profil correspond à l'exigence
        if (profileExperiences.some(exp => 
          normalizeString(normalizedReq).includes(normalizeString(exp)) || normalizeString(exp).includes(normalizedReq)
        )) {
          score += 10;
        }
        // Vérifier si une langue du profil correspond à l'exigence
        if (profileLanguages.some(lang => 
          normalizeString(normalizedReq).includes(normalizeString(lang)) || normalizeString(lang).includes(normalizedReq)
        )) {
          score += 10;
        }
      }
    }

    // Vérifier la localisation (20%)
    if (offer.location) {
      totalWeight += 20;
      if (profile.personalInfo && profile.personalInfo.location && 
          normalizeString(profile.personalInfo.location.toLowerCase()).includes(normalizeString(offer.location.toLowerCase()))) {
        score += 20;
      }
    }

    // Vérifier la disponibilité (10%)
    if (profile.personalInfo && profile.personalInfo.availability) {
      totalWeight += 10;
      if (offer.description && normalizeString(offer.description.toLowerCase()).includes(normalizeString('immédiate')) && 
          normalizeString(profile.personalInfo.availability.toLowerCase()).includes(normalizeString('immédiate'))) {
        score += 10;
      }
    }

    // Calculer le score final sur 100
    const finalScore = totalWeight > 0 ? Math.min(100, Math.round((score / totalWeight) * 100)) : 0;
    return finalScore;
  }
}

export const chatbotService = new ChatbotService();