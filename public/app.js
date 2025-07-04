import { VendingMachine } from "./modules/VendingMachine.js";
import { Product } from "./modules/Product.js";
class VendingMachineUI {
  constructor() {
    this.vendingMachine = new VendingMachine();
    this.selectedProduct = null;
    this.currentCurrency = "EUR";
    this.exchangeRates = { EUR: 1, USD: 1.1, GBP: 0.85 };
    this.currencySymbols = { EUR: "€", USD: "$", GBP: "£" };
    this.initializeProducts();
    this.setupEventListeners();
    this.updateDisplay();
  }
  initializeProducts() {
    const products = [
      new Product("A1", "Coca-Cola", 1.5),
      new Product("A2", "Pepsi", 1.5),
      new Product("A3", "Sprite", 1.4),
      new Product("B1", "Chips", 2.0),
      new Product("B2", "Cookies", 1.8),
      new Product("B3", "Chocolat", 2.2),
      new Product("C1", "Eau", 1.0),
      new Product("C2", "Jus Orange", 2.5),
      new Product("C3", "Thé Glacé", 1.9),
    ];
    products.forEach((product) => {
      this.vendingMachine.inventory.addProduct(product, 5);
    });
  }
  setupEventListeners() {
    document.querySelectorAll(".coin-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const value = parseFloat(e.target.dataset.value);
        this.insertCoin(value, e.target);
      });
    });
    document.getElementById("cancel-btn").addEventListener("click", () => {
      this.cancelTransaction();
    });
    document
      .getElementById("return-change-btn")
      .addEventListener("click", () => {
        this.returnChange();
      });
    document.getElementById("product-slot").addEventListener("click", () => {
      this.clearProductSlot();
    });
    document.getElementById("change-slot").addEventListener("click", () => {
      this.clearChangeSlot();
    });
    
    // Currency change listener
    document.getElementById("currency-select").addEventListener("change", (e) => {
      this.changeCurrency(e.target.value);
    });

    // Admin event listeners
    document.getElementById("admin-btn").addEventListener("click", () => {
      this.toggleAdminPanel();
    });

    document.getElementById("close-admin-btn").addEventListener("click", () => {
      this.closeAdminPanel();
    });

    document.getElementById("test-currency-btn").addEventListener("click", () => {
      this.testCurrencyConversion();
    });

    document.getElementById("refill-coins-btn").addEventListener("click", () => {
      this.refillCoinsFromExternal();
    });
    
    document.getElementById("restock-product-btn").addEventListener("click", () => {
      this.autoRestockProducts();
    });
    
    document.getElementById("show-logs-btn").addEventListener("click", () => {
      this.showTransactionLogs();
    });
  }
  insertCoin(value, buttonElement) {
    try {
      buttonElement.classList.add("coin-insert-animation");
      setTimeout(() => {
        buttonElement.classList.remove("coin-insert-animation");
      }, 600);
      this.vendingMachine.insertCoin(value);
      this.updateDisplay();
      this.showMessage(`Pièce de ${this.formatBalance(value)} insérée`, "success");
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }
  selectProduct(code) {
    try {
      const product = this.vendingMachine.inventory.getProduct(code);
      if (!product) {
        throw new Error("Produit non trouvé");
      }
      if (this.vendingMachine.inventory.getStock(code) === 0) {
        throw new Error("Produit en rupture de stock");
      }
      this.selectedProduct = code;
      this.updateProductSelection();
      this.showMessage(`Produit ${code} sélectionné`, "success");
      this.attemptPurchase();
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }
  attemptPurchase() {
    if (!this.selectedProduct) return;
    try {
      const result = this.vendingMachine.purchaseProduct(this.selectedProduct);
      
      const lastTransaction = this.vendingMachine.transactionLogger.getAllTransactions().slice(-1)[0];
      if (lastTransaction && lastTransaction.type === "PURCHASE") {
        lastTransaction.currency = this.currentCurrency;
        lastTransaction.exchangeRate = this.exchangeRates[this.currentCurrency];
      }
      
      this.displayProduct(result.product);
      if (result.change && result.change.length > 0) {
        this.displayChange(result.change);
      }
      this.selectedProduct = null;
      this.updateDisplay();
      this.showMessage("Achat réussi ! Récupérez votre produit.", "success");
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }
  cancelTransaction() {
    try {
      const refund = this.vendingMachine.cancelTransaction();
      if (refund && refund.length > 0) {
        this.displayChange(refund);
        this.showMessage(
          "Transaction annulée. Récupérez votre monnaie.",
          "warning"
        );
      } else {
        this.showMessage("Aucune transaction à annuler.", "info");
      }
      this.selectedProduct = null;
      this.updateDisplay();
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }
  returnChange() {
    try {
      const change = this.vendingMachine.returnChange();
      if (change && change.length > 0) {
        this.displayChange(change);
        this.showMessage("Monnaie rendue.", "success");
      } else {
        this.showMessage("Aucune monnaie à rendre.", "info");
      }
      this.updateDisplay();
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }
  displayProduct(product) {
    const slot = document.getElementById("product-slot");
    slot.innerHTML = `
            <i class="fas fa-gift"></i>
            <span><strong>${product.name}</strong><br>Code: ${product.code}</span>
        `;
    slot.classList.add("has-product");
  }
  displayChange(coins) {
    const slot = document.getElementById("change-slot");
    const total = coins.reduce((sum, coin) => sum + coin, 0);
    const coinsList = coins.map((coin) => this.formatBalance(coin)).join(", ");
    slot.innerHTML = `
            <i class="fas fa-coins"></i>
            <span><strong>${this.formatBalance(total)}</strong><br>${coinsList}</span>
        `;
    slot.classList.add("has-change");
  }
  clearProductSlot() {
    const slot = document.getElementById("product-slot");
    slot.innerHTML = `
            <i class="fas fa-gift"></i>
            <span>Votre produit apparaîtra ici</span>
        `;
    slot.classList.remove("has-product");
  }
  clearChangeSlot() {
    const slot = document.getElementById("change-slot");
    slot.innerHTML = `
            <i class="fas fa-coins"></i>
            <span>Votre monnaie apparaîtra ici</span>
        `;
    slot.classList.remove("has-change");
  }
  updateDisplay() {
    this.updateBalance();
    this.updateProducts();
    this.updateCoinButtons();
  }
  updateBalance() {
    const balanceElement = document.getElementById("balance");
    balanceElement.textContent = this.formatBalance(this.vendingMachine.insertedMoney);
  }
  updateProducts() {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = "";
    const products = this.vendingMachine.inventory.getAllProducts();
    Object.entries(products).forEach(([code, productData]) => {
      const card = document.createElement("div");
      card.className = "product-card fade-in";
      if (productData.stock === 0) {
        card.classList.add("out-of-stock");
      }
      if (this.selectedProduct === code) {
        card.classList.add("selected");
      }
      card.innerHTML = `
                <div class="product-code">${code}</div>
                <div class="product-name">${productData.product.name}</div>
                <div class="product-price">${this.formatPrice(productData.product.price)}</div>
                <div class="product-stock">Stock: ${productData.stock}</div>
            `;
      if (productData.stock > 0) {
        card.addEventListener("click", () => this.selectProduct(code));
      }
      grid.appendChild(card);
    });
  }
  updateProductSelection() {
    document.querySelectorAll(".product-card").forEach((card) => {
      card.classList.remove("selected");
    });
    if (this.selectedProduct) {
      const cards = Array.from(document.querySelectorAll(".product-card"));
      const selectedCard = cards.find(
        (card) =>
          card.querySelector(".product-code").textContent ===
          this.selectedProduct
      );
      if (selectedCard) {
        selectedCard.classList.add("selected");
      }
    }
  }
  showMessage(text, type) {
    const messageContainer = document.getElementById("message-container");
    const message = document.createElement("div");
    message.className = `message ${type} slide-in`;
    message.textContent = text;
    messageContainer.appendChild(message);
    setTimeout(() => {
      if (message.parentNode) {
        message.classList.add("slide-out");
        setTimeout(() => {
          if (message.parentNode) {
            message.parentNode.removeChild(message);
          }
        }, 300);
      }
    }, 3000);
  }

  toggleAdminPanel() {
    const panel = document.getElementById("admin-panel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  }

  closeAdminPanel() {
    document.getElementById("admin-panel").style.display = "none";
  }

  changeCurrency(newCurrency) {
    if (this.currentCurrency === newCurrency) return;
    
    const oldRate = this.exchangeRates[this.currentCurrency];
    const newRate = this.exchangeRates[newCurrency];
    
    if (this.vendingMachine.insertedMoney > 0) {
      this.vendingMachine.insertedMoney = Math.round((this.vendingMachine.insertedMoney / oldRate) * newRate * 100) / 100;
    }
    
    this.currentCurrency = newCurrency;
    this.updateDisplay();
    
    this.showMessage(`💱 Devise changée vers ${newCurrency}. Crédit converti.`, "info");
  }
  
  formatPrice(price) {
    const convertedPrice = Math.round((price / this.exchangeRates.EUR) * this.exchangeRates[this.currentCurrency] * 100) / 100;
    const symbol = this.currencySymbols[this.currentCurrency];
    return `${convertedPrice.toFixed(2)}${symbol}`;
  }
  
  formatBalance(amount) {
    const symbol = this.currencySymbols[this.currentCurrency];
    return `${amount.toFixed(2)}${symbol}`;
  }
  
  testCurrencyConversion() {
    try {
      const oldCurrency = this.currentCurrency;
      let newCurrency;
      
      if (this.currentCurrency === "EUR") {
        newCurrency = "USD";
      } else {
        newCurrency = "EUR";
      }
      
      this.changeCurrency(newCurrency);
      
      document.getElementById("currency-select").value = newCurrency;
      
      const button = document.getElementById("test-currency-btn");
      if (newCurrency === "USD") {
        button.textContent = "Revenir en EUR (€)";
      } else {
        button.textContent = "Passer en USD ($)";
      }
      
      const currencyName = newCurrency === "USD" ? "dollars" : "euros";
      this.showMessage(`💱 Devise changée de ${oldCurrency} vers ${newCurrency}\n🔄 Tous les prix et montants sont maintenant en ${currencyName}`, "success");
    } catch (error) {
      this.showMessage(`❌ Erreur lors du changement de devise: ${error.message}`, "error");
    }
  }

  refillCoinsFromExternal() {
    try {
      const refilled = this.vendingMachine.coinManager.refillFromExternal(1.0, 10);
      const coinValue = this.formatBalance(1.0);
      this.showMessage(`✅ Rechargé ${refilled} pièces de ${coinValue} depuis le fournisseur externe`, "success");
      
      this.updateDisplay();
    } catch (error) {
      this.showMessage(`❌ Erreur lors du rechargement: ${error.message}`, "error");
    }
  }

  autoRestockProducts() {
    try {
      const products = this.vendingMachine.inventory.getAllProducts();
      let restockedProducts = [];
      
      Object.entries(products).forEach(([code, productData]) => {
        const currentStock = productData.stock;
        if (currentStock < 5) {
          const quantityToAdd = 5 - currentStock;
          this.vendingMachine.restockProduct(code, quantityToAdd);
          restockedProducts.push({
            code: code,
            name: productData.product.name,
            quantityAdded: quantityToAdd,
            newStock: 5
          });
        }
      });
      
      if (restockedProducts.length === 0) {
        this.showMessage(`ℹ️ Aucun produit à restacker. Tous les produits ont au moins 5 unités en stock.`, "info");
      } else {
        let message = `✅ Restocking automatique effectué:\n`;
        restockedProducts.forEach(product => {
          message += `• ${product.name} (${product.code}): +${product.quantityAdded} unités → Stock: ${product.newStock}\n`;
        });
        message += `📝 ${restockedProducts.length} transaction(s) loggée(s) automatiquement`;
        
        this.showMessage(message, "success");
        this.updateDisplay();
      }
    } catch (error) {
      this.showMessage(`❌ Erreur lors du restocking: ${error.message}`, "error");
    }
  }

  showTransactionLogs() {
    const transactions = this.vendingMachine.transactionLogger.getAllTransactions();
    const recentTx = transactions.slice(-3);
    
    let logMessage = `📊 Total transactions: ${transactions.length}\n\n`;
    logMessage += `📋 Dernières transactions:\n`;
    
    recentTx.forEach((tx, index) => {
      const time = tx.timestamp.toLocaleTimeString();
      logMessage += `${index + 1}. [${time}] ${tx.type}`;
      
      if (tx.type === "PURCHASE") {
        const txCurrency = tx.currency || "EUR";
        const txRate = tx.exchangeRate || 1;
        const symbol = this.currencySymbols[txCurrency];
        
        const originalProductPrice = Math.round((tx.productPrice / this.exchangeRates.EUR) * txRate * 100) / 100;
        const originalAmountPaid = Math.round((tx.amountPaid / this.exchangeRates.EUR) * txRate * 100) / 100;
        const originalChange = Math.round((tx.totalChange / this.exchangeRates.EUR) * txRate * 100) / 100;
        
        logMessage += ` - ${tx.productName} (${originalProductPrice.toFixed(2)}${symbol})`;
        logMessage += ` - Payé: ${originalAmountPaid.toFixed(2)}${symbol}`;
        if (tx.totalChange > 0) logMessage += ` - Rendu: ${originalChange.toFixed(2)}${symbol}`;
      } else if (tx.type === "RESTOCK") {
        logMessage += ` - Produit: ${tx.productId}`;
        logMessage += ` - Quantité: +${tx.details.quantity}`;
      } else if (tx.type === "REFUND") {
        logMessage += ` - Montant rendu: ${this.formatBalance(tx.totalAmount)}`;
        if (tx.coinsReturned && tx.coinsReturned.length > 0) {
          const coinsList = tx.coinsReturned.map(coin => this.formatBalance(coin)).join(", ");
          logMessage += ` - Pièces: ${coinsList}`;
        }
      } else if (tx.type === "CANCELLATION") {
        logMessage += ` - Montant remboursé: ${this.formatBalance(tx.amountRefunded)}`;
      } else if (tx.productId) {
        logMessage += ` - Produit: ${tx.productId}`;
      }
      
      if (tx.amount > 0) logMessage += ` - Montant: ${this.formatBalance(tx.amount)}`;
      if (tx.success !== undefined) {
        logMessage += tx.success ? ` ✅` : ` ❌`;
      }
      logMessage += `\n`;
    });
    
    this.showMessage(logMessage, "info");
  }

  updateCoinButtons() {
    const coinButtons = document.querySelectorAll(".coin-btn");
    coinButtons.forEach(btn => {
      const value = parseFloat(btn.dataset.value);
      const convertedValue = Math.round((value / this.exchangeRates.EUR) * this.exchangeRates[this.currentCurrency] * 100) / 100;
      const symbol = this.currencySymbols[this.currentCurrency];
      
      if (this.currentCurrency === "EUR") {
        if (value < 1) {
          btn.textContent = `${Math.round(value * 100)}¢`;
        } else {
          btn.textContent = `${value}€`;
        }
      } else if (this.currentCurrency === "USD") {
        if (convertedValue < 1) {
          btn.textContent = `${Math.round(convertedValue * 100)}¢`;
        } else {
          btn.textContent = `$${convertedValue.toFixed(2)}`;
        }
      } else if (this.currentCurrency === "GBP") {
        if (convertedValue < 1) {
          btn.textContent = `${Math.round(convertedValue * 100)}p`;
        } else {
          btn.textContent = `£${convertedValue.toFixed(2)}`;
        }
      }
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new VendingMachineUI();
});
