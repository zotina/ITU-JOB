import { dataProvider } from '@/data/dataProvider';
import { JobOffer, Application } from './chatbotService';

// Types pour la recherche étudiante
export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  level: string;
  skills: string[];
  availability: string;
  location: string;
  matchScore: number;
  avatar: string;
  description: string;
  languages: string[];
  projects: Project[];
  experiences: Experience[];
  formations: Formation[];
  personalInfo: any;
  technicalSkills: any[];
  softSkills: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  achievements?: string[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  type: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export interface Formation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  period: string;
  description: string;
  grade: string;
  achievements: string[];
}

export interface SearchQueryAnalysis {
  keywords: string[];
  location?: string;
  skills?: string[];
  experienceLevel?: string;
  availability?: string;
  languages?: string[];
  technologies?: string[];
  domain?: string;
}

export interface SearchResults {
  students: StudentProfile[];
  total: number;
  queryAnalysis: SearchQueryAnalysis;
  relevanceScores: Record<string, number>;
}

export interface SemanticSearchResponse {
  success: boolean;
  message: string;
  data?: SearchResults;
  error?: string;
}

class StudentSearchService {
  private groqApiKey: string;
  private model: string;

  constructor() {
    this.groqApiKey = import.meta.env.VITE_GROQ_API_KEY || '';
    this.model = import.meta.env.VITE_MODEL_GROQ || '';
    console.log("Student Search Service - model = " + this.model);
  }

  /**
   * Effectue une recherche sémantique d'étudiants en langage naturel
   */
  async searchStudents(query: string): Promise<SemanticSearchResponse> {
    try {
      // 1. Analyser la requête en langage naturel avec l'IA
      const queryAnalysis = await this.analyzeQueryWithAI(query);
      console.log("Query analysis", queryAnalysis);
      // 2. Récupérer tous les profils étudiants depuis Firestore
      const allStudents = await this.fetchAllStudentProfiles();

      // 3. Filtrer et classer les étudiants selon la requête analysée
      const { filteredStudents, relevanceScores } = await this.rankStudentsByQuery(
        allStudents,
        queryAnalysis,
        query
      );

      // 4. Calculer les scores de matching IA pour chaque étudiant
      const enhancedStudents = filteredStudents.map(student => {
        const enhancedStudent = { ...student };
        enhancedStudent.matchScore = relevanceScores[student.id] || 0;
        return enhancedStudent;
      });

      // 5. Retourner les résultats avec l'analyse de la requête et les scores de pertinence
      const results: SearchResults = {
        students: enhancedStudents,
        total: enhancedStudents.length,
        queryAnalysis,
        relevanceScores
      };

      return {
        success: true,
        message: `Trouvé ${enhancedStudents.length} étudiant(s) correspondant à votre recherche`,
        data: results
      };
    } catch (error: any) {
      console.error("Student search error", error);
      return {
        success: false,
        message: "Désolé, je rencontre un problème technique lors de la recherche d'étudiants.",
        error: error.message || 'Unknown error'
      };
    }
  }

  /**
   * Analyse la requête utilisateur avec l'IA pour extraire les paramètres de recherche
   */
  private async analyzeQueryWithAI(query: string): Promise<SearchQueryAnalysis> {
    const systemPrompt = `Tu es un assistant qui analyse les requêtes de recherche d'étudiants en langage naturel.
Extrait les paramètres de recherche suivants s'ils sont présents dans la requête :
- keywords: mots-clés principaux
- location: localisation recherchée (ville, région, pays)
- skills: compétences techniques spécifiques
- experienceLevel: niveau d'expérience (débutant, intermédiaire, avancé, expert)
- availability: disponibilité (immédiate, à partir de mars, etc.)
- languages: langues parlées
- technologies: technologies spécifiques
- domain: domaine d'expertise (IA, développement web, mobile, etc.)

Réponds UNIQUEMENT en JSON avec cette structure:
{
  "keywords": ["mot1", "mot2"],
  "location": "ville ou région",
  "skills": ["compétence1", "compétence2"],
  "experienceLevel": "niveau",
  "availability": "disponibilité",
  "languages": ["langue1", "langue2"],
  "technologies": ["tech1", "tech2"],
  "domain": "domaine"
}

Exemples:
- "développeur React Antananarivo disponible immédiatement" → {"keywords": ["développeur", "React"], "location": "Antananarivo", "technologies": ["React"], "availability": "immédiate"}
- "étudiant en intelligence artificielle avec Python" → {"keywords": ["intelligence artificielle", "Python"], "skills": ["Python"], "domain": "intelligence artificielle"}

Analyse maintenant la requête utilisateur et réponds en JSON pur sans markdown.`;

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
            { role: 'user', content: query }
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
          return { keywords: query.split(' ') };
        }
        return decoded;
      } catch (parseError) {
        console.warn("Invalid JSON from Groq", { content, error: parseError });
        return { keywords: query.split(' ') };
      }
    } catch (error) {
      console.error("Error analyzing query", error);
      return { keywords: query.split(' ') };
    }
  }

  /**
   * Récupère tous les profils étudiants depuis Firestore
   */
  private async fetchAllStudentProfiles(): Promise<StudentProfile[]> {
    try {
      // Récupérer tous les candidats (étudiants) depuis Firebase
      const candidates = await dataProvider.getCandidates();
      
      // Pour chaque candidat, récupérer le profil complet
      const studentProfiles: StudentProfile[] = [];
      
      for (const candidate of candidates) {
        // Récupérer le profil complet de l'utilisateur
        const fullProfile = await dataProvider.getUserProfile(candidate.id);
        
        if (fullProfile) {
          // Créer un profil étudiant basé sur les données de l'utilisateur
          const studentProfile: StudentProfile = {
            id: candidate.id,
            name: `${fullProfile.prenom || ''} ${fullProfile.nom || ''}`.trim() || candidate.name || 'Étudiant Anonyme',
            email: fullProfile.email || candidate.email || '',
            title: fullProfile.personalInfo?.title || 'Étudiant',
            level: fullProfile.experience || candidate.experiences?.length > 0 ? `${candidate.experiences.length} expérience(s)` : 'Débutant',
            skills: this.extractSkillsFromProfile(fullProfile) || candidate.skills || [],
            availability: fullProfile.personalInfo?.availability || 'N/A',
            location: fullProfile.personalInfo?.location || candidate.location || 'N/A',
            matchScore: 0, // sera calculé plus tard
            avatar: fullProfile.personalInfo?.profileImage || candidate.profilePicture || '',
            description: fullProfile.personalInfo?.description || 'Profil étudiant',
            languages: fullProfile.languages?.map((lang: any) => lang.name) || [],
            projects: fullProfile.projects || [],
            experiences: fullProfile.experiences || candidate.experiences || [],
            formations: fullProfile.formations || candidate.education || [],
            personalInfo: fullProfile.personalInfo || {},
            technicalSkills: fullProfile.technicalSkills || [],
            softSkills: fullProfile.softSkills || candidate.skills || []
          };

          studentProfiles.push(studentProfile);
        }
      }

      return studentProfiles;
    } catch (error) {
      console.error("Error fetching student profiles", error);
      // En cas d'erreur, retourner un tableau vide
      return [];
    }
  }

  /**
   * Extrait les compétences d'un profil utilisateur
   */
  private extractSkillsFromProfile(user: any): string[] {
    const skills: string[] = [];
    
    if (user.technicalSkills && Array.isArray(user.technicalSkills)) {
      for (const skillGroup of user.technicalSkills) {
        if (skillGroup.skills && Array.isArray(skillGroup.skills)) {
          for (const skill of skillGroup.skills) {
            skills.push(skill.name);
          }
        }
      }
    }
    
    return skills;
  }

  /**
   * Classe les étudiants selon la requête analysée
   */
  private async rankStudentsByQuery(
    students: StudentProfile[],
    queryAnalysis: SearchQueryAnalysis,
    originalQuery: string
  ): Promise<{ filteredStudents: StudentProfile[], relevanceScores: Record<string, number> }> {
    const relevanceScores: Record<string, number> = {};
    
    // Calculer le score de pertinence pour chaque étudiant
    for (const student of students) {
      const score = this.calculateRelevanceScore(student, queryAnalysis, originalQuery);
      relevanceScores[student.id] = score;
    }

    // Trier les étudiants par score de pertinence (du plus élevé au plus bas)
    const sortedStudents = students
      .filter(student => relevanceScores[student.id] > 0) // Garder seulement ceux avec un score > 0
      .sort((a, b) => relevanceScores[b.id] - relevanceScores[a.id]);

    return {
      filteredStudents: sortedStudents,
      relevanceScores
    };
  }

  /**
   * Calcule le score de pertinence entre un étudiant et une requête
   */
  private calculateRelevanceScore(
    student: StudentProfile,
    queryAnalysis: SearchQueryAnalysis,
    originalQuery: string
  ): number {
    let score = 0;
    let maxPossibleScore = 0;

    // Poids pour différents critères
    const weights = {
      keyword: 20,      // Mots-clés dans la requête
      location: 15,     // Localisation
      skills: 25,       // Compétences techniques
      experience: 10,   // Niveau d'expérience
      availability: 10, // Disponibilité
      languages: 10,    // Langues
      domain: 10        // Domaine d'expertise
    };

    // 1. Score pour les mots-clés
    if (queryAnalysis.keywords) {
      maxPossibleScore += weights.keyword;
      for (const keyword of queryAnalysis.keywords) {
        const keywordLower = keyword.toLowerCase();
        let keywordMatched = false;
        
        // Vérifier dans le nom
        if (student.name.toLowerCase().includes(keywordLower)) {
          score += weights.keyword / queryAnalysis.keywords.length;
          keywordMatched = true;
        }
        
        // Vérifier dans le titre
        if (student.title.toLowerCase().includes(keywordLower)) {
          score += weights.keyword / queryAnalysis.keywords.length;
          keywordMatched = true;
        }
        
        // Vérifier dans la description
        if (student.description.toLowerCase().includes(keywordLower)) {
          score += weights.keyword / queryAnalysis.keywords.length;
          keywordMatched = true;
        }
        
        // Vérifier dans les compétences
        if (student.skills.some(skill => skill.toLowerCase().includes(keywordLower))) {
          score += weights.keyword / queryAnalysis.keywords.length;
          keywordMatched = true;
        }
        
        // Vérifier dans les expériences
        if (student.experiences.some(exp => 
          exp.description.toLowerCase().includes(keywordLower) ||
          exp.title.toLowerCase().includes(keywordLower)
        )) {
          score += weights.keyword / queryAnalysis.keywords.length;
          keywordMatched = true;
        }
      }
    }

    // 2. Score pour la localisation
    if (queryAnalysis.location) {
      maxPossibleScore += weights.location;
      if (student.location && student.location.toLowerCase().includes(queryAnalysis.location.toLowerCase())) {
        score += weights.location;
      }
    }

    // 3. Score pour les compétences
    if (queryAnalysis.skills || queryAnalysis.technologies) {
      maxPossibleScore += weights.skills;
      const allQuerySkills = [
        ...(queryAnalysis.skills || []),
        ...(queryAnalysis.technologies || [])
      ];
      
      for (const querySkill of allQuerySkills) {
        const querySkillLower = querySkill.toLowerCase();
        if (student.skills.some(skill => 
          skill.toLowerCase().includes(querySkillLower) || 
          querySkillLower.includes(skill.toLowerCase())
        )) {
          score += weights.skills / allQuerySkills.length;
        }
      }
    }

    // 4. Score pour la disponibilité
    if (queryAnalysis.availability) {
      maxPossibleScore += weights.availability;
      if (student.availability && student.availability.toLowerCase().includes(queryAnalysis.availability.toLowerCase())) {
        score += weights.availability;
      }
    }

    // 5. Score pour les langues
    if (queryAnalysis.languages) {
      maxPossibleScore += weights.languages;
      for (const queryLang of queryAnalysis.languages) {
        const queryLangLower = queryLang.toLowerCase();
        if (student.languages.some(lang => 
          lang.toLowerCase().includes(queryLangLower) || 
          queryLangLower.includes(lang.toLowerCase())
        )) {
          score += weights.languages / queryAnalysis.languages.length;
        }
      }
    }

    // 6. Score pour le domaine
    if (queryAnalysis.domain) {
      maxPossibleScore += weights.domain;
      if (student.title.toLowerCase().includes(queryAnalysis.domain.toLowerCase()) ||
          student.description.toLowerCase().includes(queryAnalysis.domain.toLowerCase())) {
        score += weights.domain;
      }
    }

    // Calculer le score final sur 100
    const finalScore = maxPossibleScore > 0 ? Math.min(100, Math.round((score / maxPossibleScore) * 100)) : 0;
    
    // Appliquer une analyse sémantique supplémentaire pour affiner le score
    return this.applySemanticAnalysis(student, originalQuery, finalScore);
  }

  /**
   * Applique une analyse sémantique pour affiner le score
   */
  private applySemanticAnalysis(student: StudentProfile, query: string, baseScore: number): number {
    // Si le score de base est faible, on peut l'améliorer avec une analyse sémantique
    if (baseScore < 30) {
      // Utilisation d'une analyse sémantique basique pour détecter des correspondances implicites
      const queryLower = query.toLowerCase();
      const profileText = [
        student.name,
        student.title,
        student.description,
        ...student.skills,
        ...student.experiences.map(e => e.description),
        ...student.formations.map(f => f.description)
      ].join(' ').toLowerCase();

      // Calculer la similarité de texte simple
      const commonWords = queryLower.split(' ').filter(word => 
        profileText.includes(word) && word.length > 3
      ).length;

      // Améliorer le score en fonction du nombre de mots en commun
      if (commonWords > 0) {
        const semanticBoost = Math.min(30, commonWords * 5); // Boost max de 30 points
        return Math.min(100, baseScore + semanticBoost);
      }
    }

    return baseScore;
  }
}

export const studentSearchService = new StudentSearchService();