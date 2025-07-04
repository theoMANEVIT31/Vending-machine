class ExternalCoinProvider {
  constructor() {
    this.coinInventory = new Map();
    this.initializeInventory();
  }

  initializeInventory() {
    const denominations = [0.05, 0.10, 0.20, 0.50, 1.00, 2.00];
    denominations.forEach(denomination => {
      this.coinInventory.set(denomination, 20);
    });
  }

  isAvailable(denomination, quantity = 1) {
    const available = this.coinInventory.get(denomination) || 0;
    return available >= quantity;
  }

  getAvailableStock(denomination) {
    return this.coinInventory.get(denomination) || 0;
  }

  provideCoin(denomination, quantity) {
    if (!this.isAvailable(denomination, quantity)) {
      throw new Error(`Stock insuffisant pour ${denomination}€. Disponible: ${this.getAvailableStock(denomination)}`);
    }
    
    const currentStock = this.coinInventory.get(denomination);
    this.coinInventory.set(denomination, currentStock - quantity);
    
    return {
      denomination: denomination,
      quantity: quantity,
      remainingStock: this.coinInventory.get(denomination)
    };
  }

  restockFromSupplier(denomination, quantity) {
    const currentStock = this.coinInventory.get(denomination) || 0;
    this.coinInventory.set(denomination, currentStock + quantity);
    
    return {
      denomination: denomination,
      quantityAdded: quantity,
      newStock: this.coinInventory.get(denomination)
    };
  }

  getFullInventory() {
    const inventory = {};
    this.coinInventory.forEach((quantity, denomination) => {
      inventory[denomination] = quantity;
    });
    return inventory;
  }

  calculateOptimalChange(amount) {
    const change = [];
    const denominations = [2.00, 1.00, 0.50, 0.20, 0.10, 0.05].filter(d => 
      this.coinInventory.has(d) && this.coinInventory.get(d) > 0
    );
    
    let remaining = Math.round(amount * 100) / 100;
    
    for (const denomination of denominations) {
      const available = this.coinInventory.get(denomination);
      const needed = Math.floor(remaining / denomination);
      const toUse = Math.min(needed, available);
      
      if (toUse > 0) {
        for (let i = 0; i < toUse; i++) {
          change.push(denomination);
        }
        remaining = Math.round((remaining - (toUse * denomination)) * 100) / 100;
      }
      
      if (remaining <= 0.001) break;
    }
    
    if (remaining > 0.001) {
      return null;
    }
    
    return change;
  }

  makeChange(amount) {
    const optimalChange = this.calculateOptimalChange(amount);
    
    if (!optimalChange) {
      throw new Error(`Impossible de rendre la monnaie exacte pour ${amount.toFixed(2)}€`);
    }
    
    optimalChange.forEach(denomination => {
      const current = this.coinInventory.get(denomination);
      this.coinInventory.set(denomination, current - 1);
    });
    
    return optimalChange;
  }

  simulateOutage(denomination) {
    this.coinInventory.set(denomination, 0);
  }

  restoreAfterOutage(denomination, quantity = 10) {
    this.coinInventory.set(denomination, quantity);
  }

  getStockReport() {
    const report = {
      totalDenominations: this.coinInventory.size,
      lowStock: [],
      outOfStock: [],
      totalValue: 0
    };

    this.coinInventory.forEach((quantity, denomination) => {
      report.totalValue += denomination * quantity;
      
      if (quantity === 0) {
        report.outOfStock.push(denomination);
      } else if (quantity < 5) {
        report.lowStock.push(denomination);
      }
    });

    report.totalValue = Math.round(report.totalValue * 100) / 100;
    return report;
  }
}

export { ExternalCoinProvider };
