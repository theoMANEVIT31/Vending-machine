/**
 * Représente un produit dans le distributeur automatique
 */
class Product {
  /**
   * @param {string} id - Identifiant unique du produit
   * @param {string} name - Nom du produit
   * @param {number} price - Prix en centimes
   * @param {number} quantity - Quantité en stock
   */
  constructor(id, name, price, quantity = 0) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  /**
   * Vérifie si le produit est disponible
   * @returns {boolean}
   */
  isAvailable() {
    return this.quantity > 0;
  }

  /**
   * Réduit la quantité de 1
   * @throws {Error} Si le produit n'est pas disponible
   */
  dispense() {
    if (!this.isAvailable()) {
      throw new Error(`Produit ${this.name} non disponible`);
    }
    this.quantity--;
  }

  /**
   * Ajoute du stock
   * @param {number} amount - Quantité à ajouter
   */
  restock(amount) {
    if (amount < 0) {
      throw new Error("La quantité doit être positive");
    }
    this.quantity += amount;
  }
}

module.exports = Product;
