import connection from "../config/database.js";

const Escuela = {
  getAll: (callback) => {
    connection.query("SELECT * FROM escuelas", callback);
  },

  getById: (id, callback) => {
    connection.query("SELECT * FROM escuelas WHERE id_escuela = ?", [id], callback);
  },

  create: (data, callback) => {
    const { nombre_escuela, direccion, telefono, codigo_postal, sitio_web } = data;
    connection.query(
      "INSERT INTO escuelas (nombre_escuela, direccion, telefono, codigo_postal, sitio_web) VALUES (?, ?, ?, ?, ?)",
      [nombre_escuela, direccion, telefono, codigo_postal, sitio_web],
      callback
    );
  },

  update: (id, data, callback) => {
    const { nombre_escuela, direccion, telefono, codigo_postal, sitio_web, activa } = data;
    connection.query(
      "UPDATE escuelas SET nombre_escuela=?, direccion=?, telefono=?, codigo_postal=?, sitio_web=?, activa=? WHERE id_escuela=?",
      [nombre_escuela, direccion, telefono, codigo_postal, sitio_web, activa, id],
      callback
    );
  },

  delete: (id, callback) => {
    connection.query("DELETE FROM escuelas WHERE id_escuela = ?", [id], callback);
  },
};

export default Escuela;
