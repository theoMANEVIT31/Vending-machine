const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;
app.use(express.static("public"));
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
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.listen(PORT, () => {
  console.log(
    `🚀 Distributeur automatique démarré sur http://localhost:${PORT}`
  );
  console.log(`📱 Interface web accessible dans votre navigateur`);
  console.log(`🔧 Mode administrateur: cliquez sur l'icône d'engrenage`);
});
module.exports = app;
