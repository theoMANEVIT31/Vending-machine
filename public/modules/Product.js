/**
 * Représente un produit dans le distributeur automatique
 */
class Product {
  /**
   * @param {string} code - Code du produit (ex: A1, B2)
   * @param {string} name - Nom du produit
   * @param {number} price - Prix en euros
   */
  constructor(code, name, price) {
    if (!code || typeof code !== "string") {
      throw new Error(
        "Le code du produit est obligatoire et doit être une chaîne"
      );
    }
    if (!name || typeof name !== "string") {
      throw new Error(
        "Le nom du produit est obligatoire et doit être une chaîne"
      );
    }
    if (typeof price !== "number" || price <= 0) {
      throw new Error("Le prix doit être un nombre positif");
    }

    this.code = code;
    this.name = name;
    this.price = price;
  }

  /**
   * Retourne une représentation textuelle du produit
   * @returns {string}
   */
  toString() {
    return `${this.code} - ${this.name}: ${this.price.toFixed(2)}€`;
  }

  /**
   * Compare deux produits
   * @param {Product} other
   * @returns {boolean}
   */
  equals(other) {
    return this.code === other.code;
  }

  /**
   * Retourne les informations du produit pour l'API
   * @returns {Object}
   */
  toJSON() {
    return {
      code: this.code,
      name: this.name,
      price: this.price,
    };
  }
}

export { Product };
