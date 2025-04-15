<div align="center" style="display: flex">
    <img height="120px" src="./images/Slyhear_logo_long.png" alt="Slyhear Logo" />
</div>

<br>

<h3 align="center">Slyhear</h3>
<p align="center">Une application de streaming audio.</p>

<div align="center" style="display: inline-block">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
    <img src="https://img.shields.io/badge/Node.JS-43853D?style=for-the-badge&logo=node.js&logoColor=white"/>
    <img src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54"/>
    <img src="https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white"/>
</div>

## Fonctionnalités

- [x] Téléchargement de musique
- [x] Bibliothèque d'audios
- [x] Suppression des audios
- [x] Lecteur
- [ ] Mise à jour des audios
- [ ] Création de playlists
- [ ] Multiple utilisateurs
- [ ] ...

## Installation

Uniquement via Docker pour le moment car toujours en cours de développement.

1. Téléchargez l'image Docker

```sh
docker pull fabiodevcode/slyhear:dev
```

2. Démarrez un container

```sh
docker run -p 3324:3324 --name slyhear-dev fabiodevcode/slyhear:dev
```

3. Ecoutez

> `http://localhost:3324`

##

<img src="https://badgen.net/badge/Fait avec fun par/moi/C7191B" />

<br>
