const ConsoleUI = require("./ConsoleUI");

/**
 * Point d'entrée de l'application
 */
function main() {
  try {
    const ui = new ConsoleUI();
    ui.start();
  } catch (error) {
    console.error(
      "❌ Erreur lors du démarrage de l'application:",
      error.message
    );
    process.exit(1);
  }
}

// Démarrer l'application si ce fichier est exécuté directement
if (require.main === module) {
  main();
}

module.exports = main;
