

il faut eviter les redandances , includer les pages s il existe deja au lieu de toujours cree 
rajoute deconnexion sur le sidebar de l etudiant et entreprise 
NB je veux pas que vous ferez un mettier si je vour explique les processus cree juste l affichage suivant les scenario expliquer 

etidiant :
    section 
        profil : 
            faite en sorte que l image et modifiable ausssi , car la elle est el seule qui n est pas modifiable 
            ajouter u google map pour pour saisie la position de l etudiant  
        Localisation :
            effacer l input Adresse actuelle car il va utiliser l addresse de l etudiant saisie sur sa profil
            et sur le Carte des opportunités affiche un google map qui affiche le position de l etudiant (avec legende votre position) 
            et il affiche aussi les position des entreprise afficher sur le section Offres à proximité  apres avoir faire le recherche sur le Rayon de recherche ,
            puis connecter le position de l etudiant avec ces entreprises et afficher sur le ligne le distance , en a deja la distance sur le liste des Offres à proximité
        Offre :
            garder cette liste des Offres recommandées pour vous mais ajouter un titre toutes les offres en bas des recommandation
            ajouter un filtre de recherche intelligent pour que l etudiant puisse rapidement recherche l offre d en t il a besoin , avous de trouver ce qu on doit mettre en filtre (pour le section toutes les offres , le recommandation reste intacte)
            si il apuye sur postuller ajouter un loading  (car je vais cree un fonction pour faire un candidature en un clic ) puis afficher un popup de notification  , candidature envoye 
            si il appuye sur cree un page fcihe offre qui affiche le detail de l offre , avec un google map qui affiche le position de l entreprise et le position du candidat relie avec un line avec un distance sur la google map  le bon pratique c est de cree un page qui realise cette google map qui affiche le position des entreprises donnees et de l etudiant  en session un line reliant ces position avec un distance en kilomettre  puis c est cette page qu il include juste pour le  detail offre et le section Localisation 
        Analytiques :
            supprimer le Score de matching moyen

entreprise :

    page d inscription pour entreprise
    section 
        analitique :
            suppression du Taux de conversion 
            suppression card Candidats présélectionnés

        candidature :
            si le candidature accepter transformer le boutton accepter en planifier l entretien 
            et si il clique sur cette boutton , afficher un formulaire de saisie de la rendez vous d entretien  en saisiesant seulemt la date , et si refuser aussi aficher un notification cote entreprise que le cnadidature es refuse comme celle de l accepter 
            et faite en sorte que le nom et image de candidate soit clicable et si il clique il affiche le profile de l etudiant
            rajouter les filtres important sur le liste de candidature 

        Mes offres 

            si il clique sur la page cree un offre  afficher un page de saisie d offre , avec les informations afficher sur les lites , rajouter un filtre important sur cette mes offres 
            et si il appuye sur voir candidature redirige e sur le liste de candidature     
            et si il appuye sur le sourcingAi redirige le sur le liste de candidature
        Profil 
            faite en sorte que lors qu il appuye sur modifier toutes les donnnes dyu profil entreprise soit modifiable 
            et supprimer le section Statistiques de Recrutement

admin :
    section 
        Utilisateurs:
            cree un page modification d utilisateur , si il clic sur icon edit du liste utilisateurs
            rajouter les filtres important et un pagination 
        Validation Offres:
               rajouter les filtres important et un pagination 
               si il appuye sur le boutton valider afficher un notification et  changer le badge en valider et en lever les boutton refuser et valider  
               supprimer le boutton voir details
        cree un onglet gestion des partenaire , pour le saisie des profiles d un entreprise sans compte c est a dire juste le profil 
        Gestion offres :
            rajouter les filtres important et un pagination 
                supprimer les boutton statisiques 
                includer le section notification sur le profil recruteur dans le profil admin car il aurra un gestion de candidateurs su l admin 
                et includer le section mcandidature le profil recruteur dans le profil admin 
                et modifier le boutton gerer candidature en voir les candidature comment celle de l entreprise et rediriger le dans le liste de cndidature si il clic sur cette boutton 
                et sur i il appuyer sur le cree offre : realiser le meme chose comme sur l entreprise ,includer juste celle de  l entreprise
        Profil :
            faite en sorte que le profil admin soit modifiable  
            garder juste le changer mot de passe sur le section action rapides 

    et supprimer l assistance ia dans le profil admin 

rajouter un pagination sur toutes les lites qui pourrais avoir plusieurs donnees et rajouter des filtres important sur ces lites 