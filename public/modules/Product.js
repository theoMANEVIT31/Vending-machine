
class Product {
  
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
  
  toString() {
    return `${this.code} - ${this.name}: ${this.price.toFixed(2)}€`;
  }
  
  equals(other) {
    return this.code === other.code;
  }
  
  toJSON() {
    return {
      code: this.code,
      name: this.name,
      price: this.price,
    };
  }
}
export { Product };

