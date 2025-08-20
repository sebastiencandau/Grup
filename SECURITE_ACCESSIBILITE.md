# Sécurité et Accessibilité

Ce document décrit les mesures mises en place dans le projet **Grup** pour garantir la **sécurisation du code**, la **protection des données** et l’**accessibilité de l’application**.

---

## 1. Sécurité

Le projet suit les bonnes pratiques pour couvrir les **10 principales failles de sécurité** identifiées par l’[OWASP Top 10](https://owasp.org/Top10/):

| Catégorie | Mesures mises en œuvre |
|-----------|----------------------|
| Injection | Utilisation de requêtes préparées avec TypeORM et validation côté serveur. |
| Authentification cassée | Pas encore implémentée, mais prévue avec JWT et gestion sécurisée des tokens. |
| Exposition de données sensibles | Variables d’environnement `.env` utilisées, jamais stockées dans le code. |
| Entités externes XML | Non applicable (pas d’usage XML). |
| Contrôle d’accès manquant | Structure des rôles et permissions prévue pour limiter l’accès aux endpoints sensibles. |
| Configuration incorrecte | Docker et environnement isolé pour backend, frontend et base de données. |
| XSS | Échappement des données côté frontend et utilisation de frameworks sûrs (Vue.js). |
| Insecure Deserialization | Non applicable pour le moment. |
| Utilisation de composants vulnérables | Dépendances vérifiées via `npm audit` et mises à jour régulières. |
| Insufficient Logging & Monitoring | Logging des erreurs côté backend et alertes prévues pour déploiement futur. |

> Tous les mots de passe et clés sont gérés via `.env` et jamais commités dans le repo.

---

## 2. Accessibilité

L’application vise à respecter les bonnes pratiques du référentiel **[RGAA 4.1](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/)** pour rendre le service utilisable par les personnes en situation de handicap.

| Critère | Mesures mises en œuvre |
|---------|----------------------|
| Navigation clavier | Tous les boutons et champs de formulaire sont accessibles au clavier. |
| Contraste | Couleurs du frontend respectant un ratio minimum de 4.5:1. |
| Images et médias | Tous les médias importants possèdent un attribut `alt` ou une description. |
| Formulaires | Les champs sont correctement étiquetés (`label`) et associés aux inputs. |
| Feedback utilisateur | Messages d’erreur et succès clairement visibles et compréhensibles. |
| Tests | Vérifications régulières avec des outils comme **Lighthouse** ou **axe DevTools**. |

---

## 3. Bonnes pratiques de développement

- **Contrôle de versions** : Branches `main` et `develop` protégées, merges via pull requests avec review obligatoire.  
- **CI/CD** : Build et tests automatiques à chaque push sur `develop` et déploiement automatique sur `main`.  
- **Chiffrement des secrets** : Toute information sensible est chiffrée côté serveur.  
- **Évolutivité** : Code structuré en modules, facile à étendre et maintenir.  

---

> Ce document sera mis à jour régulièrement au fur et à mesure que de nouvelles mesures de sécurité et d’accessibilité seront intégrées.
