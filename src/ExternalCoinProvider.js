class ExternalCoinProvider {
  constructor() {
    this.coinBank = new Map([
      [1, 1000],
      [2, 500], 
      [5, 500],
      [10, 300],
      [20, 200],
      [50, 150],
      [100, 100],
      [200, 50],
      [500, 30],
      [1000, 20],
      [2000, 10],
      [5000, 5],
    ]);
  }

  getAvailableCoins(denomination) {
    return this.coinBank.get(denomination) || 0;
  }

  requestCoins(denomination, amount) {
    const available = this.getAvailableCoins(denomination);
    const provided = Math.min(available, amount);
    this.coinBank.set(denomination, available - provided);
    return provided;
  }
}

module.exports = ExternalCoinProvider;
