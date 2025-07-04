
class Currency {
  constructor(code, name, symbol = "") {
    this.code = code;
    this.name = name;
    this.symbol = symbol;
  }
}

class CoinManager {
  constructor(currency = new Currency("EUR", "Euro", "€")) {
    this.currency = currency;
    this.denominations = [0.05, 0.1, 0.2, 0.5, 1.0, 2.0]; // en euros
    this.coinInventory = new Map();
    this.denominations.forEach((denom) => {
      this.coinInventory.set(denom, 10); // 10 pièces de chaque dénomination
    });
  }
  
  isValidDenomination(amount) {
    return this.denominations.includes(amount);
  }
  
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
  
  calculateChange(amount) {
    if (amount <= 0) return [];
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
    if (amount > 0) {
      throw new Error("Impossible de rendre la monnaie exacte");
    }
    return change;
  }
  
  makeChange(amount) {
    const change = this.calculateChange(amount);
    for (const coin of change) {
      this.removeCoins(coin, 1);
    }
    return change;
  }
  
  canMakeChange(amount) {
    try {
      this.calculateChange(amount);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  getCoinInventory() {
    const inventory = {};
    for (const [denomination, quantity] of this.coinInventory) {
      inventory[denomination] = quantity;
    }
    return inventory;
  }
  
  getTotalValue() {
    let total = 0;
    for (const [denomination, quantity] of this.coinInventory) {
      total += denomination * quantity;
    }
    return Math.round(total * 100) / 100;
  }
  
  getAcceptedDenominations() {
    return [...this.denominations];
  }
}
export { Currency, CoinManager };

