/**
 * Gestionnaire de journalisation des transactions
 */
class TransactionLogger {
  constructor() {
    this.transactions = [];
  }

  /**
   * Enregistre une transaction
   * @param {string} type - Type de transaction
   * @param {Object} details - Détails de la transaction
   */
  logTransaction(type, details) {
    const transaction = {
      id: this.generateTransactionId(),
      timestamp: new Date(),
      type: type,
      ...details,
    };

    this.transactions.push(transaction);
    return transaction;
  }

  /**
   * Enregistre un achat
   * @param {Product} product
   * @param {number} amountPaid
   * @param {Array} change
   */
  logPurchase(product, amountPaid, change) {
    return this.logTransaction("PURCHASE", {
      productCode: product.code,
      productName: product.name,
      productPrice: product.price,
      amountPaid: amountPaid,
      changeGiven: change,
      totalChange: change.reduce((sum, coin) => sum + coin, 0),
    });
  }

  /**
   * Enregistre une annulation
   * @param {number} amountRefunded
   */
  logCancellation(amountRefunded) {
    return this.logTransaction("CANCELLATION", {
      amountRefunded: amountRefunded,
    });
  }

  /**
   * Enregistre un remboursement
   * @param {Array} coins
   */
  logRefund(coins) {
    return this.logTransaction("REFUND", {
      coinsReturned: coins,
      totalAmount: coins.reduce((sum, coin) => sum + coin, 0),
    });
  }

  /**
   * Retourne toutes les transactions
   * @returns {Array}
   */
  getAllTransactions() {
    return [...this.transactions];
  }

  /**
   * Retourne les transactions par type
   * @param {string} type
   * @returns {Array}
   */
  getTransactionsByType(type) {
    return this.transactions.filter((t) => t.type === type);
  }

  /**
   * Retourne les transactions dans une période donnée
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Array}
   */
  getTransactionsByDate(startDate, endDate) {
    return this.transactions.filter(
      (t) => t.timestamp >= startDate && t.timestamp <= endDate
    );
  }

  /**
   * Calcule le total des revenus
   * @returns {number}
   */
  getTotalRevenue() {
    return this.transactions
      .filter((t) => t.type === "PURCHASE")
      .reduce((total, t) => total + t.productPrice, 0);
  }

  /**
   * Calcule le nombre total de transactions
   * @returns {number}
   */
  getTotalTransactions() {
    return this.transactions.length;
  }

  /**
   * Calcule le nombre de produits vendus
   * @returns {number}
   */
  getTotalProductsSold() {
    return this.transactions.filter((t) => t.type === "PURCHASE").length;
  }

  /**
   * Retourne les produits les plus vendus
   * @returns {Array}
   */
  getTopSellingProducts() {
    const productSales = {};

    this.transactions
      .filter((t) => t.type === "PURCHASE")
      .forEach((t) => {
        const key = t.productCode;
        if (!productSales[key]) {
          productSales[key] = {
            product: t.productName,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[key].quantity += 1;
        productSales[key].revenue += t.productPrice;
      });

    return Object.values(productSales).sort((a, b) => b.quantity - a.quantity);
  }

  /**
   * Génère un ID de transaction unique
   * @returns {string}
   */
  generateTransactionId() {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Vide le journal des transactions
   */
  clearLog() {
    this.transactions = [];
  }

  /**
   * Retourne les statistiques du journal
   * @returns {Object}
   */
  getStatistics() {
    return {
      totalTransactions: this.getTotalTransactions(),
      totalRevenue: this.getTotalRevenue(),
      totalProductsSold: this.getTotalProductsSold(),
      topSellingProducts: this.getTopSellingProducts(),
    };
  }
}

export { TransactionLogger };
