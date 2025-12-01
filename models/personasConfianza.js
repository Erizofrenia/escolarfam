import connection from "../config/database.js";

const PersonaConfianza = {
  create: (data, callback) => {
    const { id_padre, nombre_completo, parentesco, telefono, predeterminada } = data;
    const sql = `
      INSERT INTO personas_confianza (id_padre, nombre_completo, parentesco, telefono, predeterminada)
      VALUES (?, ?, ?, ?, ?)
    `;
    connection.query(sql, [id_padre, nombre_completo, parentesco, telefono || null, predeterminada || 0], callback);
  },

  getByPadre: (idPadre, callback) => {
    const sql = `
      SELECT * FROM personas_confianza
      WHERE id_padre = ? AND activa = 1
      ORDER BY predeterminada DESC, nombre_completo ASC
    `;
    connection.query(sql, [idPadre], callback);
  },

  delete: (idPersona, callback) => {
    const sql = `UPDATE personas_confianza SET activa = 0 WHERE id_persona = ?`;
    connection.query(sql, [idPersona], callback);
  },

  setPredeterminada: (idPersona, idPadre, callback) => {
    // Primero quitar predeterminada de todas
    const sql1 = `UPDATE personas_confianza SET predeterminada = 0 WHERE id_padre = ?`;
    connection.query(sql1, [idPadre], (err) => {
      if (err) return callback(err);
      // Luego marcar la seleccionada
      const sql2 = `UPDATE personas_confianza SET predeterminada = 1 WHERE id_persona = ?`;
      connection.query(sql2, [idPersona], callback);
    });
  }
};

export default PersonaConfianza;
