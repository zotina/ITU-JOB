# Historique des Modifications

## 23-11-2025: Création d'offres via le chatbot IA - Génération complète d'offres comme modèle

- **Objectif :** Étendre la fonctionnalité de création d'offres via le chatbot IA pour permettre la génération complète d'offres de qualité avec description, exigences, technologies, avantages, et autres détails pertinents à partir d'un simple poste demandé par le recruteur, comme un modèle d'offre complet.
- **Actions :** 
    1. **Génération IA avancée :** Amélioration de la fonction `creerOffre` dans `chatbotService.ts` pour utiliser l'IA et générer des descriptions complètes, des exigences pertinentes, des technologies appropriées, des avantages standards et des salaires de référence basés sur le poste demandé.
    2. **Analyse contextuelle :** L'IA analyse le poste demandé (ex: \\\"développeur full stack\\\") et génère automatiquement une offre complète avec des sections \\\"À propos du poste\\\", \\\"Responsabilités\\\", \\\"Environnement de travail\\\", etc.
    3. **Pré-remplissage intelligent :** Tous les champs du formulaire sont maintenant pré-remplis avec des contenus professionnels et adaptés au poste spécifique.
    4. **Gestion des listes :** Amélioration du composant `RecruiterCreateOffer.tsx` pour gérer correctement les listes de technologies, exigences, avantages passées dans l'URL.
    5. **Exemples d'offres de référence :** Intégration d'un exemple détaillé d'offre (comme celle pour \\\"Développeur Full Stack Senior\\\" chez Orange Madagascar) pour guider l'IA dans la génération de contenus de qualité.
    6. **Paramètres complets :** Le système génère maintenant automatiquement titre, type, localisation, salaire, technologies, exigences, souhaits, avantages, expérience requise, et description détaillée.
    7. **Fallback intelligent :** Si des détails sont fournis dans la requête, ils sont utilisés, sinon l'IA génère des contenus pertinents.
- **Résultat :** Les recruteurs peuvent créer des offres complètes et professionnelles en un seul clic à partir d'un poste simple (ex: \\\"développeur full stack\\\"), avec une description détaillée, des exigences pertinentes, des technologies appropriées, et des avantages standards, comme s'ils utilisaient un modèle d'offre pré-rempli de qualité.

---

## 23-11-2025: Ajout de la fonctionnalité de création d'offres pré-remplie via le chatbot IA

- **Objectif :** Permettre aux recruteurs de demander la création d'une offre via le chatbot IA, qui analyse la demande et redirige vers le formulaire de création d'offre avec les champs pré-remplis.
- **Actions :** 
    1. **Mise à jour de la détection d'intention dans le chatbot :** Ajout d'exemples spécifiques dans le prompt de `chatbotService.ts` pour détecter les demandes de création d'offres d'emploi.
    2. **Implémentation de l'action creerOffre :** Mise à jour de la fonction `creerOffre` dans `chatbotService.ts` pour analyser la requête et générer les paramètres d'URL appropriés.
    3. **Mise à jour de RecruiterCreateOffer :** Ajout de `useSearchParams` pour lire les paramètres d'URL et pré-remplir les champs du formulaire (titre, type, localisation, description, technologies, exigences, etc.).
    4. **Mise à jour de useChatbot hook :** Extension pour exposer les données d'action (`actionData`) permettant de gérer les redirections.
    5. **Mise à jour de RecruiterChatbot :** Ajout d'un effet pour intercepter l'action de redirection et naviguer vers la page de création d'offre avec paramètres pré-remplis.
    6. **Mise à jour de StudentChatbot :** Mise à jour cohérente pour exposer les mêmes fonctionnalités (bien que non utilisées pour le moment).
    7. **Validation de la fonctionnalité :** Lorsqu'un recruteur dit \\\"Crée moi une offre pour administrateur base de données\\\", le bot analyse la demande et redirige vers le formulaire pré-rempli.
    8. **Support des champs complexes :** Traitement des technologies, exigences principales, souhaits, avantages, expérience et salaire.
    9. **Gestion des formats de salaire :** L'analyse du salaire gère les formats \\\"min - max\\\" ou simple.
- **Résultat :** Les recruteurs peuvent maintenant créer des offres rapidement via le chatbot IA qui pré-remplit le formulaire avec les informations extraites de leur requête.

---

## 19-11-2025: Correction complète du problème d'inputs non modifiables en mode édition du profil + sauvegarde sur Firebase

- **Objectif :** Résoudre complètement le problème d'inputs non modifiables dans le mode édition du profil étudiant où les champs pré-remplis n'étaient pas éditables par l'utilisateur et assurer la sauvegarde correcte sur Firebase.
- **Actions :**
    1.  **Analyse du problème :** Identification que la variable `personalInfo` dans `EditableProfileHeader.tsx` était capturée une seule fois au début du rendu du composant et devenait donc périmée lors des mises à jour successives.
    2.  **Localisation de l'erreur :** Dans la fonction `updatePersonalInfo`, l'utilisation de `...personalInfo` dans la mise à jour des champs imbriqués utilisait une version obsolète des données.
    3.  **Première tentative de correction :** Remplacement de `...personalInfo` par `...(profileData?.personalInfo || {})` qui accède directement à la valeur actuelle du prop au moment de l'appel.
    4.  **Approche alternative testée :** Mise en place d'un état local `localEditingData` avec `useState` et `useEffect` pour gérer les modifications en temps réel, mais cela a créé des problèmes de synchronisation entre les états.
    5.  **Solution finale adoptée :** Retour à l'approche originale sans état local mais avec accès direct à `profileData` dans les fonctions de mise à jour pour garantir que les données les plus récentes sont utilisées.
    6.  **Mise à jour des fonctions :** La fonction `updatePersonalInfo` utilise désormais `...(profileData?.personalInfo || {})` pour s'assurer que les mises à jour utilisent les données les plus récentes du prop.
    7.  **Correction du problème de sauvegarde Firebase :** Identification que la fonction `saveUserProfile` ne fonctionnait pas correctement en raison d'une mauvaise gestion des objets imbriqués dans les données du profil.
    8.  **Réparation de la sauvegarde :** Mise à jour de la fonction `saveUserProfile` dans `firebaseService.ts` pour utiliser la méthode `cleanObjectForFirestore` qui gère correctement les objets imbriqués et les valeurs indéfinies avant de les sauvegarder dans Firestore.
    9.  **Correction de la gestion des objets imbriqués :** Réparation de la fonction `updateEditingData` dans `useProfileData.ts` pour garantir une fusion correcte des objets imbriqués comme `personalInfo`.
    10. **Validation de la solution :** Les champs du formulaire en mode édition sont maintenant correctement modifiables, y compris les champs racine (`nom`, `prenom`, `email`) et les champs imbriqués dans `personalInfo`.
    11. **Sauvegarde Firestore :** Les modifications sont correctement enregistrées dans la base Firestore via le service de données.
    12. **Impact :** Amélioration significative de l'expérience utilisateur lors de la modification du profil, les utilisateurs peuvent maintenant éditer librement tous les champs de leur profil avec un enregistrement correct sur Firestore.

---

## 19-11-2025: Synchronisation avec l'état actuel du projet et ajout de nouvelles fonctionnalités

- **Objectif :** Comprendre la structure actuelle de la base de données et l'historique des modifications pour assurer une synchronisation complète avec l'état du projet. Ajout d'une fonctionnalité de chatbot avec détection d'intention et mise à jour de la structure de données pour être compatible avec Firestore.
- **Actions :**
    1.  **Analyse de la structure de données :** Lecture et compréhension du fichier @scripts/init_firestore-nouveau.mjs contenant la conception complète de la base de données Firestore.
    2.  **Étude de l'historique :** Lecture du fichier @edit.md pour comprendre l'historique complet des modifications apportées au projet.
    3.  **Documentation des entités :** Identification des collections Firestore (users, offers, applications, notifications, ai_recommendations) et de leur structure de données.
    4.  **Analyse des profils :** Compréhension des structures de données pour les recruteurs (intégrés avec les infos entreprises) et les étudiants (profil détaillé avec compétences, expériences, formations, etc.).
    5.  **Référencement des données :** Documentation des données de test pour les entreprises (Orange, Yas, Airtel, SystAsia, Microlink) et des étudiants (Fanantenana, Raviro, Hasina).
    6.  **Mise à jour du contexte :** Ajout de cette entrée dans le fichier edit.md pour conserver un historique des modifications conformément aux règles établies.
    7.  **Implémentation de la détection d'intention :** Ajout de nouvelles intentions dans le chatbot pour permettre une interaction plus naturelle avec les utilisateurs (étudiants et recruteurs).
    8.  **Mise à jour du service de données :** Adaptation du service de données pour prendre en charge les nouvelles fonctionnalités et structures de données Firestore.

---

## 18-11-2025: Mise à jour de la structure de données pour être compatible avec la nouvelle base Firestore

- **Objectif :** Adapter le hook useProfileData.ts et les composants associés pour qu'ils soient entièrement compatibles avec la nouvelle structure Firestore où toutes les données utilisateur sont stockées dans une collection unique `users`.
- **Actions :** 
  1. **Mise à jour de l'interface ProfileData :** Modification de l'interface pour refléter la nouvelle structure Firestore avec `prenom`, `nom`, `email`, `role` au niveau racine et des objets imbriqués pour les détails comme `personalInfo`, `technicalSkills`, etc.
  2. **Correction de la fonction saveChanges :** Mise à jour pour accéder correctement aux champs `prenom` et `nom` au niveau racine au lieu d'essayer d'accéder à `personalInfo.name`.
  3. **Mise à jour de la logique de chargement :** Amélioration de la fonction de chargement du profil pour gérer correctement la structure de données Firestore.
  4. **Mise à jour du composant EditableProfileHeader :** Correction de l'accès aux champs `prenom`, `nom` et `email` pour qu'ils soient correctement liés aux champs racines dans le mode édition.
  5. **Préparation pour les deux types d'utilisateurs :** L'interface est maintenant prête à gérer à la fois les profils étudiants et les profils recruteurs avec leurs structures spécifiques.
- **Résultat :** Le système est maintenant entièrement aligné avec la nouvelle structure Firestore, permettant un stockage cohérent des données utilisateur (étudiants et recruteurs) dans une collection unique.

---

## 18-11-2025: Vérification de la fonctionnalité de consultation du profil candidat depuis l'interface recruteur

- **Objectif :** Vérifier que le clic sur le bouton \\\"Voir profil\\\" sur l'interface recruteur envoie bien l'ID du candidat pour afficher son profil spécifique.
- **Actions :** 
  1. **Analyse du composant FilteredApplications.tsx :** Vérification que le bouton \\\"Voir profil\\\" envoie l'ID du candidat via `application.studentId` dans l'URL : `/recruiter/student-profile/${application.studentId}`.
  2. **Analyse du composant RecruiterStudentProfile.tsx :** Confirmation que le composant récupère l'ID du candidat depuis les paramètres d'URL et le transmet au composant StudentProfile via la prop `studentId`.
  3. **Analyse du composant StudentProfile.tsx :** Vérification que le composant accepte la prop `studentId` et la transmet au hook `useProfileData` avec l'option `{ specificUserId: actualStudentId }`.
  4. **Analyse du hook useProfileData.ts :** Confirmation que le hook est configuré pour charger un profil spécifique par ID via `dataProvider.getUserProfile(userIdToLoad)`.
  5. **Conclusion :** La fonctionnalité est entièrement implémentée et fonctionnelle. Le bouton \\\"Voir profil\\\" transmet bien l'ID du candidat pour afficher son profil spécifique.
- **Résultat :** La fonctionnalité demandée est déjà correctement implémentée dans le code.

---

## 16-11-2025: Amélioration de l'algorithme de matching IA avec analyse sémantique

- **Objectif :** Implémenter un algorithme de matching plus sophistiqué qui analyse en profondeur les correspondances entre les exigences d'offre et les profils étudiants.
- **Actions :**
    1. **Analyse détaillée des compétences :** Prise en compte du niveau (débutant, intermédiaire, avancé) et de l'expérience (années) pour chaque compétence technique.
    2. **Interprétation des exigences complexes :** Traitement des exigences multiples avec \\\"et/ou\\\", des exigences d'expérience (ex: \\\"3 ans\\\"), des technologies spécifiques.
    3. **Analyse des technologies :** Meilleure reconnaissance des technologies et variantes (ex: JS pour JavaScript).
    4. **Évaluation des langues :** Intégration des niveaux de langue dans le matching (anglais technique).
    5. **Calcul de score progressif :** Attribution de scores partiels pour les correspondances partielles.
    6. **Meilleure explication :** Détails plus précis sur les éléments qui ont contribué au score de matching.
    7. **Prise en charge des structures de données complexes :** Analyse des compétences techniques structurées par catégories.

---

## 16-11-2025: Ajout des détails de matching sur les profils recommandés

- **Objectif :** Permettre aux recruteurs de voir les détails du matching IA en cliquant sur le score de compatibilité.
- **Actions :**
    1. **Amélioration du service AI :** Mise à jour de la fonction de calcul de matching pour inclure des détails sur les critères qui ont contribué au score.
    2. **Ajout des détails de matching :** Stockage des explications du matching dans la réponse pour chaque étudiant.
    3. **Intégration de la tooltip :** Ajout d'une infobulle interactive qui s'affiche lors du survol du score de matching.
    4. **Affichage des détails :** Les raisons du score (compétences, exigences, localisation) sont affichées dans la tooltip.
    5. **Expérience utilisateur :** Les recruteurs peuvent maintenant comprendre pourquoi un candidat a obtenu un certain score de matching.
    6. **Amélioration de la transparence :** Les décisions de matching sont maintenant expliquées avec des détails concrets.

---

## 16-11-2025: Correction du bouton de recommandation en double

- **Objectif :** Corriger l'affichage de deux boutons de recommandation identiques dans la page des offres recruteur.
- **Actions :**
    1. **Identification du problème :** Lors de l'intégration du système de recommandation IA, un composant RecommendedProfiles avait été ajouté en double.
    2. **Correction du code :** Suppression du composant RecommendedProfiles en double pour ne garder qu'une seule instance.
    3. **Maintien des fonctionnalités :** Le bouton de recommandation IA reste fonctionnel avec le passage correct de l'ID de l'offre.
    4. **Amélioration UX :** Interface plus propre sans boutons redondants.

---

## 16-11-2025: Système de recommandation IA pour les profils étudiants

- **Objectif :** Implémenter un système de recommandation utilisant l'IA pour matcher les profils étudiants avec les exigences d'une offre d'emploi et afficher les 4 meilleurs profils.
- **Actions :**
    1. **Extension du service AIRecommendationsService :** Ajout de la fonction `generateStudentRecommendationsForOffer` pour analyser les profils étudiants par rapport aux exigences d'une offre.
    2. **Algorithme de matching :** Implémentation d'un système de calcul de score basé sur les compétences techniques, les expériences, la localisation et les exigences textuelles de l'offre.
    3. **Mécanisme d'analyse sémantique :** Ajout de fonctions pour calculer la similarité entre les exigences textuelles et les profils, permettant de matcher des descriptions en langage naturel.
    4. **Mise à jour du composant RecommendedProfiles :** Modification pour récupérer dynamiquement les profils recommandés en fonction d'une offre spécifique via l'IA.
    5. **Interface utilisateur améliorée :** Ajout d'indicateurs de chargement et de messages pour les cas sans résultats.
    6. **Intégration avec les offres :** Le composant est maintenant intégré à la page des offres avec passage de l'ID de l'offre pour analyse.
    7. **Affichage des résultats :** Seulement les 4 profils avec le meilleur score de matching sont affichés.
    8. **Système de score :** Chaque profil affiche son pourcentage de matching calculé par l'IA.

---

## 16-11-2025: Mise à jour du formulaire de création d'offres avec nouveaux champs

- **Objectif :** Étendre le formulaire de création d'offres pour inclure les exigences principales, les souhaits (nice to have) et les avantages.
- **Actions :**
    1. **Ajout des variables d'état :** Ajout des états pour gérer les listes d'exigences, de souhaits et d'avantages.
    2. **Ajout des fonctions de gestion :** Création des fonctions pour ajouter et supprimer des éléments dans chaque liste.
    3. **Ajout des champs de formulaire :** Intégration des sections \\\"Exigences principales\\\", \\\"Souhaits (Nice to have)\\\" et \\\"Avantages\\\" dans l'interface.
    4. **Interface utilisateur améliorée :** Chaque section permet l'ajout d'éléments par liste via un champ de texte et un bouton \\\"+\\\".
    5. **Gestion des éléments :** Chaque élément ajouté peut être supprimé individuellement.
    6. **Mise à jour de la soumission :** Le formulaire soumet maintenant toutes les nouvelles données vers Firestore.
    7. **Saisie clavier :** Possibilité d'ajouter des éléments en appuyant sur Entrée dans les champs de texte.
    8. **Intégration avec Firestore :** Les nouvelles données sont correctement stockées dans les documents d'offres Firestore.

---

## 16-11-2025: Amélioration de l'affichage des détails d'offres avec exigences et avantages

- **Objectif :** Améliorer la page de détails d'offres pour afficher correctement les exigences, les souhaits (nice to have) et les avantages à partir des données Firestore.
- **Actions :**
    1. **Mise à jour de l'interface JobOffer :** Ajout des champs `niceToHave` et `benefits` dans les interfaces des deux services (firebaseService et chatbotService).
    2. **Amélioration de OfferDetailPage :** Ajout de sections distinctes pour afficher les exigences principales, les souhaits (nice to have) et les avantages de l'offre.
    3. **Condition d'affichage :** Les sections \\\"Souhaits\\\" et \\\"Avantages\\\" ne s'affichent que si les données sont présentes dans l'offre.
    4. **Structure :** Affichage des listes d'éléments sous forme de puces pour une meilleure lisibilité.
    5. **Compatibilité :** Le code est rétrocompatible et ne casse pas si certaines sections sont absentes.

---

## 16-11-2025: Création d'offres avec Firestore et badges \\\"Nouveau\\\"

- **Objectif :** Implémenter la création d'offres d'emploi avec stockage dans Firestore et ajout d'un badge temporaire \\\"Nouveau\\\" sur les nouvelles offres.
- **Actions :**
    1. **Mise à jour de l'interface JobOffer :** Ajout des champs `isNouveau` et `nouveauUntil` pour gérer le badge temporaire.
    2. **Ajout de la fonction createOffer :** Création de la méthode dans firebaseService pour stocker les nouvelles offres dans Firestore avec les informations appropriées.
    3. **Ajout de la fonction createOffer au dataProvider :** Extension du dataProvider pour inclure la création d'offres via Firebase.
    4. **Mise à jour du formulaire RecruiterCreateOffer :** Connexion de tous les champs du formulaire aux variables d'état et implémentation de la soumission vers Firestore.
    5. **Ajout du badge \\\"Nouveau\\\" :** Affichage d'un badge \\\"Nouveau\\\" sur les offres récemment créées (dans les 7 derniers jours) dans la liste des offres.
    6. **Gestion automatique du badge :** Mise à jour automatique dans Firestore pour retirer le statut \\\"Nouveau\\\" après 7 jours.
    7. **Amélioration UX :** Les recruteurs peuvent maintenant créer des offres qui sont stockées de manière persistante dans Firestore avec un indicateur visuel pour les offres récentes.

---

## 16-11-2025: Ajout du nombre de candidatures sur les offres et amélioration UX

- **Objectif :** Améliorer l'UX sur la page des offres du recruteur en affichant le nombre de candidatures pour chaque offre.
- **Actions :**
    1. **Mise à jour de l'interface JobOffer :** Ajout du champ `nbCandidatures` à l'interface pour stocker le nombre de candidatures.
    2. **Mise à jour de getOffers :** Modification de la fonction pour compter les candidatures associées à chaque offre en interrogeant la collection 'applications'.
    3. **Mise à jour de addApplication :** Modification de la fonction pour incrémenter le compteur de candidatures sur l'offre concernée lors de l'ajout d'une candidature.
    4. **Mise à jour de l'interface RecruiterOffers :** Modification du bouton \\\"Voir candidatures\\\" pour afficher le nombre de candidatures à côté du texte du bouton via un badge.
    5. **Amélioration UX :** Les recruteurs peuvent maintenant voir le nombre de candidatures sur chaque offre sans avoir à cliquer sur le bouton, améliorant ainsi l'expérience utilisateur.
    6. **Fonctionnement technique :** Le système dénormalise les données en stockant le nombre de candidatures directement dans le document de l'offre pour des performances optimales.

---

## 16-11-2025: Modification de dataProvider.ts pour retourner des tableaux vides au lieu des données mock

- **Objectif :** Modifier dataProvider.ts pour qu'il retourne des tableaux vides ([]) au lieu des données mock quand il n'y a pas de données dans Firestore.
- **Actions :**
    1. **Mise à jour de getCompanies :** La fonction retourne maintenant un tableau vide au lieu de données mock quand il n'y a pas d'entreprises dans Firestore.
    2. **Mise à jour de getCompanyById :** La fonction retourne maintenant null au lieu de données mock quand l'entreprise n'existe pas dans Firestore.
    3. **Mise à jour de getOffers :** La fonction retourne maintenant un tableau vide au lieu de données mock quand il n'y a pas d'offres dans Firestore.
    4. **Mise à jour de getOfferById :** La fonction retourne maintenant null au lieu de données mock quand l'offre n'existe pas dans Firestore.
    5. **Mise à jour de getCandidates :** La fonction retourne maintenant un tableau vide au lieu de données mock quand il n'y a pas de candidats dans Firestore.
    6. **Mise à jour de getCandidateById :** La fonction retourne maintenant null au lieu de données mock quand le candidat n'existe pas dans Firestore.
    7. **Mise à jour de getApplications :** La fonction retourne maintenant un tableau vide au lieu des données mock quand il n'y a pas de candidatures dans Firestore.
    8. **Mise à jour de addApplication :** La fonction ne fait plus de fallback aux données mock et lève une exception en cas d'erreur.
    9. **Mise à jour de updateApplication :** La fonction ne fait plus de fallback aux données mock et lève une exception en cas d'erreur.
    10. **Mise à jour de getUserProfile :** La fonction retourne maintenant null en cas d'erreur au lieu de faire un fallback.
    11. **Mise à jour de saveUserProfile :** La fonction ne fait plus de fallback aux données mock et lève une exception en cas d'erreur.
    12. **Mise à jour de getAIRecommendations :** La fonction retourne maintenant null en cas d'erreur au lieu de faire un fallback.
    13. **Mise à jour de saveAIRecommendations :** La fonction ne fait plus de fallback aux données mock et lève une exception en cas d'erreur.
    14. **Suppression des imports inutilisés :** Suppression des imports des données mock (mockCompanies, mockOffers, mockCandidates, getApplications, addApplication) qui ne sont plus utilisés.
    15. **Résultat :** Le dataProvider suit maintenant la même logique que firebaseService et retourne des tableaux vides ou null quand il n'y a pas de données dans Firestore, sans utiliser de données mock.

---

## 15-11-2025: Mise à jour de RecruiterCandidates - Affichage conditionnel des candidatures

- **Objectif :** Modifier le composant RecruiterCandidates pour afficher les candidatures selon la présence du paramètre offerId dans l'URL.
- **Actions :**
    1. **Ajout de useSearchParams :** Intégration de l'hook pour récupérer le paramètre offerId depuis l'URL.
    2. **Logique conditionnelle :** Si offerId est présent, affichage des candidatures pour cette offre spécifique uniquement.
    3. **Affichage par défaut :** Si offerId est absent, affichage de toutes les candidatures appartenant à l'entreprise du recruteur connecté.
    4. **Mise à jour de l'interface :** Adaptation de l'UI pour afficher les applications au lieu des candidats bruts.
    5. **Fonctionnalité de filtrage :** Le filtrage est géré via le service backend qui s'assure que seules les candidatures de la bonne entreprise sont retournées.
    6. **Amélioration des fonctionnalités :** Les boutons d'acceptation/rejet fonctionnent maintenant avec les données Firestore réelles.

---

## 15-11-2025: Suppression du fallback aux données mock dans firebaseService

- **Objectif :** Empêcher l'affichage de données statiques mockdata dans les cas où il n'y a pas de données dans Firestore.
- **Actions :**
    1. **Modification de getOffers :** La fonction retourne maintenant un tableau vide au lieu de données mock quand il n'y a pas d'offres dans Firestore.
    2. **Modification de getCompanies :** La fonction retourne maintenant un tableau vide au lieu de données mock quand il n'y a pas de companies dans Firestore.
    3. **Modification de getCandidates :** La fonction retourne maintenant un tableau vide au lieu de données mock quand il n'y a pas de candidats dans Firestore.
    4. **Modification de getOfferById :** La fonction retourne maintenant null au lieu de données mock quand l'offre n'existe pas dans Firestore.
    5. **Modification de getCompanyById :** La fonction retourne maintenant null au lieu de données mock quand l'entreprise n'existe pas dans Firestore.
    6. **Modification de getCandidateById :** La fonction retourne maintenant null au lieu de données mock quand le candidat n'existe pas dans Firestore.
    7. **Résultat :** Affichage de 'Aucune offre'/'Aucun candidat'/'Aucune entreprise' dans l'interface quand il n'y a pas de données dans Firestore.

---

## 15-11-2025: Filtrage des offres et candidatures par entreprise connectée

- **Objectif :** S'assurer que les recruteurs ne voient que les offres de leur propre entreprise et que les candidatures affichées sont spécifiques à l'offre sélectionnée.
- **Actions :**
    1. **Mise à jour de RecruiterOffers :** Le composant 'Mes Offres' utilise `dataProvider.getOffers(user?.id)` pour n'afficher que les offres appartenant à l'entreprise du recruteur connecté.
    2. **Amélioration du bouton 'Voir candidatures' :** Le bouton transmet correctement l'ID de l'offre via le paramètre `offerId` dans l'URL.
    3. **Mise à jour de FilteredApplications :** La page utilise à la fois l'ID de l'utilisateur et l'ID de l'offre pour filtrer les candidatures spécifiques à une offre donnée.
    4. **Fonctionnement du filtrage :** Lorsqu'un recruteur clique sur 'Voir candidatures', seule la liste des candidatures pour cette offre spécifique s'affiche, garantissant la confidentialité des données.

---

## 15-11-2025: Adaptation au nouveau schéma de base de données Firestore et correction des fonctionnalités

- **Objectif :** Adapter l'application au nouveau schéma de base de données où toutes les informations (utilisateurs, entreprises, offres, candidats) sont stockées dans la collection `users`, et corriger les fonctionnalités cassées.
- **Actions :**
    1. **Mise à jour de firebaseService :** Réorganisation complète des opérations Firestore pour fonctionner avec la nouvelle structure où les entreprises sont stockées dans les profils utilisateurs (rôle 'recruiter').
    2. **Mise à jour des opérations de candidats :** Modification des fonctions `getCandidates` et `getCandidateById` pour récupérer les profils étudiants depuis la collection `users`.
    3. **Correction des requêtes Firestore :** Mise à jour de la fonction `addApplication` pour éviter l'erreur \\\"where() called with invalid data\\\" en retirant la requête vers la collection 'companies' supprimée.
    4. **Mise à jour de l'affichage des offres :** Correction des fonctions `getOffers` et `getOfferById` pour récupérer correctement le nom de l'entreprise depuis la nouvelle structure dénormalisée.
    5. **Fix de l'OfferDetailPage :** Remplacement de l'utilisation des données mock par les appels à `dataProvider` pour récupérer les détails de l'offre et corriger l'erreur \\\"Offre non trouvée\\\".
    6. **Fix de StudentApplications :** Correction de l'erreur \\\"Cannot read properties of undefined (reading 'toLowerCase')\\\" en sécurisant l'accès aux propriétés potentiellement undefined.
    7. **Mise à jour des fonctions d'application :** Adaptation des fonctions pour utiliser les données correctes de l'utilisateur authentifié via `useAuth`.

---

## 15-11-2025: Stockage de l'ID de l'entreprise dans les documents de candidature et filtrage par entreprise

- **Objectif :** Ajouter l'ID de l'entreprise dans le document de candidature lorsqu'un étudiant postule, et filtrer les listes de candidatures pour les recruteurs par leur entreprise.
- **Actions :**
    1. **Mise à jour de l'interface Application :** Ajout du champ `companyId` à l'interface Application dans `firebaseService.ts`.
    2. **Mise à jour de la fonction addApplication :** Modification de la fonction pour récupérer l'ID de l'entreprise à partir de l'offre d'emploi et le stocker dans la candidature.
    3. **Mise à jour de la fonction getApplications :** Amélioration de la logique de filtrage pour s'assurer que les recruteurs ne voient que les candidatures pour les offres de leur entreprise.
    4. **Validation de la page FilteredApplications :** Vérification que la page `/recruiter/candidates` (FilteredApplications.tsx) utilise correctement le paramètre `offerId` pour filtrer les candidatures.
    5. **Mise à jour du dataProvider :** Adaptation du dataProvider pour inclure `companyId` dans le mapping des données.
    6. **Mise à jour de l'applicationStore :** Mise à jour de l'interface Application dans le store local pour inclure le champ `companyId`.

---

## 15-11-2025: Récupération du nom complet de l'utilisateur depuis Firestore et affichage dans les sidebars

- **Objectif :** Créer une fonction pour récupérer le nom complet de l'utilisateur (prenom + nom) depuis Firestore à partir de son ID et l'afficher dans les sidebars recruteur et étudiant.
- **Actions :**
    1. **Création du service utilisateur :** Création de `userService.ts` avec les fonctions `getUserProfileById` et `getUserFullNameById` pour récupérer les informations utilisateur depuis Firestore.
    2. **Correction de simpleAuthService :** Mise à jour du service d'authentification simple pour gérer correctement les champs `prenom` et `nom` séparément au lieu de les combiner dans un seul champ `nom`.
    3. **Mise à jour de RecruiterSidebar.tsx :** Ajout d'un effet pour récupérer le nom complet de l'utilisateur connecté depuis Firestore et l'afficher dans le sidebar.
    4. **Mise à jour de StudentSidebar.tsx :** Ajout d'un effet pour récupérer le nom complet de l'utilisateur connecté depuis Firestore et l'afficher dans le sidebar.
    5. **Gestion des cas de repli :** Mise en place d'une logique de repli pour afficher les informations disponibles si la récupération depuis Firestore échoue.
    6. **Amélioration de la robustesse :** Ajout de vérifications pour s'assurer que les champs prénom et nom ne sont pas vides avant de les concaténer.

---

## 15-11-2025: Correction de l'affichage du nom d'utilisateur dans les sidebars et filtrage des candidatures

- **Objectif :** Assurer que les sidebars affichent correctement le nom de l'utilisateur connecté et que la page des candidatures ne montre que celles appartenant à l'utilisateur connecté.
- **Actions :**
    1. **Vérification des sidebars :** Confirmation que `RecruiterSidebar.tsx` et `StudentSidebar.tsx` utilisent déjà correctement le hook `useAuth` pour afficher le nom de l'utilisateur connecté.
    2. **Mise à jour de StudentApplications.tsx :** Amélioration de la logique de filtrage pour s'assurer que seules les candidatures appartenant à l'utilisateur connecté sont affichées (filtrage par `studentId`).
    3. **Amélioration de l'affichage :** Ajout d'un état de chargement et mise à jour des messages pour afficher \\\"Aucune candidature\\\" quand il n'y a pas de candidatures pour l'utilisateur connecté.
    4. **Mise à jour de l'interface Application :** Ajout des champs `studentId`, `studentName` et `offerId` à l'interface Application pour garantir la cohérence des types.
    5. **Optimisation du filtrage :** Clarification de la logique de filtrage pour qu'elle soit plus explicite et plus fiable.

---

## 13-11-2025: Création du service de Recommandations IA pour le profil étudiant

- **Objectif :** Créer un service de recommandations IA sophistiqué pour le profil étudiant avec des suggestions de postes basées sur le matching score, des améliorations de profil et des tendances du marché, avec persistance sur Firestore.
- **Actions :**
    1. **Création du service AI Recommendations :** Création de `aiRecommendationsService.ts` avec logique de matching score, suggestions d'amélioration de profil et tendances du marché.
    2. **Extension du dataProvider :** Ajout des fonctions `getAIRecommendations` et `saveAIRecommendations` dans `dataProvider.ts` pour l'intégration avec Firestore.
    3. **Extension du firebaseService :** Ajout des fonctions `getAIRecommendations` et `saveAIRecommendations` dans `firebaseService.ts` pour la gestion Firestore.
    4. **Mise à jour de StudentRecommendations.tsx :** Remplacement complet du composant pour utiliser le nouveau service de recommandations IA avec actualisation automatique et affichage des suggestions, postes recommandés et tendances du marché.
    5. **Logique de matching score :** Implémentation d'un algorithme de matching basé sur les compétences techniques, exigences, localisation et disponibilité pour les 5 offres les mieux adaptées.
    6. **Suggestions d'amélioration de profil :** Génération de suggestions personnalisées basées sur l'analyse du profil existant pour améliorer le matching score.
    7. **Tendances du marché :** Affichage des tendances clés du marché pour orienter la carrière de l'étudiant.
    8. **Persistance Firestore :** Sauvegarde des recommandations générées dans Firestore avec gestion de l'actualisation (toutes les 24h).
    9. **Interface utilisateur améliorée :** Design avec statistiques, bouton d'actualisation et organisation claire des différentes sections de recommandations.

---

## 13-11-2025: Mise en place du système d'autorisation basé sur la compagnie pour les recruteurs

- **Objectif :** Implémenter un système d'autorisation où chaque recruteur ne peut voir que les offres et les candidatures liées à sa propre compagnie.
- **Actions :**
    1. **Mise à jour du firebaseService :** Modification des fonctions `getOffers` et `getApplications` pour filtrer les données en fonction de la compagnie associée au recruteur.
    2. **Mise à jour du dataProvider :** Extension des fonctions `getOffers` et `getApplications` pour supporter le filtrage par utilisateur et par offre.
    3. **Mise à jour des composants recruteurs :** Modification de `RecruiterOffers.tsx` et `FilteredApplications.tsx` pour utiliser le dataProvider avec filtrage par compagnie.
    4. **Ajout de l'attribut companyName :** Ajout du champ companyName dans le profil utilisateur pour associer chaque recruteur à sa compagnie.
    5. **Sécurité renforcée :** Mise en place de vérifications d'autorisation côté client et serveur pour s'assurer que les recruteurs n'accèdent qu'à leurs propres données.
    6. **Interface utilisateur améliorée :** Les recruteurs ne voient désormais que leurs offres et les candidatures correspondantes.

---

## 13-11-2025: Création du service de Notifications avec persistance Firestore

- **Objectif :** Mettre en place un service de notifications complet avec persistance Firestore permettant à chaque utilisateur de recevoir des notifications personnalisées selon son activité sur la plateforme.
- **Actions :**
    1. **Création du service de notification :** Création de `notificationService.ts` avec gestion complète des notifications (lecture, écriture, mise à jour, suppression).
    2. **Extension du dataProvider :** Ajout des fonctions `getUserNotifications`, `getUnreadNotifications`, `createNotification`, `markNotificationAsRead`, `markAllNotificationsAsRead`, `deleteNotification` dans `dataProvider.ts`.
    3. **Extension du firebaseService :** Ajout des fonctions Firestore pour la gestion des notifications avec vérification d'autorisation et nettoyage des données.
    4. **Création du composant UI :** Développement de `notifications.tsx` avec dropdown interactif, marquage comme lu, filtrage et navigation par type.
    5. **Création de la page de notifications :** Mise en place de `NotificationsPage.tsx` avec interface complète pour gérer toutes les notifications.
    6. **Intégration dans les layouts :** Remplacement du composant de notification mock par le nouveau composant dans `StudentLayout.tsx` et `RecruiterLayout.tsx`.
    7. **Ajout des routes :** Intégration des routes `/student/notifications` et `/recruiter/notifications` dans les dashboards.
    8. **Sécurité renforcée :** Vérification que les utilisateurs ne peuvent accéder qu'à leurs propres notifications via vérification d'autorisation dans firebaseService.
    9. **Interface utilisateur :** Design moderne avec badges de comptage, filtres, marquage multiple et accès rapide aux actions.

---

## 12-11-2025: Intégration du service de chatbot avec l'API Groq

- **Objectif :** Créer et intégrer un service de chatbot sophistiqué utilisant l'API Groq avec détection d'intention pour les utilisateurs étudiants et recruteurs.
- **Actions :**
    1. **Création du service backend :** Création de `chatbotService.ts` reproduisant la logique du service Laravel avec détection d'intention via l'API Groq.
    2. **Création du hook personnalisé :** Création de `useChatbot.ts` pour gérer l'état de la conversation et l'interaction avec le service.
    3. **Création des composants React :** Création de `Chatbot.tsx` et `QuickActions.tsx` pour l'interface utilisateur.
    4. **Mise à jour du fichier .env.example :** Ajout de la variable d'environnement VITE_GROQ_API_KEY.
    5. **Intégration dans StudentChatbot.tsx :** Remplacement de la logique existante par le nouveau service de chatbot avec actions rapides.
    6. **Intégration dans RecruiterChatbot.tsx :** Remplacement de la logique existante par le nouveau service de chatbot avec actions rapides spécifiques aux recruteurs.

---

## 12-11-2025: Mise à jour de la localisation pour synchronisation avec Firestore

- **Objectif :** S'assurer que la mise à jour de la position dans la section de localisation de l'étudiant met à jour Firestore immédiatement.
- **Actions :**
    1. **Importation du hook useAuth :** Ajout de l'import du hook `useAuth` dans `StudentLocation.tsx` pour vérifier si l'utilisateur est authentifié.
    2. **Modification de la fonction handleLocationChange :** La fonction a été modifiée pour sauvegarder immédiatement les modifications dans Firestore si l'utilisateur est authentifié.
    3. **Gestion d'erreur :** Ajout d'une gestion d'erreur pour informer l'utilisateur si la sauvegarde échoue.
    4. **Conservation de la mise à jour locale :** La mise à jour de l'état local est conservée pour une expérience utilisateur fluide.

---

## 12-11-2025: Intégration du service de chatbot avec API Groq

- **Objectif :** Créer un service de chatbot avancé qui utilise l'API Groq pour fournir des réponses intelligentes aux étudiants et recruteurs.
- **Actions :**
    1. **Création de ChatbotService :** Implémentation du service principal dans `chatbotService.ts` avec détection d'intentions et exécution d'actions spécifiques.
    2. **Création du hook useChatbot :** Développement du hook personnalisé `useChatbot.ts` pour gérer l'état de la conversation.
    3. **Mise à jour des composants UI :** Adaptation des composants `StudentChatbot.tsx` et `RecruiterChatbot.tsx` pour utiliser le nouveau service.
    4. **Support des deux rôles :** Implémentation d'une logique pour distinguer les fonctionnalités selon le rôle (étudiant/recruteur).
    5. **Intégration avec dataProvider :** Utilisation du service de données existant pour récupérer et mettre à jour les informations.

---

## 12-11-2025: Chargement des entreprises depuis Firebase dans la carte des opportunités

- **Objectif :** Modifier la carte des opportunités dans la section de localisation de l'étudiant pour charger les données des entreprises depuis Firestore au lieu des données mock.
- **Actions :**
    1. **Vérification du composant StudentLocation :** Confirmation que le composant utilise déjà `dataProvider.getCompanies()` pour charger les données.
    2. **Vérification du composant LeafletMap :** Vérification que le composant de carte reçoit correctement les données des entreprises.
    3. **Correction des erreurs de variables :** Correction des erreurs potentielles dans le fichier `LeafletMap.tsx` pour garantir un affichage correct des entreprises.
    4. **Validation de l'intégration :** Confirmation que les entreprises provenant de Firebase sont correctement affichées sur la carte avec leurs coordonnées.

---

## 11-11-2025: Correction du bug de redirection et de la page blanche

- **Objectif :** Résoudre une série de bugs complexes incluant la non-redirection après connexion, une incompatibilité HMR (Hot Module Replacement), et l'affichage d'une page blanche sur la page des offres.
- **Actions :**
    1. **Analyse des problèmes :** Identification d'une cascade de problèmes, incluant une condition de course à la connexion, des re-rendus excessifs, une structure de code incompatible avec Vite, et une erreur de chargement de données.
    2. **Refactorisation de l'authentification :**
        - Déplacement du hook `useAuth` dans son propre fichier (`src/hooks/useAuth.ts`) pour résoudre une incompatibilité HMR avec Vite.
        - Mise à jour de tous les imports de `useAuth` dans l'application.
        - Encapsulation de la valeur du `AuthContext` dans un `useMemo` pour prévenir les re-rendus en boucle.
    3. **Correction du chargement des données (`StudentOffers.tsx`) :**
        - Suppression d'un `require()` conditionnel et problématique qui tentait de charger des données mock et pouvait causer un crash du rendu. La logique de fallback est déjà gérée par `dataProvider`.
        - Ajout d'un état de chargement (`dataLoading`) qui affiche un spinner, empêchant l'affichage d'une page vide ou blanche pendant la récupération des données et fournissant un retour visuel clair à l'utilisateur.
    4. **Stabilisation de la redirection :** Création d'un composant `LoginSuccessRedirect` qui gère la redirection de manière déclarative après que l'état d'authentification soit confirmé, résolvant ainsi la condition de course initiale.
    5. **Correction du format de l'ID utilisateur :** Standardisation de l'ID utilisateur en `string` à travers les types (`types/auth.ts`) et les services (`simpleAuthService.ts`) pour correspondre au format de Firestore.

---

## 11-11-2025: Rendre les éléments de la carte cliquables pour pré-remplir la recherche

- **Objectif :** Rendre les noms des entreprises sur la carte cliquables et rediriger vers la liste des offres en pré-remplissant la recherche avec le nom de l'entreprise.
- **Actions :**
    1. **Mise à jour de StudentLocation.tsx :** Réversion des modifications précédentes car elles étaient incorrectes.
    2. **Mise à jour de leaflet-map.tsx :** Ajout de l'import useNavigate et implémentation de la fonction handleCompanyClick.
    3. **Mise à jour de leaflet-map.tsx :** Modification du Popup des entreprises pour rendre le nom cliquable et appeler la fonction de navigation.
    4. **Mise à jour de StudentOffers.tsx :** Modification du composant pour lire le paramètre 'q' de l'URL lors du chargement et l'utiliser comme valeur initiale pour le terme de recherche.
    5. **Ajout d'effet de synchronisation :** Ajout d'un effet pour synchroniser le terme de recherche avec les paramètres de l'URL lorsqu'il change.

---

## 11-11-2025: Mise en place de Firebase pour la centralisation des données

- **Objectif :** Centraliser les données dans Firebase tout en maintenant la compatibilité avec les données existantes.
- **Actions :**
    1. **Création de la configuration Firebase :** Mise en place du fichier src/config/firebase.ts avec la configuration de l'application.
    2. **Création du service Firebase :** Développement de src/services/firebaseService.ts avec des fonctions CRUD pour les entités principales (companies, offers, candidates, applications).
    3. **Création du fournisseur de données :** Création de src/data/dataProvider.ts qui utilise Firebase comme source principale avec fallback aux données mock en cas d'échec.
    4. **Mise à jour de package.json :** Ajout de la dépendance Firebase et amélioration du script de build pour inclure la vérification TypeScript.
    5. **Migration progressive :** Mise à jour des composants StudentOffers et StudentLocation pour utiliser le dataProvider au lieu des données mock directement.
    6. **Gestion des états :** Adaptation des composants pour gérer le chargement asynchrone des données depuis Firebase.
    7. **Correction d'import :** Réparation des erreurs d'import dans dataProvider.ts pour utiliser les bons modules (applicationStore.ts au lieu de mockData.ts).
    8. **Correction de variable d'état :** Réparation de la variable d'état applyingOfferId dans StudentOffers.tsx pour résoudre l'erreur 'applyingOfferId is not defined'.
    9. **Mise à jour du processus de candidature :** Modification du bouton 'Postuler' pour enregistrer les candidatures dans Firestore via le dataProvider au lieu de l'applicationStore local.
    10. **Correction d'import dupliqué :** Réparation de l'erreur d'import dupliqué de dataProvider dans StudentOffers.tsx.
    11. **Mise à jour de la gestion des candidatures :** Modification de StudentApplications.tsx pour utiliser le dataProvider au lieu de l'applicationStore directement.
    12. **Amélioration du processus de création :** Ajout de l'indicateur 'isNew: true' lors de la création d'une candidature dans Firestore.
    13. **Mise à jour du mécanisme de suppression du badge 'nouveau' :** Implémentation du processus de suppression du flag 'isNew' après 3 secondes pour les nouvelles candidatures.
    14. **Création d'un service d'authentification simplifié :** Mise en place d'un service simple d'authentification utilisant Firestore pour la gestion des utilisateurs.
    15. **Mise à jour du contexte d'authentification :** Remplacement de l'ancien service d'authentification par le nouveau service simple.
    16. **Intégration de l'authentification Firestore :** Les utilisateurs peuvent maintenant se connecter avec leur email et mot de passe via Firestore.

---

## 09-11-2025: Amélioration du moteur de recherche en langage naturel et correction des erreurs

- **Objectif :** Améliorer le moteur de recherche pour qu'il fonctionne correctement en langage naturel et corriger l'erreur dans le composant RecruiterStudentSearch.
- **Actions :**
    1. **Correction de RecruiterStudentSearch.tsx :** Réparation de l'erreur liée à l'accès à des propriétés potentiellement undefined, notamment skills, en assurant une initialisation correcte des données à partir de mockCandidates.
    2. **Mise à jour de la logique de recherche en langage naturel :** Amélioration de l'algorithme de recherche pour traiter correctement les requêtes en langage naturel comme \\\"développeur React Antananarivo disponible immédiatement\\\", avec un système de score de pertinence pour classer les résultats.
    3. **Mise à jour de la logique de données :** Modification de l'accès aux profils étudiants pour utiliser les données de mockCandidates au lieu d'un profil global.
    4. **Mise à jour de RecruiterStudentProfile.tsx :** Ajout de la gestion des paramètres d'URL pour permettre l'affichage de profils spécifiques d'étudiants.
    5. **Mise à jour de StudentProfile.tsx :** Ajout du paramètre studentId pour permettre l'affichage de profils spécifiques en mode recruteur.

---

## 09-11-2025: Correction de l'erreur d'export dans RecruiterStudentProfile

- **Objectif :** Résoudre l'erreur de module \\\"does not provide an export named 'default'\\\" dans RecruiterStudentProfile.tsx.
- **Actions :**
    1. **Analyse de l'erreur :** Identification que la modification de StudentProfile pour accepter un studentId prop a causé des problèmes d'export.
    2. **Réversion des changements :** Retrait du paramètre studentId de StudentProfile.tsx pour restaurer la compatibilité.
    3. **Mise à jour de RecruiterStudentProfile :** Correction de l'appel de StudentProfile pour ne plus passer le studentId.

---

## 09-11-2025: Amélioration des chatbots avec des conversations réalistes et suppression des fonctionnalités non supportées

- **Objectif :** Créer des conversations par défaut réalistes pour les chatbots étudiant et recruteur, avec des discussions qui se poursuivent naturellement, tout en supprimant les fonctionnalités d'entretien qui ne sont pas prises en charge par la plateforme.
- **Actions :**
    1. **Mise à jour de StudentChatbot.tsx :** Remplacement de la conversation par défaut par un échange réaliste basé sur le profil d'Andriamalala Raviro, ses candidatures en cours et ses besoins de carrière, sans référence à la planification d'entretiens.
    2. **Mise à jour de RecruiterChatbot.tsx :** Remplacement de la conversation par défaut par un échange réaliste basé sur les offres d'emploi du recruteur, les candidatures reçues et les besoins en recrutement, avec suppression des références à la planification d'entretiens.
    3. **Amélioration des fonctions de réponse :** Mise en place de réponses contextuelles basées sur les entrées de l'utilisateur, avec des informations pertinentes sur les offres, candidatures, tests techniques et compétences.
    4. **Mise à jour des actions rapides :** Adaptation des boutons d'actions rapides pour refléter les besoins réels des utilisateurs dans leur parcours de carrière ou de recrutement.
    5. **Ajout de gestion multi-ligne :** Utilisation de `whitespace-pre-line` pour permettre l'affichage correct des réponses formatées avec des sauts de ligne.

---

## 09-11-2025: Correction de l'erreur dans la recherche d'étudiants

- **Objectif :** Résoudre l'erreur \\\"Cannot read properties of undefined (reading 'flatMap')\\\" sur la page de recherche des étudiants.
- **Actions :**
    1. **Diagnostic de l'erreur :** Identification du problème dans RecruiterStudentSearch.tsx ligne 32 avec l'appel à flatMap sur des propriétés potentiellement nulles.
    2. **Ajout de vérifications de nullité :** Mise en place de protections pour les propriétés techniques du profil (technicalSkills, languages, projects, experiences, formations).
    3. **Gestion des cas vides :** Remplacement des propriétés manquantes par des valeurs par défaut appropriées.
    4. **Préservation de la fonctionnalité :** Maintien du comportement global du composant tout en le rendant plus robuste.

---

## 09-11-2025: Mise à jour des profils recommandés avec les vrais candidats

- **Objectif :** Remplacer les données fictives des profils recommandés par les vrais candidats du système.
- **Actions :**
    1. **Analyse des données existantes :** Identification des candidats réels dans le tableau mockCandidates.
    2. **Mise à jour des données :** Remplacement des données factices par les profils réels de Andriamalala Raviro, Rakotoarisoa Fanantenana et Razafindramary Hasina.
    3. **Conservation de la structure :** Adaptation des données réelles au format attendu par le composant RecommendedProfiles.
    4. **Maintien de la navigation :** Conservation des liens vers les profils étudiants avec la bonne structure d'URL pour les recruteurs.

---

## 09-11-2025: Mise à jour des recommandations personnalisées dans le profil étudiant

- **Objectif :** Adapter les recommandations du profil étudiant pour correspondre au marché malgache et au profil de l'utilisateur.
- **Actions :**
    1. **Analyse du profil prérempli :** Identification des compétences actuelles du profil (Java, Spring Boot, etc.).
    2. **Analyse des offres disponibles :** Identification des tendances du marché malgache (technologies mobiles, cloud, etc.).
    3. **Mise à jour des recommandations :** Remplacement des anciennes recommandations génériques par des recommandations contextuelles basées sur le marché de Madagascar.
    4. **Personnalisation des conseils :** Adaptation des suggestions pour valoriser les compétences existantes et combler les écarts identifiés.

---

## 09-11-2025: Gestion des sections optionnelles dans le profil étudiant

- **Objectif :** Permettre aux sections du profil étudiant d'être nulles/vides tout en maintenant un design attrayant.
- **Actions :**
    1. **Mise à jour de l'interface ProfileData :** Rendre les sections techniques (compétences, langues, soft skills, projets, expériences, formations) optionnelles (nullable).
    2. **Mise à jour des données de profil :** Configurer le profil étudiant pour avoir uniquement les informations personnelles de base et laisser les autres sections à undefined.
    3. **Mise à jour des composants :** Ajouter des vérifications null/sécurité pour éviter les erreurs de type `Cannot read properties of undefined (reading 'map')` dans tous les composants éditables.
    4. **Amélioration UX :** Ajouter des messages et boutons utiles pour guider l'utilisateur lorsqu'une section est vide.
    5. **Mise à jour des données de pré-remplissage :** S'assurer que preRempliCV suit la même structure que le profil principal.

---

## 09-11-2025: Remplacement de l'icône Building2 par le logo de l'entreprise dans StudentApplications

- **Objectif :** Remplacer l'icône générique Building2 par le logo réel de l'entreprise dans la page de gestion des candidatures des étudiants.
- **Actions :**
    1. **Mise à jour de l'interface Application :** Ajout de la propriété logo à l'interface Application dans applicationStore.ts.
    2. **Mise à jour des données de candidature :** Ajout des chemins vers les logos des entreprises dans le store de candidatures.
    3. **Modification de StudentApplications.tsx :** Remplacement de l'icône Building2 par l'affichage du logo de l'entreprise si disponible.
    4. **Gestion des erreurs :** Ajout d'une gestion d'erreur pour afficher une initiale de l'entreprise si le logo n'est pas disponible ou en cas d'erreur de chargement.
    5. **Suppression de l'import inutilisé :** Suppression de l'import de Building2 puisque l'icône n'est plus utilisée.

---

## 09-11-2025: Mise à jour des candidatures pour Andriamalala Raviro dans le profil recruteur

- **Objectif :** Mettre à jour les données de candidature d'Andriamalala Raviro dans le profil recruteur selon les spécifications.
- **Actions :**
    1. **Modification des appliedJobs :** Changement de ['Développeur Full Stack', 'Ingénieur DevOps'] à ['Stage Développeur Web'] dans le tableau mockCandidates.

---

## 09-11-2025: Mise à jour des candidatures pour Andriamalala Raviro

- **Objectif :** Mettre à jour les données de candidature d'Andriamalala Raviro selon les spécifications.
- **Actions :**
    1. **Mise à jour de l'interface Application :** Ajout du champ studentName à l'interface Application dans applicationStore.ts.
    2. **Ajout de nouvelles candidatures :** Rajout de 3 candidatures pour Andriamalala Raviro chez Airtel Madagascar, Microlink Madagascar et Yas Madagascar.
    3. **Ajout au stage Orange :** Ajout d'Andriamalala Raviro à la candidature pour le stage Orange Madagascar.
    4. **Mise à jour de la fonction addApplication :** Modification de la fonction pour supporter le champ studentName.

---

## 09-11-2025: Affichage des logos des entreprises dans la carte LeafletMap

- **Objectif :** Remplacer l'icône générique d'entreprise par les logos réels des entreprises sur la carte LeafletMap.
- **Actions :**
    1. **Mise à jour de l'interface Company :** Ajout de la propriété logo à l'interface Company dans leaflet-map.tsx.
    2. **Modification de leaflet-map.tsx :** Création d'icônes personnalisées pour chaque entreprise avec leur logo si disponible, avec fallback sur l'icône par défaut si pas de logo.
    3. **Mise à jour de la légende :** Suppression de l'icône Building2 de la légende pour refléter les nouveaux marqueurs avec logos.

---

## 09-11-2025: Affichage des logos des entreprises dans les cartes d'offres et les détails

- **Objectif :** Remplacer l'icône générique Building2 par les logos réels des entreprises dans les cartes d'offres et les détails d'offres.
- **Actions :**
    1. **Modification de StudentOffers.tsx :** Remplacement de l'icône Building2 par l'affichage du logo de l'entreprise si disponible.
    2. **Modification de OfferDetailPage.tsx :** Remplacement de l'icône Building2 par l'affichage du logo de l'entreprise si disponible.
    3. **Gestion des erreurs :** Ajout de gestion d'erreur pour afficher l'icône par défaut si le logo n'est pas disponible ou en cas d'erreur de chargement.

---

## 09-11-2025: Affichage des logos des entreprises dans les offres

- **Objectif :** Remplacer l'icône générique Building2 par les logos réels des entreprises dans les cartes d'offres et les détails d'offres.
- **Actions :**
    1. **Modification de StudentOffers.tsx :** Remplacement de l'icône Building2 par l'affichage du logo de l'entreprise si disponible.
    2. **Modification de StudentOfferDetail.tsx :** Remplacement de l'icône Building2 par l'affichage du logo de l'entreprise si disponible.
    3. **Gestion des erreurs :** Ajout de gestion d'erreur pour afficher l'icône par défaut si le logo n'est pas disponible ou en cas d'erreur de chargement.

---

## 09-11-2025: Ajout de la section offres de stage dans le profil étudiant

- **Objectif :** Ajouter des offres de stage dans la section \\\"Toutes les offres\\\" du profil étudiant, avec le type \\\"stage\\\" dans le select et rendre les champs technologie et ville libres.
- **Actions :**
    1. **Ajout des offres de stage :** Ajout de 4 nouvelles offres de stage dans les données de test.
    2. **Mise à jour du type d'offre :** Ajout du type \\\"Stage\\\" aux données existantes pour permettre son utilisation dans les filtres.
    3. **Rendre technologie libre :** Remplacement du Select de technologie par un champ de recherche libre pour permettre des filtres plus souples.
    4. **Rendre ville libre :** Remplacement du Select de ville par un champ de recherche libre pour permettre des filtres plus souples.

---

## 07-11-2025: Suppression du tri dans la page des offres

- **Objectif :** Supprimer la fonctionnalité de tri dans la page StudentOffers.tsx pour simplifier l'interface et garder une structure pertinente.
- **Actions :**
    1.  **Suppression de l'état sortBy :** Suppression de la variable d'état `sortBy` dans le composant `StudentOffers.tsx`.
    2.  **Suppression du composant Select de tri :** Suppression du Select permettant de trier par \\\"Pertinence\\\", \\\"Salaire\\\" ou \\\"Plus récent\\\".
    3.  **Simplification de la logique de tri :** Remplacement de la logique de tri dynamique par un tri fixe par pertinence (matchingScore).
    4.  **Ajustement de la structure :** Modification de la grille de filtres de 4 colonnes à 3 colonnes pour conserver une disposition équilibrée après la suppression du filtre de tri.

---

## 07-11-2025: Nettoyage des données du frontend et création de données cohérentes pour Madagascar

- **Objectif :** Remplacer les données de test actuelles par des données cohérentes pour Madagascar, en utilisant le cv.pdf comme source d'inspiration pour le profil étudiant.
- **Actions :**
    1.  **Nettoyage des données actuelles :** Remplacement complet du contenu de `src/data/mockData.ts` par des données réalistes et cohérentes avec le contexte malgache.
    2.  **Création de données pour Madagascar :** Intégration de données pour les offres d'emploi, les candidats, les entreprises, les utilisateurs, les notifications, les statistiques et les profils.
    3.  **Mise à jour du profil étudiant :** Remplacement des données de profil par défaut par un profil étudiant typique pour Madagascar, incluant des coordonnées, une formation, des expériences et des compétences adaptées au contexte local.
    4.  **Adaptation des données de pré-remplissage CV :** Mise à jour de l'objet `preRempliCV` pour refléter les données d'un profil étudiant malgache.

---

## 07-11-2025: Remplacement du contenu de l'analytique du profile recruteur

- **Objectif :** Mettre à jour l'interface de la page d'analytique recruteur avec un nouveau design plus complet et moderne.
- **Actions :**
    1.  **Remplacement complet du contenu de `src/components/recruiter/RecruiterAnalytics.tsx` :** Remplacement de l'ancienne interface avec des cartes KPI de base par un nouveau dashboard complet incluant des graphiques interactifs (linéaires, camembert et barres) grâce à la bibliothèque recharts.
    2.  **Ajout de nouvelles fonctionnalités :** Les graphiques montrent l'évolution des candidatures, le statut des candidatures, les offres les plus populaires, ainsi qu'un tableau des dernières candidatures avec des scores de matching.
    3.  **Préservation des dépendances :** Les bibliothèques `recharts` et `lucide-react` étaient déjà présentes dans le projet, donc aucune installation supplémentaire n'était nécessaire.

---

## 04-11-2025: Affichage du mois et de l'année dans le calendrier

- **Objectif :** Afficher le mois et l'année en cours dans l'interface du calendrier pour une meilleure lisibilité.
- **Actions :**
    1.  **Mise à jour de `src/components/AppointmentCalendar.tsx` :** Ajout d'un élément affichant le mois et l'année en cours (format: \\\"MMMM yyyy\\\") au-dessus de la grille du calendrier.
    2.  **Utilisation de la fonction `format` de `date-fns` :** Utilisation de la locale française pour l'affichage du mois en cours.

---

## 04-11-2025: Ajout de la section Rendez-vous dans les sidebars

- **Objectif :** Ajouter la section \\\"Mes Rendez-vous\\\" aux sidebars de chaque utilisateur pour permettre un accès direct depuis la navigation.
- **Actions :**
    1.  **Mise à jour de `src/components/sidebars/StudentSidebar.tsx` :** Ajout d'un lien \\\"Mes Rendez-vous\\\" pointant vers `/student/appointments`.
    2.  **Mise à jour de `src/components/sidebars/RecruiterSidebar.tsx` :** Ajout d'un lien \\\"Mes Rendez-vous\\\" pointant vers `/recruiter/appointments`.
    3.  **Importation de l'icône Calendar** dans les deux composants de sidebar.
    4.  **Mise à jour de l'ordre des éléments** dans le menu pour une meilleure organisation.

---

## 04-11-2025: Déplacement de la section Rendez-vous vers les sidebars

- **Objectif :** Déplacer la section \\\"Mes Rendez-vous\\\" des profils vers les sidebars de chaque utilisateur pour une meilleure organisation.
- **Actions :**
    1.  **Suppression de l'onglet Rendez-vous** des composants `StudentProfile.tsx` et `RecruiterProfile.tsx`.
    2.  **Création de `src/components/student/StudentAppointments.tsx` :** Nouvelle page dédiée aux rendez-vous pour les étudiants.
    3.  **Création de `src/components/recruiter/RecruiterAppointments.tsx` :** Nouvelle page dédiée aux rendez-vous pour les recruteurs.
    4.  **Mise à jour de `StudentDashboard.tsx` :** Ajout de la route `/student/appointments` pour la page des rendez-vous étudiants.
    5.  **Mise à jour de `RecruiterDashboard.tsx` :** Ajout de la route `/recruiter/appointments` pour la page des rendez-vous recruteurs.

---

## 04-11-2025: Ajout de la section Rendez-vous

- **Objectif :** Ajouter une section \\\"Mes Rendez-vous\\\" commune aux profils étudiant et recruteur permettant de visualiser un calendrier des rendez-vous.
- **Actions :**
    1.  **Création de `src/types/appointment.ts` :** Définition de l'interface `Appointment` pour structurer les données de rendez-vous.
    2.  **Création de `src/components/AppointmentCalendar.tsx` :** Composant réutilisable pour afficher un calendrier de rendez-vous avec navigation mensuelle et détails quotidiens.
    3.  **Mise à jour de `src/data/mockData.ts` :** Ajout de données de test pour les rendez-vous (`mockAppointments`) et des fonctions utilitaires pour gérer les rendez-vous.
    4.  **Mise à jour de `src/hooks/useProfileData.ts` :** Extension de l'interface `ProfileData` pour inclure une propriété `appointments`, et ajout des fonctions `addAppointment`, `updateAppointment`, et `deleteAppointment`.
    5.  **Mise à jour de `src/components/student/StudentProfile.tsx` :** Ajout d'un nouvel onglet \\\"Mes Rendez-vous\\\" avec le composant `AppointmentCalendar` affichant les rendez-vous pour les étudiants (seulement les entretiens).
    6.  **Mise à jour de `src/components/recruiter/RecruiterProfile.tsx` :** Réorganisation du composant pour utiliser un système d'onglets avec \\\"Profil Entreprise\\\" et \\\"Mes Rendez-vous\\\", intégrant le composant `AppointmentCalendar` pour les recruteurs.

---

## 03-11-2025: Flow profil recruteur - Mes offres & Voir candidatures

- **Objectif :** Implémenter le flow complet pour le recruteur permettant de voir les candidatures par offre et d'accéder aux profils étudiants.
- **Actions :**
    1.  **Modification de `RecruiterOffers.tsx` :** Le bouton \\\"Voir candidatures\\\" redirige maintenant vers `/recruiter/candidates?offerId={id}` pour filtrer les candidatures par offre.
    2.  **Création de `FilteredApplications.tsx` :** Page pour afficher les candidatures filtrées par offer_id, avec recherche et pagination.
    3.  **Création de `RecruiterStudentProfile.tsx` :** Page de profil étudiant version recruteur affichant uniquement les champs autorisés (nom, email, expérience, compétences, langues, position, etc.).
    4.  **Mise à jour de `RecruiterDashboard.tsx` :** Ajout des routes pour les nouvelles pages.
    5.  **Ajout du bouton \\\"Voir profil\\\" :** Dans la liste des candidatures, ajout d'un bouton pour accéder au profil complet de l'étudiant.

---

## 03-11-2025: Suppression des sections Top Postes, CV & Export et Statistiques

- **Objectif :** Réduire le profil étudiant aux sections Fiche Personnel et Recommandations uniquement.
- **Actions :**
    1.  **Modification de `StudentProfile.tsx` :** Suppression des onglets \\\"Top Postes\\\", \\\"CV & Export\\\" et \\\"Statistiques\\\".
    2.  **Mise à jour de l'interface :** Le composant n'affiche plus que les onglets \\\"Fiche Personnel\\\" et \\\"Recommandations\\\".
    3.  **Nettoyage des imports :** Suppression des imports inutiles des composants supprimés.
    4.  **Ajustement de la grille :** Réduction du nombre de colonnes dans la liste des onglets de 5 à 2.

---

## 03-11-2025: Redirection après import de CV et synchronisation avec mockData

- **Objectif :** Assurer la redirection vers la page d'édition du profil après l'import du CV et synchroniser les modifications avec les données de mockData.
- **Actions :**
    1.  **Ajout de la redirection (`StudentPersonalTab.tsx`) :** Après les 7 secondes d'import du CV, l'application redirige maintenant vers `/student/profile` pour afficher le profil en mode édition avec les données pré-remplies.
    2.  **Mise à jour de la structure de données (`mockData.ts`) :** Le fichier a été enrichi pour contenir une structure complète de profil étudiant, avec des fonctions d'import/export (`getStudentProfile`, `updateStudentProfile`).
    3.  **Synchronisation du hook (`useProfileData.ts`) :** Le hook lit désormais les données initiales depuis `mockData` et met à jour `mockData` lors de la sauvegarde des modifications.
    4.  **Vérification de la complétude des données :** Confirmation que `preRempliCV` contient des données cohérentes pour toutes les sections du profil.

---

## 03-11-2025: Ajout de la simulation d'import de CV

- **Objectif :** Permettre de pré-remplir le profil étudiant en simulant l'import et l'analyse d'un CV.
- **Actions :**
    1.  **Création de données de test (`mockData.ts`) :** Un nouvel objet `preRempliCV` a été créé pour servir de source de données pour le pré-remplissage.
    2.  **Extension du hook (`useProfileData.ts`) :** Une nouvelle fonction `startEditingWithData` a été ajoutée pour permettre de passer en mode édition en injectant un jeu de données externe.
    3.  **Ajout du bouton et de la logique (`StudentPersonalTab.tsx`) :**
        - Un bouton \\\"Importer un CV\\\" a été ajouté à l'interface.
        - Au clic, une simulation de 7 secondes se lance, affichant un spinner.
        - À la fin du délai, le formulaire d'édition du profil est affiché, pré-rempli avec les données du `preRempliCV`.

---

## 03-11-2025: Ajout de la section \\\"Formations\\\"

- **Objectif :** Ajouter une section complète pour gérer le parcours académique de l'étudiant.
- **Actions :**
    1.  **Mise à jour de la structure de données (`useProfileData.ts`) :**
        - L'interface `ProfileData` a été étendue pour inclure un tableau `formations`.
        - Des données de test ont été ajoutées à `initialProfileData` pour cette nouvelle section.
    2.  **Création du composant (`EditableFormationSection.tsx`) :**
        - Un nouveau composant a été créé pour afficher la liste des formations et permettre leur ajout, modification et suppression en mode édition.
    3.  **Intégration au profil (`StudentPersonalTab.tsx`) :**
        - La nouvelle section \\\"Formations\\\" est maintenant visible dans l'onglet du profil personnel.
    4.  **Mise à jour du calcul de progression (`profileProgression.ts`) :**
        - La fonction de calcul de la complétion du profil a été mise à jour pour inclure le score de la section \\\"Formations\\\", la rendant plus précise.

---

## 03-11-2025: Refonte du calcul de progression du profil

- **Objectif :** Remplacer l'ancien calcul de complétion du profil par une nouvelle logique pondérée plus détaillée, basée sur un modèle fourni.
- **Actions :**
    1.  **Création d'un utilitaire (`src/utils/profileProgression.ts`) :** La nouvelle logique de calcul a été traduite de PHP en TypeScript et isolée dans une fonction dédiée. Cette fonction adapte le calcul à la structure de données du frontend (notamment en omettant la section \\\"Formations\\\", inexistante côté client).
    2.  **Mise à jour du badge de progression (`profile-progress-badge.tsx`) :**
        - L'ancienne logique de calcul a été supprimée.
        - Le composant utilise désormais la nouvelle fonction pour calculer le score global.
        - Le popover affichant les détails a été mis à jour pour refléter les nouvelles catégories et leurs pourcentages respectifs, offrant une vue détaillée et cohérente avec le nouveau système de scoring.

---

## 03-11-2025: Correction de syntaxe JSX

- **Action :** Correction d'une erreur de syntaxe dans `StudentLocation.tsx`.
- **Raison :** Un commentaire (`/* Statistiques */`) n'était pas entouré d'accolades (`{}`), ce qui provoquait une erreur de compilation \\\"Unterminated regexp literal\\\".
- **Impact :** Le problème de compilation est résolu.

---

## 03-11-2025: Amélioration de l'interactivité de la page Localisation

- **Objectif :** Rendre les cartes statistiques de la page Localisation dynamiques et interactives.
- **Actions :**
    1.  **Réorganisation de l'UI (`StudentLocation.tsx`) :**
        - Suppression de la carte statique \\\"Entreprises partenaires\\\".
        - Réorganisation des deux cartes restantes (\\\"Offres disponibles\\\" et \\\"Entreprises localisées\\\") sur une grille.
    2.  **Logique de calcul (`StudentLocation.tsx`) :**
        - Le compteur \\\"Offres disponibles\\\" calcule désormais dynamiquement le nombre d'offres provenant uniquement des entreprises situées dans le rayon de recherche défini par l'utilisateur.
    3.  **Interactivité et redirection (`StudentLocation.tsx`) :**
        - La carte \\\"Offres disponibles\\\" est maintenant cliquable.
        - Un clic redirige vers la page des offres (`/student/offers`) en passant les noms des entreprises filtrées en paramètre d'URL (ex: `?companies=CompanyA,CompanyB`).
    4.  **Gestion du filtre (`StudentOffers.tsx`) :**
        - La page des offres lit désormais les paramètres d'URL pour appliquer un filtre basé sur les entreprises.
        - Un badge s'affiche en haut de la liste pour indiquer le filtre actif et permettre sa suppression, assurant une expérience utilisateur claire et contrôlable.

---

## 03-11-2025: Nettoyage de l'affichage du profil

- **Action :** Suppression de l'affichage de la localisation de l'en-tête principal du profil étudiant (`EditableProfileHeader.tsx`).
- **Raison :** La gestion de la localisation est désormais centralisée dans son propre onglet/page dédié(e) (\\\"Location\\\"). Cette modification évite la redondance et clarifie l'interface.
- **Impact :** L'adresse n'est plus visible ni modifiable directement sous le nom de l'étudiant. Elle reste gérée dans la section \\\"Location\\\".

---

## 03-11-2025: Correction du bug de mise à jour de la localisation

- **Problème :** La modification de la localisation via le sélecteur sur la carte mettait à jour une valeur dans un état temporaire, mais ne la sauvegardait jamais dans l'état principal du profil. En conséquence, les changements n'étaient jamais répercutés dans l'interface.
- **Actions de correction :**
    1.  **Modification de `useProfileData.ts` :** La fonction `setProfileData` (qui modifie l'état principal) a été exposée par le hook pour permettre des sauvegardes immédiates.
    2.  **Modification de `pages/StudentLocation.tsx` et `components/student/StudentLocationTab.tsx` :** La logique de mise à jour a été modifiée pour utiliser `setProfileData` au lieu de `updateEditingData`. 
- **Résultat :** Tout changement de position sur la carte est maintenant immédiatement sauvegardé dans l'état global et visible sur tous les composants de l'application.

---

## 03-11-2025: Tentative de correction (Annulée)

- **Action :** Annulation des modifications précédentes qui ajoutaient un composant `EditableLocationSection` superflu.
- **Analyse :** La première analyse avait conclu à tort que le code était déjà correct, ce qui était une erreur. Le vrai problème était la non-persistance de l'état d'édition.

---

## 17-11-2025: Correction de l'affichage du profil étudiant pour les recruteurs

- **Objectif :** Permettre aux recruteurs de voir les profils détaillés des étudiants avec une gestion correcte des données manquantes.
- **Actions :**
    1.  **Passage de l'ID étudiant :** Modification de `RecruiterStudentProfile.tsx` pour transmettre l'ID de l'étudiant au composant `StudentProfile`.
    2.  **Support de profils spécifiques :** Mise à jour du hook `useProfileData.ts` pour charger un profil utilisateur spécifique par son ID, en plus du profil de l'utilisateur connecté.
    3.  **Gestion des données manquantes :** Correction de `EditableProfileHeader.tsx` pour gérer les cas où `personalInfo` ou ses propriétés sont `undefined`.
    4.  **Sécurité des accès :** Ajout de vérifications de nullité pour éviter les erreurs d'accès aux propriétés de `personalInfo`.
    5.  **Valeurs par défaut :** Mise en place de valeurs par défaut appropriées pour les champs manquants dans l'interface utilisateur.

---

## 17-11-2025: Correction de la récupération des profils étudiants

- **Objectif :** Corriger l'erreur de récupération des profils étudiants qui empêchait la recherche de fonctionner.
- **Actions :**
    1.  **Identification du problème :** Le service utilisait `dataProvider.getUsers()` qui n'existe pas dans le dataProvider.
    2.  **Changement d'approche :** Utilisation de `dataProvider.getCandidates()` pour récupérer les étudiants, puis `dataProvider.getUserProfile()` pour obtenir les détails complets.
    3.  **Amélioration de la robustesse :** Le service récupère maintenant correctement les profils complets des étudiants depuis Firestore.
    4.  **Gestion des erreurs :** Ajout de protections pour gérer les cas où les profils ne sont pas trouvés.

---

## 17-11-2025: Correction de la gestion des paramètres de recherche

- **Objectif :** Corriger la logique de gestion des paramètres de recherche pour prendre en compte les différents noms de paramètres possibles passés par le système d'intention.
- **Actions :**
    1.  **Extension de la gestion des paramètres :** Ajout de la gestion des paramètres `competence`, `technologies`, `skills` et `domaine` dans la méthode `rechercherEtudiants`.
    2.  **Correction du bug :** Le système détectait maintenant les compétences comme `params.competence` mais ne les traitait pas correctement.
    3.  **Amélioration de la robustesse :** Le service recherche maintenant dans plusieurs noms de paramètres possibles pour assurer une meilleure compatibilité.

---

## 17-11-2025: Optimisation de l'espace pour le remplissage complet de la div

- **Objectif :** Assurer que les éléments de recherche remplissent complètement la div conteneur avec une répartition optimale de l'espace.
- **Actions :**
    1.  **Extension à la largeur totale :** Maintien de la classe `w-full` au conteneur flex pour permettre l'expansion complète.
    2.  **Ajustement du bouton :** Changement de `min-w-[120px]` à `w-[120px]` pour fixer la largeur du bouton et permettre au champ de recherche de prendre exactement l'espace restant.
    3.  **Optimisation de l'affichage :** Le champ de recherche s'agrandit dynamiquement pour remplir l'espace disponible après le bouton fixe.

---

## 17-11-2025: Ajout d'un bouton de recherche pour optimiser l'utilisation de l'IA

- **Objectif :** Remplacer l'appel automatique à l'IA à chaque frappe par un système avec bouton de recherche pour réduire les coûts d'API.
- **Actions :**
    1.  **Modification du composant RecruiterStudentSearch :** Ajout d'un bouton \\\"Rechercher\\\" à côté du champ de recherche.
    2.  **Suppression de useEffect :** Suppression de l'effet qui déclenchait la recherche à chaque changement de texte.
    3.  **Ajout d'un gestionnaire de soumission :** Création d'une fonction `performSearch` appelée uniquement lors du clic sur le bouton ou de l'appui sur Entrée.
    4.  **Amélioration de l'interface :** Ajout d'un indicateur visuel (icône de recherche) sur le bouton et gestion du chargement.
    5.  **Optimisation des coûts :** Réduction significative du nombre d'appels à l'API Groq en limitant les appels aux recherches intentionnelles.

---

## 17-11-2025: Création du service de recherche étudiants avec IA

- **Objectif :** Remplacer le moteur de recherche étudiants statique par un service alimenté par l'IA pour une recherche sémantique en langage naturel.
- **Actions :**
    1.  **Création du service de recherche :** Développement de @src/services/studentSearchService.ts avec une logique de recherche sémantique utilisant l'API Groq.
    2.  **Intégration avec le chatbot :** Ajout de l'action `rechercher_etudiants` dans @src/services/chatbotService.ts pour permettre aux recruteurs de rechercher des étudiants via l'interface de chatbot.
    3.  **Mise à jour du composant :** Remplacement de la logique de recherche statique dans @src/components/recruiter/RecruiterStudentSearch.tsx par une intégration avec le nouveau service IA.
    4.  **Amélioration de l'UX :** Ajout d'un indicateur de chargement et d'une gestion d'erreur pour une meilleure expérience utilisateur.
    5.  **Analyse sémantique :** Mise en place d'une analyse approfondie des requêtes de recherche pour extraire les paramètres pertinents (compétences, localisation, disponibilité, etc.).
    6.  **Calcul de matching :** Implémentation d'un système de score de pertinence basé sur la correspondance entre les critères de recherche et le profil des étudiants.

---

## 17-11-2025: Synchronisation avec l'état actuel du projet

- **Objectif :** Comprendre la structure actuelle de la base de données et l'historique des modifications pour assurer une synchronisation complète avec l'état du projet.
- **Actions :**
    1.  **Analyse de la structure de données :** Lecture et compréhension du fichier @scripts/init_firestore-nouveau.mjs contenant la conception complète de la base de données Firestore.
    2.  **Étude de l'historique :** Lecture du fichier @edit.md pour comprendre l'historique complet des modifications apportées au projet.
    3.  **Documentation des entités :** Identification des collections Firestore (users, offers, applications, notifications, ai_recommendations) et de leur structure de données.
    4.  **Analyse des profils :** Compréhension des structures de données pour les recruteurs (intégrés avec les infos entreprises) et les étudiants (profil détaillé avec compétences, expériences, formations, etc.).
    5.  **Référencement des données :** Documentation des données de test pour les entreprises (Orange, Yas, Airtel, SystAsia, Microlink) et des étudiants (Fanantenana, Raviro, Hasina).
    6.  **Mise à jour du contexte :** Ajout de cette entrée dans le fichier edit.md pour conserver un historique des modifications conformément aux règles établies.

---

## 03-11-2025: Première tentative de refactorisation (Annulée)

- **Objectif :** Corriger le bug de mise à jour de la localisation.
- **Actions (annulées) :**
    1.  Nettoyage de `mockData.ts`.
    2.  Création d'un nouveau composant `EditableLocationSection`.
- **Raison de l'annulation :** Mauvaise interprétation de la demande, qui a conduit à l'ajout d'un composant non désiré au lieu de corriger le flux de données existant.