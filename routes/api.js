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

// Obtener personal docente (maestros y director)
router.get("/personal-docente/:id_escuela", async (req, res) => {
  try {
    const { id_escuela } = req.params;
    const db = req.app.get('db');
    
    const [personal] = await db.execute(`
      SELECT 
        id_usuario,
        nombre_completo,
        email,
        rol,
        foto_perfil,
        asignacion
      FROM usuarios 
      WHERE id_escuela = ? 
        AND rol IN ('maestro', 'admin') 
        AND activo = 1
      ORDER BY 
        CASE 
          WHEN rol = 'admin' THEN 1 
          WHEN rol = 'maestro' THEN 2 
        END,
        nombre_completo
    `, [id_escuela]);

    res.json({ personal });
  } catch (error) {
    console.error('Error al obtener personal docente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo ticket
router.post("/tickets", async (req, res) => {
  try {
    const { id_remitente, id_destinatario, asunto, prioridad, descripcion } = req.body;
    const db = req.app.get('db');
    
    // Validar que el destinatario sea director
    const [destinatario] = await db.execute(
      'SELECT rol, id_escuela FROM usuarios WHERE id_usuario = ?',
      [id_destinatario]
    );
    
    if (!destinatario.length || destinatario[0].rol !== 'admin') {
      return res.status(400).json({ error: 'El destinatario debe ser un director' });
    }
    
    // Obtener la escuela del remitente
    const [remitente] = await db.execute(
      'SELECT id_escuela FROM usuarios WHERE id_usuario = ?',
      [id_remitente]
    );
    
    if (!remitente.length) {
      return res.status(400).json({ error: 'Remitente no encontrado' });
    }
    
    // Crear el ticket
    const [result] = await db.execute(`
      INSERT INTO consultas_tickets 
      (id_usuario, id_escuela, asunto, contenido, prioridad, categoria, estado) 
      VALUES (?, ?, ?, ?, ?, ?, 'abierto')
    `, [
      id_remitente,
      remitente[0].id_escuela,
      asunto,
      descripcion,
      prioridad,
      asunto // Usar asunto como categoría por simplicidad
    ]);
    
    res.json({ 
      success: true, 
      ticketId: result.insertId,
      message: 'Ticket creado exitosamente' 
    });
    
  } catch (error) {
    console.error('Error al crear ticket:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
