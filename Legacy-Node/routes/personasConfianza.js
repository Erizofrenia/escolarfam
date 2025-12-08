import express from "express";
import PersonaConfianza from "../models/personasConfianza.js";

const router = express.Router();

// Obtener personas de confianza del padre
router.get("/:idPadre", (req, res) => {
  PersonaConfianza.getByPadre(req.params.idPadre, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Crear nueva persona de confianza
router.post("/", (req, res) => {
  PersonaConfianza.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Persona de confianza agregada", id_persona: result.insertId });
  });
});

// Establecer como predeterminada
router.put("/:idPersona/predeterminada", (req, res) => {
  const { id_padre } = req.body;
  PersonaConfianza.setPredeterminada(req.params.idPersona, id_padre, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Persona predeterminada actualizada" });
  });
});

// Eliminar persona de confianza
router.delete("/:idPersona", (req, res) => {
  PersonaConfianza.delete(req.params.idPersona, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Persona de confianza eliminada" });
  });
});

export default router;
