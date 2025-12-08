import express from "express";
import Escuela from "../models/escuela.js";

const router = express.Router();

// Obtener todas las escuelas
router.get("/", (req, res) => {
  Escuela.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener escuela por ID
router.get("/:id", (req, res) => {
  Escuela.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Escuela no encontrada" });
    res.json(results[0]);
  });
});

// Crear nueva escuela
router.post("/", (req, res) => {
  Escuela.create(req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Escuela creada", id: results.insertId });
  });
});

// Actualizar escuela
router.put("/:id", (req, res) => {
  Escuela.update(req.params.id, req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Escuela actualizada" });
  });
});

// Eliminar escuela
router.delete("/:id", (req, res) => {
  Escuela.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Escuela eliminada" });
  });
});

export default router;