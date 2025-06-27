/**
 * Point d'entrée de l'application
 * L'interface utilisateur est maintenant uniquement web (voir public/index.html)
 */
function main() {
  console.log("🎰 Distributeur Automatique");
  console.log("Interface web disponible sur http://localhost:3000");
  console.log("Utilisez 'npm start' pour démarrer le serveur web.");
}

// Démarrer l'application si ce fichier est exécuté directement
if (require.main === module) {
  main();
}

module.exports = main;
