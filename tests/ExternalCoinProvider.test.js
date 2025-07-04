const ExternalCoinProvider = require("../src/ExternalCoinProvider");

describe("ExternalCoinProvider", () => {
  test("should provide available coins", () => {
    const provider = new ExternalCoinProvider();
    
    const received = provider.requestCoins(100, 5);
    
    expect(received).toBe(5);
    expect(provider.getAvailableCoins(100)).toBe(95);
  });
});
