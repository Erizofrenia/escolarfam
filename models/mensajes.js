import connection from "../config/database.js";

const Mensaje = {
  // Obtener conversaciones del usuario (últimos mensajes agrupados por contacto)
  getConversaciones: (idUsuario, callback) => {
    const sql = `
      SELECT DISTINCT
        CASE 
          WHEN m.id_remitente = ? THEN m.id_destinatario
          ELSE m.id_remitente
        END as id_contacto,
        u.nombre_completo as nombre_contacto,
        u.foto_perfil as foto_contacto,
        u.rol as rol_contacto,
        (SELECT contenido FROM mensajes 
         WHERE (id_remitente = id_contacto AND id_destinatario = ?) 
            OR (id_remitente = ? AND id_destinatario = id_contacto)
         ORDER BY fecha_envio DESC LIMIT 1) as ultimo_mensaje,
        (SELECT fecha_envio FROM mensajes 
         WHERE (id_remitente = id_contacto AND id_destinatario = ?) 
            OR (id_remitente = ? AND id_destinatario = id_contacto)
         ORDER BY fecha_envio DESC LIMIT 1) as ultima_fecha,
        (SELECT COUNT(*) FROM mensajes 
         WHERE id_remitente = id_contacto AND id_destinatario = ? AND leido = 0) as no_leidos
      FROM mensajes m
      INNER JOIN usuarios u ON (
        CASE 
          WHEN m.id_remitente = ? THEN m.id_destinatario
          ELSE m.id_remitente
        END = u.id_usuario
      )
      WHERE m.id_remitente = ? OR m.id_destinatario = ?
      ORDER BY ultima_fecha DESC
    `;
    connection.query(sql, [idUsuario, idUsuario, idUsuario, idUsuario, idUsuario, idUsuario, idUsuario, idUsuario, idUsuario], callback);
  },

  // Obtener mensajes de una conversación específica
  getMensajesConversacion: (idUsuario1, idUsuario2, callback) => {
    const sql = `
      SELECT 
        m.*,
        u1.nombre_completo as nombre_remitente,
        u1.foto_perfil as foto_remitente,
        u1.rol as rol_remitente,
        u2.nombre_completo as nombre_destinatario,
        u2.foto_perfil as foto_destinatario,
        u2.rol as rol_destinatario
      FROM mensajes m
      INNER JOIN usuarios u1 ON m.id_remitente = u1.id_usuario
      INNER JOIN usuarios u2 ON m.id_destinatario = u2.id_usuario
      WHERE (m.id_remitente = ? AND m.id_destinatario = ?)
         OR (m.id_remitente = ? AND m.id_destinatario = ?)
      ORDER BY m.fecha_envio ASC
    `;
    connection.query(sql, [idUsuario1, idUsuario2, idUsuario2, idUsuario1], callback);
  },

  // Enviar mensaje
  enviar: (data, callback) => {
    const { id_remitente, id_destinatario, contenido, tipo } = data;
    const sql = `
      INSERT INTO mensajes (id_remitente, id_destinatario, contenido, tipo, fecha_envio, leido)
      VALUES (?, ?, ?, ?, NOW(), 0)
    `;
    connection.query(sql, [id_remitente, id_destinatario, contenido, tipo || 'personal'], callback);
  },

  // Marcar mensajes como leídos
  marcarComoLeidos: (idRemitente, idDestinatario, callback) => {
    const sql = `
      UPDATE mensajes 
      SET leido = 1 
      WHERE id_remitente = ? AND id_destinatario = ? AND leido = 0
    `;
    connection.query(sql, [idRemitente, idDestinatario], callback);
  },

  // Obtener mensajes no leídos
  getNoLeidos: (idUsuario, callback) => {
    const sql = `
      SELECT COUNT(*) as total
      FROM mensajes
      WHERE id_destinatario = ? AND leido = 0
    `;
    connection.query(sql, [idUsuario], callback);
  }
};

export default Mensaje;
