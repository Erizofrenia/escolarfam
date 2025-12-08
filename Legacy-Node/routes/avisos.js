import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Mapeo de tipos de aviso a categorías de ticket
const tipoAvisoToCategoria = {
  'llegar_tarde': 'academico',
  'enfermo': 'academico', 
  'emergencia': 'administrativo',
  'cita_medica': 'academico',
  'tarea_pendiente': 'academico',
  'material_faltante': 'academico', 
  'evento_familiar': 'administrativo',
  'cambio_recogida': 'administrativo',
  'general': 'general',
  'personalizado': 'general'
};

// Mapeo de tipos de aviso a prioridades
const tipoAvisoToPrioridad = {
  'llegar_tarde': 'alta',
  'enfermo': 'alta',
  'emergencia': 'alta', 
  'cita_medica': 'media',
  'tarea_pendiente': 'baja',
  'material_faltante': 'baja',
  'evento_familiar': 'media',
  'cambio_recogida': 'alta',
  'general': 'baja',
  'personalizado': 'media'
};

// Mapeo de tipos para títulos legibles
const tipoAvisoToTitulo = {
  'llegar_tarde': 'Llegada Tardía',
  'enfermo': 'Alumno Enfermo',
  'emergencia': 'Emergencia Familiar',
  'cita_medica': 'Cita Médica',
  'tarea_pendiente': 'Tarea Pendiente',
  'material_faltante': 'Material Faltante',
  'evento_familiar': 'Evento Familiar',
  'cambio_recogida': 'Cambio en Recogida',
  'general': 'Aviso General',
  'personalizado': 'Aviso Personalizado'
};

// POST /api/avisos - Crear nuevo aviso (ticket + mensajes)
router.post('/', async (req, res) => {
  try {
    const { id_padre, id_hijo, tipo_aviso, mensaje, id_escuela } = req.body;
    
    // Validaciones
    if (!id_padre || !id_hijo || !tipo_aviso || !mensaje || !id_escuela) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: id_padre, id_hijo, tipo_aviso, mensaje, id_escuela' 
      });
    }

    // Obtener datos del padre e hijo
    const [padreRows] = await db.promise().query(
      'SELECT nombre_completo, email FROM usuarios WHERE id_usuario = ?',
      [id_padre]
    );
    
    const [hijoRows] = await db.promise().query(
      'SELECT nombre_completo FROM usuarios WHERE id_usuario = ?', 
      [id_hijo]
    );

    if (padreRows.length === 0 || hijoRows.length === 0) {
      return res.status(404).json({ error: 'Padre o hijo no encontrado' });
    }

    const padre = padreRows[0];
    const hijo = hijoRows[0];

    // 1. Crear ticket para el director/admin
    const categoria = tipoAvisoToCategoria[tipo_aviso] || 'general';
    const prioridad = tipoAvisoToPrioridad[tipo_aviso] || 'media';
    const tituloTipo = tipoAvisoToTitulo[tipo_aviso] || 'Aviso';
    
    const asunto = `${tituloTipo} - ${hijo.nombre_completo}`;
    const contenido = `**Tipo de aviso:** ${tituloTipo}
**Estudiante:** ${hijo.nombre_completo}
**Padre/Madre:** ${padre.nombre_completo} (${padre.email})
**Mensaje:**
${mensaje}`;

    const [ticketResult] = await db.promise().query(
      `INSERT INTO consultas_tickets 
       (id_usuario, id_escuela, asunto, contenido, categoria, prioridad, estado, fecha_creacion) 
       VALUES (?, ?, ?, ?, ?, ?, 'abierto', NOW())`,
      [id_padre, id_escuela, asunto, contenido, categoria, prioridad]
    );

    const ticketId = ticketResult.insertId;

    // 2. Obtener maestros del hijo (del grupo asignado)
    const [maestrosRows] = await db.promise().query(`
      SELECT DISTINCT u.id_usuario, u.nombre_completo, u.email
      FROM usuarios u
      INNER JOIN grupos g ON u.id_usuario = g.id_maestro
      INNER JOIN asignaciones_grupos ag ON g.id_grupo = ag.id_grupo
      WHERE ag.id_usuario = ? AND ag.activa = 1 AND u.activo = 1
    `, [id_hijo]);

    // 3. Enviar mensajes a todos los maestros del hijo
    const mensajesMaestros = [];
    for (const maestro of maestrosRows) {
      const contenidoMensaje = `📢 ${tituloTipo} - ${hijo.nombre_completo}

${mensaje}

—————————————————
De: ${padre.nombre_completo}
Tipo: ${tituloTipo}
Ticket: #${ticketId}`;

      const [mensajeResult] = await db.promise().query(
        `INSERT INTO mensajes 
         (id_remitente, id_destinatario, contenido, fecha_envio, tipo, asunto)
         VALUES (?, ?, ?, NOW(), 'sistema', ?)`,
        [id_padre, maestro.id_usuario, contenidoMensaje, `${tituloTipo} - ${hijo.nombre_completo}`]
      );

      mensajesMaestros.push({
        maestro: maestro.nombre_completo,
        mensaje_id: mensajeResult.insertId
      });
    }

    // 4. Crear notificación para el padre confirmando el envío
    await db.promise().query(
      `INSERT INTO notificaciones 
       (id_usuario, tipo, titulo, contenido, fecha_creacion)
       VALUES (?, 'sistema', ?, ?, NOW())`,
      [
        id_padre, 
        'Aviso enviado exitosamente',
        `Tu aviso "${tituloTipo}" sobre ${hijo.nombre_completo} ha sido enviado correctamente. Ticket #${ticketId} creado para dirección y mensajes enviados a ${maestrosRows.length} maestro(s).`
      ]
    );

    res.json({
      success: true,
      ticketId: ticketId,
      maestrosNotificados: maestrosRows.length,
      mensajesMaestros: mensajesMaestros,
      message: `Aviso enviado correctamente. Ticket #${ticketId} creado para dirección y ${maestrosRows.length} maestro(s) notificado(s).`
    });

  } catch (error) {
    console.error('Error al procesar aviso:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al procesar el aviso',
      details: error.message 
    });
  }
});

// GET /api/avisos/tipos - Obtener tipos de avisos disponibles
router.get('/tipos', (req, res) => {
  const tipos = Object.keys(tipoAvisoToTitulo).map(key => ({
    valor: key,
    titulo: tipoAvisoToTitulo[key],
    categoria: tipoAvisoToCategoria[key],
    prioridad: tipoAvisoToPrioridad[key]
  }));

  res.json(tipos);
});

// GET /api/avisos/estadisticas/:escuela - Estadísticas de avisos por escuela
router.get('/estadisticas/:escuela', async (req, res) => {
  try {
    const { escuela } = req.params;
    
    const [stats] = await db.promise().query(`
      SELECT 
        categoria,
        prioridad,
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'abierto' THEN 1 ELSE 0 END) as abiertos,
        SUM(CASE WHEN estado = 'respondido' THEN 1 ELSE 0 END) as respondidos,
        SUM(CASE WHEN estado = 'archivado' THEN 1 ELSE 0 END) as archivados
      FROM consultas_tickets 
      WHERE id_escuela = ? AND categoria IN ('academico', 'administrativo', 'general')
      GROUP BY categoria, prioridad
      ORDER BY categoria, prioridad
    `, [escuela]);

    res.json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Almacenar conexiones SSE para el cerebro
const brainConnections = new Set();

// POST /api/avisos/reproducir - Enviar aviso de voz al cerebro del director
router.post('/reproducir', async (req, res) => {
  try {
    const { studentName, solicitudId, maestroId, mensaje } = req.body;
    
    // Obtener datos del maestro
    const [maestroRows] = await db.promise().query(
      'SELECT nombre_completo FROM usuarios WHERE id_usuario = ?',
      [maestroId]
    );
    
    if (maestroRows.length === 0) {
      return res.status(404).json({ error: 'Maestro no encontrado' });
    }
    
    const maestro = maestroRows[0];
    
    // Registrar el aviso en logs
    await db.promise().query(
      `INSERT INTO logs_actividad 
       (id_usuario, accion, tabla_afectada, id_registro, detalles, fecha_accion)
       VALUES (?, 'voice_announcement', 'solicitudes_recogida', ?, ?, NOW())`,
      [
        maestroId,
        solicitudId,
        JSON.stringify({
          student_name: studentName,
          mensaje: mensaje,
          action: 'voice_announcement'
        })
      ]
    );
    
    // Enviar a todas las conexiones del cerebro (directores/admins)
    const announcementData = {
      type: 'voice_announcement',
      studentName: studentName,
      mensaje: mensaje,
      maestro: maestro.nombre_completo,
      timestamp: new Date().toISOString(),
      solicitudId: solicitudId
    };
    
    // Broadcast a todas las conexiones SSE
    brainConnections.forEach(connection => {
      try {
        connection.write(`data: ${JSON.stringify(announcementData)}\n\n`);
      } catch (error) {
        console.error('Error enviando a conexión SSE:', error);
        brainConnections.delete(connection);
      }
    });
    
    res.json({
      success: true,
      message: `Aviso de voz enviado al cerebro para ${studentName}`,
      connectionsNotified: brainConnections.size
    });
    
  } catch (error) {
    console.error('Error al procesar aviso de voz:', error);
    res.status(500).json({ error: 'Error al procesar aviso de voz' });
  }
});

// GET /api/avisos/stream - Server-Sent Events para el cerebro del director
router.get('/stream', (req, res) => {
  // Configurar headers para SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });
  
  // Agregar conexión al set
  brainConnections.add(res);
  
  // Enviar mensaje inicial
  res.write(`data: ${JSON.stringify({
    type: 'connection',
    message: 'Conectado al stream de avisos de voz',
    timestamp: new Date().toISOString()
  })}\n\n`);
  
  // Limpiar conexión cuando se cierre
  req.on('close', () => {
    brainConnections.delete(res);
  });
  
  req.on('aborted', () => {
    brainConnections.delete(res);
  });
});

export default router;