import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Crear pool de conexiones con promesas
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Obtener todos los tickets de una escuela
router.get('/escuela/:id_escuela', async (req, res) => {
  try {
    const { id_escuela } = req.params;
    const { estado, prioridad, categoria, archivados } = req.query;

    let query = `
      SELECT 
        t.*,
        u.nombre_completo as usuario_nombre,
        u.rol as usuario_rol,
        (SELECT COUNT(*) FROM respuestas_tickets r WHERE r.id_ticket = t.id_ticket) as num_respuestas
      FROM consultas_tickets t
      LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
      WHERE t.id_escuela = ?
    `;
    const params = [id_escuela];

    // Filtro para tickets archivados o activos
    if (archivados === 'true') {
      query += ` AND t.estado = 'archivado'`;
    } else if (archivados === 'false') {
      query += ` AND t.estado != 'archivado'`;
    }

    // Filtros adicionales
    if (estado && estado !== 'all') {
      query += ` AND t.estado = ?`;
      params.push(estado);
    }

    if (prioridad && prioridad !== 'all') {
      query += ` AND t.prioridad = ?`;
      params.push(prioridad);
    }

    if (categoria && categoria !== 'all') {
      query += ` AND t.categoria = ?`;
      params.push(categoria);
    }

    query += ` ORDER BY 
      CASE t.prioridad 
        WHEN 'alta' THEN 1 
        WHEN 'media' THEN 2 
        WHEN 'baja' THEN 3 
      END,
      t.fecha_creacion DESC`;

    const [tickets] = await pool.query(query, params);
    res.json(tickets);
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    res.status(500).json({ error: 'Error al obtener tickets' });
  }
});

// Obtener estadísticas de tickets
router.get('/escuela/:id_escuela/stats', async (req, res) => {
  try {
    const { id_escuela } = req.params;

    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'abierto' THEN 1 ELSE 0 END) as abiertos,
        SUM(CASE WHEN estado = 'en_proceso' THEN 1 ELSE 0 END) as en_proceso,
        SUM(CASE WHEN estado = 'respondido' THEN 1 ELSE 0 END) as respondidos,
        SUM(CASE WHEN estado = 'archivado' THEN 1 ELSE 0 END) as archivados,
        SUM(CASE WHEN prioridad = 'alta' AND estado != 'archivado' THEN 1 ELSE 0 END) as alta_prioridad
      FROM consultas_tickets
      WHERE id_escuela = ?
    `, [id_escuela]);

    res.json(stats[0]);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Obtener un ticket específico con sus respuestas
router.get('/:id_ticket', async (req, res) => {
  try {
    const { id_ticket } = req.params;

    const [tickets] = await pool.query(`
      SELECT 
        t.*,
        u.nombre_completo as usuario_nombre,
        u.rol as usuario_rol,
        u.foto_perfil as usuario_foto
      FROM consultas_tickets t
      LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
      WHERE t.id_ticket = ?
    `, [id_ticket]);

    if (tickets.length === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    // Obtener respuestas
    const [respuestas] = await pool.query(`
      SELECT 
        r.*,
        u.nombre_completo as usuario_nombre,
        u.rol as usuario_rol
      FROM respuestas_tickets r
      LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
      WHERE r.id_ticket = ?
      ORDER BY r.fecha_respuesta ASC
    `, [id_ticket]);

    res.json({
      ...tickets[0],
      respuestas
    });
  } catch (error) {
    console.error('Error al obtener ticket:', error);
    res.status(500).json({ error: 'Error al obtener ticket' });
  }
});

// Crear un nuevo ticket
router.post('/', async (req, res) => {
  try {
    const { id_usuario, id_escuela, asunto, contenido, categoria, prioridad } = req.body;

    const [result] = await pool.query(`
      INSERT INTO consultas_tickets 
      (id_usuario, id_escuela, asunto, contenido, categoria, prioridad, estado, fecha_creacion, fecha_actualizacion)
      VALUES (?, ?, ?, ?, ?, ?, 'abierto', NOW(), NOW())
    `, [id_usuario, id_escuela, asunto, contenido, categoria || 'general', prioridad || 'media']);

    res.status(201).json({ 
      success: true, 
      id_ticket: result.insertId,
      message: 'Ticket creado exitosamente' 
    });
  } catch (error) {
    console.error('Error al crear ticket:', error);
    res.status(500).json({ error: 'Error al crear ticket' });
  }
});

// Responder a un ticket
router.post('/:id_ticket/responder', async (req, res) => {
  try {
    const { id_ticket } = req.params;
    const { id_usuario, contenido } = req.body;

    // Insertar respuesta
    await pool.query(`
      INSERT INTO respuestas_tickets (id_ticket, id_usuario, contenido, fecha_respuesta)
      VALUES (?, ?, ?, NOW())
    `, [id_ticket, id_usuario, contenido]);

    // Actualizar estado del ticket a 'respondido' si estaba abierto
    await pool.query(`
      UPDATE consultas_tickets 
      SET estado = CASE WHEN estado = 'abierto' THEN 'respondido' ELSE estado END,
          fecha_actualizacion = NOW()
      WHERE id_ticket = ?
    `, [id_ticket]);

    res.json({ success: true, message: 'Respuesta enviada' });
  } catch (error) {
    console.error('Error al responder ticket:', error);
    res.status(500).json({ error: 'Error al responder ticket' });
  }
});

// Cambiar estado de un ticket
router.put('/:id_ticket/estado', async (req, res) => {
  try {
    const { id_ticket } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['abierto', 'en_proceso', 'respondido', 'archivado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }

    await pool.query(`
      UPDATE consultas_tickets 
      SET estado = ?, fecha_actualizacion = NOW()
      WHERE id_ticket = ?
    `, [estado, id_ticket]);

    res.json({ success: true, message: `Ticket actualizado a ${estado}` });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ error: 'Error al cambiar estado' });
  }
});

// Archivar ticket
router.put('/:id_ticket/archivar', async (req, res) => {
  try {
    const { id_ticket } = req.params;

    await pool.query(`
      UPDATE consultas_tickets 
      SET estado = 'archivado', fecha_actualizacion = NOW()
      WHERE id_ticket = ?
    `, [id_ticket]);

    res.json({ success: true, message: 'Ticket archivado' });
  } catch (error) {
    console.error('Error al archivar ticket:', error);
    res.status(500).json({ error: 'Error al archivar ticket' });
  }
});

// Eliminar ticket
router.delete('/:id_ticket', async (req, res) => {
  try {
    const { id_ticket } = req.params;

    // Primero eliminar las respuestas
    await pool.query('DELETE FROM respuestas_tickets WHERE id_ticket = ?', [id_ticket]);
    
    // Luego eliminar el ticket
    await pool.query('DELETE FROM consultas_tickets WHERE id_ticket = ?', [id_ticket]);

    res.json({ success: true, message: 'Ticket eliminado' });
  } catch (error) {
    console.error('Error al eliminar ticket:', error);
    res.status(500).json({ error: 'Error al eliminar ticket' });
  }
});

// Exportar tickets como JSON (el frontend convertirá a CSV)
router.get('/escuela/:id_escuela/export', async (req, res) => {
  try {
    const { id_escuela } = req.params;

    const [tickets] = await pool.query(`
      SELECT 
        t.id_ticket,
        u.nombre_completo as usuario,
        u.rol as rol_usuario,
        t.asunto,
        t.contenido,
        t.categoria,
        t.prioridad,
        t.estado,
        t.fecha_creacion,
        t.fecha_actualizacion,
        (SELECT COUNT(*) FROM respuestas_tickets r WHERE r.id_ticket = t.id_ticket) as num_respuestas
      FROM consultas_tickets t
      LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
      WHERE t.id_escuela = ?
      ORDER BY t.fecha_creacion DESC
    `, [id_escuela]);

    res.json(tickets);
  } catch (error) {
    console.error('Error al exportar tickets:', error);
    res.status(500).json({ error: 'Error al exportar tickets' });
  }
});

export default router;
