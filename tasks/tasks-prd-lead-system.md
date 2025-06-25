# Tasks: Système de Leads - Limitation des Contacts Gratuits

## Relevant Files

- `prisma/schema.prisma` - Extension du schéma avec le modèle Lead et enum LeadStatus
- `src/app/api/leads/stats/route.ts` - API endpoint pour récupérer les statistiques de leads
- `src/app/api/leads/count/route.ts` - API endpoint pour compter les leads en attente
- `src/app/dashboard/page.tsx` - Page dashboard artisan avec compteurs
- `src/components/dashboard/DashboardStats.tsx` - Composant principal du dashboard
- `src/components/dashboard/LeadCounter.tsx` - Affichage du nombre de leads reçus/en attente
- `src/components/messages/LeadBanner.tsx` - Bannière d'information pour les messages en attente
- `src/lib/leads.ts` - Utilitaires et logique métier pour la gestion des leads
- `src/lib/leads.test.ts` - Tests unitaires pour les utilitaires leads
- `src/app/messages/page.tsx` - Modification pour intégrer la bannière LeadBanner
- `src/components/messages/MessagesList.tsx` - Modification pour limiter l'affichage selon le statut d'abonnement

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Extension du modèle de données
  - [ ] 1.1 Ajouter l'enum LeadStatus (PENDING, CONTACTED, CONVERTED, LOST) au schéma Prisma
  - [ ] 1.2 Créer le modèle Lead avec les relations vers Artisan, User (client) et Message
  - [ ] 1.3 Ajouter les relations dans les modèles existants (Artisan, User, Message)
  - [ ] 1.4 Générer et appliquer la migration Prisma
  - [ ] 1.5 Mettre à jour le client Prisma

- [ ] 2.0 Logique métier et utilitaires
  - [ ] 2.1 Créer la fonction `getLeadsStats(artisanId: string)` pour calculer les statistiques mensuelles
  - [ ] 2.2 Créer la fonction `getPendingLeadsCount(artisanId: string)` pour compter les leads en attente
  - [ ] 2.3 Créer la fonction `isArtisanLimitReached(artisanId: string)` pour vérifier si la limite de 2 leads/mois est atteinte
  - [ ] 2.4 Créer la fonction `createLeadFromMessage(messageId: string)` pour créer un lead à partir d'un message
  - [ ] 2.5 Ajouter les tests unitaires pour toutes les fonctions utilitaires

- [ ] 3.0 API endpoints pour les statistiques
  - [ ] 3.1 Créer l'endpoint GET `/api/leads/stats` pour récupérer les statistiques complètes
  - [ ] 3.2 Créer l'endpoint GET `/api/leads/count` pour récupérer le nombre de leads en attente
  - [ ] 3.3 Ajouter la validation d'authentification et d'autorisation (seuls les artisans)
  - [ ] 3.4 Ajouter la gestion d'erreurs et les réponses appropriées
  - [ ] 3.5 Créer les tests d'intégration pour les endpoints API

- [ ] 4.0 Interface utilisateur - Dashboard
  - [ ] 4.1 Créer la page `/dashboard` avec layout responsive
  - [ ] 4.2 Créer le composant `DashboardStats` avec affichage des compteurs
  - [ ] 4.3 Créer le composant `LeadCounter` pour afficher les statistiques détaillées
  - [ ] 4.4 Ajouter la navigation vers le dashboard dans la navbar pour les artisans
  - [ ] 4.5 Implémenter le chargement des données via les API endpoints
  - [ ] 4.6 Ajouter les états de chargement et d'erreur

- [ ] 5.0 Intégration avec le système de messages existant
  - [ ] 5.1 Créer le composant `LeadBanner` pour afficher les messages en attente
  - [ ] 5.2 Modifier la page `/messages` pour intégrer la bannière LeadBanner
  - [ ] 5.3 Modifier `MessagesList` pour limiter l'affichage à 2 messages pour les artisans gratuits
  - [ ] 5.4 Ajouter la logique pour créer automatiquement un lead lors de l'envoi d'un message
  - [ ] 5.5 Tester l'intégration complète du système de limitation 