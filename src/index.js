function main() {
  console.log("🎰 Distributeur Automatique");
  console.log("Interface web disponible sur : http://localhost:3000");
}

if (require.main === module) {
  main();
}

module.exports = main;
