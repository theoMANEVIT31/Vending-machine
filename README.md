# 🏪 Distributeur Automatique - Système de Vending Machine

## 📋 Vue d'ensemble

Ce projet implémente un système complet de distributeur automatique avec gestion des stocks, des transactions et de la monnaie. Le système est développé en JavaScript avec une suite de tests unitaires complète et dispose d'une interface web moderne avec support multi-devises.

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

## 🆕 Nouvelles Fonctionnalités Avancées

### 🌍 **Système Multi-Devises** 
- **Classe Currency** : Gestion complète des devises avec taux de change
- **Support Multi-Devises** : EUR (€), USD ($), GBP (£)
- **Conversion Automatique** : Conversion en temps réel du crédit et des prix
- **Interface Utilisateur** : Sélecteur de devise dans l'interface web

### 🖥️ **Interface Web Moderne**
- **Interface Responsive** : Design moderne avec Font Awesome
- **Mode Administrateur** : Gestion avancée des stocks et de la machine
- **Affichage en Temps Réel** : Statut de la machine et transactions
- **Serveur Express** : API REST pour l'interface web (`server.js`)

### 📊 **Système de Logging Avancé**
- **Classe TransactionLogger** : Enregistrement détaillé de toutes les transactions
- **Historique Complet** : Achat, annulation, restockage, erreurs
- **Filtrage** : Par type, période, statut de réussite
- **Statistiques** : Ventes totales et analyses

### 🏦 **Gestion Externe des Pièces**
- **ExternalCoinProvider** : Simulation d'une banque de pièces externe
- **Approvisionnement Automatique** : Demande de pièces si stock insuffisant
- **Gestion des Stocks** : Surveillance des réserves de monnaie

### 🔧 **Fonctionnalités Administrateur**
- **Mode Admin** : Interface dédiée pour la gestion
- **Restockage Produits** : Réapprovisionnement via interface
- **Gestion Monnaie** : Ajout/retrait de pièces
- **Historique Transactions** : Consultation des logs détaillés

### 💼 **API et Intégration**
- **Formatage Intelligent** : Affichage des montants selon la devise
- **Status Complet** : État détaillé de la machine via `getStatus()`
- **Gestion d'Erreurs** : Messages d'erreur contextuels et logging
- **Structure Modulaire** : Architecture facilement extensible

## 🏗️ Architecture du Système

### 📁 Structure des Classes

```
src/
├── VendingMachine.js       # 🎰 Contrôleur principal avec gestion multi-devises
├── Product.js              # 🥤 Gestion des produits
├── Inventory.js            # 📦 Gestion des stocks
├── CoinManager.js          # 💰 Gestion de la monnaie et devises
├── TransactionLogger.js    # 📊 Historique détaillé des transactions
├── ExternalCoinProvider.js # 🏦 Simulation banque de pièces externe
└── index.js               # 🚀 Point d'entrée

public/
├── index.html             # 🌐 Interface web moderne
├── app.js                 # ⚡ Application JavaScript front-end
├── styles.css             # 🎨 Styles CSS responsifs
└── modules/               # 📦 Modules front-end
    ├── CoinManager.js
    ├── VendingMachine.js
    └── ... (autres modules)

server.js                  # 🖥️ Serveur Express pour l'interface web
```

### 🔄 Flux de Fonctionnement

1. **Initialisation** : `VendingMachine.initialize()` + `Currency` setup
2. **Sélection Devise** : Interface web pour changer EUR/USD/GBP
3. **Sélection Produit** : `selectProduct(id)` → Affiche prix converti
4. **Paiement** : `insertMoney(amount)` → Validation des dénominations
5. **Validation** : Vérification automatique du montant converti
6. **Distribution** : `purchase()` → Produit + Monnaie optimale + Log
7. **Alternative** : `cancel()` → Remboursement intégral avec conversion
8. **Administration** : Interface admin pour restockage et gestion

## 🌍 Gestion Multi-Devises

### Devises Supportées
- **EUR (€)** : Devise par défaut (taux: 1.0)
- **USD ($)** : Dollar américain (taux: 1.1)
- **GBP (£)** : Livre sterling (taux: 0.85)

### Fonctionnalités de Conversion
- **Conversion Temps Réel** : Prix et crédit convertis automatiquement
- **Conservation du Crédit** : Le montant inséré est converti lors du changement de devise
- **Affichage Contextualisé** : Symboles monétaires appropriés (€, $, £)
- **API de Conversion** : `Currency.convert()` pour conversions précises

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

# Tests spécifiques clean
npm run test:clean

# Tests minimaux
npm run test:minimal
```

## 🖥️ Interface Web et Serveur

### 🌐 Lancement de l'Application
```bash
# Installation des dépendances
npm install

# Lancement du serveur
npm start
# ou en mode développement
npm run dev

# Accès à l'interface
# http://localhost:3000
```

### 🎨 Fonctionnalités Interface Web
- **Interface Responsive** : Compatible mobile et desktop
- **Sélecteur de Devise** : Changement EUR/USD/GBP en temps réel
- **Affichage du Crédit** : Solde en devise sélectionnée
- **Grille de Produits** : Affichage des produits avec prix convertis
- **Panneau de Paiement** : Insertion de pièces/billets
- **Mode Administrateur** : Gestion stocks et historique
- **Notifications** : Messages de succès/erreur contextuels

### 🔧 Mode Administrateur
- **Accès** : Clic sur l'icône d'engrenage ⚙️
- **Restockage** : Réapprovisionnement des produits
- **Gestion Monnaie** : Ajout/retrait de pièces
- **Historique** : Consultation des transactions
- **Statistiques** : Ventes et performances

## 📊 Logging et Monitoring

### 📝 Types de Transactions Loggées
- **Purchase** : Achats réussis avec détails produit
- **Cancel** : Annulations utilisateur
- **Error** : Erreurs système et utilisateur
- **Restock** : Réapprovisionnements administrateur
- **Admin** : Actions administratives

### 📈 Données Collectées
- **ID Transaction** : Identifiant unique
- **Timestamp** : Date/heure précise
- **Type et Statut** : Catégorie et succès/échec
- **Montant** : Argent impliqué
- **Produit** : ID et détails du produit
- **Détails** : Informations contextuelles

### 🔍 Fonctions d'Analyse
```javascript
// Récupérer toutes les transactions
logger.getAllTransactions()

// Filtrer par type
logger.getTransactionsByType('purchase')

// Filtrer par période
logger.getTransactionsByPeriod(startDate, endDate)

// Statistiques de ventes
logger.getTotalSales()
```