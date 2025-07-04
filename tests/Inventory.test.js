const Inventory = require("../src/Inventory");
const Product = require("../src/Product");
describe("Inventory - Tests Clean", () => {
  test("should add product to inventory", () => {
    const inventory = new Inventory();
    const product = new Product("A1", "Coca Cola", 150, 10);
    inventory.addProduct(product);
    expect(inventory.getProduct("A1")).toBe(product);
  });
  test("should return null for non-existent product", () => {
    const inventory = new Inventory();
    const nonExistentId = "Z9";
    const result = inventory.getProduct(nonExistentId);
    expect(result).toBeNull();
  });
  test("should return all products", () => {
    const inventory = new Inventory();
    const product1 = new Product("A1", "Coca Cola", 150, 10);
    const product2 = new Product("A2", "Pepsi", 140, 5);
    inventory.addProduct(product1);
    inventory.addProduct(product2);
    const result = inventory.getAllProducts();
    expect(result).toHaveLength(2);
    expect(result).toContain(product1);
    expect(result).toContain(product2);
  });
  test("should return only available products", () => {
    const inventory = new Inventory();
    const availableProduct = new Product("A1", "Coca Cola", 150, 10);
    const unavailableProduct = new Product("A2", "Pepsi", 140, 0);
    inventory.addProduct(availableProduct);
    inventory.addProduct(unavailableProduct);
    const result = inventory.getAvailableProducts();
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(availableProduct);
  });
  test("should return true for available product by ID", () => {
    const inventory = new Inventory();
    const product = new Product("A1", "Coca Cola", 150, 5);
    inventory.addProduct(product);
    const result = inventory.isProductAvailable("A1");
    expect(result).toBe(true);
  });
});
