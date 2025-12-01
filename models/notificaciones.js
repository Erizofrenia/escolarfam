import connection from "../config/database.js";

const Notificacion = {
  create: (data, callback) => {
    const { id_usuario, tipo, titulo, contenido } = data;
    const sql = `
      INSERT INTO notificaciones (id_usuario, tipo, titulo, contenido, leida)
      VALUES (?, ?, ?, ?, 0)
    `;
    connection.query(sql, [id_usuario, tipo, titulo, contenido], callback);
  },

  getByUsuario: (idUsuario, callback) => {
    const sql = "SELECT * FROM notificaciones WHERE id_usuario = ? ORDER BY fecha_creacion DESC";
    connection.query(sql, [idUsuario], callback);
  }
};

export default Notificacion;
