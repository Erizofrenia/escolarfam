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
};

export default Usuario;
