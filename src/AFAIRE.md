# A FAIRE

---

## Client (Frontend)

- Foncton de controle pour l'import du JSON.
- Sur la page paramètre trouver un solution pour simple pour le call d'update du paramètre

## Database

- Créer un table _list_ afin de sauvegarder la list en BDD et plus dans localstorage
- Créer une table _settings_

## Server (Backend)

- Routes créer et supprimer une nouvelle entrée dans la table _liste_
- Routes pour update les _settings_

## Autre & idée

- Tag les fichiers mp3 avec la jaquette (pour les lecteurs)
- Pages téléchargement choisir de télécharger en one-shot (fichier par fichier ou via une liste en local storage cette fois) sans utiliser l'application pour la suite téléchargement classique (faire de vue) avec un bouton pour switch entre les 2.
- Permettre d'update un morceaux (titre, dl un nouvelle image a partir d'un autre lien YT ou déposer une image ou un url d'une image)

## Idée de paramètres

- Vider la liste après un téléchargement : Boolean
- Sélectionner les différents menu disponible : Liste de choix à cocher

## Commande Docker :

docker build -t slyhear .
docker run -p 3324:3324 slyhear
