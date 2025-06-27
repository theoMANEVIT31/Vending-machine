const Inventory = require("../src/Inventory");
const Product = require("../src/Product");

describe("Inventory", () => {
  let inventory;
  let product1, product2, product3;

  beforeEach(() => {
    inventory = new Inventory();
    product1 = new Product("A1", "Coca-Cola", 150, 10);
    product2 = new Product("A2", "Pepsi", 150, 0);
    product3 = new Product("B1", "Chips", 120, 5);
  });

  describe("constructor", () => {
    test("should create empty inventory", () => {
      expect(inventory.products.size).toBe(0);
      expect(inventory.getAllProducts()).toEqual([]);
    });
  });

  describe("addProduct", () => {
    test("should add product to inventory", () => {
      inventory.addProduct(product1);
      expect(inventory.products.size).toBe(1);
      expect(inventory.getProduct("A1")).toBe(product1);
    });

    test("should replace existing product with same ID", () => {
      inventory.addProduct(product1);
      const newProduct = new Product("A1", "New Coca-Cola", 200, 15);
      inventory.addProduct(newProduct);

      expect(inventory.products.size).toBe(1);
      expect(inventory.getProduct("A1")).toBe(newProduct);
      expect(inventory.getProduct("A1").name).toBe("New Coca-Cola");
    });

    test("should handle multiple products", () => {
      inventory.addProduct(product1);
      inventory.addProduct(product2);
      inventory.addProduct(product3);

      expect(inventory.products.size).toBe(3);
    });
  });

  describe("getProduct", () => {
    beforeEach(() => {
      inventory.addProduct(product1);
      inventory.addProduct(product2);
    });

    test("should return correct product for valid ID", () => {
      expect(inventory.getProduct("A1")).toBe(product1);
      expect(inventory.getProduct("A2")).toBe(product2);
    });

    test("should return null for non-existent ID", () => {
      expect(inventory.getProduct("X1")).toBeNull();
      expect(inventory.getProduct("")).toBeNull();
      expect(inventory.getProduct("a1")).toBeNull(); // Case sensitive
    });
  });

  describe("getAvailableProducts", () => {
    beforeEach(() => {
      inventory.addProduct(product1); // quantity: 10
      inventory.addProduct(product2); // quantity: 0
      inventory.addProduct(product3); // quantity: 5
    });

    test("should return only products with quantity > 0", () => {
      const available = inventory.getAvailableProducts();
      expect(available).toHaveLength(2);
      expect(available).toContain(product1);
      expect(available).toContain(product3);
      expect(available).not.toContain(product2);
    });

    test("should return empty array when no products available", () => {
      const emptyInventory = new Inventory();
      expect(emptyInventory.getAvailableProducts()).toEqual([]);
    });

    test("should update when product quantity changes", () => {
      expect(inventory.getAvailableProducts()).toHaveLength(2);

      product1.quantity = 0;
      expect(inventory.getAvailableProducts()).toHaveLength(1);

      product2.quantity = 3;
      expect(inventory.getAvailableProducts()).toHaveLength(2);
    });
  });

  describe("getAllProducts", () => {
    test("should return empty array for empty inventory", () => {
      expect(inventory.getAllProducts()).toEqual([]);
    });

    test("should return all products regardless of availability", () => {
      inventory.addProduct(product1);
      inventory.addProduct(product2);
      inventory.addProduct(product3);

      const allProducts = inventory.getAllProducts();
      expect(allProducts).toHaveLength(3);
      expect(allProducts).toContain(product1);
      expect(allProducts).toContain(product2);
      expect(allProducts).toContain(product3);
    });
  });

  describe("isProductAvailable", () => {
    beforeEach(() => {
      inventory.addProduct(product1); // quantity: 10
      inventory.addProduct(product2); // quantity: 0
    });

    test("should return true for available product", () => {
      expect(inventory.isProductAvailable("A1")).toBe(true);
    });

    test("should return false for unavailable product", () => {
      expect(inventory.isProductAvailable("A2")).toBe(false);
    });

    test("should return false for non-existent product", () => {
      expect(inventory.isProductAvailable("X1")).toBe(false);
    });
  });

  describe("dispenseProduct", () => {
    beforeEach(() => {
      inventory.addProduct(product1); // quantity: 10
      inventory.addProduct(product2); // quantity: 0
    });

    test("should dispense available product successfully", () => {
      const initialQuantity = product1.quantity;
      inventory.dispenseProduct("A1");
      expect(product1.quantity).toBe(initialQuantity - 1);
    });

    test("should throw error for non-existent product", () => {
      expect(() => inventory.dispenseProduct("X1")).toThrow(
        "Produit X1 non trouvé"
      );
    });

    test("should throw error for unavailable product", () => {
      expect(() => inventory.dispenseProduct("A2")).toThrow(
        "Produit Pepsi non disponible"
      );
    });

    test("should handle multiple dispenses until out of stock", () => {
      const singleItemProduct = new Product("SINGLE", "Single Item", 100, 1);
      inventory.addProduct(singleItemProduct);

      inventory.dispenseProduct("SINGLE");
      expect(() => inventory.dispenseProduct("SINGLE")).toThrow(
        "Produit Single Item non disponible"
      );
    });
  });

  describe("restockProduct", () => {
    beforeEach(() => {
      inventory.addProduct(product1);
      inventory.addProduct(product2);
    });

    test("should restock existing product successfully", () => {
      const initialQuantity = product1.quantity;
      inventory.restockProduct("A1", 5);
      expect(product1.quantity).toBe(initialQuantity + 5);
    });

    test("should restock out-of-stock product", () => {
      inventory.restockProduct("A2", 10);
      expect(product2.quantity).toBe(10);
      expect(inventory.isProductAvailable("A2")).toBe(true);
    });

    test("should throw error for non-existent product", () => {
      expect(() => inventory.restockProduct("X1", 5)).toThrow(
        "Produit X1 non trouvé"
      );
    });

    test("should throw error for negative quantity", () => {
      expect(() => inventory.restockProduct("A1", -1)).toThrow(
        "La quantité doit être positive"
      );
    });

    test("should handle zero quantity restock", () => {
      const initialQuantity = product1.quantity;
      inventory.restockProduct("A1", 0);
      expect(product1.quantity).toBe(initialQuantity);
    });
  });

  describe("integration scenarios", () => {
    test("should handle complete product lifecycle", () => {
      // Add product
      inventory.addProduct(product1);
      expect(inventory.isProductAvailable("A1")).toBe(true);

      // Dispense all products
      for (let i = 0; i < 10; i++) {
        inventory.dispenseProduct("A1");
      }
      expect(inventory.isProductAvailable("A1")).toBe(false);

      // Restock
      inventory.restockProduct("A1", 5);
      expect(inventory.isProductAvailable("A1")).toBe(true);
      expect(inventory.getProduct("A1").quantity).toBe(5);
    });

    test("should handle mixed operations", () => {
      inventory.addProduct(product1);
      inventory.addProduct(product2);
      inventory.addProduct(product3);

      // Initial state
      expect(inventory.getAvailableProducts()).toHaveLength(2);

      // Dispense and restock
      inventory.dispenseProduct("A1");
      inventory.restockProduct("A2", 3);

      expect(inventory.getAvailableProducts()).toHaveLength(3);
      expect(inventory.getProduct("A1").quantity).toBe(9);
      expect(inventory.getProduct("A2").quantity).toBe(3);
    });
  });
});
