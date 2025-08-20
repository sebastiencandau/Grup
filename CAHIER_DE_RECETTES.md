# Cahier de Recettes - Projet Grup

## Table des matières
1. [Introduction](#introduction)
2. [Fonctionnalités & Scénarios de tests](#fonctionnalités--scénarios-de-tests)
   - [Backend](#backend)
   - [Frontend](#frontend)
3. [Tests structurels](#tests-structurels)
4. [Tests de sécurité](#tests-de-sécurité)

---

## Introduction
Ce cahier de recettes décrit l’ensemble des tests fonctionnels, structurels et de sécurité pour le projet **Grup**.  
Il sert à vérifier le bon fonctionnement des fonctionnalités, détecter les anomalies et prévenir les régressions.

---

## Fonctionnalités & Scénarios de tests

### Backend

| Fonctionnalité | Scénario de test | Préconditions | Étapes | Résultat attendu | Statut | Observations |
|----------------|----------------|---------------|--------|-----------------|--------|--------------|
| Création d'une réservation | Créer une réservation avec succès | Base vide ou utilisateur connecté | 1. Appeler l'API POST /reservations avec les données valides 2. Vérifier la réponse | 201 Created, réservation enregistrée, mail envoyé | | |
| Création d'une réservation | Tentative avec email invalide | Base vide | POST /reservations avec email invalide | 400 Bad Request, message d'erreur "Email invalide" | | |
| Consultation d'une réservation | Lire une réservation existante via lien unique | Réservation existante | GET /reservations/:uuid | 200 OK, données exactes de la réservation | | |
| Consultation d'une réservation | Lire une réservation inexistante | Aucun lien valide | GET /reservations/:uuid | 404 Not Found | | |
| Modification d'une réservation | Modifier le titre et le nombre de participants | Réservation existante | PUT /reservations/:uuid avec nouvelles données | 200 OK, réservation mise à jour dans la BDD | | |
| Ajout d'un commentaire | Ajouter un commentaire à une réservation | Réservation existante | POST /reservations/:uuid/comments | 201 Created, commentaire ajouté à la réservation | | |
| Notification via webhook | Envoyer une notification après lecture | Webhook configuré | Trigger webhook après consultation | 200 OK, notification reçue par le serveur cible | | |
| Suppression automatique après lecture | Lire un secret éphémère | Secret éphémère existant | GET /secrets/:token | Secret retourné, puis supprimé | | |

### Frontend

| Fonctionnalité | Scénario de test | Préconditions | Étapes | Résultat attendu | Statut | Observations |
|----------------|----------------|---------------|--------|-----------------|--------|--------------|
| Formulaire de réservation | Remplir et soumettre le formulaire | Page frontend ouverte | 1. Saisir les champs 2. Cliquer sur "Créer" | Message de succès, redirection ou confirmation affichée | | |
| Affichage d'une réservation | Voir les détails | Réservation existante | Naviguer vers la page de réservation | Tous les champs affichés correctement | | |
| Ajout de commentaire | Envoyer un commentaire | Réservation existante | Saisir commentaire et cliquer sur "Envoyer" | Commentaire ajouté dans la liste | | |

---

## Tests structurels

| Vérification | Méthode | Résultat attendu | Statut | Observations |
|--------------|--------|-----------------|--------|--------------|
| Arborescence du projet | Vérifier dossiers backend et frontend | backend/, frontend/ présents | | |
| Modules installés | npm install / npm ci | Pas d'erreur, node_modules cohérents | | |
| Scripts npm | npm run test, npm run build | Tests passent, build fonctionne | | |

---

## Tests de sécurité

| Vérification | Méthode | Résultat attendu | Statut | Observations |
|--------------|--------|-----------------|--------|--------------|
| Secrets | Vérifier .env et tokens | Aucun secret exposé dans le repo | | |
| Accès aux réservations | Tester accès via lien non valide | 404 ou 403, accès refusé | | |
| Validation des données | Envoyer données invalides | API renvoie erreur (400/422) | | |
| Injection | Tester injection SQL ou XSS | Rejet ou échappement des caractères | | |

---

## Instructions d'utilisation
- Compléter la colonne **Statut** après chaque test (Pass/Fail).  
- Ajouter des **Observations** pour toute anomalie ou remarque.  
- Mettre à jour le cahier à chaque nouvelle fonctionnalité ou correction de bug.
