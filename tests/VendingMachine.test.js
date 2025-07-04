const VendingMachine = require("../src/VendingMachine");
const Product = require("../src/Product");
describe("VendingMachine - Tests Clean", () => {
  test("should initialize with products and money", () => {
    const vendingMachine = new VendingMachine();
    vendingMachine.initialize();
    expect(vendingMachine.inventory.getAllProducts().length).toBeGreaterThan(0);
    expect(vendingMachine.coinManager.getTotalMoney()).toBeGreaterThan(0);
  });
  test("should select existing product successfully", () => {
    const vendingMachine = new VendingMachine();
    const product = new Product("A1", "Coca Cola", 150, 10);
    vendingMachine.inventory.addProduct(product);
    const result = vendingMachine.selectProduct("A1");
    expect(result.success).toBe(true);
    expect(vendingMachine.selectedProduct).toBe(product);
  });
  test("should insert valid money denomination", () => {
    const vendingMachine = new VendingMachine();
    const amount = 100;
    const result = vendingMachine.insertMoney(amount);
    expect(result.success).toBe(true);
    expect(vendingMachine.insertedMoney).toBe(100);
  });
  test("should complete purchase when conditions are met", () => {
    const vendingMachine = new VendingMachine();
    const product = new Product("A1", "Coca Cola", 150, 10);
    vendingMachine.inventory.addProduct(product);
    vendingMachine.coinManager.addCoins(50, 10);
    vendingMachine.selectProduct("A1");
    vendingMachine.insertMoney(200);
    const result = vendingMachine.purchase();
    expect(result.success).toBe(true);
    expect(result.product.id).toBe("A1");
  });
  test("should return current machine status", () => {
    const vendingMachine = new VendingMachine();
    const product = new Product("A1", "Coca Cola", 150, 5);
    vendingMachine.inventory.addProduct(product);
    const result = vendingMachine.getStatus();
    expect(result.availableProducts).toHaveLength(1);
    expect(result.totalMoney).toBeDefined();
  });
});
