import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const router = express.Router();

// Necesario para rutas absolutas en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear pool de conexiones con promesas
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Obtener todas las configuraciones de una escuela
router.get('/escuela/:id_escuela', async (req, res) => {
  try {
    const { id_escuela } = req.params;
    
    const [configs] = await pool.query(
      'SELECT clave_config, valor_config, tipo_dato FROM configuraciones WHERE id_escuela = ?',
      [id_escuela]
    );
    
    // Convertir a objeto con clave-valor
    const configObject = {};
    configs.forEach(config => {
      let valor = config.valor_config;
      
      // Parsear según el tipo de dato
      if (config.tipo_dato === 'boolean') {
        valor = valor === 'true' || valor === '1';
      } else if (config.tipo_dato === 'int') {
        valor = parseInt(valor, 10);
      } else if (config.tipo_dato === 'json') {
        try {
          valor = JSON.parse(valor);
        } catch (e) {
          // Si falla el parse, dejar como string
        }
      }
      
      configObject[config.clave_config] = valor;
    });
    
    // Valores por defecto si no existen
    const defaults = {
      // Imagen de la escuela
      logo_escuela: '',
      
      // Logs
      registrar_logs: true,
      logs_recogidas: true,
      logs_mensajes: true,
      logs_accesos: true,
      
      // Mensajería entre roles
      mensajes_habilitados: true,
      mensajes_entre_roles: true,
      mensajes_entre_alumnos: false,
      mensajes_entre_padres: true,
      mensajes_entre_maestros: true,
      mensajes_alumno_maestro: true,
      mensajes_padre_maestro: true,
      
      // Notificaciones de maestro
      mostrar_boton_sonido: true,
      sonido_recogida_habilitado: true,
      
      // Permisos de roles
      maestros_ver_todos_grupos: false,
      padres_solicitar_recogida: true,
      alumnos_ver_directorio: true,
      
      // Funcionalidades
      boton_hijos_padres: true,
      boton_recogida_padres: true,
      boton_panel_maestros: true,
      boton_consultar_alumnos: true,
      
      // Sistema
      modo_mantenimiento: false,
      backup_automatico: true,
      registro_nuevos_usuarios: true,
      
      // Notificaciones
      alertas_recogida: true,
      mensajes_automaticos: false,
      recordatorios_tareas: true,
      
      // Seguridad
      verificacion_dos_pasos: false,
      acceso_cerebro: true
    };
    
    // Mezclar defaults con valores guardados
    const finalConfig = { ...defaults, ...configObject };
    
    res.json(finalConfig);
  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
    res.status(500).json({ error: 'Error al obtener configuraciones' });
  }
});

// Guardar/actualizar configuraciones de una escuela
router.put('/escuela/:id_escuela', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { id_escuela } = req.params;
    const configs = req.body;
    
    await connection.beginTransaction();
    
    for (const [clave, valor] of Object.entries(configs)) {
      // Determinar el tipo de dato
      let tipo_dato = 'string';
      let valorString = String(valor);
      
      if (typeof valor === 'boolean') {
        tipo_dato = 'boolean';
        valorString = valor ? 'true' : 'false';
      } else if (typeof valor === 'number') {
        tipo_dato = 'int';
      } else if (typeof valor === 'object') {
        tipo_dato = 'json';
        valorString = JSON.stringify(valor);
      }
      
      // Verificar si ya existe la configuración
      const [existing] = await connection.query(
        'SELECT id_config FROM configuraciones WHERE id_escuela = ? AND clave_config = ?',
        [id_escuela, clave]
      );
      
      if (existing.length > 0) {
        // Actualizar existente
        await connection.query(
          'UPDATE configuraciones SET valor_config = ?, tipo_dato = ? WHERE id_escuela = ? AND clave_config = ?',
          [valorString, tipo_dato, id_escuela, clave]
        );
      } else {
        // Insertar nueva
        await connection.query(
          'INSERT INTO configuraciones (id_escuela, clave_config, valor_config, tipo_dato) VALUES (?, ?, ?, ?)',
          [id_escuela, clave, valorString, tipo_dato]
        );
      }
    }
    
    await connection.commit();
    
    // Registrar en logs si está habilitado
    const [logsConfig] = await connection.query(
      'SELECT valor_config FROM configuraciones WHERE id_escuela = ? AND clave_config = ?',
      [id_escuela, 'registrar_logs']
    );
    
    const registrarLogs = !logsConfig.length || logsConfig[0].valor_config !== 'false';
    
    if (registrarLogs) {
      await connection.query(`
        INSERT INTO logs_actividad (id_usuario, id_escuela, accion, tabla_afectada, detalles)
        VALUES (?, ?, 'Configuración actualizada', 'configuraciones', ?)
      `, [req.body.id_usuario || null, id_escuela, JSON.stringify({ claves_modificadas: Object.keys(configs) })]);
    }
    
    res.json({ message: 'Configuraciones guardadas correctamente' });
  } catch (error) {
    await connection.rollback();
    console.error('Error al guardar configuraciones:', error);
    res.status(500).json({ error: 'Error al guardar configuraciones' });
  } finally {
    connection.release();
  }
});

// Subir logo de la escuela (guarda archivo en media/)
router.post('/escuela/:id_escuela/logo', async (req, res) => {
  try {
    const { id_escuela } = req.params;
    const { logo_base64 } = req.body;
    
    if (!logo_base64) {
      return res.status(400).json({ error: 'No se proporcionó imagen' });
    }
    
    console.log('📷 Subiendo logo para escuela:', id_escuela);
    
    // Extraer la extensión y datos de la imagen base64
    const matches = logo_base64.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Formato de imagen inválido' });
    }
    
    let extension = matches[1];
    const imageData = matches[2];
    
    // Normalizar extensión
    if (extension === 'jpeg') extension = 'jpg';
    if (extension === 'svg+xml') extension = 'svg';
    
    // Crear el nombre del archivo
    const fileName = `logo_escuela_${id_escuela}.${extension}`;
    const mediaPath = path.join(__dirname, '..', 'media', 'logo');
    const filePath = path.join(mediaPath, fileName);
    
    // Asegurar que existe la carpeta media
    if (!fs.existsSync(mediaPath)) {
      fs.mkdirSync(mediaPath, { recursive: true });
    }
    
    // Eliminar logos anteriores de esta escuela (diferentes extensiones)
    const existingFiles = fs.readdirSync(mediaPath).filter(f => f.startsWith(`logo_escuela_${id_escuela}.`));
    existingFiles.forEach(f => {
      fs.unlinkSync(path.join(mediaPath, f));
      console.log('📷 Logo anterior eliminado:', f);
    });
    
    // Guardar el archivo
    const buffer = Buffer.from(imageData, 'base64');
    fs.writeFileSync(filePath, buffer);
    console.log('📷 Logo guardado en:', filePath);
    
    // Guardar la ruta en la base de datos
    const logoUrl = `/media/logo/${fileName}`;
    
    const [existing] = await pool.query(
      'SELECT id_config FROM configuraciones WHERE id_escuela = ? AND clave_config = ?',
      [id_escuela, 'logo_escuela']
    );
    
    if (existing.length > 0) {
      await pool.query(
        'UPDATE configuraciones SET valor_config = ? WHERE id_escuela = ? AND clave_config = ?',
        [logoUrl, id_escuela, 'logo_escuela']
      );
    } else {
      await pool.query(
        'INSERT INTO configuraciones (id_escuela, clave_config, valor_config, tipo_dato) VALUES (?, ?, ?, ?)',
        [id_escuela, 'logo_escuela', logoUrl, 'string']
      );
    }
    
    console.log('📷 Logo registrado en BD:', logoUrl);
    res.json({ message: 'Logo actualizado correctamente', url: logoUrl });
    
  } catch (error) {
    console.error('❌ Error al subir logo:', error.message);
    res.status(500).json({ error: 'Error al subir logo: ' + error.message });
  }
});

// Eliminar logo de la escuela
router.delete('/escuela/:id_escuela/logo', async (req, res) => {
  try {
    const { id_escuela } = req.params;
    
    // Buscar y eliminar archivos de logo
    const mediaPath = path.join(__dirname, '..', 'media', 'logo');
    if (!fs.existsSync(mediaPath)) return res.json({ message: 'No hay logo para eliminar' });
    const existingFiles = fs.readdirSync(mediaPath).filter(f => f.startsWith(`logo_escuela_${id_escuela}.`));
    existingFiles.forEach(f => {
      fs.unlinkSync(path.join(mediaPath, f));
      console.log('📷 Logo eliminado:', f);
    });
    
    // Actualizar en BD
    await pool.query(
      'UPDATE configuraciones SET valor_config = ? WHERE id_escuela = ? AND clave_config = ?',
      ['', id_escuela, 'logo_escuela']
    );
    
    res.json({ message: 'Logo eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar logo:', error.message);
    res.status(500).json({ error: 'Error al eliminar logo' });
  }
});

// Obtener logs de actividad (solo para admin)
router.get('/escuela/:id_escuela/logs', async (req, res) => {
  try {
    const { id_escuela } = req.params;
    const { limit = 50, offset = 0, categoria } = req.query;
    
    let whereClause = 'WHERE l.id_escuela = ?';
    const params = [id_escuela];
    
    // Filtrar por categoría si se especifica
    if (categoria && categoria !== 'todos') {
      const categoriaMap = {
        'accesos': ['Inicio de sesión', 'Cierre de sesión', 'Login', 'Logout', 'Acceso'],
        'recogidas': ['Solicitud de recogida', 'Recogida', 'Aprobada', 'Rechazada', 'pickup'],
        'mensajes': ['Mensaje', 'mensaje', 'Chat', 'Notificación enviada'],
        'usuarios': ['Usuario', 'Registro', 'Cuenta', 'Perfil', 'usuario'],
        'configuracion': ['Configuración', 'Config', 'configuracion', 'settings'],
        'sistema': ['Sistema', 'Error', 'Mantenimiento', 'Actualización']
      };
      
      const keywords = categoriaMap[categoria];
      if (keywords) {
        whereClause += ' AND (' + keywords.map(() => 'l.accion LIKE ?').join(' OR ') + ')';
        keywords.forEach(kw => params.push(`%${kw}%`));
      }
    }
    
    params.push(parseInt(limit), parseInt(offset));
    
    const [logs] = await pool.query(`
      SELECT 
        l.*,
        u.nombre_completo as usuario_nombre,
        u.rol as usuario_rol
      FROM logs_actividad l
      LEFT JOIN usuarios u ON l.id_usuario = u.id_usuario
      ${whereClause}
      ORDER BY l.fecha_accion DESC
      LIMIT ? OFFSET ?
    `, params);
    
    res.json(logs);
  } catch (error) {
    console.error('Error al obtener logs:', error);
    res.status(500).json({ error: 'Error al obtener logs' });
  }
});

// Obtener estadísticas de logs para el cerebro
router.get('/escuela/:id_escuela/logs/stats', async (req, res) => {
  try {
    const { id_escuela } = req.params;
    
    // Estadísticas generales
    const [totalLogs] = await pool.query(
      'SELECT COUNT(*) as total FROM logs_actividad WHERE id_escuela = ?',
      [id_escuela]
    );
    
    const [logsHoy] = await pool.query(
      'SELECT COUNT(*) as total FROM logs_actividad WHERE id_escuela = ? AND DATE(fecha_accion) = CURDATE()',
      [id_escuela]
    );
    
    const [logsSemana] = await pool.query(
      'SELECT COUNT(*) as total FROM logs_actividad WHERE id_escuela = ? AND fecha_accion >= DATE_SUB(NOW(), INTERVAL 7 DAY)',
      [id_escuela]
    );
    
    // Logs por categoría
    const [porCategoria] = await pool.query(`
      SELECT 
        CASE 
          WHEN accion LIKE '%recogida%' OR accion LIKE '%pickup%' THEN 'Recogidas'
          WHEN accion LIKE '%sesión%' OR accion LIKE '%Login%' OR accion LIKE '%Logout%' OR accion LIKE '%Acceso%' THEN 'Accesos'
          WHEN accion LIKE '%Mensaje%' OR accion LIKE '%mensaje%' THEN 'Mensajes'
          WHEN accion LIKE '%Usuario%' OR accion LIKE '%usuario%' OR accion LIKE '%Registro%' THEN 'Usuarios'
          WHEN accion LIKE '%Config%' OR accion LIKE '%config%' THEN 'Configuración'
          ELSE 'Sistema'
        END as categoria,
        COUNT(*) as total
      FROM logs_actividad 
      WHERE id_escuela = ?
      GROUP BY categoria
      ORDER BY total DESC
    `, [id_escuela]);
    
    // Usuarios más activos
    const [usuariosActivos] = await pool.query(`
      SELECT 
        u.nombre_completo,
        u.rol,
        COUNT(*) as acciones
      FROM logs_actividad l
      JOIN usuarios u ON l.id_usuario = u.id_usuario
      WHERE l.id_escuela = ?
      GROUP BY l.id_usuario
      ORDER BY acciones DESC
      LIMIT 5
    `, [id_escuela]);
    
    // Actividad por hora (últimas 24 horas)
    const [actividadPorHora] = await pool.query(`
      SELECT 
        HOUR(fecha_accion) as hora,
        COUNT(*) as total
      FROM logs_actividad 
      WHERE id_escuela = ? AND fecha_accion >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      GROUP BY HOUR(fecha_accion)
      ORDER BY hora
    `, [id_escuela]);
    
    res.json({
      total: totalLogs[0]?.total || 0,
      hoy: logsHoy[0]?.total || 0,
      semana: logsSemana[0]?.total || 0,
      porCategoria,
      usuariosActivos,
      actividadPorHora
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de logs:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Limpiar logs antiguos
router.delete('/escuela/:id_escuela/logs', async (req, res) => {
  try {
    const { id_escuela } = req.params;
    const { dias_antiguedad = 30 } = req.body;
    
    const [result] = await pool.query(`
      DELETE FROM logs_actividad 
      WHERE id_escuela = ? 
      AND fecha_accion < DATE_SUB(NOW(), INTERVAL ? DAY)
    `, [id_escuela, dias_antiguedad]);
    
    res.json({ 
      message: 'Logs limpiados correctamente',
      registros_eliminados: result.affectedRows
    });
  } catch (error) {
    console.error('Error al limpiar logs:', error);
    res.status(500).json({ error: 'Error al limpiar logs' });
  }
});

export default router;
