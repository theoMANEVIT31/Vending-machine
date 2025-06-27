const Product = require("../src/Product");

describe("Product", () => {
  let product;

  beforeEach(() => {
    product = new Product("A1", "Coca-Cola", 150, 10);
  });

  describe("constructor", () => {
    test("should create a product with correct properties", () => {
      expect(product.id).toBe("A1");
      expect(product.name).toBe("Coca-Cola");
      expect(product.price).toBe(150);
      expect(product.quantity).toBe(10);
    });

    test("should create a product with default quantity of 0", () => {
      const newProduct = new Product("B1", "Chips", 120);
      expect(newProduct.quantity).toBe(0);
    });
  });

  describe("isAvailable", () => {
    test("should return true when quantity > 0", () => {
      expect(product.isAvailable()).toBe(true);
    });

    test("should return false when quantity = 0", () => {
      product.quantity = 0;
      expect(product.isAvailable()).toBe(false);
    });

    test("should return false when quantity < 0", () => {
      product.quantity = -1;
      expect(product.isAvailable()).toBe(false);
    });
  });

  describe("dispense", () => {
    test("should reduce quantity by 1 when available", () => {
      const initialQuantity = product.quantity;
      product.dispense();
      expect(product.quantity).toBe(initialQuantity - 1);
    });

    test("should throw error when product not available", () => {
      product.quantity = 0;
      expect(() => product.dispense()).toThrow(
        "Produit Coca-Cola non disponible"
      );
    });

    test("should handle multiple dispenses", () => {
      product.dispense();
      product.dispense();
      expect(product.quantity).toBe(8);
    });

    test("should not allow dispensing when quantity becomes 0", () => {
      product.quantity = 1;
      product.dispense();
      expect(() => product.dispense()).toThrow(
        "Produit Coca-Cola non disponible"
      );
    });
  });

  describe("restock", () => {
    test("should increase quantity by specified amount", () => {
      const initialQuantity = product.quantity;
      product.restock(5);
      expect(product.quantity).toBe(initialQuantity + 5);
    });

    test("should handle restocking when quantity is 0", () => {
      product.quantity = 0;
      product.restock(3);
      expect(product.quantity).toBe(3);
    });

    test("should throw error for negative amount", () => {
      expect(() => product.restock(-1)).toThrow(
        "La quantité doit être positive"
      );
    });

    test("should handle restocking with 0 amount", () => {
      const initialQuantity = product.quantity;
      product.restock(0);
      expect(product.quantity).toBe(initialQuantity);
    });

    test("should handle large restock amounts", () => {
      product.restock(1000);
      expect(product.quantity).toBe(1010);
    });
  });

  describe("edge cases", () => {
    test("should handle product with very high price", () => {
      const expensiveProduct = new Product("LUXURY", "Luxury Item", 999999, 1);
      expect(expensiveProduct.price).toBe(999999);
      expect(expensiveProduct.isAvailable()).toBe(true);
    });

    test("should handle product with price 0", () => {
      const freeProduct = new Product("FREE", "Free Sample", 0, 5);
      expect(freeProduct.price).toBe(0);
      expect(freeProduct.isAvailable()).toBe(true);
    });

    test("should handle empty product name", () => {
      const product = new Product("TEST", "", 100, 1);
      expect(product.name).toBe("");
    });
  });
});
