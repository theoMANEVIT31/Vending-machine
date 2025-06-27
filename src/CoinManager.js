/**
 * Gère les devises et les conversions
 */
class Currency {
  constructor(code, name, exchangeRate = 1) {
    this.code = code; // EUR, USD, etc.
    this.name = name;
    this.exchangeRate = exchangeRate; // Par rapport à EUR
  }

  /**
   * Convertit un montant vers EUR
   * @param {number} amount - Montant dans cette devise
   * @returns {number} Montant en EUR
   */
  toEUR(amount) {
    return Math.round(amount / this.exchangeRate);
  }

  /**
   * Convertit un montant depuis EUR
   * @param {number} amountEUR - Montant en EUR
   * @returns {number} Montant dans cette devise
   */
  fromEUR(amountEUR) {
    return Math.round(amountEUR * this.exchangeRate);
  }
}

/**
 * Gère les pièces et billets disponibles
 */
class CoinManager {
  constructor(currency = new Currency("EUR", "Euro")) {
    this.currency = currency;
    this.denominations = new Map([
      [1, 0], // 1 centime
      [2, 0], // 2 centimes
      [5, 0], // 5 centimes
      [10, 0], // 10 centimes
      [20, 0], // 20 centimes
      [50, 0], // 50 centimes
      [100, 0], // 1 euro
      [200, 0], // 2 euros
      [500, 0], // 5 euros
      [1000, 0], // 10 euros
      [2000, 0], // 20 euros
      [5000, 0], // 50 euros
    ]);
  }

  /**
   * Ajoute des pièces/billets
   * @param {number} value - Valeur en centimes
   * @param {number} count - Nombre de pièces/billets
   */
  addCoins(value, count) {
    if (!this.denominations.has(value)) {
      throw new Error(`Dénomination ${value} non supportée`);
    }
    this.denominations.set(value, this.denominations.get(value) + count);
  }

  /**
   * Vérifie si on peut rendre la monnaie
   * @param {number} amount - Montant à rendre en centimes
   * @returns {boolean}
   */
  canMakeChange(amount) {
    return this.calculateChange(amount) !== null;
  }

  /**
   * Calcule la monnaie optimale (moins de pièces possible)
   * @param {number} amount - Montant à rendre en centimes
   * @returns {Map<number, number>|null} Map des dénominations et quantités, ou null si impossible
   */
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

  /**
   * Distribue la monnaie
   * @param {number} amount - Montant à rendre
   * @returns {Map<number, number>} Map des pièces rendues
   * @throws {Error} Si impossible de rendre la monnaie
   */
  dispenseChange(amount) {
    const change = this.calculateChange(amount);
    if (!change) {
      throw new Error("Impossible de rendre la monnaie exacte");
    }

    // Retire les pièces de l'inventaire
    for (const [denomination, count] of change) {
      this.denominations.set(
        denomination,
        this.denominations.get(denomination) - count
      );
    }

    return change;
  }

  /**
   * Récupère le total d'argent dans la machine
   * @returns {number} Total en centimes
   */
  getTotalMoney() {
    let total = 0;
    for (const [denomination, count] of this.denominations) {
      total += denomination * count;
    }
    return total;
  }

  /**
   * Formate un montant pour l'affichage
   * @param {number} amount - Montant en centimes
   * @returns {string}
   */
  formatAmount(amount) {
    const euros = Math.floor(amount / 100);
    const cents = amount % 100;
    return `${euros},${cents.toString().padStart(2, "0")} ${
      this.currency.code
    }`;
  }

  /**
   * Récupère l'état des dénominations
   * @returns {Map<number, number>}
   */
  getDenominations() {
    return new Map(this.denominations);
  }
}

module.exports = { Currency, CoinManager };
