const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Servir les fichiers statiques depuis le dossier public
app.use(express.static("public"));

// Servir les modules source avec le bon type MIME
app.use(
  "/src",
  express.static("src", {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

// Route principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(
    `🚀 Distributeur automatique démarré sur http://localhost:${PORT}`
  );
  console.log(`📱 Interface web accessible dans votre navigateur`);
  console.log(`🔧 Mode administrateur: cliquez sur l'icône d'engrenage`);
});

module.exports = app;
