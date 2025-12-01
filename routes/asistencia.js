import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Crear pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Registrar asistencia
router.post("/", async (req, res) => {
  try {
    const { id_alumno, id_maestro, estado, fecha } = req.body;
    
    if (!id_alumno || !estado) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    
    const fechaAsistencia = fecha || new Date().toISOString().split('T')[0];
    
    // Verificar si ya existe un registro para este alumno en esta fecha
    const [existing] = await pool.query(
      `SELECT id_asistencia FROM asistencia 
       WHERE id_alumno = ? AND fecha = ?`,
      [id_alumno, fechaAsistencia]
    );
    
    if (existing.length > 0) {
      // Actualizar el registro existente
      await pool.query(
        `UPDATE asistencia 
         SET estado = ?, id_maestro = ?, hora_registro = NOW()
         WHERE id_asistencia = ?`,
        [estado, id_maestro, existing[0].id_asistencia]
      );
      
      return res.json({ 
        message: "Asistencia actualizada correctamente",
        id_asistencia: existing[0].id_asistencia,
        actualizado: true
      });
    }
    
    // Crear nuevo registro
    const [result] = await pool.query(
      `INSERT INTO asistencia (id_alumno, id_maestro, estado, fecha, hora_registro)
       VALUES (?, ?, ?, ?, NOW())`,
      [id_alumno, id_maestro || null, estado, fechaAsistencia]
    );
    
    res.status(201).json({
      message: "Asistencia registrada correctamente",
      id_asistencia: result.insertId
    });
  } catch (error) {
    console.error("Error registrando asistencia:", error);
    res.status(500).json({ error: "Error al registrar asistencia" });
  }
});

// Obtener asistencia de un alumno
router.get("/alumno/:id", async (req, res) => {
  try {
    const [asistencias] = await pool.query(
      `SELECT a.*, u.nombre_completo as nombre_maestro
       FROM asistencia a
       LEFT JOIN usuarios u ON a.id_maestro = u.id_usuario
       WHERE a.id_alumno = ?
       ORDER BY a.fecha DESC
       LIMIT 30`,
      [req.params.id]
    );
    
    res.json(asistencias);
  } catch (error) {
    console.error("Error obteniendo asistencia:", error);
    res.status(500).json({ error: "Error al obtener asistencia" });
  }
});

// Obtener asistencia de un grupo en una fecha
router.get("/grupo/:id_grupo", async (req, res) => {
  try {
    const fecha = req.query.fecha || new Date().toISOString().split('T')[0];
    
    const [asistencias] = await pool.query(
      `SELECT a.*, u.nombre_completo, u.foto_perfil
       FROM asignaciones_grupos ag
       INNER JOIN usuarios u ON ag.id_usuario = u.id_usuario
       LEFT JOIN asistencia a ON u.id_usuario = a.id_alumno AND a.fecha = ?
       WHERE ag.id_grupo = ? AND ag.activa = 1 AND u.rol = 'alumno'
       ORDER BY u.nombre_completo`,
      [fecha, req.params.id_grupo]
    );
    
    res.json(asistencias);
  } catch (error) {
    console.error("Error obteniendo asistencia del grupo:", error);
    res.status(500).json({ error: "Error al obtener asistencia" });
  }
});

// Obtener resumen de asistencia de un alumno
router.get("/resumen/:id_alumno", async (req, res) => {
  try {
    const [resumen] = await pool.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'presente' THEN 1 ELSE 0 END) as presentes,
        SUM(CASE WHEN estado = 'tarde' THEN 1 ELSE 0 END) as tardes,
        SUM(CASE WHEN estado = 'ausente' THEN 1 ELSE 0 END) as ausentes,
        SUM(CASE WHEN estado = 'justificado' THEN 1 ELSE 0 END) as justificados
       FROM asistencia
       WHERE id_alumno = ?`,
      [req.params.id_alumno]
    );
    
    res.json(resumen[0]);
  } catch (error) {
    console.error("Error obteniendo resumen:", error);
    res.status(500).json({ error: "Error al obtener resumen" });
  }
});

export default router;
