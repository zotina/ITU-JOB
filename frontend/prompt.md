Prompt 1 — Pagination globale des listes

Objectif : Ajouter une pagination réutilisable à toutes les pages qui affichent des listes (offres, candidatures, entreprises, profils, etc.) si la liste peut devenir très longue.
Comportement attendu / critères d'acceptation :

Composant de pagination standard (page size configurable : 10/20/50) utilisé partout.

Chargement depuis mockData (pas d’HTML statique). Les opérations next/prev/jump mettent à jour l’affichage et conservent l’état (page courante).

Pour chaque page de liste vérifier et activer la pagination si totalItems > pageSize.

Tests manuels : liste d’offres (profil étudiant), liste de candidatures (recruteur), liste d’entreprises et résultats de recherche doivent tous montrer la pagination quand nécessaire.

Prompt 2 — Flow « Postuler » → ajouter candidature et redirection

Objectif : Lorsqu’un utilisateur clique Postuler sur une offre, créer une candidature dans mockData et rediriger vers la liste de candidatures.
Comportement attendu / critères d'acceptation :

Trouver tous les boutons Postuler (pages offres, cartes, détails, recommandations) et remplacer l’action par :

Créer une nouvelle entrée candidature dans mockData (avec id, offre_id, candidat_id, date, statut "Envoyée").

Rediriger vers la page Liste de candidatures.

Mettre en surbrillance (selected effect) la carte de la candidature nouvellement créée en haut de la liste.

Aucun appel serveur réel : tout en mémoire dans mockData.

Acceptance : en cliquant Postuler, on voit la liste et la nouvelle candidature sélectionnée.

Prompt 3 — Mise à jour position sur carte (Profil étudiant)

Objectif : Rendre la localisation du profil étudiant éditable et réellement modifiée dans mockData.
Comportement attendu / critères d'acceptation :

Section Localisation avec champs éditables : Adresse actuelle (format : Ville, Pays), Latitude, Longitude. Exemple : Paris, France.

Lors de la sauvegarde : mettre à jour mockData.profil_etudiant.position (address, latitude, longitude).

Les cartes/annonces/entreprises utilisant la position doivent lire la position depuis mockData et se recalculer après modification.

UI : bouton Modifier la position + formulaire + sauvegarder/cancel.

Prompt 4 — Cartes d’Entreprises : n’afficher que le nombre d’entreprises + distance

Objectif : Simplifier les cartes « Entreprises localisées » pour qu’elles n’affichent que le nombre d’entreprises visibles et la distance.
Comportement attendu / critères d'acceptation :

Si l’UI propose un affichage agrégé (ex. carte listant 2 entreprises) la carte doit montrer uniquement :

Entreprises localisées : 2

Distance : X km (calculé depuis la position utilisateur dans mockData)

Lors d’un filtre, mettre à jour le nombre (2) dynamiquement selon résultats.

Exemple : si filtre réduit le résultat à 1, carte affichera Entreprises localisées : 1.

Prompt 5 — Réorganisation sections du profil étudiant + mockData

Objectif : Séparer les sections Langues, Compétences techniques, Compétences personnelles (soft skills), Mes projets. Rendre toutes les sections modifiables et stockées dans mockData.
Détails & règles :

Renommer Compétences → Compétences techniques (levels maintained).

Ajouter Compétences personnelles (soft skills) : liste de noms (pas de niveau).

Ajouter Langues comme section séparée avec nom + niveau (niveau_int).

Ajouter section Mes projets : titre, description courte, lien (optionnel).

Chaque section a Ajouter, Modifier, Supprimer. Toutes modifications mettent à jour mockData.

Après modification, sauvegarder mockData et re-render de l’UI.

Fournir un exemple mockData minimal cohérent pour la présentation.

Prompt 6 — Calcul de progression du profil (implémentation fournie)

Objectif : Remplacer / utiliser la logique de progression du profil que tu as fournie — implémenter exactement (corriger petites coquilles) et faire en sorte que le pourcentage s’affiche dans l’UI.
Actions :

Implémenter la fonction calculateProfileProgression($profil) fournie (corriger la faute progression_deails → progression_details).

Lors d’un update profil (mock import ou édition), recalculer la progression et mettre à jour mockData.profil.progression.

Afficher la progression globale (ex : barre + pourcentage) et détails par section (info_personnel, formation, etc.) sous forme de tooltip ou modal pour la présentation.

Use-case : modifier une section (ex. ajouter photo) doit augmenter la progression en temps réel (à partir du mockData).

Prompt 7 — Import CV (simulation) : delay 7s puis pré-remplir profil étudiant

Objectif : Simuler un import CV qui prend 7 secondes puis redirige sur le profil étudiant en mode édition avec toutes les sections pré-remplies par un dataset statique.
Comportement attendu / critères d'acceptation :

Bouton Importer CV sur profil étudiant.

Au clic : show loader / spinner pendant exactement 7 secondes (simulé), puis rediriger vers la page Editer profil étudiant avec tous les champs remplis depuis mockData.preRempliCV.

mockData.preRempliCV doit contenir des données cohérentes pour toutes sections : info perso, formations, expériences, compétences techniques, soft skills, langues, projets, position, photo, bio, etc.

L’utilisateur peut modifier et sauvegarder ; ces modifications écrasent mockData.profil.

Prompt 8 — Postes recommandés → voir offre → liste d’offres avec sélection

Objectif : Dans “Postes recommandés pour vous” (profil étudiant), si l’utilisateur clique Voir l’offre, rediriger vers la liste d’offres et mettre l’offre cliquée en première position avec un effet visuel de sélection.
Détails :

Lorsque l’offre est cliquée, réordonner temporairement la liste en plaçant l’offre en tête, et appliquer un style selected (bande lumineuse, bordure, ou slide-in) pour la présentation.

Fournir un petit message informatif : “Offre selectionnée : [Titre]”.

La sélection est visuelle seulement (mockData reste cohérent) et s’enlève si l’utilisateur navigue loin.

Prompt 9 — Flow profil recruteur : Mes offres & Voir candidatures

Objectif : Pour un recruteur, sur la section Mes Offres d'Emploi, faire en sorte que :

Voir candidatures redirige vers la liste de candidatures filtrée sur cette offre.

Voir profil sur chaque candidature redirige au profil étudiant (version recruteur) affichant seulement les champs autorisés.
Détails :

Utiliser mockData statique pour postes et candidatures.

La page Liste de candidatures doit recevoir offer_id en query/state et mettre en surbrillance la carte(s) correspondante(s).

La page Voir profil étudiant doit afficher uniquement la fiche personnelle visible aux recruteurs (ex. nom, email, expérience résumé, compétences techniques, langues, position) — ne pas afficher données privées non autorisées.

Ajouter bouton Voir profil sur la liste de candidatures.

Prompt 10 — Notifications : suppression de gestion dans profil recruteur + notifications cliquables

Objectif : Simplifier notifications : effacer la section “gestion de notification” du profil recruteur, mais rendre la liste de notifications cliquable et contextuelle.
Comportement attendu :

Supprimer la page/section “Gestion de notification” dans le profil recruteur (UI hidden).

Notifications restent dans un menu/centre de notifications global (mockData.notifications).

Chaque notification a type, target (ex: offre_id, candidature_id), read.

Au clic sur une notification :

Marquer read.

Rediriger selon type :

Nouvelle candidature → Liste de candidatures filtrée sur offre_id et carte correspondante en selected.

Offre publiée → liste d'offres avec l'offre sélectionnée.

Message → ouvrir la page correspondante.

Recruteur n’a plus d’UI pour gérer notifications (toggle off).

Prompt 11 — Entreprise : modifier profil entreprise + lien clicable depuis poste étudiant

Objectif : Permettre la modification du profil entreprise (éditeur qui met à jour mockData) et faire en sorte que sur les cartes/offres côté étudiant, cliquer sur le nom ou logo redirige vers le profil de l’entreprise.
Détails :

Page Editer profil entreprise : nom, description, logo, adresse (city,country), site web, contact. Sauvegarde met à jour mockData.companies.

Sur les fiches d’offre / cartes côté étudiant, logo et nom sont cliquables → redirigent vers Profil entreprise (lecture).

MockData doit contenir companies cohérentes liées aux offres via company_id.

Prompt 12 — MockData : centraliser toutes les données et opérations CRUD en mémoire

Objectif : Éliminer les données HTML statiques : tout doit charger depuis mockData et toute action (create/update/delete) doit modifier mockData. Fournir un dataset cohérent pour la présentation.
Contenu minimum mockData (exemples) :

users (étudiant/recruteur), profil_etudiant, profil_recruteur, companies, offers, candidatures, notifications, preRempliCV.

Chaque entité a les champs nécessaires (id, name, created_at, etc.).
Règles :

Toutes les pages utilisent mockData pour load/save.

Après chaque action (create/update/delete) updater mockData et rerender.

Pour la présentation, fournir un fichier JSON mockData.presentation.json incluant ~10 offres, 8 entreprises, 6 étudiants, 15 candidatures, et notifications.