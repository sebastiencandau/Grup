# Cahier de recette - MVP Grup
Ce cahier de recettes décrit l’ensemble des tests fonctionnels, structurels et de sécurité pour le projet **Grup**.  
Il sert à vérifier le bon fonctionnement des fonctionnalités, détecter les anomalies et prévenir les régressions.

## 1. Établissements

### 1.1 Création d’un établissement
- **Endpoint backend** : `POST /establishments`
- **Champs requis** : 
  - `name` (string)
  - `address` (string)
- **Champs optionnels** :
  - `description` (string)
  - `phone` (string)
- **Flux front** :
  - Formulaire avec champs `name`, `address`, `description`, `phone`
  - Validation front : nom ≥ 3 caractères, adresse non vide
  - Appel API `POST /establishments`
  - Message succès : `Établissement créé avec succès`
  - Mise à jour liste établissements

**Tests à valider :**
- Création avec tous les champs
- Création avec champs optionnels vides
- Validation front : nom vide ou adresse vide
- Vérification que l’établissement apparaît dans la liste

---

### 1.2 Consultation d’établissements
- **Endpoint backend** : `GET /establishments` et `GET /establishments/{id}`
- **Flux front** :
  - Affichage liste établissements
  - Accès détails sur clic
  - Message erreur si établissement introuvable

**Tests à valider :**
- Liste complète
- Accès détail établissement
- Gestion erreur 404

---

## 2. Disponibilités

### 2.1 Création d’une disponibilité
- **Endpoint backend** : `POST /availabilities`
- **Champs requis** : 
  - `establishmentId` (UUID)
  - `date` (YYYY-MM-DD)
  - `startTime` (HH:mm)
  - `endTime` (HH:mm)
  - `maxParticipants` (int)
- **Champs optionnels** : 
  - `details` (string)
- **Flux front** :
  - Formulaire avec sélection établissement, date, horaire, max participants, détails
  - Validation front : date valide, horaires valides, maxParticipants > 0
  - Appel API `POST /availabilities`
  - Message succès

**Tests à valider :**
- Création avec tous champs
- Création sans détails
- Validation front : date passée, horaire invalide, maxParticipants ≤ 0
- Vérification que la disponibilité apparaît dans la liste

---

### 2.2 Consultation des disponibilités
- **Endpoint backend** : `GET /availabilities/establishment/{establishmentId}`
- **Flux front** :
  - Liste des disponibilités par établissement
  - Affichage date, horaire, max participants, détails

**Tests à valider :**
- Lecture complète des disponibilités
- Tri et filtrage corrects
- Affichage clair sur le front

---

## 3. Réservations

### 3.1 Création d’une réservation
- **Endpoint backend** : `POST /reservations`
- **Champs requis** : 
  - `title` (string)
  - `organizerEmail` (string)
  - `availabilityId` (UUID)
- **Champs optionnels** : 
  - `description` (string)
  - `participantsCount` (int)
  - `participants` (array)
- **Flux front** :
  - Formulaire de création avec choix de disponibilité
  - Validation front : email correct, nombre de participants ≤ maxParticipants
  - Appel API `POST /reservations`
  - Message succès et génération du lien sécurisé pour l’organisateur

**Tests à valider :**
- Création complète
- Validation email et participants
- Vérification retour API et lien token
- Affichage de la réservation dans la liste front

---

### 3.2 Consultation des réservations
- **Endpoint backend** : 
  - `GET /reservations/establishment/{id}` (liste réservations par établissement)
  - `GET /reservations/token/{token}` (accès via lien sécurisé)
- **Flux front** :
  - Affichage liste réservations par établissement
  - Accès détail réservation via token
  - Lecture uniquement (pas de modification ou suppression côté front)

**Tests à valider :**
- Consultation complète par établissement
- Accès réservation via token
- Affichage correct des informations (titre, créneau, participants)

---

## 4. Validations front et back

### 4.1 Validation front
- Tous les champs requis sont validés avant soumission
- Messages d’erreur clairs et précis
- Limitations respectées (ex : maxParticipants)
- Navigation fluide et interface responsive

### 4.2 Validation back
- API retourne statuts HTTP corrects (201, 200, 404)
- Validation des UUID pour disponibilités et réservations
- Contrôle du maxParticipants côté serveur
- Gestion des tokens pour accès sécurisé
- Suppression ou modification côté serveur possible mais pas exposée au front

---

## 5. Tests intégrés (MVP complet)
1. Création d’un établissement → création disponibilité → création réservation
2. Consultation établissement → disponibilité → réservation
3. Accès réservation via token
4. Vérification UI / UX complète : messages, formulaire, navigation
5. Validation des contraintes (emails, participants, dates, horaires)
