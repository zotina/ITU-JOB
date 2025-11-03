# Contexte du Projet : Plateforme de Recrutement ITU-JOB

## Vue d'ensemble

Ce projet est une application web front-end pour une plateforme de recrutement nommée "ITU-JOB". L'application est conçue pour connecter des étudiants à la recherche d'opportunités professionnelles et des recruteurs proposant des offres d'emploi ou de stage. L'architecture est clairement segmentée pour servir ces deux types d'utilisateurs, avec des tableaux de bord et des fonctionnalités spécifiques à chaque rôle.

## Stack Technique

- **Framework Principal :** React (avec TypeScript)
- **Outil de Build :** Vite
- **Langage :** TypeScript
- **Styling :** Tailwind CSS
- **Bibliothèque de Composants UI :** shadcn/ui (fortement suggéré par la structure du répertoire `src/components/ui` et `components.json`)
- **Gestionnaire de Paquets :** Bun
- **Linting :** ESLint

## Structure du Projet

Le code source est principalement situé dans le répertoire `src/` :

- **`pages/`**: Contient les composants de haut niveau pour chaque page de l'application (ex: `StudentDashboard.tsx`, `RecruiterDashboard.tsx`, `LoginPage.tsx`).
- **`components/`**: Organise les composants réutilisables.
    - **`ui/`**: Composants d'interface utilisateur de base (boutons, cartes, formulaires), typiques de shadcn/ui.
    - **`student/` & `recruiter/`**: Composants spécifiques aux fonctionnalités des étudiants et des recruteurs.
    - **`layouts/`**: Mises en page globales pour les différentes sections de l'application.
    - **`auth/`**: Composants pour la gestion de l'authentification et des routes protégées.
- **`services/`**: Gère la logique de communication avec l'API backend (ex: `apiClient.ts`, `authService.ts`).
- **`context/`**: Utilise l'API Context de React pour la gestion d'état global, notamment pour l'authentification (`AuthContext.tsx`).
- **`hooks/`**: Contient des hooks React personnalisés pour réutiliser la logique (ex: `useApi.ts`, `useProfileData.ts`).
- **`config/`**: Fichiers de configuration, comme la configuration de l'API.

## Fonctionnalités Clés

### Pour les Étudiants
- Tableau de bord personnel (`StudentDashboard`).
- Gestion du profil et du CV (`StudentProfile`, `StudentCVManager`).
- Recherche et consultation des offres (`StudentOffers`).
- Suivi des candidatures (`StudentApplications`).
- Statistiques et recommandations personnalisées.

### Pour les Recruteurs
- Tableau de bord de recrutement (`RecruiterDashboard`).
- Création et gestion des offres (`RecruiterCreateOffer`, `RecruiterOffers`).
- Recherche, filtrage et gestion des candidats (`RecruiterStudentSearch`, `RecruiterCandidates`).
- Consultation des profils étudiants et recommandations (`RecommendedProfiles`).

### Fonctionnalités Communes
- Système d'authentification robuste avec des pages de connexion et d'inscription distinctes pour chaque rôle.
- Routes protégées pour sécuriser l'accès aux tableaux de bord.

## Points Notables

- **Intégration Backend :** La présence d'un répertoire `resources/views/welcome.blade.php` suggère une possible intégration avec un backend **Laravel (PHP)**. Le frontend Vite/React pourrait être servi via une application Laravel, ce qui est une architecture courante.
- **Documentation Fonctionnelle :** Le répertoire `func/` contient des fichiers Markdown qui semblent être liés à la documentation fonctionnelle, aux estimations et aux spécifications du projet.
