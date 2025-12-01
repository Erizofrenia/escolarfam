import connection from "../config/database.js";

const Usuario = {
  getAll: (callback) => {
    connection.query("SELECT * FROM usuarios", callback);
  },

  getById: (id, callback) => {
    connection.query("SELECT * FROM usuarios WHERE id_usuario = ?", [id], callback);
  },

  create: (data, callback) => {
    const { id_escuela, nombre_completo, email, password_hash, rol } = data;
    connection.query(
      "INSERT INTO usuarios (id_escuela, nombre_completo, email, password_hash, rol) VALUES (?, ?, ?, ?, ?)",
      [id_escuela, nombre_completo, email, password_hash, rol],
      callback
    );
  },

  update: (id, data, callback) => {
    const { nombre_completo, email, rol, activo } = data;
    connection.query(
      "UPDATE usuarios SET nombre_completo=?, email=?, rol=?, activo=? WHERE id_usuario=?",
      [nombre_completo, email, rol, activo, id],
      callback
    );
  },

  delete: (id, callback) => {
    connection.query("DELETE FROM usuarios WHERE id_usuario = ?", [id], callback);
  },

  updateEmail: (id, email, callback) => {
    connection.query("UPDATE usuarios SET email = ? WHERE id_usuario = ?", [email, id], callback);
  },

  updatePasswordHash: (id, passwordHash, callback) => {
    connection.query("UPDATE usuarios SET password_hash = ? WHERE id_usuario = ?", [passwordHash, id], callback);
  },

  updateFotoPerfil: (id, fotoPerfil, callback) => {
    connection.query("UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?", [fotoPerfil, id], callback);
  },

  getHijosByPadre: (idPadre, callback) => {
    const sql = `
      SELECT 
        u.id_usuario, 
        u.nombre_completo, 
        u.foto_perfil, 
        u.email, 
        rf.parentesco,
        COALESCE(g.nombre_grupo, u.asignacion) as nombre_grupo
      FROM relaciones_familiares rf
      INNER JOIN usuarios u ON rf.id_hijo = u.id_usuario
      LEFT JOIN asignaciones_grupos ag ON u.id_usuario = ag.id_usuario AND ag.activa = 1
      LEFT JOIN grupos g ON ag.id_grupo = g.id_grupo
      WHERE rf.id_padre = ? AND u.activo = 1
      ORDER BY u.nombre_completo
    `;
    connection.query(sql, [idPadre], callback);
  },

  getPadresByHijo: (idHijo, callback) => {
    const sql = `
      SELECT 
        u.id_usuario, 
        u.nombre_completo, 
        u.foto_perfil, 
        u.email, 
        rf.parentesco
      FROM relaciones_familiares rf
      INNER JOIN usuarios u ON rf.id_padre = u.id_usuario
      WHERE rf.id_hijo = ? AND u.activo = 1
      ORDER BY u.nombre_completo
    `;
    connection.query(sql, [idHijo], callback);
  },
};

export default Usuario;
