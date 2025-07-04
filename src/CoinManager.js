class Currency {
  constructor(code, name, exchangeRate = 1) {
    this.code = code;
    this.name = name;
    this.exchangeRate = exchangeRate;
  }
}

class CoinManager {
  constructor(currency = new Currency("EUR", "Euro")) {
    this.currency = currency;
    this.denominations = new Map([
      [1, 0],
      [2, 0],
      [5, 0],
      [10, 0],
      [20, 0],
      [50, 0],
      [100, 0],
      [200, 0],
      [500, 0],
      [1000, 0],
      [2000, 0],
      [5000, 0],
    ]);
  }

  addCoins(value, count) {
    if (!this.denominations.has(value)) {
      throw new Error(`Dénomination ${value} non supportée`);
    }
    this.denominations.set(value, this.denominations.get(value) + count);
  }

  canMakeChange(amount) {
    return this.calculateChange(amount) !== null;
  }

  calculateChange(amount) {
    if (amount === 0) return new Map();

    const change = new Map();
    const sortedDenominations = Array.from(this.denominations.keys()).sort(
      (a, b) => b - a
    );

    for (const denomination of sortedDenominations) {
      const available = this.denominations.get(denomination);
      const needed = Math.min(Math.floor(amount / denomination), available);

      if (needed > 0) {
        change.set(denomination, needed);
        amount -= needed * denomination;
      }
    }

    return amount === 0 ? change : null;
  }

  dispenseChange(amount) {
    const change = this.calculateChange(amount);
    if (!change) {
      throw new Error("Impossible de rendre la monnaie exacte");
    }

    for (const [denomination, count] of change) {
      this.denominations.set(
        denomination,
        this.denominations.get(denomination) - count
      );
    }

    return change;
  }

  getTotalMoney() {
    let total = 0;
    for (const [denomination, count] of this.denominations) {
      total += denomination * count;
    }
    return total;
  }

  formatAmount(amount) {
    const euros = Math.floor(amount / 100);
    const cents = amount % 100;
    return `${euros},${cents.toString().padStart(2, "0")} ${
      this.currency.code
    }`;
  }

  getDenominations() {
    return new Map(this.denominations);
  }
}

module.exports = { Currency, CoinManager };
