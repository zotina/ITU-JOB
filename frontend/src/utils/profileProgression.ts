import { ProfileData } from '@/hooks/useProfileData';

// Mapper les niveaux de string à des entiers pour le calcul
const levelMap: { [key: string]: number } = {
  'Débutant': 1,
  'Intermédiaire': 2,
  'Avancé': 3,
  'Expert': 4,
};

export const calculateProfileProgression = (profile: ProfileData) => {
  const progression_details: { [key: string]: number } = {};

  // ==========================================
  // 1. INFORMATIONS PERSONNELLES (20%)
  // ==========================================
  let info_score = 0;
  if (profile.personalInfo) {
    const { profileImage, title, description, location, linkedin, availability } = profile.personalInfo;
    info_score += profileImage ? 15 : 0;
    info_score += title ? 15 : 0;
    info_score += (description && description.length >= 100) ? 20 : ((description?.length || 0) >= 50 ? 10 : 0);
    info_score += location ? 15 : 0; // Simplifié, car pas de ville/pays séparés
    info_score += linkedin ? 10 : 0;
    info_score += availability ? 10 : 0;
    // Les champs date_naissance, type_recherche n'existent pas dans ProfileData
  }
  const info_percentage = Math.min(100, info_score);
  progression_details['info_personnel'] = info_percentage;

  // ==========================================
  // 2. FORMATIONS (15%)
  // ==========================================
  let formation_score = 0;
  const formations = profile.formations || [];
  if (formations.length > 0) {
    formation_score += 40; // Base
    formation_score += Math.min(20, (formations.length - 1) * 10); // Bonus quantité
    for (const formation of formations.slice(0, 3)) {
      if (formation.description && formation.description.length >= 50) formation_score += 8;
      if (formation.fieldOfStudy) formation_score += 4;
      // La localisation n'est pas dans la data de formation, on l'ignore
      if (formation.period) formation_score += 4; // On se base sur `period`
    }
  }
  const formation_percentage = Math.min(100, formation_score);
  progression_details['formation'] = formation_percentage;

  // ==========================================
  // 3. EXPÉRIENCES PROFESSIONNELLES (25%)
  // ==========================================
  let experience_score = 0;
  const experiences = profile.experiences || [];
  if (experiences.length > 0) {
    experience_score += 35; // Base
    experience_score += Math.min(20, (experiences.length - 1) * 10); // Bonus quantité
    for (const exp of experiences.slice(0, 3)) {
      if (exp.description && exp.description.length >= 100) experience_score += 10;
      if (exp.type) experience_score += 3;
      if (exp.location) experience_score += 3;
      if (exp.period) experience_score += 4; // On se base sur `period` au lieu de `date_debut`
    }
  }
  const experience_percentage = Math.min(100, experience_score);
  progression_details['experience'] = experience_percentage;

  // ==========================================
  // 4. COMPÉTENCES TECHNIQUES (25%)
  // ==========================================
  let competence_score = 0;
  const allSkills = profile.technicalSkills?.flatMap(group => group.skills) || [];
  if (allSkills.length > 0) {
    if (allSkills.length >= 3) competence_score += 40; else competence_score += allSkills.length * 13;
    competence_score += Math.min(25, Math.max(0, allSkills.length - 3) * 3.5);
    
    const withLevel = allSkills.filter(s => s.level).length;
    competence_score += Math.min(20, withLevel * 2);

    const expertLevel = allSkills.filter(s => levelMap[s.level] >= 4).length;
    competence_score += Math.min(10, expertLevel * 5);
    // annees_experience n'existe pas sur les compétences
  }
  const competence_percentage = Math.min(100, competence_score);
  progression_details['competence'] = competence_percentage;

  // ==========================================
  // 5. SOFT SKILLS (10%)
  // ==========================================
  let soft_skills_score = 0;
  const soft_skills = profile.softSkills || [];
  if (soft_skills.length > 0) {
    if (soft_skills.length >= 3) soft_skills_score += 60; else soft_skills_score += soft_skills.length * 20;
    soft_skills_score += Math.min(30, Math.max(0, soft_skills.length - 3) * 10);
    // Le niveau n'existe pas pour les soft skills dans ProfileData
  }
  const soft_skills_percentage = Math.min(100, soft_skills_score);
  progression_details['soft_skills'] = soft_skills_percentage;

  // ==========================================
  // 6. LANGUES (5%)
  // ==========================================
  let langue_score = 0;
  const langues = profile.languages || [];
  if (langues.length > 0) {
    if (langues.length >= 2) langue_score += 60; else langue_score += 30;
    langue_score += Math.min(25, Math.max(0, langues.length - 2) * 12.5);
    const withLevel = langues.filter(l => l.level).length;
    langue_score += Math.min(15, withLevel * 5);
  }
  const langue_percentage = Math.min(100, langue_score);
  progression_details['langue'] = langue_percentage;

  // ==========================================
  // CALCUL PROGRESSION GLOBALE
  // ==========================================
  const weights = {
    info_personnel: 0.20,
    formation: 0.15,
    experience: 0.25,
    competence: 0.25,
    soft_skills: 0.10,
    langue: 0.05,
  };

  const total_progression = 
    (info_percentage * weights.info_personnel) +
    (formation_percentage * weights.formation) +
    (experience_percentage * weights.experience) +
    (competence_percentage * weights.competence) +
    (soft_skills_percentage * weights.soft_skills) +
    (langue_percentage * weights.langue);

  return {
    progression: Math.round(total_progression),
    progression_metadata: progression_details,
  };
};
