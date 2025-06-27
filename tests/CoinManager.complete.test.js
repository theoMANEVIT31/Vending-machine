const { Currency, CoinManager } = require("../src/CoinManager");

describe("CoinManager & Currency - Suite complète", () => {
  describe("Currency", () => {
    test("11. should create currency with default exchange rate", () => {
      // Arrange & Act
      const currency = new Currency("EUR", "Euro");

      // Assert
      expect(currency.code).toBe("EUR");
      expect(currency.name).toBe("Euro");
      expect(currency.exchangeRate).toBe(1);
    });

    test("12. should create currency with custom exchange rate", () => {
      // Arrange & Act
      const currency = new Currency("USD", "US Dollar", 1.1);

      // Assert
      expect(currency.exchangeRate).toBe(1.1);
    });

    test("13. should convert to EUR correctly", () => {
      // Arrange
      const currency = new Currency("USD", "US Dollar", 1.1);

      // Act & Assert
      expect(currency.toEUR(110)).toBe(100);
      expect(currency.toEUR(55)).toBe(50);
    });

    test("14. should convert from EUR correctly", () => {
      // Arrange
      const currency = new Currency("USD", "US Dollar", 1.1);

      // Act & Assert
      expect(currency.fromEUR(100)).toBe(110);
      expect(currency.fromEUR(50)).toBe(55);
    });
  });

  describe("CoinManager", () => {
    test("15. should initialize with default denominations", () => {
      // Arrange & Act
      const coinManager = new CoinManager();

      // Assert
      const denominations = coinManager.getDenominations();
      expect(denominations.get(1)).toBe(0);
      expect(denominations.get(100)).toBe(0);
      expect(denominations.get(5000)).toBe(0);
    });

    test("16. should add coins to valid denomination", () => {
      // Arrange
      const coinManager = new CoinManager();

      // Act
      coinManager.addCoins(100, 5);

      // Assert
      expect(coinManager.getDenominations().get(100)).toBe(5);
      expect(coinManager.getTotalMoney()).toBe(500);
    });

    test("17. should throw error for invalid denomination", () => {
      // Arrange
      const coinManager = new CoinManager();

      // Act & Assert
      expect(() => coinManager.addCoins(75, 1)).toThrow(
        "Dénomination 75 non supportée"
      );
    });

    test("18. should calculate change for exact amount", () => {
      // Arrange
      const coinManager = new CoinManager();
      coinManager.addCoins(50, 10);
      coinManager.addCoins(100, 5);

      // Act
      const change = coinManager.calculateChange(150);

      // Assert
      expect(change).not.toBeNull();
      expect(change.get(100)).toBe(1);
      expect(change.get(50)).toBe(1);
    });

    test("19. should return null for impossible change", () => {
      // Arrange
      const coinManager = new CoinManager();
      coinManager.addCoins(200, 1); // Seulement 2€

      // Act
      const change = coinManager.calculateChange(150); // Impossible avec seulement des pièces de 2€

      // Assert
      expect(change).toBeNull();
    });

    test("20. should dispense change and update inventory", () => {
      // Arrange
      const coinManager = new CoinManager();
      coinManager.addCoins(50, 10);
      coinManager.addCoins(100, 5);

      // Act
      const change = coinManager.dispenseChange(150);

      // Assert
      expect(change.get(100)).toBe(1);
      expect(change.get(50)).toBe(1);
      expect(coinManager.getDenominations().get(100)).toBe(4);
      expect(coinManager.getDenominations().get(50)).toBe(9);
    });
  });
});
