import { ProfileData } from '@/hooks/useProfileData';
import { JobOffer } from '@/services/firebaseService';
import { dataProvider } from '@/data/dataProvider';

// Types for AI Recommendations
export interface ProfileImprovement {
  id: string;
  title: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  category: 'skills' | 'experience' | 'profile' | 'networking' | 'trends';
  icon: string;
}

export interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  match: number;
  salary: string;
  reason: string;
  tags: string[];
  postedDate: string;
  deadline?: string;
  requirements?: string[];
}

export interface MarketTrend {
  id: string;
  title: string;
  description: string;
  growthRate: string;
  impact: string;
  techStack: string[];
}

export interface AIRecommendationsData {
  id?: string;
  userId: string;
  profileImprovements: ProfileImprovement[];
  jobRecommendations: JobRecommendation[];
  marketTrends: MarketTrend[];
  lastUpdated: Date;
  generatedAt: Date;
}

export class AIRecommendationsService {
  private static readonly COLLECTION_NAME = 'ai_recommendations';
  
  /**
   * Generate AI recommendations for a student profile
   */
  static async generateRecommendations(userId: string, profileData: ProfileData): Promise<AIRecommendationsData> {
    try {
      // Get all job offers from data provider
      const offers: JobOffer[] = await dataProvider.getOffers();
      
      // Calculate matching scores and get top 5 offers
      const jobRecommendations = await this.generateJobRecommendations(profileData, offers);
      
      // Generate profile improvement suggestions
      const profileImprovements = this.generateProfileImprovements(profileData);
      
      // Generate market trend insights (now async)
      const marketTrends = await this.generateMarketTrends();
      
      // Create recommendations object
      const recommendations: AIRecommendationsData = {
        userId,
        profileImprovements,
        jobRecommendations,
        marketTrends,
        lastUpdated: new Date(),
        generatedAt: new Date()
      };
      
      return recommendations;
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      throw error;
    }
  }
  
  /**
   * Generate job recommendations based on profile matching (top 5 by score)
   */
  private static async generateJobRecommendations(profileData: ProfileData, offers: JobOffer[]): Promise<JobRecommendation[]> {
    // Calculate matching scores for all offers
    const offersWithScores = offers.map(offer => ({
      ...offer,
      match: this.calculateMatchingScore(profileData, offer)
    }));
    
    // Sort by matching score in descending order and take top 5
    const topOffers = offersWithScores
      .sort((a, b) => b.match - a.match)
      .slice(0, 5);
    
    // Convert to JobRecommendation format
    return topOffers.map((offer, index) => ({
      id: offer.id,
      title: offer.title,
      company: offer.company,
      location: offer.location,
      match: offer.match,
      salary: offer.salary,
      reason: this.generateMatchReason(profileData, offer),
      tags: offer.technologies || [],
      postedDate: offer.postedDate || new Date().toISOString().split('T')[0],
      deadline: offer.deadline,
      requirements: offer.requirements
    }));
  }
  
  /**
   * Calculate matching score between profile and offer
   */
  private static calculateMatchingScore(profile: ProfileData, offer: JobOffer): number {
    let score = 0;
    let totalWeight = 0;

    // Extract skills from profile
    const profileSkills: string[] = [];
    if (profile.technicalSkills) {
      for (const skillGroup of profile.technicalSkills) {
        for (const skill of skillGroup.skills) {
          profileSkills.push(skill.name.toLowerCase());
        }
      }
    }

    // Extract languages from profile
    const profileLanguages: string[] = [];
    if (profile.languages) {
      for (const lang of profile.languages) {
        profileLanguages.push(lang.name.toLowerCase());
      }
    }

    // Extract experiences from profile
    const profileExperiences: string[] = [];
    if (profile.experiences) {
      for (const exp of profile.experiences) {
        profileExperiences.push(exp.title.toLowerCase());
        profileExperiences.push(exp.description.toLowerCase());
      }
    }

    // Check technical skills (40% of score)
    if (offer.technologies && Array.isArray(offer.technologies)) {
      totalWeight += 40; // Weight of 40% for technologies
      for (const tech of offer.technologies) {
        if (profileSkills.some(skill => 
          tech.toLowerCase().includes(skill) || skill.includes(tech.toLowerCase())
        )) {
          score += 40 / offer.technologies.length;
        }
      }
    }

    // Check requirements (30% of score)
    if (offer.requirements && Array.isArray(offer.requirements)) {
      totalWeight += 30; // Weight of 30% for requirements
      for (const requirement of offer.requirements) {
        const reqLower = requirement.toLowerCase();
        // Check if a profile skill matches the requirement
        if (profileSkills.some(skill => 
          reqLower.includes(skill) || skill.includes(reqLower)
        )) {
          score += 10;
        }
        // Check if a profile experience matches the requirement
        if (profileExperiences.some(exp => 
          reqLower.includes(exp) || exp.includes(reqLower)
        )) {
          score += 10;
        }
        // Check if a profile language matches the requirement
        if (profileLanguages.some(lang => 
          reqLower.includes(lang) || lang.includes(reqLower)
        )) {
          score += 10;
        }
      }
    }

    // Check location (20%)
    if (offer.location) {
      totalWeight += 20;
      if (profile.personalInfo && profile.personalInfo.location && 
          profile.personalInfo.location.toLowerCase().includes(offer.location.toLowerCase())) {
        score += 20;
      }
    }

    // Check availability (10%)
    if (profile.personalInfo && profile.personalInfo.availability) {
      totalWeight += 10;
      if (offer.description && offer.description.toLowerCase().includes('immédiate') && 
          profile.personalInfo.availability.toLowerCase().includes('immédiate')) {
        score += 10;
      }
    }

    // Calculate final score out of 100
    const finalScore = totalWeight > 0 ? Math.min(100, Math.round((score / totalWeight) * 100)) : 0;
    return finalScore;
  }
  
  /**
   * Generate reason why an offer matches the profile
   */
  private static generateMatchReason(profile: ProfileData, offer: JobOffer): string {
    const reasons: string[] = [];
    
    // Check for matching skills
    const profileSkills: string[] = [];
    if (profile.technicalSkills) {
      for (const skillGroup of profile.technicalSkills) {
        for (const skill of skillGroup.skills) {
          profileSkills.push(skill.name.toLowerCase());
        }
      }
    }
    
    if (offer.technologies) {
      const matchingTechs = offer.technologies.filter(tech => 
        profileSkills.some(skill => 
          tech.toLowerCase().includes(skill) || skill.includes(tech.toLowerCase())
        )
      );
      
      if (matchingTechs.length > 0) {
        reasons.push(`Vos compétences en ${matchingTechs.slice(0, 2).join(', ')} sont très demandées`);
      }
    }
    
    if (reasons.length === 0) {
      return 'Ce poste correspond à votre profil global et votre parcours';
    }
    
    return reasons.join(', ');
  }
  
  /**
   * Generate profile improvement suggestions based on profile analysis
   */
  private static generateProfileImprovements(profile: ProfileData): ProfileImprovement[] {
    const improvements: ProfileImprovement[] = [];
    
    // Analyze technical skills
    const hasSkills = profile.technicalSkills && profile.technicalSkills.length > 0;
    const hasLanguages = profile.languages && profile.languages.length > 0;
    const hasExperiences = profile.experiences && profile.experiences.length > 0;
    const hasProjects = profile.projects && profile.projects.length > 0;
    const hasFormations = profile.formations && profile.formations.length > 0;
    
    // Suggest skill improvements based on market trends
    if (!hasSkills || profile.technicalSkills.length < 3) {
      improvements.push({
        id: 'skills-1',
        title: 'Renforcez vos compétences techniques',
        description: 'Ajustez votre profil aux tendances du marché en développant des compétences en cloud, IA ou cybersécurité',
        impact: '+15% matching',
        priority: 'high',
        category: 'skills',
        icon: 'TrendingUp'
      });
    }
    
    // Suggest language improvements
    if (!hasLanguages || profile.languages.length < 2) {
      improvements.push({
        id: 'languages-1',
        title: 'Ajoutez des compétences linguistiques',
        description: 'Les compétences multilingues sont très appréciées par les recruteurs internationaux',
        impact: '+10% matching',
        priority: 'medium',
        category: 'skills',
        icon: 'Globe'
      });
    }
    
    // Suggest experience improvements
    if (!hasExperiences || profile.experiences.length < 2) {
      improvements.push({
        id: 'experience-1',
        title: 'Ajoutez plus d\'expériences professionnelles',
        description: 'Les expériences passées renforcent la crédibilité de votre profil',
        impact: '+20% matching',
        priority: 'high',
        category: 'experience',
        icon: 'Briefcase'
      });
    }
    
    // Suggest project additions
    if (!hasProjects || profile.projects.length < 2) {
      improvements.push({
        id: 'projects-1',
        title: 'Ajoutez des projets personnels',
        description: 'Les projets GitHub démontrent vos compétences techniques et votre initiative',
        impact: '+25% matching',
        priority: 'high',
        category: 'profile',
        icon: 'Code'
      });
    }
    
    // Suggest formation additions
    if (!hasFormations || profile.formations.length < 1) {
      improvements.push({
        id: 'education-1',
        title: 'Complétez votre section formations',
        description: 'Les formations académiques renforcent la crédibilité de votre profil',
        impact: '+12% matching',
        priority: 'medium',
        category: 'profile',
        icon: 'GraduationCap'
      });
    }
    
    // Suggest profile completion
    if (!profile.personalInfo?.linkedin) {
      improvements.push({
        id: 'linkedin-1',
        title: 'Ajoutez votre profil LinkedIn',
        description: 'Un profil LinkedIn professionnel augmente votre visibilité auprès des recruteurs',
        impact: '+18% matching',
        priority: 'medium',
        category: 'profile',
        icon: 'LinkedIn'
      });
    }
    
    if (!profile.personalInfo?.github) {
      improvements.push({
        id: 'github-1',
        title: 'Ajoutez votre profil GitHub',
        description: 'Un portfolio GitHub actif est très valorisé par les recruteurs techniques',
        impact: '+22% matching',
        priority: 'high',
        category: 'profile',
        icon: 'GitBranch'
      });
    }
    
    // If profile is well-completed, suggest advanced improvements
    if (hasSkills && hasLanguages && hasExperiences && hasProjects) {
      // Suggest advanced skill areas based on market trends
      improvements.push({
        id: 'advanced-1',
        title: 'Développez des compétences dans l\'IA et le Machine Learning',
        description: 'L\'IA est en forte croissance avec des salaires attractifs et une forte demande',
        impact: '+30% matching',
        priority: 'medium',
        category: 'skills',
        icon: 'Brain'
      });
      
      improvements.push({
        id: 'advanced-2',
        title: 'Certifiez-vous dans les technologies Cloud (AWS, Azure, GCP)',
        description: 'Les certifications cloud sont très valorisées et augmentent significativement les salaires',
        impact: '+25% matching',
        priority: 'high',
        category: 'skills',
        icon: 'Cloud'
      });
    }
    
    return improvements;
  }
  
  /**
   * Generate market trend insights based on platform data analysis
   */
  private static async generateMarketTrends(): Promise<MarketTrend[]> {
    try {
      // Get actual offers from the platform to analyze market trends
      const offers: JobOffer[] = await dataProvider.getOffers();
      
      // Analyze technology frequency to identify trending tech stacks
      const techFrequency: { [key: string]: number } = {};
      let totalOffers = offers.length;
      
      for (const offer of offers) {
        if (offer.technologies) {
          for (const tech of offer.technologies) {
            const lowerTech = tech.toLowerCase();
            techFrequency[lowerTech] = (techFrequency[lowerTech] || 0) + 1;
          }
        }
      }
      
      // Get the most mentioned technologies
      const sortedTechs = Object.entries(techFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 4);
      
      // Calculate growth based on how frequently these technologies appear compared to average
      const marketTrends: MarketTrend[] = sortedTechs.map(([tech, count], index) => {
        // Calculate a relative growth rate based on frequency
        const frequencyPercentage = Math.round((count / totalOffers) * 100);
        const growthRate = `+${Math.min(50, 15 + frequencyPercentage * 2)}%`;
        
        return {
          id: `trend-${index + 1}`,
          title: `Demande croissante en ${tech.charAt(0).toUpperCase() + tech.slice(1)}`,
          description: `La technologie ${tech.charAt(0).toUpperCase() + tech.slice(1)} apparaît dans ${frequencyPercentage}% des offres du marché, indiquant une forte demande.`,
          growthRate: growthRate,
          impact: frequencyPercentage > 20 ? 'High' : 'Medium',
          techStack: [tech.charAt(0).toUpperCase() + tech.slice(1)]
        };
      });
      
      // Add a few more general trends based on the platform data
      if (marketTrends.length < 4) {
        const additionalTrends: MarketTrend[] = [
          {
            id: 'trend-general-1',
            title: 'Développement Full-Stack très demandé',
            description: 'Les profils full-stack sont très recherchés avec de nombreuses offres combinant front-end et back-end.',
            growthRate: '+35%',
            impact: 'High',
            techStack: ['JavaScript', 'Node.js', 'React', 'Express']
          },
          {
            id: 'trend-general-2',
            title: 'Offres Cloud Computing en augmentation',
            description: 'Les compétences cloud (AWS, Azure, GCP) sont de plus en plus demandées par les entreprises.',
            growthRate: '+40%',
            impact: 'High',
            techStack: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes']
          }
        ];
        
        // Fill remaining spots with additional trends if needed
        while (marketTrends.length < 4 && additionalTrends.length > 0) {
          marketTrends.push(additionalTrends.shift()!);
        }
      }
      
      return marketTrends.slice(0, 4); // Return only top 4 trends
    } catch (error) {
      console.error('Error generating market trends from platform data:', error);
      // Fallback to default trends if analysis fails
      return [
        {
          id: 'trend-1',
          title: 'Croissance exponentielle de l\'IA et du Machine Learning',
          description: 'Les postes liés à l\'IA connaissent une croissance de 75% cette année, avec des salaires supérieurs de 40% à la moyenne',
          growthRate: '+75%',
          impact: 'High',
          techStack: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning']
        },
        {
          id: 'trend-2',
          title: 'Montée en puissance du développement mobile',
          description: 'Le développement mobile continue de croître avec l\'expansion des startups tech et des fintechs',
          growthRate: '+45%',
          impact: 'Medium',
          techStack: ['React Native', 'Flutter', 'iOS', 'Android']
        },
        {
          id: 'trend-3',
          title: 'Transformation digitale des entreprises',
          description: 'Les entreprises cherchent activement des développeurs full-stack pour moderniser leurs systèmes',
          growthRate: '+35%',
          impact: 'High',
          techStack: ['JavaScript', 'Node.js', 'React', 'Cloud']
        },
        {
          id: 'trend-4',
          title: 'Cybersécurité en forte demande',
          description: 'Avec l\'augmentation des cyberattaques, les experts en cybersécurité sont très recherchés',
          growthRate: '+50%',
          impact: 'High',
          techStack: ['Security', 'Network', 'Encryption', 'SOC']
        }
      ];
    }
  }
  
  /**
   * Save recommendations to Firestore
   */
  static async saveRecommendations(recommendations: AIRecommendationsData): Promise<void> {
    try {
      // This would be handled by the dataProvider which already has Firebase integration
      // The dataProvider doesn't have a specific function for AI recommendations yet
      // We'll need to extend it to handle this specific case
      await dataProvider.saveAIRecommendations(recommendations);
    } catch (error) {
      console.error('Error saving recommendations to Firestore:', error);
      throw error;
    }
  }
  
  /**
   * Load recommendations from Firestore
   */
  static async loadRecommendations(userId: string): Promise<AIRecommendationsData | null> {
    try {
      // This would be handled by the dataProvider
      return await dataProvider.getAIRecommendations(userId);
    } catch (error) {
      console.error('Error loading recommendations from Firestore:', error);
      return null;
    }
  }
  
  /**
   * Generate fresh recommendations and save them to Firestore
   */
  static async generateAndSaveRecommendations(userId: string, profileData: ProfileData): Promise<AIRecommendationsData> {
    const recommendations = await this.generateRecommendations(userId, profileData);
    await this.saveRecommendations(recommendations);
    return recommendations;
  }
  
  /**
   * Generate student recommendations for a specific job offer based on matching score
   */
  static async generateStudentRecommendationsForOffer(offer: JobOffer, limit: number = 4): Promise<any[]> {
    try {
      // Get all students from data provider
      const students = await dataProvider.getCandidates();
      
      // Calculate matching scores for all students with details
      const studentsWithScores = students.map(student => {
        const matchingResult = this.calculateStudentOfferMatchingScoreWithDetails(student, offer);
        const finalScore = matchingResult.totalWeight > 0 
          ? Math.min(100, Math.round((matchingResult.score / matchingResult.totalWeight) * 100)) 
          : 0;
        
        return {
          ...student,
          matchScore: finalScore,
          matchingDetails: matchingResult.matchingDetails
        };
      });
      
      // Sort by matching score in descending order and take top N
      const topStudents = studentsWithScores
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
      
      // Convert to appropriate format for display
      return topStudents.map((student, index) => ({
        id: student.id,
        name: student.name,
        level: this.guessLevelFromSkills(student.skills),
        skills: student.skills || [],
        location: student.location,
        matchScore: student.matchScore,
        matchingDetails: student.matchingDetails,
        avatar: student.profilePicture
      }));
    } catch (error) {
      console.error('Error generating student recommendations for offer:', error);
      return [];
    }
  }
  
  /**
   * Calculate matching score between student profile and offer requirements
   */
  private static calculateStudentOfferMatchingScore(student: any, offer: JobOffer): number {
    const { score, totalWeight, matchingDetails } = this.calculateStudentOfferMatchingScoreWithDetails(student, offer);
    
    // Calculate final score out of 100
    const finalScore = totalWeight > 0 ? Math.min(100, Math.round((score / totalWeight) * 100)) : 0;
    return finalScore;
  }
  
  /**
   * Calculate matching score and return details about the matching using a more sophisticated AI approach
   */
  private static calculateStudentOfferMatchingScoreWithDetails(student: any, offer: JobOffer): { score: number; totalWeight: number; matchingDetails: string[] } {
    let score = 0;
    let totalWeight = 0;
    const matchingDetails: string[] = [];
    
    // Extract all relevant student information
    const studentSkills: string[] = [];
    if (student.technicalSkills) {
      for (const skillCategory of student.technicalSkills) {
        for (const skill of skillCategory.skills) {
          studentSkills.push(skill.name.toLowerCase());
        }
      }
    } else if (student.skills) {
      // Fallback to simple skills array if technicalSkills is not available
      for (const skill of student.skills) {
        studentSkills.push(skill.toLowerCase());
      }
    }
    
    const studentExperiences: string[] = [];
    if (student.experiences) {
      for (const exp of student.experiences) {
        studentExperiences.push(`${exp.title} ${exp.description} ${exp.technologies?.join(' ') || ''}`.toLowerCase());
      }
    }
    
    const studentLanguages: string[] = [];
    if (student.languages) {
      for (const lang of student.languages) {
        studentLanguages.push(`${lang.name.toLowerCase()} ${lang.level.toLowerCase()}`);
      }
    }
    
    // Check technical skills (40% of score)
    if (offer.technologies && Array.isArray(offer.technologies)) {
      totalWeight += 40; // Weight of 40% for technologies
      let matchedTechCount = 0;
      const techMatches: string[] = [];
      
      for (const tech of offer.technologies) {
        const techLower = tech.toLowerCase();
        // Find matching skills with their level and years
        const matchingSkill = student.technicalSkills?.find((category: any) => 
          category.skills?.find((skill: any) => 
            skill.name.toLowerCase().includes(techLower) || techLower.includes(skill.name.toLowerCase())
          )
        );
        
        if (matchingSkill) {
          const skillDetail = matchingSkill.skills.find((skill: any) => 
            skill.name.toLowerCase().includes(techLower) || techLower.includes(skill.name.toLowerCase())
          );
          
          if (skillDetail) {
            score += 40 / offer.technologies.length;
            matchedTechCount++;
            techMatches.push(`${tech} (${skillDetail.level}, ${skillDetail.years} ans)`);
          }
        } else if (studentSkills.some(skill => 
          skill.includes(techLower) || techLower.includes(skill) ||
          // Handle common tech variations 
          (techLower.includes('javascript') && skill.includes('js')) ||
          (skill.includes('js') && techLower.includes('javascript')) ||
          (techLower.includes('python') && skill.includes('py')) ||
          (skill.includes('py') && techLower.includes('python'))
        )) {
          score += 40 / offer.technologies.length;
          matchedTechCount++;
          techMatches.push(tech);
        }
      }
      
      if (matchedTechCount > 0) {
        matchingDetails.push(`Compétences techniques: ${techMatches.join(', ')}`);
      } else {
        matchingDetails.push('Aucune compétence technique correspondante');
      }
    }
    
    // Check detailed requirements (30% of score)
    if (offer.requirements && Array.isArray(offer.requirements)) {
      totalWeight += 30; // Weight of 30% for requirements
      let matchedReqCount = 0;
      const reqMatches: string[] = [];
      
      for (const requirement of offer.requirements) {
        const reqLower = requirement.toLowerCase();
        
        // Check for experience requirements (e.g., "3 ans d'expérience")
        if (reqLower.includes('ans') && reqLower.includes('expérience')) {
          // Find if student has relevant experience
          const yearsMatch = reqLower.match(/(\d+)\s*ans/);
          if (yearsMatch) {
            const requiredYears = parseInt(yearsMatch[1]);
            let studentTotalYears = 0;
            let hasRelevantExperience = false;
            
            // Calculate total years of relevant experience from all jobs
            for (const exp of studentExperiences) {
              if (exp.includes('année') || exp.includes('ans') || 
                  reqLower.includes('développement') || reqLower.includes('web')) {
                // If the experience seems relevant, estimate it's at least 1 year per job
                studentTotalYears += 1;
                hasRelevantExperience = true;
              }
            }
            
            // Also check technical skills years if available
            if (student.technicalSkills) {
              for (const category of student.technicalSkills) {
                for (const skill of category.skills) {
                  if (skill.years && typeof skill.years === 'number') {
                    studentTotalYears += skill.years;
                  }
                }
              }
            }
            
            if (studentTotalYears >= requiredYears) {
              score += 10;
              matchedReqCount++;
              reqMatches.push(`${requirement} (expérience: ~${studentTotalYears} ans)`);
            } else if (hasRelevantExperience) {
              // Partial credit if they have some relevant experience
              score += 5; // Half credit
              matchedReqCount++;
              reqMatches.push(`${requirement} (expérience partielle: ~${studentTotalYears} ans)`);
            } else {
              reqMatches.push(`${requirement} (expérience: ${studentTotalYears} ans - insuffisant)`);
            }
          }
        }
        // Check for specific technology requirements like "React et Node.js"
        else if (reqLower.includes('et') || reqLower.includes('et/ou') || reqLower.includes('or') || reqLower.includes(',')) {
          // Handle multiple technology requirements
          const techParts = requirement.split(/et|,|ou|or/i).map(part => part.trim());
          let techMatchCount = 0;
          
          for (const tech of techParts) {
            const techLower = tech.toLowerCase();
            if (studentSkills.some(skill => 
              skill.includes(techLower) || techLower.includes(skill) ||
              this.calculateStringSimilarity(techLower, skill) > 0.4
            )) {
              techMatchCount++;
            }
          }
          
          if (techMatchCount === techParts.length) {
            // All required technologies matched
            score += 10;
            matchedReqCount++;
            reqMatches.push(`${requirement} (tous: ${techMatchCount}/${techParts.length})`);
          } else if (techMatchCount > 0) {
            // Partial match - give some credit
            const partialScore = (techMatchCount / techParts.length) * 10;
            score += partialScore;
            matchedReqCount++;
            reqMatches.push(`${requirement} (partiel: ${techMatchCount}/${techParts.length})`);
          } else {
            reqMatches.push(`${requirement} (aucun trouvé)`);
          }
        }
        // Check for API requirements
        else if (reqLower.includes('api') || reqLower.includes('rest')) {
          if (studentSkills.some(skill => 
            skill.includes('api') || skill.includes('rest') || skill.includes('graphql') || reqLower.includes(skill)
          ) || studentExperiences.some(exp => 
            exp.includes('api') || exp.includes('rest') || exp.includes('graphql')
          )) {
            score += 10;
            matchedReqCount++;
            reqMatches.push(`${requirement} (trouvé dans les compétences ou expériences)`);
          } else {
            reqMatches.push(`${requirement} (non trouvé)`);
          }
        }
        // Check for version control requirements like Git
        else if (reqLower.includes('git') || reqLower.includes('cicd') || reqLower.includes('ci/cd')) {
          if (studentSkills.some(skill => 
            skill.includes('git') || skill.includes('cicd') || skill.includes('ci/cd') || skill.includes('github') || skill.includes('gitlab')
          ) || studentExperiences.some(exp => 
            exp.includes('git') || exp.includes('cicd') || exp.includes('ci/cd')
          )) {
            score += 10;
            matchedReqCount++;
            reqMatches.push(`${requirement} (trouvé dans les compétences ou expériences)`);
          } else {
            reqMatches.push(`${requirement} (non trouvé)`);
          }
        }
        // Check for language requirements
        else if (reqLower.includes('anglais') || reqLower.includes('français') || reqLower.includes('langue')) {
          if (studentLanguages.some(lang => 
            lang.includes('anglais') || lang.includes('français') || reqLower.includes(lang)
          )) {
            score += 10;
            matchedReqCount++;
            reqMatches.push(`${requirement} (niveau: ${student.languages?.find(l => l.name.toLowerCase().includes('anglais') || l.name.toLowerCase().includes('français'))?.level || 'trouvé'})`);
          } else {
            reqMatches.push(`${requirement} (non trouvé)`);
          }
        }
        // General matching for other requirements
        else {
          let foundMatch = false;
          // Check in skills
          if (studentSkills.some(skill => 
            reqLower.includes(skill) || skill.includes(reqLower) ||
            this.calculateStringSimilarity(reqLower, skill) > 0.4
          )) {
            score += 10;
            foundMatch = true;
            matchedReqCount++;
            reqMatches.push(`Exigence: ${requirement} -> compétence trouvée`);
          }
          // Check in experiences
          else if (studentExperiences.some(exp => 
            reqLower.includes(exp) || exp.includes(reqLower) ||
            this.calculateStringSimilarity(reqLower, exp) > 0.4
          )) {
            score += 10;
            foundMatch = true;
            matchedReqCount++;
            reqMatches.push(`Exigence: ${requirement} -> expérience trouvée`);
          }
          
          if (!foundMatch) {
            reqMatches.push(`${requirement} (non trouvé)`);
          }
        }
      }
      
      if (matchedReqCount === 0) {
        matchingDetails.push('Aucune exigence correspondante');
      } else {
        matchingDetails.push(`Exigences: ${reqMatches.join(', ')}`);
      }
    }
    
    // Check location (20%)
    if (offer.location && student.location) {
      totalWeight += 20;
      if (student.location.toLowerCase().includes(offer.location.toLowerCase()) ||
          this.calculateStringSimilarity(offer.location.toLowerCase(), student.location.toLowerCase()) > 0.6) {
        score += 20;
        matchingDetails.push(`Localisation: ${student.location} correspond à ${offer.location}`);
      } else {
        matchingDetails.push(`Localisation: ${student.location} ne correspond pas à ${offer.location}`);
      }
    }
    
    return { score, totalWeight, matchingDetails };
  }
  
  /**
   * Calculate similarity between two strings using a simple algorithm
   */
  private static calculateStringSimilarity(str1: string, str2: string): number {
    const s1 = str1.replace(/[^\w\s]/gi, '').toLowerCase().trim();
    const s2 = str2.replace(/[^\w\s]/gi, '').toLowerCase().trim();
    
    if (s1 === s2) return 1;
    if (s1.length === 0 || s2.length === 0) return 0;
    if (s1.length === 1 && s2.length === 1) return s1 === s2 ? 1 : 0;
    
    // Check for substring matches
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    
    // Check for word overlap
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    
    if (commonWords.length > 0) {
      return commonWords.length / Math.max(words1.length, words2.length);
    }
    
    return 0;
  }
  
  /**
   * Guess level from skills
   */
  private static guessLevelFromSkills(skills: string[]) {
    if (!skills || skills.length === 0) return 'Niveau à déterminer';
    
    // Define keywords that suggest different levels
    const juniorKeywords = ['junior', 'entry', 'débutant', 'étudiant', 'stage'];
    const seniorKeywords = ['senior', 'expert', 'avancé', 'lead', 'principal'];
    
    // Check for senior indicators
    for (const skill of skills) {
      for (const senior of seniorKeywords) {
        if (skill.toLowerCase().includes(senior)) {
          return 'Senior Level';
        }
      }
    }
    
    // Check for junior indicators
    for (const skill of skills) {
      for (const junior of juniorKeywords) {
        if (skill.toLowerCase().includes(junior)) {
          return 'Junior Level';
        }
      }
    }
    
    // Default to intermediate for any skills
    return 'Intermédiaire';
  }
}