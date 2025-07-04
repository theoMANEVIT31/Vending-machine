const { TransactionLogger } = require("../src/TransactionLogger");
describe("TransactionLogger - Tests Clean", () => {
  test("should log transaction with correct properties", () => {
    const logger = new TransactionLogger();
    const type = "sale";
    const productId = "A1";
    const amount = 150;
    const success = true;
    logger.log(type, productId, amount, success);
    const transactions = logger.getAllTransactions();
    expect(transactions).toHaveLength(1);
    expect(transactions[0].type).toBe("sale");
    expect(transactions[0].productId).toBe("A1");
    expect(transactions[0].amount).toBe(150);
  });
  test("should generate unique transaction ID", () => {
    const logger = new TransactionLogger();
    logger.log("sale", "A1", 150, true);
    const transaction = logger.getAllTransactions()[0];
    expect(transaction.id).toBeDefined();
    expect(typeof transaction.id).toBe("string");
  });
  test("should filter transactions by type", () => {
    const logger = new TransactionLogger();
    logger.log("sale", "A1", 150, true);
    logger.log("error", "A2", 0, false);
    logger.log("sale", "A3", 140, true);
    const result = logger.getTransactionsByType("sale");
    expect(result).toHaveLength(2);
    expect(result.every(t => t.type === "sale")).toBe(true);
  });
  test("should calculate total sales amount", () => {
    const logger = new TransactionLogger();
    logger.log("sale", "A1", 150, true);
    logger.log("sale", "A2", 140, true);
    const result = logger.getTotalSales();
    expect(result).toBe(290);
  });
  test("should generate correct statistics", () => {
    const logger = new TransactionLogger();
    logger.log("sale", "A1", 150, true);
    logger.log("error", "A2", 0, false);
    const result = logger.getStatistics();
    expect(result.totalTransactions).toBe(2);
    expect(result.successfulSales).toBe(1);
    expect(result.totalRevenue).toBe(150);
  });
});
