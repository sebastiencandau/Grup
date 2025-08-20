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
2. Remplir les variables d'environnements à la racine du backend et du frontend en prenant en exemple les .env.example.

3. Lancer les services avec Docker Compose :
   ```bash
    docker-compose up --build
<<<<<<< HEAD
---

## Documentation CI/CD

Toutes les informations concernant l'intégration continue, les tests automatisés et le déploiement sont détaillées dans [CICD_DOCUMENTATION.md](./CICD_DOCUMENTATION.md).

---

## Sécurité et accessibilité

Le projet suit les bonnes pratiques pour sécuriser le code et garantir l’accessibilité aux personnes en situation de handicap.  
Pour plus de détails, consulter le document [SECURITE_ACCESSIBILITE.md](./SECURITE_ACCESSIBILITE.md).

---

## Cahier de recettes

Le cahier de recettes reprend l’ensemble des fonctionnalités attendues, les scénarios de tests et les résultats attendus afin de détecter les anomalies de fonctionnement et les régressions éventuelles.  
Consulter le document [CAHIER_DE_RECETTES.md](./CAHIER_DE_RECETTES.md).
