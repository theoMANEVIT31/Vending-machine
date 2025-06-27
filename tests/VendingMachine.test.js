const VendingMachine = require("../src/VendingMachine");
const { Currency } = require("../src/CoinManager");

describe("VendingMachine", () => {
  let vendingMachine;

  beforeEach(() => {
    vendingMachine = new VendingMachine();
    vendingMachine.initialize();
  });

  describe("constructor", () => {
    test("should create vending machine with default currency", () => {
      const vm = new VendingMachine();
      expect(vm.coinManager.currency.code).toBe("EUR");
      expect(vm.insertedMoney).toBe(0);
      expect(vm.selectedProduct).toBeNull();
    });

    test("should create vending machine with custom currency", () => {
      const usd = new Currency("USD", "US Dollar", 1.1);
      const vm = new VendingMachine(usd);
      expect(vm.coinManager.currency.code).toBe("USD");
    });

    test("should have all required components", () => {
      expect(vendingMachine.inventory).toBeDefined();
      expect(vendingMachine.coinManager).toBeDefined();
      expect(vendingMachine.transactionLogger).toBeDefined();
    });
  });

  describe("initialize", () => {
    test("should add demo products", () => {
      const status = vendingMachine.getStatus();
      expect(status.availableProducts.length).toBeGreaterThan(0);

      // Check specific products
      const cokeProduct = vendingMachine.inventory.getProduct("A1");
      expect(cokeProduct).toBeDefined();
      expect(cokeProduct.name).toBe("Coca-Cola");
      expect(cokeProduct.price).toBe(150);
    });

    test("should add initial coins", () => {
      const totalMoney = vendingMachine.coinManager.getTotalMoney();
      expect(totalMoney).toBeGreaterThan(0);
    });

    test("should have working coin denominations", () => {
      const denominations = vendingMachine.coinManager.getDenominations();
      expect(denominations.get(100)).toBeGreaterThan(0);
      expect(denominations.get(200)).toBeGreaterThan(0);
    });
  });

  describe("selectProduct", () => {
    test("should select available product successfully", () => {
      const result = vendingMachine.selectProduct("A1");

      expect(result.success).toBe(true);
      expect(result.message).toContain("Coca-Cola");
      expect(result.product.id).toBe("A1");
      expect(result.product.name).toBe("Coca-Cola");
      expect(result.product.price).toBe(150);
      expect(vendingMachine.selectedProduct).toBeDefined();
    });

    test("should fail for non-existent product", () => {
      const result = vendingMachine.selectProduct("X1");

      expect(result.success).toBe(false);
      expect(result.message).toContain("non trouvé");
      expect(vendingMachine.selectedProduct).toBeNull();
    });

    test("should fail for out-of-stock product", () => {
      // Make product out of stock
      const product = vendingMachine.inventory.getProduct("A1");
      product.quantity = 0;

      const result = vendingMachine.selectProduct("A1");

      expect(result.success).toBe(false);
      expect(result.message).toContain("non disponible");
      expect(vendingMachine.selectedProduct).toBeNull();
    });

    test("should log errors for invalid selections", () => {
      vendingMachine.selectProduct("X1");

      const errors =
        vendingMachine.transactionLogger.getTransactionsByType("error");
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[errors.length - 1].productId).toBe("X1");
    });

    test("should update selected product", () => {
      vendingMachine.selectProduct("A1");
      expect(vendingMachine.selectedProduct.id).toBe("A1");

      vendingMachine.selectProduct("B1");
      expect(vendingMachine.selectedProduct.id).toBe("B1");
    });
  });

  describe("insertMoney", () => {
    test("should accept valid denomination", () => {
      const result = vendingMachine.insertMoney(100);

      expect(result.success).toBe(true);
      expect(result.message).toContain("inséré");
      expect(result.totalInserted).toBe(100);
      expect(vendingMachine.insertedMoney).toBe(100);
    });

    test("should reject invalid denomination", () => {
      const result = vendingMachine.insertMoney(75);

      expect(result.success).toBe(false);
      expect(result.message).toContain("non acceptée");
      expect(vendingMachine.insertedMoney).toBe(0);
    });

    test("should accumulate inserted money", () => {
      vendingMachine.insertMoney(100);
      vendingMachine.insertMoney(50);

      expect(vendingMachine.insertedMoney).toBe(150);
    });

    test("should add coins to machine inventory", () => {
      const initialCount = vendingMachine.coinManager
        .getDenominations()
        .get(100);
      vendingMachine.insertMoney(100);

      expect(vendingMachine.coinManager.getDenominations().get(100)).toBe(
        initialCount + 1
      );
    });

    test("should handle multiple insertions correctly", () => {
      vendingMachine.insertMoney(200); // 2€
      const result = vendingMachine.insertMoney(50); // 0.50€

      expect(result.totalInserted).toBe(250);
      expect(result.totalInsertedFormatted).toBe("2,50 EUR");
    });
  });

  describe("purchase", () => {
    beforeEach(() => {
      vendingMachine.selectProduct("A1"); // Coca-Cola, 1.50€
    });

    test("should fail when no product selected", () => {
      vendingMachine.selectedProduct = null;
      const result = vendingMachine.purchase();

      expect(result.success).toBe(false);
      expect(result.message).toContain("Aucun produit sélectionné");
    });

    test("should fail with insufficient money", () => {
      vendingMachine.insertMoney(100); // Only 1€, need 1.50€
      const result = vendingMachine.purchase();

      expect(result.success).toBe(false);
      expect(result.message).toContain("Montant insuffisant");
      expect(result.missingAmount).toBe(50);
    });

    test("should succeed with exact money", () => {
      vendingMachine.insertMoney(100); // 1€
      vendingMachine.insertMoney(50); // 0.50€

      const result = vendingMachine.purchase();

      expect(result.success).toBe(true);
      expect(result.message).toContain("distribué avec succès");
      expect(result.product.name).toBe("Coca-Cola");
      expect(result.change).toBe(0);
    });

    test("should succeed with change", () => {
      vendingMachine.insertMoney(200); // 2€

      const result = vendingMachine.purchase();

      expect(result.success).toBe(true);
      expect(result.change).toBe(50); // 0.50€ change
      expect(result.changeCoins.length).toBeGreaterThan(0);
    });

    test("should reduce product inventory", () => {
      const initialQuantity =
        vendingMachine.inventory.getProduct("A1").quantity;

      vendingMachine.insertMoney(200);
      vendingMachine.purchase();

      expect(vendingMachine.inventory.getProduct("A1").quantity).toBe(
        initialQuantity - 1
      );
    });

    test("should reset state after purchase", () => {
      vendingMachine.insertMoney(200);
      vendingMachine.purchase();

      expect(vendingMachine.insertedMoney).toBe(0);
      expect(vendingMachine.selectedProduct).toBeNull();
    });

    test("should log successful transaction", () => {
      vendingMachine.insertMoney(200);
      vendingMachine.purchase();

      const sales =
        vendingMachine.transactionLogger.getTransactionsByType("sale");
      const lastSale = sales[sales.length - 1];

      expect(lastSale.success).toBe(true);
      expect(lastSale.productId).toBe("A1");
      expect(lastSale.amount).toBe(150);
    });

    test("should fail when unable to make change", () => {
      // Empty the coin manager to simulate no change available
      const emptyVendingMachine = new VendingMachine();
      emptyVendingMachine.inventory.addProduct(
        vendingMachine.inventory.getProduct("A1")
      );
      emptyVendingMachine.selectProduct("A1");
      emptyVendingMachine.insertMoney(200); // Need 0.50€ change but no coins

      const result = emptyVendingMachine.purchase();

      expect(result.success).toBe(false);
      expect(result.message).toContain(
        "Impossible de rendre la monnaie exacte"
      );
    });

    test("should handle product becoming unavailable during purchase", () => {
      vendingMachine.insertMoney(200);

      // Simulate product becoming unavailable
      vendingMachine.inventory.getProduct("A1").quantity = 0;

      const result = vendingMachine.purchase();

      expect(result.success).toBe(false);
      expect(result.message).toContain("non disponible");
    });
  });

  describe("cancel", () => {
    test("should fail when no money inserted", () => {
      const result = vendingMachine.cancel();

      expect(result.success).toBe(false);
      expect(result.message).toContain("Aucun argent inséré");
    });

    test("should return inserted money", () => {
      vendingMachine.insertMoney(200);
      vendingMachine.insertMoney(100);

      const result = vendingMachine.cancel();

      expect(result.success).toBe(true);
      expect(result.refund).toBe(300);
      expect(result.refundCoins.length).toBeGreaterThan(0);
    });

    test("should reset machine state", () => {
      vendingMachine.selectProduct("A1");
      vendingMachine.insertMoney(200);

      vendingMachine.cancel();

      expect(vendingMachine.insertedMoney).toBe(0);
      expect(vendingMachine.selectedProduct).toBeNull();
    });

    test("should log cancellation", () => {
      vendingMachine.insertMoney(100);
      vendingMachine.cancel();

      const cancellations =
        vendingMachine.transactionLogger.getTransactionsByType("cancel");
      expect(cancellations.length).toBe(1);
      expect(cancellations[0].amount).toBe(100);
    });

    test("should fail when unable to dispense refund", () => {
      // This is a rare edge case where the machine can't return the exact money
      const emptyVendingMachine = new VendingMachine();
      // Force insert money without adding to coin manager
      emptyVendingMachine.insertedMoney = 37; // Odd amount that can't be made

      const result = emptyVendingMachine.cancel();

      expect(result.success).toBe(false);
      expect(result.message).toContain("Erreur lors du remboursement");
    });
  });

  describe("getStatus", () => {
    test("should return current machine state", () => {
      vendingMachine.selectProduct("A1");
      vendingMachine.insertMoney(100);

      const status = vendingMachine.getStatus();

      expect(status.insertedMoney).toBe(100);
      expect(status.selectedProduct.id).toBe("A1");
      expect(status.availableProducts.length).toBeGreaterThan(0);
      expect(status.totalMoney).toBeGreaterThan(0);
    });

    test("should handle empty state", () => {
      const status = vendingMachine.getStatus();

      expect(status.insertedMoney).toBe(0);
      expect(status.selectedProduct).toBeNull();
    });

    test("should format amounts correctly", () => {
      vendingMachine.insertMoney(100); // 1€
      vendingMachine.insertMoney(50); // 0.50€

      const status = vendingMachine.getStatus();

      expect(status.insertedMoneyFormatted).toBe("1,50 EUR");
      expect(status.totalMoneyFormatted).toContain("EUR");
    });
  });

  describe("restockProduct", () => {
    test("should restock existing product", () => {
      const result = vendingMachine.restockProduct("A1", 5);

      expect(result.success).toBe(true);
      expect(result.message).toContain("réapprovisionné");

      const product = vendingMachine.inventory.getProduct("A1");
      expect(product.quantity).toBe(15); // Initial 10 + 5
    });

    test("should fail for non-existent product", () => {
      const result = vendingMachine.restockProduct("X1", 5);

      expect(result.success).toBe(false);
      expect(result.message).toContain("non trouvé");
    });

    test("should log restock transaction", () => {
      vendingMachine.restockProduct("A1", 10);

      const restocks =
        vendingMachine.transactionLogger.getTransactionsByType("restock");
      expect(restocks.length).toBe(1);
      expect(restocks[0].productId).toBe("A1");
    });
  });

  describe("addCoins", () => {
    test("should add valid denomination", () => {
      const result = vendingMachine.addCoins(100, 10);

      expect(result.success).toBe(true);
      expect(result.message).toContain("ajoutées");
    });

    test("should fail for invalid denomination", () => {
      const result = vendingMachine.addCoins(75, 5);

      expect(result.success).toBe(false);
      expect(result.message).toContain("non supportée");
    });
  });

  describe("getStatistics", () => {
    test("should return transaction statistics", () => {
      // Perform some transactions
      vendingMachine.selectProduct("A1");
      vendingMachine.insertMoney(200);
      vendingMachine.purchase();

      vendingMachine.selectProduct("X1"); // This will generate an error

      const stats = vendingMachine.getStatistics();

      expect(stats.totalTransactions).toBeGreaterThan(0);
      expect(stats.successfulSales).toBe(1);
      expect(stats.totalRevenue).toBe(150);
      expect(stats.errors).toBeGreaterThan(0);
    });
  });

  describe("integration scenarios", () => {
    test("should handle complete purchase cycle", () => {
      // Check initial state
      const initialStatus = vendingMachine.getStatus();
      expect(initialStatus.insertedMoney).toBe(0);
      expect(initialStatus.selectedProduct).toBeNull();

      // Select product
      const selectResult = vendingMachine.selectProduct("A1");
      expect(selectResult.success).toBe(true);

      // Insert money
      const insertResult = vendingMachine.insertMoney(200);
      expect(insertResult.success).toBe(true);

      // Check status before purchase
      const beforePurchase = vendingMachine.getStatus();
      expect(beforePurchase.insertedMoney).toBe(200);
      expect(beforePurchase.selectedProduct.id).toBe("A1");

      // Purchase
      const purchaseResult = vendingMachine.purchase();
      expect(purchaseResult.success).toBe(true);
      expect(purchaseResult.change).toBe(50);

      // Check final state
      const finalStatus = vendingMachine.getStatus();
      expect(finalStatus.insertedMoney).toBe(0);
      expect(finalStatus.selectedProduct).toBeNull();

      // Verify transaction logged
      const stats = vendingMachine.getStatistics();
      expect(stats.successfulSales).toBe(1);
      expect(stats.totalRevenue).toBe(150);
    });

    test("should handle insufficient funds scenario", () => {
      vendingMachine.selectProduct("A1"); // 1.50€
      vendingMachine.insertMoney(100); // 1.00€

      const purchaseResult = vendingMachine.purchase();
      expect(purchaseResult.success).toBe(false);

      // Money should still be inserted
      expect(vendingMachine.insertedMoney).toBe(100);

      // Add more money and try again
      vendingMachine.insertMoney(100); // Total 2.00€
      const secondAttempt = vendingMachine.purchase();
      expect(secondAttempt.success).toBe(true);
      expect(secondAttempt.change).toBe(50);
    });

    test("should handle cancellation scenario", () => {
      vendingMachine.selectProduct("A1");
      vendingMachine.insertMoney(200);
      vendingMachine.insertMoney(100);

      const cancelResult = vendingMachine.cancel();
      expect(cancelResult.success).toBe(true);
      expect(cancelResult.refund).toBe(300);

      // State should be reset
      expect(vendingMachine.insertedMoney).toBe(0);
      expect(vendingMachine.selectedProduct).toBeNull();

      // Should be able to start new transaction
      const newSelect = vendingMachine.selectProduct("B1");
      expect(newSelect.success).toBe(true);
    });

    test("should handle out of stock scenario", () => {
      // Buy all Coca-Cola
      const cokeProduct = vendingMachine.inventory.getProduct("A1");
      const initialQuantity = cokeProduct.quantity;

      for (let i = 0; i < initialQuantity; i++) {
        vendingMachine.selectProduct("A1");
        vendingMachine.insertMoney(200);
        vendingMachine.purchase();
      }

      // Try to buy one more
      const finalAttempt = vendingMachine.selectProduct("A1");
      expect(finalAttempt.success).toBe(false);
      expect(finalAttempt.message).toContain("non disponible");
    });

    test("should handle multiple currencies", () => {
      const usd = new Currency("USD", "US Dollar", 1.1);
      const usdMachine = new VendingMachine(usd);
      usdMachine.initialize();

      expect(usdMachine.coinManager.currency.code).toBe("USD");

      const status = usdMachine.getStatus();
      expect(status.insertedMoneyFormatted).toContain("USD");
    });

    test("should maintain consistency over many transactions", () => {
      const initialMoney = vendingMachine.coinManager.getTotalMoney();
      let expectedRevenue = 0;

      // Perform 10 purchases
      for (let i = 0; i < 10; i++) {
        vendingMachine.selectProduct("A1");
        vendingMachine.insertMoney(200);
        const result = vendingMachine.purchase();

        if (result.success) {
          expectedRevenue += 150;
        }
      }

      const stats = vendingMachine.getStatistics();
      expect(stats.totalRevenue).toBe(expectedRevenue);

      // Total money should increase by revenue (customer payments minus change)
      const finalMoney = vendingMachine.coinManager.getTotalMoney();
      expect(finalMoney).toBe(initialMoney + expectedRevenue);
    });
  });
});
