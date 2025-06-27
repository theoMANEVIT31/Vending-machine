const Inventory = require("../src/Inventory");
const Product = require("../src/Product");

describe("Inventory - Suite complète", () => {
  let inventory;
  let product1, product2, product3;

  beforeEach(() => {
    inventory = new Inventory();
    product1 = new Product("A1", "Coca-Cola", 150, 10);
    product2 = new Product("A2", "Pepsi", 150, 5);
    product3 = new Product("B1", "Chips", 120, 0);
  });

  test("41. should start with empty inventory", () => {
    // Act & Assert
    expect(inventory.getAllProducts()).toHaveLength(0);
    expect(inventory.getAvailableProducts()).toHaveLength(0);
  });

  test("42. should add products to inventory", () => {
    // Act
    inventory.addProduct(product1);
    inventory.addProduct(product2);

    // Assert
    expect(inventory.getAllProducts()).toHaveLength(2);
    expect(inventory.getProduct("A1")).toBe(product1);
    expect(inventory.getProduct("A2")).toBe(product2);
  });

  test("43. should return null for non-existent product", () => {
    // Act & Assert
    expect(inventory.getProduct("Z9")).toBeNull();
  });

  test("44. should filter available products correctly", () => {
    // Arrange
    inventory.addProduct(product1); // En stock
    inventory.addProduct(product2); // En stock
    inventory.addProduct(product3); // Pas en stock

    // Act
    const availableProducts = inventory.getAvailableProducts();

    // Assert
    expect(availableProducts).toHaveLength(2);
    expect(availableProducts).toContain(product1);
    expect(availableProducts).toContain(product2);
    expect(availableProducts).not.toContain(product3);
  });

  test("45. should check product availability correctly", () => {
    // Arrange
    inventory.addProduct(product1);
    inventory.addProduct(product3);

    // Act & Assert
    expect(inventory.isProductAvailable("A1")).toBe(true);
    expect(inventory.isProductAvailable("B1")).toBe(false);
    expect(inventory.isProductAvailable("Z9")).toBe(false);
  });

  test("46. should dispense product successfully", () => {
    // Arrange
    inventory.addProduct(product1);
    const initialQuantity = product1.quantity;

    // Act
    inventory.dispenseProduct("A1");

    // Assert
    expect(product1.quantity).toBe(initialQuantity - 1);
  });

  test("47. should throw error when dispensing non-existent product", () => {
    // Act & Assert
    expect(() => inventory.dispenseProduct("Z9")).toThrow(
      "Produit Z9 non trouvé"
    );
  });

  test("48. should restock product successfully", () => {
    // Arrange
    inventory.addProduct(product1);
    const initialQuantity = product1.quantity;

    // Act
    inventory.restockProduct("A1", 5);

    // Assert
    expect(product1.quantity).toBe(initialQuantity + 5);
  });

  test("49. should throw error when restocking non-existent product", () => {
    // Act & Assert
    expect(() => inventory.restockProduct("Z9", 5)).toThrow(
      "Produit Z9 non trouvé"
    );
  });

  test("50. should handle multiple operations on same product", () => {
    // Arrange
    inventory.addProduct(product1);

    // Act & Assert
    expect(inventory.isProductAvailable("A1")).toBe(true);

    inventory.dispenseProduct("A1");
    expect(product1.quantity).toBe(9);

    inventory.restockProduct("A1", 15);
    expect(product1.quantity).toBe(24);

    expect(inventory.isProductAvailable("A1")).toBe(true);
  });
});
