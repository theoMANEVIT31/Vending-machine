class Product {
  constructor(id, name, price, quantity = 0) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  isAvailable() {
    return this.quantity > 0;
  }

  dispense() {
    if (!this.isAvailable()) {
      throw new Error(`Produit ${this.name} non disponible`);
    }
    this.quantity--;
  }

  restock(amount) {
    if (amount < 0) {
      throw new Error("La quantité doit être positive");
    }
    this.quantity += amount;
  }
}

module.exports = Product;
