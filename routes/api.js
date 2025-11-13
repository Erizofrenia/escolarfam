const express = require("express");
const router = express.Router();

// Ejemplo: ruta simple GET
router.get("/mensaje", (req, res) => {
  res.json({ mensaje: "Hola, Erick. Node.js está vivo." });
});

// Ejemplo: ruta POST
router.post("/datos", (req, res) => {
  const datos = req.body;
  res.json({ recibido: datos });
});

module.exports = router;
