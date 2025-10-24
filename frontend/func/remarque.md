👉 Prompt :

Analyse et propose des améliorations UX/UI globales pour une plateforme de recrutement avec différents rôles (Admin, Étudiant, Recruteur).

Problème :

Navigation surchargée → trop d’options dans la sidebar.

Hiérarchie visuelle incohérente (icônes, tailles, contrastes).

L’utilisateur ne voit pas clairement où il se trouve.

Actions (ex : déconnexion, suppression) sans feedback immédiat.

Mauvaise lisibilité en mobile, sidebar réduite confuse.

Différences de design entre les rôles → manque de cohérence.

Sidebar statique → pas scalable si nouvelles fonctionnalités.

Solution :

Regrouper les menus en sections claires (Profil, Gestion, Analyse).

Hiérarchiser les textes et icônes avec tailles/espacement.

Accentuer l’état actif par couleur/gras/bordure.

Ajouter feedback visuel (toasts, spinners, confirmations).

Adapter en mobile avec tooltips et bottom navigation.

Harmoniser les rôles avec une base commune et variations légères.

Rendre la sidebar dynamique selon permissions/usage.

Implémentation :

Menu vertical 5–6 items max, sous-menus repliables.

Icônes taille fixe (h-5 w-5), titres uppercase gris, actif = border-l-4 + couleur primaire.

Toasts (✅ succès / ❌ erreur), spinner sur actions longues.

Tooltip sur icônes en mode collapsed.

Largeur sidebar fixe (w-60), variation subtile par rôle (icônes/couleur secondaire).

Menus récupérés depuis DB/config selon rôle.

🎓 Profil Étudiant (Candidate Profile)

👉 Prompt :

Analyse et propose des améliorations UX/UI pour le profil Étudiant d’une plateforme de candidature.

Problème :

Informations clés pas hiérarchisées (nom, photo, statut, compétences).

Navigation peu visible → difficile de trouver où compléter le profil.

Formulaires peu intuitifs (labels, placeholders, feedback manquant).

Pas de guidage clair (l’étudiant ne sait pas quoi compléter en priorité).

Feedback manquant lors de suppression d’expérience.

Solution :

Mettre en avant photo + nom + statut + progression profil.

Créer une checklist avec % complétion du profil.

Standardiser les formulaires avec labels et validation en direct.

Afficher une timeline des candidatures avec statuts.

Ajouter feedback visuel (toasts succès/erreur, modales confirmation).

Implémentation :

Header profil avec avatar rond + statut (“Étudiant ITU”).

Progress bar de complétion (ex : 70%).

Onglets clairs : Infos perso / Expériences / Compétences / Documents.

Liste candidatures récentes avec tags (En attente, Acceptée, Refusée).

Toasts : ✅ “Profil mis à jour” / ❌ “Erreur d’enregistrement”.

🧑‍💼 Profil Recruteur (Company Dashboard)

👉 Prompt :

Analyse et propose des améliorations UX/UI pour le profil Recruteur d’une plateforme de candidature.

Problème :

Trop d’informations affichées (offres, candidats, candidatures).

Pas de hiérarchie → difficile de voir l’essentiel rapidement.

Navigation dispersée entre offres, candidatures, entretiens.

Feedback peu clair lors de la publication d’offres ou du suivi candidat.

Solution :

Prioriser les KPI (nouvelles candidatures, entretiens planifiés, offres actives).

Créer un dashboard avec cartes KPI et liste des candidatures récentes.

Navigation par sections claires : Offres / Candidats / Entretiens / Statistiques.

Ajouter feedback visuel clair (toasts, spinners, confirmations).

Implémentation :

Dashboard avec 3–4 cartes KPI (📥 Candidatures reçues, ⏳ En cours, ✅ Embauches).

Liste des candidatures avec filtres rapides (poste, statut).

Sidebar : Offres / Candidats / Entretiens / Statistiques / Paramètres.

Toasts : ✅ “Offre publiée avec succès” / ❌ “Erreur de création”.

Spinner lors de génération CV ou chargement massif.