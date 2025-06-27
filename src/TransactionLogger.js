/**
 * Représente une transaction
 */
class Transaction {
  constructor(
    type,
    productId = null,
    amount = 0,
    success = true,
    details = {}
  ) {
    this.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.timestamp = new Date();
    this.type = type; // 'sale', 'error', 'restock', 'cancel'
    this.productId = productId;
    this.amount = amount;
    this.success = success;
    this.details = details;
  }
}

/**
 * Gère l'historique des transactions
 */
class TransactionLogger {
  constructor() {
    this.transactions = [];
  }

  /**
   * Enregistre une transaction
   * @param {string} type - Type de transaction
   * @param {string|null} productId - ID du produit (optionnel)
   * @param {number} amount - Montant
   * @param {boolean} success - Succès de la transaction
   * @param {Object} details - Détails supplémentaires
   */
  log(type, productId = null, amount = 0, success = true, details = {}) {
    const transaction = new Transaction(
      type,
      productId,
      amount,
      success,
      details
    );
    this.transactions.push(transaction);
    return transaction;
  }

  /**
   * Récupère toutes les transactions
   * @returns {Array<Transaction>}
   */
  getAllTransactions() {
    return [...this.transactions];
  }

  /**
   * Récupère les transactions par type
   * @param {string} type - Type de transaction
   * @returns {Array<Transaction>}
   */
  getTransactionsByType(type) {
    return this.transactions.filter((t) => t.type === type);
  }

  /**
   * Récupère les transactions d'une période
   * @param {Date} startDate - Date de début
   * @param {Date} endDate - Date de fin
   * @returns {Array<Transaction>}
   */
  getTransactionsByPeriod(startDate, endDate) {
    return this.transactions.filter(
      (t) => t.timestamp >= startDate && t.timestamp <= endDate
    );
  }

  /**
   * Calcule le total des ventes
   * @returns {number} Total en centimes
   */
  getTotalSales() {
    return this.transactions
      .filter((t) => t.type === "sale" && t.success)
      .reduce((total, t) => total + t.amount, 0);
  }

  /**
   * Récupère les statistiques
   * @returns {Object}
   */
  getStatistics() {
    const sales = this.getTransactionsByType("sale").filter((t) => t.success);
    const errors = this.getTransactionsByType("error");
    const cancellations = this.getTransactionsByType("cancel");

    return {
      totalTransactions: this.transactions.length,
      successfulSales: sales.length,
      totalRevenue: this.getTotalSales(),
      errors: errors.length,
      cancellations: cancellations.length,
      successRate:
        this.transactions.length > 0
          ? ((sales.length / this.transactions.length) * 100).toFixed(2) + "%"
          : "0%",
    };
  }

  /**
   * Efface l'historique
   */
  clear() {
    this.transactions = [];
  }
}

module.exports = { Transaction, TransactionLogger };
