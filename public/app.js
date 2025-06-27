// Import des classes métier
import { VendingMachine } from "./modules/VendingMachine.js";
import { Product } from "./modules/Product.js";

class VendingMachineUI {
  constructor() {
    this.vendingMachine = new VendingMachine();
    this.selectedProduct = null;
    this.isAdminMode = false;
    this.initializeProducts();
    this.setupEventListeners();
    this.updateDisplay();
  }

  initializeProducts() {
    // Ajouter quelques produits de démonstration
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
    // Boutons de monnaie
    document.querySelectorAll(".coin-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const value = parseFloat(e.target.dataset.value);
        this.insertCoin(value, e.target);
      });
    });

    // Boutons d'action
    document.getElementById("cancel-btn").addEventListener("click", () => {
      this.cancelTransaction();
    });

    document
      .getElementById("return-change-btn")
      .addEventListener("click", () => {
        this.returnChange();
      });

    // Bouton admin
    document.getElementById("admin-toggle").addEventListener("click", () => {
      this.toggleAdminMode();
    });

    // Onglets admin
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Slots de récupération - permettre de vider en cliquant
    document.getElementById("product-slot").addEventListener("click", () => {
      this.clearProductSlot();
    });

    document.getElementById("change-slot").addEventListener("click", () => {
      this.clearChangeSlot();
    });
  }

  insertCoin(value, buttonElement) {
    try {
      // Animation de la pièce
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

      // Tenter l'achat automatiquement
      this.attemptPurchase();
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }

  attemptPurchase() {
    if (!this.selectedProduct) return;

    try {
      const result = this.vendingMachine.purchaseProduct(this.selectedProduct);

      // Afficher le produit dans le slot
      this.displayProduct(result.product);

      // Afficher la monnaie rendue si il y en a
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
    if (this.isAdminMode) {
      this.updateAdminDisplay();
    }
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

  toggleAdminMode() {
    this.isAdminMode = !this.isAdminMode;
    const adminSection = document.getElementById("admin-section");

    if (this.isAdminMode) {
      adminSection.style.display = "block";
      this.updateAdminDisplay();
      this.showMessage("Mode administrateur activé", "info");
    } else {
      adminSection.style.display = "none";
      this.showMessage("Mode administrateur désactivé", "info");
    }
  }

  switchTab(tabName) {
    // Gérer les boutons d'onglets
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

    // Gérer le contenu des onglets
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
    });
    document.getElementById(`${tabName}-tab`).classList.add("active");

    // Mettre à jour l'affichage selon l'onglet
    this.updateAdminDisplay(tabName);
  }

  updateAdminDisplay(activeTab = "inventory") {
    if (activeTab === "inventory") {
      this.updateInventoryTab();
    } else if (activeTab === "stats") {
      this.updateStatsTab();
    } else if (activeTab === "coins") {
      this.updateCoinsTab();
    }
  }

  updateInventoryTab() {
    const container = document.getElementById("inventory-list");
    const products = this.vendingMachine.inventory.getAllProducts();

    let html = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Nom</th>
                        <th>Prix</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

    Object.entries(products).forEach(([code, productData]) => {
      html += `
                <tr>
                    <td>${code}</td>
                    <td>${productData.product.name}</td>
                    <td>${productData.product.price.toFixed(2)}€</td>
                    <td>${productData.stock}</td>
                    <td>
                        <button onclick="ui.addStock('${code}')" class="action-btn" style="padding: 5px 10px; margin: 2px;">+1</button>
                        <button onclick="ui.removeStock('${code}')" class="action-btn" style="padding: 5px 10px; margin: 2px;">-1</button>
                    </td>
                </tr>
            `;
    });

    html += "</tbody></table>";
    container.innerHTML = html;
  }

  updateStatsTab() {
    const container = document.getElementById("stats-display");
    const stats = this.vendingMachine.getStatistics();

    let html = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${stats.totalTransactions}</div>
                    <div class="stat-label">Transactions totales</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.totalRevenue.toFixed(
                      2
                    )}€</div>
                    <div class="stat-label">Revenus totaux</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.totalProductsSold}</div>
                    <div class="stat-label">Produits vendus</div>
                </div>
            </div>
        `;

    if (stats.topSellingProducts && stats.topSellingProducts.length > 0) {
      html += `
                <h3>Produits les plus vendus</h3>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Quantité vendue</th>
                            <th>Revenus</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

      stats.topSellingProducts.forEach((item) => {
        html += `
                    <tr>
                        <td>${item.product}</td>
                        <td>${item.quantity}</td>
                        <td>${item.revenue.toFixed(2)}€</td>
                    </tr>
                `;
      });

      html += "</tbody></table>";
    }

    container.innerHTML = html;
  }

  updateCoinsTab() {
    const container = document.getElementById("coins-inventory");
    const coinInventory = this.vendingMachine.coinManager.getCoinInventory();

    let html = `
            <h3>Inventaire des pièces</h3>
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Dénomination</th>
                        <th>Quantité</th>
                        <th>Valeur totale</th>
                    </tr>
                </thead>
                <tbody>
        `;

    Object.entries(coinInventory).forEach(([denomination, quantity]) => {
      const value = parseFloat(denomination);
      const totalValue = value * quantity;

      html += `
                <tr>
                    <td>${value.toFixed(2)}€</td>
                    <td>${quantity}</td>
                    <td>${totalValue.toFixed(2)}€</td>
                </tr>
            `;
    });

    html += "</tbody></table>";

    const totalValue = Object.entries(coinInventory).reduce(
      (sum, [denomination, quantity]) => {
        return sum + parseFloat(denomination) * quantity;
      },
      0
    );

    html += `<p><strong>Valeur totale en caisse: ${totalValue.toFixed(
      2
    )}€</strong></p>`;

    container.innerHTML = html;
  }

  // Méthodes pour l'administration (appelées depuis les boutons)
  addStock(code) {
    try {
      const product = this.vendingMachine.inventory.getProduct(code);
      this.vendingMachine.inventory.addProduct(product, 1);
      this.updateDisplay();
      this.showMessage(`Stock ajouté pour ${code}`, "success");
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }

  removeStock(code) {
    try {
      const currentStock = this.vendingMachine.inventory.getStock(code);
      if (currentStock > 0) {
        this.vendingMachine.inventory.removeStock(code, 1);
        this.updateDisplay();
        this.showMessage(`Stock retiré pour ${code}`, "success");
      } else {
        this.showMessage("Stock déjà à zéro", "warning");
      }
    } catch (error) {
      this.showMessage(error.message, "error");
    }
  }

  showMessage(text, type = "info") {
    const container = document.getElementById("message-container");
    const message = document.createElement("div");
    message.className = `message ${type}`;
    message.textContent = text;

    container.appendChild(message);

    // Supprimer le message après 3 secondes
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 3000);
  }
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  window.ui = new VendingMachineUI();
});

export { VendingMachineUI };
