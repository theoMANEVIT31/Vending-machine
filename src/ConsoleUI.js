const readlineSync = require("readline-sync");
const VendingMachine = require("./VendingMachine");

/**
 * Interface utilisateur console pour le distributeur automatique
 */
class ConsoleUI {
  constructor() {
    this.vendingMachine = new VendingMachine();
    this.vendingMachine.initialize();
  }

  /**
   * Démarre l'interface utilisateur
   */
  start() {
    console.log("\n🎰 === DISTRIBUTEUR AUTOMATIQUE === 🎰\n");
    console.log(
      "Bienvenue ! Choisissez votre produit et insérez votre argent.\n"
    );

    while (true) {
      this.showMainMenu();
      const choice = readlineSync.question("Votre choix: ");

      switch (choice) {
        case "1":
          this.showProducts();
          break;
        case "2":
          this.selectProduct();
          break;
        case "3":
          this.insertMoney();
          break;
        case "4":
          this.purchase();
          break;
        case "5":
          this.cancel();
          break;
        case "6":
          this.showStatus();
          break;
        case "7":
          this.adminMenu();
          break;
        case "8":
          this.showStatistics();
          break;
        case "0":
          console.log(
            "\nMerci d'avoir utilisé notre distributeur ! Au revoir ! 👋\n"
          );
          return;
        default:
          console.log("\n❌ Choix invalide. Veuillez réessayer.\n");
      }
    }
  }

  /**
   * Affiche le menu principal
   */
  showMainMenu() {
    const status = this.vendingMachine.getStatus();

    console.log("=".repeat(50));
    console.log("💰 Argent inséré:", status.insertedMoneyFormatted);
    console.log(
      "📦 Produit sélectionné:",
      status.selectedProduct
        ? `${status.selectedProduct.name} (${status.selectedProduct.priceFormatted})`
        : "Aucun"
    );
    console.log("=".repeat(50));
    console.log("1. 📋 Voir les produits disponibles");
    console.log("2. 🎯 Sélectionner un produit");
    console.log("3. 💵 Insérer de l'argent");
    console.log("4. 🛒 Acheter");
    console.log("5. ❌ Annuler et récupérer l'argent");
    console.log("6. 📊 Voir l'état de la machine");
    console.log("7. 🔧 Menu administrateur");
    console.log("8. 📈 Statistiques");
    console.log("0. 🚪 Quitter");
    console.log("=".repeat(50));
  }

  /**
   * Affiche la liste des produits
   */
  showProducts() {
    const status = this.vendingMachine.getStatus();

    console.log("\n📦 === PRODUITS DISPONIBLES === 📦\n");

    if (status.availableProducts.length === 0) {
      console.log("❌ Aucun produit disponible actuellement.\n");
      return;
    }

    console.log("Code | Produit       | Prix     | Stock");
    console.log("-".repeat(40));

    status.availableProducts.forEach((product) => {
      console.log(
        `${product.id.padEnd(4)} | ${product.name.padEnd(
          13
        )} | ${product.priceFormatted.padEnd(8)} | ${product.quantity}`
      );
    });

    console.log("\n");
  }

  /**
   * Sélectionne un produit
   */
  selectProduct() {
    this.showProducts();

    const productId = readlineSync
      .question("Entrez le code du produit: ")
      .toUpperCase();
    const result = this.vendingMachine.selectProduct(productId);

    if (result.success) {
      console.log(`\n✅ ${result.message}`);
      console.log(`💰 Prix: ${result.product.priceFormatted}\n`);
    } else {
      console.log(`\n❌ ${result.message}\n`);
    }
  }

  /**
   * Insère de l'argent
   */
  insertMoney() {
    console.log("\n💵 === INSÉRER DE L'ARGENT === 💵\n");
    console.log("Dénominations acceptées:");
    console.log("1 = 0,01€  |  2 = 0,02€  |  5 = 0,05€  |  10 = 0,10€");
    console.log("20 = 0,20€ |  50 = 0,50€ |  100 = 1,00€ |  200 = 2,00€");
    console.log(
      "500 = 5,00€ | 1000 = 10,00€ | 2000 = 20,00€ | 5000 = 50,00€\n"
    );

    const input = readlineSync.question(
      "Entrez la valeur en centimes (ou 0 pour retour): "
    );
    const amount = parseInt(input);

    if (amount === 0) return;

    if (isNaN(amount) || amount < 0) {
      console.log("\n❌ Montant invalide.\n");
      return;
    }

    const result = this.vendingMachine.insertMoney(amount);

    if (result.success) {
      console.log(`\n✅ ${result.message}`);
      console.log(`💰 Total inséré: ${result.totalInsertedFormatted}\n`);
    } else {
      console.log(`\n❌ ${result.message}\n`);
    }
  }

  /**
   * Effectue l'achat
   */
  purchase() {
    const result = this.vendingMachine.purchase();

    if (result.success) {
      console.log(`\n🎉 ${result.message}`);
      console.log(`📦 Produit: ${result.product.name}`);

      if (result.change > 0) {
        console.log(`💰 Monnaie rendue: ${result.changeFormatted}`);
        console.log("Détail de la monnaie:");
        result.changeCoins.forEach((coin) => {
          console.log(`  ${coin.count}x ${coin.formatted}`);
        });
      }
      console.log("\nMerci pour votre achat ! 😊\n");
    } else {
      console.log(`\n❌ ${result.message}\n`);
    }
  }

  /**
   * Annule la transaction
   */
  cancel() {
    const result = this.vendingMachine.cancel();

    if (result.success) {
      console.log(`\n✅ ${result.message}`);
      console.log(`💰 Argent rendu: ${result.refundFormatted}`);

      if (result.refundCoins.length > 0) {
        console.log("Détail du remboursement:");
        result.refundCoins.forEach((coin) => {
          console.log(`  ${coin.count}x ${coin.formatted}`);
        });
      }
      console.log();
    } else {
      console.log(`\n❌ ${result.message}\n`);
    }
  }

  /**
   * Affiche l'état de la machine
   */
  showStatus() {
    const status = this.vendingMachine.getStatus();

    console.log("\n📊 === ÉTAT DE LA MACHINE === 📊\n");
    console.log(`💰 Argent inséré: ${status.insertedMoneyFormatted}`);
    console.log(
      `📦 Produit sélectionné: ${
        status.selectedProduct
          ? `${status.selectedProduct.name} (${status.selectedProduct.priceFormatted})`
          : "Aucun"
      }`
    );
    console.log(`🏦 Total dans la machine: ${status.totalMoneyFormatted}`);

    console.log("\n📦 Inventaire:");
    console.log("Code | Produit       | Prix     | Stock");
    console.log("-".repeat(40));

    const allProducts = this.vendingMachine.inventory.getAllProducts();
    allProducts.forEach((product) => {
      const available = product.quantity > 0 ? "✅" : "❌";
      console.log(
        `${product.id.padEnd(4)} | ${product.name.padEnd(
          13
        )} | ${this.vendingMachine.coinManager
          .formatAmount(product.price)
          .padEnd(8)} | ${product.quantity} ${available}`
      );
    });

    console.log("\n");
  }

  /**
   * Menu administrateur
   */
  adminMenu() {
    while (true) {
      console.log("\n🔧 === MENU ADMINISTRATEUR === 🔧\n");
      console.log("1. 📦 Réapprovisionner un produit");
      console.log("2. 💰 Ajouter de la monnaie");
      console.log("3. 📈 Voir les statistiques détaillées");
      console.log("4. 📋 Historique des transactions");
      console.log("0. 🔙 Retour au menu principal");
      console.log("=".repeat(40));

      const choice = readlineSync.question("Votre choix: ");

      switch (choice) {
        case "1":
          this.restockProduct();
          break;
        case "2":
          this.addCoins();
          break;
        case "3":
          this.showDetailedStatistics();
          break;
        case "4":
          this.showTransactionHistory();
          break;
        case "0":
          return;
        default:
          console.log("\n❌ Choix invalide.\n");
      }
    }
  }

  /**
   * Réapprovisionne un produit
   */
  restockProduct() {
    this.showStatus();

    const productId = readlineSync
      .question("Code du produit à réapprovisionner: ")
      .toUpperCase();
    const quantity = parseInt(readlineSync.question("Quantité à ajouter: "));

    if (isNaN(quantity) || quantity <= 0) {
      console.log("\n❌ Quantité invalide.\n");
      return;
    }

    const result = this.vendingMachine.restockProduct(productId, quantity);
    console.log(`\n${result.success ? "✅" : "❌"} ${result.message}\n`);
  }

  /**
   * Ajoute de la monnaie
   */
  addCoins() {
    console.log("\n💰 === AJOUTER DE LA MONNAIE === 💰\n");

    const denomination = parseInt(
      readlineSync.question("Dénomination (en centimes): ")
    );
    const count = parseInt(readlineSync.question("Nombre de pièces/billets: "));

    if (isNaN(denomination) || isNaN(count) || count <= 0) {
      console.log("\n❌ Valeurs invalides.\n");
      return;
    }

    const result = this.vendingMachine.addCoins(denomination, count);
    console.log(`\n${result.success ? "✅" : "❌"} ${result.message}\n`);
  }

  /**
   * Affiche les statistiques détaillées
   */
  showDetailedStatistics() {
    const stats = this.vendingMachine.getStatistics();

    console.log("\n📈 === STATISTIQUES DÉTAILLÉES === 📈\n");
    console.log(`📊 Total des transactions: ${stats.totalTransactions}`);
    console.log(`✅ Ventes réussies: ${stats.successfulSales}`);
    console.log(
      `💰 Chiffre d'affaires: ${this.vendingMachine.coinManager.formatAmount(
        stats.totalRevenue
      )}`
    );
    console.log(`❌ Erreurs: ${stats.errors}`);
    console.log(`🔄 Annulations: ${stats.cancellations}`);
    console.log(`📈 Taux de réussite: ${stats.successRate}`);
    console.log("\n");
  }

  /**
   * Affiche l'historique des transactions
   */
  showTransactionHistory() {
    const transactions = this.vendingMachine.getTransactionHistory();

    console.log("\n📋 === HISTORIQUE DES TRANSACTIONS === 📋\n");

    if (transactions.length === 0) {
      console.log("Aucune transaction enregistrée.\n");
      return;
    }

    console.log("Date/Heure          | Type    | Produit | Montant  | Statut");
    console.log("-".repeat(65));

    transactions.slice(-20).forEach((transaction) => {
      const date = transaction.timestamp.toLocaleString();
      const type = transaction.type.padEnd(7);
      const product = (transaction.productId || "-").padEnd(7);
      const amount = this.vendingMachine.coinManager
        .formatAmount(transaction.amount)
        .padEnd(8);
      const status = transaction.success ? "✅" : "❌";

      console.log(`${date} | ${type} | ${product} | ${amount} | ${status}`);
    });

    if (transactions.length > 20) {
      console.log(
        `\n... et ${transactions.length - 20} transactions plus anciennes`
      );
    }

    console.log("\n");
  }

  /**
   * Affiche les statistiques simples
   */
  showStatistics() {
    const stats = this.vendingMachine.getStatistics();

    console.log("\n📈 === STATISTIQUES === 📈\n");
    console.log(`📊 Total des transactions: ${stats.totalTransactions}`);
    console.log(`✅ Ventes réussies: ${stats.successfulSales}`);
    console.log(
      `💰 Chiffre d'affaires: ${this.vendingMachine.coinManager.formatAmount(
        stats.totalRevenue
      )}`
    );
    console.log(`📈 Taux de réussite: ${stats.successRate}`);
    console.log("\n");
  }
}

module.exports = ConsoleUI;
