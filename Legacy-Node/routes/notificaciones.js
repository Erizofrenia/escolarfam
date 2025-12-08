import express from "express";
import Notificacion from "../models/notificaciones.js";

const router = express.Router();

// Obtener notificaciones de un usuario
router.get("/:idUsuario", (req, res) => {
  Notificacion.getByUsuario(req.params.idUsuario, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Crear notificación
router.post("/", (req, res) => {
  Notificacion.create(req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Notificación creada", id: results.insertId });
  });
});

export default router;
