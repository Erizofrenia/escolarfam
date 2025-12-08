import express from "express";
import Mensaje from "../models/mensajes.js";

const router = express.Router();

// Obtener conversaciones del usuario
router.get("/conversaciones/:idUsuario", (req, res) => {
  Mensaje.getConversaciones(req.params.idUsuario, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener mensajes de una conversación
router.get("/:idUsuario1/:idUsuario2", (req, res) => {
  Mensaje.getMensajesConversacion(req.params.idUsuario1, req.params.idUsuario2, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Enviar mensaje
router.post("/", (req, res) => {
  Mensaje.enviar(req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Mensaje enviado", id: results.insertId });
  });
});

// Marcar mensajes como leídos
router.put("/marcar-leidos/:idRemitente/:idDestinatario", (req, res) => {
  Mensaje.marcarComoLeidos(req.params.idRemitente, req.params.idDestinatario, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Mensajes marcados como leídos" });
  });
});

// Obtener contador de mensajes no leídos
router.get("/no-leidos/:idUsuario", (req, res) => {
  Mensaje.getNoLeidos(req.params.idUsuario, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total: results[0].total });
  });
});

export default router;
