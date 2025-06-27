# Distributeur Automatique

## Description

Système de distributeur automatique développé en JavaScript avec une **suite complète de tests unitaires** atteignant une couverture de code exceptionnelle. Ce projet implémente les fonctionnalités essentielles d'un distributeur automatique avec interface web moderne.

## Fonctionnalités Principales

### Fonctionnalités de Base ✅

- ✅ Sélection de produit et affichage du prix
- ✅ Acceptation d'argent physique (centimes/euros)
- ✅ Validation du montant inséré
- ✅ Distribution du produit et rendu de monnaie exact
- ✅ Gestion des erreurs de rupture de stock
- ✅ Annulation et remboursement

### Fonctionnalités Avancées ✅

- ✅ Gestion intelligente de l'inventaire
- ✅ Calculs de monnaie optimisés (minimum de pièces)
- ✅ Gestion des erreurs de "monnaie insuffisante"
- ✅ Support de différentes devises
- ✅ Journalisation des transactions
- ✅ Interface web responsive et moderne

## Architecture

Le projet suit les principes de la programmation orientée objet avec une séparation claire des responsabilités :

```
src/
├── Product.js           # Classe représentant un produit
├── Inventory.js         # Gestion de l'inventaire
├── CoinManager.js       # Gestion des pièces et devises
├── TransactionLogger.js # Enregistrement des transactions
├── VendingMachine.js    # Classe principale du distributeur
└── index.js            # Point d'entrée (info uniquement)

public/
├── index.html          # Interface web principale
├── app.js             # Logique frontend
├── styles.css         # Styles CSS
└── modules/           # Modules frontend

tests/
├── Product.complete.test.js       # Tests complets Product (10 tests)
├── Inventory.complete.test.js     # Tests complets Inventory (10 tests)
├── CoinManager.complete.test.js   # Tests complets CoinManager (10 tests)
├── TransactionLogger.complete.test.js # Tests complets TransactionLogger (13 tests)
└── VendingMachine.complete.test.js    # Tests complets VendingMachine (20 tests)
```

## Tests Unitaires - Suite Complète

### Philosophie des Tests

Ce projet implémente une **suite complète de 63 tests** couvrant exhaustivement toutes les fonctionnalités :

- **Tests granulaires** pour chaque méthode et cas d'usage
- **Mocking stratégique** pour l'isolation des composants
- **Structure AAA** (Arrange-Act-Assert) systématique
- **Gestion complète des edge cases** et erreurs
- **Tests fast & déterministes** (< 2 secondes total)

### Couverture de Code Exceptionnelle

```
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-------------------
All files             |   98.87 |     91.3 |     100 |   99.42 |
 CoinManager.js       |   94.73 |    83.33 |     100 |   97.29 | 108
 Inventory.js         |     100 |      100 |     100 |     100 |
 Product.js           |     100 |      100 |     100 |     100 |
 TransactionLogger.js |     100 |    78.57 |     100 |     100 | 38
 VendingMachine.js    |     100 |    96.66 |     100 |     100 | 265
----------------------|---------|----------|---------|---------|-------------------
```

### Description des Suites de Tests

#### 1. Product.complete.test.js (10 tests)

- **Tests 1-10** : Création, disponibilité, distribution, réapprovisionnement
- **Couverture** : 100% de toutes les métriques
- **Cas couverts** : Valeurs par défaut, erreurs de distribution, validation des paramètres

#### 2. CoinManager.complete.test.js (10 tests)

- **Tests 11-20** : Gestion des devises, calcul de monnaie, validation des dénominations
- **Couverture** : 94.73% statements, 83.33% branches
- **Cas couverts** : Conversions de devises, monnaie impossible, distribution optimale

#### 3. VendingMachine.complete.test.js (20 tests)

- **Tests 21-40** : Workflow complet du distributeur automatique
- **Couverture** : 100% statements, 96.66% branches
- **Cas couverts** : Sélection produits, paiements, achats, annulations, erreurs mécaniques

#### 4. Inventory.complete.test.js (10 tests)

- **Tests 41-50** : Gestion complète de l'inventaire
- **Couverture** : 100% de toutes les métriques
- **Cas couverts** : Ajout/suppression produits, filtrage, disponibilité

#### 5. TransactionLogger.complete.test.js (13 tests)

- **Tests 51-63** : Logging et statistiques avancées
- **Couverture** : 100% statements et fonctions, 78.57% branches
- **Cas couverts** : Types de transactions, filtrage temporel, calculs statistiques, effets de bord

## Installation et Utilisation

### Prérequis

- Node.js (version 14 ou supérieure)
- npm

### Installation

```bash
npm install
```

### Démarrage de l'application

#### Interface Web

```bash
npm start
```

Puis ouvrez votre navigateur à l'adresse : `http://localhost:3000`

### Tests Complets

#### Exécuter tous les tests

```bash
npm test
```

**Résultat attendu :** 5 suites de tests, 63 tests passent en < 2 secondes

#### Générer un rapport de couverture

```bash
npm run test:coverage
```

**Couverture obtenue :**

- Product.js: 100%
- Inventory.js: 100%
- CoinManager.js: 94.73%
- VendingMachine.js: 100%
- TransactionLogger.js: 100%

#### Avantages de cette approche

- 🎯 **Couverture exceptionnelle** : 98.87% de couverture des statements
- 🔬 **Tests granulaires** : Chaque méthode et cas d'usage testé individuellement
- 🔒 **Tests isolés** : Utilisation stratégique de mocks pour l'isolation
- 📋 **Déterministes** : 63 tests reproductibles à chaque exécution
- 🔧 **Maintenables** : Tests bien organisés et documentés
- ⚡ **Rapides** : Toute la suite s'exécute en moins de 2 secondes

### Exemples d'utilisation des Tests

```bash
# Exécution de tous les tests (63 tests)
npm test

# Couverture avec rapport détaillé HTML
npm run test:coverage

# Mode développement (auto-refresh)
npm run test:watch

# Tests spécifiques à une classe
npx jest Product.complete.test.js
npx jest VendingMachine.complete.test.js
```

## Utilisation

### Interface Web

L'interface web offre une expérience moderne et intuitive :

1. **Sélection de produits** - Cliquez sur un produit pour le sélectionner
2. **Insertion de monnaie** - Cliquez sur les boutons de pièces
3. **Achat automatique** - L'achat se fait automatiquement si le montant est suffisant
4. **Récupération** - Cliquez sur les zones de récupération pour vider les slots

### Dénominations Acceptées

- Pièces : 5¢, 10¢, 20¢, 50¢, 1€, 2€

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

// Annulation
vm.cancel(); // Récupère l'argent inséré
```

## Tests - 47 Tests Unitaires de Qualité

Le projet inclut une suite de **47 tests unitaires** suivant les meilleures pratiques :

### 🎯 **Caractéristiques des Tests Unitaires**

- **Tests One Behavior** : Chaque test vérifie un seul comportement
- **No External Dependencies** : Utilisation de mocks pour isoler les dépendances
- **Fast Execution** : Tests rapides (~1.7s pour 47 tests)
- **Deterministic** : Résultats prévisibles et reproductibles
- **Isolated** : Chaque test est indépendant

### 🏗️ **Architecture avec Injection de Dépendances**

Le code a été refactorisé pour supporter l'injection de dépendances :

```javascript
// VendingMachine accepte maintenant ses dépendances
const vendingMachine = new VendingMachine(
  inventory,
  coinManager,
  transactionLogger
);

// Permet l'utilisation de mocks dans les tests
const mockInventory = { getProduct: jest.fn() };
const vm = new VendingMachine(
  mockInventory,
  mockCoinManager,
  mockTransactionLogger
);
```

### 📝 **Structure AAA (Arrange-Act-Assert)**

Tous les tests suivent la structure AAA pour une meilleure lisibilité :

```javascript
test("should select available product successfully", () => {
  // Arrange
  const productId = "A1";
  const mockProduct = new Product(productId, "Coca-Cola", 150, 10);
  mockInventory.getProduct.mockReturnValue(mockProduct);

  // Act
  const result = vendingMachine.selectProduct(productId);

  // Assert
  expect(result.success).toBe(true);
  expect(result.product.name).toBe("Coca-Cola");
});
```

### 📦 Product.test.js (5 tests)

Tests de la classe Product de base :

- **Constructor** : Création correcte d'un produit
- **isAvailable()** : Vérification de disponibilité (stock > 0)
- **dispense()** : Distribution et décrémentation du stock

### 🏪 Inventory.test.js (6 tests)

Tests de la gestion d'inventaire :

- **Constructor** : Création d'un inventaire vide
- **addProduct()** : Ajout de produits à l'inventaire
- **getProduct()** : Récupération de produits par ID
- **getAvailableProducts()** : Filtrage des produits disponibles
- **dispenseProduct()** : Distribution avec mise à jour du stock

### 💰 CoinManager.test.js (8 tests)

Tests de la gestion des pièces et monnaie :

- **Constructor** : Initialisation avec devise EUR par défaut
- **addCoins()** : Ajout de pièces valides et rejet des invalides
- **calculateChange()** : Calcul optimal de la monnaie à rendre
- **canMakeChange()** : Vérification de la possibilité de rendre la monnaie
- **dispenseChange()** : Distribution de monnaie et mise à jour des stocks
- **formatAmount()** : Formatage des montants pour affichage

### 📝 TransactionLogger.test.js (5 tests)

Tests de l'enregistrement des transactions :

- **Constructor** : Création d'un logger vide
- **log()** : Enregistrement correct des transactions
- **getAllTransactions()** : Récupération de l'historique
- **getStatistics()** : Calcul des statistiques (ventes, revenus, erreurs)

### 🎰 VendingMachine.test.js (7 tests)

Tests d'intégration de la machine complète :

- **Constructor** : Initialisation correcte de la machine
- **selectProduct()** : Sélection de produits valides et invalides
- **insertMoney()** : Insertion de monnaie valide et invalide
- **purchase()** : Achat complet avec succès et échec (montant insuffisant)
- **cancel()** : Annulation et remboursement

### 📊 **Statistiques des Tests**

- **Couverture** : > 80% sur tous les composants
- **Types** : 100% tests unitaires purs
- **Vitesse** : ~1.7s pour 47 tests
- **Isolation** : Mocks pour toutes les dépendances externes
- **Structure** : Format AAA systématique

### 📦 Product.test.js (6 tests)

Tests unitaires de la classe Product avec structure AAA :

- **Constructor** : Création avec toutes propriétés et valeurs par défaut
- **isAvailable()** : Vérification disponibilité (stock > 0 et = 0)
- **dispense()** : Distribution réussie et échec avec erreur

### 🏪 Inventory.test.js (8 tests)

Tests unitaires de gestion d'inventaire avec isolation :

- **Constructor** : Création d'inventaire vide
- **addProduct()** : Ajout et remplacement de produits
- **getProduct()** : Récupération valide et invalide
- **getAvailableProducts()** : Filtrage avec et sans produits disponibles
- **dispenseProduct()** : Distribution et gestion d'erreurs

### 💰 CoinManager.test.js (11 tests)

Tests unitaires de gestion monnaie avec mocks :

- **Constructor** : Initialisation avec devise personnalisée
- **addCoins()** : Ajout, accumulation, et validation dénominations
- **calculateChange()** : Calcul optimal et cas particuliers
- **canMakeChange()** : Vérification possibilité de rendu
- **dispenseChange()** : Distribution avec mise à jour inventory
- **formatAmount()** : Formatage montants

### 📝 TransactionLogger.test.js (8 tests)

Tests unitaires d'enregistrement isolés :

- **Constructor** : Logger vide
- **log()** : Enregistrement complet, valeurs par défaut, IDs uniques
- **getAllTransactions()** : Récupération avec et sans transactions
- **getStatistics()** : Calculs statistiques mixtes et vides

### 🎰 VendingMachine.test.js (14 tests)

Tests unitaires d'intégration avec mocks complets :

- **Constructor** : Injection de dépendances
- **selectProduct()** : Sélection réussie, produit inexistant, indisponible
- **insertMoney()** : Dénominations valides et invalides
- **purchase()** : Achat réussi, échecs (pas de produit, montant insuffisant, impossible de rendre)
- **cancel()** : Annulation réussie et sans argent

### 🔧 **Utilisation de Mocks pour l'Isolation**

```javascript
// Mock des dépendances pour tests unitaires purs
mockInventory = {
  getProduct: jest.fn(),
  dispenseProduct: jest.fn(),
};

mockCoinManager = {
  formatAmount: jest.fn(),
  canMakeChange: jest.fn(),
  dispenseChange: jest.fn(),
};
```

### Couverture et Qualité

- **Couverture** : > 80% sur les composants principaux
- **Types de tests** : 100% unitaires avec mocks
- **Focus** : Un comportement par test
- **Maintenance** : Tests isolés et déterministes

### Exécution des Tests

```bash
# Tests standard
npm test

# Tests avec détails
npm test -- --verbose

# Couverture avec rapport HTML
npm run test:coverage
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

Toutes les opérations importantes sont enregistrées avec horodatage :

- Ventes réussies/échouées
- Erreurs
- Annulations

## Développement

### Structure du Code

- **Séparation des responsabilités** : Chaque classe a une responsabilité unique
- **Interface web moderne** : HTML5, CSS3, JavaScript ES6+
- **Gestion d'erreurs robuste** : Tous les cas d'erreur principaux sont gérés
- **Code testable** : Architecture facilitant les tests unitaires

### Points Forts

- **31 tests essentiels** couvrant toutes les fonctionnalités critiques
- **Interface utilisateur uniquement** (pas d'administration)
- **Code simple et maintenable**
- **Documentation claire** de chaque test

## Auteur

Projet réalisé dans le cadre de l'évaluation des tests unitaires.

## Licence

MIT
