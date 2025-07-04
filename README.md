# 🏪 Distributeur Automatique

Un système de distributeur automatique moderne implémenté en JavaScript avec une interface web interactive et une architecture modulaire robuste.

## 📋 Table des matières

- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Tests](#tests)
- [API](#api)
- [Développement](#développement)

## 📖 Description

Ce projet implémente un système complet de distributeur automatique qui gère la sélection de produits, l'acceptation de monnaie physique, la gestion des stocks, le calcul de rendu de monnaie optimisé, et le logging des transactions. Le système supporte également les devises multiples et dispose d'une interface web moderne.

## ✨ Fonctionnalités

### Fonctionnalités de base ✅

- **Sélection de produits** : Interface intuitive pour choisir parmi les produits disponibles
- **Affichage des prix** : Prix clairement affichés pour chaque produit
- **Acceptation de monnaie** : Support des pièces de monnaie physiques (centimes/centimes d'euro)
- **Validation des paiements** : Vérification automatique des montants insuffisants
- **Distribution et rendu de monnaie** : Calcul précis du rendu pour les achats exacts
- **Gestion des stocks** : Détection et signalement des produits en rupture de stock
- **Système d'inventaire** : Module `Inventory` avec capacité de réapprovisionnement
- **Calcul optimal de rendu** : Algorithme pour minimiser le nombre de pièces rendues
- **Gestion des erreurs de monnaie** : Détection quand la machine ne peut pas rendre la monnaie exacte
- **Suivi de l'argent total** : Comptabilisation de tout l'argent dans la machine
- **Annulation de transaction** : Fonction pour récupérer toute la monnaie insérée

### Fonctionnalités avancées 🚀 (+4 points)

- **Fournisseur externe de pièces** : Dépendance externe (`ExternalCoinProvider`) pour la gestion des pièces de rendu
- **Support multi-devises** : Système de devises avec taux de change (EUR, USD, GBP)
- **Logging des transactions** : Enregistrement complet de toutes les transactions (ventes, erreurs, réapprovisionnements)

## 🏗️ Architecture

### Structure du projet

```
src/
├── VendingMachine.js      # Classe principale du distributeur
├── Product.js             # Modèle des produits
├── Inventory.js           # Gestion des stocks
├── CoinManager.js         # Gestion des pièces et devises
├── ExternalCoinProvider.js # Fournisseur externe de pièces
├── TransactionLogger.js   # Logging des transactions
└── index.js              # Point d'entrée

public/                   # Interface web
├── index.html           # Interface utilisateur
├── styles.css          # Styles CSS
├── app.js             # Logique frontend
└── modules/           # Modules frontend

tests/                 # Tests unitaires
├── *.test.js         # Tests pour chaque module

coverage/             # Rapports de couverture
```

### Classes principales

#### `VendingMachine`
- Classe principale orchestrant toutes les opérations
- Gère l'état des transactions et la logique métier
- Intègre tous les autres modules

#### `Product`
- Modèle représentant un produit
- Propriétés : ID, nom, prix, quantité
- Méthodes : vérification disponibilité, distribution, réapprovisionnement

#### `Inventory`
- Gestion centralisée des stocks
- Opérations CRUD sur les produits
- Filtrage des produits disponibles

#### `CoinManager`
- Gestion des pièces et calculs de rendu
- Support multi-devises avec conversion
- Algorithme optimisé pour le rendu de monnaie

#### `TransactionLogger`
- Enregistrement de toutes les transactions
- Filtrage par type, période
- Statistiques de ventes

#### `ExternalCoinProvider`
- Simulation d'un fournisseur externe de pièces
- Banque de pièces virtuelle
- API pour demander des pièces

## 🚀 Installation

### Prérequis
- Node.js (version 14+ recommandée)
- npm ou yarn

### Instructions

1. **Cloner le projet**
```bash
git clone <repository-url>
cd distributeur-automatique
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer l'application**
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 💻 Utilisation

### Interface Web

1. **Sélection de devise** : Choisissez votre devise dans le sélecteur en haut à droite
2. **Sélection de produit** : Cliquez sur un produit disponible
3. **Insertion de monnaie** : Utilisez les boutons de pièces pour insérer de l'argent
4. **Achat** : Une fois le montant suffisant inséré, le produit sera automatiquement distribué
5. **Récupération de monnaie** : Utilisez le bouton "Récupérer la monnaie" pour annuler

### Interface en ligne de commande

```javascript
const VendingMachine = require('./src/VendingMachine');

const machine = new VendingMachine();
machine.initialize();

// Sélectionner un produit
machine.selectProduct('A1');

// Insérer de la monnaie
machine.insertMoney(200);

// Effectuer l'achat
const result = machine.purchase();
```

## 🧪 Tests

### Commandes de test disponibles

```bash
# Tous les tests
npm test

# Tests avec surveillance des changements
npm run test:watch

# Tests avec couverture
npm run test:coverage

# Tests essentiels uniquement
npm run test:essential

# Tests minimaux
npm run test:minimal
```

### Couverture de code

Le projet maintient une couverture de code élevée avec des tests unitaires pour chaque module :

- **VendingMachine** : Tests complets des scénarios d'achat
- **CoinManager** : Tests du calcul de rendu et gestion des devises
- **Inventory** : Tests de gestion des stocks
- **Product** : Tests des opérations sur les produits
- **TransactionLogger** : Tests de logging
- **ExternalCoinProvider** : Tests du fournisseur externe

## 📚 API

### VendingMachine

```javascript
// Initialiser la machine
machine.initialize()

// Sélectionner un produit
machine.selectProduct(productId)

// Insérer de la monnaie
machine.insertMoney(amount)

// Effectuer l'achat
machine.purchase()

// Récupérer la monnaie
machine.returnMoney()

// Changer de devise
machine.changeCurrency(currency)
```

### Inventory

```javascript
// Ajouter un produit
inventory.addProduct(product)

// Réapprovisionner
inventory.restockProduct(productId, quantity)

// Vérifier disponibilité
inventory.isProductAvailable(productId)
```

### CoinManager

```javascript
// Calculer le rendu
coinManager.calculateChange(amount)

// Vérifier si rendu possible
coinManager.canMakeChange(amount)

// Obtenir le total d'argent
coinManager.getTotalMoney()
```

## 🛠️ Développement

### Structure de développement

- **ES6+** : Utilisation des fonctionnalités modernes de JavaScript
- **Modules CommonJS** : Pour la compatibilité Node.js
- **Architecture modulaire** : Séparation claire des responsabilités
- **Tests unitaires** : Coverage avec Jest
- **Interface web** : HTML5, CSS3, JavaScript vanilla

### Scripts de développement

```bash
# Développement avec rechargement automatique
npm run dev

# Tests en mode surveillance
npm run test:watch

# Nettoyage et tests
npm run test:clean
```

### Contribuer

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteur

**Étudiant** - Projet universitaire de tests unitaires

---

> 💡 **Note** : Ce projet a été développé dans le cadre d'un exercice pédagogique sur les tests unitaires et l'architecture logicielle. Il démontre les bonnes pratiques en matière de développement JavaScript, tests automatisés, et conception modulaire.