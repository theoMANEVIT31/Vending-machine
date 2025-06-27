const Product = require("../src/Product");

describe("Product - Suite complète", () => {
  test("1. should create product with valid parameters", () => {
    // Arrange & Act
    const product = new Product("A1", "Coca-Cola", 150, 10);

    // Assert
    expect(product.id).toBe("A1");
    expect(product.name).toBe("Coca-Cola");
    expect(product.price).toBe(150);
    expect(product.quantity).toBe(10);
  });

  test("2. should create product with default quantity", () => {
    // Arrange & Act
    const product = new Product("A2", "Pepsi", 150);

    // Assert
    expect(product.quantity).toBe(0);
    expect(product.isAvailable()).toBe(false);
  });

  test("3. should check availability correctly when in stock", () => {
    // Arrange
    const product = new Product("A1", "Coca-Cola", 150, 5);

    // Act & Assert
    expect(product.isAvailable()).toBe(true);
  });

  test("4. should check availability correctly when out of stock", () => {
    // Arrange
    const product = new Product("A1", "Coca-Cola", 150, 0);

    // Act & Assert
    expect(product.isAvailable()).toBe(false);
  });

  test("5. should dispense product successfully when available", () => {
    // Arrange
    const product = new Product("A1", "Coca-Cola", 150, 2);

    // Act
    product.dispense();

    // Assert
    expect(product.quantity).toBe(1);
    expect(product.isAvailable()).toBe(true);
  });

  test("6. should throw error when dispensing unavailable product", () => {
    // Arrange
    const product = new Product("A1", "Coca-Cola", 150, 0);

    // Act & Assert
    expect(() => product.dispense()).toThrow(
      "Produit Coca-Cola non disponible"
    );
  });

  test("7. should restock with positive amount", () => {
    // Arrange
    const product = new Product("A1", "Coca-Cola", 150, 5);

    // Act
    product.restock(10);

    // Assert
    expect(product.quantity).toBe(15);
  });

  test("8. should throw error when restocking with negative amount", () => {
    // Arrange
    const product = new Product("A1", "Coca-Cola", 150, 5);

    // Act & Assert
    expect(() => product.restock(-5)).toThrow("La quantité doit être positive");
  });

  test("9. should handle multiple dispenses until empty", () => {
    // Arrange
    const product = new Product("A1", "Coca-Cola", 150, 2);

    // Act & Assert
    product.dispense();
    expect(product.quantity).toBe(1);

    product.dispense();
    expect(product.quantity).toBe(0);
    expect(product.isAvailable()).toBe(false);

    expect(() => product.dispense()).toThrow();
  });

  test("10. should handle zero restock amount", () => {
    // Arrange
    const product = new Product("A1", "Coca-Cola", 150, 5);
    const initialQuantity = product.quantity;

    // Act
    product.restock(0);

    // Assert
    expect(product.quantity).toBe(initialQuantity);
  });
});
