# Grup

Grup est une application de réservation simple et sécurisée par lien unique.  
Elle permet à un organisateur de créer un événement, d’inviter des participants, et de suivre leurs réponses — avec une option de suppression automatique après consultation.

## Stack technique

- Backend : [NestJS](https://nestjs.com/) (Node.js, TypeScript)
- Base de données : [PostgreSQL](https://www.postgresql.org/)
- Frontend : [Vue.js 3](https://vuejs.org/) avec Vite
- **Conteneurisation** : Docker + Docker Compose pour faciliter le déploiement et la montée en charge  

## Fonctionnalités principales

- Création d’une réservation (titre, date, participants, etc.)
- Consultation d’une réservation via lien unique sécurisé (token)
- Réponse des invités (acceptation/refus)
- Suppression automatique de la réservation après consultation (mode éphémère)

## Installation et démarrage

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/sebastiencandau/Grup
   cd Grup

2. Lancer les services avec Docker Compose :
   ```bash
    docker-compose up --build
