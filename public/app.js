
    /*
    ========================================
    ESTRUCTURA DEL PROYECTO ESCOLARFAM
    ========================================
    
    CARPETAS Y ARCHIVOS NECESARIOS:
    
    /
    ├── index.html (este archivo - interfaz principal)
    ├── /server/
    │   ├── server.js (servidor Node.js principal)
    │   ├── /routes/
    │   │   ├── auth.js (autenticación y sesiones)
    │   │   ├── usuarios.js (gestión de usuarios)
    │   │   ├── grupos.js (gestión de grupos y clases)
    │   │   ├── mensajes.js (sistema de mensajería)
    │   │   ├── notificaciones.js (alertas y notificaciones)
    │   │   ├── recogidas.js (solicitudes de recogida)
    │   │   ├── consultas.js (tickets y consultas)
    │   │   ├── configuracion.js (ajustes del sistema)
    │   │   ├── logs.js (registros de actividad)
    │   │   └── escuelas.js (datos de escuelas)
    │   ├── /models/ (modelos de base de datos)
    │   ├── /middleware/ (autenticación, validación)
    │   └── /config/
    │       ├── database.js (configuración de BD)
    │       └── config.js (configuraciones generales)
    ├── /public/
    │   ├── /css/ (estilos adicionales)
    │   ├── /js/ (scripts adicionales)
    │   └── /uploads/ (fotos de perfil, documentos)
    └── package.json (dependencias Node.js)
    
    ========================================
    BASE DE DATOS REQUERIDA (MySQL/MariaDB):
    ========================================
    
    TABLAS PRINCIPALES:
    
    1. escuelas
       - id_escuela (INT PRIMARY KEY AUTO_INCREMENT)
       - nombre_escuela (VARCHAR(255))
       - direccion (TEXT)
       - telefono (VARCHAR(20))
       - codigo_postal (VARCHAR(10))
       - sitio_web (VARCHAR(255))
       - fecha_creacion (TIMESTAMP)
       - activa (BOOLEAN DEFAULT 1)
    
    2. usuarios
       - id_usuario (INT PRIMARY KEY AUTO_INCREMENT)
       - id_escuela (INT FOREIGN KEY)
       - nombre_completo (VARCHAR(255))
       - email (VARCHAR(255) UNIQUE)
       - password_hash (VARCHAR(255))
       - rol (ENUM: 'alumno', 'padre', 'maestro', 'admin')
       - foto_perfil (VARCHAR(255))
       - activo (BOOLEAN DEFAULT 1)
       - fecha_registro (TIMESTAMP)
       - ultimo_acceso (TIMESTAMP)
    
    3. grupos
       - id_grupo (INT PRIMARY KEY AUTO_INCREMENT)
       - id_escuela (INT FOREIGN KEY)
       - nombre_grupo (VARCHAR(50)) -- ej: "3-A"
       - id_maestro (INT FOREIGN KEY usuarios)
       - grado (INT)
       - seccion (VARCHAR(10))
       - activo (BOOLEAN DEFAULT 1)
    
    4. relaciones_familiares
       - id_relacion (INT PRIMARY KEY AUTO_INCREMENT)
       - id_padre (INT FOREIGN KEY usuarios)
       - id_hijo (INT FOREIGN KEY usuarios)
       - parentesco (ENUM: 'padre', 'madre', 'tutor', 'abuelo', 'otro')
       - autorizado_recogida (BOOLEAN DEFAULT 1)
    
    5. asignaciones_grupos
       - id_asignacion (INT PRIMARY KEY AUTO_INCREMENT)
       - id_usuario (INT FOREIGN KEY usuarios)
       - id_grupo (INT FOREIGN KEY grupos)
       - fecha_asignacion (TIMESTAMP)
       - activa (BOOLEAN DEFAULT 1)
    
    6. mensajes
       - id_mensaje (INT PRIMARY KEY AUTO_INCREMENT)
       - id_remitente (INT FOREIGN KEY usuarios)
       - id_destinatario (INT FOREIGN KEY usuarios)
       - asunto (VARCHAR(255))
       - contenido (TEXT)
       - leido (BOOLEAN DEFAULT 0)
       - fecha_envio (TIMESTAMP)
       - tipo (ENUM: 'personal', 'grupal', 'sistema')
    
    7. notificaciones
       - id_notificacion (INT PRIMARY KEY AUTO_INCREMENT)
       - id_usuario (INT FOREIGN KEY usuarios)
       - tipo (ENUM: 'recogida', 'mensaje', 'alerta', 'sistema')
       - titulo (VARCHAR(255))
       - contenido (TEXT)
       - leida (BOOLEAN DEFAULT 0)
       - fecha_creacion (TIMESTAMP)
    
    8. solicitudes_recogida
       - id_solicitud (INT PRIMARY KEY AUTO_INCREMENT)
       - id_padre (INT FOREIGN KEY usuarios)
       - id_hijo (INT FOREIGN KEY usuarios)
       - fecha_solicitud (TIMESTAMP)
       - estado (ENUM: 'pendiente', 'aprobada', 'rechazada')
       - observaciones (TEXT)
       - id_aprobador (INT FOREIGN KEY usuarios)
    
    9. consultas_tickets
       - id_ticket (INT PRIMARY KEY AUTO_INCREMENT)
       - id_usuario (INT FOREIGN KEY usuarios)
       - id_escuela (INT FOREIGN KEY escuelas)
       - asunto (VARCHAR(255))
       - contenido (TEXT)
       - categoria (ENUM: 'tecnico', 'academico', 'administrativo', 'general')
       - prioridad (ENUM: 'baja', 'media', 'alta')
       - estado (ENUM: 'abierto', 'en_proceso', 'respondido', 'archivado')
       - fecha_creacion (TIMESTAMP)
       - fecha_actualizacion (TIMESTAMP)
    
    10. respuestas_tickets
        - id_respuesta (INT PRIMARY KEY AUTO_INCREMENT)
        - id_ticket (INT FOREIGN KEY consultas_tickets)
        - id_usuario (INT FOREIGN KEY usuarios)
        - contenido (TEXT)
        - fecha_respuesta (TIMESTAMP)
    
    11. logs_actividad
        - id_log (INT PRIMARY KEY AUTO_INCREMENT)
        - id_usuario (INT FOREIGN KEY usuarios)
        - id_escuela (INT FOREIGN KEY escuelas)
        - accion (VARCHAR(255))
        - tabla_afectada (VARCHAR(100))
        - id_registro (INT)
        - detalles (JSON)
        - ip_address (VARCHAR(45))
        - user_agent (TEXT)
        - fecha_accion (TIMESTAMP)
    
    12. configuraciones
        - id_config (INT PRIMARY KEY AUTO_INCREMENT)
        - id_escuela (INT FOREIGN KEY escuelas)
        - clave_config (VARCHAR(100))
        - valor_config (TEXT)
        - tipo_dato (ENUM: 'string', 'int', 'boolean', 'json')
        - fecha_actualizacion (TIMESTAMP)
    
    ========================================
    FUNCIONES JAVASCRIPT QUE NECESITAN CONEXIÓN A BD:
    ========================================
    */

    // CONFIGURACIÓN DE LA API
    const API_BASE_URL = '/api/'; // Ruta base de la API Node.js
    
    // FUNCIONES QUE REQUIEREN CONEXIÓN A BASE DE DATOS:
    
    /*
    ========================================
    1. AUTENTICACIÓN Y SESIONES
    ========================================
    Endpoint: /api/auth
    
    Funciones JS que necesitan conexión:
    - login(email, password) → POST /api/auth/login
    - logout() → POST /api/auth/logout  
    - verificarSesion() → GET /api/auth/session
    - cambiarPassword(passwordActual, passwordNueva) → POST /api/auth/change-password
    */
    
    /*
    ========================================
    2. GESTIÓN DE USUARIOS
    ========================================
    Archivo: /controladores/usuarios.php
    
    Funciones JS que necesitan conexión:
    - obtenerDatosUsuario(idUsuario) → GET usuarios.php?action=obtener&id={idUsuario}
    - actualizarPerfil(datosUsuario) → POST usuarios.php?action=actualizar
    - registrarUsuario(datosUsuario) → POST usuarios.php?action=registrar
    - obtenerUsuariosPorRol(rol, idEscuela) → GET usuarios.php?action=por_rol&rol={rol}&escuela={idEscuela}
    - cambiarFotoPerfil(archivo) → POST usuarios.php?action=cambiar_foto
    - obtenerAmigos(idUsuario) → GET usuarios.php?action=amigos&id={idUsuario}
    */
    
    /*
    ========================================
    3. GESTIÓN DE GRUPOS Y CLASES
    ========================================
    Archivo: /controladores/grupos.php
    
    Funciones JS que necesitan conexión:
    - obtenerGruposUsuario(idUsuario) → GET grupos.php?action=usuario&id={idUsuario}
    - obtenerEstudiantesGrupo(idGrupo) → GET grupos.php?action=estudiantes&grupo={idGrupo}
    - obtenerMaestrosEscuela(idEscuela) → GET grupos.php?action=maestros&escuela={idEscuela}
    - asignarEstudianteGrupo(idEstudiante, idGrupo) → POST grupos.php?action=asignar
    - crearGrupo(datosGrupo) → POST grupos.php?action=crear
    */
    
    /*
    ========================================
    4. SISTEMA DE MENSAJERÍA
    ========================================
    Archivo: /controladores/mensajes.php
    
    Funciones JS que necesitan conexión:
    - obtenerConversaciones(idUsuario) → GET mensajes.php?action=conversaciones&usuario={idUsuario}
    - obtenerMensajes(idRemitente, idDestinatario) → GET mensajes.php?action=mensajes&remitente={id}&destinatario={id}
    - enviarMensaje(idRemitente, idDestinatario, contenido) → POST mensajes.php?action=enviar
    - marcarComoLeido(idMensaje) → POST mensajes.php?action=marcar_leido
    - obtenerMensajesNoLeidos(idUsuario) → GET mensajes.php?action=no_leidos&usuario={idUsuario}
    */
    
    /*
    ========================================
    5. NOTIFICACIONES Y ALERTAS
    ========================================
    Archivo: /controladores/notificaciones.php
    
    Funciones JS que necesitan conexión:
    - obtenerNotificaciones(idUsuario) → GET notificaciones.php?action=obtener&usuario={idUsuario}
    - crearNotificacion(datosNotificacion) → POST notificaciones.php?action=crear
    - marcarNotificacionLeida(idNotificacion) → POST notificaciones.php?action=marcar_leida
    - obtenerNotificacionesNoLeidas(idUsuario) → GET notificaciones.php?action=no_leidas&usuario={idUsuario}
    */
    
    /*
    ========================================
    6. SOLICITUDES DE RECOGIDA
    ========================================
    Archivo: /controladores/recogidas.php
    
    Funciones JS que necesitan conexión:
    - solicitarRecogida(idPadre, idHijo, observaciones) → POST recogidas.php?action=solicitar
    - obtenerSolicitudesPendientes(idEscuela) → GET recogidas.php?action=pendientes&escuela={idEscuela}
    - aprobarRecogida(idSolicitud, idAprobador) → POST recogidas.php?action=aprobar
    - rechazarRecogida(idSolicitud, idAprobador, motivo) → POST recogidas.php?action=rechazar
    - obtenerHistorialRecogidas(idUsuario) → GET recogidas.php?action=historial&usuario={idUsuario}
    */
    
    /*
    ========================================
    7. CONSULTAS Y TICKETS
    ========================================
    Archivo: /controladores/consultas.php
    
    Funciones JS que necesitan conexión:
    - obtenerTickets(idEscuela, filtros) → GET consultas.php?action=obtener&escuela={idEscuela}&filtros={json}
    - crearTicket(datosTicket) → POST consultas.php?action=crear
    - responderTicket(idTicket, idUsuario, respuesta) → POST consultas.php?action=responder
    - cambiarEstadoTicket(idTicket, nuevoEstado) → POST consultas.php?action=cambiar_estado
    - archivarTicket(idTicket) → POST consultas.php?action=archivar
    - eliminarTicket(idTicket) → DELETE consultas.php?action=eliminar&id={idTicket}
    - obtenerEstadisticasTickets(idEscuela) → GET consultas.php?action=estadisticas&escuela={idEscuela}
    */
    
    /*
    ========================================
    8. CONFIGURACIONES DEL SISTEMA
    ========================================
    Archivo: /controladores/configuracion.php
    
    Funciones JS que necesitan conexión:
    - obtenerConfiguraciones(idEscuela) → GET configuracion.php?action=obtener&escuela={idEscuela}
    - guardarConfiguracion(clave, valor, idEscuela) → POST configuracion.php?action=guardar
    - obtenerPermisosRol(rol, idEscuela) → GET configuracion.php?action=permisos&rol={rol}&escuela={idEscuela}
    - actualizarPermisosRol(rol, permisos, idEscuela) → POST configuracion.php?action=actualizar_permisos
    */
    
    /*
    ========================================
    9. LOGS Y MONITOREO (CEREBRO)
    ========================================
    Archivo: /controladores/logs.php
    
    Funciones JS que necesitan conexión:
    - obtenerLogsActividad(idEscuela, filtros) → GET logs.php?action=actividad&escuela={idEscuela}&filtros={json}
    - registrarLog(accion, tabla, idRegistro, detalles) → POST logs.php?action=registrar
    - obtenerEstadisticasUso(idEscuela) → GET logs.php?action=estadisticas&escuela={idEscuela}
    - obtenerUsuariosActivos(idEscuela) → GET logs.php?action=usuarios_activos&escuela={idEscuela}
    */
    
    /*
    ========================================
    10. GESTIÓN DE ESCUELAS
    ========================================
    Archivo: /controladores/escuelas.php
    
    Funciones JS que necesitan conexión:
    - obtenerDatosEscuela(idEscuela) → GET escuelas.php?action=obtener&id={idEscuela}
    - actualizarDatosEscuela(datosEscuela) → POST escuelas.php?action=actualizar
    - obtenerEscuelasActivas() → GET escuelas.php?action=activas
    */
    
    /*
    ========================================
    FUNCIONES AUXILIARES PARA CONEXIÓN
    ========================================
    */
    
    // Función genérica para hacer peticiones AJAX
    async function hacerPeticionAPI(endpoint, metodo = 'GET', datos = null) {
        try {
            const opciones = {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            
            if (datos && metodo !== 'GET') {
                opciones.body = JSON.stringify(datos);
            }
            
            const respuesta = await fetch(API_BASE_URL + endpoint, opciones);
            const resultado = await respuesta.json();
            
            if (!respuesta.ok) {
                throw new Error(resultado.mensaje || 'Error en la petición');
            }
            
            return resultado;
        } catch (error) {
            console.error('Error en petición API:', error);
            showToast('Error de conexión: ' + error.message, 'error');
            throw error;
        }
    }
    
    /*
    ========================================
    EJEMPLOS DE IMPLEMENTACIÓN
    ========================================
    
    Para convertir las funciones estáticas a dinámicas, reemplaza:
    
    1. DATOS DE USUARIO ESTÁTICOS:
       const userData = {...} 
       ↓ CAMBIAR POR:
       let userData = {};
       async function cargarDatosUsuario() {
           userData = await hacerPeticionAPI(`usuarios.php?action=obtener&id=${idUsuarioActual}`);
       }
    
    2. GRUPOS ESTÁTICOS:
       const groupStudents = {...}
       ↓ CAMBIAR POR:
       let groupStudents = {};
       async function cargarEstudiantesGrupo(idGrupo) {
           groupStudents[idGrupo] = await hacerPeticionAPI(`grupos.php?action=estudiantes&grupo=${idGrupo}`);
       }
    
    3. MENSAJES ESTÁTICOS:
       const chats = [...]
       ↓ CAMBIAR POR:
       let chats = [];
       async function cargarConversaciones() {
           chats = await hacerPeticionAPI(`mensajes.php?action=conversaciones&usuario=${idUsuarioActual}`);
       }
    
    4. TICKETS ESTÁTICOS:
       const tickets = [...]
       ↓ CAMBIAR POR:
       let tickets = [];
       async function cargarTickets() {
           tickets = await hacerPeticionAPI(`consultas.php?action=obtener&escuela=${idEscuelaActual}`);
       }
    
    ========================================
    VARIABLES GLOBALES NECESARIAS
    ========================================
    */
    
    let idUsuarioActual = null;      // Se obtiene al hacer login
    let idEscuelaActual = null;      // Se obtiene del usuario logueado
    let rolUsuarioActual = null;     // Se obtiene del usuario logueado
    let datosEscuelaActual = null;   // Se cargan al iniciar sesión
    
    /*
    ========================================
    INICIALIZACIÓN DEL SISTEMA
    ========================================
    
    Al cargar la página, ejecutar:
    1. verificarSesion() - Verificar si hay sesión activa
    2. Si hay sesión: cargar datos del usuario y escuela
    3. Si no hay sesión: mostrar formulario de login
    4. Cargar configuraciones de la escuela
    5. Inicializar interfaz según el rol del usuario
    */

    const defaultConfig = {
      app_title: "EscolarFam",
      welcome_message: "Bienvenido a tu escuela",
      primary_color: "#FFB347",
      secondary_color: "#A8E6CF",
      accent_color: "#FF6B35",
      background_color: "#FFF9F0",
      text_color: "#333333"
    };

    let currentRole = 'alumno';
    let currentScreen = 'gafete';
    let touchStartX = 0;
    let touchEndX = 0;
    let brainPanelX = 0;
    let brainPanelY = 0;

    const userData = {
      alumno: {
        name: "Juan Pérez",
        icon: "fas fa-child",
        emoji: "👦",
        role: "Alumno",
        assignment: "Grupo 3-A",
        groups: ["3-A"],
        parents: [
          { name: "María Pérez", icon: "fas fa-female", emoji: "👩" },
          { name: "Carlos Pérez", icon: "fas fa-male", emoji: "👨" }
        ]
      },
      padre: {
        name: "María Pérez",
        icon: "fas fa-female",
        emoji: "👩",
        role: "Padre de Familia",
        assignment: "Madre de Juan y Ana",
        children: [
          { name: "Juan Pérez", icon: "fas fa-child", emoji: "👦", group: "3-A" },
          { name: "Ana Pérez", icon: "fas fa-child", emoji: "👧", group: "1-B" }
        ]
      },
      maestro: {
        name: "Prof. García",
        icon: "fas fa-chalkboard-teacher",
        emoji: "👨‍🏫",
        role: "Maestro",
        assignment: "Matemáticas",
        groups: ["3-A", "3-B", "4-A"]
      },
      admin: {
        name: "Director Sistema",
        icon: "fas fa-user-tie",
        emoji: "👔",
        role: "Director/Admin",
        assignment: "Dirección General",
        groups: ["3-A", "3-B", "4-A", "5-A"]
      }
    };

    const groupStudents = {
      "3-A": [
        { name: "Juan Pérez", icon: "fas fa-child", emoji: "👦" },
        { name: "María López", icon: "fas fa-child", emoji: "👧" },
        { name: "Pedro Gómez", icon: "fas fa-child", emoji: "👦" },
        { name: "Ana Martínez", icon: "fas fa-child", emoji: "👧" },
        { name: "Luis Torres", icon: "fas fa-child", emoji: "👦" }
      ],
      "3-B": [
        { name: "Sofia Ruiz", icon: "fas fa-child", emoji: "👧" },
        { name: "Diego Castro", icon: "fas fa-child", emoji: "👦" },
        { name: "Laura Díaz", icon: "fas fa-child", emoji: "👧" }
      ],
      "4-A": [
        { name: "Carlos Vega", icon: "fas fa-child", emoji: "👦" },
        { name: "Elena Flores", icon: "fas fa-child", emoji: "👧" },
        { name: "Miguel Ángel", icon: "fas fa-child", emoji: "👦" }
      ]
    };

    const schoolTeachers = [
      { name: "Prof. García", emoji: "👨‍🏫", subject: "Matemáticas", icon: "fas fa-chalkboard-teacher" },
      { name: "Profa. López", emoji: "👩‍🏫", subject: "Español", icon: "fas fa-chalkboard-teacher" },
      { name: "Prof. Martínez", emoji: "👨‍🏫", subject: "Ciencias", icon: "fas fa-flask" },
      { name: "Profa. Rodríguez", emoji: "👩‍🏫", subject: "Historia", icon: "fas fa-book" },
      { name: "Prof. Sánchez", emoji: "👨‍🏫", subject: "Educación Física", icon: "fas fa-running" },
      { name: "Profa. Torres", emoji: "👩‍🏫", subject: "Arte", icon: "fas fa-palette" },
      { name: "Prof. Morales", emoji: "👨‍🏫", subject: "Música", icon: "fas fa-music" },
      { name: "Profa. Vega", emoji: "👩‍🏫", subject: "Inglés", icon: "fas fa-globe" }
    ];

    function renderBadge(user) {
      return `
        <div class="badge">
          <div class="badge-header">
            <div class="badge-photo">${user.emoji}</div>
            <div class="badge-name">${user.name}</div>
            <div class="badge-role">${user.role}</div>
            <div class="badge-assignment">${user.assignment}</div>
          </div>
          <div class="badge-qr">
            <i class="fas fa-qrcode"></i>
          </div>
        </div>
        <div class="swipe-indicator">
          <i class="fas fa-chevron-left"></i>
          Desliza para explorar
          <i class="fas fa-chevron-right"></i>
        </div>
      `;
    }

    function renderGroupList(groups) {
      const items = groups.map(group => `
        <div class="list-item" onclick="showGroupTree('${group}')">
          <div class="list-item-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="list-item-text">Grupo ${group}</div>
          <i class="fas fa-chevron-right" style="color: #FFB347;"></i>
        </div>
      `).join('');

      return `
        <div class="list-screen">
          <div class="list-title">Mis Grupos</div>
          ${items}
        </div>
      `;
    }

    function renderChildrenList(children) {
      const items = children.map(child => `
        <div class="list-item">
          <div class="list-item-icon">${child.emoji}</div>
          <div class="list-item-text">${child.name}<br><small style="color: #999;">Grupo ${child.group}</small></div>
        </div>
      `).join('');

      return `
        <div class="list-screen">
          <div class="list-title">Mis Hijos</div>
          ${items}
        </div>
      `;
    }

    function renderGroupTree(groupName) {
      const students = groupStudents[groupName] || [];
      const studentNodes = students.map(student => `
        <div class="tree-node tree-leaf" onclick="showBubbleOptions({name: '${student.name}', emoji: '${student.emoji}', icon: '${student.icon}'}, [{action: 'message', icon: 'fas fa-comment', label: 'Mensaje'}, {action: 'info', icon: 'fas fa-info', label: 'Info'}])">
          ${student.emoji}
          <div style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: bold; color: #7EC8A3; white-space: nowrap;">${student.name}</div>
        </div>
      `).join('');

      return `
        <div class="tree-screen">
          <button class="back-button" onclick="renderScreens()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="tree-container">
            <div class="tree-node tree-teacher">👨‍🏫</div>
            <div class="tree-line" style="height: 30px; top: 90px;"></div>
            <div class="tree-students">
              ${studentNodes}
            </div>
          </div>
          <div style="text-align: center; margin-top: 50px; color: #7EC8A3; font-weight: bold; font-size: 20px;">
            Grupo ${groupName}
          </div>
        </div>
      `;
    }

    function renderTeachersTree() {
      const teacherNodes = schoolTeachers.map(teacher => `
        <div class="tree-node tree-leaf" onclick="showBubbleOptions({name: '${teacher.name}', emoji: '${teacher.emoji}', icon: '${teacher.icon}'}, [{action: 'message', icon: 'fas fa-comment', label: 'Mensaje'}, {action: 'info', icon: 'fas fa-info', label: 'Info'}, {action: 'edit', icon: 'fas fa-edit', label: 'Editar'}])">
          ${teacher.emoji}
          <div style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: bold; color: #7EC8A3; white-space: nowrap;">${teacher.name}</div>
        </div>
      `).join('');

      return `
        <div class="tree-screen">
          <div class="tree-container">
            <div style="text-align: center; margin-bottom: 40px; color: #7EC8A3; font-weight: bold; font-size: 24px;">
              Personal Docente
            </div>
            <div class="tree-students">
              ${teacherNodes}
            </div>
          </div>
        </div>
      `;
    }

    function renderParentBadges(parents) {
      const badges = parents.map(parent => `
        <div class="badge" style="margin-bottom: 20px;">
          <div class="badge-header">
            <div class="badge-photo">${parent.emoji}</div>
            <div class="badge-name">${parent.name}</div>
            <div class="badge-role">Padre/Madre</div>
          </div>
        </div>
      `).join('');

      return `
        <div class="screen" style="padding-top: 40px;">
          ${badges}
        </div>
      `;
    }

    function renderChildBadges(children) {
      const badges = children.map(child => `
        <div class="badge" style="margin-bottom: 20px;">
          <div class="badge-header">
            <div class="badge-photo">${child.emoji}</div>
            <div class="badge-name">${child.name}</div>
            <div class="badge-role">Alumno</div>
            <div class="badge-assignment">Grupo ${child.group}</div>
          </div>
        </div>
      `).join('');

      return `
        <div class="screen" style="padding-top: 40px;">
          ${badges}
        </div>
      `;
    }

    function renderBrainPanel() {
      const logTypes = [
        { title: "Accesos", color: "#A8E6CF", icon: "fas fa-sign-in-alt" },
        { title: "Modificaciones", color: "#FFB347", icon: "fas fa-edit" },
        { title: "Mensajes", color: "#FF6B35", icon: "fas fa-comments" },
        { title: "Alertas", color: "#FF6B6B", icon: "fas fa-exclamation-triangle" },
        { title: "Calificaciones", color: "#95E1D3", icon: "fas fa-star" },
        { title: "Sistema", color: "#9B59B6", icon: "fas fa-cogs" },
        { title: "Errores", color: "#E74C3C", icon: "fas fa-bug" },
        { title: "Backups", color: "#3498DB", icon: "fas fa-database" },
        { title: "Usuarios", color: "#F39C12", icon: "fas fa-users" },
        { title: "Seguridad", color: "#8E44AD", icon: "fas fa-shield-alt" }
      ];

      const columns = logTypes.map(type => {
        const entries = Array.from({ length: 30 }, (_, i) => {
          const actions = {
            "Accesos": ["Inicio de sesión", "Cierre de sesión", "Acceso denegado", "Login exitoso"],
            "Modificaciones": ["Perfil actualizado", "Configuración cambiada", "Datos modificados", "Información editada"],
            "Mensajes": ["Mensaje enviado", "Mensaje recibido", "Chat iniciado", "Notificación enviada"],
            "Alertas": ["Alerta crítica", "Advertencia", "Notificación urgente", "Sistema sobrecargado"],
            "Calificaciones": ["Calificación asignada", "Nota actualizada", "Evaluación completada", "Promedio calculado"],
            "Sistema": ["Reinicio del sistema", "Actualización aplicada", "Mantenimiento", "Configuración global"],
            "Errores": ["Error de conexión", "Fallo en base de datos", "Excepción capturada", "Error de validación"],
            "Backups": ["Backup completado", "Restauración iniciada", "Copia de seguridad", "Sincronización"],
            "Usuarios": ["Usuario registrado", "Perfil creado", "Cuenta activada", "Rol asignado"],
            "Seguridad": ["Intento de acceso", "Contraseña cambiada", "Token generado", "Sesión expirada"]
          };
          
          const actionList = actions[type.title] || ["Acción realizada"];
          const randomAction = actionList[Math.floor(Math.random() * actionList.length)];
          
          return `
            <div class="log-entry" style="border-left-color: ${type.color};">
              <div class="log-time">${new Date(Date.now() - i * 180000).toLocaleTimeString()}</div>
              <div class="log-user">
                <i class="${type.icon}" style="color: ${type.color}; margin-right: 5px;"></i>
                Usuario ${Math.floor(Math.random() * 100) + 1}
              </div>
              <div class="log-action">${randomAction}</div>
              <div class="log-details" style="font-size: 10px; color: #aaa; margin-top: 3px;">
                ID: ${Math.random().toString(36).substr(2, 9)}
              </div>
            </div>
          `;
        }).join('');

        return `
          <div class="log-column">
            <div class="log-column-title" style="color: ${type.color};">
              <i class="${type.icon}" style="margin-right: 8px;"></i>
              ${type.title}
              <div style="font-size: 10px; font-weight: normal; opacity: 0.7; margin-top: 2px;">
                ${Math.floor(Math.random() * 50) + 10} entradas hoy
              </div>
            </div>
            <div class="log-entries-container">
              ${entries}
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="brain-panel" id="brainPanel">
          <div class="brain-header">
            <div class="brain-title">
              <i class="fas fa-brain"></i> Centro de Monitoreo del Sistema
            </div>
            <div class="brain-stats">
              <div class="stat-chip">
                <i class="fas fa-circle" style="color: #4CAF50;"></i>
                Sistema Operativo
              </div>
              <div class="stat-chip">
                <i class="fas fa-users"></i>
                ${Math.floor(Math.random() * 50) + 20} usuarios activos
              </div>
              <div class="stat-chip">
                <i class="fas fa-clock"></i>
                Última actualización: ${new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
          <div class="brain-container" id="brainContainer">
            ${columns}
          </div>
          <div class="brain-navigation">
            <div class="nav-indicator">
              <i class="fas fa-chevron-left"></i>
              Desliza horizontalmente para ver más logs
              <i class="fas fa-chevron-right"></i>
            </div>
          </div>
        </div>
      `;
    }

    function renderProfileScreen() {
      const user = userData[currentRole];
      const isTeacher = currentRole === 'maestro' || currentRole === 'director' || currentRole === 'admin';
      
      let schoolDataSection = '';
      if (currentRole === 'admin') {
        schoolDataSection = `
          <div class="profile-form">
            <div class="config-title">Datos de la Escuela</div>
            <div class="form-group">
              <label class="form-label">Nombre de la Escuela</label>
              <input type="text" class="form-input" value="Escuela Primaria Winnie Pooh">
            </div>
            <div class="form-group">
              <label class="form-label">Dirección</label>
              <input type="text" class="form-input" value="Calle del Bosque de los 100 Acres #123">
            </div>
            <div class="form-group">
              <label class="form-label">Teléfono</label>
              <input type="text" class="form-input" value="555-0123">
            </div>
            <div class="form-group">
              <label class="form-label">Código Postal</label>
              <input type="text" class="form-input" value="12345">
            </div>
            <div class="form-group">
              <label class="form-label">Sitio Web</label>
              <input type="text" class="form-input" value="www.escuelawinniepooh.edu">
            </div>
          </div>
        `;
      }

      let permissionsSection = '';
      if (currentRole === 'admin') {
        permissionsSection = `
          <div class="permissions-list">
            <div class="config-title">Permisos de Administrador</div>
            <div class="permission-item">
              <div class="permission-icon"><i class="fas fa-crown"></i></div>
              <div>Acceso completo al sistema</div>
            </div>
            <div class="permission-item">
              <div class="permission-icon"><i class="fas fa-users-cog"></i></div>
              <div>Gestión de usuarios y roles</div>
            </div>
            <div class="permission-item">
              <div class="permission-icon"><i class="fas fa-brain"></i></div>
              <div>Monitoreo del sistema (Cerebro)</div>
            </div>
            <div class="permission-item">
              <div class="permission-icon"><i class="fas fa-ticket-alt"></i></div>
              <div>Gestión de consultas y tickets</div>
            </div>
            <div class="permission-item">
              <div class="permission-icon"><i class="fas fa-cog"></i></div>
              <div>Configuración global del sistema</div>
            </div>
          </div>
        `;
      } else if (isTeacher) {
        permissionsSection = `
          <div class="permissions-list">
            <div class="config-title">Mis Permisos</div>
            <div class="permission-item">
              <div class="permission-icon"><i class="fas fa-users"></i></div>
              <div>Gestionar grupos asignados</div>
            </div>
            <div class="permission-item">
              <div class="permission-icon"><i class="fas fa-clipboard-check"></i></div>
              <div>Calificar actividades</div>
            </div>
            <div class="permission-item">
              <div class="permission-icon"><i class="fas fa-bell"></i></div>
              <div>Recibir notificaciones de padres</div>
            </div>
            <div class="permission-item">
              <div class="permission-icon"><i class="fas fa-comments"></i></div>
              <div>Mensajería con padres y alumnos</div>
            </div>
          </div>
        `;
      }

      return `
        <div class="profile-screen">
          <div class="profile-photo-section">
            <div class="profile-photo-large" onclick="changeProfilePhoto()">${user.emoji}</div>
            <div style="color: #FFB347; font-weight: bold;">Toca para cambiar foto</div>
          </div>
          
          <div class="profile-form">
            <div class="config-title">Información Personal</div>
            <div class="form-group">
              <label class="form-label">Nombre Completo</label>
              <input type="text" class="form-input" value="${user.name}">
            </div>
            <div class="form-group">
              <label class="form-label">Rol</label>
              <input type="text" class="form-input" value="${user.role}" disabled>
            </div>
            <div class="form-group">
              <label class="form-label">Asignación</label>
              <input type="text" class="form-input" value="${user.assignment}">
            </div>
            <div class="form-group">
              <label class="form-label">Correo Electrónico</label>
              <input type="email" class="form-input" value="director@escuelawinniepooh.edu">
            </div>
            <div class="form-group">
              <label class="form-label">Nueva Contraseña</label>
              <input type="password" class="form-input" placeholder="Dejar vacío para mantener actual">
            </div>
          </div>

          ${schoolDataSection}
          ${permissionsSection}

          <button class="save-button" onclick="saveProfile()">
            <i class="fas fa-save"></i> Guardar Cambios
          </button>
        </div>
      `;
    }

    function renderNotificationsScreen() {
      const notifications = [
        {
          id: 1,
          type: 'pickup',
          time: '14:30',
          content: 'María Pérez ha llegado por Juan Pérez (3-A)',
          student: 'Juan Pérez',
          parent: 'María Pérez'
        },
        {
          id: 2,
          type: 'pickup',
          time: '14:25',
          content: 'Carlos López solicita recoger a Ana López (1-B)',
          student: 'Ana López',
          parent: 'Carlos López'
        },
        {
          id: 3,
          type: 'alert',
          time: '13:45',
          content: 'Recordatorio: Reunión de padres mañana a las 16:00',
          student: null,
          parent: null
        }
      ];

      const notificationItems = notifications.map(notif => `
        <div class="notification-item">
          <div class="notification-header">
            <strong>${notif.type === 'pickup' ? '🚗 Recogida' : '📢 Alerta'}</strong>
            <span class="notification-time">${notif.time}</span>
          </div>
          <div class="notification-content">${notif.content}</div>
          ${notif.type === 'pickup' ? `
          <div class="notification-actions">
            <button class="notification-btn btn-approve" onclick="approvePickup(${notif.id})">
              <i class="fas fa-check"></i> Aprobar
            </button>
            <button class="notification-btn btn-reject" onclick="rejectPickup(${notif.id})">
              <i class="fas fa-times"></i> Rechazar
            </button>
          </div>
          ` : ''}
        </div>
      `).join('');

      return `
        <div class="notifications-container">
          <div class="screen-title">Notificaciones</div>
          ${notificationItems}
        </div>
      `;
    }

    function renderAnimatedTreeScreen() {
      const user = userData[currentRole];
      let children = [];
      
      if (currentRole === 'padre') {
        children = user.children;
      } else if (currentRole === 'alumno') {
        children = user.parents.map(parent => ({...parent, group: 'Padre/Madre'}));
      }

      const childNodes = children.map((child, index) => {
        let options = [];
        if (currentRole === 'padre') {
          options = [
            {action: 'alert', icon: 'fas fa-exclamation-triangle', label: 'Alerta'},
            {action: 'edit', icon: 'fas fa-edit', label: 'Editar'}
          ];
        } else if (currentRole === 'alumno') {
          options = [
            {action: 'message', icon: 'fas fa-comment', label: 'Mensaje'},
            {action: 'permission', icon: 'fas fa-door-open', label: 'Permiso'}
          ];
        }
        
        return `
          <div class="tree-node tree-leaf" onclick="showBubbleOptions({name: '${child.name}', emoji: '${child.emoji}', icon: '${child.icon}'}, ${JSON.stringify(options).replace(/"/g, '&quot;')})" style="animation-delay: ${index * 0.3}s;">
            ${child.emoji}
            <div style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: bold; color: #7EC8A3; white-space: nowrap;">${child.name}</div>
          </div>
        `;
      }).join('');

      return `
        <div class="animated-tree">
          <div class="tree-container">
            <div style="text-align: center; margin-bottom: 40px; color: #7EC8A3; font-weight: bold; font-size: 24px;">
              ${currentRole === 'padre' ? 'Mis Hijos' : 'Mis Padres'}
            </div>
            <div class="tree-students">
              ${childNodes}
            </div>
          </div>
        </div>
      `;
    }

    function renderStaffDirectoryScreen() {
      const staff = [
        { name: "Prof. García", emoji: "👨‍🏫", role: "Matemáticas", icon: "fas fa-chalkboard-teacher" },
        { name: "Profa. López", emoji: "👩‍🏫", role: "Español", icon: "fas fa-chalkboard-teacher" },
        { name: "Prof. Martínez", emoji: "👨‍🏫", role: "Ciencias", icon: "fas fa-flask" },
        { name: "Profa. Rodríguez", emoji: "👩‍🏫", role: "Historia", icon: "fas fa-book" },
        { name: "Director", emoji: "👔", role: "Dirección", icon: "fas fa-user-tie" },
        { name: "Secretaria", emoji: "👩‍💼", role: "Administración", icon: "fas fa-clipboard" }
      ];

      const staffItems = staff.map(person => `
        <div class="list-item" onclick="showBubbleOptions({name: '${person.name}', emoji: '${person.emoji}', icon: '${person.icon}'}, [{action: 'message', icon: 'fas fa-comment', label: 'Mensaje'}, {action: 'info', icon: 'fas fa-info', label: 'Info'}])">
          <div class="list-item-icon">
            ${person.emoji}
          </div>
          <div class="list-item-text">
            ${person.name}
            <br><small style="color: #999;">${person.role}</small>
          </div>
          <i class="fas fa-chevron-right" style="color: #FFB347;"></i>
        </div>
      `).join('');

      return `
        <div class="list-screen">
          <div class="list-title">Directorio de Personal</div>
          ${staffItems}
        </div>
      `;
    }

    function renderPickupScreen() {
      const user = userData[currentRole];
      const children = user.children || [];

      const pickupButtons = children.map(child => `
        <button class="pickup-button" onclick="sendPickupAlert('${child.name}')">
          <div class="pickup-photo">${child.emoji}</div>
          <div class="pickup-name">${child.name}</div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.8);">Grupo ${child.group}</div>
        </button>
      `).join('');

      return `
        <div class="pickup-container">
          <div class="screen-title">Solicitar Recogida</div>
          <div style="margin-bottom: 30px; color: #666; text-align: center;">
            Presiona el botón de tu hijo para notificar que has llegado
          </div>
          <div class="pickup-grid">
            ${pickupButtons}
          </div>
        </div>
      `;
    }

    function renderMessagesScreen() {
      const chats = [
        { name: 'Prof. García', emoji: '👨‍🏫', preview: 'Recordatorio sobre la tarea de matemáticas', time: '14:30' },
        { name: 'Dirección', emoji: '👔', preview: 'Información sobre la junta de padres', time: '13:45' },
        { name: 'María López', emoji: '👩', preview: 'Gracias por la información', time: '12:20' },
        { name: 'Grupo 3-A', emoji: '👥', preview: 'Nuevas actividades disponibles', time: '11:15' }
      ];

      const chatItems = chats.map(chat => `
        <div class="chat-item" onclick="openChat('${chat.name}')">
          <div class="chat-avatar">${chat.emoji}</div>
          <div class="chat-info">
            <div class="chat-name">${chat.name}</div>
            <div class="chat-preview">${chat.preview}</div>
          </div>
          <div class="chat-time">${chat.time}</div>
        </div>
      `).join('');

      return `
        <div class="chat-list">
          <div class="screen-title">Mensajes</div>
          ${chatItems}
        </div>
      `;
    }

    function renderConfigPanel() {
      const isAdmin = currentRole === 'admin';
      
      return `
        <div class="config-panel">
          <div class="screen-title">Panel de Configuración</div>
          
          ${isAdmin ? `
          <div class="config-section">
            <div class="config-title">Permisos de Roles</div>
            <div class="config-option">
              <span>Maestros pueden ver todos los grupos</span>
              <div class="config-toggle active" onclick="toggleConfig(this)"></div>
            </div>
            <div class="config-option">
              <span>Padres pueden solicitar recogida</span>
              <div class="config-toggle active" onclick="toggleConfig(this)"></div>
            </div>
            <div class="config-option">
              <span>Alumnos pueden ver directorio</span>
              <div class="config-toggle active" onclick="toggleConfig(this)"></div>
            </div>
            <div class="config-option">
              <span>Mensajería entre roles habilitada</span>
              <div class="config-toggle active" onclick="toggleConfig(this)"></div>
            </div>
          </div>

          <div class="config-section">
            <div class="config-title">Funcionalidades por Rol</div>
            <div class="config-option">
              <span>Botón "Hijos" para padres</span>
              <div class="config-toggle active" onclick="toggleConfig(this)"></div>
            </div>
            <div class="config-option">
              <span>Botón "Recogida" para padres</span>
              <div class="config-toggle active" onclick="toggleConfig(this)"></div>
            </div>
            <div class="config-option">
              <span>Botón "Panel" para maestros</span>
              <div class="config-toggle active" onclick="toggleConfig(this)"></div>
            </div>
            <div class="config-option">
              <span>Botón "Consultar" para alumnos</span>
              <div class="config-toggle active" onclick="toggleConfig(this)"></div>
            </div>
          </div>
          ` : ''}
          
          <div class="config-section">
            <div class="config-title">Notificaciones</div>
            <div class="config-option">
              <span>Alertas de recogida</span>
              <div class="config-toggle active" onclick="toggleConfig(this)"></div>
            </div>
            <div class="config-option">
              <span>Mensajes automáticos</span>
              <div class="config-toggle" onclick="toggleConfig(this)"></div>
            </div>
            <div class="config-option">
              <span>Recordatorios de tareas</span>
              <div class="config-toggle active" onclick="toggleConfig(this)"></div>
            </div>
          </div>

          <div class="config-section">
            <div class="config-title">Seguridad</div>
            <div class="config-option">
              <span>Verificación en dos pasos</span>
              <div class="config-toggle" onclick="toggleConfig(this)"></div>
            </div>
            <div class="config-option">
              <span>Logs de actividad</span>
              <div class="config-toggle active" onclick="toggleConfig(this)"></div>
            </div>
            ${isAdmin ? `
            <div class="config-option">
              <span>Acceso completo al cerebro</span>
              <div class="config-toggle active" onclick="toggleConfig(this)"></div>
            </div>
            ` : ''}
          </div>

          ${isAdmin ? `
          <div class="config-section">
            <div class="config-title">Sistema</div>
            <div class="config-option">
              <span>Modo mantenimiento</span>
              <div class="config-toggle" onclick="toggleConfig(this)"></div>
            </div>
            <div class="config-option">
              <span>Backup automático</span>
              <div class="config-toggle active" onclick="toggleConfig(this)"></div>
            </div>
            <div class="config-option">
              <span>Registro de nuevos usuarios</span>
              <div class="config-toggle active" onclick="toggleConfig(this)"></div>
            </div>
          </div>
          ` : ''}

          <button class="save-button" id="saveConfigBtn" disabled onclick="saveConfiguration()">
            <i class="fas fa-save"></i> Guardar Configuración
          </button>
        </div>
      `;
    }

    function renderConsultasScreen() {
      const tickets = [
        {
          id: 1,
          user: "María López",
          emoji: "👩",
          subject: "Problema con acceso al sistema",
          content: "No puedo acceder a mi cuenta desde ayer, me aparece error de contraseña. He intentado restablecer la contraseña pero no recibo el correo de recuperación.",
          time: "14:30",
          date: "Hoy",
          priority: "alta",
          status: "abierto",
          category: "Técnico"
        },
        {
          id: 2,
          user: "Prof. García",
          emoji: "👨‍🏫",
          subject: "Solicitud de nuevo grupo",
          content: "Necesito crear un grupo adicional para matemáticas avanzadas. Tengo 8 estudiantes que requieren un nivel más alto de enseñanza.",
          time: "13:15",
          date: "Hoy",
          priority: "media",
          status: "abierto",
          category: "Académico"
        },
        {
          id: 3,
          user: "Carlos Pérez",
          emoji: "👨",
          subject: "Error en notificaciones",
          content: "No recibo las notificaciones de recogida en mi teléfono. Mi esposa sí las recibe correctamente.",
          time: "12:45",
          date: "Hoy",
          priority: "baja",
          status: "respondido",
          category: "Notificaciones"
        },
        {
          id: 4,
          user: "Ana Martínez",
          emoji: "👩",
          subject: "Cambio de horario",
          content: "Solicito cambiar el horario de recogida de mi hijo debido a un nuevo trabajo.",
          time: "11:20",
          date: "Hoy",
          priority: "media",
          status: "abierto",
          category: "Administrativo"
        },
        {
          id: 5,
          user: "Profa. Rodríguez",
          emoji: "👩‍🏫",
          subject: "Problema con calificaciones",
          content: "El sistema no me permite guardar las calificaciones del examen de historia.",
          time: "10:15",
          date: "Ayer",
          priority: "alta",
          status: "en_proceso",
          category: "Técnico"
        }
      ];

      const archivedTickets = [
        {
          id: 101,
          user: "Luis Torres",
          emoji: "👨",
          subject: "Consulta sobre uniforme",
          content: "¿Cuáles son las especificaciones del uniforme escolar?",
          time: "16:30",
          date: "Hace 2 días",
          priority: "baja",
          status: "archivado",
          category: "General"
        },
        {
          id: 102,
          user: "Prof. Sánchez",
          emoji: "👨‍🏫",
          subject: "Solicitud de material",
          content: "Necesito material deportivo adicional para las clases de educación física.",
          time: "14:20",
          date: "Hace 3 días",
          priority: "media",
          status: "archivado",
          category: "Recursos"
        }
      ];

      const activeTickets = tickets.filter(t => t.status !== 'archivado');
      const openCount = activeTickets.filter(t => t.status === 'abierto').length;
      const inProcessCount = activeTickets.filter(t => t.status === 'en_proceso').length;
      const respondedCount = activeTickets.filter(t => t.status === 'respondido').length;

      const ticketItems = activeTickets.map(ticket => `
        <div class="ticket-item" data-priority="${ticket.priority}" data-id="${ticket.id}">
          <div class="ticket-header">
            <div class="ticket-user">
              <span class="ticket-emoji">${ticket.emoji}</span>
              <div>
                <span class="ticket-name">${ticket.user}</span>
                <div class="ticket-category">${ticket.category}</div>
              </div>
            </div>
            <div class="ticket-meta">
              <span class="ticket-date">${ticket.date}</span>
              <span class="ticket-time">${ticket.time}</span>
              <span class="ticket-priority priority-${ticket.priority}">${ticket.priority.toUpperCase()}</span>
              <span class="ticket-status status-${ticket.status}">${ticket.status.replace('_', ' ').toUpperCase()}</span>
            </div>
          </div>
          <div class="ticket-subject">${ticket.subject}</div>
          <div class="ticket-content">${ticket.content}</div>
          <div class="ticket-actions">
            <button class="ticket-btn btn-view" onclick="viewTicket(${ticket.id})">
              <i class="fas fa-eye"></i> Ver
            </button>
            <button class="ticket-btn btn-respond" onclick="respondTicket(${ticket.id})">
              <i class="fas fa-reply"></i> Responder
            </button>
            <button class="ticket-btn btn-archive" onclick="archiveTicket(${ticket.id})">
              <i class="fas fa-archive"></i> Archivar
            </button>
            <button class="ticket-btn btn-delete" onclick="deleteTicket(${ticket.id})">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
      `).join('');

      return `
        <div class="consultas-container">
          <div class="consultas-header">
            <div class="screen-title">
              <i class="fas fa-ticket-alt"></i> Gestión de Consultas
            </div>
            <div class="consultas-actions">
              <button class="action-btn" onclick="showArchivedTickets()">
                <i class="fas fa-archive"></i> Ver Archivados (${archivedTickets.length})
              </button>
              <button class="action-btn" onclick="exportTickets()">
                <i class="fas fa-download"></i> Exportar
              </button>
            </div>
          </div>
          
          <div class="tickets-stats">
            <div class="stat-item stat-open">
              <div class="stat-number">${openCount}</div>
              <div class="stat-label">Abiertos</div>
            </div>
            <div class="stat-item stat-process">
              <div class="stat-number">${inProcessCount}</div>
              <div class="stat-label">En Proceso</div>
            </div>
            <div class="stat-item stat-responded">
              <div class="stat-number">${respondedCount}</div>
              <div class="stat-label">Respondidos</div>
            </div>
            <div class="stat-item stat-archived">
              <div class="stat-number">${archivedTickets.length}</div>
              <div class="stat-label">Archivados</div>
            </div>
          </div>

          <div class="tickets-filters">
            <button class="filter-btn active" onclick="filterTickets('all')">Todos</button>
            <button class="filter-btn" onclick="filterTickets('alta')">Alta Prioridad</button>
            <button class="filter-btn" onclick="filterTickets('abierto')">Abiertos</button>
            <button class="filter-btn" onclick="filterTickets('en_proceso')">En Proceso</button>
          </div>

          <div class="tickets-list" id="ticketsList">
            ${ticketItems}
          </div>
        </div>
      `;
    }

    function renderGenericScreen(screenType) {
      // Renderizar pantallas específicas según el rol y tipo
      if (screenType === 'perfil') {
        return renderProfileScreen();
      }
      
      if (currentRole === 'maestro') {
        if (screenType === 'panel') return renderConfigPanel();
        if (screenType === 'notificaciones') return renderNotificationsScreen();
        if (screenType === 'mensajes') return renderMessagesScreen();
      }
      
      if (currentRole === 'padre') {
        if (screenType === 'hijos') return renderAnimatedTreeScreen();
        if (screenType === 'recogida') return renderPickupScreen();
        if (screenType === 'mensajes') return renderMessagesScreen();
      }
      
      if (currentRole === 'alumno') {
        if (screenType === 'padres') return renderAnimatedTreeScreen();
        if (screenType === 'consultar') return renderStaffDirectoryScreen();
        if (screenType === 'mensajes') return renderMessagesScreen();
      }

      if (currentRole === 'admin') {
        if (screenType === 'consultas') return renderConsultasScreen();
        if (screenType === 'panel') return renderConfigPanel();
      }

      // Pantalla genérica por defecto
      const screens = {
        panel: {
          icon: "fa-cog",
          title: "Panel de Configuración",
          description: "Ajustes y configuraciones del sistema"
        },
        notificaciones: {
          icon: "fa-bell",
          title: "Notificaciones",
          description: "Alertas y notificaciones importantes"
        },
        hijos: {
          icon: "fa-users",
          title: "Mis Hijos",
          description: "Información y gestión de hijos"
        },
        recogida: {
          icon: "fa-car",
          title: "Solicitar Recogida",
          description: "Notificar llegada para recoger"
        },
        padres: {
          icon: "fa-home",
          title: "Mis Padres",
          description: "Contacto con padres de familia"
        },
        consultar: {
          icon: "fa-address-book",
          title: "Directorio Staff",
          description: "Lista de profesores y personal"
        },
        mensajes: {
          icon: "fa-comments",
          title: "Mensajes",
          description: "Bandeja de mensajes y notificaciones"
        }
      };

      const screen = screens[screenType];
      return `
        <div class="generic-screen">
          <div class="screen-icon">
            <i class="fas ${screen.icon}"></i>
          </div>
          <div class="screen-title">${screen.title}</div>
          <div class="screen-description">${screen.description}</div>
        </div>
      `;
    }

    function renderAdminScreen(screenType) {
      // Renderizar las interfaces específicas para admin
      if (screenType === 'perfil') {
        return renderProfileScreen();
      }
      
      if (screenType === 'panel') {
        return renderConfigPanel();
      }
      
      if (screenType === 'cerebro') {
        return renderBrainPanel();
      }
      
      if (screenType === 'consultas') {
        return renderConsultasScreen();
      }

      // Pantalla genérica por defecto (no debería llegar aquí)
      const screens = {
        perfil: {
          icon: "fa-school",
          title: "Perfil de la Escuela",
          description: "Datos públicos y configuración institucional"
        },
        panel: {
          icon: "fa-cog",
          title: "Panel de Configuración",
          description: "Ajustes generales del sistema"
        },
        cerebro: {
          icon: "fa-brain",
          title: "Cerebro del Sistema",
          description: "Monitoreo de logs y actividad"
        },
        consultas: {
          icon: "fa-ticket-alt",
          title: "Consultas y Tickets",
          description: "Solicitudes de usuarios"
        }
      };

      const screen = screens[screenType];
      return `
        <div class="generic-screen">
          <div class="screen-icon">
            <i class="fas ${screen.icon}"></i>
          </div>
          <div class="screen-title">${screen.title}</div>
          <div class="screen-description">${screen.description}</div>
        </div>
      `;
    }

    function updateNavigation() {
      const navContainer = document.querySelector('.nav-container');
      
      if (currentRole === 'admin') {
        navContainer.innerHTML = `
          <button class="nav-button" data-screen="perfil">
            <i class="fas fa-user"></i>
            <span>Perfil</span>
          </button>
          <button class="nav-button" data-screen="panel">
            <i class="fas fa-cog"></i>
            <span>Panel</span>
          </button>
          
          <button class="nav-center-button" id="centerButton">
            <i class="fas fa-id-card"></i>
          </button>
          
          <button class="nav-button" data-screen="cerebro">
            <i class="fas fa-brain"></i>
            <span>Cerebro</span>
          </button>
          <button class="nav-button" data-screen="consultas">
            <i class="fas fa-ticket-alt"></i>
            <span>Consultas</span>
          </button>
        `;
      } else if (currentRole === 'maestro') {
        navContainer.innerHTML = `
          <button class="nav-button" data-screen="perfil">
            <i class="fas fa-user"></i>
            <span>Perfil</span>
          </button>
          <button class="nav-button" data-screen="panel">
            <i class="fas fa-cog"></i>
            <span>Panel</span>
          </button>
          
          <button class="nav-center-button" id="centerButton">
            <i class="fas fa-id-card"></i>
          </button>
          
          <button class="nav-button" data-screen="notificaciones">
            <i class="fas fa-bell"></i>
            <span>Notificaciones</span>
          </button>
          <button class="nav-button" data-screen="mensajes">
            <i class="fas fa-comments"></i>
            <span>Mensajes</span>
          </button>
        `;
      } else if (currentRole === 'padre') {
        navContainer.innerHTML = `
          <button class="nav-button" data-screen="perfil">
            <i class="fas fa-user"></i>
            <span>Perfil</span>
          </button>
          <button class="nav-button" data-screen="hijos">
            <i class="fas fa-users"></i>
            <span>Hijos</span>
          </button>
          
          <button class="nav-center-button" id="centerButton">
            <i class="fas fa-id-card"></i>
          </button>
          
          <button class="nav-button" data-screen="recogida">
            <i class="fas fa-car"></i>
            <span>Recogida</span>
          </button>
          <button class="nav-button" data-screen="mensajes">
            <i class="fas fa-comments"></i>
            <span>Mensajes</span>
          </button>
        `;
      } else if (currentRole === 'alumno') {
        navContainer.innerHTML = `
          <button class="nav-button" data-screen="perfil">
            <i class="fas fa-user"></i>
            <span>Perfil</span>
          </button>
          <button class="nav-button" data-screen="padres">
            <i class="fas fa-home"></i>
            <span>Padres</span>
          </button>
          
          <button class="nav-center-button" id="centerButton">
            <i class="fas fa-id-card"></i>
          </button>
          
          <button class="nav-button" data-screen="consultar">
            <i class="fas fa-address-book"></i>
            <span>Consultar</span>
          </button>
          <button class="nav-button" data-screen="mensajes">
            <i class="fas fa-comments"></i>
            <span>Mensajes</span>
          </button>
        `;
      }

      attachNavListeners();
    }

    function renderScreens() {
      const user = userData[currentRole];
      const mainContent = document.getElementById('mainContent');
      
      let screens = '';
      
      if (currentRole === 'alumno') {
        screens = `
          <div class="screen-container" id="screenContainer">
            <div class="screen">${renderBadge(user)}</div>
            <div class="screen">${renderGroupTree(user.groups[0])}</div>
          </div>
        `;
      } else if (currentRole === 'padre') {
        screens = `
          <div class="screen-container" id="screenContainer">
            <div class="screen">${renderBadge(user)}</div>
          </div>
        `;
      } else if (currentRole === 'maestro') {
        screens = `
          <div class="screen-container" id="screenContainer">
            <div class="screen">${renderTeachersTree()}</div>
            <div class="screen">${renderBadge(user)}</div>
            <div class="screen">${renderGroupList(user.groups)}</div>
          </div>
        `;
      } else if (currentRole === 'admin') {
        screens = `
          <div class="screen-container" id="screenContainer">
            <div class="screen">${renderTeachersTree()}</div>
            <div class="screen">${renderBadge(user)}</div>
            <div class="screen">${renderGroupList(['3-A', '3-B', '4-A', '5-A'])}</div>
          </div>
        `;
      }

      mainContent.innerHTML = screens;
      attachSwipeListeners();
      
      if (currentRole === 'admin' && currentScreen === 'cerebro') {
        attachBrainPanelListeners();
      }
    }

    function addBackButton() {
      const mainContent = document.getElementById('mainContent');
      const backButton = document.createElement('button');
      backButton.className = 'back-button';
      backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
      backButton.onclick = () => {
        renderScreens();
        document.querySelectorAll('.nav-button').forEach(btn => {
          btn.classList.remove('active');
        });
      };
      
      // Remove existing back button if any
      const existingBack = mainContent.querySelector('.back-button');
      if (existingBack) {
        existingBack.remove();
      }
      
      mainContent.appendChild(backButton);
    }

    function attachSwipeListeners() {
      const container = document.getElementById('screenContainer');
      if (!container) return;

      let currentIndex = 0;
      let isDragging = false;
      let startX = 0;
      let currentTranslate = 0;
      let prevTranslate = 0;
      let animationID = 0;
      const screenWidth = window.innerWidth;
      const totalScreens = container.children.length;

      // Touch events
      container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        startX = touchStartX;
        isDragging = true;
        animationID = requestAnimationFrame(animation);
        container.style.transition = 'none';
      });

      container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const currentX = e.changedTouches[0].screenX;
        const diff = currentX - startX;
        currentTranslate = prevTranslate + diff;
      });

      container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        isDragging = false;
        cancelAnimationFrame(animationID);
        container.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        handleSwipe();
      });

      // Mouse events for desktop
      container.addEventListener('mousedown', (e) => {
        touchStartX = e.clientX;
        startX = touchStartX;
        isDragging = true;
        animationID = requestAnimationFrame(animation);
        container.style.cursor = 'grabbing';
        container.style.transition = 'none';
        e.preventDefault();
      });

      container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const currentX = e.clientX;
        const diff = currentX - startX;
        currentTranslate = prevTranslate + diff;
      });

      container.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        touchEndX = e.clientX;
        isDragging = false;
        cancelAnimationFrame(animationID);
        container.style.cursor = 'grab';
        container.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        handleSwipe();
      });

      container.addEventListener('mouseleave', (e) => {
        if (!isDragging) return;
        touchEndX = e.clientX;
        isDragging = false;
        cancelAnimationFrame(animationID);
        container.style.cursor = 'grab';
        container.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        handleSwipe();
      });

      // Set initial cursor
      container.style.cursor = 'grab';

      function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
      }

      function setSliderPosition() {
        container.style.transform = `translateX(${currentTranslate}px)`;
      }

      function handleSwipe() {
        const movedBy = currentTranslate - prevTranslate;
        
        // Si se movió más del 25% del ancho de pantalla, cambiar de pantalla
        if (movedBy < -screenWidth / 4 && currentIndex < totalScreens - 1) {
          currentIndex++;
        } else if (movedBy > screenWidth / 4 && currentIndex > 0) {
          currentIndex--;
        }

        // Siempre ajustar a la pantalla más cercana
        setPositionByIndex();
      }

      function setPositionByIndex() {
        currentTranslate = currentIndex * -screenWidth;
        prevTranslate = currentTranslate;
        setSliderPosition();
      }

      // Centrar en la pantalla del gafete (pantalla del medio para admin/maestro)
      if (currentRole === 'admin' || currentRole === 'maestro') {
        currentIndex = 1; // Centrar en la segunda pantalla (gafete)
        setPositionByIndex();
      }
    }

    function attachBrainPanelListeners() {
      const brainPanel = document.getElementById('brainPanel');
      const brainContainer = document.getElementById('brainContainer');
      if (!brainPanel || !brainContainer) return;

      let isDragging = false;
      let startX, startY;

      brainPanel.addEventListener('mousedown', startDrag);
      brainPanel.addEventListener('touchstart', startDrag);
      
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag);
      
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchend', stopDrag);

      function startDrag(e) {
        isDragging = true;
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        startX = clientX - brainPanelX;
        startY = clientY - brainPanelY;
      }

      function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        brainPanelX = clientX - startX;
        brainPanelY = clientY - startY;
        brainContainer.style.transform = `translate(${brainPanelX}px, ${brainPanelY}px)`;
      }

      function stopDrag() {
        isDragging = false;
      }
    }

    function showScreen(screenType) {
      currentScreen = screenType;
      const mainContent = document.getElementById('mainContent');
      
      if (currentRole === 'admin') {
        mainContent.innerHTML = `
          <div class="screen-container">
            <div class="screen">${renderAdminScreen(screenType)}</div>
          </div>
        `;
        
        if (screenType === 'cerebro') {
          attachBrainPanelListeners();
        }
      } else {
        mainContent.innerHTML = `
          <div class="screen-container">
            <div class="screen">${renderGenericScreen(screenType)}</div>
          </div>
        `;
      }

      addBackButton();

      document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelector(`[data-screen="${screenType}"]`)?.classList.add('active');
    }

    function showGroupTree(groupName) {
      const mainContent = document.getElementById('mainContent');
      mainContent.innerHTML = `
        <div class="screen-container">
          <div class="screen">
            ${renderGroupTree(groupName)}
          </div>
        </div>
      `;
    }

    let isDarkTheme = false;
    let configChanged = false;

    function toggleTheme() {
      isDarkTheme = !isDarkTheme;
      document.body.classList.toggle('dark-theme', isDarkTheme);
      
      const themeBtn = document.getElementById('themeBtn');
      const icon = themeBtn.querySelector('i');
      icon.className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
    }

    function showRegisterButton() {
      const registerBtn = document.getElementById('registerBtn');
      if (currentRole === 'admin' || currentRole === 'director') {
        registerBtn.style.display = 'flex';
      } else {
        registerBtn.style.display = 'none';
      }
    }

    function changeProfilePhoto() {
      // Simular cambio de foto
      const photos = ['👦', '👧', '👨', '👩', '👨‍🏫', '👩‍🏫', '👔', '⚙️'];
      const currentUser = userData[currentRole];
      const currentIndex = photos.indexOf(currentUser.emoji);
      const nextIndex = (currentIndex + 1) % photos.length;
      currentUser.emoji = photos[nextIndex];
      
      // Actualizar la foto en la pantalla
      const photoElement = document.querySelector('.profile-photo-large');
      if (photoElement) {
        photoElement.textContent = currentUser.emoji;
      }
    }

    function approvePickup(notificationId) {
      showToast('Recogida aprobada ✅', 'success');
      // Remover la notificación
      const notifElement = document.querySelector(`[onclick="approvePickup(${notificationId})"]`).closest('.notification-item');
      notifElement.style.opacity = '0.5';
      notifElement.style.pointerEvents = 'none';
    }

    function rejectPickup(notificationId) {
      showToast('Recogida rechazada ❌', 'error');
      // Remover la notificación
      const notifElement = document.querySelector(`[onclick="rejectPickup(${notificationId})"]`).closest('.notification-item');
      notifElement.style.opacity = '0.5';
      notifElement.style.pointerEvents = 'none';
    }

    function showChildOptions(childName) {
      showToast(`Opciones para ${childName}`, 'info');
    }

    function sendPickupAlert(childName) {
      showToast(`✅ Alerta enviada: Has llegado por ${childName}`, 'success');
    }

    function openChat(contactName) {
      showChatInterface(contactName);
    }

    function toggleConfig(element) {
      element.classList.toggle('active');
      configChanged = true;
      
      const saveBtn = document.getElementById('saveConfigBtn');
      if (saveBtn) {
        saveBtn.disabled = false;
      }
    }

    function saveConfiguration() {
      showToast('Configuración guardada correctamente ✅', 'success');
      configChanged = false;
      
      const saveBtn = document.getElementById('saveConfigBtn');
      if (saveBtn) {
        saveBtn.disabled = true;
      }
    }

    function showToast(message, type = 'info') {
      // Crear toast notification
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#A8E6CF' : type === 'error' ? '#FF6B6B' : '#FFB347'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: bold;
        max-width: 300px;
        word-wrap: break-word;
        animation: slideIn 0.3s ease;
      `;
      
      toast.textContent = message;
      document.body.appendChild(toast);
      
      // Remover después de 3 segundos
      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }, 3000);
    }

    function toggleCheck(element) {
      element.classList.toggle('checked');
      const icon = element.querySelector('i');
      icon.style.display = element.classList.contains('checked') ? 'block' : 'none';
    }

    function attachNavListeners() {
      document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', () => {
          const screen = button.getAttribute('data-screen');
          showScreen(screen);
        });
      });

      const centerButton = document.getElementById('centerButton');
      
      // Evento de mantener presionado
      let pressTimer;
      let isLongPress = false;
      
      // Mouse events
      centerButton.addEventListener('mousedown', () => {
        isLongPress = false;
        pressTimer = setTimeout(() => {
          isLongPress = true;
          startQRAnimation();
        }, 500); // 500ms para activar QR
      });

      centerButton.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
        if (!isLongPress) {
          // Clic corto - volver al gafete
          renderScreens();
          document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
          });
        }
      });

      centerButton.addEventListener('mouseleave', () => {
        clearTimeout(pressTimer);
      });

      // Touch events para dispositivos táctiles
      centerButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isLongPress = false;
        pressTimer = setTimeout(() => {
          isLongPress = true;
          startQRAnimation();
        }, 500);
      });

      centerButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        clearTimeout(pressTimer);
        if (!isLongPress) {
          // Toque corto - volver al gafete
          renderScreens();
          document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
          });
        }
      });

      centerButton.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        clearTimeout(pressTimer);
      });
    }

    function startQRAnimation() {
      const centerButton = document.getElementById('centerButton');
      centerButton.classList.add('loading');
      
      setTimeout(() => {
        centerButton.classList.remove('loading');
        showQRReader();
      }, 3000);
    }

    function showQRReader() {
      const mainContent = document.getElementById('mainContent');
      
      mainContent.innerHTML = `
        <div class="qr-reader-screen">
          <button class="back-button" onclick="renderScreens()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="qr-reader-container">
            <div class="screen-title">Lector de Códigos QR</div>
            <div class="qr-camera">
              <div class="qr-overlay">
                <div class="qr-corner top-left"></div>
                <div class="qr-corner top-right"></div>
                <div class="qr-corner bottom-left"></div>
                <div class="qr-corner bottom-right"></div>
                <div class="qr-scan-line"></div>
              </div>
              <div class="qr-instructions">
                Coloca el código QR dentro del marco
              </div>
            </div>
            <div class="qr-actions">
              <button class="qr-btn" onclick="simulateQRScan()">
                <i class="fas fa-qrcode"></i> Simular Escaneo
              </button>
              <button class="qr-btn" onclick="toggleFlash()">
                <i class="fas fa-flashlight"></i> Flash
              </button>
            </div>
          </div>
        </div>
      `;

      // Agregar estilos para el lector QR
      const qrStyles = document.createElement('style');
      qrStyles.textContent = `
        .qr-reader-screen {
          height: 100%;
          background: #000;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .qr-reader-container {
          text-align: center;
          width: 100%;
          max-width: 400px;
        }

        .qr-camera {
          width: 300px;
          height: 300px;
          background: #333;
          border-radius: 20px;
          margin: 20px auto;
          position: relative;
          overflow: hidden;
        }

        .qr-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
        }

        .qr-corner {
          position: absolute;
          width: 30px;
          height: 30px;
          border: 3px solid #FFB347;
        }

        .qr-corner.top-left {
          top: 0;
          left: 0;
          border-right: none;
          border-bottom: none;
        }

        .qr-corner.top-right {
          top: 0;
          right: 0;
          border-left: none;
          border-bottom: none;
        }

        .qr-corner.bottom-left {
          bottom: 0;
          left: 0;
          border-right: none;
          border-top: none;
        }

        .qr-corner.bottom-right {
          bottom: 0;
          right: 0;
          border-left: none;
          border-top: none;
        }

        .qr-scan-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #FFB347, transparent);
          animation: qrScan 2s linear infinite;
        }

        @keyframes qrScan {
          0% { top: 0; }
          100% { top: 100%; }
        }

        .qr-instructions {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: #FFB347;
          font-size: 14px;
          font-weight: bold;
        }

        .qr-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 20px;
        }

        .qr-btn {
          background: #FFB347;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .qr-btn:hover {
          background: #FF9E2C;
          transform: translateY(-2px);
        }
      `;
      document.head.appendChild(qrStyles);
    }

    function simulateQRScan() {
      // Simular escaneo de diferentes tipos de usuarios
      const qrTypes = ['alumno', 'padre', 'maestro', 'admin'];
      const randomType = qrTypes[Math.floor(Math.random() * qrTypes.length)];
      
      showToast('Código QR escaneado correctamente ✅', 'success');
      setTimeout(() => {
        showQRInfo(randomType);
      }, 1000);
    }

    function showQRInfo(scannedRole) {
      const modal = document.getElementById('friendsModal');
      const modalContent = modal.querySelector('.modal-content');
      
      // Datos del usuario escaneado
      const scannedUser = userData[scannedRole];
      
      // Construir información de relacionados
      let relatedSection = '';
      
      if (scannedRole === 'alumno') {
        // Mostrar padres del alumno
        const parents = scannedUser.parents || [];
        if (parents.length > 0) {
          relatedSection = `
            <div class="qr-info-section">
              <div class="qr-section-title">
                <i class="fas fa-users"></i> Padres/Tutores
              </div>
              <div class="qr-related-list">
                ${parents.map(parent => `
                  <div class="qr-related-item">
                    <div class="qr-related-emoji">${parent.emoji}</div>
                    <div class="qr-related-info">
                      <div class="qr-related-name">${parent.name}</div>
                      <div class="qr-related-role">Padre/Madre</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
      } else if (scannedRole === 'padre') {
        // Mostrar hijos del padre
        const children = scannedUser.children || [];
        if (children.length > 0) {
          relatedSection = `
            <div class="qr-info-section">
              <div class="qr-section-title">
                <i class="fas fa-child"></i> Hijos
              </div>
              <div class="qr-related-list">
                ${children.map(child => `
                  <div class="qr-related-item">
                    <div class="qr-related-emoji">${child.emoji}</div>
                    <div class="qr-related-info">
                      <div class="qr-related-name">${child.name}</div>
                      <div class="qr-related-role">Alumno - Grupo ${child.group}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
      } else if (scannedRole === 'maestro') {
        // Mostrar grupos del maestro
        const groups = scannedUser.groups || [];
        if (groups.length > 0) {
          relatedSection = `
            <div class="qr-info-section">
              <div class="qr-section-title">
                <i class="fas fa-users-class"></i> Grupos Asignados
              </div>
              <div class="qr-related-list">
                ${groups.map(group => `
                  <div class="qr-related-item">
                    <div class="qr-related-emoji">👥</div>
                    <div class="qr-related-info">
                      <div class="qr-related-name">Grupo ${group}</div>
                      <div class="qr-related-role">${groupStudents[group]?.length || 0} estudiantes</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
      }
      
      // Construir botones de acción según el rol del usuario actual y el escaneado
      let actionButtons = '';
      
      if (scannedRole === 'alumno') {
        // Acciones disponibles para QR de alumno
        if (currentRole === 'admin') {
          actionButtons += `
            <button class="qr-action-btn alert-illness" onclick="sendIllnessAlert('${scannedUser.name}')">
              <i class="fas fa-heartbeat"></i> Alerta de Enfermedad (a Padres)
            </button>
          `;
        }
        if (currentRole === 'maestro') {
          actionButtons += `
            <button class="qr-action-btn alert-exit" onclick="sendExitAlert('${scannedUser.name}')">
              <i class="fas fa-door-open"></i> Alerta de Salida (a Padres)
            </button>
          `;
        }
        actionButtons += `
          <button class="qr-action-btn message" onclick="sendMessageToUser('${scannedUser.name}')">
            <i class="fas fa-comment"></i> Enviar Mensaje
          </button>
        `;
      } else if (scannedRole === 'padre') {
        // Acciones disponibles para QR de padre
        actionButtons += `
          <button class="qr-action-btn message" onclick="sendMessageToUser('${scannedUser.name}')">
            <i class="fas fa-comment"></i> Enviar Mensaje
          </button>
        `;
        if (currentRole === 'maestro') {
          actionButtons += `
            <button class="qr-action-btn register-pickup" onclick="showPickupSelector('${scannedUser.name}', ${JSON.stringify(scannedUser.children || []).replace(/"/g, '&quot;')})">
              <i class="fas fa-car"></i> Registrar Recogida de Alumno
            </button>
          `;
        }
      } else if (scannedRole === 'maestro') {
        // Acciones disponibles para QR de maestro
        actionButtons += `
          <button class="qr-action-btn message" onclick="sendMessageToUser('${scannedUser.name}')">
            <i class="fas fa-comment"></i> Enviar Mensaje
          </button>
        `;
      } else if (scannedRole === 'admin') {
        // Acciones disponibles para QR de director/admin
        actionButtons += `
          <button class="qr-action-btn message" onclick="sendMessageToUser('${scannedUser.name}')">
            <i class="fas fa-comment"></i> Enviar Mensaje
          </button>
          <button class="qr-action-btn create-ticket" onclick="createTicketFor('${scannedUser.name}')">
            <i class="fas fa-ticket-alt"></i> Crear Ticket/Consulta
          </button>
        `;
      }
      
      modalContent.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">
            <i class="fas fa-qrcode"></i> Información del QR
          </div>
          <button class="modal-close" onclick="closeModal('friendsModal')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="info-content">
          <div class="info-photo">${scannedUser.emoji}</div>
          <div class="info-name">${scannedUser.name}</div>
          <div class="info-details">
            <div class="info-item">
              <span class="info-label">Rol:</span>
              <span class="info-value">${scannedUser.role}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Asignación:</span>
              <span class="info-value">${scannedUser.assignment}</span>
            </div>
          </div>
          
          ${relatedSection}
          
          ${actionButtons ? `
            <div class="qr-actions-container">
              <div class="qr-section-title">
                <i class="fas fa-bolt"></i> Acciones Disponibles
              </div>
              <div class="qr-action-buttons">
                ${actionButtons}
              </div>
            </div>
          ` : ''}
        </div>
      `;
      
      modal.classList.add('show');
    }

    function sendIllnessAlert(studentName) {
      showToast(`🏥 Alerta de enfermedad enviada a los padres de ${studentName}`, 'success');
      closeModal('friendsModal');
    }

    function sendExitAlert(studentName) {
      showToast(`🚪 Alerta de salida enviada a los padres de ${studentName}`, 'success');
      closeModal('friendsModal');
    }

    function sendMessageToUser(userName) {
      closeModal('friendsModal');
      showChatInterface(userName);
    }

    function createTicketFor(userName) {
      closeModal('friendsModal');
      showToast(`📝 Creando ticket para ${userName}...`, 'info');
      setTimeout(() => {
        showScreen('consultas');
      }, 1000);
    }

    function showPickupSelector(parentName, children) {
      const modal = document.getElementById('friendsModal');
      const modalContent = modal.querySelector('.modal-content');
      
      const childrenCheckboxes = children.map((child, index) => `
        <div class="child-checkbox-item" onclick="toggleChildCheckbox(${index})">
          <input type="checkbox" id="child-${index}" onclick="event.stopPropagation()">
          <label class="child-checkbox-label" for="child-${index}">
            <span style="font-size: 24px;">${child.emoji}</span>
            <div>
              <div style="font-weight: bold;">${child.name}</div>
              <div style="font-size: 12px; color: #666;">Grupo ${child.group}</div>
            </div>
          </label>
        </div>
      `).join('');
      
      modalContent.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">
            <i class="fas fa-car"></i> Registrar Recogida
          </div>
          <button class="modal-close" onclick="closeModal('friendsModal')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="info-content">
          <div class="info-photo">👨</div>
          <div class="info-name">${parentName}</div>
          
          <div class="children-selector">
            <div class="children-selector-title">
              Selecciona los alumnos que va a recoger:
            </div>
            ${childrenCheckboxes}
          </div>
          
          <button class="save-button" onclick="confirmPickup('${parentName}')">
            <i class="fas fa-check"></i> Confirmar Recogida
          </button>
        </div>
      `;
    }

    function toggleChildCheckbox(index) {
      const checkbox = document.getElementById(`child-${index}`);
      checkbox.checked = !checkbox.checked;
    }

    function confirmPickup(parentName) {
      const checkboxes = document.querySelectorAll('.child-checkbox-item input[type="checkbox"]:checked');
      const selectedChildren = Array.from(checkboxes).map(cb => {
        const label = cb.closest('.child-checkbox-item').querySelector('.child-checkbox-label div div');
        return label.textContent;
      });
      
      if (selectedChildren.length === 0) {
        showToast('⚠️ Selecciona al menos un alumno', 'error');
        return;
      }
      
      showToast(`✅ Recogida registrada: ${parentName} recoge a ${selectedChildren.join(', ')}`, 'success');
      closeModal('friendsModal');
    }

    function toggleFlash() {
      showToast('Flash activado/desactivado', 'info');
    }

    // Funciones para tickets
    function viewTicket(ticketId) {
      const tickets = [
        {
          id: 1,
          user: "María López",
          emoji: "👩",
          subject: "Problema con acceso al sistema",
          content: "No puedo acceder a mi cuenta desde ayer, me aparece error de contraseña. He intentado restablecer la contraseña pero no recibo el correo de recuperación.",
          time: "14:30",
          date: "Hoy",
          priority: "alta",
          status: "abierto",
          category: "Técnico"
        },
        {
          id: 2,
          user: "Prof. García",
          emoji: "👨‍🏫",
          subject: "Solicitud de nuevo grupo",
          content: "Necesito crear un grupo adicional para matemáticas avanzadas. Tengo 8 estudiantes que requieren un nivel más alto de enseñanza.",
          time: "13:15",
          date: "Hoy",
          priority: "media",
          status: "abierto",
          category: "Académico"
        }
      ];

      const ticket = tickets.find(t => t.id === ticketId) || tickets[0];
      
      const modal = document.getElementById('friendsModal');
      const modalContent = modal.querySelector('.modal-content');
      
      modalContent.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">Ticket #${ticket.id}</div>
          <button class="modal-close" onclick="closeModal('friendsModal')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="ticket-modal-content">
          <div class="ticket-header" style="margin-bottom: 20px;">
            <div class="ticket-user">
              <span class="ticket-emoji">${ticket.emoji}</span>
              <div>
                <span class="ticket-name">${ticket.user}</span>
                <div class="ticket-category">${ticket.category}</div>
              </div>
            </div>
            <div class="ticket-meta">
              <span class="ticket-date">${ticket.date}</span>
              <span class="ticket-time">${ticket.time}</span>
              <span class="ticket-priority priority-${ticket.priority}">${ticket.priority.toUpperCase()}</span>
              <span class="ticket-status status-${ticket.status}">${ticket.status.replace('_', ' ').toUpperCase()}</span>
            </div>
          </div>
          
          <div class="ticket-subject" style="margin-bottom: 15px;">${ticket.subject}</div>
          <div class="ticket-content" style="margin-bottom: 25px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
            ${ticket.content}
          </div>

          <div class="ticket-response-form">
            <h4 style="color: #FF6B35; margin-bottom: 15px;">
              <i class="fas fa-reply"></i> Responder al Ticket
            </h4>
            <textarea class="response-textarea" placeholder="Escribe tu respuesta aquí..." id="responseText"></textarea>
            <div class="response-actions">
              <button class="response-btn btn-cancel-response" onclick="closeModal('friendsModal')">
                Cancelar
              </button>
              <button class="response-btn btn-send-response" onclick="sendTicketResponse(${ticket.id})">
                <i class="fas fa-paper-plane"></i> Enviar Respuesta
              </button>
            </div>
          </div>
        </div>
      `;
      
      modal.classList.add('show');
    }

    function respondTicket(ticketId) {
      viewTicket(ticketId);
    }

    function sendTicketResponse(ticketId) {
      const responseText = document.getElementById('responseText').value;
      if (responseText.trim()) {
        showToast(`Respuesta enviada al ticket #${ticketId} ✅`, 'success');
        closeModal('friendsModal');
        
        // Actualizar el estado del ticket
        const ticketElement = document.querySelector(`[data-id="${ticketId}"]`);
        if (ticketElement) {
          const statusElement = ticketElement.querySelector('.ticket-status');
          statusElement.textContent = 'RESPONDIDO';
          statusElement.className = 'ticket-status status-respondido';
        }
      } else {
        showToast('Por favor escribe una respuesta', 'error');
      }
    }

    function archiveTicket(ticketId) {
      showToast(`Ticket #${ticketId} archivado ✅`, 'success');
      const ticketElement = document.querySelector(`[data-id="${ticketId}"]`);
      if (ticketElement) {
        ticketElement.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          ticketElement.remove();
        }, 300);
      }
    }

    function deleteTicket(ticketId) {
      // Mostrar confirmación inline
      const ticketElement = document.querySelector(`[data-id="${ticketId}"]`);
      const actionsContainer = ticketElement.querySelector('.ticket-actions');
      
      actionsContainer.innerHTML = `
        <div style="background: #ffebee; padding: 10px; border-radius: 10px; width: 100%;">
          <div style="color: #d32f2f; font-weight: bold; margin-bottom: 10px;">
            <i class="fas fa-exclamation-triangle"></i> ¿Confirmar eliminación?
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="ticket-btn" style="background: #FF6B6B; color: white;" onclick="confirmDeleteTicket(${ticketId})">
              <i class="fas fa-trash"></i> Sí, Eliminar
            </button>
            <button class="ticket-btn" style="background: #ddd; color: #666;" onclick="cancelDeleteTicket(${ticketId})">
              <i class="fas fa-times"></i> Cancelar
            </button>
          </div>
        </div>
      `;
    }

    function confirmDeleteTicket(ticketId) {
      showToast(`Ticket #${ticketId} eliminado permanentemente`, 'error');
      const ticketElement = document.querySelector(`[data-id="${ticketId}"]`);
      ticketElement.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        ticketElement.remove();
      }, 300);
    }

    function cancelDeleteTicket(ticketId) {
      const ticketElement = document.querySelector(`[data-id="${ticketId}"]`);
      const actionsContainer = ticketElement.querySelector('.ticket-actions');
      
      actionsContainer.innerHTML = `
        <button class="ticket-btn btn-view" onclick="viewTicket(${ticketId})">
          <i class="fas fa-eye"></i> Ver
        </button>
        <button class="ticket-btn btn-respond" onclick="respondTicket(${ticketId})">
          <i class="fas fa-reply"></i> Responder
        </button>
        <button class="ticket-btn btn-archive" onclick="archiveTicket(${ticketId})">
          <i class="fas fa-archive"></i> Archivar
        </button>
        <button class="ticket-btn btn-delete" onclick="deleteTicket(${ticketId})">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      `;
    }

    function showArchivedTickets() {
      const mainContent = document.getElementById('mainContent');
      
      const archivedTickets = [
        {
          id: 101,
          user: "Luis Torres",
          emoji: "👨",
          subject: "Consulta sobre uniforme",
          content: "¿Cuáles son las especificaciones del uniforme escolar?",
          time: "16:30",
          date: "Hace 2 días",
          priority: "baja",
          status: "archivado",
          category: "General"
        },
        {
          id: 102,
          user: "Prof. Sánchez",
          emoji: "👨‍🏫",
          subject: "Solicitud de material",
          content: "Necesito material deportivo adicional para las clases de educación física.",
          time: "14:20",
          date: "Hace 3 días",
          priority: "media",
          status: "archivado",
          category: "Recursos"
        }
      ];

      const archivedItems = archivedTickets.map(ticket => `
        <div class="ticket-item" data-priority="${ticket.priority}" style="opacity: 0.8;">
          <div class="ticket-header">
            <div class="ticket-user">
              <span class="ticket-emoji">${ticket.emoji}</span>
              <div>
                <span class="ticket-name">${ticket.user}</span>
                <div class="ticket-category">${ticket.category}</div>
              </div>
            </div>
            <div class="ticket-meta">
              <span class="ticket-date">${ticket.date}</span>
              <span class="ticket-time">${ticket.time}</span>
              <span class="ticket-priority priority-${ticket.priority}">${ticket.priority.toUpperCase()}</span>
              <span class="ticket-status" style="background: #999; color: white;">ARCHIVADO</span>
            </div>
          </div>
          <div class="ticket-subject">${ticket.subject}</div>
          <div class="ticket-content">${ticket.content}</div>
          <div class="ticket-actions">
            <button class="ticket-btn btn-view" onclick="viewTicket(${ticket.id})">
              <i class="fas fa-eye"></i> Ver
            </button>
            <button class="ticket-btn" style="background: #A8E6CF; color: white;" onclick="restoreTicket(${ticket.id})">
              <i class="fas fa-undo"></i> Restaurar
            </button>
          </div>
        </div>
      `).join('');

      mainContent.innerHTML = `
        <div class="screen-container">
          <div class="screen">
            <button class="back-button" onclick="showScreen('consultas')">
              <i class="fas fa-arrow-left"></i>
            </button>
            <div class="consultas-container">
              <div class="screen-title">
                <i class="fas fa-archive"></i> Tickets Archivados
              </div>
              <div style="margin-bottom: 20px; color: #666; text-align: center;">
                Tickets que han sido archivados y resueltos
              </div>
              <div class="tickets-list">
                ${archivedItems}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function restoreTicket(ticketId) {
      showToast(`Ticket #${ticketId} restaurado a la lista activa`, 'success');
      setTimeout(() => {
        showScreen('consultas');
      }, 1500);
    }

    function exportTickets() {
      showToast('Exportando tickets a CSV...', 'info');
      setTimeout(() => {
        showToast('Tickets exportados exitosamente ✅', 'success');
      }, 2000);
    }

    function filterTickets(filter) {
      const tickets = document.querySelectorAll('.ticket-item');
      const filterBtns = document.querySelectorAll('.filter-btn');
      
      // Actualizar botones activos
      filterBtns.forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      
      // Filtrar tickets
      tickets.forEach(ticket => {
        const priority = ticket.getAttribute('data-priority');
        const status = ticket.querySelector('.ticket-status').textContent.toLowerCase();
        
        let show = false;
        
        switch(filter) {
          case 'all':
            show = true;
            break;
          case 'alta':
            show = priority === 'alta';
            break;
          case 'abierto':
            show = status.includes('abierto');
            break;
          case 'en_proceso':
            show = status.includes('proceso');
            break;
        }
        
        ticket.style.display = show ? 'block' : 'none';
      });
    }

    function saveProfile() {
      showToast('Perfil guardado correctamente ✅', 'success');
    }

    // Funciones de modales
    function showModal(modalId) {
      const modal = document.getElementById(modalId);
      modal.classList.add('show');
      
      if (modalId === 'friendsModal') {
        renderFriendsList();
      } else if (modalId === 'registerModal') {
        renderRegisterForm();
      }
    }

    function closeModal(modalId) {
      const modal = document.getElementById(modalId);
      modal.classList.remove('show');
    }

    function renderFriendsList() {
      const friendsList = document.getElementById('friendsList');
      const friends = [
        { name: 'Ana García', icon: 'fas fa-female', status: 'online', info: 'Maestra de 2-A' },
        { name: 'Carlos López', icon: 'fas fa-male', status: 'offline', info: 'Padre de familia' },
        { name: 'María Rodríguez', icon: 'fas fa-female', status: 'online', info: 'Directora' },
        { name: 'Pedro Martínez', icon: 'fas fa-male', status: 'away', info: 'Maestro de Educación Física' }
      ];

      const friendsHTML = friends.map(friend => `
        <div class="list-item" style="margin-bottom: 15px;">
          <div class="list-item-icon">
            <i class="${friend.icon}"></i>
          </div>
          <div style="flex: 1;">
            <div class="list-item-text">${friend.name}</div>
            <div style="font-size: 12px; color: #666;">${friend.info}</div>
          </div>
          <div style="width: 12px; height: 12px; border-radius: 50%; background: ${
            friend.status === 'online' ? '#4CAF50' : 
            friend.status === 'away' ? '#FF9800' : '#999'
          };"></div>
        </div>
      `).join('');

      friendsList.innerHTML = friendsHTML;
    }

    function renderRegisterForm() {
      const registerForm = document.getElementById('registerForm');
      registerForm.innerHTML = `
        <div class="form-group">
          <label class="form-label">Tipo de Usuario</label>
          <select class="form-input" id="userType">
            <option value="alumno">Alumno</option>
            <option value="padre">Padre de Familia</option>
            <option value="maestro">Maestro</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Nombre Completo</label>
          <input type="text" class="form-input" placeholder="Ingrese el nombre completo">
        </div>
        <div class="form-group">
          <label class="form-label">Correo Electrónico</label>
          <input type="email" class="form-input" placeholder="correo@ejemplo.com">
        </div>
        <div class="form-group">
          <label class="form-label">Contraseña Temporal</label>
          <input type="password" class="form-input" placeholder="Contraseña inicial">
        </div>
        <div class="form-group">
          <label class="form-label">Asignación/Grupo</label>
          <input type="text" class="form-input" placeholder="Ej: Grupo 3-A, Matemáticas, etc.">
        </div>
        <button class="save-button" onclick="registerUser()">
          <i class="fas fa-user-plus"></i> Registrar Usuario
        </button>
      `;
    }

    function registerUser() {
      showToast('Usuario registrado exitosamente ✅', 'success');
      closeModal('registerModal');
    }

    // Funciones de burbujas interactivas
    function showBubbleOptions(person, options) {
      const overlay = document.getElementById('bubbleOverlay');
      const bubbleOptions = document.getElementById('bubbleOptions');
      
      let optionsHTML = `<div class="bubble-center">${person.emoji}</div>`;
      
      options.forEach((option, index) => {
        optionsHTML += `
          <button class="bubble-option" onclick="handleBubbleAction('${option.action}', '${person.name}')">
            <i class="${option.icon}"></i>
            <span>${option.label}</span>
          </button>
        `;
      });
      
      bubbleOptions.innerHTML = optionsHTML;
      overlay.classList.add('show');
    }

    function handleBubbleAction(action, personName) {
      const overlay = document.getElementById('bubbleOverlay');
      overlay.classList.remove('show');
      
      switch(action) {
        case 'alert':
          showToast(`Alerta enviada para ${personName}`, 'success');
          break;
        case 'edit':
          showEditProfile(personName);
          break;
        case 'message':
          showChatInterface(personName);
          break;
        case 'permission':
          showToast(`Solicitando permiso de salida`, 'info');
          break;
        case 'info':
          showInfoModal(personName);
          break;
      }
    }

    function showChatInterface(personName) {
      const mainContent = document.getElementById('mainContent');
      const person = findPersonByName(personName);
      
      const messages = [
        { type: 'received', text: 'Hola, ¿cómo estás?', time: '14:30' },
        { type: 'sent', text: 'Muy bien, gracias. ¿Y tú?', time: '14:32' },
        { type: 'received', text: 'Todo perfecto. ¿Necesitas algo?', time: '14:33' },
        { type: 'sent', text: 'Solo quería saludar 😊', time: '14:35' }
      ];

      const messagesHTML = messages.map(msg => `
        <div class="message ${msg.type}">
          <div class="message-bubble">
            ${msg.text}
            <div class="message-time">${msg.time}</div>
          </div>
        </div>
      `).join('');

      mainContent.innerHTML = `
        <div class="chat-interface">
          <div class="chat-header">
            <button class="back-button" onclick="renderScreens()" style="position: static; background: rgba(255,255,255,0.2); border-color: white; color: white;">
              <i class="fas fa-arrow-left"></i>
            </button>
            <div class="chat-avatar-large">${person.emoji}</div>
            <div class="chat-info">
              <div class="chat-name-large">${personName}</div>
              <div class="chat-status">En línea</div>
            </div>
          </div>
          <div class="chat-messages" id="chatMessages">
            ${messagesHTML}
          </div>
          <div class="chat-input">
            <input type="text" placeholder="Escribe un mensaje..." id="messageInput" onkeypress="handleMessageKeyPress(event)">
            <button class="chat-send-btn" onclick="sendMessage()">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      `;
    }

    function showInfoModal(personName) {
      const person = findPersonByName(personName);
      const modal = document.getElementById('friendsModal');
      const modalContent = modal.querySelector('.modal-content');
      
      modalContent.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">Información</div>
          <button class="modal-close" onclick="closeModal('friendsModal')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="info-content">
          <div class="info-photo">${person.emoji}</div>
          <div class="info-name">${personName}</div>
          <div class="info-details">
            <div class="info-item">
              <span class="info-label">Rol:</span>
              <span class="info-value">${person.subject || person.role || 'Usuario'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Estado:</span>
              <span class="info-value">Activo</span>
            </div>
            <div class="info-item">
              <span class="info-label">Último acceso:</span>
              <span class="info-value">Hace 5 minutos</span>
            </div>
            <div class="info-item">
              <span class="info-label">Contacto:</span>
              <span class="info-value">Disponible</span>
            </div>
          </div>
        </div>
      `;
      
      modal.classList.add('show');
    }

    function showEditProfile(personName) {
      const person = findPersonByName(personName);
      const mainContent = document.getElementById('mainContent');
      
      mainContent.innerHTML = `
        <div class="profile-screen">
          <button class="back-button" onclick="renderScreens()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="profile-photo-section">
            <div class="profile-photo-large">${person.emoji}</div>
            <div style="color: #FFB347; font-weight: bold;">Editando perfil de ${personName}</div>
          </div>
          
          <div class="profile-form">
            <div class="config-title">Información del Estudiante</div>
            <div class="form-group">
              <label class="form-label">Nombre Completo</label>
              <input type="text" class="form-input" value="${personName}">
            </div>
            <div class="form-group">
              <label class="form-label">Grupo</label>
              <input type="text" class="form-input" value="${person.group || 'N/A'}">
            </div>
            <div class="form-group">
              <label class="form-label">Fecha de Nacimiento</label>
              <input type="date" class="form-input" value="2010-05-15">
            </div>
            <div class="form-group">
              <label class="form-label">Contacto de Emergencia</label>
              <input type="text" class="form-input" value="555-0123">
            </div>
            <div class="form-group">
              <label class="form-label">Alergias/Observaciones</label>
              <textarea class="form-input" rows="3" placeholder="Ninguna alergia conocida"></textarea>
            </div>
          </div>

          <button class="save-button" onclick="saveStudentProfile('${personName}')">
            <i class="fas fa-save"></i> Guardar Cambios
          </button>
        </div>
      `;
    }

    function findPersonByName(name) {
      // Buscar en estudiantes
      for (const group in groupStudents) {
        const student = groupStudents[group].find(s => s.name === name);
        if (student) return student;
      }
      
      // Buscar en maestros
      const teacher = schoolTeachers.find(t => t.name === name);
      if (teacher) return teacher;
      
      // Buscar en padres
      const user = userData[currentRole];
      if (user.parents) {
        const parent = user.parents.find(p => p.name === name);
        if (parent) return parent;
      }
      
      // Buscar en hijos
      if (user.children) {
        const child = user.children.find(c => c.name === name);
        if (child) return child;
      }
      
      // Por defecto
      return { emoji: '👤', role: 'Usuario' };
    }

    function sendMessage() {
      const input = document.getElementById('messageInput');
      const messagesContainer = document.getElementById('chatMessages');
      
      if (input.value.trim()) {
        const messageHTML = `
          <div class="message sent">
            <div class="message-bubble">
              ${input.value}
              <div class="message-time">${new Date().toLocaleTimeString().slice(0,5)}</div>
            </div>
          </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        input.value = '';
        
        // Simular respuesta automática
        setTimeout(() => {
          const responseHTML = `
            <div class="message received">
              <div class="message-bubble">
                Mensaje recibido ✓
                <div class="message-time">${new Date().toLocaleTimeString().slice(0,5)}</div>
              </div>
            </div>
          `;
          messagesContainer.insertAdjacentHTML('beforeend', responseHTML);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
      }
    }

    function handleMessageKeyPress(event) {
      if (event.key === 'Enter') {
        sendMessage();
      }
    }

    function saveStudentProfile(studentName) {
      showToast(`Perfil de ${studentName} guardado correctamente ✅`, 'success');
      setTimeout(() => {
        renderScreens();
      }, 1500);
    }

    // Cerrar overlay al hacer clic fuera
    document.getElementById('bubbleOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'bubbleOverlay') {
        document.getElementById('bubbleOverlay').classList.remove('show');
      }
    });

    // Variables globales para el login
    let isLoggedIn = false;
    let currentUser = null;

    // Funciones del sistema de login
    function togglePassword() {
      const passwordInput = document.getElementById('password');
      const toggleBtn = document.querySelector('.password-toggle i');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
      } else {
        passwordInput.type = 'password';
        toggleBtn.className = 'fas fa-eye';
      }
    }

    function showForgotPassword() {
      document.getElementById('forgotModal').classList.add('show');
    }

    function closeForgotModal() {
      document.getElementById('forgotModal').classList.remove('show');
    }

    function sendRecoveryEmail() {
      const email = document.getElementById('recoveryEmail').value;
      if (email) {
        showToast('📧 Instrucciones enviadas a tu correo electrónico', 'success');
        closeForgotModal();
      } else {
        showToast('Por favor ingresa tu correo electrónico', 'error');
      }
    }

    function showInfoModal() {
      document.getElementById('infoModal').classList.add('show');
    }

    function closeInfoModal() {
      document.getElementById('infoModal').classList.remove('show');
    }

    function handleLogin(event) {
      event.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const rememberMe = document.getElementById('rememberMe').checked;
      
      if (!username || !password) {
        showToast('Por favor completa todos los campos', 'error');
        return;
      }

      // Simular validación de credenciales
      const validCredentials = {
        'alumno': 'alumno123',
        'padre': 'padre123',
        'maestro': 'maestro123',
        'admin': 'admin123',
        'director': 'director123'
      };

      let userRole = null;
      for (const [role, pass] of Object.entries(validCredentials)) {
        if (username.toLowerCase() === role && password === pass) {
          userRole = role;
          break;
        }
      }

      if (userRole) {
        // Login exitoso
        showToast('✅ Inicio de sesión exitoso', 'success');
        
        // Guardar datos del usuario
        currentUser = {
          username: username,
          role: userRole,
          rememberMe: rememberMe
        };
        
        // Si "No cerrar sesión" está marcado, guardar en localStorage
        if (rememberMe) {
          localStorage.setItem('escolarfam_user', JSON.stringify(currentUser));
        }
        
        // Ocultar pantalla de login y mostrar aplicación
        setTimeout(() => {
          document.getElementById('loginScreen').style.display = 'none';
          document.getElementById('appContainer').style.display = 'flex';
          
          // Configurar el rol en la aplicación
          currentRole = userRole === 'director' ? 'admin' : userRole;
          document.getElementById('roleSelector').value = currentRole;
          
          // Inicializar la aplicación
          isLoggedIn = true;
          showRegisterButton();
          updateNavigation();
          renderScreens();
          attachAppHeaderListeners();
        }, 1000);
        
      } else {
        // Login fallido
        showToast('❌ Usuario o contraseña incorrectos', 'error');
        
        // Limpiar campos
        document.getElementById('password').value = '';
        document.getElementById('username').focus();
      }
    }

    function logout() {
      // Limpiar datos guardados
      localStorage.removeItem('escolarfam_user');
      
      // Resetear variables
      isLoggedIn = false;
      currentUser = null;
      
      // Mostrar pantalla de login
      document.getElementById('appContainer').style.display = 'none';
      document.getElementById('loginScreen').style.display = 'flex';
      
      // Limpiar formulario
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
      document.getElementById('rememberMe').checked = false;
      
      showToast('Sesión cerrada correctamente', 'info');
    }

    function checkSavedLogin() {
      const savedUser = localStorage.getItem('escolarfam_user');
      if (savedUser) {
        try {
          currentUser = JSON.parse(savedUser);
          
          // Auto-login si el usuario eligió "No cerrar sesión"
          if (currentUser.rememberMe) {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('appContainer').style.display = 'flex';
            
            currentRole = currentUser.role === 'director' ? 'admin' : currentUser.role;
            document.getElementById('roleSelector').value = currentRole;
            
            isLoggedIn = true;
            showRegisterButton();
            updateNavigation();
            renderScreens();
            attachAppHeaderListeners();
            
            showToast(`Bienvenido de nuevo, ${currentUser.username}`, 'success');
            return true;
          }
        } catch (error) {
          localStorage.removeItem('escolarfam_user');
        }
      }
      return false;
    }

    function attachLoginListeners() {
      // Botón de tema en login
      document.getElementById('themeBtn').addEventListener('click', toggleTheme);
      
      // Botón de información
      document.getElementById('infoBtn').addEventListener('click', showInfoModal);
      
      // Formulario de login
      document.getElementById('loginForm').addEventListener('submit', handleLogin);
      
      // Cerrar modales al hacer clic fuera
      document.getElementById('infoModal').addEventListener('click', (e) => {
        if (e.target.id === 'infoModal') {
          closeInfoModal();
        }
      });
      
      document.getElementById('forgotModal').addEventListener('click', (e) => {
        if (e.target.id === 'forgotModal') {
          closeForgotModal();
        }
      });
    }

    function attachAppHeaderListeners() {
      document.getElementById('appThemeBtn').addEventListener('click', toggleTheme);
      
      document.getElementById('friendsBtn').addEventListener('click', () => {
        showModal('friendsModal');
      });
      
      document.getElementById('registerBtn').addEventListener('click', () => {
        showModal('registerModal');
      });
      
      document.getElementById('logoutBtn').addEventListener('click', logout);
    }

    document.getElementById('roleSelector').addEventListener('change', (e) => {
      currentRole = e.target.value;
      showRegisterButton();
      updateNavigation();
      renderScreens();
    });

    async function onConfigChange(config) {
      const appTitle = config.app_title || defaultConfig.app_title;
      const welcomeMessage = config.welcome_message || defaultConfig.welcome_message;
      const primaryColor = config.primary_color || defaultConfig.primary_color;
      const secondaryColor = config.secondary_color || defaultConfig.secondary_color;
      const accentColor = config.accent_color || defaultConfig.accent_color;
      const backgroundColor = config.background_color || defaultConfig.background_color;
      const textColor = config.text_color || defaultConfig.text_color;

      document.documentElement.style.setProperty('--primary-color', primaryColor);
      document.documentElement.style.setProperty('--secondary-color', secondaryColor);
      document.documentElement.style.setProperty('--accent-color', accentColor);
      document.documentElement.style.setProperty('--background-color', backgroundColor);
      document.documentElement.style.setProperty('--text-color', textColor);

      const style = document.createElement('style');
      style.textContent = `
        .header { background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%); }
        .badge { border-color: ${primaryColor}; }
        .badge-photo { border-color: ${primaryColor}; background: linear-gradient(135deg, ${secondaryColor} 0%, ${secondaryColor}dd 100%); }
        .badge-name { color: ${accentColor}; }
        .badge-role { color: ${secondaryColor}; }
        .badge-qr { border-color: ${primaryColor}; color: ${primaryColor}; }
        .list-item { border-left-color: ${secondaryColor}; }
        .tree-node { border-color: ${secondaryColor}; }
        .tree-teacher { border-color: ${primaryColor}; }
        .nav-button.active { color: ${accentColor}; }
        .nav-center-button { background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%); }
        .screen-title { color: ${accentColor}; }
        .screen-icon { color: ${primaryColor}; }
        .checklist-checkbox { border-color: ${secondaryColor}; }
        .checklist-checkbox.checked { background: ${secondaryColor}; }
        .app-container { background: linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%); }
        body { color: ${textColor}; }
        .form-label { color: ${accentColor}; }
        .form-input { border-color: ${primaryColor}; }
        .config-title { color: ${accentColor}; border-bottom-color: ${primaryColor}; }
        .pickup-button { background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%); }
      `;
      document.head.appendChild(style);
    }

    if (window.elementSdk) {
      window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities: (config) => ({
          recolorables: [
            {
              get: () => config.background_color || defaultConfig.background_color,
              set: (value) => {
                config.background_color = value;
                window.elementSdk.setConfig({ background_color: value });
              }
            },
            {
              get: () => config.secondary_color || defaultConfig.secondary_color,
              set: (value) => {
                config.secondary_color = value;
                window.elementSdk.setConfig({ secondary_color: value });
              }
            },
            {
              get: () => config.text_color || defaultConfig.text_color,
              set: (value) => {
                config.text_color = value;
                window.elementSdk.setConfig({ text_color: value });
              }
            },
            {
              get: () => config.primary_color || defaultConfig.primary_color,
              set: (value) => {
                config.primary_color = value;
                window.elementSdk.setConfig({ primary_color: value });
              }
            },
            {
              get: () => config.accent_color || defaultConfig.accent_color,
              set: (value) => {
                config.accent_color = value;
                window.elementSdk.setConfig({ accent_color: value });
              }
            }
          ],
          borderables: [],
          fontEditable: undefined,
          fontSizeable: undefined
        }),
        mapToEditPanelValues: (config) => new Map([
          ["app_title", config.app_title || defaultConfig.app_title],
          ["welcome_message", config.welcome_message || defaultConfig.welcome_message]
        ])
      });
    }

    // Agregar animaciones CSS para toast
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(animationStyle);

    // Inicializar la aplicación
    document.addEventListener('DOMContentLoaded', () => {
      // Verificar si hay una sesión guardada
      if (!checkSavedLogin()) {
        // Si no hay sesión guardada, mostrar pantalla de login
        attachLoginListeners();
      }
      
      // Listener para cambio de rol (solo si está logueado)
      document.getElementById('roleSelector').addEventListener('change', (e) => {
        if (isLoggedIn) {
          currentRole = e.target.value;
          showRegisterButton();
          updateNavigation();
          renderScreens();
        }
      });
    });
  (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'99e028257281c033',t:'MTc2MzA1NjcwMi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();