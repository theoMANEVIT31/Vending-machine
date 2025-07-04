# 🏪 Distributeur Automatique - Système de Vending Machine

## 📋 Vue d'ensemble

Ce projet implémente un système complet de distributeur automatique avec gestion des stocks, des transactions et de la monnaie. Le système est développé en JavaScript avec une suite de tests unitaires complète.

## ✅ Fonctionnalités Implémentées

### 🎯 **TOUTES LES EXIGENCES SONT REMPLIES** ✅

| Exigence | Statut | Implémentation |
|----------|--------|----------------|
| **Sélection de produit et affichage du prix** | ✅ **COMPLET** | `VendingMachine.selectProduct()` - Sélectionne un produit et affiche ses informations complètes |
| **Acceptation d'argent (valeurs entières en centimes)** | ✅ **COMPLET** | `VendingMachine.insertMoney()` - Accepte uniquement des dénominations valides |
| **Validation du montant suffisant** | ✅ **COMPLET** | `VendingMachine.purchase()` - Vérifie si l'argent inséré couvre le prix |
| **Distribution et rendu de monnaie exact** | ✅ **COMPLET** | `VendingMachine.purchase()` + `CoinManager.dispenseChange()` - Calcul et distribution automatiques |
| **Gestion des erreurs "rupture de stock"** | ✅ **COMPLET** | `Product.isAvailable()` + `VendingMachine.selectProduct()` - Vérification complète |
| **Classe Inventory avec restockage** | ✅ **COMPLET** | `Inventory.restockProduct()` - Gestion complète des stocks |
| **Calcul de monnaie complexe (moins de pièces)** | ✅ **COMPLET** | `CoinManager.calculateChange()` - Algorithme optimisé glouton |
| **Gestion "monnaie insuffisante"** | ✅ **COMPLET** | `CoinManager.canMakeChange()` - Vérification avant transaction |
| **Suivi de l'argent total dans la machine** | ✅ **COMPLET** | `CoinManager.getTotalMoney()` - Comptabilisation en temps réel |
| **Retour d'argent si annulation** | ✅ **COMPLET** | `VendingMachine.cancel()` - Remboursement intégral |
| **Gestion uniquement de l'argent physique** | ✅ **COMPLET** | Système basé sur dénominations physiques uniquement |

## 🏗️ Architecture du Système

### 📁 Structure des Classes

```
src/
├── VendingMachine.js    # 🎰 Contrôleur principal
├── Product.js           # 🥤 Gestion des produits
├── Inventory.js         # 📦 Gestion des stocks
├── CoinManager.js       # 💰 Gestion de la monnaie
├── TransactionLogger.js # 📊 Historique des transactions
└── index.js            # 🚀 Point d'entrée
```

### 🔄 Flux de Fonctionnement

1. **Initialisation** : `VendingMachine.initialize()`
2. **Sélection** : `selectProduct(id)` → Affiche prix et disponibilité
3. **Paiement** : `insertMoney(amount)` → Validation des dénominations
4. **Validation** : Vérification automatique du montant suffisant
5. **Distribution** : `purchase()` → Produit + Monnaie optimale
6. **Alternative** : `cancel()` → Remboursement intégral

## 💰 Gestion de la Monnaie

### Dénominations Supportées (Centimes)
- **Pièces** : 1, 2, 5, 10, 20, 50, 100, 200 centimes
- **Billets** : 500, 1000, 2000, 5000 centimes

### Algorithme de Rendu
- **Stratégie Gloutonne** : Moins de pièces/billets possible
- **Validation Préalable** : Vérification de faisabilité avant achat
- **Gestion d'Erreurs** : Blocage si rendu impossible


## 🧪 Tests et Qualité

### 📈 Couverture de Tests
- **Tests Clean** : 28 tests essentiels
- **Couverture** : ~78% statements, ~86% functions
- **Performance** : <3 secondes d'exécution
- **Structure** : 100% AAA (Arrange/Act/Assert)

### 🎯 Règles de Tests Respectées
- ✅ **One Behavior** : Un test = Un comportement
- ✅ **No External Dependencies** : Tests isolés
- ✅ **Fast Execution** : <100ms par test
- ✅ **Deterministic** : Résultats prévisibles
- ✅ **Isolated** : Tests indépendants

### 🚀 Exécution des Tests
```bash
# Tests essentiels avec structure AAA
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```