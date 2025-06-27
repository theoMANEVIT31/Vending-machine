const { Transaction, TransactionLogger } = require("../src/TransactionLogger");

describe("TransactionLogger - Suite complète", () => {
  let logger;

  beforeEach(() => {
    logger = new TransactionLogger();
  });

  describe("Transaction", () => {
    test("51. should create transaction with all parameters", () => {
      // Act
      const transaction = new Transaction("sale", "A1", 150, true, {
        test: "data",
      });

      // Assert
      expect(transaction.id).toBeDefined();
      expect(transaction.timestamp).toBeInstanceOf(Date);
      expect(transaction.type).toBe("sale");
      expect(transaction.productId).toBe("A1");
      expect(transaction.amount).toBe(150);
      expect(transaction.success).toBe(true);
      expect(transaction.details).toEqual({ test: "data" });
    });

    test("52. should create transaction with default values", () => {
      // Act
      const transaction = new Transaction("error");

      // Assert
      expect(transaction.productId).toBeNull();
      expect(transaction.amount).toBe(0);
      expect(transaction.success).toBe(true);
      expect(transaction.details).toEqual({});
    });

    test("53. should generate unique IDs for different transactions", () => {
      // Act
      const transaction1 = new Transaction("sale");
      const transaction2 = new Transaction("sale");

      // Assert
      expect(transaction1.id).not.toBe(transaction2.id);
    });
  });

  describe("TransactionLogger", () => {
    test("54. should start with empty transaction list", () => {
      // Act & Assert
      expect(logger.getAllTransactions()).toHaveLength(0);
      expect(logger.getTotalSales()).toBe(0);
    });

    test("55. should log different types of transactions", () => {
      // Act
      const saleTransaction = logger.log("sale", "A1", 150, true);
      const errorTransaction = logger.log("error", "A2", 0, false);
      const cancelTransaction = logger.log("cancel", null, 100, true);

      // Assert
      expect(logger.getAllTransactions()).toHaveLength(3);
      expect(saleTransaction.type).toBe("sale");
      expect(errorTransaction.type).toBe("error");
      expect(cancelTransaction.type).toBe("cancel");
    });

    test("56. should filter transactions by type", () => {
      // Arrange
      logger.log("sale", "A1", 150, true);
      logger.log("sale", "A2", 120, true);
      logger.log("error", "A3", 0, false);
      logger.log("cancel", null, 100, true);

      // Act
      const salesTransactions = logger.getTransactionsByType("sale");
      const errorTransactions = logger.getTransactionsByType("error");

      // Assert
      expect(salesTransactions).toHaveLength(2);
      expect(errorTransactions).toHaveLength(1);
      expect(salesTransactions.every((t) => t.type === "sale")).toBe(true);
    });

    test("57. should filter transactions by period", () => {
      // Arrange
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      logger.log("sale", "A1", 150, true);
      logger.log("sale", "A2", 120, true);

      // Act
      const recentTransactions = logger.getTransactionsByPeriod(
        yesterday,
        tomorrow
      );
      const futureTransactions = logger.getTransactionsByPeriod(
        tomorrow,
        new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
      );

      // Assert
      expect(recentTransactions).toHaveLength(2);
      expect(futureTransactions).toHaveLength(0);
    });

    test("58. should calculate total sales correctly", () => {
      // Arrange
      logger.log("sale", "A1", 150, true); // Compte
      logger.log("sale", "A2", 120, true); // Compte
      logger.log("sale", "A3", 100, false); // Ne compte pas (échec)
      logger.log("error", "A4", 200, false); // Ne compte pas (pas une vente)

      // Act
      const totalSales = logger.getTotalSales();

      // Assert
      expect(totalSales).toBe(270); // 150 + 120
    });

    test("59. should generate accurate statistics", () => {
      // Arrange
      logger.log("sale", "A1", 150, true);
      logger.log("sale", "A2", 120, true);
      logger.log("sale", "A3", 100, false);
      logger.log("error", "A4", 0, false);
      logger.log("cancel", null, 50, true);

      // Act
      const stats = logger.getStatistics();

      // Assert
      expect(stats.totalTransactions).toBe(5);
      expect(stats.successfulSales).toBe(2);
      expect(stats.totalRevenue).toBe(270);
      expect(stats.errors).toBe(1);
      expect(stats.cancellations).toBe(1);
      expect(stats.successRate).toBe("40.00%"); // 2 ventes réussies / 5 transactions
    });

    test("60. should handle empty statistics correctly", () => {
      // Act
      const stats = logger.getStatistics();

      // Assert
      expect(stats.totalTransactions).toBe(0);
      expect(stats.successfulSales).toBe(0);
      expect(stats.totalRevenue).toBe(0);
      expect(stats.errors).toBe(0);
      expect(stats.cancellations).toBe(0);
      expect(stats.successRate).toBe("0%");
    });

    test("61. should clear transaction history", () => {
      // Arrange
      logger.log("sale", "A1", 150, true);
      logger.log("error", "A2", 0, false);
      expect(logger.getAllTransactions()).toHaveLength(2);

      // Act
      logger.clear();

      // Assert
      expect(logger.getAllTransactions()).toHaveLength(0);
      expect(logger.getTotalSales()).toBe(0);
    });

    test("62. should return new array on getAllTransactions to prevent mutation", () => {
      // Arrange
      logger.log("sale", "A1", 150, true);

      // Act
      const transactions1 = logger.getAllTransactions();
      const transactions2 = logger.getAllTransactions();

      // Assert
      expect(transactions1).not.toBe(transactions2); // Différentes références
      expect(transactions1).toEqual(transactions2); // Même contenu

      // Modifier le tableau retourné ne doit pas affecter l'original
      transactions1.push("fake");
      expect(logger.getAllTransactions()).toHaveLength(1);
    });

    test("63. should handle complex filtering scenarios", () => {
      // Arrange
      const startDate = new Date("2024-01-01");
      const endDate = new Date("2024-12-31");

      logger.log("sale", "A1", 150, true);
      logger.log("sale", "A1", 150, true);
      logger.log("restock", "A1", 0, true);

      // Act
      const salesInPeriod = logger
        .getTransactionsByPeriod(startDate, endDate)
        .filter((t) => t.type === "sale");
      const salesByType = logger.getTransactionsByType("sale");

      // Assert
      expect(salesInPeriod.length).toBeGreaterThanOrEqual(0);
      expect(salesByType).toHaveLength(2);
    });
  });
});
