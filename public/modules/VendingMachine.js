import { Product } from "./Product.js";
import { Inventory } from "./Inventory.js";
import { Currency, CoinManager } from "./CoinManager.js";
import { TransactionLogger } from "./TransactionLogger.js";

/**
 * Distributeur automatique principal
 */
class VendingMachine {
  constructor(currency = new Currency("EUR", "Euro", "€")) {
    this.inventory = new Inventory();
    this.coinManager = new CoinManager(currency);
    this.transactionLogger = new TransactionLogger();
    this.insertedMoney = 0;
    this.selectedProduct = null;
  }

  /**
   * Insère une pièce/billet dans la machine
   * @param {number} amount
   */
  insertCoin(amount) {
    if (!this.coinManager.isValidDenomination(amount)) {
      throw new Error(`Dénomination ${amount}€ non acceptée`);
    }

    this.insertedMoney += amount;
    this.insertedMoney = Math.round(this.insertedMoney * 100) / 100; // Éviter les erreurs de virgule flottante
    this.coinManager.addCoins(amount, 1);
  }

  /**
   * Sélectionne un produit
   * @param {string} productCode
   */
  selectProduct(productCode) {
    const product = this.inventory.getProduct(productCode);
    if (!product) {
      throw new Error(`Produit ${productCode} non trouvé`);
    }

    if (!this.inventory.isAvailable(productCode)) {
      throw new Error(`Produit ${productCode} en rupture de stock`);
    }

    this.selectedProduct = productCode;
  }

  /**
   * Achète le produit sélectionné
   * @param {string} productCode
   * @returns {Object}
   */
  purchaseProduct(productCode) {
    // Auto-sélectionner le produit si fourni
    if (productCode) {
      this.selectProduct(productCode);
    }

    if (!this.selectedProduct) {
      throw new Error("Aucun produit sélectionné");
    }

    const product = this.inventory.getProduct(this.selectedProduct);
    const productPrice = product.price;

    if (this.insertedMoney < productPrice) {
      throw new Error(
        `Montant insuffisant. Prix: ${productPrice.toFixed(
          2
        )}€, Inséré: ${this.insertedMoney.toFixed(2)}€`
      );
    }

    // Calculer la monnaie à rendre
    const changeAmount = this.insertedMoney - productPrice;
    let change = [];

    if (changeAmount > 0) {
      if (!this.coinManager.canMakeChange(changeAmount)) {
        throw new Error("Impossible de rendre la monnaie exacte");
      }
      change = this.coinManager.makeChange(changeAmount);
    }

    // Effectuer la transaction
    this.inventory.removeStock(this.selectedProduct, 1);

    // Enregistrer la transaction
    this.transactionLogger.logPurchase(product, this.insertedMoney, change);

    // Réinitialiser
    const result = {
      product: product,
      amountPaid: this.insertedMoney,
      change: change,
      changeAmount: changeAmount,
    };

    this.insertedMoney = 0;
    this.selectedProduct = null;

    return result;
  }

  /**
   * Annule la transaction en cours
   * @returns {Array}
   */
  cancelTransaction() {
    if (this.insertedMoney === 0) {
      throw new Error("Aucune transaction à annuler");
    }

    const refund = this.coinManager.makeChange(this.insertedMoney);
    this.transactionLogger.logCancellation(this.insertedMoney);

    this.insertedMoney = 0;
    this.selectedProduct = null;

    return refund;
  }

  /**
   * Retourne la monnaie insérée
   * @returns {Array}
   */
  returnChange() {
    if (this.insertedMoney === 0) {
      return [];
    }

    const change = this.coinManager.makeChange(this.insertedMoney);
    this.transactionLogger.logRefund(change);

    this.insertedMoney = 0;
    this.selectedProduct = null;

    return change;
  }

  /**
   * Retourne l'état actuel de la machine
   * @returns {Object}
   */
  getStatus() {
    return {
      insertedMoney: this.insertedMoney,
      selectedProduct: this.selectedProduct,
      inventory: this.inventory.getAllProducts(),
      coinInventory: this.coinManager.getCoinInventory(),
      totalCashValue: this.coinManager.getTotalValue(),
    };
  }

  /**
   * Retourne les statistiques de la machine
   * @returns {Object}
   */
  getStatistics() {
    return this.transactionLogger.getStatistics();
  }

  /**
   * Ajoute du stock d'un produit existant
   * @param {string} productCode
   * @param {number} quantity
   */
  restockProduct(productCode, quantity) {
    const product = this.inventory.getProduct(productCode);
    if (!product) {
      throw new Error(`Produit ${productCode} non trouvé`);
    }
    this.inventory.addProduct(product, quantity);
  }

  /**
   * Ajoute de la monnaie dans la machine
   * @param {number} denomination
   * @param {number} quantity
   */
  addCash(denomination, quantity) {
    this.coinManager.addCoins(denomination, quantity);
  }

  /**
   * Retourne les produits en rupture de stock
   * @returns {Array}
   */
  getOutOfStockProducts() {
    return this.inventory.getOutOfStockProducts();
  }

  /**
   * Retourne les produits avec un stock faible
   * @param {number} threshold
   * @returns {Array}
   */
  getLowStockProducts(threshold = 2) {
    return this.inventory.getLowStockProducts(threshold);
  }

  /**
   * Vérifie si la machine peut effectuer la transaction
   * @param {string} productCode
   * @param {number} amountInserted
   * @returns {Object}
   */
  canCompletePurchase(productCode, amountInserted = this.insertedMoney) {
    const product = this.inventory.getProduct(productCode);
    if (!product) {
      return { canPurchase: false, reason: "Produit non trouvé" };
    }

    if (!this.inventory.isAvailable(productCode)) {
      return { canPurchase: false, reason: "Produit en rupture de stock" };
    }

    if (amountInserted < product.price) {
      return {
        canPurchase: false,
        reason: `Montant insuffisant. Manque ${(
          product.price - amountInserted
        ).toFixed(2)}€`,
      };
    }

    const changeNeeded = amountInserted - product.price;
    if (changeNeeded > 0 && !this.coinManager.canMakeChange(changeNeeded)) {
      return {
        canPurchase: false,
        reason: "Impossible de rendre la monnaie exacte",
      };
    }

    return { canPurchase: true, reason: "Transaction possible" };
  }
}

export { VendingMachine };
