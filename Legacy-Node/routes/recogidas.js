import express from "express";
import SolicitudRecogida from "../models/solicitudesRecogida.js";
import Notificacion from "../models/notificaciones.js";
import Log from "../models/logs.js";
import connection from "../config/database.js";

const router = express.Router();
// Debug: confirmar carga del archivo de rutas
console.log("[DEBUG] Recogidas routes loaded", import.meta.url);

// Crear solicitud de recogida y notificaciones
router.post("/", async (req, res) => {
  const { id_padre, id_hijo, observaciones, id_escuela } = req.body;

  if (!id_padre || !id_hijo) {
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  try {
    // Verificar si ya existe una solicitud pendiente del mismo padre para el mismo hijo
    const sqlVerificar = `
      SELECT id_solicitud 
      FROM solicitudes_recogida 
      WHERE id_padre = ? AND id_hijo = ? AND estado = 'pendiente'
      LIMIT 1
    `;

    connection.query(sqlVerificar, [id_padre, id_hijo], (err, existentes) => {
      if (err) return res.status(500).json({ error: err.message });

      // Si ya existe una solicitud pendiente, no crear otra
      if (existentes && existentes.length > 0) {
        return res.json({
          message: "Ya existe una alerta pendiente para este hijo",
          ya_existe: true,
          id_solicitud: existentes[0].id_solicitud
        });
      }

      // Si no existe, continuar con la creación
      // Obtener información del hijo y su maestro
      const sqlHijo = `
        SELECT u.nombre_completo, u.id_escuela, ag.id_grupo, g.id_maestro
        FROM usuarios u
        LEFT JOIN asignaciones_grupos ag ON u.id_usuario = ag.id_usuario AND ag.activa = 1
        LEFT JOIN grupos g ON ag.id_grupo = g.id_grupo
        WHERE u.id_usuario = ?
      `;

      connection.query(sqlHijo, [id_hijo], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Hijo no encontrado" });

        const hijoData = results[0];
        const idMaestro = hijoData.id_maestro;
        const idEscuela = hijoData.id_escuela || id_escuela;

        // Obtener nombre del padre
        const sqlPadre = "SELECT nombre_completo FROM usuarios WHERE id_usuario = ?";
        connection.query(sqlPadre, [id_padre], (err, padreResults) => {
          if (err) return res.status(500).json({ error: err.message });
          const nombrePadre = padreResults[0]?.nombre_completo || "Padre de familia";

          // 1. Crear solicitud de recogida
          SolicitudRecogida.create(
            { id_padre, id_hijo, observaciones: observaciones || `${nombrePadre} ha llegado por ${hijoData.nombre_completo}` },
            (err, solicitudResult) => {
              if (err) return res.status(500).json({ error: err.message });

              const idSolicitud = solicitudResult.insertId;

              // 2. Crear notificación para el maestro (si existe)
              if (idMaestro) {
                const tituloNotif = "Solicitud de Recogida";
                const contenidoNotif = `${nombrePadre} ha llegado para recoger a ${hijoData.nombre_completo}`;

                Notificacion.create(
                  { id_usuario: idMaestro, tipo: "recogida", titulo: tituloNotif, contenido: contenidoNotif },
                  (err) => {
                    if (err) console.error("Error creando notificación:", err);
                  }
                );
              }

              // 3. Registrar en logs
              Log.create(
                {
                  id_usuario: id_padre,
                  id_escuela: idEscuela,
                  accion: "Solicitud de recogida creada",
                  tabla_afectada: "solicitudes_recogida",
                  id_registro: idSolicitud,
                  detalles: { id_hijo, nombre_hijo: hijoData.nombre_completo, id_maestro: idMaestro },
                  ip_address: req.ip || "0.0.0.0",
                  user_agent: req.headers["user-agent"] || "Unknown"
                },
                (err) => {
                  if (err) console.error("Error creando log:", err);
                }
              );

              res.json({
                message: "Alerta de recogida enviada exitosamente",
                id_solicitud: idSolicitud,
                ya_existe: false
              });
            }
          );
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RUTAS ESPECÍFICAS PRIMERO (antes de las rutas con parámetros)
// Ruta debug para verificar montaje
router.get('/debug', (req, res) => {
  res.json({ ok: true, mensaje: 'Router recogidas operativo' });
});

// Obtener solicitudes pendientes para un maestro
router.get("/maestro/:id", (req, res) => {
  SolicitudRecogida.getByMaestro(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener historial del día para un maestro
router.get("/historial/:id", (req, res) => {
  SolicitudRecogida.getHistorialDia(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener solicitudes de recogida de un hijo
router.get("/hijo/:id", (req, res) => {
  SolicitudRecogida.getByHijo(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Aprobar solicitud de recogida
router.put("/:id/aprobar", (req, res) => {
  const { id_aprobador, nombre_recoge, parentesco_recoge } = req.body;
  SolicitudRecogida.aprobar(req.params.id, id_aprobador, nombre_recoge, parentesco_recoge, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Solicitud aprobada" });
  });
});

// Rechazar solicitud de recogida
router.put("/:id/rechazar", (req, res) => {
  const { id_aprobador } = req.body;
  SolicitudRecogida.rechazar(req.params.id, id_aprobador, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Solicitud rechazada" });
  });
});

// Actualizar persona que recoge en solicitud existente
router.put("/:id/actualizar-persona", (req, res) => {
  const { persona_recoge, parentesco_recoge } = req.body;
  SolicitudRecogida.actualizarPersonaRecoge(req.params.id, persona_recoge, parentesco_recoge, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Persona alternativa actualizada" });
  });
});

// Middleware debug para rutas no coincidentes dentro de /api/recogidas
router.use((req, res, next) => {
  console.log('[DEBUG Recogidas] Path no coincidente dentro del router:', req.method, req.path);
  next();
});

// Listar rutas definidas en este router
console.log('[DEBUG Recogidas] Rutas definidas:', router.stack.filter(l => l.route).map(l => l.route.path));

export default router;
