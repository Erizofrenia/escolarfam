import express from "express";
import connection from "../config/database.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Registro completo de usuario
router.post("/register", async (req, res) => {
  const { 
    id_escuela, 
    nombre_usuario, 
    nombre_completo, 
    email, 
    password, 
    rol,
    // Para alumnos
    id_grupo,
    nuevo_grupo,  // { nombre_grupo, grado, seccion, nivel, id_maestro }
    id_tutor,
    nuevo_tutor,  // { nombre_usuario, nombre_completo, email, password }
    parentesco,
    // Para maestros
    grupos_asignados,  // [{ id_grupo, asignaturas: [id_asignatura, ...] }]
    nuevas_asignaturas // [{ nombre_asignatura }]
  } = req.body;

  const conn = connection.promise ? connection.promise() : connection;
  
  try {
    // Validar campos obligatorios - email ahora es opcional
    if (!nombre_usuario || !nombre_completo || !password || !rol) {
      return res.status(400).json({ message: "Faltan campos obligatorios (nombre, usuario, contraseña, rol)" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userEmail = email || `${nombre_usuario}@temporal.local`;
    
    // Insertar usuario principal
    const [result] = await conn.query(
      "INSERT INTO usuarios (id_escuela, nombre_usuario, nombre_completo, email, password_hash, rol) VALUES (?, ?, ?, ?, ?, ?)",
      [id_escuela || 1, nombre_usuario, nombre_completo, userEmail, password_hash, rol]
    );
    
    const id_usuario = result.insertId;
    let grupoId = id_grupo;
    let tutorId = id_tutor;

    // ========== REGISTRO DE ALUMNO ==========
    if (rol === 'alumno') {
      // Si se crea nuevo grupo
      if (nuevo_grupo && nuevo_grupo.nombre_grupo) {
        const [grupoResult] = await conn.query(
          "INSERT INTO grupos (id_escuela, nombre_grupo, grado, seccion, nivel, id_maestro) VALUES (?, ?, ?, ?, ?, ?)",
          [id_escuela || 1, nuevo_grupo.nombre_grupo, nuevo_grupo.grado || 1, nuevo_grupo.seccion || 'A', nuevo_grupo.nivel || 'primaria', nuevo_grupo.id_maestro || null]
        );
        grupoId = grupoResult.insertId;
      }

      // Asignar alumno a grupo
      if (grupoId) {
        await conn.query(
          "INSERT INTO asignaciones_grupos (id_usuario, id_grupo) VALUES (?, ?)",
          [id_usuario, grupoId]
        );
        // Actualizar el campo asignacion con el nombre del grupo
        const [grupoInfo] = await conn.query("SELECT nombre_grupo FROM grupos WHERE id_grupo = ?", [grupoId]);
        if (grupoInfo.length > 0) {
          await conn.query("UPDATE usuarios SET asignacion = ? WHERE id_usuario = ?", [grupoInfo[0].nombre_grupo, id_usuario]);
        }
      }

      // Si se crea nuevo tutor (padre)
      if (nuevo_tutor && nuevo_tutor.nombre_completo) {
        const tutor_password_hash = await bcrypt.hash(nuevo_tutor.password || 'padre123', 10);
        const tutorEmail = nuevo_tutor.email || `${nuevo_tutor.nombre_usuario}@temporal.local`;
        const [tutorResult] = await conn.query(
          "INSERT INTO usuarios (id_escuela, nombre_usuario, nombre_completo, email, password_hash, rol) VALUES (?, ?, ?, ?, ?, 'padre')",
          [id_escuela || 1, nuevo_tutor.nombre_usuario, nuevo_tutor.nombre_completo, tutorEmail, tutor_password_hash]
        );
        tutorId = tutorResult.insertId;
      }

      // Crear relación familiar
      if (tutorId) {
        await conn.query(
          "INSERT INTO relaciones_familiares (id_padre, id_hijo, parentesco) VALUES (?, ?, ?)",
          [tutorId, id_usuario, parentesco || 'tutor']
        );
      }
    }

    // ========== REGISTRO DE MAESTRO ==========
    if (rol === 'maestro') {
      const escuelaId = id_escuela || 1;
      
      // Crear nuevas asignaturas si se especifican (con id_escuela)
      const nuevasAsignaturasIds = [];
      if (nuevas_asignaturas && nuevas_asignaturas.length > 0) {
        for (const asig of nuevas_asignaturas) {
          if (asig.nombre_asignatura && asig.nombre_asignatura.trim()) {
            try {
              // Primero intentar insertar
              const [insertResult] = await conn.query(
                "INSERT IGNORE INTO asignaturas (id_escuela, nombre_asignatura) VALUES (?, ?)",
                [escuelaId, asig.nombre_asignatura.trim()]
              );
              
              // Obtener el ID (ya sea nuevo o existente)
              if (insertResult.insertId) {
                nuevasAsignaturasIds.push(insertResult.insertId);
              } else {
                // Si no insertó (ya existía), buscar el ID
                const [existing] = await conn.query(
                  "SELECT id_asignatura FROM asignaturas WHERE id_escuela = ? AND nombre_asignatura = ?",
                  [escuelaId, asig.nombre_asignatura.trim()]
                );
                if (existing.length > 0) {
                  nuevasAsignaturasIds.push(existing[0].id_asignatura);
                }
              }
            } catch (asigErr) {
              console.log('Nota: No se pudo crear asignatura:', asigErr.message);
            }
          }
        }
      }

      // Asignar grupos y asignaturas al maestro
      if (grupos_asignados && grupos_asignados.length > 0) {
        for (const grupo of grupos_asignados) {
          // Asignar al grupo (asignaciones_grupos)
          try {
            await conn.query(
              "INSERT IGNORE INTO asignaciones_grupos (id_usuario, id_grupo) VALUES (?, ?)",
              [id_usuario, grupo.id_grupo]
            );
          } catch (grpErr) {
            console.log('Nota: Error asignando grupo:', grpErr.message);
          }
          
          // Asignar asignaturas seleccionadas en ese grupo (maestro_asignaturas)
          if (grupo.asignaturas && grupo.asignaturas.length > 0) {
            for (const idAsig of grupo.asignaturas) {
              try {
                await conn.query(
                  "INSERT IGNORE INTO maestro_asignaturas (id_maestro, id_asignatura, id_grupo) VALUES (?, ?, ?)",
                  [id_usuario, idAsig, grupo.id_grupo]
                );
              } catch (maErr) {
                console.log('Nota: No se pudo asignar asignatura al maestro:', maErr.message);
              }
            }
          }
          
          // También asignar las nuevas asignaturas creadas a este grupo
          for (const nuevaAsigId of nuevasAsignaturasIds) {
            try {
              await conn.query(
                "INSERT IGNORE INTO maestro_asignaturas (id_maestro, id_asignatura, id_grupo) VALUES (?, ?, ?)",
                [id_usuario, nuevaAsigId, grupo.id_grupo]
              );
            } catch (maErr) {
              console.log('Nota: No se pudo asignar nueva asignatura al maestro:', maErr.message);
            }
          }
        }
      }
    }

    // ========== REGISTRO DE PADRE (simple) ==========
    // El padre no requiere asignaciones adicionales, solo los datos básicos

    res.json({ message: "Usuario registrado con éxito", id: id_usuario, tutorId: tutorId });

  } catch (err) {
    console.error('Error en registro:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      if (err.message.includes('nombre_usuario') || err.message.includes('unique_username')) {
        return res.status(400).json({ message: "El nombre de usuario ya existe" });
      }
      if (err.message.includes('email')) {
        return res.status(400).json({ message: "El correo electrónico ya existe" });
      }
    }
    res.status(500).json({ error: err.message });
  }
});

// Login - ahora acepta nombre_usuario o email
router.post("/login", (req, res) => {
  const { email, password, nombre_usuario } = req.body;
  
  // Buscar por nombre_usuario o email
  const campo = nombre_usuario ? 'nombre_usuario' : 'email';
  const valor = nombre_usuario || email;
  const sql = `SELECT * FROM usuarios WHERE ${campo} = ?`;

  connection.query(sql, [valor], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: "Usuario no encontrado" });

    const usuario = results[0];
    const match = await bcrypt.compare(password, usuario.password_hash);
    if (!match) return res.status(401).json({ message: "Contraseña incorrecta" });

    res.json({ message: "Inicio de sesión exitoso", usuario });
  });
});

// Buscar grupos para autocomplete (con más info)
router.get("/grupos/search", (req, res) => {
  const { q } = req.query;
  const sql = `
    SELECT g.id_grupo, g.nombre_grupo, g.grado, g.seccion, g.nivel,
           u.nombre_completo as maestro_nombre
    FROM grupos g
    LEFT JOIN usuarios u ON g.id_maestro = u.id_usuario
    WHERE g.nombre_grupo LIKE ? AND g.activo = 1
    LIMIT 15
  `;
  connection.query(sql, [`%${q || ''}%`], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener todos los grupos
router.get("/grupos/all", (req, res) => {
  const sql = `
    SELECT g.id_grupo, g.nombre_grupo, g.grado, g.seccion, g.nivel,
           u.id_usuario as id_maestro, u.nombre_completo as maestro_nombre
    FROM grupos g
    LEFT JOIN usuarios u ON g.id_maestro = u.id_usuario
    WHERE g.activo = 1
    ORDER BY g.nivel, g.grado, g.seccion
  `;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Buscar padres para autocomplete
router.get("/padres/search", (req, res) => {
  const { q } = req.query;
  const sql = "SELECT id_usuario, nombre_completo, email FROM usuarios WHERE rol = 'padre' AND activo = 1 AND (nombre_completo LIKE ? OR email LIKE ?) LIMIT 10";
  connection.query(sql, [`%${q || ''}%`, `%${q || ''}%`], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Buscar maestros para autocomplete
router.get("/maestros/search", (req, res) => {
  const { q } = req.query;
  const sql = "SELECT id_usuario, nombre_completo, email FROM usuarios WHERE rol = 'maestro' AND activo = 1 AND (nombre_completo LIKE ? OR email LIKE ?) LIMIT 10";
  connection.query(sql, [`%${q || ''}%`, `%${q || ''}%`], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener todas las asignaturas (filtrado por escuela opcional)
router.get("/asignaturas/all", (req, res) => {
  const { id_escuela } = req.query;
  let sql = "SELECT id_asignatura, id_escuela, nombre_asignatura FROM asignaturas WHERE activa = 1";
  const params = [];
  
  if (id_escuela) {
    sql += " AND id_escuela = ?";
    params.push(id_escuela);
  }
  sql += " ORDER BY nombre_asignatura";
  
  connection.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Buscar asignaturas (filtrado por escuela opcional)
router.get("/asignaturas/search", (req, res) => {
  const { q, id_escuela } = req.query;
  let sql = "SELECT id_asignatura, id_escuela, nombre_asignatura FROM asignaturas WHERE activa = 1 AND nombre_asignatura LIKE ?";
  const params = [`%${q || ''}%`];
  
  if (id_escuela) {
    sql += " AND id_escuela = ?";
    params.push(id_escuela);
  }
  sql += " LIMIT 10";
  
  connection.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Verificar disponibilidad de nombre_usuario
router.get("/check-username/:username", (req, res) => {
  const { username } = req.params;
  const sql = "SELECT COUNT(*) as count FROM usuarios WHERE nombre_usuario = ?";
  connection.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ available: results[0].count === 0 });
  });
});

// Cambiar contraseña
router.post("/change-password", async (req, res) => {
  const { id_usuario, currentPassword, newPassword } = req.body;

  if (!id_usuario || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "Falta información requerida" });
  }

  // Obtener usuario actual
  const sql = "SELECT password_hash FROM usuarios WHERE id_usuario = ?";
  connection.query(sql, [id_usuario], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });

    const usuario = results[0];

    // Verificar contraseña actual
    const match = await bcrypt.compare(currentPassword, usuario.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Contraseña actual incorrecta" });
    }

    // Hash de la nueva contraseña
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    const updateSql = "UPDATE usuarios SET password_hash = ? WHERE id_usuario = ?";
    connection.query(updateSql, [newPasswordHash, id_usuario], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Contraseña actualizada exitosamente" });
    });
  });
});

// Actualizar email
router.patch("/update-email/:id", (req, res) => {
  const { email } = req.body;
  const userId = req.params.id;

  if (!email) {
    return res.status(400).json({ message: "Email requerido" });
  }

  const sql = "UPDATE usuarios SET email = ? WHERE id_usuario = ?";
  connection.query(sql, [email, userId], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: "Este correo ya está registrado" });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Email actualizado exitosamente" });
  });
});

export default router;
