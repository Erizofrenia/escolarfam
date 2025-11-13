import express from "express";
import Usuario from "../models/usuarios.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", (req, res) => {
  Usuario.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener usuario por ID
router.get("/:id", (req, res) => {
  Usuario.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(results[0]);
  });
});

// Crear nuevo usuario
router.post("/", (req, res) => {
  Usuario.create(req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuario creado", id: results.insertId });
  });
});

// Actualizar usuario
router.put("/:id", (req, res) => {
  Usuario.update(req.params.id, req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuario actualizado" });
  });
});

// Eliminar usuario
router.delete("/:id", (req, res) => {
  Usuario.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuario eliminado" });
  });
});

export default router;
