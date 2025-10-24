# Corrections Plateforme - Division en Prompts

## PROMPT 1 - Navigation et Structure Générale
```
Améliorations générales de navigation :
- Éviter les redondances, inclure les pages existantes au lieu de toujours créer
- Ajouter un bouton de déconnexion sur le sidebar étudiant et entreprise
- Ajouter pagination et critere multicritere pertinante sur toutes les listes qui peuvent avoir plusieurs données
```

## PROMPT 2 - Profil Étudiant et Modifications
```
Section Profil Étudiant :
- Rendre l'image de profil modifiable (actuellement non modifiable)
- Ajouter Google Maps pour saisir la position de l'étudiant dans le profil
- S'assurer que tous les champs du profil sont modifiables
```

## PROMPT 3 - Localisation Étudiant et Google Maps
```
Section Localisation Étudiant :
- Supprimer l'input "Adresse actuelle" (utiliser l'adresse du profil étudiant)
- Sur "Carte des opportunités" : afficher Google Maps avec :
  * Position de l'étudiant (légende "Votre position")
  * Positions des entreprises de la section "Offres à proximité"
  * Connecter les positions avec des lignes affichant les distances
- Créer une page réutilisable pour Google Maps qui affiche positions entreprises + étudiant avec lignes de distance
```

## PROMPT 4 - Gestion des Offres Étudiant
```
Section Offres Étudiant :
- Garder "Offres recommandées pour vous"
- Ajouter titre "Toutes les offres" en bas des recommandations
- et et tranformer le filtre de recherche ud recommandations pour le section "Toutes les offres" (recommandations intactes pas de filtrage)
- Bouton "Postuler" : ajouter loading puis popup "Candidature envoyée"
- Créer page détail offre avec Google Maps (position entreprise + étudiant reliées + distance)  , comment sur la section localisation du profil etudiant   mais juste sa position et  l entrprise du poste 
```

## PROMPT 5 - Analytiques et Page Inscription
```
Corrections Analytiques et Inscription :
- Étudiant : supprimer "Score de matching moyen" des analytiques
- Créer page d'inscription pour entreprises
- Entreprise Analytiques : supprimer "Taux de conversion" et "Candidats présélectionnés"
```

## PROMPT 6 - Gestion Candidatures Entreprise
```
Section Candidatures Entreprise :
- Si candidature acceptée : transformer bouton "Accepter" en "Planifier entretien"
- Clic "Planifier entretien" : formulaire saisie date rendez-vous
- Si refusée : notification côté entreprise
- Nom/image candidat cliquables → profil étudiant
- Ajouter filtres importants sur liste candidatures
```

## PROMPT 7 - Mes Offres Entreprise et Profil
```
Section Mes Offres Entreprise :
- Page création offre avec toutes les informations des listes : sur creation de l offre rajouter un chekbox anonyme 
- Ajouter filtres importants sur "Mes offres"
- "Voir candidatures" → redirection liste candidatures
- "SourcingAI" → redirection liste candidatures
- Profil Entreprise : bouton "Modifier" rend toutes données modifiables
- Supprimer section "Statistiques de Recrutement"


rectif : 
  effacer le profil  admin 



- Entreprise Analytiques : supprimer "Taux de conversion" et "Candidats présélectionnés"

et reparti bien le 3 car sur l analytique d entreprise 


## PROMPT 6 - Gestion Candidatures Entreprise
```
Section Candidatures Entreprise :
- Si candidature acceptée : transformer bouton "Accepter" en "Planifier entretien"
- Clic "Planifier entretien" : formulaire saisie date rendez-vous
- Si refusée : notification côté entreprise
- Nom/image candidat cliquables → profil étudiant mais pas de boutton modifier ni saisir le localisation sur le profil de l etuddiant 
- Ajouter filtres importants sur liste candidatures
```


et rajouter un section section candidature sur le profil etudiant , qui affiche se candidature 
