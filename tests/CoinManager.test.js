const { Currency, CoinManager } = require("../src/CoinManager");

describe("Currency", () => {
  describe("constructor", () => {
    test("should create currency with default exchange rate", () => {
      const currency = new Currency("EUR", "Euro");
      expect(currency.code).toBe("EUR");
      expect(currency.name).toBe("Euro");
      expect(currency.exchangeRate).toBe(1);
    });

    test("should create currency with custom exchange rate", () => {
      const currency = new Currency("USD", "US Dollar", 1.1);
      expect(currency.exchangeRate).toBe(1.1);
    });
  });

  describe("toEUR", () => {
    test("should convert EUR to EUR correctly", () => {
      const eur = new Currency("EUR", "Euro", 1);
      expect(eur.toEUR(100)).toBe(100);
    });

    test("should convert USD to EUR correctly", () => {
      const usd = new Currency("USD", "US Dollar", 1.1);
      expect(usd.toEUR(110)).toBe(100);
    });

    test("should handle rounding", () => {
      const usd = new Currency("USD", "US Dollar", 1.1);
      expect(usd.toEUR(111)).toBe(101);
    });
  });

  describe("fromEUR", () => {
    test("should convert EUR to EUR correctly", () => {
      const eur = new Currency("EUR", "Euro", 1);
      expect(eur.fromEUR(100)).toBe(100);
    });

    test("should convert EUR to USD correctly", () => {
      const usd = new Currency("USD", "US Dollar", 1.1);
      expect(usd.fromEUR(100)).toBe(110);
    });

    test("should handle rounding", () => {
      const usd = new Currency("USD", "US Dollar", 1.15);
      expect(usd.fromEUR(100)).toBe(115);
    });
  });
});

describe("CoinManager", () => {
  let coinManager;

  beforeEach(() => {
    coinManager = new CoinManager();
  });

  describe("constructor", () => {
    test("should create with default EUR currency", () => {
      expect(coinManager.currency.code).toBe("EUR");
      expect(coinManager.currency.name).toBe("Euro");
    });

    test("should create with custom currency", () => {
      const usd = new Currency("USD", "US Dollar", 1.1);
      const manager = new CoinManager(usd);
      expect(manager.currency.code).toBe("USD");
    });

    test("should initialize with zero coins for all denominations", () => {
      const denominations = coinManager.getDenominations();
      for (const [denomination, count] of denominations) {
        expect(count).toBe(0);
      }
    });

    test("should have correct denominations", () => {
      const denominations = Array.from(coinManager.getDenominations().keys());
      const expected = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
      expect(denominations.sort((a, b) => a - b)).toEqual(expected);
    });
  });

  describe("addCoins", () => {
    test("should add coins for valid denomination", () => {
      coinManager.addCoins(100, 5);
      expect(coinManager.getDenominations().get(100)).toBe(5);
    });

    test("should accumulate coins for same denomination", () => {
      coinManager.addCoins(100, 3);
      coinManager.addCoins(100, 2);
      expect(coinManager.getDenominations().get(100)).toBe(5);
    });

    test("should throw error for invalid denomination", () => {
      expect(() => coinManager.addCoins(75, 1)).toThrow(
        "Dénomination 75 non supportée"
      );
      expect(() => coinManager.addCoins(300, 1)).toThrow(
        "Dénomination 300 non supportée"
      );
    });

    test("should handle zero count", () => {
      coinManager.addCoins(100, 0);
      expect(coinManager.getDenominations().get(100)).toBe(0);
    });
  });

  describe("calculateChange", () => {
    beforeEach(() => {
      coinManager.addCoins(1, 10);
      coinManager.addCoins(2, 10);
      coinManager.addCoins(5, 10);
      coinManager.addCoins(10, 10);
      coinManager.addCoins(20, 10);
      coinManager.addCoins(50, 10);
      coinManager.addCoins(100, 10);
      coinManager.addCoins(200, 10);
    });

    test("should return empty map for zero amount", () => {
      const change = coinManager.calculateChange(0);
      expect(change).toEqual(new Map());
    });

    test("should calculate optimal change for simple amount", () => {
      const change = coinManager.calculateChange(100);
      expect(change.get(100)).toBe(1);
      expect(change.size).toBe(1);
    });

    test("should calculate optimal change for complex amount", () => {
      const change = coinManager.calculateChange(237);
      expect(change.get(200)).toBe(1);
      expect(change.get(20)).toBe(1);
      expect(change.get(10)).toBe(1);
      expect(change.get(5)).toBe(1);
      expect(change.get(2)).toBe(1);
    });

    test("should return null when exact change impossible", () => {
      const emptyManager = new CoinManager();
      const change = emptyManager.calculateChange(100);
      expect(change).toBeNull();
    });

    test("should handle insufficient coins for large denominations", () => {
      const limitedManager = new CoinManager();
      limitedManager.addCoins(1000, 1);
      const change = limitedManager.calculateChange(2000);
      expect(change).toBeNull();
    });

    test("should use smaller denominations when larger ones unavailable", () => {
      const smallCoinManager = new CoinManager();
      smallCoinManager.addCoins(10, 15);
      smallCoinManager.addCoins(5, 10);

      const change = smallCoinManager.calculateChange(100);
      expect(change.get(10)).toBe(10);
      expect(change.size).toBe(1);
    });
  });

  describe("canMakeChange", () => {
    beforeEach(() => {
      coinManager.addCoins(100, 5);
      coinManager.addCoins(50, 5);
      coinManager.addCoins(10, 5);
    });

    test("should return true for possible change", () => {
      expect(coinManager.canMakeChange(100)).toBe(true);
      expect(coinManager.canMakeChange(160)).toBe(true);
    });

    test("should return false for impossible change", () => {
      expect(coinManager.canMakeChange(5)).toBe(false);
      expect(coinManager.canMakeChange(1000)).toBe(false);
    });

    test("should return true for zero amount", () => {
      expect(coinManager.canMakeChange(0)).toBe(true);
    });
  });

  describe("dispenseChange", () => {
    beforeEach(() => {
      coinManager.addCoins(100, 5);
      coinManager.addCoins(50, 5);
      coinManager.addCoins(10, 5);
    });

    test("should dispense change and update inventory", () => {
      const initialCount = coinManager.getDenominations().get(100);
      const change = coinManager.dispenseChange(100);

      expect(change.get(100)).toBe(1);
      expect(coinManager.getDenominations().get(100)).toBe(initialCount - 1);
    });

    test("should throw error when change impossible", () => {
      expect(() => coinManager.dispenseChange(5)).toThrow(
        "Impossible de rendre la monnaie exacte"
      );
    });

    test("should handle complex change dispensing", () => {
      const change = coinManager.dispenseChange(160);
      expect(change.get(100)).toBe(1);
      expect(change.get(50)).toBe(1);
      expect(change.get(10)).toBe(1);

      expect(coinManager.getDenominations().get(100)).toBe(4);
      expect(coinManager.getDenominations().get(50)).toBe(4);
      expect(coinManager.getDenominations().get(10)).toBe(4);
    });

    test("should return empty map for zero amount", () => {
      const change = coinManager.dispenseChange(0);
      expect(change).toEqual(new Map());
    });
  });

  describe("getTotalMoney", () => {
    test("should return zero for empty manager", () => {
      expect(coinManager.getTotalMoney()).toBe(0);
    });

    test("should calculate total correctly", () => {
      coinManager.addCoins(100, 5);
      coinManager.addCoins(50, 4);
      coinManager.addCoins(10, 3);

      expect(coinManager.getTotalMoney()).toBe(730);
    });

    test("should update after dispensing change", () => {
      coinManager.addCoins(100, 5);
      const initialTotal = coinManager.getTotalMoney();

      coinManager.dispenseChange(100);
      expect(coinManager.getTotalMoney()).toBe(initialTotal - 100);
    });
  });

  describe("formatAmount", () => {
    test("should format euros and cents correctly", () => {
      expect(coinManager.formatAmount(0)).toBe("0,00 EUR");
      expect(coinManager.formatAmount(1)).toBe("0,01 EUR");
      expect(coinManager.formatAmount(10)).toBe("0,10 EUR");
      expect(coinManager.formatAmount(100)).toBe("1,00 EUR");
      expect(coinManager.formatAmount(150)).toBe("1,50 EUR");
      expect(coinManager.formatAmount(1234)).toBe("12,34 EUR");
    });

    test("should pad cents with zero when needed", () => {
      expect(coinManager.formatAmount(105)).toBe("1,05 EUR");
      expect(coinManager.formatAmount(1005)).toBe("10,05 EUR");
    });

    test("should handle large amounts", () => {
      expect(coinManager.formatAmount(999999)).toBe("9999,99 EUR");
    });
  });

  describe("getDenominations", () => {
    test("should return copy of denominations map", () => {
      coinManager.addCoins(100, 5);
      const denominations = coinManager.getDenominations();

      denominations.set(100, 10);

      expect(coinManager.getDenominations().get(100)).toBe(5);
    });
  });

  describe("integration scenarios", () => {
    test("should handle complete transaction cycle", () => {
      coinManager.addCoins(200, 5);
      coinManager.addCoins(100, 10);
      coinManager.addCoins(50, 10);
      coinManager.addCoins(10, 20);

      const initialTotal = coinManager.getTotalMoney();

      coinManager.addCoins(500, 1);

      const change = coinManager.dispenseChange(350);

      expect(change.get(200)).toBe(1);
      expect(change.get(100)).toBe(1);
      expect(change.get(50)).toBe(1);

      expect(coinManager.getTotalMoney()).toBe(initialTotal + 500 - 350);
    });

    test("should handle edge case with exact denomination shortage", () => {
      coinManager.addCoins(200, 1);
      coinManager.addCoins(100, 1);
      coinManager.addCoins(50, 1);

      coinManager.dispenseChange(200);

      const change = coinManager.dispenseChange(150);
      expect(change.get(100)).toBe(1);
      expect(change.get(50)).toBe(1);
    });
  });
});
