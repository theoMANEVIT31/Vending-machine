/**
 * Gestion de l'inventaire des produits
 */
class Inventory {
  constructor() {
    this.products = new Map(); // code -> { product, stock }
  }

  /**
   * Ajoute un produit à l'inventaire
   * @param {Product} product
   * @param {number} quantity
   */
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

  /**
   * Retire du stock d'un produit
   * @param {string} code
   * @param {number} quantity
   */
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

  /**
   * Obtient un produit par son code
   * @param {string} code
   * @returns {Product|null}
   */
  getProduct(code) {
    const item = this.products.get(code);
    return item ? item.product : null;
  }

  /**
   * Obtient le stock d'un produit
   * @param {string} code
   * @returns {number}
   */
  getStock(code) {
    const item = this.products.get(code);
    return item ? item.stock : 0;
  }

  /**
   * Vérifie si un produit est disponible
   * @param {string} code
   * @returns {boolean}
   */
  isAvailable(code) {
    return this.getStock(code) > 0;
  }

  /**
   * Retourne tous les produits avec leur stock
   * @returns {Object}
   */
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

  /**
   * Retourne les produits en rupture de stock
   * @returns {Array}
   */
  getOutOfStockProducts() {
    const outOfStock = [];
    for (const [code, item] of this.products) {
      if (item.stock === 0) {
        outOfStock.push(item.product);
      }
    }
    return outOfStock;
  }

  /**
   * Retourne les produits avec un stock faible
   * @param {number} threshold
   * @returns {Array}
   */
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

  /**
   * Retourne le nombre total de produits différents
   * @returns {number}
   */
  getProductCount() {
    return this.products.size;
  }

  /**
   * Retourne le stock total
   * @returns {number}
   */
  getTotalStock() {
    let total = 0;
    for (const item of this.products.values()) {
      total += item.stock;
    }
    return total;
  }
}

export { Inventory };
