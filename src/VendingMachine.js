const Product = require("./Product");
const Inventory = require("./Inventory");
const { Currency, CoinManager } = require("./CoinManager");
const { TransactionLogger } = require("./TransactionLogger");

/**
 * Distributeur automatique principal
 */
class VendingMachine {
  constructor(
    inventory = null,
    coinManager = null,
    transactionLogger = null,
    currency = new Currency("EUR", "Euro")
  ) {
    this.inventory = inventory || new Inventory();
    this.coinManager = coinManager || new CoinManager(currency);
    this.transactionLogger = transactionLogger || new TransactionLogger();
    this.insertedMoney = 0;
    this.selectedProduct = null;
  }

  /**
   * Initialise la machine avec des produits et de la monnaie
   */
  initialize() {
    // Ajouter des produits de démonstration
    this.inventory.addProduct(new Product("A1", "Coca-Cola", 150, 10));
    this.inventory.addProduct(new Product("A2", "Pepsi", 150, 8));
    this.inventory.addProduct(new Product("B1", "Chips", 120, 15));
    this.inventory.addProduct(new Product("B2", "Chocolat", 200, 5));
    this.inventory.addProduct(new Product("C1", "Eau", 100, 20));

    // Ajouter de la monnaie initiale
    this.coinManager.addCoins(1, 100); // 1 centime
    this.coinManager.addCoins(2, 100); // 2 centimes
    this.coinManager.addCoins(5, 100); // 5 centimes
    this.coinManager.addCoins(10, 50); // 10 centimes
    this.coinManager.addCoins(20, 50); // 20 centimes
    this.coinManager.addCoins(50, 50); // 50 centimes
    this.coinManager.addCoins(100, 30); // 1 euro
    this.coinManager.addCoins(200, 20); // 2 euros
    this.coinManager.addCoins(500, 10); // 5 euros
    this.coinManager.addCoins(1000, 5); // 10 euros
    this.coinManager.addCoins(2000, 2); // 20 euros
  }

  /**
   * Sélectionne un produit
   * @param {string} productId - ID du produit
   * @returns {Object} Informations sur la sélection
   */
  selectProduct(productId) {
    const product = this.inventory.getProduct(productId);

    if (!product) {
      const error = `Produit ${productId} non trouvé`;
      this.transactionLogger.log("error", productId, 0, false, { error });
      return { success: false, message: error };
    }

    if (!product.isAvailable()) {
      const error = `Produit ${product.name} non disponible`;
      this.transactionLogger.log("error", productId, 0, false, { error });
      return { success: false, message: error };
    }

    this.selectedProduct = product;
    return {
      success: true,
      message: `Produit sélectionné: ${product.name}`,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        priceFormatted: this.coinManager.formatAmount(product.price),
      },
    };
  }

  /**
   * Insère de l'argent
   * @param {number} amount - Montant en centimes
   * @returns {Object} État de l'insertion
   */
  insertMoney(amount) {
    const validDenominations = Array.from(
      this.coinManager.getDenominations().keys()
    );

    if (!validDenominations.includes(amount)) {
      return {
        success: false,
        message: `Dénomination ${this.coinManager.formatAmount(
          amount
        )} non acceptée`,
      };
    }

    this.insertedMoney += amount;
    this.coinManager.addCoins(amount, 1);

    return {
      success: true,
      message: `${this.coinManager.formatAmount(amount)} inséré`,
      totalInserted: this.insertedMoney,
      totalInsertedFormatted: this.coinManager.formatAmount(this.insertedMoney),
    };
  }

  /**
   * Effectue l'achat
   * @returns {Object} Résultat de l'achat
   */
  purchase() {
    if (!this.selectedProduct) {
      return { success: false, message: "Aucun produit sélectionné" };
    }

    const product = this.selectedProduct;

    if (this.insertedMoney < product.price) {
      const missing = product.price - this.insertedMoney;
      return {
        success: false,
        message: `Montant insuffisant. Il manque ${this.coinManager.formatAmount(
          missing
        )}`,
        missingAmount: missing,
      };
    }

    const changeAmount = this.insertedMoney - product.price;

    // Vérifier si on peut rendre la monnaie
    if (changeAmount > 0 && !this.coinManager.canMakeChange(changeAmount)) {
      const error = "Impossible de rendre la monnaie exacte";
      this.transactionLogger.log(
        "error",
        product.id,
        this.insertedMoney,
        false,
        {
          error,
          changeNeeded: changeAmount,
        }
      );
      return { success: false, message: error };
    }

    try {
      // Distribuer le produit
      this.inventory.dispenseProduct(product.id);

      // Rendre la monnaie
      let change = new Map();
      if (changeAmount > 0) {
        change = this.coinManager.dispenseChange(changeAmount);
      }

      // Enregistrer la transaction
      this.transactionLogger.log("sale", product.id, product.price, true, {
        productName: product.name,
        moneyInserted: this.insertedMoney,
        change: changeAmount,
      });

      const result = {
        success: true,
        message: `${product.name} distribué avec succès`,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
        },
        change: changeAmount,
        changeFormatted: this.coinManager.formatAmount(changeAmount),
        changeCoins: this.formatChangeCoins(change),
      };

      // Réinitialiser l'état
      this.insertedMoney = 0;
      this.selectedProduct = null;

      return result;
    } catch (error) {
      this.transactionLogger.log(
        "error",
        product.id,
        this.insertedMoney,
        false,
        {
          error: error.message,
        }
      );
      return { success: false, message: error.message };
    }
  }

  /**
   * Annule la transaction et rend l'argent inséré
   * @returns {Object} Résultat de l'annulation
   */
  cancel() {
    if (this.insertedMoney === 0) {
      return { success: false, message: "Aucun argent inséré" };
    }

    try {
      const change = this.coinManager.dispenseChange(this.insertedMoney);

      this.transactionLogger.log("cancel", null, this.insertedMoney, true, {
        message: "Transaction annulée par l'utilisateur",
      });

      const result = {
        success: true,
        message: "Transaction annulée",
        refund: this.insertedMoney,
        refundFormatted: this.coinManager.formatAmount(this.insertedMoney),
        refundCoins: this.formatChangeCoins(change),
      };

      // Réinitialiser l'état
      this.insertedMoney = 0;
      this.selectedProduct = null;

      return result;
    } catch (error) {
      this.transactionLogger.log("error", null, this.insertedMoney, false, {
        error: "Impossible de rendre l'argent inséré: " + error.message,
      });
      return {
        success: false,
        message: "Erreur lors du remboursement: " + error.message,
      };
    }
  }

  /**
   * Formate les pièces rendues pour l'affichage
   * @param {Map<number, number>} coins - Map des pièces
   * @returns {Array<Object>}
   */
  formatChangeCoins(coins) {
    const result = [];
    for (const [denomination, count] of coins) {
      result.push({
        value: denomination,
        count: count,
        formatted: this.coinManager.formatAmount(denomination),
      });
    }
    return result.sort((a, b) => b.value - a.value);
  }

  /**
   * Récupère l'état actuel de la machine
   * @returns {Object}
   */
  getStatus() {
    return {
      insertedMoney: this.insertedMoney,
      insertedMoneyFormatted: this.coinManager.formatAmount(this.insertedMoney),
      selectedProduct: this.selectedProduct
        ? {
            id: this.selectedProduct.id,
            name: this.selectedProduct.name,
            price: this.selectedProduct.price,
            priceFormatted: this.coinManager.formatAmount(
              this.selectedProduct.price
            ),
          }
        : null,
      availableProducts: this.inventory.getAvailableProducts().map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        priceFormatted: this.coinManager.formatAmount(p.price),
        quantity: p.quantity,
      })),
      totalMoney: this.coinManager.getTotalMoney(),
      totalMoneyFormatted: this.coinManager.formatAmount(
        this.coinManager.getTotalMoney()
      ),
    };
  }
}

module.exports = VendingMachine;
