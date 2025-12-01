import connection from "../config/database.js";

const Log = {
  create: (data, callback) => {
    const { id_usuario, id_escuela, accion, tabla_afectada, id_registro, detalles, ip_address, user_agent } = data;
    const sql = `
      INSERT INTO logs_actividad (id_usuario, id_escuela, accion, tabla_afectada, id_registro, detalles, ip_address, user_agent, fecha_accion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    connection.query(sql, [id_usuario, id_escuela, accion, tabla_afectada, id_registro, JSON.stringify(detalles), ip_address, user_agent], callback);
  },

  getByEscuela: (idEscuela, callback) => {
    const sql = "SELECT * FROM logs_actividad WHERE id_escuela = ? ORDER BY fecha_accion DESC LIMIT 100";
    connection.query(sql, [idEscuela], callback);
  }
};

export default Log;
