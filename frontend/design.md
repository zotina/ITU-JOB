Palette de couleurs 
Variable,Hex,Rôle
--new-green,#4CAF50,"Vert principal – Icônes, en-têtes de cartes, tags, salaire, liens hover, soulignement navigation"
--new-blue,#3F8BDB,"Bleu action – Boutons ""Chercher"", ""Postuler"", ""Valider"""
--blue-hover,#2c70b8,Hover sur les boutons bleus
--gray-bg,#F5F5F5,Fond global (identique au site ITU)
--white-card,#FFFFFF,"Cartes, sidebar, header"
--gray-text,#555,Texte principal
--gray-light,#666,Texte secondaire
--gray-border,#eee,Bordures subtiles
--dark-footer,#37474F,Footer
--footer-text,#B0BEC5,Texte footer
--tag-bg,#e8f5e9,Fond des tags (vert très clair)


Design Tendance & Spécifications techniques
Catégorie,Détails
Typographie,"Inter (Google Fonts) – 400, 600, 700 – Moderne, lisible, professionnelle"
Espacement,1.6rem line-height – 2rem padding interne – 1.8rem gap entre cartes
Coins arrondis,"12px global (--radius) – Moderne, doux, non agressif"
Ombres,"--shadow-sm: 0 4px 12px rgba(0,0,0,0.08) → léger--shadow-md: 0 8px 24px rgba(0,0,0,0.12) → hover"
Transitions fluides,"all 0.3s ease sur tous les éléments interactifs (hover, focus, scale)"

Éléments de design spécifiques
Header – Glassmorphism discret

Fond blanc pur
Bordure inférieure #eee
Ombre légère (--shadow-sm)
Logo : icône verte #4CAF50, texte noir
Liens : soulignement vert animé au hover

Hero Section – Épurée & fonctionnelle

Fond gris clair (#F5F5F5)
Titre centré, gros, en noir #333
Barre de recherche :

Fond blanc
Bordure #ddd
Bouton bleu #3F8BDB → hover #2c70b8
Coins arrondis 12px



Sidebar – Navigation claire

Carte blanche, ombre douce
Icônes vertes #4CAF50
Séparateurs fins #eee
Hover : texte devient vert

Cartes d’offres (Job Cards)

En-tête : fond vert #4CAF50, texte blanc
Corps : padding généreux, texte clair
Tags : fond #e8f5e9, texte vert
Salaire : icône + texte en vert
Bouton "Postuler" : bleu #3F8BDB, coins ronds, scale 1.05 au hover
Effet hover : élévation + ombre renforcée

Footer – Sobre & professionnel

Fond gris anthracite #37474F
Texte clair #B0BEC5
Liens en vert #4CAF50 → blanc au hover



Élément,Animation
Liens navigation,Soulignement vert qui grandit de gauche à droite
Boutons,Légère montée + ombre au hover
Cartes job,transform: translateY(-6px) + ombre renforcée
Sidebar items,Texte passe au vert au hover
Input focus,"Bordure verte subtile (non implémentée ici, mais possible)"


Breakpoint,Adaptation
≤ 768px,"Sidebar passe en haut, grille devient 1 colonne"
≤ 480px,"Barre de recherche devient verticale, boutons pleins largeur"


COULEURS DOMINANTES
├─ VERT #4CAF50 → Actions secondaires, accents, succès
├─ BLEU #3F8BDB → Actions principales, CTA
├─ GRIS CLAIR #F5F5F5 → Fond calme
└─ BLANC #FFFFFF → Conteneurs propres

STYLE GLOBAL
├─ Coins arrondis (12px)
├─ Ombres douces (material-inspired)
├─ Typo Inter (moderne)
├─ Espacement aéré
└─ Transitions fluides (0.3s)