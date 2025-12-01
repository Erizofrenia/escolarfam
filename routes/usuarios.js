import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import Usuario from "../models/usuarios.js";
import db from "../config/database.js";

const router = express.Router();

// Configurar multer para subida de fotos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../media/uploads"));
  },
  filename: (req, file, cb) => {
    // Generar nombre único con timestamp
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `perfil_${req.params.id}_${timestamp}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máx
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes (JPEG, PNG, GIF, WebP)"));
    }
  }
});

// Obtener todos los usuarios
router.get("/", (req, res) => {
  Usuario.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener directorio de personal (maestros y admins)
router.get("/staff/directorio", async (req, res) => {
  try {
    const [staff] = await db.promise().query(`
      SELECT 
        id_usuario,
        nombre_completo,
        rol,
        foto_perfil,
        email,
        asignacion
      FROM usuarios 
      WHERE rol IN ('maestro', 'admin') AND activo = 1
      ORDER BY 
        CASE rol WHEN 'admin' THEN 1 WHEN 'maestro' THEN 2 END,
        nombre_completo ASC
    `);
    res.json(staff);
  } catch (error) {
    console.error('Error obteniendo directorio de staff:', error);
    res.status(500).json({ error: 'Error al obtener directorio' });
  }
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
router.put("/:id", async (req, res) => {
  // Si solo se quiere actualizar la contraseña
  if (req.body.update_password_only && req.body.password) {
    try {
      const newPasswordHash = await bcrypt.hash(req.body.password, 10);
      Usuario.updatePasswordHash(req.params.id, newPasswordHash, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Contraseña actualizada" });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    Usuario.update(req.params.id, req.body, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Usuario actualizado" });
    });
  }
});

// Actualizar solo el correo electrónico
router.patch("/:id/email", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email requerido' });

  Usuario.updateEmail(req.params.id, email, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Correo actualizado' });
  });
});

// Subir foto de perfil
router.post("/:id/upload-foto", upload.single("foto"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se subió ningún archivo" });
  }

  const fotoPath = `/media/uploads/${req.file.filename}`;

  Usuario.updateFotoPerfil(req.params.id, fotoPath, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Foto actualizada", foto_perfil: fotoPath });
  });
});

// Obtener hijos de un padre
router.get("/:id/hijos", (req, res) => {
  Usuario.getHijosByPadre(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener padres de un alumno
router.get("/:id/padres", (req, res) => {
  Usuario.getPadresByHijo(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener grupo del alumno con maestro y compañeros
router.get("/:id/grupo", async (req, res) => {
  try {
    const idAlumno = parseInt(req.params.id);
    
    if (isNaN(idAlumno)) {
      return res.status(400).json({ error: 'ID de alumno inválido' });
    }
    
    console.log('📚 Buscando grupo para alumno ID:', idAlumno);
    
    // Obtener el grupo del alumno
    const [grupoRows] = await db.promise().query(`
      SELECT g.id_grupo, g.nombre_grupo
      FROM asignaciones_grupos ag
      INNER JOIN grupos g ON ag.id_grupo = g.id_grupo
      WHERE ag.id_usuario = ? AND ag.activa = 1
      LIMIT 1
    `, [idAlumno]);
    
    console.log('📚 Resultado grupos:', grupoRows);
    
    if (grupoRows.length === 0) {
      return res.status(404).json({ error: 'El alumno no está asignado a ningún grupo' });
    }
    
    const grupo = grupoRows[0];
    
    // Obtener el maestro del grupo
    const [maestroRows] = await db.promise().query(`
      SELECT u.id_usuario, u.nombre_completo, u.foto_perfil, u.email
      FROM asignaciones_grupos ag
      INNER JOIN usuarios u ON ag.id_usuario = u.id_usuario
      WHERE ag.id_grupo = ? AND ag.activa = 1 AND u.rol = 'maestro'
      LIMIT 1
    `, [grupo.id_grupo]);
    
    const maestro = maestroRows.length > 0 ? maestroRows[0] : null;
    
    // Obtener compañeros del grupo (solo alumnos)
    const [companeros] = await db.promise().query(`
      SELECT u.id_usuario, u.nombre_completo, u.foto_perfil
      FROM asignaciones_grupos ag
      INNER JOIN usuarios u ON ag.id_usuario = u.id_usuario
      WHERE ag.id_grupo = ? AND ag.activa = 1 AND u.rol = 'alumno' AND u.activo = 1
      ORDER BY u.nombre_completo
    `, [grupo.id_grupo]);
    
    res.json({
      grupo,
      maestro,
      companeros
    });
  } catch (error) {
    console.error('Error obteniendo grupo del alumno:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener información de recogida (nombre y grupo del alumno por solicitud)
router.get("/:solicitudId/info-recogida", async (req, res) => {
  try {
    const { solicitudId } = req.params;
    
    const [rows] = await db.promise().query(`
      SELECT 
        u.nombre_completo,
        g.nombre_grupo
      FROM solicitudes_recogida sr
      INNER JOIN usuarios u ON sr.id_hijo = u.id_usuario
      LEFT JOIN asignaciones_grupos ag ON u.id_usuario = ag.id_usuario AND ag.activa = 1
      LEFT JOIN grupos g ON ag.id_grupo = g.id_grupo
      WHERE sr.id_solicitud = ?
    `, [solicitudId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo info de recogida:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar usuario
router.delete("/:id", (req, res) => {
  Usuario.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usuario eliminado" });
  });
});

// Obtener personal docente (maestros y director)
router.get("/escuela/:id_escuela/personal-docente", async (req, res) => {
  try {
    const { id_escuela } = req.params;
    
    const [personal] = await db.promise().execute(`
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
    
    // Validar que el destinatario sea director
    const [destinatario] = await db.promise().execute(
      'SELECT rol, id_escuela FROM usuarios WHERE id_usuario = ?',
      [id_destinatario]
    );
    
    if (!destinatario.length || destinatario[0].rol !== 'admin') {
      return res.status(400).json({ error: 'El destinatario debe ser un director' });
    }
    
    // Obtener la escuela del remitente
    const [remitente] = await db.promise().execute(
      'SELECT id_escuela FROM usuarios WHERE id_usuario = ?',
      [id_remitente]
    );
    
    if (!remitente.length) {
      return res.status(400).json({ error: 'Remitente no encontrado' });
    }
    
    // Crear el ticket
    const [result] = await db.promise().execute(`
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

// Obtener grupos asignados a un maestro
router.get("/:id_usuario/grupos-asignados", async (req, res) => {
  try {
    const { id_usuario } = req.params;
    
    console.log(`🔍 Buscando grupos para usuario ID: ${id_usuario}`);
    
    const [grupos] = await db.promise().execute(`
      SELECT 
        g.id_grupo,
        g.nombre_grupo,
        g.grado as nivel,
        g.seccion,
        g.id_maestro,
        ag.fecha_asignacion
      FROM asignaciones_grupos ag
      INNER JOIN grupos g ON ag.id_grupo = g.id_grupo
      WHERE ag.id_usuario = ? AND ag.activa = 1
      ORDER BY g.grado, g.seccion
    `, [id_usuario]);

    console.log(`📋 Grupos encontrados:`, grupos);
    res.json({ grupos });
  } catch (error) {
    console.error('Error al obtener grupos asignados:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todos los grupos de una escuela (para directores)
router.get("/escuela/:id_escuela/todos-grupos", async (req, res) => {
  try {
    const { id_escuela } = req.params;
    
    console.log(`🔍 Obteniendo todos los grupos de la escuela ID: ${id_escuela}`);
    
    const [grupos] = await db.promise().execute(`
      SELECT 
        g.id_grupo,
        g.nombre_grupo,
        g.grado as nivel,
        g.seccion,
        g.id_maestro,
        u.nombre_completo as nombre_maestro
      FROM grupos g
      LEFT JOIN usuarios u ON g.id_maestro = u.id_usuario
      WHERE g.id_escuela = ? AND g.activo = 1
      ORDER BY g.grado, g.seccion
    `, [id_escuela]);

    console.log(`📋 Todos los grupos encontrados:`, grupos);
    res.json({ grupos });
  } catch (error) {
    console.error('Error al obtener todos los grupos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener estudiantes de un grupo específico
router.get("/grupos/:id_grupo/estudiantes", async (req, res) => {
  try {
    const { id_grupo } = req.params;
    
    const [estudiantes] = await db.promise().execute(`
      SELECT 
        u.id_usuario,
        u.nombre_completo,
        u.foto_perfil,
        u.asignacion,
        ag.fecha_asignacion
      FROM asignaciones_grupos ag
      INNER JOIN usuarios u ON ag.id_usuario = u.id_usuario
      WHERE ag.id_grupo = ? 
        AND ag.activa = 1 
        AND u.rol = 'alumno'
        AND u.activo = 1
      ORDER BY u.nombre_completo
    `, [id_grupo]);

    res.json({ estudiantes });
  } catch (error) {
    console.error('Error al obtener estudiantes del grupo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
