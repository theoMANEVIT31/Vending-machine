const Product = require("../src/Product");
describe("Product - Tests Clean", () => {
  test("should create product with valid parameters", () => {
    const id = "P001";
    const name = "Coca Cola";
    const price = 150;
    const product = new Product(id, name, price);
    expect(product.id).toBe("P001");
    expect(product.name).toBe("Coca Cola");
    expect(product.price).toBe(150);
  });
  test("should return true when product is available", () => {
    const product = new Product("A1", "Coca-Cola", 150, 5);
    const result = product.isAvailable();
    expect(result).toBe(true);
  });
  test("should return false when product is out of stock", () => {
    const product = new Product("A2", "Pepsi", 150, 0);
    const result = product.isAvailable();
    expect(result).toBe(false);
  });
  test("should decrease quantity when dispensing available product", () => {
    const product = new Product("A1", "Coca-Cola", 150, 2);
    const initialQuantity = product.quantity;
    product.dispense();
    expect(product.quantity).toBe(initialQuantity - 1);
  });
  test("should throw error when dispensing unavailable product", () => {
    const product = new Product("A1", "Coca-Cola", 150, 0);
    expect(() => product.dispense()).toThrow("Produit Coca-Cola non disponible");
  });
  test("should increase quantity when restocking", () => {
    const product = new Product("A1", "Coca-Cola", 150, 5);
    const addedQuantity = 10;
    const expectedQuantity = product.quantity + addedQuantity;
    product.restock(addedQuantity);
    expect(product.quantity).toBe(expectedQuantity);
  });
});
