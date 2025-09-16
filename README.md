# ft\_transcendence 🎮

## Introduction

Bienvenue sur le projet **ft\_transcendence** \! Ce projet a pour objectif de créer un site web pour un tournoi de Pong multijoueur. Au-delà d'un simple jeu, l'objectif est de maîtriser de nouvelles technologies et de développer des compétences en ingénierie logicielle. Inspiré par le sujet officiel de la version 17.0, ce projet est une véritable "surprise".

Le site propose une interface utilisateur agréable et des fonctionnalités multijoueurs en temps réel. Vous pouvez jouer au Pong en ligne, participer à des tournois et affronter l'IA du jeu.

-----

## Démarrer le projet 🚀

### Prérequis

Assurez-vous d'avoir les outils suivants installés sur votre machine :

  * `git`
  * `docker`
  * `docker-compose`
  * `make`

### Installation et Lancement 🏁

Pour lancer le projet, suivez les étapes ci-dessous.

1.  **Cloner le dépôt**

    ```sh
    git clone [lien du repository]
    cd ft_transcendence
    ```

2.  **Créer le fichier `.env`**
    Ce fichier est essentiel pour des raisons de sécurité et ne doit pas être partagé publiquement. Il contient des variables d'environnement cruciales, notamment le secret JWT et les informations de double authentification pour les tests.

    Pour obtenir ce fichier, veuillez en faire la demande par e-mail à l'adresse suivante : **yann.riopro@gmail.com**. 📧

3.  **Lancer les conteneurs Docker**
    Vous pouvez utiliser la commande `make all` pour lancer le projet. Cela exécutera les étapes suivantes :

      * `npm install` et `npm install --prefix ./frontend` pour installer toutes les dépendances.
      * `npx tsc -p frontend` pour compiler le frontend.
      * `docker-compose down` pour arrêter et supprimer les conteneurs existants.
      * `docker-compose build --no-cache` pour reconstruire les images.
      * `docker-compose up -d` pour lancer les conteneurs en arrière-plan.

    <!-- end list -->

    ```sh
    make all
    ```

    Une fois le processus terminé, les services seront accessibles via les ports définis dans le `docker-compose.yml`.

### Commandes utiles ✨

Le `Makefile` contient plusieurs commandes pour faciliter le développement :

  * `make all` : Installe les dépendances, build les conteneurs, et lance l'ensemble du projet. C'est la commande principale pour démarrer.
  * `make fclean` : Supprime les conteneurs Docker, les images, et les fichiers temporaires générés par le projet (`.js` et `node_modules`).
  * `make fdata` : Exécute `fclean` puis supprime les bases de données d'authentification et de compte. **Attention :** Cette commande effacera toutes les données des utilisateurs.
  * `make re` : Exécute `fclean` puis `all`. C'est une commande pratique pour relancer le projet à partir de zéro après avoir effectué des modifications importantes.



------------


## Fonctionnalités et Modules 📦

Ce projet a été conçu avec une architecture en **microservices**, ce qui permet une meilleure gestion de la complexité, une scalabilité et une maintenance simplifiée. Chaque service Docker est indépendant, gérant une partie spécifique des fonctionnalités. Voici les modules que nous avons implémentés :

  * **Architecture Microservices (Module Majeur)** 🏗️ : Le backend est divisé en plusieurs services, chacun ayant une responsabilité unique. Cela se reflète dans notre fichier `docker-compose.yml`, où vous pouvez voir des services distincts pour le frontend, la gestion des comptes (`service-account`), et l'authentification (`service-authentification`).
  * **Gestion des utilisateurs (Module Majeur)** 👤 : Le site dispose d'un système d'inscription et de connexion sécurisé. Les utilisateurs peuvent créer un compte, choisir un pseudo, modifier leurs informations de profil, télécharger un avatar, et même ajouter d'autres joueurs en tant qu'amis pour voir leur statut en ligne.
  * **Backend avec Framework (Module Majeur)** ⚙️ : Le backend a été développé en utilisant **Fastify** avec Node.js, ce qui remplace l'exigence par défaut de PHP pur.
  * **Frontend avec Framework (Module Mineur)** 🎨 : Pour le frontend, nous avons utilisé **Tailwind CSS** en plus de Typescript pour concevoir une interface utilisateur réactive et moderne.
  * **Base de données (Module Mineur)** 💾 : Le projet utilise **SQLite** pour la gestion des données, garantissant ainsi la cohérence et la compatibilité entre les différents composants du projet.
  * **Multijoueur (Module Majeur)** 🧑‍🤝‍🧑 : Le jeu supporte des parties à plus de deux joueurs, ce qui va au-delà du jeu de Pong classique. La configuration de la partie est flexible et peut être adaptée au nombre de participants.
  * **Personnalisation du jeu (Module Mineur)** 🛠️ : Les joueurs ont la possibilité de personnaliser leur expérience de jeu avec des options comme des "power-ups" et des attaques.
  * **IA (Module Majeur)** 🤖 : Un adversaire IA a été introduit dans le jeu. L'IA a été conçue pour simuler un joueur humain et ne peut pas utiliser l'algorithme A\*, ce qui la rend plus imprévisible et stimulante.
  * **Tableau de bord (Module Mineur)** 📈 : Un tableau de bord affiche les statistiques de l'utilisateur, comme le nombre de victoires et de défaites, ainsi qu'un historique détaillé des matchs.
  * **Sécurité (Module Majeur)** 🔐 : L'authentification a été renforcée avec l'ajout de la **double authentification (2FA)** et des **JSON Web Tokens (JWT)** pour sécuriser les sessions et l'accès aux ressources. Les informations sensibles sont gérées dans un fichier `.env`, qui n'est pas versionné pour des raisons de sécurité.

<img width="1536" height="1024" alt="fond_transcendence" src="https://github.com/user-attachments/assets/37e4441b-a0f9-4259-b012-cbe84e36cbac" />

<img width="1024" height="1024" alt="pers0_transcendence" src="https://github.com/user-attachments/assets/42a96e6f-67b2-49c1-ac58-52cf5b75593e" />

N'hésitez pas à explorer le code et à nous contacter si vous avez des questions \! 😉
