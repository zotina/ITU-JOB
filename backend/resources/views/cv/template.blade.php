<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; }
        .section { margin-bottom: 20px; }
        h1, h2, h3 { color: #333; }
        .competences, .langues, .soft-skills { list-style-type: none; padding: 0; }
        .competences li, .langues li, .soft-skills li { display: inline-block; margin-right: 10px; background-color: #f0f0f0; padding: 5px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>{{ $profil->utilisateur->nom }} {{ $profil->utilisateur->prenom }}</h1>
    <p>{{ $profil->titre }}</p>
    <p>{{ $profil->bio }}</p>

    <div class="section">
        <h2>Formations</h2>
        @foreach($profil->formations as $formation)
            <div>
                <h3>{{ $formation->diplome }} - {{ $formation->etablissement }}</h3>
                <p>{{ $formation->date_debut }} - {{ $formation->date_fin ?? 'En cours' }}</p>
                <p>{{ $formation->description }}</p>
            </div>
        @endforeach
    </div>

    <div class="section">
        <h2>Expériences Professionnelles</h2>
        @foreach($profil->experiences as $experience)
            <div>
                <h3>{{ $experience->titre_poste }} - {{ $experience->nom_entreprise }}</h3>
                <p>{{ $experience->date_debut }} - {{ $experience->date_fin ?? 'En cours' }}</p>
                <p>{{ $experience->description }}</p>
            </div>
        @endforeach
    </div>

    <div class="section">
        <h2>Compétences</h2>
        <ul class="competences">
            @foreach($profil->competences as $competence)
                <li>{{ $competence->nom_competence }} ({{ $competence->niveau }})</li>
            @endforeach
        </ul>
    </div>

    <div class="section">
        <h2>Projets</h2>
        @foreach($profil->projets as $projet)
            <div>
                <h3>{{ $projet->nom_projet }}</h3>
                <p>{{ $projet->description }}</p>
                <p>Technologies: {{ implode(', ', $projet->technologies) }}</p>
            </div>
        @endforeach
    </div>

    <div class="section">
        <h2>Langues</h2>
        <ul class="langues">
            @foreach($profil->langues as $langue)
                <li>{{ $langue->nom_langue }} ({{ $langue->niveau }})</li>
            @endforeach
        </ul>
    </div>

    <div class="section">
        <h2>Soft Skills</h2>
        <ul class="soft-skills">
            @foreach($profil->softSkills as $softSkill)
                <li>{{ $softSkill->nom_soft_skill }}</li>
            @endforeach
        </ul>
    </div>

</body>
</html>
