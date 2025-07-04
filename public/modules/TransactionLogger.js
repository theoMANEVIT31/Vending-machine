class TransactionLogger {
  constructor() {
    this.transactions = [];
  }
  
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
  
  logCancellation(amountRefunded) {
    return this.logTransaction("CANCELLATION", {
      amountRefunded: amountRefunded,
    });
  }
  
  logRefund(coins) {
    return this.logTransaction("REFUND", {
      coinsReturned: coins,
      totalAmount: coins.reduce((sum, coin) => sum + coin, 0),
    });
  }
  
  log(type, productId = null, amount = 0, success = true, details = {}) {
    return this.logTransaction(type.toUpperCase(), {
      productId: productId,
      amount: amount,
      success: success,
      details: details
    });
  }
  
  getAllTransactions() {
    return [...this.transactions];
  }
  
  getTransactionsByType(type) {
    return this.transactions.filter((t) => t.type === type);
  }
  
  getTransactionsByDate(startDate, endDate) {
    return this.transactions.filter(
      (t) => t.timestamp >= startDate && t.timestamp <= endDate
    );
  }
  
  getTotalRevenue() {
    return this.transactions
      .filter((t) => t.type === "PURCHASE")
      .reduce((total, t) => total + t.productPrice, 0);
  }
  
  getTotalTransactions() {
    return this.transactions.length;
  }
  
  getTotalProductsSold() {
    return this.transactions.filter((t) => t.type === "PURCHASE").length;
  }
  
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
  
  generateTransactionId() {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  clearLog() {
    this.transactions = [];
  }
  
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

