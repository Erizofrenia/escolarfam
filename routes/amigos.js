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

// Crear tabla de amigos si no existe
async function ensureAmigosTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS amigos (
        id_amistad INT PRIMARY KEY AUTO_INCREMENT,
        id_usuario INT NOT NULL,
        id_amigo INT NOT NULL,
        fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        FOREIGN KEY (id_amigo) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        UNIQUE KEY unique_amistad (id_usuario, id_amigo)
      )
    `);
    console.log('✅ Tabla amigos verificada/creada');
  } catch (error) {
    console.error('Error creando tabla amigos:', error);
  }
}

// Ejecutar al iniciar
ensureAmigosTable();

// Obtener lista de amigos de un usuario
router.get('/:id_usuario', async (req, res) => {
  try {
    const { id_usuario } = req.params;

    const [amigos] = await pool.query(`
      SELECT 
        a.id_amistad,
        a.fecha_agregado,
        u.id_usuario,
        u.nombre_completo,
        u.rol,
        u.foto_perfil,
        u.ultimo_acceso
      FROM amigos a
      INNER JOIN usuarios u ON a.id_amigo = u.id_usuario
      WHERE a.id_usuario = ?
      ORDER BY u.nombre_completo ASC
    `, [id_usuario]);

    res.json(amigos);
  } catch (error) {
    console.error('Error al obtener amigos:', error);
    res.status(500).json({ error: 'Error al obtener amigos' });
  }
});

// Verificar si ya son amigos
router.get('/:id_usuario/es-amigo/:id_amigo', async (req, res) => {
  try {
    const { id_usuario, id_amigo } = req.params;

    const [result] = await pool.query(`
      SELECT id_amistad FROM amigos 
      WHERE id_usuario = ? AND id_amigo = ?
    `, [id_usuario, id_amigo]);

    res.json({ esAmigo: result.length > 0 });
  } catch (error) {
    console.error('Error al verificar amistad:', error);
    res.status(500).json({ error: 'Error al verificar amistad' });
  }
});

// Agregar amigo (solo por escaneo de QR)
router.post('/agregar', async (req, res) => {
  try {
    const { id_usuario, id_amigo } = req.body;

    if (id_usuario === id_amigo) {
      return res.status(400).json({ error: 'No puedes agregarte a ti mismo' });
    }

    // Verificar que el usuario a agregar exista
    const [userExists] = await pool.query(
      'SELECT id_usuario FROM usuarios WHERE id_usuario = ?',
      [id_amigo]
    );

    if (userExists.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si ya son amigos
    const [existing] = await pool.query(
      'SELECT id_amistad FROM amigos WHERE id_usuario = ? AND id_amigo = ?',
      [id_usuario, id_amigo]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Ya son amigos' });
    }

    // Agregar amistad (bidireccional)
    await pool.query(`
      INSERT INTO amigos (id_usuario, id_amigo) VALUES (?, ?)
    `, [id_usuario, id_amigo]);

    // También agregar la relación inversa para que sea bidireccional
    await pool.query(`
      INSERT IGNORE INTO amigos (id_usuario, id_amigo) VALUES (?, ?)
    `, [id_amigo, id_usuario]);

    res.status(201).json({ 
      success: true, 
      message: 'Amigo agregado correctamente' 
    });
  } catch (error) {
    console.error('Error al agregar amigo:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ya son amigos' });
    }
    res.status(500).json({ error: 'Error al agregar amigo' });
  }
});

// Eliminar amigo
router.delete('/:id_usuario/:id_amigo', async (req, res) => {
  try {
    const { id_usuario, id_amigo } = req.params;

    // Eliminar ambas direcciones de la amistad
    await pool.query(`
      DELETE FROM amigos 
      WHERE (id_usuario = ? AND id_amigo = ?) 
         OR (id_usuario = ? AND id_amigo = ?)
    `, [id_usuario, id_amigo, id_amigo, id_usuario]);

    res.json({ success: true, message: 'Amigo eliminado' });
  } catch (error) {
    console.error('Error al eliminar amigo:', error);
    res.status(500).json({ error: 'Error al eliminar amigo' });
  }
});

export default router;
