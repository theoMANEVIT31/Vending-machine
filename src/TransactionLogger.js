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
    this.type = type;
    this.productId = productId;
    this.amount = amount;
    this.success = success;
    this.details = details;
  }
}

class TransactionLogger {
  constructor() {
    this.transactions = [];
  }

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

  getAllTransactions() {
    return [...this.transactions];
  }

  getTransactionsByType(type) {
    return this.transactions.filter((t) => t.type === type);
  }

  getTransactionsByPeriod(startDate, endDate) {
    return this.transactions.filter(
      (t) => t.timestamp >= startDate && t.timestamp <= endDate
    );
  }

  getTotalSales() {
    return this.transactions
      .filter((t) => t.type === "sale" && t.success)
      .reduce((total, t) => total + t.amount, 0);
  }

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

  clear() {
    this.transactions = [];
  }
}

module.exports = { Transaction, TransactionLogger };
