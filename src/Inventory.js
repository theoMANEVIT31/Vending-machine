class Inventory {
  constructor() {
    this.products = new Map();
  }

  addProduct(product) {
    this.products.set(product.id, product);
  }

  getProduct(productId) {
    return this.products.get(productId) || null;
  }

  getAvailableProducts() {
    return Array.from(this.products.values()).filter((product) =>
      product.isAvailable()
    );
  }

  getAllProducts() {
    return Array.from(this.products.values());
  }

  isProductAvailable(productId) {
    const product = this.getProduct(productId);
    return product ? product.isAvailable() : false;
  }

  dispenseProduct(productId) {
    const product = this.getProduct(productId);
    if (!product) {
      throw new Error(`Produit ${productId} non trouvé`);
    }
    product.dispense();
  }

  restockProduct(productId, quantity) {
    const product = this.getProduct(productId);
    if (!product) {
      throw new Error(`Produit ${productId} non trouvé`);
    }
    product.restock(quantity);
  }
}

module.exports = Inventory;
