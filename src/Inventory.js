/**
 * Gère l'inventaire des produits
 */
class Inventory {
  constructor() {
    this.products = new Map();
  }

  /**
   * Ajoute un produit à l'inventaire
   * @param {Product} product - Le produit à ajouter
   */
  addProduct(product) {
    this.products.set(product.id, product);
  }

  /**
   * Récupère un produit par son ID
   * @param {string} productId - ID du produit
   * @returns {Product|null}
   */
  getProduct(productId) {
    return this.products.get(productId) || null;
  }

  /**
   * Récupère tous les produits disponibles
   * @returns {Array<Product>}
   */
  getAvailableProducts() {
    return Array.from(this.products.values()).filter((product) =>
      product.isAvailable()
    );
  }

  /**
   * Récupère tous les produits
   * @returns {Array<Product>}
   */
  getAllProducts() {
    return Array.from(this.products.values());
  }

  /**
   * Vérifie si un produit est disponible
   * @param {string} productId - ID du produit
   * @returns {boolean}
   */
  isProductAvailable(productId) {
    const product = this.getProduct(productId);
    return product ? product.isAvailable() : false;
  }

  /**
   * Distribue un produit
   * @param {string} productId - ID du produit
   * @throws {Error} Si le produit n'existe pas ou n'est pas disponible
   */
  dispenseProduct(productId) {
    const product = this.getProduct(productId);
    if (!product) {
      throw new Error(`Produit ${productId} non trouvé`);
    }
    product.dispense();
  }

  /**
   * Réapprovisionne un produit
   * @param {string} productId - ID du produit
   * @param {number} quantity - Quantité à ajouter
   */
  restockProduct(productId, quantity) {
    const product = this.getProduct(productId);
    if (!product) {
      throw new Error(`Produit ${productId} non trouvé`);
    }
    product.restock(quantity);
  }
}

module.exports = Inventory;
