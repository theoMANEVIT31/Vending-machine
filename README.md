# Distributeur Automatique

## Description

Système de distributeur automatique complet développé en JavaScript avec une approche orientée tests. Ce projet implémente toutes les fonctionnalités d'un distributeur automatique moderne avec gestion des stocks, des transactions, et de la monnaie.

## Fonctionnalités Implémentées

### Exigences de Base ✅

- ✅ Sélection de produit et affichage du prix
- ✅ Acceptation d'argent physique (centimes/euros)
- ✅ Validation du montant inséré
- ✅ Distribution du produit et rendu de monnaie exact
- ✅ Gestion des erreurs de rupture de stock

### Exigences Avancées ✅

- ✅ Classe d'inventaire réapprovisionnable
- ✅ Calculs de monnaie complexes (minimum de pièces)
- ✅ Gestion des erreurs de "monnaie insuffisante"
- ✅ Suivi du total d'argent dans la machine
- ✅ Fonctionnalité d'annulation et remboursement
- ✅ Dépendance externe pour les pièces disponibles
- ✅ Support de plusieurs devises
- ✅ Enregistrement de toutes les transactions

## Architecture

Le projet suit les principes de la programmation orientée objet avec une séparation claire des responsabilités :

```
src/
├── Product.js           # Classe représentant un produit
├── Inventory.js         # Gestion de l'inventaire
├── CoinManager.js       # Gestion des pièces et devises
├── TransactionLogger.js # Enregistrement des transactions
├── VendingMachine.js    # Classe principale du distributeur
├── ConsoleUI.js         # Interface utilisateur console
└── index.js            # Point d'entrée de l'application

tests/
├── Product.test.js
├── Inventory.test.js
├── CoinManager.test.js
├── TransactionLogger.test.js
└── VendingMachine.test.js
```

## Installation et Utilisation

### Prérequis

- Node.js (version 14 ou supérieure)
- npm

### Installation

```bash
npm install
```

### Exécution de l'application

```bash
npm start
```

### Tests

#### Exécuter tous les tests

```bash
npm test
```

#### Exécuter les tests en mode watch

```bash
npm run test:watch
```

#### Générer un rapport de couverture

```bash
npm run test:coverage
```

## Utilisation

L'application démarre avec une interface console interactive où vous pouvez :

1. **Voir les produits disponibles** - Affiche la liste des produits avec prix et stock
2. **Sélectionner un produit** - Choisir le produit à acheter
3. **Insérer de l'argent** - Ajouter des pièces/billets (dénominations valides)
4. **Acheter** - Finaliser la transaction
5. **Annuler** - Récupérer l'argent inséré
6. **Menu administrateur** - Réapprovisionner, ajouter de la monnaie, voir les statistiques

### Dénominations Acceptées

- Pièces : 1¢, 2¢, 5¢, 10¢, 20¢, 50¢, 1€, 2€
- Billets : 5€, 10€, 20€, 50€

## Exemples d'Utilisation

### Achat Simple

```javascript
const vm = new VendingMachine();
vm.initialize();

// Sélectionner un produit
vm.selectProduct("A1"); // Coca-Cola 1,50€

// Insérer de l'argent
vm.insertMoney(200); // 2,00€

// Acheter
const result = vm.purchase();
// Résultat : Produit distribué, 0,50€ de monnaie
```

### Gestion des Erreurs

```javascript
// Produit non disponible
vm.selectProduct("X1"); // Erreur : produit non trouvé

// Montant insuffisant
vm.selectProduct("A1");
vm.insertMoney(100); // Seulement 1€
vm.purchase(); // Erreur : montant insuffisant

// Impossible de rendre la monnaie
// (simulé avec une machine sans pièces)
```

## Tests

Le projet inclut une suite de tests complète avec plus de 100 tests couvrant :

- **Tests unitaires** pour chaque classe
- **Tests d'intégration** pour les scénarios complets
- **Tests de cas limites** et gestion d'erreurs
- **Couverture de code** > 95%

### Exécution des Tests pour la Démonstration

```bash
# Tests avec output détaillé
npm test -- --verbose

# Couverture avec rapport HTML
npm run test:coverage
# Ouvre coverage/index.html dans le navigateur
```

## Fonctionnalités Techniques

### Gestion des Devises

```javascript
const usd = new Currency("USD", "US Dollar", 1.1);
const vm = new VendingMachine(usd);
```

### Optimisation de la Monnaie

L'algorithme de rendu de monnaie utilise une approche gourmande pour minimiser le nombre de pièces rendues.

### Journalisation des Transactions

Toutes les opérations sont enregistrées avec horodatage :

- Ventes réussies/échouées
- Erreurs
- Annulations
- Réapprovisionnement

### Statistiques

- Chiffre d'affaires total
- Nombre de transactions
- Taux de réussite
- Historique complet

## Développement

### Structure du Code

- **Séparation des responsabilités** : Chaque classe a une responsabilité unique
- **Interface découplée** : La logique métier est indépendante de l'interface
- **Gestion d'erreurs robuste** : Tous les cas d'erreur sont gérés
- **Code testable** : Architecture facilitant les tests unitaires

### Extensibilité

Le code est conçu pour être facilement extensible :

- Ajout de nouveaux types de produits
- Support de nouvelles devises
- Intégration de systèmes de paiement électronique
- Interface web/mobile

## Auteur

Projet réalisé dans le cadre de l'évaluation des tests unitaires.

## Licence

MIT
