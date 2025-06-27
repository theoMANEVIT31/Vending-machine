const VendingMachine = require("../src/VendingMachine");

describe("VendingMachine - Suite complète", () => {
  let vendingMachine;

  beforeEach(() => {
    vendingMachine = new VendingMachine();
    vendingMachine.initialize();
  });

  test("21. should initialize with products and money", () => {
    // Arrange & Act
    const status = vendingMachine.getStatus();

    // Assert
    expect(status.availableProducts).toHaveLength(5);
    expect(status.totalMoney).toBeGreaterThan(0);
    expect(status.insertedMoney).toBe(0);
  });

  test("22. should select valid product successfully", () => {
    // Act
    const result = vendingMachine.selectProduct("A1");

    // Assert
    expect(result.success).toBe(true);
    expect(result.product.name).toBe("Coca-Cola");
    expect(result.product.price).toBe(150);
  });

  test("23. should fail to select non-existent product", () => {
    // Act
    const result = vendingMachine.selectProduct("Z9");

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain("non trouvé");
  });

  test("24. should fail to select out-of-stock product", () => {
    // Arrange - Vider le stock d'un produit
    const product = vendingMachine.inventory.getProduct("A1");
    product.quantity = 0;

    // Act
    const result = vendingMachine.selectProduct("A1");

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain("non disponible");
  });

  test("25. should insert valid money denomination", () => {
    // Act
    const result = vendingMachine.insertMoney(100);

    // Assert
    expect(result.success).toBe(true);
    expect(result.totalInserted).toBe(100);
  });

  test("26. should reject invalid money denomination", () => {
    // Act
    const result = vendingMachine.insertMoney(99);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain("non acceptée");
  });

  test("27. should fail purchase without product selection", () => {
    // Arrange
    vendingMachine.insertMoney(200);

    // Act
    const result = vendingMachine.purchase();

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe("Aucun produit sélectionné");
  });

  test("28. should fail purchase with insufficient money", () => {
    // Arrange
    vendingMachine.selectProduct("A1");
    vendingMachine.insertMoney(100); // Prix = 150

    // Act
    const result = vendingMachine.purchase();

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain("insuffisant");
  });

  test("29. should complete successful purchase with exact money", () => {
    // Arrange
    vendingMachine.selectProduct("A1");
    vendingMachine.insertMoney(100);
    vendingMachine.insertMoney(50);

    // Act
    const result = vendingMachine.purchase();

    // Assert
    expect(result.success).toBe(true);
    expect(result.product.name).toBe("Coca-Cola");
    expect(result.change).toBe(0);
  });

  test("30. should complete successful purchase with change", () => {
    // Arrange
    vendingMachine.selectProduct("A1");
    vendingMachine.insertMoney(200);

    // Act
    const result = vendingMachine.purchase();

    // Assert
    expect(result.success).toBe(true);
    expect(result.change).toBe(50);
    expect(result.changeCoins).toHaveLength(1);
  });

  test("31. should cancel transaction and return money", () => {
    // Arrange
    vendingMachine.insertMoney(100);
    vendingMachine.insertMoney(50);

    // Act
    const result = vendingMachine.cancel();

    // Assert
    expect(result.success).toBe(true);
    expect(result.refund).toBe(150);
  });

  test("32. should fail to cancel without inserted money", () => {
    // Act
    const result = vendingMachine.cancel();

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe("Aucun argent inséré");
  });

  test("33. should format change coins correctly", () => {
    // Arrange
    const coins = new Map([
      [200, 1],
      [50, 2],
      [10, 1],
    ]);

    // Act
    const formatted = vendingMachine.formatChangeCoins(coins);

    // Assert
    expect(formatted).toHaveLength(3);
    expect(formatted[0].value).toBe(200); // Trié par ordre décroissant
    expect(formatted[1].value).toBe(50);
    expect(formatted[2].value).toBe(10);
  });

  test("34. should handle purchase failure due to dispensing error", () => {
    // Arrange
    vendingMachine.selectProduct("A1");
    vendingMachine.insertMoney(200);

    // Mock une erreur de distribution
    const originalDispense = vendingMachine.inventory.dispenseProduct;
    vendingMachine.inventory.dispenseProduct = jest.fn(() => {
      throw new Error("Erreur mécanique");
    });

    // Act
    const result = vendingMachine.purchase();

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe("Erreur mécanique");

    // Restaurer
    vendingMachine.inventory.dispenseProduct = originalDispense;
  });

  test("35. should handle cancel failure due to change dispensing error", () => {
    // Arrange
    vendingMachine.insertMoney(100);

    // Mock une erreur de rendu de monnaie
    const originalDispenseChange = vendingMachine.coinManager.dispenseChange;
    vendingMachine.coinManager.dispenseChange = jest.fn(() => {
      throw new Error("Erreur distributeur monnaie");
    });

    // Act
    const result = vendingMachine.cancel();

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain("Erreur lors du remboursement");

    // Restaurer
    vendingMachine.coinManager.dispenseChange = originalDispenseChange;
  });

  test("36. should fail purchase when cannot make change", () => {
    // Arrange
    vendingMachine.selectProduct("A1"); // 150 centimes
    vendingMachine.insertMoney(200); // 200 centimes

    // Vider la machine de petite monnaie pour simuler l'impossibilité de rendre 50 centimes
    vendingMachine.coinManager.denominations.set(50, 0);
    vendingMachine.coinManager.denominations.set(20, 0);
    vendingMachine.coinManager.denominations.set(10, 0);
    vendingMachine.coinManager.denominations.set(5, 0);
    vendingMachine.coinManager.denominations.set(2, 0);
    vendingMachine.coinManager.denominations.set(1, 0);

    // Act
    const result = vendingMachine.purchase();

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toBe("Impossible de rendre la monnaie exacte");
  });

  test("37. should reset state after successful purchase", () => {
    // Arrange
    vendingMachine.selectProduct("A1");
    vendingMachine.insertMoney(200);

    // Act
    vendingMachine.purchase();
    const status = vendingMachine.getStatus();

    // Assert
    expect(status.insertedMoney).toBe(0);
    expect(status.selectedProduct).toBeNull();
  });

  test("38. should reset state after successful cancel", () => {
    // Arrange
    vendingMachine.selectProduct("A1");
    vendingMachine.insertMoney(100);

    // Act
    vendingMachine.cancel();
    const status = vendingMachine.getStatus();

    // Assert
    expect(status.insertedMoney).toBe(0);
    expect(status.selectedProduct).toBeNull();
  });

  test("39. should accumulate inserted money correctly", () => {
    // Act
    vendingMachine.insertMoney(50);
    vendingMachine.insertMoney(100);
    vendingMachine.insertMoney(20);

    const status = vendingMachine.getStatus();

    // Assert
    expect(status.insertedMoney).toBe(170);
  });

  test("40. should maintain product inventory correctly after purchase", () => {
    // Arrange
    const initialQuantity = vendingMachine.inventory.getProduct("A1").quantity;
    vendingMachine.selectProduct("A1");
    vendingMachine.insertMoney(200);

    // Act
    vendingMachine.purchase();

    // Assert
    const finalQuantity = vendingMachine.inventory.getProduct("A1").quantity;
    expect(finalQuantity).toBe(initialQuantity - 1);
  });
});
