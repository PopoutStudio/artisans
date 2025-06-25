# PRD: Système de Leads - Limitation des Contacts Gratuits

## Introduction/Overview

Le système de leads vise à implémenter un modèle freemium en limitant le nombre de contacts qu'un artisan peut recevoir gratuitement. Actuellement, les artisans peuvent recevoir un nombre illimité de messages de clients. Ce système introduit une limitation de 2 contacts récents par mois pour les artisans gratuits, avec une bannière d'information quand la limite est atteinte.

## Goals

1. **Limiter l'accès gratuit** : Restreindre les artisans gratuits à 2 contacts récents par mois
2. **Informer l'artisan** : Afficher clairement le nombre de contacts reçus et en attente
3. **Préparer la monétisation** : Créer la base pour le futur système d'abonnement
4. **Maintenir l'expérience utilisateur** : Permettre aux artisans de voir qu'ils ont des messages en attente

## User Stories

1. **En tant qu'artisan gratuit**, je veux voir combien de contacts j'ai reçus ce mois-ci pour comprendre mon utilisation
2. **En tant qu'artisan gratuit**, je veux être informé quand j'ai des messages en attente au-delà de ma limite gratuite
3. **En tant qu'artisan**, je veux voir une bannière m'informant du nombre de messages en attente quand ma limite est atteinte
4. **En tant qu'artisan payant** (futur), je veux accéder à tous mes contacts sans limitation

## Functional Requirements

1. **Modèle de données Lead** : Le système doit créer un modèle `Lead` liant un artisan, un client, une date et un statut
2. **Compteur de contacts** : Le système doit compter les contacts reçus par artisan par mois
3. **Limitation d'affichage** : Les artisans gratuits ne doivent voir que leurs 2 contacts les plus récents
4. **Bannière d'information** : Afficher une bannière quand un artisan a des messages en attente au-delà de sa limite
5. **Dashboard artisan** : Créer une page dashboard affichant le nombre de contacts reçus et en attente
6. **API de comptage** : Fournir des endpoints pour récupérer les statistiques de leads
7. **Intégration avec messages** : Le système doit s'intégrer avec le système de messages existant

## Non-Goals (Out of Scope)

- Gestion avancée des leads (marquage comme contacté, converti, etc.)
- Historique détaillé des leads
- Notifications push/email
- Système de notation ou évaluation
- Rapports et statistiques avancées
- Gestion des abonnements (sera dans MVP 6)

## Design Considerations

- **Bannière d'information** : Design simple et visible, placée en haut de la page messages
- **Dashboard** : Interface claire avec compteurs visuels
- **Cohérence** : Utiliser les mêmes composants UI que le reste de l'application
- **Responsive** : S'assurer que l'interface fonctionne sur mobile et desktop

## Technical Considerations

- **Intégration Prisma** : Étendre le schéma existant avec le modèle `Lead`
- **Performance** : Optimiser les requêtes de comptage pour éviter les N+1
- **Sécurité** : S'assurer que les artisans ne peuvent voir que leurs propres leads
- **Compatibilité** : Maintenir la compatibilité avec le système de messages existant
- **Préparation MVP 6** : Structurer le code pour faciliter l'intégration future des abonnements

## Success Metrics

- **Adoption** : 100% des artisans utilisent le dashboard de leads
- **Compréhension** : Les artisans comprennent clairement leurs limitations
- **Performance** : Pas d'impact sur les performances de l'application
- **Préparation monétisation** : Base technique solide pour MVP 6

## Open Questions

1. **Période de limitation** : La limite de 2 contacts s'applique-t-elle par mois calendaire ou par période glissante de 30 jours ?
2. **Rétention des données** : Combien de temps conserver les données de leads pour les artisans gratuits ?
3. **Migration des données** : Comment gérer les messages existants lors du déploiement ?
4. **Tests** : Quels sont les critères de test pour valider le bon fonctionnement des limites ?

## Structure Technique Proposée

### Modèle Lead
```prisma
model Lead {
  id        String   @id @default(cuid())
  artisanId String
  clientId  String
  messageId String   @unique
  status    LeadStatus @default(PENDING)
  createdAt DateTime @default(now())
  
  artisan   Artisan  @relation(fields: [artisanId], references: [id], onDelete: Cascade)
  client    User     @relation(fields: [clientId], references: [id], onDelete: Cascade)
  message   Message  @relation(fields: [messageId], references: [id], onDelete: Cascade)
}

enum LeadStatus {
  PENDING
  CONTACTED
  CONVERTED
  LOST
}
```

### Pages à créer
- `/dashboard` - Dashboard artisan avec compteurs
- `/api/leads/stats` - API pour récupérer les statistiques
- `/api/leads/count` - API pour compter les leads en attente

### Composants à créer
- `LeadCounter` - Affichage du nombre de leads reçus/en attente
- `LeadBanner` - Bannière d'information pour les messages en attente
- `DashboardStats` - Composant principal du dashboard 