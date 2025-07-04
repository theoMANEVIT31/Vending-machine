import { Product } from "./Product.js";
import { Inventory } from "./Inventory.js";
import { Currency, CoinManager } from "./CoinManager.js";
import { TransactionLogger } from "./TransactionLogger.js";

class VendingMachine {
  constructor(currency = new Currency("EUR", "Euro", "€")) {
    this.inventory = new Inventory();
    this.coinManager = new CoinManager(currency);
    this.transactionLogger = new TransactionLogger();
    this.insertedMoney = 0;
    this.selectedProduct = null;
  }
  
  insertCoin(amount) {
    if (!this.coinManager.isValidDenomination(amount)) {
      throw new Error(`Dénomination ${amount}€ non acceptée`);
    }
    this.insertedMoney += amount;
    this.insertedMoney = Math.round(this.insertedMoney * 100) / 100; // Éviter les erreurs de virgule flottante
    this.coinManager.addCoins(amount, 1);
  }
  
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
  
  purchaseProduct(productCode) {
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
    const changeAmount = this.insertedMoney - productPrice;
    let change = [];
    if (changeAmount > 0) {
      if (!this.coinManager.canMakeChange(changeAmount)) {
        throw new Error("Impossible de rendre la monnaie exacte");
      }
      change = this.coinManager.makeChange(changeAmount);
    }
    this.inventory.removeStock(this.selectedProduct, 1);
    this.transactionLogger.logPurchase(product, this.insertedMoney, change);
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
  
  getStatus() {
    return {
      insertedMoney: this.insertedMoney,
      selectedProduct: this.selectedProduct,
      inventory: this.inventory.getAllProducts(),
      coinInventory: this.coinManager.getCoinInventory(),
      totalCashValue: this.coinManager.getTotalValue(),
    };
  }
  
  getStatistics() {
    return this.transactionLogger.getStatistics();
  }
  
  restockProduct(productCode, quantity) {
    const product = this.inventory.getProduct(productCode);
    if (!product) {
      throw new Error(`Produit ${productCode} non trouvé`);
    }
    this.inventory.addProduct(product, quantity);
    
    this.transactionLogger.log("restock", productCode, 0, true, {
      quantity: quantity,
      message: `Restocked ${quantity} units of product ${productCode}`
    });
  }
  
  addCash(denomination, quantity) {
    this.coinManager.addCoins(denomination, quantity);
  }
  
  getOutOfStockProducts() {
    return this.inventory.getOutOfStockProducts();
  }
  
  getLowStockProducts(threshold = 2) {
    return this.inventory.getLowStockProducts(threshold);
  }
  
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

