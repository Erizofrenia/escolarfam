import connection from "../config/database.js";

const SolicitudRecogida = {
  create: (data, callback) => {
    const { id_padre, id_hijo, observaciones, persona_recoge, parentesco_recoge } = data;
    const sql = `
      INSERT INTO solicitudes_recogida (id_padre, id_hijo, fecha_solicitud, estado, observaciones, persona_recoge, parentesco_recoge)
      VALUES (?, ?, NOW(), 'pendiente', ?, ?, ?)
    `;
    connection.query(sql, [id_padre, id_hijo, observaciones, persona_recoge || null, parentesco_recoge || null], callback);
  },

  getByHijo: (idHijo, callback) => {
    const sql = `
      SELECT sr.*, u.nombre_completo as nombre_padre
      FROM solicitudes_recogida sr
      INNER JOIN usuarios u ON sr.id_padre = u.id_usuario
      WHERE sr.id_hijo = ?
      ORDER BY sr.fecha_solicitud DESC
    `;
    connection.query(sql, [idHijo], callback);
  },

  getByMaestro: (idMaestro, callback) => {
    const sql = `
      SELECT 
        sr.*,
        padre.nombre_completo as nombre_padre,
        padre.foto_perfil as foto_padre,
        hijo.nombre_completo as nombre_hijo,
        hijo.foto_perfil as foto_hijo,
        g.nombre_grupo,
        COALESCE(g.nombre_grupo, hijo.asignacion) as grupo_hijo
      FROM solicitudes_recogida sr
      INNER JOIN usuarios padre ON sr.id_padre = padre.id_usuario
      INNER JOIN usuarios hijo ON sr.id_hijo = hijo.id_usuario
      INNER JOIN asignaciones_grupos ag ON hijo.id_usuario = ag.id_usuario AND ag.activa = 1
      INNER JOIN grupos g ON ag.id_grupo = g.id_grupo AND g.id_maestro = ?
      WHERE sr.estado = 'pendiente'
      ORDER BY sr.fecha_solicitud DESC
    `;
    connection.query(sql, [idMaestro], callback);
  },

  aprobar: (idSolicitud, idAprobador, nombreRecoge, parentescoRecoge, callback) => {
    const sql = `
      UPDATE solicitudes_recogida 
      SET estado = 'aprobada', 
          id_aprobador = ?,
          persona_recoge = COALESCE(?, persona_recoge),
          parentesco_recoge = COALESCE(?, parentesco_recoge)
      WHERE id_solicitud = ?
    `;
    connection.query(sql, [idAprobador, nombreRecoge, parentescoRecoge, idSolicitud], callback);
  },

  rechazar: (idSolicitud, idAprobador, callback) => {
    const sql = `
      UPDATE solicitudes_recogida 
      SET estado = 'rechazada', 
          id_aprobador = ?
      WHERE id_solicitud = ?
    `;
    connection.query(sql, [idAprobador, idSolicitud], callback);
  },

  getHistorialDia: (idMaestro, callback) => {
    const sql = `
      SELECT 
        sr.*,
        padre.nombre_completo as nombre_padre,
        padre.foto_perfil as foto_padre,
        hijo.nombre_completo as nombre_hijo,
        hijo.foto_perfil as foto_hijo,
        aprobador.nombre_completo as nombre_aprobador,
        g.nombre_grupo,
        COALESCE(g.nombre_grupo, hijo.asignacion) as grupo_hijo
      FROM solicitudes_recogida sr
      INNER JOIN usuarios padre ON sr.id_padre = padre.id_usuario
      INNER JOIN usuarios hijo ON sr.id_hijo = hijo.id_usuario
      INNER JOIN asignaciones_grupos ag ON hijo.id_usuario = ag.id_usuario AND ag.activa = 1
      INNER JOIN grupos g ON ag.id_grupo = g.id_grupo AND g.id_maestro = ?
      LEFT JOIN usuarios aprobador ON sr.id_aprobador = aprobador.id_usuario
      WHERE sr.estado IN ('aprobada', 'rechazada')
      AND DATE(sr.fecha_solicitud) = CURDATE()
      ORDER BY sr.fecha_solicitud DESC
    `;
    connection.query(sql, [idMaestro], callback);
  },

  actualizarPersonaRecoge: (idSolicitud, personaRecoge, parentescoRecoge, callback) => {
    const sql = `
      UPDATE solicitudes_recogida 
      SET persona_recoge = ?,
          parentesco_recoge = ?
      WHERE id_solicitud = ? AND estado = 'pendiente'
    `;
    connection.query(sql, [personaRecoge, parentescoRecoge, idSolicitud], callback);
  }
};

export default SolicitudRecogida;
