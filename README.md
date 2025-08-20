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

# 🔒 Gestion des branches & Stratégie CI/CD

## 🌱 Stratégie Git

Le projet suit un workflow inspiré de **GitFlow simplifié** :

- **main** : branche de production (toujours stable, déployée en prod).
- **develop** : branche d’intégration (staging / préprod).
- **feature/*** : pour chaque nouvelle fonctionnalité (`feature/add-reservation-api`).
- **hotfix/*** : correctifs urgents en prod.
- **release/*** : optionnel, préparation des releases.

👉 Cycle de vie typique :
1. Créer une branche `feature/...` depuis `develop`.
2. Développer et pousser → ouvrir une PR vers `develop`.
3. Merge validé (tests & review passés) → le code arrive sur `develop`.
4. Quand `develop` est stable → merge vers `main` → déclenche un déploiement en production.

---

## 🔒 Règles de protection des branches

| Règle                                                                 | main (prod) | develop (staging) | Explication                                                                 |
|----------------------------------------------------------------------|-------------|-------------------|-----------------------------------------------------------------------------|
| **Require a pull request before merging**                             | ✅           | ✅                 | Interdit les pushs directs, tout passe par PR                               |
| **Require approvals**                                                 | ✅ (1 min)  | ⚠️ (0–1)          | `main` : au moins 1 review. `develop` : facultatif si tu bosses seul        |
| **Dismiss stale PR approvals when new commits are pushed**            | ✅           | optionnel          | Force une nouvelle validation si le code a changé                           |
| **Require review from Code Owners**                                   | optionnel   | optionnel          | À activer seulement si fichier CODEOWNERS défini                            |
| **Require approval of the most recent reviewable push**               | ✅           | optionnel          | Le dernier commit doit être validé (utile si plusieurs devs)                |
| **Require status checks to pass before merging**                      | ✅           | ✅                 | La CI (tests, lint, build) doit être verte                                  |
| **Require branches to be up to date before merging**                  | ✅           | ✅                 | Oblige un rebase/merge avec la dernière version avant merge                 |
| **Require conversation resolution before merging**                    | ✅           | ✅                 | Toutes les discussions doivent être résolues                                |
| **Require signed commits**                                            | ❌           | ❌                 | Pas nécessaire sauf contrainte légale                                       |
| **Require linear history**                                            | ✅           | ✅                 | Pas de merge commits → squash ou rebase uniquement                         |
| **Require deployments to succeed before merging**                     | ❌           | ❌                 | À activer si on relie GitHub à l’environnement de déploiement               |
| **Lock branch**                                                       | ❌           | ❌                 | Trop strict (interdit toute action)                                         |
| **Do not allow bypassing the above settings**                         | ✅           | ❌ (optionnel)     | `main` : même les admins doivent respecter les règles                       |
| **Allow force pushes**                                                | ❌           | ❌                 | Jamais autorisé (dangereux)                                                 |
| **Allow deletions**                                                   | ❌           | ❌                 | On ne supprime pas `main` ni `develop`                                      |

---

## ⚙️ Stratégie CI/CD

Le pipeline CI/CD est configuré via **GitHub Actions** (ou équivalent GitLab CI), et s’applique sur le monorepo (`backend/` NestJS + `frontend/` VueJS).

### CI (Intégration Continue)
- Déclenchée sur **chaque PR** et sur les pushs vers `develop` et `main`.
- Vérifications effectuées :
  - `backend/` : installation, lint, tests unitaires.
  - `frontend/` : installation, lint, build.
- Objectif : garantir que rien ne casse avant d’être mergé.

### CD (Déploiement Continu)
- Déclenché uniquement sur `main` (prod).
- Étapes :
  - Build backend & frontend.
  - Déploiement sur l’environnement de prod (Docker / VPS / Kubernetes / Vercel / autre).
- Possibilité d’ajouter un déploiement intermédiaire automatique sur `develop` (staging).

---

## ✅ Résumé

- **main** = stable, protégée, déployée en prod automatiquement.  
- **develop** = staging, protégée mais plus souple.  
- **feature/*** = dev quotidien, merge via PR vers `develop`.  
- CI empêche de merger si les tests échouent.  
- CD assure que `main` est toujours déployée à jour.  

---

