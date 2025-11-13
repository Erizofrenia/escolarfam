import express from "express";
import connection from "../config/database.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  const { id_escuela, nombre_completo, email, password, rol } = req.body;
  const password_hash = await bcrypt.hash(password, 10);
  const sql = "INSERT INTO usuarios (id_escuela, nombre_completo, email, password_hash, rol) VALUES (?, ?, ?, ?, ?)";

  connection.query(sql, [id_escuela, nombre_completo, email, password_hash, rol], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuario registrado con éxito", id: results.insertId });
  });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM usuarios WHERE email = ?";

  connection.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: "Usuario no encontrado" });

    const usuario = results[0];
    const match = await bcrypt.compare(password, usuario.password_hash);
    if (!match) return res.status(401).json({ message: "Contraseña incorrecta" });

    res.json({ message: "Inicio de sesión exitoso", usuario });
  });
});

export default router;
