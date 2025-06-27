const { Transaction, TransactionLogger } = require("../src/TransactionLogger");

describe("Transaction", () => {
  describe("constructor", () => {
    test("should create transaction with required parameters", () => {
      const transaction = new Transaction("sale", "A1", 150);

      expect(transaction.type).toBe("sale");
      expect(transaction.productId).toBe("A1");
      expect(transaction.amount).toBe(150);
      expect(transaction.success).toBe(true);
      expect(transaction.details).toEqual({});
      expect(transaction.id).toBeDefined();
      expect(transaction.timestamp).toBeInstanceOf(Date);
    });

    test("should create transaction with all parameters", () => {
      const details = { productName: "Coca-Cola", change: 50 };
      const transaction = new Transaction("sale", "A1", 150, false, details);

      expect(transaction.success).toBe(false);
      expect(transaction.details).toBe(details);
    });

    test("should create transaction with default values", () => {
      const transaction = new Transaction("error");

      expect(transaction.productId).toBeNull();
      expect(transaction.amount).toBe(0);
      expect(transaction.success).toBe(true);
      expect(transaction.details).toEqual({});
    });

    test("should generate unique IDs", () => {
      const transaction1 = new Transaction("sale");
      const transaction2 = new Transaction("sale");

      expect(transaction1.id).not.toBe(transaction2.id);
    });

    test("should have timestamp close to current time", () => {
      const before = new Date();
      const transaction = new Transaction("sale");
      const after = new Date();

      expect(transaction.timestamp.getTime()).toBeGreaterThanOrEqual(
        before.getTime()
      );
      expect(transaction.timestamp.getTime()).toBeLessThanOrEqual(
        after.getTime()
      );
    });
  });
});

describe("TransactionLogger", () => {
  let logger;

  beforeEach(() => {
    logger = new TransactionLogger();
  });

  describe("constructor", () => {
    test("should create empty transaction log", () => {
      expect(logger.transactions).toEqual([]);
      expect(logger.getAllTransactions()).toEqual([]);
    });
  });

  describe("log", () => {
    test("should log transaction with all parameters", () => {
      const details = { productName: "Coca-Cola" };
      const transaction = logger.log("sale", "A1", 150, true, details);

      expect(transaction.type).toBe("sale");
      expect(transaction.productId).toBe("A1");
      expect(transaction.amount).toBe(150);
      expect(transaction.success).toBe(true);
      expect(transaction.details).toBe(details);

      expect(logger.transactions).toHaveLength(1);
      expect(logger.transactions[0]).toBe(transaction);
    });

    test("should log transaction with minimal parameters", () => {
      const transaction = logger.log("error");

      expect(transaction.type).toBe("error");
      expect(transaction.productId).toBeNull();
      expect(transaction.amount).toBe(0);
      expect(transaction.success).toBe(true);
      expect(transaction.details).toEqual({});
    });

    test("should maintain transaction order", () => {
      const t1 = logger.log("sale", "A1", 150);
      const t2 = logger.log("error", "B1", 0, false);
      const t3 = logger.log("cancel", null, 200);

      expect(logger.transactions).toEqual([t1, t2, t3]);
    });

    test("should return the created transaction", () => {
      const transaction = logger.log("restock", "A1", 0, true, {
        quantity: 10,
      });

      expect(transaction).toBeInstanceOf(Transaction);
      expect(transaction.type).toBe("restock");
    });
  });

  describe("getAllTransactions", () => {
    test("should return empty array for new logger", () => {
      expect(logger.getAllTransactions()).toEqual([]);
    });

    test("should return copy of all transactions", () => {
      logger.log("sale", "A1", 150);
      logger.log("error", "B1", 0, false);

      const transactions = logger.getAllTransactions();
      expect(transactions).toHaveLength(2);

      // Modify returned array
      transactions.push("fake");

      // Original should be unchanged
      expect(logger.getAllTransactions()).toHaveLength(2);
    });

    test("should include all transaction types", () => {
      logger.log("sale", "A1", 150);
      logger.log("error", "A1", 0, false);
      logger.log("cancel", null, 100);
      logger.log("restock", "A1", 0, true, { quantity: 5 });

      const transactions = logger.getAllTransactions();
      expect(transactions).toHaveLength(4);

      const types = transactions.map((t) => t.type);
      expect(types).toContain("sale");
      expect(types).toContain("error");
      expect(types).toContain("cancel");
      expect(types).toContain("restock");
    });
  });

  describe("getTransactionsByType", () => {
    beforeEach(() => {
      logger.log("sale", "A1", 150, true);
      logger.log("sale", "A2", 120, true);
      logger.log("error", "B1", 0, false);
      logger.log("cancel", null, 100, true);
      logger.log("sale", "C1", 200, false);
    });

    test("should return only transactions of specified type", () => {
      const sales = logger.getTransactionsByType("sale");
      expect(sales).toHaveLength(3);
      sales.forEach((t) => expect(t.type).toBe("sale"));
    });

    test("should return empty array for non-existent type", () => {
      const restocks = logger.getTransactionsByType("restock");
      expect(restocks).toEqual([]);
    });

    test("should handle single transaction type", () => {
      const errors = logger.getTransactionsByType("error");
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("error");
    });

    test("should maintain original order", () => {
      const sales = logger.getTransactionsByType("sale");
      expect(sales[0].productId).toBe("A1");
      expect(sales[1].productId).toBe("A2");
      expect(sales[2].productId).toBe("C1");
    });
  });

  describe("getTransactionsByPeriod", () => {
    beforeEach(() => {
      // Mock timestamps for testing
      const baseTime = new Date("2024-01-01T10:00:00Z");

      const t1 = logger.log("sale", "A1", 150);
      t1.timestamp = new Date(baseTime.getTime());

      const t2 = logger.log("sale", "A2", 120);
      t2.timestamp = new Date(baseTime.getTime() + 3600000); // +1 hour

      const t3 = logger.log("error", "B1", 0, false);
      t3.timestamp = new Date(baseTime.getTime() + 7200000); // +2 hours

      const t4 = logger.log("sale", "C1", 200);
      t4.timestamp = new Date(baseTime.getTime() + 10800000); // +3 hours
    });

    test("should return transactions within date range", () => {
      const startDate = new Date("2024-01-01T10:30:00Z");
      const endDate = new Date("2024-01-01T12:30:00Z");

      const transactions = logger.getTransactionsByPeriod(startDate, endDate);
      expect(transactions).toHaveLength(2);
      expect(transactions[0].productId).toBe("A2");
      expect(transactions[1].productId).toBe("B1");
    });

    test("should return empty array for period with no transactions", () => {
      const startDate = new Date("2024-01-02T00:00:00Z");
      const endDate = new Date("2024-01-02T23:59:59Z");

      const transactions = logger.getTransactionsByPeriod(startDate, endDate);
      expect(transactions).toEqual([]);
    });

    test("should include boundary dates", () => {
      const startDate = new Date("2024-01-01T11:00:00Z"); // Exact time of second transaction
      const endDate = new Date("2024-01-01T13:00:00Z"); // Exact time of fourth transaction

      const transactions = logger.getTransactionsByPeriod(startDate, endDate);
      expect(transactions).toHaveLength(3);
    });
  });

  describe("getTotalSales", () => {
    beforeEach(() => {
      logger.log("sale", "A1", 150, true); // 1.50€
      logger.log("sale", "A2", 120, true); // 1.20€
      logger.log("error", "B1", 100, false); // Error - should not count
      logger.log("sale", "C1", 200, false); // Failed sale - should not count
      logger.log("cancel", null, 50, true); // Cancel - should not count
      logger.log("sale", "D1", 80, true); // 0.80€
    });

    test("should sum only successful sales", () => {
      expect(logger.getTotalSales()).toBe(350); // 150 + 120 + 80
    });

    test("should return zero for no sales", () => {
      const emptyLogger = new TransactionLogger();
      expect(emptyLogger.getTotalSales()).toBe(0);
    });

    test("should exclude failed sales", () => {
      const newLogger = new TransactionLogger();
      newLogger.log("sale", "A1", 100, false);
      newLogger.log("error", "A1", 50, false);

      expect(newLogger.getTotalSales()).toBe(0);
    });

    test("should handle large amounts", () => {
      logger.log("sale", "EXPENSIVE", 999999, true);
      expect(logger.getTotalSales()).toBe(350 + 999999);
    });
  });

  describe("getStatistics", () => {
    beforeEach(() => {
      logger.log("sale", "A1", 150, true);
      logger.log("sale", "A2", 120, true);
      logger.log("sale", "A3", 100, false); // Failed sale
      logger.log("error", "B1", 0, false);
      logger.log("error", "B2", 0, false);
      logger.log("cancel", null, 50, true);
      logger.log("restock", "C1", 0, true);
    });

    test("should calculate all statistics correctly", () => {
      const stats = logger.getStatistics();

      expect(stats.totalTransactions).toBe(7);
      expect(stats.successfulSales).toBe(2);
      expect(stats.totalRevenue).toBe(270); // 150 + 120
      expect(stats.errors).toBe(2);
      expect(stats.cancellations).toBe(1);
      expect(stats.successRate).toBe("28.57%"); // 2/7 ≈ 28.57%
    });

    test("should handle empty logger", () => {
      const emptyLogger = new TransactionLogger();
      const stats = emptyLogger.getStatistics();

      expect(stats.totalTransactions).toBe(0);
      expect(stats.successfulSales).toBe(0);
      expect(stats.totalRevenue).toBe(0);
      expect(stats.errors).toBe(0);
      expect(stats.cancellations).toBe(0);
      expect(stats.successRate).toBe("0%");
    });

    test("should calculate 100% success rate", () => {
      const perfectLogger = new TransactionLogger();
      perfectLogger.log("sale", "A1", 100, true);
      perfectLogger.log("sale", "A2", 200, true);

      const stats = perfectLogger.getStatistics();
      expect(stats.successRate).toBe("100.00%");
    });

    test("should round success rate to 2 decimal places", () => {
      const logger = new TransactionLogger();
      // 1 success out of 3 transactions = 33.333...%
      logger.log("sale", "A1", 100, true);
      logger.log("error", "A2", 0, false);
      logger.log("error", "A3", 0, false);

      const stats = logger.getStatistics();
      expect(stats.successRate).toBe("33.33%");
    });
  });

  describe("clear", () => {
    beforeEach(() => {
      logger.log("sale", "A1", 150);
      logger.log("error", "B1", 0, false);
      logger.log("cancel", null, 100);
    });

    test("should clear all transactions", () => {
      expect(logger.getAllTransactions()).toHaveLength(3);

      logger.clear();

      expect(logger.getAllTransactions()).toHaveLength(0);
      expect(logger.transactions).toEqual([]);
    });

    test("should reset statistics", () => {
      logger.clear();

      const stats = logger.getStatistics();
      expect(stats.totalTransactions).toBe(0);
      expect(stats.totalRevenue).toBe(0);
    });

    test("should allow new transactions after clear", () => {
      logger.clear();
      logger.log("sale", "A1", 100);

      expect(logger.getAllTransactions()).toHaveLength(1);
    });
  });

  describe("integration scenarios", () => {
    test("should handle complex transaction sequence", () => {
      // Simulate a day of transactions
      logger.log("sale", "A1", 150, true);
      logger.log("sale", "A1", 150, true);
      logger.log("error", "A1", 0, false, { reason: "out of stock" });
      logger.log("restock", "A1", 0, true, { quantity: 10 });
      logger.log("sale", "A1", 150, true);
      logger.log("cancel", null, 200, true);
      logger.log("sale", "B1", 120, false, { reason: "insufficient funds" });

      const stats = logger.getStatistics();
      expect(stats.totalTransactions).toBe(7);
      expect(stats.successfulSales).toBe(3);
      expect(stats.totalRevenue).toBe(450);
      expect(stats.errors).toBe(1);
      expect(stats.cancellations).toBe(1);
    });

    test("should maintain data integrity over time", () => {
      // Add transactions
      for (let i = 0; i < 100; i++) {
        const success = i % 3 !== 0; // ~67% success rate
        const amount = success ? 100 + i : 0;
        logger.log("sale", `P${i}`, amount, success);
      }

      expect(logger.getAllTransactions()).toHaveLength(100);

      const successfulSales = logger
        .getTransactionsByType("sale")
        .filter((t) => t.success);
      expect(successfulSales.length).toBeGreaterThanOrEqual(65); // Approximately 67 successful sales
      expect(successfulSales.length).toBeLessThanOrEqual(68);

      const stats = logger.getStatistics();
      expect(stats.totalTransactions).toBe(100);
      expect(stats.successfulSales).toBe(successfulSales.length);
    });
  });
});
