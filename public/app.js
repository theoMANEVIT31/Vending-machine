import { VendingMachine } from "./modules/VendingMachine.js";
import { Product } from "./modules/Product.js";
class VendingMachineUI {
  constructor() {
    this.vendingMachine = new VendingMachine();
    this.selectedProduct = null;
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
  }
  insertCoin(value, buttonElement) {
    try {
      buttonElement.classList.add("coin-insert-animation");
      setTimeout(() => {
        buttonElement.classList.remove("coin-insert-animation");
      }, 600);
      this.vendingMachine.insertCoin(value);
      this.updateDisplay();
      this.showMessage(`Pièce de ${value.toFixed(2)}€ insérée`, "success");
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
    const coinsList = coins.map((coin) => `${coin.toFixed(2)}€`).join(", ");
    slot.innerHTML = `
            <i class="fas fa-coins"></i>
            <span><strong>${total.toFixed(2)}€</strong><br>${coinsList}</span>
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
  }
  updateBalance() {
    const balanceElement = document.getElementById("balance");
    balanceElement.textContent = `${this.vendingMachine.insertedMoney.toFixed(
      2
    )}€`;
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
                <div class="product-price">${productData.product.price.toFixed(
                  2
                )}€</div>
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
}
document.addEventListener("DOMContentLoaded", () => {
  new VendingMachineUI();
});
