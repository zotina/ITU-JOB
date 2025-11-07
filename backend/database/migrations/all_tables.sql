-- SQL Script with all tables from migrations (excluding users, cache, and jobs tables)

-- Table: role
CREATE TABLE role (
    id VARCHAR(50) PRIMARY KEY,
    val VARCHAR(50),
    description VARCHAR(100) NULL
);

-- Indexes for role table
CREATE INDEX idx_role_val ON role(val);

-- Table: utilisateur
CREATE TABLE utilisateur (
    id VARCHAR(50) PRIMARY KEY,
    mot_de_passe_hash VARCHAR(255),
    email VARCHAR(100) UNIQUE NOT NULL,
    prenom VARCHAR(50) NULL,
    nom VARCHAR(50) NULL,
    telephone VARCHAR(20) NULL,
    adresse TEXT NULL,
    est_actif INT DEFAULT 1,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_derniere_connexion TIMESTAMP NULL,
    id_role VARCHAR(50)
);

-- Indexes for utilisateur table
CREATE INDEX idx_utilisateur_email ON utilisateur(email);
CREATE INDEX idx_utilisateur_telephone ON utilisateur(telephone);
CREATE INDEX idx_utilisateur_est_actif ON utilisateur(est_actif);
CREATE INDEX idx_utilisateur_id_role ON utilisateur(id_role);

-- Foreign key constraint for utilisateur table
ALTER TABLE utilisateur ADD CONSTRAINT fk_utilisateur_id_role 
    FOREIGN KEY (id_role) REFERENCES role(id) ON DELETE CASCADE;

-- Table: profil_etudiant
CREATE TABLE profil_etudiant (
    id VARCHAR(50) PRIMARY KEY,
    id_utilisateur VARCHAR(50) UNIQUE,
    photo_profil_url TEXT NULL,
    titre VARCHAR(255) NULL,
    bio TEXT NULL,
    date_naissance DATE NULL,
    ville VARCHAR(100) NULL,
    pays VARCHAR(100) NULL,
    code_pays CHAR(2) NULL,
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    linkedin_url TEXT NULL,
    github_url TEXT NULL,
    portfolio_url TEXT NULL,
    disponibilite VARCHAR(50) NULL,
    type_recherche VARCHAR(50) NULL,
    taux_journalier DECIMAL(10, 2) NULL,
    mobilite VARCHAR(50) NULL,
    teletravail_preference VARCHAR(50) NULL,
    salaire_minimum_souhaite DECIMAL(10, 2) NULL,
    devise_salaire CHAR(3) DEFAULT 'EUR',
    profil_complete_pourcentage INT DEFAULT 0,
    nb_vues_profil INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Foreign key constraint for profil_etudiant table
ALTER TABLE profil_etudiant ADD CONSTRAINT fk_profil_etudiant_id_utilisateur 
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id) ON DELETE CASCADE;

-- Table: profil_recruteur
CREATE TABLE profil_recruteur (   
    id VARCHAR(50) PRIMARY KEY,
    id_utilisateur VARCHAR(50) UNIQUE,
    nom_entreprise VARCHAR(255),
    slug_entreprise VARCHAR(255) UNIQUE,
    logo_url TEXT NULL,
    banniere_url TEXT NULL,
    description_entreprise TEXT NULL,
    site_web TEXT NULL,
    secteur_activite VARCHAR(100) NULL,
    taille_entreprise VARCHAR(50) NULL,
    annee_creation INT NULL,
    ville VARCHAR(100) NULL,
    pays VARCHAR(100) NULL,
    code_pays CHAR(2) NULL,
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    nom_contact VARCHAR(100) NULL,
    poste_contact VARCHAR(100) NULL,
    email_contact VARCHAR(255) NULL,
    telephone_contact VARCHAR(50) NULL,
    linkedin_url TEXT NULL,
    twitter_url TEXT NULL,
    facebook_url TEXT NULL, 
    nb_offres_actives INT DEFAULT 0,
    nb_candidatures_recues INT DEFAULT 0,
    nb_entretiens_planifies INT DEFAULT 0,
    nb_embauches INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Foreign key constraint for profil_recruteur table
ALTER TABLE profil_recruteur ADD CONSTRAINT fk_profil_recruteur_id_utilisateur 
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id) ON DELETE CASCADE;

-- Table: competences_etudiant
CREATE TABLE competences_etudiant (
    id VARCHAR(50) PRIMARY KEY,
    id_profil_etudiant VARCHAR(50),
    nom_competence VARCHAR(100),
    categorie VARCHAR(50) NULL,
    niveau VARCHAR(50) NULL,
    niveau_int INT NULL,
    annees_experience DECIMAL(3, 1) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Foreign key constraint for competences_etudiant table
ALTER TABLE competences_etudiant ADD CONSTRAINT fk_competences_etudiant_id_profil_etudiant 
    FOREIGN KEY (id_profil_etudiant) REFERENCES profil_etudiant(id) ON DELETE CASCADE;

-- Table: langues_etudiant
CREATE TABLE langues_etudiant (
    id VARCHAR(50) PRIMARY KEY,
    id_profil_etudiant VARCHAR(50),
    nom_langue VARCHAR(50),
    niveau VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Foreign key constraint for langues_etudiant table
ALTER TABLE langues_etudiant ADD CONSTRAINT fk_langues_etudiant_id_profil_etudiant 
    FOREIGN KEY (id_profil_etudiant) REFERENCES profil_etudiant(id) ON DELETE CASCADE;

-- Table: soft_skills_etudiant
CREATE TABLE soft_skills_etudiant (
    id VARCHAR(50) PRIMARY KEY,
    id_profil_etudiant VARCHAR(50),
    nom_soft_skill VARCHAR(100),
    niveau VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Foreign key constraint for soft_skills_etudiant table
ALTER TABLE soft_skills_etudiant ADD CONSTRAINT fk_soft_skills_etudiant_id_profil_etudiant 
    FOREIGN KEY (id_profil_etudiant) REFERENCES profil_etudiant(id) ON DELETE CASCADE;

-- Table: experience_professionnelle
CREATE TABLE experience_professionnelle (
    id VARCHAR(50) PRIMARY KEY,
    id_profil_etudiant VARCHAR(50),
    titre_poste VARCHAR(255),
    nom_entreprise VARCHAR(255),
    type_contrat VARCHAR(50) NULL,
    date_debut DATE,
    date_fin DATE NULL,
    en_cours BOOLEAN DEFAULT FALSE,
    description TEXT NULL,
    ville VARCHAR(100) NULL,
    pays VARCHAR(100) NULL,
    ordre_affichage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Foreign key constraint for experience_professionnelle table
ALTER TABLE experience_professionnelle ADD CONSTRAINT fk_experience_professionnelle_id_profil_etudiant 
    FOREIGN KEY (id_profil_etudiant) REFERENCES profil_etudiant(id) ON DELETE CASCADE;

-- Table: formation
CREATE TABLE formation (
    id VARCHAR(50) PRIMARY KEY,
    id_profil_etudiant VARCHAR(50),
    diplome VARCHAR(255),
    etablissement VARCHAR(255),
    domaine_etude VARCHAR(100) NULL,
    date_debut DATE,
    date_fin DATE NULL,
    en_cours BOOLEAN DEFAULT FALSE,
    description TEXT NULL,
    ville VARCHAR(100) NULL,
    pays VARCHAR(100) NULL,
    ordre_affichage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Foreign key constraint for formation table
ALTER TABLE formation ADD CONSTRAINT fk_formation_id_profil_etudiant 
    FOREIGN KEY (id_profil_etudiant) REFERENCES profil_etudiant(id) ON DELETE CASCADE;

-- Table: certifications
CREATE TABLE certifications (
    id VARCHAR(50) PRIMARY KEY,
    id_profil_etudiant VARCHAR(50),
    nom_certification VARCHAR(255),
    organisme VARCHAR(255),
    date_obtention DATE,
    date_expiration DATE NULL,
    url_credential TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Foreign key constraint for certifications table
ALTER TABLE certifications ADD CONSTRAINT fk_certifications_id_profil_etudiant 
    FOREIGN KEY (id_profil_etudiant) REFERENCES profil_etudiant(id) ON DELETE CASCADE;

-- Table: projets
CREATE TABLE projets (
    id VARCHAR(50) PRIMARY KEY,
    id_profil_etudiant VARCHAR(50),
    nom_projet VARCHAR(255),
    description TEXT,
    url_projet TEXT NULL,
    url_github TEXT NULL,
    image_apercu_url TEXT NULL,
    date_debut DATE NULL,
    date_fin DATE NULL,
    technologies JSON NULL,
    ordre_affichage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Foreign key constraint for projets table
ALTER TABLE projets ADD CONSTRAINT fk_projets_id_profil_etudiant 
    FOREIGN KEY (id_profil_etudiant) REFERENCES profil_etudiant(id) ON DELETE CASCADE;

-- Table: offres_emploi
CREATE TABLE offres_emploi (
    id VARCHAR(50) PRIMARY KEY,
    id_profil_recruteur VARCHAR(50),
    titre VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    type_contrat VARCHAR(50),
    mode_travail VARCHAR(50) DEFAULT 'presentiel',
    niveau_experience VARCHAR(50) NULL,
    ville VARCHAR(100) NULL,
    pays VARCHAR(100) NULL,
    code_pays CHAR(2) NULL,
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    salaire_min DECIMAL(10, 2) NULL,
    salaire_max DECIMAL(10, 2) NULL,
    devise_salaire CHAR(3) DEFAULT 'EUR',
    periode_salaire VARCHAR(20) DEFAULT 'annuel',
    statut VARCHAR(50) DEFAULT 'brouillon',
    date_publication TIMESTAMP NULL,
    date_expiration TIMESTAMP NULL,
    nb_vues INT DEFAULT 0,
    nb_candidatures INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Foreign key constraint for offres_emploi table
ALTER TABLE offres_emploi ADD CONSTRAINT fk_offres_emploi_id_profil_recruteur 
    FOREIGN KEY (id_profil_recruteur) REFERENCES profil_recruteur(id) ON DELETE CASCADE;

-- Table: competences_requises_offre
CREATE TABLE competences_requises_offre (
    id VARCHAR(50) PRIMARY KEY,
    id_offre_emploi VARCHAR(50),
    nom_competence VARCHAR(100),
    est_obligatoire BOOLEAN DEFAULT TRUE,
    niveau_requis VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Foreign key constraint for competences_requises_offre table
ALTER TABLE competences_requises_offre ADD CONSTRAINT fk_competences_requises_offre_id_offre_emploi 
    FOREIGN KEY (id_offre_emploi) REFERENCES offres_emploi(id) ON DELETE CASCADE;

-- Table: candidatures
CREATE TABLE candidatures (
    id VARCHAR(50) PRIMARY KEY,
    id_offre_emploi VARCHAR(50),
    id_profil_etudiant VARCHAR(50),
    statut VARCHAR(50) DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Unique constraint for candidatures table
ALTER TABLE candidatures ADD CONSTRAINT uk_candidatures_offre_etudiant 
    UNIQUE (id_offre_emploi, id_profil_etudiant);

-- Foreign key constraints for candidatures table
ALTER TABLE candidatures ADD CONSTRAINT fk_candidatures_id_offre_emploi 
    FOREIGN KEY (id_offre_emploi) REFERENCES offres_emploi(id) ON DELETE CASCADE;
ALTER TABLE candidatures ADD CONSTRAINT fk_candidatures_id_profil_etudiant 
    FOREIGN KEY (id_profil_etudiant) REFERENCES profil_etudiant(id) ON DELETE CASCADE;

-- Table: offres_sauvegardees
CREATE TABLE offres_sauvegardees (
    id_profil_etudiant VARCHAR(50),
    id_offre_emploi VARCHAR(50),
    date_sauvegarde TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT NULL,
    PRIMARY KEY (id_profil_etudiant, id_offre_emploi)
);

-- Foreign key constraints for offres_sauvegardees table
ALTER TABLE offres_sauvegardees ADD CONSTRAINT fk_offres_sauvegardees_id_profil_etudiant 
    FOREIGN KEY (id_profil_etudiant) REFERENCES profil_etudiant(id) ON DELETE CASCADE;
ALTER TABLE offres_sauvegardees ADD CONSTRAINT fk_offres_sauvegardees_id_offre_emploi 
    FOREIGN KEY (id_offre_emploi) REFERENCES offres_emploi(id) ON DELETE CASCADE;

-- Table: notification
CREATE TABLE notification (
    id VARCHAR(50) PRIMARY KEY,
    id_receveur VARCHAR(50),
    id_emetteur VARCHAR(50) NULL,
    url_redirect VARCHAR(255) NULL,
    message TEXT,
    statut VARCHAR(20) DEFAULT 'en_attente',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_envoi TIMESTAMP NULL,
    date_lecture TIMESTAMP NULL,
    erreur TEXT NULL,
    tentatives INT DEFAULT 0
);

-- Indexes for notification table
CREATE INDEX idx_notification_id_receveur ON notification(id_receveur);
CREATE INDEX idx_notification_id_emetteur ON notification(id_emetteur);
CREATE INDEX idx_notification_statut ON notification(statut);
CREATE INDEX idx_notification_date_creation ON notification(date_creation);

-- Foreign key constraint for notification table
ALTER TABLE notification ADD CONSTRAINT fk_notification_id_receveur 
    FOREIGN KEY (id_receveur) REFERENCES utilisateur(id) ON DELETE CASCADE;