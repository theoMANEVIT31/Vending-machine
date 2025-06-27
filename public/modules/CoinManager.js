/**
 * Représente une devise
 */
class Currency {
  constructor(code, name, symbol = "") {
    this.code = code;
    this.name = name;
    this.symbol = symbol;
  }
}

/**
 * Gestionnaire des pièces et de la monnaie
 */
class CoinManager {
  constructor(currency = new Currency("EUR", "Euro", "€")) {
    this.currency = currency;
    this.denominations = [0.05, 0.1, 0.2, 0.5, 1.0, 2.0]; // en euros
    this.coinInventory = new Map();

    // Initialiser avec un stock de démarrage
    this.denominations.forEach((denom) => {
      this.coinInventory.set(denom, 10); // 10 pièces de chaque dénomination
    });
  }

  /**
   * Valide qu'une dénomination est acceptée
   * @param {number} amount
   * @returns {boolean}
   */
  isValidDenomination(amount) {
    return this.denominations.includes(amount);
  }

  /**
   * Ajoute des pièces au stock
   * @param {number} denomination
   * @param {number} quantity
   */
  addCoins(denomination, quantity) {
    if (!this.isValidDenomination(denomination)) {
      throw new Error(`Dénomination ${denomination} non acceptée`);
    }
    if (typeof quantity !== "number" || quantity < 0) {
      throw new Error("La quantité doit être un nombre positif");
    }

    const current = this.coinInventory.get(denomination) || 0;
    this.coinInventory.set(denomination, current + quantity);
  }

  /**
   * Retire des pièces du stock
   * @param {number} denomination
   * @param {number} quantity
   */
  removeCoins(denomination, quantity) {
    if (!this.isValidDenomination(denomination)) {
      throw new Error(`Dénomination ${denomination} non acceptée`);
    }

    const current = this.coinInventory.get(denomination) || 0;
    if (current < quantity) {
      throw new Error(`Stock insuffisant pour la dénomination ${denomination}`);
    }

    this.coinInventory.set(denomination, current - quantity);
  }

  /**
   * Calcule la monnaie à rendre avec le minimum de pièces
   * @param {number} amount
   * @returns {Array}
   */
  calculateChange(amount) {
    if (amount <= 0) return [];

    // Arrondir pour éviter les erreurs de virgule flottante
    amount = Math.round(amount * 100) / 100;

    const change = [];
    const sortedDenominations = [...this.denominations].sort((a, b) => b - a);

    for (const denomination of sortedDenominations) {
      const available = this.coinInventory.get(denomination) || 0;
      const needed = Math.floor(amount / denomination);
      const toUse = Math.min(needed, available);

      if (toUse > 0) {
        for (let i = 0; i < toUse; i++) {
          change.push(denomination);
        }
        amount = Math.round((amount - toUse * denomination) * 100) / 100;
      }

      if (amount === 0) break;
    }

    // Vérifier si on peut rendre la monnaie exacte
    if (amount > 0) {
      throw new Error("Impossible de rendre la monnaie exacte");
    }

    return change;
  }

  /**
   * Effectue le rendu de monnaie (retire les pièces du stock)
   * @param {number} amount
   * @returns {Array}
   */
  makeChange(amount) {
    const change = this.calculateChange(amount);

    // Retirer les pièces du stock
    for (const coin of change) {
      this.removeCoins(coin, 1);
    }

    return change;
  }

  /**
   * Vérifie si on peut rendre la monnaie pour un montant donné
   * @param {number} amount
   * @returns {boolean}
   */
  canMakeChange(amount) {
    try {
      this.calculateChange(amount);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Retourne l'inventaire des pièces
   * @returns {Object}
   */
  getCoinInventory() {
    const inventory = {};
    for (const [denomination, quantity] of this.coinInventory) {
      inventory[denomination] = quantity;
    }
    return inventory;
  }

  /**
   * Retourne la valeur totale en caisse
   * @returns {number}
   */
  getTotalValue() {
    let total = 0;
    for (const [denomination, quantity] of this.coinInventory) {
      total += denomination * quantity;
    }
    return Math.round(total * 100) / 100;
  }

  /**
   * Retourne les dénominations acceptées
   * @returns {Array}
   */
  getAcceptedDenominations() {
    return [...this.denominations];
  }
}

export { Currency, CoinManager };
