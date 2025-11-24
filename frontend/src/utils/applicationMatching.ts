import { Application } from '@/services/firebaseService';
import { JobOffer } from '@/services/firebaseService';

// Extended Application type with matching score
export interface ApplicationWithMatching extends Application {
  matchScore?: number;
  matchingDetails?: string[];
}

/**
 * Calculate matching score between a candidate profile and a job offer
 */
export const calculateApplicationMatchingScore = async (
  application: Application,
  offer: JobOffer,
  getCandidateProfile: (id: string) => Promise<any>
): Promise<{ matchScore: number; matchingDetails: string[] }> => {
  try {
    // Get the candidate profile
    const candidateProfile = await getCandidateProfile(application.studentId);
    
    if (!candidateProfile) {
      return { matchScore: 0, matchingDetails: ['Profil candidat non trouvé'] };
    }
    
    // Extract all relevant candidate information
    const candidateSkills: string[] = [];
    if (candidateProfile.technicalSkills) {
      for (const skillCategory of candidateProfile.technicalSkills) {
        for (const skill of skillCategory.skills) {
          candidateSkills.push(skill.name.toLowerCase());
        }
      }
    } else if (candidateProfile.skills) {
      for (const skill of candidateProfile.skills) {
        candidateSkills.push(skill.toLowerCase());
      }
    }

    const candidateExperiences: string[] = [];
    if (candidateProfile.experiences) {
      for (const exp of candidateProfile.experiences) {
        candidateExperiences.push(`${exp.title} ${exp.description} ${exp.technologies?.join(' ') || ''}`.toLowerCase());
      }
    }

    const candidateLanguages: string[] = [];
    if (candidateProfile.languages) {
      for (const lang of candidateProfile.languages) {
        candidateLanguages.push(`${lang.name.toLowerCase()} ${lang.level.toLowerCase()}`);
      }
    }

    let score = 0;
    let totalWeight = 0;
    const matchingDetails: string[] = [];

    // Check technical skills (40% of score)
    if (offer.technologies && Array.isArray(offer.technologies)) {
      totalWeight += 40; // Weight of 40% for technologies
      let matchedTechCount = 0;
      const techMatches: string[] = [];

      for (const tech of offer.technologies) {
        const techLower = tech.toLowerCase();
        // Find matching skills with their level and years
        const matchingSkill = candidateProfile.technicalSkills?.find((category: any) =>
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
            techMatches.push(`${tech} (${skillDetail.level})`);
          }
        } else if (candidateSkills.some(skill =>
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
          // Find if candidate has relevant experience
          const yearsMatch = reqLower.match(/(\d+)\s*ans/);
          if (yearsMatch) {
            const requiredYears = parseInt(yearsMatch[1]);
            let candidateTotalYears = 0;
            let hasRelevantExperience = false;

            // Calculate total years of relevant experience from all jobs
            for (const exp of candidateExperiences) {
              if (exp.includes('année') || exp.includes('ans') ||
                  reqLower.includes('développement') || reqLower.includes('web')) {
                // If the experience seems relevant, estimate it's at least 1 year per job
                candidateTotalYears += 1;
                hasRelevantExperience = true;
              }
            }

            // Also check technical skills years if available
            if (candidateProfile.technicalSkills) {
              for (const category of candidateProfile.technicalSkills) {
                for (const skill of category.skills) {
                  if (skill.years && typeof skill.years === 'number') {
                    candidateTotalYears += skill.years;
                  }
                }
              }
            }

            if (candidateTotalYears >= requiredYears) {
              score += 10;
              matchedReqCount++;
              reqMatches.push(`${requirement} (expérience: ~${candidateTotalYears} ans)`);
            } else if (hasRelevantExperience) {
              // Partial credit if they have some relevant experience
              score += 5; // Half credit
              matchedReqCount++;
              reqMatches.push(`${requirement} (expérience partielle: ~${candidateTotalYears} ans)`);
            } else {
              reqMatches.push(`${requirement} (expérience: ${candidateTotalYears} ans - insuffisant)`);
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
            if (candidateSkills.some(skill =>
              skill.includes(techLower) || techLower.includes(skill) ||
              calculateStringSimilarity(techLower, skill) > 0.4
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
          if (candidateSkills.some(skill =>
            skill.includes('api') || skill.includes('rest') || skill.includes('graphql') || reqLower.includes(skill)
          ) || candidateExperiences.some(exp =>
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
          if (candidateSkills.some(skill =>
            skill.includes('git') || skill.includes('cicd') || skill.includes('ci/cd') || skill.includes('github') || skill.includes('gitlab')
          ) || candidateExperiences.some(exp =>
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
          if (candidateLanguages.some(lang =>
            lang.includes('anglais') || lang.includes('français') || reqLower.includes(lang)
          )) {
            score += 10;
            matchedReqCount++;
            reqMatches.push(`${requirement} (niveau: ${candidateProfile.languages?.find((l: any) => l.name.toLowerCase().includes('anglais') || l.name.toLowerCase().includes('français'))?.level || 'trouvé'})`);
          } else {
            reqMatches.push(`${requirement} (non trouvé)`);
          }
        }
        // General matching for other requirements
        else {
          let foundMatch = false;
          // Check in skills
          if (candidateSkills.some(skill =>
            reqLower.includes(skill) || skill.includes(reqLower) ||
            calculateStringSimilarity(reqLower, skill) > 0.4
          )) {
            score += 10;
            foundMatch = true;
            matchedReqCount++;
            reqMatches.push(`Exigence: ${requirement} -> compétence trouvée`);
          }
          // Check in experiences
          else if (candidateExperiences.some(exp =>
            reqLower.includes(exp) || exp.includes(reqLower) ||
            calculateStringSimilarity(reqLower, exp) > 0.4
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
    if (offer.location && application.location) {
      totalWeight += 20;
      if (application.location.toLowerCase().includes(offer.location.toLowerCase()) ||
          calculateStringSimilarity(offer.location.toLowerCase(), application.location.toLowerCase()) > 0.6) {
        score += 20;
        matchingDetails.push(`Localisation: ${application.location} correspond à ${offer.location}`);
      } else {
        matchingDetails.push(`Localisation: ${application.location} ne correspond pas à ${offer.location}`);
      }
    }

    // Calculate final score out of 100
    const finalScore = totalWeight > 0 ? Math.min(100, Math.round((score / totalWeight) * 100)) : 0;
    
    return { matchScore: finalScore, matchingDetails };
  } catch (error) {
    console.error('Error calculating application matching score:', error);
    return { matchScore: 0, matchingDetails: ['Erreur de calcul du matching'] };
  }
};

/**
 * Calculate similarity between two strings using a simple algorithm
 */
const calculateStringSimilarity = (str1: string, str2: string): number => {
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
};

/**
 * Format the matching score as a percentage with appropriate color
 */
export const getMatchScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Format the matching score as a badge with appropriate variant
 */
export const getMatchScoreVariant = (score: number): string => {
  if (score >= 80) return 'bg-green-100 text-green-700';
  if (score >= 60) return 'bg-yellow-100 text-yellow-700';
  if (score >= 40) return 'bg-orange-100 text-orange-700';
  return 'bg-red-100 text-red-700';
};