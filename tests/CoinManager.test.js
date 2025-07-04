const { Currency, CoinManager } = require("../src/CoinManager");

describe("CoinManager - Tests Clean", () => {
  test("should create currency with default exchange rate", () => {
    const code = "EUR";
    const name = "Euro";
    
    const currency = new Currency(code, name);
    
    expect(currency.code).toBe("EUR");
    expect(currency.name).toBe("Euro");
    expect(currency.exchangeRate).toBe(1);
  });

  test("should initialize with zero denominations", () => {
    const coinManager = new CoinManager();
    
    const denominations = coinManager.getDenominations();
    expect(denominations.get(1)).toBe(0);
    expect(denominations.get(100)).toBe(0);
  });

  test("should add coins to valid denomination", () => {
    const coinManager = new CoinManager();
    const denomination = 100;
    const count = 5;
    
    coinManager.addCoins(denomination, count);
    
    expect(coinManager.getDenominations().get(100)).toBe(5);
  });

  test("should calculate total money correctly", () => {
    const coinManager = new CoinManager();
    coinManager.addCoins(100, 5);
    
    const result = coinManager.getTotalMoney();
    
    expect(result).toBe(500);
  });

  test("should throw error for invalid denomination", () => {
    const coinManager = new CoinManager();
    const invalidDenomination = 75;
    
    expect(() => coinManager.addCoins(invalidDenomination, 1))
      .toThrow("Dénomination 75 non supportée");
  });

  test("should calculate change when possible", () => {
    const coinManager = new CoinManager();
    coinManager.addCoins(50, 10);
    coinManager.addCoins(100, 5);
    const changeAmount = 150;
    
    const result = coinManager.calculateChange(changeAmount);
    
    expect(result).not.toBeNull();
    expect(result.get(100)).toBe(1);
    expect(result.get(50)).toBe(1);
  });

  test("should convert between currencies", () => {
    const eur = new Currency("EUR", "Euro", 1);
    const usd = new Currency("USD", "Dollar", 1.1);
    
    const result = eur.convert(110, usd);
    
    expect(result).toBe(121);
  });

  test("should refill from external provider", () => {
    const coinManager = new CoinManager();
    
    const received = coinManager.refillFromExternal(100, 10);
    
    expect(received).toBe(10);
    expect(coinManager.getDenominations().get(100)).toBe(10);
  });
});
