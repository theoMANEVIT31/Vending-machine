
class Inventory {
  constructor() {
    this.products = new Map();
  }
  
  addProduct(product, quantity = 1) {
    if (!product || typeof product !== "object") {
      throw new Error("Le produit doit être un objet Product valide");
    }
    if (typeof quantity !== "number" || quantity < 0) {
      throw new Error("La quantité doit être un nombre positif ou nul");
    }
    const existing = this.products.get(product.code);
    if (existing) {
      existing.stock += quantity;
    } else {
      this.products.set(product.code, { product, stock: quantity });
    }
  }
  
  removeStock(code, quantity = 1) {
    const item = this.products.get(code);
    if (!item) {
      throw new Error(`Produit ${code} non trouvé dans l'inventaire`);
    }
    if (item.stock < quantity) {
      throw new Error(
        `Stock insuffisant pour ${code}. Stock actuel: ${item.stock}`
      );
    }
    item.stock -= quantity;
  }
  
  getProduct(code) {
    const item = this.products.get(code);
    return item ? item.product : null;
  }
  
  getStock(code) {
    const item = this.products.get(code);
    return item ? item.stock : 0;
  }
  
  isAvailable(code) {
    return this.getStock(code) > 0;
  }
  
  getAllProducts() {
    const result = {};
    for (const [code, item] of this.products) {
      result[code] = {
        product: item.product,
        stock: item.stock,
      };
    }
    return result;
  }
  
  getOutOfStockProducts() {
    const outOfStock = [];
    for (const [code, item] of this.products) {
      if (item.stock === 0) {
        outOfStock.push(item.product);
      }
    }
    return outOfStock;
  }
  
  getLowStockProducts(threshold = 2) {
    const lowStock = [];
    for (const [code, item] of this.products) {
      if (item.stock > 0 && item.stock <= threshold) {
        lowStock.push({
          product: item.product,
          stock: item.stock,
        });
      }
    }
    return lowStock;
  }
  
  getProductCount() {
    return this.products.size;
  }
  
  getTotalStock() {
    let total = 0;
    for (const item of this.products.values()) {
      total += item.stock;
    }
    return total;
  }
}
export { Inventory };

