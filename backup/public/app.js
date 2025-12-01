
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
    let datosUsuarioActual = null;
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
      // Usar datos reales del usuario actual desde la BD
      const nombre = datosUsuarioActual?.nombre_completo || user.name || 'Usuario';
      const rol = datosUsuarioActual?.rol || user.role || 'Sin rol';
      const asignacion = datosUsuarioActual?.asignacion || user.assignment || 'N/A';
      const fotoPerfil = datosUsuarioActual?.foto_perfil || null;
      const idUsuario = idUsuarioActual || 0;
      
      // Generar ID único para el contenedor del QR
      const qrId = `qr-code-${Date.now()}`;
      
      // Datos a codificar en el QR (SIMPLIFICADOS - solo ID y escuela)
      // El resto se obtiene desde la BD al escanear
      const qrData = JSON.stringify({
        id: idUsuario,
        escuela: idEscuelaActual || datosUsuarioActual?.id_escuela || 1
      });
      
      // HTML para la foto de perfil
      const photoHTML = fotoPerfil 
        ? `<img src="${fotoPerfil}" alt="${nombre}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
        : (user.emoji || '👤');
      
      // Crear el HTML del badge
      const badgeHTML = `
        <div class="badge">
          <div class="badge-header">
            <div class="badge-photo">${photoHTML}</div>
            <div class="badge-name">${nombre}</div>
            <div class="badge-role">${rol.charAt(0).toUpperCase() + rol.slice(1)}</div>
            <div class="badge-assignment">${asignacion}</div>
          </div>
          <div class="badge-qr" id="${qrId}">
          </div>
        </div>
        <div class="swipe-indicator">
          <i class="fas fa-chevron-left"></i>
          Desliza para explorar
          <i class="fas fa-chevron-right"></i>
        </div>
      `;
      
      // Generar el código QR después de que el DOM esté listo
      setTimeout(() => {
        const qrContainer = document.getElementById(qrId);
        if (qrContainer && typeof QRCode !== 'undefined') {
          // Limpiar contenido previo
          qrContainer.innerHTML = '';
          
          // Generar QR con datos simplificados
          new QRCode(qrContainer, {
            text: qrData,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
          });
        }
      }, 100);
      
      return badgeHTML;
    }

    async function renderGroupList() {
      try {
        let response, grupos;
        
        // Diferenciar entre maestro y director
        if (rolUsuarioActual === 'admin') {
          // Director: obtener todos los grupos de la escuela
          response = await fetch(`/api/usuarios/escuela/${datosUsuarioActual.id_escuela}/todos-grupos`);
        } else {
          // Maestro: obtener solo grupos asignados
          response = await fetch(`/api/usuarios/${idUsuarioActual}/grupos-asignados`);
        }
        
        const data = await response.json();
        grupos = data.grupos;

        if (!grupos || grupos.length === 0) {
          const mensaje = rolUsuarioActual === 'admin' ? 
            'No hay grupos registrados en la escuela' : 
            'No tienes grupos asignados';
          const submensaje = rolUsuarioActual === 'admin' ? 
            'Registra grupos desde el panel de administración' :
            'Contacta al administrador para asignar grupos';
            
          return `
            <div class="list-screen">
              <div class="list-title">Mis Grupos</div>
              <div style="text-align: center; color: #666; margin-top: 50px;">
                <i class="fas fa-users" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                <p>${mensaje}</p>
                <small style="color: #999; display: block; margin-top: 10px;">
                  ${submensaje}
                </small>
              </div>
            </div>
          `;
        }

        const items = grupos.map(grupo => {
          // Información adicional para el director
          const infoAdicional = rolUsuarioActual === 'admin' && grupo.nombre_maestro ?
            `<br><small style="color: #999;">Maestro: ${grupo.nombre_maestro}</small>` :
            `<br><small style="color: #999;">Nivel ${grupo.nivel} - Sección ${grupo.seccion}</small>`;
            
          return `
            <div class="list-item" onclick="showGroupTree(${grupo.id_grupo}, '${grupo.nombre_grupo}')">
              <div class="list-item-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="list-item-text">
                ${grupo.nombre_grupo}
                ${infoAdicional}
              </div>
              <i class="fas fa-chevron-right" style="color: #FFB347;"></i>
            </div>
          `;
        }).join('');

        const titulo = rolUsuarioActual === 'admin' ? 'Todos los Grupos' : 'Mis Grupos';

        return `
          <div class="list-screen">
            <div class="list-title">${titulo}</div>
            ${items}
          </div>
        `;
      } catch (error) {
        console.error('Error al cargar grupos:', error);
        return `
          <div class="list-screen">
            <div class="list-title">Mis Grupos</div>
            <div style="text-align: center; color: #ff6b6b; margin-top: 50px;">
              <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
              <p>Error al cargar los grupos</p>
            </div>
          </div>
        `;
      }
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

    // Función para renderizar el grupo del alumno con maestro y compañeros
    async function renderStudentGroupScreen() {
      try {
        // Obtener el grupo del alumno actual
        const grupoResponse = await fetch(`/api/usuarios/${idUsuarioActual}/grupo`);
        if (!grupoResponse.ok) {
          return `
            <div class="tree-screen">
              <div class="tree-container">
                <div style="text-align: center; color: #666; margin-top: 50px;">
                  <i class="fas fa-users" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                  <p>No estás asignado a ningún grupo</p>
                </div>
              </div>
            </div>
          `;
        }
        
        const grupoData = await grupoResponse.json();
        const { grupo, maestro, companeros } = grupoData;
        
        // Renderizar nodos de todos los compañeros (incluyendo al usuario actual)
        const studentNodes = companeros && companeros.length > 0 
          ? companeros.map(comp => {
              const isCurrentUser = comp.id_usuario === idUsuarioActual;
              const avatarContent = comp.foto_perfil 
                ? `<img src="${comp.foto_perfil}" alt="${comp.nombre_completo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
                : '👦';
              
              return `
                <div class="tree-node tree-leaf" ${!isCurrentUser ? `onclick="openChatById(${comp.id_usuario}, '${comp.nombre_completo.replace(/'/g, "\\'")}')"` : ''} style="${isCurrentUser ? 'border: 3px solid #FFB347; box-shadow: 0 0 15px rgba(255,179,71,0.5);' : ''}">
                  ${avatarContent}
                  <div style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: bold; color: ${isCurrentUser ? '#FFB347' : '#7EC8A3'}; white-space: nowrap; max-width: 120px; overflow: hidden; text-overflow: ellipsis;">
                    ${isCurrentUser ? 'Tú' : comp.nombre_completo}
                  </div>
                </div>
              `;
            }).join('')
          : '<div style="color: #999; text-align: center;">No hay compañeros en tu grupo</div>';
        
        // Renderizar maestro en la raíz del árbol
        const maestroContent = maestro 
          ? (maestro.foto_perfil 
              ? `<img src="${maestro.foto_perfil}" alt="${maestro.nombre_completo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
              : '👨‍🏫')
          : '👨‍🏫';
        
        return `
          <div class="tree-screen">
            <div class="tree-container">
              <div class="tree-node tree-teacher" ${maestro ? `onclick="openChatById(${maestro.id_usuario}, '${maestro.nombre_completo.replace(/'/g, "\\'")}')"` : ''}>
                ${maestroContent}
              </div>
              <div class="tree-line" style="height: 30px; top: 90px;"></div>
              <div class="tree-students">
                ${studentNodes}
              </div>
            </div>
            <div style="text-align: center; margin-top: 50px; color: #7EC8A3; font-weight: bold; font-size: 20px;">
              ${grupo.nombre_grupo}
            </div>
          </div>
        `;
      } catch (error) {
        console.error('Error al cargar grupo del alumno:', error);
        return `
          <div class="tree-screen">
            <div class="tree-container">
              <div style="text-align: center; color: #ff6b6b; margin-top: 50px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
                <p>Error al cargar tu grupo</p>
              </div>
            </div>
          </div>
        `;
      }
    }

    async function renderGroupTree(idGrupo, nombreGrupo) {
      try {
        // Obtener estudiantes del grupo desde la base de datos
        const response = await fetch(`/api/usuarios/grupos/${idGrupo}/estudiantes`);
        const { estudiantes } = await response.json();

        if (!estudiantes || estudiantes.length === 0) {
          return `
            <div class="tree-screen">
              <button class="back-button" onclick="renderScreens()">
                <i class="fas fa-arrow-left"></i>
              </button>
              <div class="tree-container">
                <div style="text-align: center; color: #666; margin-top: 50px;">
                  <i class="fas fa-user-graduate" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                  <p>No hay estudiantes en este grupo</p>
                </div>
              </div>
              <div style="text-align: center; margin-top: 50px; color: #7EC8A3; font-weight: bold; font-size: 20px;">
                ${nombreGrupo}
              </div>
            </div>
          `;
        }

        const studentNodes = estudiantes.map(estudiante => {
          // Definir contenido del avatar
          const avatarContent = estudiante.foto_perfil ? 
            `<img src="${estudiante.foto_perfil}" alt="${estudiante.nombre_completo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
            '👦'; // emoji por defecto

          // Opciones para cada estudiante
          const opciones = [
            {action: 'message', icon: 'fas fa-comment', label: 'Mensaje'},
            {action: 'info', icon: 'fas fa-info', label: 'Información'}
          ];

          const estudianteData = {
            id: estudiante.id_usuario,
            name: estudiante.nombre_completo,
            emoji: '👦',
            icon: 'fas fa-user-graduate',
            foto: estudiante.foto_perfil || null,
            asignacion: estudiante.asignacion
          };

          return `
            <div class="tree-node tree-leaf" onclick="handlePersonClick('${encodeURIComponent(JSON.stringify(estudianteData))}', '${encodeURIComponent(JSON.stringify(opciones))}')">
              ${avatarContent}
              <div style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: bold; color: #7EC8A3; white-space: nowrap; max-width: 120px; overflow: hidden; text-overflow: ellipsis;">
                ${estudiante.nombre_completo}
              </div>
            </div>
          `;
        }).join('');

        return `
          <div class="tree-screen">
            <button class="back-button" onclick="renderScreens()">
              <i class="fas fa-arrow-left"></i>
            </button>
            <div class="tree-container">
              <div class="tree-node tree-teacher">
                ${datosUsuarioActual.foto_perfil ? 
                  `<img src="${datosUsuarioActual.foto_perfil}" alt="${datosUsuarioActual.nombre_completo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` : 
                  '👨‍🏫'
                }
              </div>
              <div class="tree-line" style="height: 30px; top: 90px;"></div>
              <div class="tree-students">
                ${studentNodes}
              </div>
            </div>
            <div style="text-align: center; margin-top: 50px; color: #7EC8A3; font-weight: bold; font-size: 20px;">
              ${nombreGrupo}
            </div>
          </div>
        `;
      } catch (error) {
        console.error('Error al cargar estudiantes del grupo:', error);
        return `
          <div class="tree-screen">
            <button class="back-button" onclick="renderScreens()">
              <i class="fas fa-arrow-left"></i>
            </button>
            <div style="text-align: center; color: #ff6b6b; margin-top: 50px;">
              <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
              <p>Error al cargar los estudiantes</p>
            </div>
          </div>
        `;
      }
    }

    function handlePersonClick(personaEncoded, opcionesEncoded) {
      try {
        const persona = JSON.parse(decodeURIComponent(personaEncoded));
        const opciones = JSON.parse(decodeURIComponent(opcionesEncoded));
        showBubbleOptions(persona, opciones);
      } catch (error) {
        console.error('Error al decodificar datos de persona:', error);
        showToast('Error al procesar la información', 'error');
      }
    }

    async function renderTeachersTree() {
      try {
        // Obtener personal docente desde la base de datos
        const response = await fetch(`/api/usuarios/escuela/${datosUsuarioActual.id_escuela}/personal-docente`);
        const { personal } = await response.json();

        if (!personal || personal.length === 0) {
          return `
            <div class="tree-screen">
              <div class="tree-container">
                <div style="text-align: center; margin-bottom: 40px; color: #7EC8A3; font-weight: bold; font-size: 24px;">
                  Personal Docente
                </div>
                <div style="text-align: center; color: #666; margin-top: 50px;">
                  <i class="fas fa-users" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                  <p>No hay personal docente registrado</p>
                </div>
              </div>
            </div>
          `;
        }

        const personalNodes = personal.map(persona => {
          // Definir emoji e icono según el rol
          const emoji = persona.rol === 'admin' ? '👨‍💼' : (persona.nombre_completo.toLowerCase().includes('prof') ? '👨‍🏫' : '👩‍🏫');
          const icon = persona.rol === 'admin' ? 'fas fa-user-tie' : 'fas fa-chalkboard-teacher';
          
          // Definir opciones según el rol
          let opciones;
          if (persona.rol === 'admin') {
            // Para director: Abrir Ticket + Información
            opciones = [
              {action: 'ticket', icon: 'fas fa-ticket-alt', label: 'Abrir Ticket'},
              {action: 'info', icon: 'fas fa-info', label: 'Información'}
            ];
          } else {
            // Para maestro: Mensaje + Información
            opciones = [
              {action: 'message', icon: 'fas fa-comment', label: 'Mensaje'},
              {action: 'info', icon: 'fas fa-info', label: 'Información'}
            ];
          }

          const personaData = {
            id: persona.id_usuario,
            name: persona.nombre_completo || '',
            emoji: emoji,
            icon: icon,
            rol: persona.rol,
            email: persona.email || '',
            foto: persona.foto_perfil || null,
            asignacion: persona.asignacion || null
          };

          // Mostrar foto de perfil si está disponible, sino emoji
          const avatarContent = persona.foto_perfil ? 
            `<img src="${persona.foto_perfil}" alt="${persona.nombre_completo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` : 
            emoji;

          return `
            <div class="tree-node tree-leaf" onclick="handlePersonClick('${encodeURIComponent(JSON.stringify(personaData))}', '${encodeURIComponent(JSON.stringify(opciones))}')">
              ${avatarContent}
              <div style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: bold; color: #7EC8A3; white-space: nowrap; max-width: 120px; overflow: hidden; text-overflow: ellipsis;">
                ${persona.nombre_completo}
              </div>
              ${persona.rol === 'admin' ? '<div style="position: absolute; top: -10px; right: -10px; background: #FFB347; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold;">D</div>' : ''}
            </div>
          `;
        }).join('');

        return `
          <div class="tree-screen">
            <div class="tree-container">
              <div style="text-align: center; margin-bottom: 40px; color: #7EC8A3; font-weight: bold; font-size: 24px;">
                Personal Docente
              </div>
              <div class="tree-students">
                ${personalNodes}
              </div>
            </div>
          </div>
        `;
      } catch (error) {
        console.error('Error al cargar personal docente:', error);
        return `
          <div class="tree-screen">
            <div class="tree-container">
              <div style="text-align: center; color: #ff6b6b; margin-top: 50px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
                <p>Error al cargar el personal docente</p>
              </div>
            </div>
          </div>
        `;
      }
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

    // Función para inicializar WebSocket y escuchar avisos de voz (cerebro)
    window.initVoiceAnnouncementListener = function() {
      if (currentRole === 'admin' || currentRole === 'maestro') {
        // Usar Server-Sent Events para escuchar avisos
        const eventSource = new EventSource('/api/avisos/stream');
        
        eventSource.onmessage = function(event) {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'voice_announcement') {
              playDirectorAnnouncement(data.mensaje, data.studentName, data.maestro);
            }
          } catch (error) {
            console.error('Error procesando aviso de voz:', error);
          }
        };
        
        eventSource.onerror = function(error) {
          console.log('Conexión SSE perdida, reintentando...');
          setTimeout(() => {
            if (eventSource.readyState === EventSource.CLOSED) {
              window.initVoiceAnnouncementListener();
            }
          }, 5000);
        };
      }
    };

    // Función para reproducir avisos en el cerebro del director
    window.playDirectorAnnouncement = async function(mensaje, studentName, maestroName) {
      if (window.speechSynthesis) {
        // Cancelar cualquier síntesis de voz en curso
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(mensaje);
        utterance.lang = 'es-ES';
        utterance.rate = 0.8;    // Más lento para claridad
        utterance.pitch = 1.2;   // Más agudo para emoción
        utterance.volume = 1.0;  // Volumen máximo
        
        // Buscar voz femenina en español para más emoción
        const voices = speechSynthesis.getVoices();
        const spanishFemaleVoice = voices.find(voice => 
          voice.lang.startsWith('es') && voice.name.toLowerCase().includes('female')
        );
        const spanishVoice = spanishFemaleVoice || voices.find(voice => voice.lang.startsWith('es'));
        
        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }
        
        // Reproducir sonido de notificación primero
        await playNotificationSound();
        
        // Esperar un poco antes del anuncio del nombre
        setTimeout(() => {
          // Asegurar que no haya otra síntesis corriendo
          if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
          }
          // Reproducir una sola vez
          speechSynthesis.speak(utterance);
        }, 800);
        
        // Mostrar notificación visual en el cerebro
        if (document.getElementById('brainPanel')) {
          showBrainVoiceNotification(mensaje, studentName, maestroName);
        }
      }
    };

    // Función para mostrar notificación visual en el cerebro
    window.showBrainVoiceNotification = function(mensaje, studentName, maestroName) {
      const notification = document.createElement('div');
      notification.className = 'brain-voice-notification';
      notification.innerHTML = `
        <div class="voice-notification-content">
          <i class="fas fa-volume-up"></i>
          <div class="voice-notification-text">
            <strong>🔊 Aviso de Voz</strong><br>
            <span>"${mensaje}"</span><br>
            <small>Por: ${maestroName} • ${new Date().toLocaleTimeString()}</small>
          </div>
        </div>
      `;
      
      const brainContainer = document.getElementById('brainContainer');
      if (brainContainer) {
        brainContainer.insertBefore(notification, brainContainer.firstChild);
        
        // Remover después de 10 segundos
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 10000);
      }
    };

    async function renderBrainPanel() {
      // Cargar datos reales del sistema
      let stats = { total: 0, hoy: 0, semana: 0, porCategoria: [], usuariosActivos: [], actividadPorHora: [] };
      let logs = [];
      
      try {
        const [statsResponse, logsResponse] = await Promise.all([
          fetch(`/api/config/escuela/${datosUsuarioActual.id_escuela}/logs/stats`),
          fetch(`/api/config/escuela/${datosUsuarioActual.id_escuela}/logs?limit=100`)
        ]);
        
        if (statsResponse.ok) stats = await statsResponse.json();
        if (logsResponse.ok) logs = await logsResponse.json();
      } catch (error) {
        console.error('Error cargando datos del cerebro:', error);
      }
      
      // Categorías para los filtros (4 para grid 2x2 en móvil)
      const categorias = [
        { id: 'todos', title: 'Todo', color: '#4ECDC4', icon: 'fas fa-list' },
        { id: 'recogidas', title: 'Recogidas', color: '#A8E6CF', icon: 'fas fa-child' },
        { id: 'accesos', title: 'Accesos', color: '#FFB347', icon: 'fas fa-sign-in-alt' },
        { id: 'otros', title: 'Otros', color: '#9B59B6', icon: 'fas fa-ellipsis-h' }
      ];
      
      // Función para obtener color de acción
      const getActionColor = (accion) => {
        if (accion.toLowerCase().includes('recogida')) return '#A8E6CF';
        if (accion.toLowerCase().includes('sesión') || accion.toLowerCase().includes('acceso')) return '#FFB347';
        if (accion.toLowerCase().includes('mensaje')) return '#FF6B35';
        if (accion.toLowerCase().includes('usuario')) return '#F39C12';
        if (accion.toLowerCase().includes('config')) return '#9B59B6';
        return '#4ECDC4';
      };
      
      // Generar filas de tabla (para desktop)
      const generateTableRows = (logsData) => {
        if (!logsData || logsData.length === 0) {
          return `<tr><td colspan="5" class="brain-empty-cell">No hay registros de actividad</td></tr>`;
        }
        
        return logsData.map(log => {
          const fecha = new Date(log.fecha_accion);
          const fechaStr = fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' });
          const horaStr = fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
          const actionColor = getActionColor(log.accion);
          
          let detallesStr = '';
          if (log.detalles) {
            try {
              const detalles = typeof log.detalles === 'string' ? JSON.parse(log.detalles) : log.detalles;
              detallesStr = Object.entries(detalles).map(([k, v]) => `${k}: ${v}`).join(', ');
            } catch { detallesStr = log.detalles; }
          }
          
          return `
            <tr class="brain-log-row">
              <td class="brain-cell-fecha">
                <div class="brain-fecha">${fechaStr}</div>
                <div class="brain-hora">${horaStr}</div>
              </td>
              <td class="brain-cell-usuario">
                <div class="brain-usuario-nombre">${log.usuario_nombre || 'Sistema'}</div>
                <div class="brain-usuario-rol">${log.usuario_rol || '-'}</div>
              </td>
              <td class="brain-cell-accion">
                <span class="brain-action-badge" style="background: ${actionColor}20; color: ${actionColor}; border: 1px solid ${actionColor}40;">
                  ${log.accion}
                </span>
              </td>
              <td class="brain-cell-tabla">${log.tabla_afectada || '-'}</td>
              <td class="brain-cell-detalles">${detallesStr || '-'}</td>
            </tr>
          `;
        }).join('');
      };
      
      // Generar cards (para móvil) - diseño compacto
      const generateLogCards = (logsData) => {
        if (!logsData || logsData.length === 0) {
          return `<div class="brain-empty-message">No hay registros</div>`;
        }
        
        return logsData.map(log => {
          const fecha = new Date(log.fecha_accion);
          const fechaStr = fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' });
          const horaStr = fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
          const actionColor = getActionColor(log.accion);
          const usuario = log.usuario_nombre ? log.usuario_nombre.split(' ')[0] : 'Sistema';
          
          return `
            <div class="brain-log-card">
              <div class="brain-card-top">
                <span class="brain-card-action" style="background: ${actionColor}25; color: ${actionColor};">${log.accion}</span>
                <span class="brain-card-time">${fechaStr} ${horaStr}</span>
              </div>
              <div class="brain-card-user">${usuario}</div>
              ${log.tabla_afectada ? `<div class="brain-card-tabla">${log.tabla_afectada}</div>` : ''}
            </div>
          `;
        }).join('');
      };
      
      // Generar estadísticas por categoría
      const statsCards = stats.porCategoria.map(cat => `
        <div class="brain-stat-card">
          <div class="brain-stat-value">${cat.total}</div>
          <div class="brain-stat-label">${cat.categoria}</div>
        </div>
      `).join('') || '<div class="brain-stat-card"><div class="brain-stat-value">0</div><div class="brain-stat-label">Sin datos</div></div>';
      
      // Generar lista de usuarios activos
      const usuariosActivosHTML = stats.usuariosActivos.length > 0 ? stats.usuariosActivos.map((u, i) => `
        <div class="brain-user-item">
          <div class="brain-user-rank">${i + 1}</div>
          <div class="brain-user-info">
            <div class="brain-user-name">${u.nombre_completo}</div>
            <div class="brain-user-role">${u.rol}</div>
          </div>
          <div class="brain-user-actions">${u.acciones}</div>
        </div>
      `).join('') : '<div class="brain-no-data">Sin datos</div>';
      
      // Tabs de categorías
      const tabsHTML = categorias.map((cat, index) => `
        <button class="brain-tab ${index === 0 ? 'active' : ''}" data-categoria="${cat.id}" style="--tab-color: ${cat.color};">
          <i class="${cat.icon}"></i>
          <span>${cat.title}</span>
        </button>
      `).join('');

      return `
        <div class="brain-panel-modern" id="brainPanel">
          <div class="brain-header-modern">
            <div class="brain-title-section">
              <i class="fas fa-brain brain-icon-pulse"></i>
              <div>
                <h2>Centro de Monitoreo</h2>
                <p>Logs del Sistema en Tiempo Real</p>
              </div>
            </div>
            <div class="brain-stats-header">
              <div class="brain-stat-chip">
                <i class="fas fa-circle pulse-green"></i>
                Activo
              </div>
              <div class="brain-stat-chip">
                <i class="fas fa-calendar-day"></i>
                <strong>${stats.hoy}</strong> hoy
              </div>
              <div class="brain-stat-chip">
                <i class="fas fa-database"></i>
                <strong>${stats.total}</strong> total
              </div>
            </div>
          </div>
          
          <div class="brain-content">
            <!-- Toggle para estadísticas en móvil -->
            <button class="brain-toggle-stats" onclick="toggleBrainStats()">
              <i class="fas fa-chart-bar"></i>
              Ver Estadísticas
              <i class="fas fa-chevron-down"></i>
            </button>
            
            <!-- Panel de estadísticas (colapsable en móvil) -->
            <div class="brain-sidebar" id="brainSidebar">
              <div class="brain-sidebar-section">
                <h3><i class="fas fa-chart-pie"></i> Por Categoría</h3>
                <div class="brain-stats-grid">
                  ${statsCards}
                </div>
              </div>
              
              <div class="brain-sidebar-section">
                <h3><i class="fas fa-trophy"></i> Top Usuarios</h3>
                <div class="brain-users-list">
                  ${usuariosActivosHTML}
                </div>
              </div>
              
              <div class="brain-sidebar-section">
                <h3><i class="fas fa-tools"></i> Acciones</h3>
                <button class="brain-action-btn" onclick="refreshBrainLogs()">
                  <i class="fas fa-sync-alt"></i> Actualizar
                </button>
                <button class="brain-action-btn danger" onclick="clearOldLogs()">
                  <i class="fas fa-trash-alt"></i> Limpiar Antiguos
                </button>
              </div>
            </div>
            
            <!-- Panel principal: Logs -->
            <div class="brain-main">
              <div class="brain-tabs">
                ${tabsHTML}
              </div>
              
              <div class="brain-table-container" id="brainTableContainer">
                <!-- Tabla para desktop -->
                <table class="brain-table">
                  <thead>
                    <tr>
                      <th><i class="fas fa-clock"></i> Fecha</th>
                      <th><i class="fas fa-user"></i> Usuario</th>
                      <th><i class="fas fa-bolt"></i> Acción</th>
                      <th><i class="fas fa-table"></i> Tabla</th>
                      <th><i class="fas fa-info-circle"></i> Detalles</th>
                    </tr>
                  </thead>
                  <tbody id="brainLogsBody">
                    ${generateTableRows(logs)}
                  </tbody>
                </table>
                
                <!-- Cards para móvil -->
                <div class="brain-logs-cards" id="brainLogsCards">
                  ${generateLogCards(logs)}
                </div>
              </div>
              
              <div class="brain-pagination">
                <button class="brain-page-btn" onclick="loadBrainLogs('prev')" id="brainPrevBtn" disabled>
                  <i class="fas fa-chevron-left"></i>
                  <span>Anterior</span>
                </button>
                <span class="brain-page-info" id="brainPageInfo">${logs.length} de ${stats.total}</span>
                <button class="brain-page-btn" onclick="loadBrainLogs('next')" id="brainNextBtn" ${logs.length < 100 ? 'disabled' : ''}>
                  <span>Siguiente</span>
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    // Toggle para mostrar/ocultar estadísticas en móvil
    window.toggleBrainStats = function() {
      const sidebar = document.getElementById('brainSidebar');
      const toggleBtn = document.querySelector('.brain-toggle-stats');
      if (sidebar && toggleBtn) {
        sidebar.classList.toggle('expanded');
        toggleBtn.classList.toggle('expanded');
      }
    };
    
    // Variables para paginación del cerebro
    let brainCurrentPage = 0;
    let brainCurrentCategoria = 'todos';
    
    // Función para cargar logs con filtro
    window.loadBrainLogsByCategory = async function(categoria) {
      brainCurrentCategoria = categoria;
      brainCurrentPage = 0;
      
      // Actualizar tabs activos
      document.querySelectorAll('.brain-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.categoria === categoria);
      });
      
      await loadBrainLogs();
    };
    
    // Función para cargar logs con paginación
    window.loadBrainLogs = async function(direction) {
      if (direction === 'next') brainCurrentPage++;
      else if (direction === 'prev' && brainCurrentPage > 0) brainCurrentPage--;
      
      const offset = brainCurrentPage * 100;
      const categoriaParam = brainCurrentCategoria !== 'todos' ? `&categoria=${brainCurrentCategoria}` : '';
      
      try {
        const response = await fetch(`/api/config/escuela/${datosUsuarioActual.id_escuela}/logs?limit=100&offset=${offset}${categoriaParam}`);
        if (!response.ok) throw new Error('Error al cargar logs');
        
        const logs = await response.json();
        
        // Función para obtener color de acción
        const getActionColor = (accion) => {
          if (accion.toLowerCase().includes('recogida')) return '#A8E6CF';
          if (accion.toLowerCase().includes('sesión') || accion.toLowerCase().includes('acceso')) return '#FFB347';
          if (accion.toLowerCase().includes('mensaje')) return '#FF6B35';
          if (accion.toLowerCase().includes('usuario')) return '#F39C12';
          if (accion.toLowerCase().includes('config')) return '#9B59B6';
          return '#4ECDC4';
        };
        
        // Actualizar tabla (desktop)
        const tbody = document.getElementById('brainLogsBody');
        if (tbody) {
          if (logs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="brain-empty-cell">No hay registros en esta categoría</td></tr>`;
          } else {
            tbody.innerHTML = logs.map(log => {
              const fecha = new Date(log.fecha_accion);
              const fechaStr = fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' });
              const horaStr = fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
              const actionColor = getActionColor(log.accion);
              
              let detallesStr = '';
              if (log.detalles) {
                try {
                  const detalles = typeof log.detalles === 'string' ? JSON.parse(log.detalles) : log.detalles;
                  detallesStr = Object.entries(detalles).map(([k, v]) => `${k}: ${v}`).join(', ');
                } catch { detallesStr = log.detalles; }
              }
              
              return `
                <tr class="brain-log-row">
                  <td class="brain-cell-fecha">
                    <div class="brain-fecha">${fechaStr}</div>
                    <div class="brain-hora">${horaStr}</div>
                  </td>
                  <td class="brain-cell-usuario">
                    <div class="brain-usuario-nombre">${log.usuario_nombre || 'Sistema'}</div>
                    <div class="brain-usuario-rol">${log.usuario_rol || '-'}</div>
                  </td>
                  <td class="brain-cell-accion">
                    <span class="brain-action-badge" style="background: ${actionColor}20; color: ${actionColor}; border: 1px solid ${actionColor}40;">
                      ${log.accion}
                    </span>
                  </td>
                  <td class="brain-cell-tabla">${log.tabla_afectada || '-'}</td>
                  <td class="brain-cell-detalles">${detallesStr || '-'}</td>
                </tr>
              `;
            }).join('');
          }
        }
        
        // Actualizar cards (móvil)
        const cardsContainer = document.getElementById('brainLogsCards');
        if (cardsContainer) {
          if (logs.length === 0) {
            cardsContainer.innerHTML = `<div class="brain-empty-message">No hay registros en esta categoría</div>`;
          } else {
            cardsContainer.innerHTML = logs.map(log => {
              const fecha = new Date(log.fecha_accion);
              const fechaStr = fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' });
              const horaStr = fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
              const actionColor = getActionColor(log.accion);
              
              let detallesStr = '';
              if (log.detalles) {
                try {
                  const detalles = typeof log.detalles === 'string' ? JSON.parse(log.detalles) : log.detalles;
                  detallesStr = Object.entries(detalles).map(([k, v]) => `${k}: ${v}`).join(', ');
                } catch { detallesStr = log.detalles; }
              }
              
              return `
                <div class="brain-log-card" style="--card-color: ${actionColor};">
                  <div class="brain-log-card-header">
                    <div class="brain-log-card-fecha">
                      <span class="fecha">${fechaStr}</span>
                      <span class="hora">${horaStr}</span>
                    </div>
                    <div class="brain-log-card-usuario">
                      <div class="nombre">${log.usuario_nombre || 'Sistema'}</div>
                      <div class="rol">${log.usuario_rol || '-'}</div>
                    </div>
                  </div>
                  <span class="brain-log-card-action" style="background: ${actionColor}20; color: ${actionColor}; border: 1px solid ${actionColor}40;">
                    ${log.accion}
                  </span>
                  <div class="brain-log-card-details">
                    ${log.tabla_afectada ? `<div class="tabla"><strong>Tabla:</strong> ${log.tabla_afectada}</div>` : ''}
                    ${detallesStr ? `<div class="detalles">${detallesStr}</div>` : ''}
                  </div>
                </div>
              `;
            }).join('');
          }
        }
        
        // Actualizar paginación
        document.getElementById('brainPrevBtn').disabled = brainCurrentPage === 0;
        document.getElementById('brainNextBtn').disabled = logs.length < 100;
        document.getElementById('brainPageInfo').textContent = `${logs.length} registros`;
        
      } catch (error) {
        console.error('Error cargando logs:', error);
        showNotification('Error al cargar logs', 'error');
      }
    };
    
    // Función para refrescar los logs
    window.refreshBrainLogs = async function() {
      brainCurrentPage = 0;
      await loadBrainLogs();
      showNotification('Logs actualizados', 'success');
    };
    
    // Función para limpiar logs antiguos
    window.clearOldLogs = async function() {
      if (!confirm('¿Estás seguro de eliminar los logs con más de 30 días de antigüedad?')) return;
      
      try {
        const response = await fetch(`/api/config/escuela/${datosUsuarioActual.id_escuela}/logs`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dias_antiguedad: 30 })
        });
        
        if (!response.ok) throw new Error('Error al limpiar logs');
        
        const result = await response.json();
        showNotification(`Se eliminaron ${result.registros_eliminados} registros antiguos`, 'success');
        
        // Recargar la vista
        await loadBrainLogs();
      } catch (error) {
        console.error('Error limpiando logs:', error);
        showNotification('Error al limpiar logs', 'error');
      }
    };
    
    // Inicializar eventos de tabs cuando se renderiza el cerebro
    document.addEventListener('click', function(e) {
      if (e.target.closest('.brain-tab')) {
        const tab = e.target.closest('.brain-tab');
        const categoria = tab.dataset.categoria;
        if (categoria) {
          loadBrainLogsByCategory(categoria);
        }
      }
    });

    window.renderProfileScreen = async function() {
      const isTeacher = currentRole === 'maestro' || currentRole === 'director' || currentRole === 'admin';
      
      let schoolDataSection = '';
      if (currentRole === 'admin') {
        // Cargar datos de la escuela inmediatamente
        let schoolFormContent = '';
        try {
          console.log('🔍 Cargando datos de escuela ID:', datosUsuarioActual.id_escuela);
          const response = await fetch(`/api/escuelas/${datosUsuarioActual.id_escuela}`);
          
          if (response.ok) {
            const escuela = await response.json();
            console.log('🏫 Datos de escuela obtenidos:', escuela);
            
            schoolFormContent = `
              <div class="form-group">
                <label class="form-label">Nombre de la Escuela</label>
                <input type="text" class="form-input" id="schoolName" value="${escuela.nombre_escuela || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Dirección</label>
                <input type="text" class="form-input" id="schoolAddress" value="${escuela.direccion || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input type="text" class="form-input" id="schoolPhone" value="${escuela.telefono || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Código Postal</label>
                <input type="text" class="form-input" id="schoolPostalCode" value="${escuela.codigo_postal || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Sitio Web</label>
                <input type="text" class="form-input" id="schoolWebsite" value="${escuela.sitio_web || ''}">
              </div>
            `;
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (error) {
          console.error('❌ Error al cargar datos de la escuela:', error);
          schoolFormContent = `
            <div style="text-align: center; color: #ff6b6b; padding: 20px;">
              <i class="fas fa-exclamation-triangle" style="font-size: 24px; margin-bottom: 10px;"></i>
              <p>Error al cargar los datos de la escuela</p>
              <small style="display: block; margin-top: 10px; color: #999;">${error.message}</small>
            </div>
          `;
        }

        schoolDataSection = `
          <div class="profile-form" id="schoolDataForm">
            <div class="config-title">Datos de la Escuela</div>
            ${schoolFormContent}
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

      // Obtener datos reales del usuario desde datosUsuarioActual
      const nombre = (datosUsuarioActual && datosUsuarioActual.nombre_completo) ? datosUsuarioActual.nombre_completo : 'Usuario';
      const emailValue = (datosUsuarioActual && datosUsuarioActual.email) ? datosUsuarioActual.email : '';
      const rolValue = (datosUsuarioActual && datosUsuarioActual.rol) ? datosUsuarioActual.rol : '';
      const asignacionValue = (datosUsuarioActual && datosUsuarioActual.asignacion) ? datosUsuarioActual.asignacion : 'N/A';
      const fotoValue = (datosUsuarioActual && datosUsuarioActual.foto_perfil) ? datosUsuarioActual.foto_perfil : null;
      
      // Generar HTML para la foto (si existe, mostrar imagen; si no, mostrar emoji del userData)
      const user = userData[currentRole];
      const photoHTML = fotoValue 
        ? `<img src="${fotoValue}" alt="Foto de perfil" class="profile-photo-image">`
        : `<div class="profile-photo-emoji">${user.emoji}</div>`;

      return `
        <div class="profile-screen">
          <div class="profile-photo-section">
            <div class="profile-photo-large" id="profilePhotoContainer" onclick="changeProfilePhoto()">${photoHTML}</div>
            <div style="color: #FFB347; font-weight: bold;">Toca para cambiar foto</div>
            <input type="file" id="photoFileInput" accept="image/*" style="display: none;">
          </div>
          
          <div class="profile-form">
            <div class="config-title">Información Personal</div>
            <div class="form-group">
              <label class="form-label">Nombre Completo</label>
              <input type="text" class="form-input" id="profileName" value="${nombre}" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">Rol</label>
              <input type="text" class="form-input" id="profileRole" value="${rolValue}" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">Asignación</label>
              <input type="text" class="form-input" id="profileAssignment" value="${asignacionValue}" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">Correo Electrónico</label>
              <input type="email" class="form-input" id="profileEmail" value="${emailValue}">
            </div>
            <div class="form-group">
              <label class="form-label">Contraseña Actual</label>
              <input type="password" class="form-input" id="profileCurrentPassword" placeholder="Ingresa tu contraseña actual para cambiar">
            </div>
            <div class="form-group">
              <label class="form-label">Nueva Contraseña</label>
              <input type="password" class="form-input" id="profileNewPassword" placeholder="Dejar vacío para mantener actual">
            </div>
          </div>

          ${schoolDataSection}
          ${permissionsSection}

          <button class="save-button" onclick="saveProfileChanges()">
            <i class="fas fa-save"></i> Guardar Cambios
          </button>
        </div>
      `;
    }



    // Helper function to escape strings for onclick attributes
    function escapeForOnClick(str) {
      if (!str || str === 'null' || str === null || str === undefined) return 'null';
      return `'${String(str).replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`;
    }

    async function renderNotificationsScreen() {
      let notifications = [];
      let historial = [];
      
      // Cargar solicitudes de recogida pendientes para maestros
      if (currentRole === 'maestro' && idUsuarioActual) {
        try {
          const response = await fetch(`/api/recogidas/maestro/${idUsuarioActual}`);
          if (response.ok) {
            const solicitudes = await response.json();
            notifications = solicitudes.map(sol => {
              const time = new Date(sol.fecha_solicitud).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
              let content = `${sol.nombre_padre} solicita recoger a ${sol.nombre_hijo}`;
              if (sol.nombre_grupo) content += ` (${sol.nombre_grupo})`;
              
              // Si hay persona alternativa para recoger
              let alertaAlternativa = '';
              if (sol.persona_recoge) {
                alertaAlternativa = `<div class="notification-alert"><i class="fas fa-user-friends"></i> <strong>Persona alternativa:</strong> ${sol.persona_recoge}`;
                if (sol.parentesco_recoge) alertaAlternativa += ` (${sol.parentesco_recoge})`;
                alertaAlternativa += `</div>`;
              }
              
              return {
                id: sol.id_solicitud,
                type: 'pickup',
                time: time,
                content: content,
                alertaAlternativa: alertaAlternativa,
                observaciones: sol.observaciones,
                student: sol.nombre_hijo,
                parent: sol.nombre_padre,
                foto_hijo: sol.foto_hijo,
                persona_recoge: sol.persona_recoge || null,
                parentesco_recoge: sol.parentesco_recoge || null
              };
            });
          }
        } catch (error) {
          console.error('Error al cargar notificaciones:', error);
        }

        // Cargar historial del día (aprobados/rechazados)
        try {
          const response = await fetch(`/api/recogidas/historial/${idUsuarioActual}`);
          if (response.ok) {
            historial = await response.json();
          }
        } catch (error) {
          console.error('Error al cargar historial:', error);
        }
      }

      const notificationItems = notifications.length > 0 
        ? notifications.map(notif => `
          <div class="notification-item" data-id="${notif.id}">
            <div class="notification-header">
              <strong>🚗 Solicitud de Recogida</strong>
              <span class="notification-time">${notif.time}</span>
            </div>
            <div class="notification-content">
              ${notif.foto_hijo ? `<img src="${notif.foto_hijo}" alt="${notif.student}" class="notification-student-photo">` : ''}
              <div>${notif.content}</div>
            </div>
            ${notif.alertaAlternativa}
            ${notif.observaciones ? `<div class="notification-observaciones"><i class="fas fa-sticky-note"></i> ${notif.observaciones}</div>` : ''}
            <div class="notification-actions">
              <button class="notification-btn btn-announce" onclick="playPickupAnnouncement(${escapeForOnClick(notif.student)}, ${notif.id})">
                <i class="fas fa-volume-up"></i> Reproducir Aviso
              </button>
              <button class="notification-btn btn-approve" onclick="approvePickup(${notif.id}, ${escapeForOnClick(notif.student)}, ${escapeForOnClick(notif.parent)}, ${notif.foto_hijo ? escapeForOnClick(notif.foto_hijo) : 'null'}, ${notif.persona_recoge ? escapeForOnClick(notif.persona_recoge) : 'null'}, ${notif.parentesco_recoge ? escapeForOnClick(notif.parentesco_recoge) : 'null'})">
                <i class="fas fa-check"></i> Aprobar
              </button>
              <button class="notification-btn btn-reject" onclick="rejectPickup(${notif.id})">
                <i class="fas fa-times"></i> Rechazar
              </button>
            </div>
          </div>
        `).join('')
        : '<div class="no-notifications"><i class="fas fa-inbox"></i><p>No hay notificaciones pendientes</p></div>';

      // Renderizar historial del día
      const historialItems = historial.length > 0
        ? historial.map(reg => {
            const time = new Date(reg.fecha_solicitud).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            const estadoIcon = reg.estado === 'aprobada' ? '✅' : '❌';
            const estadoText = reg.estado === 'aprobada' ? 'Aprobada' : 'Rechazada';
            const estadoClass = reg.estado === 'aprobada' ? 'historial-aprobada' : 'historial-rechazada';
            
            let detalles = `${reg.nombre_padre} solicitó recoger a ${reg.nombre_hijo}`;
            if (reg.nombre_grupo) detalles += ` (${reg.nombre_grupo})`;
            
            let personaRecoge = '';
            if (reg.persona_recoge) {
              personaRecoge = `<div class="historial-persona"><i class="fas fa-user"></i> Recogió: <strong>${reg.persona_recoge}</strong>`;
              if (reg.parentesco_recoge) personaRecoge += ` (${reg.parentesco_recoge})`;
              personaRecoge += `</div>`;
            }

            return `
              <div class="historial-item ${estadoClass}">
                <div class="historial-header">
                  <span class="historial-estado">${estadoIcon} ${estadoText}</span>
                  <span class="historial-time">${time}</span>
                </div>
                <div class="historial-content">
                  ${reg.foto_hijo ? `<img src="${reg.foto_hijo}" alt="${reg.nombre_hijo}" class="historial-photo">` : ''}
                  <div class="historial-detalles">${detalles}</div>
                </div>
                ${personaRecoge}
                ${reg.nombre_aprobador ? `<div class="historial-aprobador"><i class="fas fa-user-check"></i> ${reg.nombre_aprobador}</div>` : ''}
              </div>
            `;
          }).join('')
        : '<div class="no-historial"><i class="fas fa-history"></i><p>No hay registros del día</p></div>';

      return `
        <div class="notifications-container">
          <div class="screen-title">Notificaciones de Recogida</div>
          ${notificationItems}
          
          <div class="historial-separator">
            <div class="historial-title"><i class="fas fa-history"></i> Historial del Día</div>
          </div>
          <div class="historial-container">
            ${historialItems}
          </div>
        </div>
      `;
    }

    async function renderAnimatedTreeScreen() {
      const user = userData[currentRole];
      let children = [];
      
      if (currentRole === 'padre') {
        // Cargar hijos reales desde la BD
        if (idUsuarioActual) {
          try {
            const response = await fetch(`/api/usuarios/${idUsuarioActual}/hijos`);
            if (response.ok) {
              const hijosData = await response.json();
              children = hijosData.map(hijo => ({
                id: hijo.id_usuario,
                name: hijo.nombre_completo,
                emoji: hijo.foto_perfil ? null : '👦', // Usar emoji solo si no hay foto
                foto_perfil: hijo.foto_perfil,
                group: hijo.nombre_grupo || 'Sin grupo',
                icon: 'fas fa-child'
              }));
            } else {
              console.error('Error al cargar hijos');
              children = [];
            }
          } catch (error) {
            console.error('Error al obtener hijos:', error);
            children = [];
          }
        }
      } else if (currentRole === 'alumno') {
        // Cargar padres reales desde la BD
        if (idUsuarioActual) {
          try {
            const response = await fetch(`/api/usuarios/${idUsuarioActual}/padres`);
            if (response.ok) {
              const padresData = await response.json();
              children = padresData.map(padre => ({
                id: padre.id_usuario,
                name: padre.nombre_completo,
                emoji: padre.foto_perfil ? null : '👨‍👩‍👦',
                foto_perfil: padre.foto_perfil,
                group: padre.parentesco || 'Tutor',
                icon: 'fas fa-user'
              }));
            } else {
              console.error('Error al cargar padres');
              children = [];
            }
          } catch (error) {
            console.error('Error al obtener padres:', error);
            children = [];
          }
        }
      }

      const childNodes = children.map((child, index) => {
        let options = [];
        if (currentRole === 'padre') {
          options = [
            {action: 'alert', icon: 'fas fa-exclamation-triangle', label: 'Alerta'},
            {action: 'edit', icon: 'fas fa-edit', label: 'Editar'},
            {action: 'message', icon: 'fas fa-comment', label: 'Mensaje'},
            {action: 'aviso', icon: 'fas fa-bell', label: 'Aviso'}
          ];
        } else if (currentRole === 'alumno') {
          options = [
            {action: 'message', icon: 'fas fa-comment', label: 'Mensaje'},
            {action: 'permission', icon: 'fas fa-door-open', label: 'Permiso'}
          ];
        }
        
        // Generar el contenido del nodo (foto o emoji)
        const nodeContent = child.foto_perfil 
          ? `<img src="${child.foto_perfil}" alt="${child.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
          : child.emoji;
        
        // Crear objeto completo del hijo con toda la info necesaria
        const childData = {
          id: child.id,
          name: child.name,
          emoji: child.emoji || '👦',
          icon: child.icon,
          foto_perfil: child.foto_perfil || null,
          group: child.group
        };
        
        return `
          <div class="tree-node tree-leaf" onclick='showBubbleOptions(${JSON.stringify(childData)}, ${JSON.stringify(options)})' style="animation-delay: ${index * 0.3}s;">
            ${nodeContent}
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

    async function renderStaffDirectoryScreen() {
      let staff = [];
      
      try {
        // Cargar maestros y admins desde la BD
        const response = await fetch('/api/usuarios/staff/directorio');
        if (response.ok) {
          staff = await response.json();
        }
      } catch (error) {
        console.error('Error cargando directorio:', error);
      }

      if (staff.length === 0) {
        return `
          <div class="list-screen">
            <div class="list-title">Directorio de Personal</div>
            <div style="text-align: center; padding: 40px; color: #999;">
              <i class="fas fa-users" style="font-size: 50px; color: #ddd; margin-bottom: 15px;"></i>
              <p>No hay personal registrado</p>
            </div>
          </div>
        `;
      }

      const staffItems = staff.map(person => {
        const photoHTML = person.foto_perfil 
          ? `<img src="${person.foto_perfil}" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover;">`
          : `<i class="fas ${person.rol === 'admin' ? 'fa-user-shield' : 'fa-chalkboard-teacher'}" style="font-size: 24px; color: ${person.rol === 'admin' ? '#9b59b6' : '#3498db'};"></i>`;
        
        const rolLabel = person.rol === 'admin' ? 'Administrador' : 'Maestro(a)';
        const asignacion = person.asignacion || rolLabel;
        
        return `
          <div class="list-item" onclick="openChatById(${person.id_usuario}, '${person.nombre_completo.replace(/'/g, "\\'")}')">
            <div class="list-item-icon" style="background: ${person.rol === 'admin' ? 'linear-gradient(135deg, #9b59b6, #8e44ad)' : 'linear-gradient(135deg, #3498db, #2980b9)'};">
              ${photoHTML}
            </div>
            <div class="list-item-text">
              ${person.nombre_completo}
              <br><small style="color: #999;">${asignacion}</small>
            </div>
            <i class="fas fa-comment" style="color: #FFB347;"></i>
          </div>
        `;
      }).join('');

      return `
        <div class="list-screen">
          <div class="list-title">Directorio de Personal</div>
          ${staffItems}
        </div>
      `;
    }

    async function renderPickupScreen() {
      let children = [];
      let personasConfianza = [];
      let solicitudesPendientes = {};
      
      // Si es padre, cargar hijos reales desde la BD
      if (currentRole === 'padre' && idUsuarioActual) {
        try {
          const response = await fetch(`/api/usuarios/${idUsuarioActual}/hijos`);
          if (response.ok) {
            const data = await response.json();
            children = data.map(hijo => ({
              id: hijo.id_usuario,
              name: hijo.nombre_completo,
              emoji: hijo.emoji || '👦',
              foto_perfil: hijo.foto_perfil,
              group: hijo.grupo || 'N/A'
            }));

            // Cargar solicitudes pendientes para cada hijo
            for (const child of children) {
              try {
                const solResponse = await fetch(`/api/recogidas/hijo/${child.id}`);
                if (solResponse.ok) {
                  const solicitudes = await solResponse.json();
                  const pendiente = solicitudes.find(s => s.estado === 'pendiente');
                  if (pendiente) solicitudesPendientes[child.id] = pendiente;
                }
              } catch (e) {
                console.error('Error cargando solicitud:', e);
              }
            }
          }

          // Cargar personas de confianza
          const pcResponse = await fetch(`/api/personas-confianza/${idUsuarioActual}`);
          if (pcResponse.ok) {
            personasConfianza = await pcResponse.json();
          }
        } catch (error) {
          console.error('Error cargando datos:', error);
        }
      }

      const pickupButtons = children.map(child => {
        const childData = JSON.stringify(child).replace(/"/g, '&quot;');
        const photoHTML = child.foto_perfil 
          ? `<img src="${child.foto_perfil}" alt="${child.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
          : child.emoji;
        
        const solicitud = solicitudesPendientes[child.id];
        let estadoBadge = '';
        if (solicitud) {
          const estadoClass = solicitud.estado === 'pendiente' ? 'badge-pendiente' : 
                             solicitud.estado === 'aprobada' ? 'badge-aprobada' : 'badge-rechazada';
          const estadoText = solicitud.estado === 'pendiente' ? '⏳ Pendiente' :
                            solicitud.estado === 'aprobada' ? '✅ Aprobada' : '❌ Rechazada';
          estadoBadge = `<div class="status-badge ${estadoClass}">${estadoText}</div>`;
          
          if (solicitud.persona_recoge) {
            estadoBadge += `<div class="persona-badge">👤 ${solicitud.persona_recoge}</div>`;
          }
        }
        
        return `
          <div class="pickup-child-card">
            <button class="pickup-button" onclick='handlePickupAlert(${childData})'>
              <div class="pickup-photo">${photoHTML}</div>
              <div class="pickup-name">${child.name}</div>
              <div style="font-size: 12px; color: rgba(255,255,255,0.8);">Grupo ${child.group}</div>
            </button>
            ${estadoBadge}
            
            <div class="quick-person-selector">
              <div class="quick-selector-title">¿Quién recoge?</div>
              <div class="quick-options">
                <button class="quick-btn ${!solicitud || !solicitud.persona_recoge ? 'active' : ''}" 
                        onclick="setQuickPerson(${child.id}, 'yo', '${child.name}')">
                  <i class="fas fa-user"></i> Yo
                </button>
                ${personasConfianza.map(p => `
                  <button class="quick-btn ${solicitud && solicitud.persona_recoge === p.nombre_completo ? 'active' : ''}" 
                          onclick="setQuickPerson(${child.id}, ${p.id_persona}, '${child.name}', '${p.nombre_completo}', '${p.parentesco || ''}')">
                    ${p.predeterminada ? '⭐' : '👤'} ${p.nombre_completo}
                  </button>
                `).join('')}
              </div>
              <button class="btn-add-person" onclick="openAddPersonModal()">
                <i class="fas fa-plus"></i> Agregar persona
              </button>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="pickup-container">
          <div class="screen-title">Solicitar Recogida</div>
          <div style="margin-bottom: 20px; color: #666; text-align: center;">
            Presiona el botón naranja para notificar llegada, selecciona quién recoge
          </div>
          <div class="pickup-grid">
            ${pickupButtons}
          </div>
        </div>
      `;
    }

    async function renderMessagesScreen() {
      let chatItems = '';
      
      if (idUsuarioActual) {
        try {
          // Cargar conversaciones reales desde la BD
          const response = await fetch(`/api/mensajes/conversaciones/${idUsuarioActual}`);
          if (response.ok) {
            const conversaciones = await response.json();
            
            if (conversaciones.length > 0) {
              chatItems = conversaciones.map(chat => {
                const photoHTML = chat.foto_contacto 
                  ? `<img src="${chat.foto_contacto}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">`
                  : '👤';
                
                const timeAgo = formatTimeAgo(new Date(chat.ultima_fecha));
                
                return `
                  <div class="chat-item" onclick="openChatById(${chat.id_contacto}, '${chat.nombre_contacto.replace(/'/g, "\\'")}')">
                    <div class="chat-avatar">${photoHTML}</div>
                    <div class="chat-info">
                      <div class="chat-name">${chat.nombre_contacto}</div>
                      <div class="chat-preview">${chat.ultimo_mensaje || 'Sin mensajes'}</div>
                    </div>
                    <div class="chat-time">
                      ${timeAgo}
                      ${chat.no_leidos > 0 ? `<span class="unread-badge">${chat.no_leidos}</span>` : ''}
                    </div>
                  </div>
                `;
              }).join('');
            } else {
              chatItems = '<div style="text-align: center; padding: 40px; color: #999;">No tienes conversaciones aún</div>';
            }
          }
        } catch (error) {
          console.error('Error cargando conversaciones:', error);
          chatItems = '<div style="text-align: center; padding: 40px; color: #ff6b6b;">Error al cargar mensajes</div>';
        }
      }

      return `
        <div class="chat-list">
          <div class="screen-title">Mensajes</div>
          ${chatItems}
        </div>
      `;
    }

    function formatTimeAgo(date) {
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      
      if (minutes < 1) return 'Ahora';
      if (minutes < 60) return `${minutes}m`;
      if (hours < 24) return `${hours}h`;
      if (days === 1) return 'Ayer';
      if (days < 7) return `${days}d`;
      return date.toLocaleDateString();
    }

    function renderConfigPanel() {
      const isAdmin = currentRole === 'admin';
      
      if (!isAdmin) {
        // Panel básico para otros roles
        return `
          <div class="config-panel">
            <div class="screen-title">Panel de Configuración</div>
            
            <div class="config-section">
              <div class="config-title">Notificaciones</div>
              <div class="config-option">
                <span>Alertas de recogida</span>
                <div class="config-toggle active" data-config="alertas_recogida" onclick="toggleConfig(this)"></div>
              </div>
              <div class="config-option">
                <span>Mensajes automáticos</span>
                <div class="config-toggle" data-config="mensajes_automaticos" onclick="toggleConfig(this)"></div>
              </div>
              <div class="config-option">
                <span>Recordatorios de tareas</span>
                <div class="config-toggle active" data-config="recordatorios_tareas" onclick="toggleConfig(this)"></div>
              </div>
            </div>

            <button class="save-button" id="saveConfigBtn" disabled onclick="saveConfiguration()">
              <i class="fas fa-save"></i> Guardar Configuración
            </button>
          </div>
        `;
      }
      
      // Panel simplificado para ADMIN
      return `
        <div class="config-panel admin-config">
          <div class="screen-title">
            <i class="fas fa-cogs"></i> Panel de Configuración
          </div>
          
          <!-- Imagen de la Escuela -->
          <div class="config-section">
            <div class="config-title">
              <i class="fas fa-image"></i> Imagen de la Escuela
            </div>
            <div class="school-logo-container" style="text-align: center; padding: 20px;">
              <div id="schoolLogoPreview" style="width: 150px; height: 150px; margin: 0 auto 15px; border-radius: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; overflow: hidden; border: 3px solid rgba(255,255,255,0.3);">
                <i class="fas fa-school" style="font-size: 60px; color: rgba(255,255,255,0.7);"></i>
              </div>
              <input type="file" id="schoolLogoInput" accept="image/*" style="display: none;" onchange="previewSchoolLogo(this)">
              <button class="btn-secondary" onclick="document.getElementById('schoolLogoInput').click()" style="padding: 10px 20px;">
                <i class="fas fa-upload"></i> Cargar Logo
              </button>
              <button class="btn-secondary" onclick="removeSchoolLogo()" style="padding: 10px 20px; margin-left: 10px; background: rgba(255,107,107,0.2);">
                <i class="fas fa-trash"></i> Quitar
              </button>
            </div>
          </div>

          <!-- Registro de Logs -->
          <div class="config-section">
            <div class="config-title">
              <i class="fas fa-clipboard-list"></i> Registro de Actividad
            </div>
            <div class="config-option">
              <span>
                <i class="fas fa-history" style="margin-right: 8px; color: #667eea;"></i>
                Registrar logs de actividad
              </span>
              <div class="config-toggle active" data-config="registrar_logs" onclick="toggleConfig(this)"></div>
            </div>
            <button class="btn-secondary" onclick="viewActivityLogs()" style="margin-top: 10px; width: 100%;">
              <i class="fas fa-eye"></i> Ver Historial de Logs
            </button>
          </div>

          <!-- Mensajería -->
          <div class="config-section">
            <div class="config-title">
              <i class="fas fa-comments"></i> Sistema de Mensajería
            </div>
            <div class="config-option">
              <span>
                <i class="fas fa-toggle-on" style="margin-right: 8px; color: #4CAF50;"></i>
                Activar sistema de mensajes
              </span>
              <div class="config-toggle active" data-config="mensajes_habilitados" onclick="toggleConfig(this)"></div>
            </div>
          </div>

          <!-- Notificaciones del Maestro -->
          <div class="config-section">
            <div class="config-title">
              <i class="fas fa-bell"></i> Notificaciones del Maestro
            </div>
            <div class="config-option">
              <span>
                <i class="fas fa-volume-up" style="margin-right: 8px; color: #E91E63;"></i>
                Mostrar botón de reproducir sonido
              </span>
              <div class="config-toggle active" data-config="mostrar_boton_sonido" onclick="toggleConfig(this)"></div>
            </div>
          </div>

          <!-- Sistema -->
          <div class="config-section">
            <div class="config-title">
              <i class="fas fa-server"></i> Sistema
            </div>
            <div class="config-option">
              <span>
                <i class="fas fa-hard-hat" style="margin-right: 8px; color: #FF5722;"></i>
                Modo mantenimiento
              </span>
              <div class="config-toggle" data-config="modo_mantenimiento" onclick="toggleConfig(this)"></div>
            </div>
            <div class="config-option">
              <span>
                <i class="fas fa-database" style="margin-right: 8px; color: #4CAF50;"></i>
                Backup automático
              </span>
              <div class="config-toggle active" data-config="backup_automatico" onclick="toggleConfig(this)"></div>
            </div>
            <div class="config-option">
              <span>
                <i class="fas fa-chalkboard-teacher" style="margin-right: 8px; color: #2196F3;"></i>
                Permitir a maestros registrar usuarios
              </span>
              <div class="config-toggle active" data-config="maestros_registrar_usuarios" onclick="toggleConfig(this)"></div>
            </div>
          </div>

          <button class="save-button" id="saveConfigBtn" onclick="saveConfiguration()">
            <i class="fas fa-save"></i> Guardar Configuración
          </button>
          
          <div style="text-align: center; margin-top: 15px; opacity: 0.7;">
            <small><i class="fas fa-info-circle"></i> Los cambios se aplicarán inmediatamente después de guardar</small>
          </div>
        </div>
      `;
    }

    // Variables globales para tickets
    let ticketsData = [];
    let ticketsArchivados = [];
    let ticketsFiltroActual = 'all';

    async function renderConsultasScreen() {
      // Cargar datos reales del servidor
      let stats = { total: 0, abiertos: 0, en_proceso: 0, respondidos: 0, archivados: 0 };
      
      try {
        const [ticketsRes, statsRes, archivadosRes] = await Promise.all([
          fetch(`/api/consultas/escuela/${datosUsuarioActual.id_escuela}?archivados=false`),
          fetch(`/api/consultas/escuela/${datosUsuarioActual.id_escuela}/stats`),
          fetch(`/api/consultas/escuela/${datosUsuarioActual.id_escuela}?archivados=true`)
        ]);
        
        if (ticketsRes.ok) ticketsData = await ticketsRes.json();
        if (statsRes.ok) stats = await statsRes.json();
        if (archivadosRes.ok) ticketsArchivados = await archivadosRes.json();
      } catch (error) {
        console.error('Error cargando tickets:', error);
      }

      // Emoji basado en rol
      const getEmoji = (rol) => {
        const emojis = {
          'admin': '👔',
          'maestro': '👨‍🏫',
          'padre': '👨',
          'alumno': '👦'
        };
        return emojis[rol] || '👤';
      };

      // Formatear fecha
      const formatDate = (fecha) => {
        const date = new Date(fecha);
        const hoy = new Date();
        const ayer = new Date(hoy);
        ayer.setDate(ayer.getDate() - 1);
        
        if (date.toDateString() === hoy.toDateString()) return 'Hoy';
        if (date.toDateString() === ayer.toDateString()) return 'Ayer';
        return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' });
      };

      const formatTime = (fecha) => {
        return new Date(fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
      };

      // Generar HTML de tickets
      const generateTicketHTML = (tickets) => {
        if (!tickets || tickets.length === 0) {
          return `<div class="no-tickets">
            <i class="fas fa-inbox"></i>
            <p>No hay tickets para mostrar</p>
          </div>`;
        }

        return tickets.map(ticket => `
          <div class="ticket-item" data-priority="${ticket.prioridad}" data-status="${ticket.estado}" data-id="${ticket.id_ticket}">
            <div class="ticket-header">
              <div class="ticket-user">
                <span class="ticket-emoji">${getEmoji(ticket.usuario_rol)}</span>
                <div>
                  <span class="ticket-name">${ticket.usuario_nombre || 'Usuario'}</span>
                  <div class="ticket-category">${ticket.categoria || 'General'}</div>
                </div>
              </div>
              <div class="ticket-meta">
                <span class="ticket-date">${formatDate(ticket.fecha_creacion)}</span>
                <span class="ticket-time">${formatTime(ticket.fecha_creacion)}</span>
                <span class="ticket-priority priority-${ticket.prioridad}">${(ticket.prioridad || 'media').toUpperCase()}</span>
                <span class="ticket-status status-${ticket.estado}">${(ticket.estado || 'abierto').replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>
            <div class="ticket-subject">${ticket.asunto}</div>
            <div class="ticket-content">${ticket.contenido}</div>
            ${ticket.num_respuestas > 0 ? `<div class="ticket-responses"><i class="fas fa-comments"></i> ${ticket.num_respuestas} respuesta(s)</div>` : ''}
            <div class="ticket-actions">
              <button class="ticket-btn btn-respond" onclick="openTicketModal(${ticket.id_ticket})">
                <i class="fas fa-eye"></i> Ver / Responder
              </button>
              <button class="ticket-btn btn-archive" onclick="archiveTicket(${ticket.id_ticket})">
                <i class="fas fa-archive"></i> Archivar
              </button>
              <button class="ticket-btn btn-delete" onclick="deleteTicket(${ticket.id_ticket})">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </div>
          </div>
        `).join('');
      };

      const ticketItems = generateTicketHTML(ticketsData);

      return `
        <div class="consultas-container">
          <div class="consultas-header">
            <div class="screen-title">
              <i class="fas fa-ticket-alt"></i> Gestión de Consultas
            </div>
            <div class="consultas-actions">
              <button class="action-btn" onclick="showArchivedTickets()">
                <i class="fas fa-archive"></i> Archivados (${stats.archivados || 0})
              </button>
              <button class="action-btn" onclick="exportTickets()">
                <i class="fas fa-download"></i> Exportar CSV
              </button>
            </div>
          </div>
          
          <div class="tickets-stats">
            <div class="stat-item stat-open">
              <div class="stat-number">${stats.abiertos || 0}</div>
              <div class="stat-label">Abiertos</div>
            </div>
            <div class="stat-item stat-process">
              <div class="stat-number">${stats.en_proceso || 0}</div>
              <div class="stat-label">En Proceso</div>
            </div>
            <div class="stat-item stat-responded">
              <div class="stat-number">${stats.respondidos || 0}</div>
              <div class="stat-label">Respondidos</div>
            </div>
            <div class="stat-item stat-archived">
              <div class="stat-number">${stats.archivados || 0}</div>
              <div class="stat-label">Archivados</div>
            </div>
          </div>

          <div class="tickets-filters">
            <button class="filter-btn ${ticketsFiltroActual === 'all' ? 'active' : ''}" onclick="filterTickets('all')">Todos</button>
            <button class="filter-btn ${ticketsFiltroActual === 'alta' ? 'active' : ''}" onclick="filterTickets('alta')">Alta Prioridad</button>
            <button class="filter-btn ${ticketsFiltroActual === 'abierto' ? 'active' : ''}" onclick="filterTickets('abierto')">Abiertos</button>
            <button class="filter-btn ${ticketsFiltroActual === 'en_proceso' ? 'active' : ''}" onclick="filterTickets('en_proceso')">En Proceso</button>
          </div>

          <div class="tickets-list" id="ticketsList">
            ${ticketItems}
          </div>
        </div>
      `;
    }

    // Funciones de gestión de tickets
    window.filterTickets = async function(filtro) {
      ticketsFiltroActual = filtro;
      
      // Actualizar botones activos
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      
      // Filtrar tickets localmente
      let filteredTickets = [...ticketsData];
      
      if (filtro === 'alta') {
        filteredTickets = ticketsData.filter(t => t.prioridad === 'alta');
      } else if (filtro !== 'all') {
        filteredTickets = ticketsData.filter(t => t.estado === filtro);
      }
      
      // Actualizar lista
      const container = document.getElementById('ticketsList');
      if (container) {
        if (filteredTickets.length === 0) {
          container.innerHTML = `<div class="no-tickets">
            <i class="fas fa-inbox"></i>
            <p>No hay tickets con este filtro</p>
          </div>`;
        } else {
          // Regenerar HTML
          const getEmoji = (rol) => ({ 'admin': '👔', 'maestro': '👨‍🏫', 'padre': '👨', 'alumno': '👦' }[rol] || '👤');
          const formatDate = (fecha) => {
            const date = new Date(fecha);
            const hoy = new Date();
            if (date.toDateString() === hoy.toDateString()) return 'Hoy';
            const ayer = new Date(hoy); ayer.setDate(ayer.getDate() - 1);
            if (date.toDateString() === ayer.toDateString()) return 'Ayer';
            return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' });
          };
          const formatTime = (fecha) => new Date(fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
          
          container.innerHTML = filteredTickets.map(ticket => `
            <div class="ticket-item" data-priority="${ticket.prioridad}" data-status="${ticket.estado}" data-id="${ticket.id_ticket}">
              <div class="ticket-header">
                <div class="ticket-user">
                  <span class="ticket-emoji">${getEmoji(ticket.usuario_rol)}</span>
                  <div>
                    <span class="ticket-name">${ticket.usuario_nombre || 'Usuario'}</span>
                    <div class="ticket-category">${ticket.categoria || 'General'}</div>
                  </div>
                </div>
                <div class="ticket-meta">
                  <span class="ticket-date">${formatDate(ticket.fecha_creacion)}</span>
                  <span class="ticket-time">${formatTime(ticket.fecha_creacion)}</span>
                  <span class="ticket-priority priority-${ticket.prioridad}">${(ticket.prioridad || 'media').toUpperCase()}</span>
                  <span class="ticket-status status-${ticket.estado}">${(ticket.estado || 'abierto').replace('_', ' ').toUpperCase()}</span>
                </div>
              </div>
              <div class="ticket-subject">${ticket.asunto}</div>
              <div class="ticket-content">${ticket.contenido}</div>
              ${ticket.num_respuestas > 0 ? `<div class="ticket-responses"><i class="fas fa-comments"></i> ${ticket.num_respuestas} respuesta(s)</div>` : ''}
              <div class="ticket-actions">
                <button class="ticket-btn btn-respond" onclick="openTicketModal(${ticket.id_ticket})">
                  <i class="fas fa-eye"></i> Ver / Responder
                </button>
                <button class="ticket-btn btn-archive" onclick="archiveTicket(${ticket.id_ticket})">
                  <i class="fas fa-archive"></i> Archivar
                </button>
                <button class="ticket-btn btn-delete" onclick="deleteTicket(${ticket.id_ticket})">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              </div>
            </div>
          `).join('');
        }
      }
    };

    // Abrir modal de ticket con detalles y opción de responder
    window.openTicketModal = async function(id) {
      try {
        const response = await fetch(`/api/consultas/${id}`);
        if (!response.ok) throw new Error('Error al cargar ticket');
        const ticket = await response.json();
        
        const formatDateTime = (fecha) => new Date(fecha).toLocaleString('es-MX');
        const getEmoji = (rol) => ({ 'admin': '👔', 'maestro': '👨‍🏫', 'padre': '👨', 'alumno': '👦' }[rol] || '👤');
        
        const respuestasHTML = ticket.respuestas && ticket.respuestas.length > 0 
          ? ticket.respuestas.map(r => `
            <div class="respuesta-item">
              <div class="respuesta-header">
                <span class="respuesta-user">${getEmoji(r.usuario_rol)} ${r.usuario_nombre}</span>
                <span class="respuesta-fecha">${formatDateTime(r.fecha_respuesta)}</span>
              </div>
              <div class="respuesta-contenido">${r.contenido}</div>
            </div>
          `).join('')
          : '<p class="no-respuestas">No hay respuestas aún</p>';
        
        showDynamicModal(`
          <div class="ticket-detail-modal">
            <div class="ticket-detail-header">
              <h3>${ticket.asunto}</h3>
              <div class="ticket-badges">
                <span class="ticket-priority priority-${ticket.prioridad}">${ticket.prioridad.toUpperCase()}</span>
                <span class="ticket-status status-${ticket.estado}">${ticket.estado.replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>
            <div class="ticket-detail-info">
              <p><strong>De:</strong> ${getEmoji(ticket.usuario_rol)} ${ticket.usuario_nombre}</p>
              <p><strong>Categoría:</strong> ${ticket.categoria}</p>
              <p><strong>Fecha:</strong> ${formatDateTime(ticket.fecha_creacion)}</p>
            </div>
            <div class="ticket-detail-content">
              <h4>Mensaje:</h4>
              <p>${ticket.contenido}</p>
            </div>
            <div class="ticket-detail-respuestas">
              <h4>Respuestas (${ticket.respuestas?.length || 0}):</h4>
              ${respuestasHTML}
            </div>
            <div class="ticket-reply-section">
              <h4><i class="fas fa-reply"></i> Responder</h4>
              <textarea id="respuestaContenido" placeholder="Escribe tu respuesta aquí..." rows="4"></textarea>
              <p class="reply-note"><i class="fas fa-info-circle"></i> La respuesta se enviará también como mensaje al usuario.</p>
            </div>
            <div class="ticket-detail-actions">
              <button class="btn-primary" onclick="sendTicketResponse(${ticket.id_ticket}, ${ticket.id_usuario})">
                <i class="fas fa-paper-plane"></i> Enviar Respuesta
              </button>
              <button class="btn-secondary" onclick="closeDynamicModal()">Cerrar</button>
            </div>
          </div>
        `);
      } catch (error) {
        console.error(error);
        showToast('Error al cargar el ticket', 'error');
      }
    };

    // Enviar respuesta de ticket y mensaje al usuario
    window.sendTicketResponse = async function(ticketId, userId) {
      const contenido = document.getElementById('respuestaContenido')?.value?.trim();
      if (!contenido) {
        showToast('Escribe una respuesta', 'warning');
        return;
      }
      
      try {
        // 1. Guardar respuesta en el ticket
        const ticketResponse = await fetch(`/api/consultas/${ticketId}/responder`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_usuario: datosUsuarioActual.id_usuario,
            contenido
          })
        });
        
        if (!ticketResponse.ok) throw new Error('Error al responder ticket');
        
        // 2. Enviar mensaje al usuario (no responder)
        const ticket = ticketsData.find(t => t.id_ticket === ticketId);
        await fetch('/api/mensajes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_remitente: datosUsuarioActual.id_usuario,
            id_destinatario: userId,
            contenido: `📋 Respuesta a tu consulta "${ticket?.asunto || 'Ticket #' + ticketId}":\n\n${contenido}`,
            tipo: 'ticket_respuesta',
            puede_responder: false
          })
        });
        
        closeDynamicModal();
        showToast('Respuesta enviada y mensaje notificado al usuario', 'success');
        await showScreen('consultas');
      } catch (error) {
        console.error(error);
        showToast('Error al enviar respuesta', 'error');
      }
    };

    window.archiveTicket = async function(id) {
      if (!confirm('¿Archivar este ticket?')) return;
      
      try {
        const response = await fetch(`/api/consultas/${id}/archivar`, {
          method: 'PUT'
        });
        
        if (response.ok) {
          showToast('Ticket archivado', 'success');
          await showScreen('consultas');
        } else {
          throw new Error('Error');
        }
      } catch (error) {
        showToast('Error al archivar ticket', 'error');
      }
    };

    window.deleteTicket = async function(id) {
      if (!confirm('¿Eliminar este ticket permanentemente?')) return;
      
      try {
        const response = await fetch(`/api/consultas/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          showToast('Ticket eliminado', 'success');
          closeDynamicModal();
          await showScreen('consultas');
        } else {
          throw new Error('Error');
        }
      } catch (error) {
        showToast('Error al eliminar ticket', 'error');
      }
    };

    window.showArchivedTickets = function() {
      const getEmoji = (rol) => ({ 'admin': '👔', 'maestro': '👨‍🏫', 'padre': '👨', 'alumno': '👦' }[rol] || '👤');
      const formatDate = (fecha) => new Date(fecha).toLocaleDateString('es-MX');
      
      const archivadosHTML = ticketsArchivados.length > 0 
        ? ticketsArchivados.map(ticket => `
          <div class="archived-ticket-item">
            <div class="archived-ticket-header">
              <span>${getEmoji(ticket.usuario_rol)} ${ticket.usuario_nombre}</span>
              <span>${formatDate(ticket.fecha_creacion)}</span>
            </div>
            <div class="archived-ticket-subject">${ticket.asunto}</div>
            <div class="archived-ticket-actions">
              <button class="btn-small" onclick="restoreTicket(${ticket.id_ticket})">
                <i class="fas fa-undo"></i> Restaurar
              </button>
              <button class="btn-small btn-danger" onclick="deleteArchivedTicket(${ticket.id_ticket})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `).join('')
        : '<p class="no-archived">No hay tickets archivados</p>';
      
      showDynamicModal(`
        <div class="archived-tickets-modal">
          <h3><i class="fas fa-archive"></i> Tickets Archivados</h3>
          <div class="archived-list">
            ${archivadosHTML}
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" onclick="closeDynamicModal()">Cerrar</button>
          </div>
        </div>
      `);
    };

    window.restoreTicket = async function(id) {
      try {
        const response = await fetch(`/api/consultas/${id}/estado`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'abierto' })
        });
        
        if (response.ok) {
          closeDynamicModal();
          showToast('Ticket restaurado', 'success');
          await showScreen('consultas');
        }
      } catch (error) {
        showToast('Error al restaurar', 'error');
      }
    };

    window.deleteArchivedTicket = async function(id) {
      if (!confirm('¿Eliminar este ticket permanentemente?')) return;
      
      try {
        const response = await fetch(`/api/consultas/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          showToast('Ticket eliminado', 'success');
          closeDynamicModal();
          await showScreen('consultas');
        }
      } catch (error) {
        showToast('Error al eliminar', 'error');
      }
    };

    window.exportTickets = async function() {
      try {
        showToast('Generando CSV...', 'info');
        
        const response = await fetch(`/api/consultas/escuela/${datosUsuarioActual.id_escuela}/export`);
        if (!response.ok) throw new Error('Error al exportar');
        
        const tickets = await response.json();
        
        if (tickets.length === 0) {
          showToast('No hay tickets para exportar', 'warning');
          return;
        }
        
        // Convertir a CSV
        const headers = ['ID', 'Usuario', 'Rol', 'Asunto', 'Contenido', 'Categoría', 'Prioridad', 'Estado', 'Fecha Creación', 'Última Actualización', 'Respuestas'];
        const csvRows = [headers.join(',')];
        
        tickets.forEach(t => {
          const row = [
            t.id_ticket,
            `"${(t.usuario || '').replace(/"/g, '""')}"`,
            t.rol_usuario || '',
            `"${(t.asunto || '').replace(/"/g, '""')}"`,
            `"${(t.contenido || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
            t.categoria || '',
            t.prioridad || '',
            t.estado || '',
            t.fecha_creacion ? new Date(t.fecha_creacion).toLocaleString('es-MX') : '',
            t.fecha_actualizacion ? new Date(t.fecha_actualizacion).toLocaleString('es-MX') : '',
            t.num_respuestas || 0
          ];
          csvRows.push(row.join(','));
        });
        
        const csvContent = csvRows.join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tickets_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showToast('CSV descargado', 'success');
      } catch (error) {
        console.error('Error exportando:', error);
        showToast('Error al exportar', 'error');
      }
    };

    async function renderGenericScreen(screenType) {
      // Renderizar pantallas específicas según el rol y tipo
      if (screenType === 'perfil') {
        return await renderProfileScreen();
      }
      
      if (currentRole === 'maestro') {
        if (screenType === 'panel') return renderConfigPanel();
        if (screenType === 'notificaciones') return await renderNotificationsScreen();
        if (screenType === 'mensajes') return await renderMessagesScreen();
      }
      
      if (currentRole === 'padre') {
        if (screenType === 'hijos') return await renderAnimatedTreeScreen();
        if (screenType === 'recogida') return await renderPickupScreen();
        if (screenType === 'mensajes') return await renderMessagesScreen();
      }
      
      if (currentRole === 'alumno') {
        if (screenType === 'padres') return await renderAnimatedTreeScreen();
        if (screenType === 'consultar') return await renderStaffDirectoryScreen();
        if (screenType === 'mensajes') return await renderMessagesScreen();
      }

      if (currentRole === 'admin') {
        if (screenType === 'consultas') return await renderConsultasScreen();
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

    async function renderAdminScreen(screenType) {
      // Renderizar las interfaces específicas para admin
      if (screenType === 'perfil') {
        return await renderProfileScreen();
      }
      
      if (screenType === 'panel') {
        return renderConfigPanel();
      }
      
      if (screenType === 'cerebro') {
        const brainHTML = await renderBrainPanel();
        // Inicializar listener de avisos de voz para el cerebro
        setTimeout(() => {
          if (window.initVoiceAnnouncementListener) {
            window.initVoiceAnnouncementListener();
          }
        }, 500);
        return brainHTML;
      }
      
      if (screenType === 'consultas') {
        return await renderConsultasScreen();
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
      
      // Obtener el logo de la escuela si está disponible
      const schoolLogoUrl = schoolConfig.logo_escuela || '';
      const centerButtonContent = schoolLogoUrl && schoolLogoUrl.startsWith('/media/') 
        ? `<img src="${schoolLogoUrl}?t=${Date.now()}" alt="Logo" class="center-button-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"><i class="fas fa-id-card" style="display:none"></i>`
        : `<i class="fas fa-id-card"></i>`;
      
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
            ${centerButtonContent}
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
            ${centerButtonContent}
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
            ${centerButtonContent}
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
            ${centerButtonContent}
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

    async function renderScreens() {
      const user = userData[currentRole];
      const mainContent = document.getElementById('mainContent');
      
      let screens = '';
      
      if (currentRole === 'alumno') {
        const studentGroupContent = await renderStudentGroupScreen();
        screens = `
          <div class="screen-container" id="screenContainer">
            <div class="screen">${renderBadge(user)}</div>
            <div class="screen">${studentGroupContent}</div>
          </div>
        `;
      } else if (currentRole === 'padre') {
        screens = `
          <div class="screen-container" id="screenContainer">
            <div class="screen">${renderBadge(user)}</div>
          </div>
        `;
      } else if (currentRole === 'maestro') {
        const teachersTreeContent = await renderTeachersTree();
        const groupListContent = await renderGroupList();
        screens = `
          <div class="screen-container" id="screenContainer">
            <div class="screen">${teachersTreeContent}</div>
            <div class="screen">${renderBadge(user)}</div>
            <div class="screen">${groupListContent}</div>
          </div>
        `;
      } else if (currentRole === 'admin') {
        const teachersTreeContent = await renderTeachersTree();
        const groupListContent = await renderGroupList();
        screens = `
          <div class="screen-container" id="screenContainer">
            <div class="screen">${teachersTreeContent}</div>
            <div class="screen">${renderBadge(user)}</div>
            <div class="screen">${groupListContent}</div>
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
      backButton.onclick = async () => {
        await renderScreens();
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

    async function showScreen(screenType) {
      currentScreen = screenType;
      const mainContent = document.getElementById('mainContent');
      
      if (currentRole === 'admin') {
        const content = await renderAdminScreen(screenType);
        mainContent.innerHTML = `
          <div class="screen-container">
            <div class="screen">${content}</div>
          </div>
        `;
        
        if (screenType === 'cerebro') {
          attachBrainPanelListeners();
        }
        
        // Cargar configuraciones si se muestra el panel
        if (screenType === 'panel') {
          loadSchoolConfig();
        }
      } else {
        const content = await renderGenericScreen(screenType);
        mainContent.innerHTML = `
          <div class="screen-container">
            <div class="screen">${content}</div>
          </div>
        `;
        
        // Cargar configuraciones si se muestra el panel (maestros también)
        if (screenType === 'panel') {
          loadSchoolConfig();
        }
      }

      addBackButton();

      document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelector(`[data-screen="${screenType}"]`)?.classList.add('active');
    }

    async function showGroupTree(idGrupo, nombreGrupo) {
      const mainContent = document.getElementById('mainContent');
      
      // Mostrar loading mientras carga
      mainContent.innerHTML = `
        <div class="screen-container">
          <div class="screen" style="display: flex; justify-content: center; align-items: center;">
            <div style="text-align: center;">
              <i class="fas fa-spinner fa-spin" style="font-size: 48px; color: #7EC8A3; margin-bottom: 20px;"></i>
              <p>Cargando estudiantes...</p>
            </div>
          </div>
        </div>
      `;

      try {
        const groupTreeContent = await renderGroupTree(idGrupo, nombreGrupo);
        mainContent.innerHTML = `
          <div class="screen-container">
            <div class="screen">
              ${groupTreeContent}
            </div>
          </div>
        `;
      } catch (error) {
        console.error('Error al cargar el grupo:', error);
        mainContent.innerHTML = `
          <div class="screen-container">
            <div class="screen" style="display: flex; justify-content: center; align-items: center;">
              <div style="text-align: center; color: #ff6b6b;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
                <p>Error al cargar el grupo</p>
              </div>
            </div>
          </div>
        `;
      }
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

    // ========== SISTEMA DE REGISTRO DE USUARIOS ==========
    let gruposCache = [];
    let asignaturasCache = [];
    let gruposSeleccionadosMaestro = [];

    async function renderRegisterForm() {
      // Cargar datos necesarios
      try {
        const [gruposRes, asignaturasRes] = await Promise.all([
          fetch('/api/auth/grupos/all'),
          fetch('/api/auth/asignaturas/all')
        ]);
        gruposCache = await gruposRes.json();
        asignaturasCache = await asignaturasRes.json();
      } catch (err) {
        console.error('Error cargando datos:', err);
      }

      gruposSeleccionadosMaestro = [];

      const container = document.getElementById('registerForm');
      container.innerHTML = `
        <div class="register-form-content" style="padding: 15px; max-height: 70vh; overflow-y: auto;">
          <!-- Selector de tipo de usuario -->
          <div class="form-group" style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-primary);">
              <i class="fas fa-user-tag"></i> Tipo de Usuario *
            </label>
            <select id="registerRolSelect" style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); font-size: 14px;">
              <option value="">Seleccionar rol...</option>
              <option value="alumno">👨‍🎓 Alumno</option>
              <option value="padre">👪 Padre de Familia</option>
              <option value="maestro">👨‍🏫 Maestro</option>
              <option value="admin">🔐 Administrador</option>
            </select>
          </div>

          <!-- Campos dinámicos según el rol -->
          <div id="dynamicRegisterFields"></div>

          <!-- Botón de registro -->
          <button id="submitRegisterBtn" onclick="submitRegisterForm()" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 15px; display: none;">
            <i class="fas fa-user-plus"></i> Registrar Usuario
          </button>
        </div>
      `;

      document.getElementById('registerRolSelect').addEventListener('change', (e) => {
        renderDynamicRegisterFields(e.target.value);
      });
    }

    function renderDynamicRegisterFields(rol) {
      const container = document.getElementById('dynamicRegisterFields');
      const submitBtn = document.getElementById('submitRegisterBtn');
      
      if (!rol) {
        container.innerHTML = '';
        submitBtn.style.display = 'none';
        return;
      }

      submitBtn.style.display = 'block';
      gruposSeleccionadosMaestro = [];

      // Campos básicos comunes
      let html = `
        <div style="background: var(--bg-secondary); border-radius: 12px; padding: 15px; margin-bottom: 15px;">
          <h4 style="margin: 0 0 12px 0; color: var(--text-primary); font-size: 14px;">
            <i class="fas fa-user"></i> Datos Personales
          </h4>
          
          <div class="form-group" style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 5px; font-size: 12px; color: var(--text-secondary);">Nombre Completo *</label>
            <input type="text" id="regNombreCompleto" placeholder="Juan Pérez García"
              style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); font-size: 14px; box-sizing: border-box;">
          </div>
          
          <div class="form-group" style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 5px; font-size: 12px; color: var(--text-secondary);">Nombre de Usuario *</label>
            <input type="text" id="regNombreUsuario" placeholder="ej: juan.perez" 
              style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); font-size: 14px; box-sizing: border-box;">
            <small id="usernameStatus" style="font-size: 11px;"></small>
          </div>
          
          <div class="form-group" style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 5px; font-size: 12px; color: var(--text-secondary);">Correo Electrónico <span style="color: var(--text-muted);">(opcional)</span></label>
            <input type="email" id="regEmail" placeholder="correo@ejemplo.com"
              style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); font-size: 14px; box-sizing: border-box;">
          </div>
          
          <div class="form-group" style="margin-bottom: 0;">
            <label style="display: block; margin-bottom: 5px; font-size: 12px; color: var(--text-secondary);">Contraseña *</label>
            <input type="password" id="regPassword" placeholder="Mínimo 6 caracteres"
              style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); font-size: 14px; box-sizing: border-box;">
          </div>
        </div>
      `;

      // ========== CAMPOS PARA ALUMNO ==========
      if (rol === 'alumno') {
        html += `
          <!-- Nivel y Grupo -->
          <div style="background: var(--bg-secondary); border-radius: 12px; padding: 15px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 12px 0; color: var(--text-primary); font-size: 14px;">
              <i class="fas fa-school"></i> Nivel y Grupo
            </h4>
            
            <div class="form-group" style="margin-bottom: 12px;">
              <label style="display: block; margin-bottom: 5px; font-size: 12px; color: var(--text-secondary);">¿Usar grupo existente?</label>
              <select id="regGrupoSelect" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); font-size: 13px;">
                <option value="nuevo" selected>➕ Crear/Asignar nuevo grupo</option>
                ${gruposCache.map(g => `<option value="${g.id_grupo}">${g.nombre_grupo} ${g.nivel ? `(${g.nivel})` : ''} ${g.maestro_nombre ? `- ${g.maestro_nombre}` : ''}</option>`).join('')}
              </select>
            </div>
            
            <div id="nuevoGrupoFields" style="background: var(--bg-card); padding: 12px; border-radius: 8px; margin-top: 10px;">
              <div style="font-size: 12px; color: var(--accent-color); margin-bottom: 10px;"><i class="fas fa-plus-circle"></i> Definir Grupo del Alumno</div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 12px;">
                <div>
                  <label style="display: block; margin-bottom: 5px; font-size: 12px; color: var(--text-secondary);">Nivel *</label>
                  <select id="regNivel" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-size: 13px;">
                    <option value="kinder">🎒 Kinder</option>
                    <option value="primaria" selected>📚 Primaria</option>
                    <option value="secundaria">📖 Secundaria</option>
                    <option value="preparatoria">🎓 Preparatoria</option>
                    <option value="universidad">🏛️ Universidad</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; margin-bottom: 5px; font-size: 12px; color: var(--text-secondary);">Grado *</label>
                  <select id="regGrado" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-size: 13px;">
                    ${[1,2,3,4,5,6].map(g => `<option value="${g}">${g}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label style="display: block; margin-bottom: 5px; font-size: 12px; color: var(--text-secondary);">Grupo *</label>
                  <select id="regSeccion" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-size: 13px;">
                    ${['A','B','C','D','E','F'].map(s => `<option value="${s}">${s}</option>`).join('')}
                  </select>
                </div>
              </div>
              
              <div id="previewNombreGrupo" style="background: var(--bg-secondary); padding: 10px; border-radius: 8px; text-align: center; margin-bottom: 12px;">
                <span style="font-size: 11px; color: var(--text-muted);">Nombre del grupo:</span>
                <span id="nombreGrupoGenerado" style="font-weight: bold; color: var(--accent-color); margin-left: 8px;">Primaria 1° A</span>
              </div>
              
              <div class="form-group">
                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: var(--text-secondary);">Maestro del grupo (opcional)</label>
                <input type="text" id="regMaestroGrupoSearch" placeholder="Buscar maestro..."
                  style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-size: 13px; box-sizing: border-box;">
                <div id="maestroGrupoSuggestions" style="background: var(--bg-card); border-radius: 8px; max-height: 120px; overflow-y: auto;"></div>
                <input type="hidden" id="regIdMaestroGrupo">
              </div>
            </div>
          </div>

          <!-- Tutor/Padre -->
          <div style="background: var(--bg-secondary); border-radius: 12px; padding: 15px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 12px 0; color: var(--text-primary); font-size: 14px;">
              <i class="fas fa-user-friends"></i> Padre/Tutor
            </h4>
            
            <div class="form-group" style="margin-bottom: 12px;">
              <label style="display: block; margin-bottom: 5px; font-size: 12px; color: var(--text-secondary);">Seleccionar Tutor</label>
              <select id="regTutorSelect" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); font-size: 13px;">
                <option value="">-- Sin tutor asignado --</option>
                <option value="nuevo">➕ Registrar nuevo tutor</option>
              </select>
              <input type="text" id="regTutorSearch" placeholder="🔍 Buscar padre existente..." 
                style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); font-size: 13px; margin-top: 8px; box-sizing: border-box;">
              <div id="tutorSuggestions" style="background: var(--bg-card); border-radius: 8px; max-height: 150px; overflow-y: auto;"></div>
            </div>
            
            <div id="nuevoTutorFields" style="display: none; background: var(--bg-card); padding: 12px; border-radius: 8px; margin-top: 10px;">
              <div style="font-size: 12px; color: var(--accent-color); margin-bottom: 10px;"><i class="fas fa-user-plus"></i> Registrar Nuevo Tutor</div>
              <input type="text" id="regNuevoTutorNombre" placeholder="Nombre completo del tutor *"
                style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-size: 13px; margin-bottom: 8px; box-sizing: border-box;">
              <input type="text" id="regNuevoTutorUsername" placeholder="Usuario del tutor *" 
                style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-size: 13px; margin-bottom: 8px; box-sizing: border-box;">
              <input type="email" id="regNuevoTutorEmail" placeholder="Correo (opcional)"
                style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-size: 13px; margin-bottom: 8px; box-sizing: border-box;">
              <input type="password" id="regNuevoTutorPassword" placeholder="Contraseña del tutor *"
                style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-size: 13px; margin-bottom: 8px; box-sizing: border-box;">
              <select id="regParentesco" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-size: 13px;">
                <option value="padre">Padre</option>
                <option value="madre">Madre</option>
                <option value="tutor">Tutor Legal</option>
                <option value="abuelo">Abuelo/a</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>
        `;
      }

      // ========== CAMPOS PARA MAESTRO ==========
      if (rol === 'maestro') {
        html += `
          <div style="background: var(--bg-secondary); border-radius: 12px; padding: 15px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 12px 0; color: var(--text-primary); font-size: 14px;">
              <i class="fas fa-chalkboard-teacher"></i> Grupos y Asignaturas
            </h4>
            
            <div class="form-group" style="margin-bottom: 12px;">
              <label style="display: block; margin-bottom: 5px; font-size: 12px; color: var(--text-secondary);">Agregar Grupo</label>
              <select id="regMaestroGrupoSelect" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); font-size: 13px;">
                <option value="">-- Seleccionar grupo --</option>
                ${gruposCache.map(g => `<option value="${g.id_grupo}">${g.nombre_grupo} ${g.nivel ? `(${g.nivel})` : ''}</option>`).join('')}
              </select>
            </div>
            
            <div id="asignaturasSeleccion" style="display: none; margin-bottom: 12px;">
              <label style="display: block; margin-bottom: 5px; font-size: 12px; color: var(--text-secondary);">Asignaturas en este grupo</label>
              <div id="asignaturasCheckboxes" style="display: flex; flex-wrap: wrap; gap: 8px; background: var(--bg-card); padding: 10px; border-radius: 8px;">
                ${asignaturasCache.map(a => `
                  <label style="display: flex; align-items: center; gap: 5px; background: var(--bg-secondary); padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                    <input type="checkbox" class="asignaturaCheck" value="${a.id_asignatura}">
                    ${a.nombre_asignatura}
                  </label>
                `).join('')}
              </div>
              <button type="button" onclick="agregarGrupoMaestro()" style="margin-top: 10px; padding: 8px 16px; background: var(--accent-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px;">
                <i class="fas fa-plus"></i> Agregar Grupo
              </button>
            </div>
            
            <div id="gruposAgregadosMaestro" style="margin-top: 15px;"></div>
          </div>
          
          <div style="background: var(--bg-secondary); border-radius: 12px; padding: 15px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 12px 0; color: var(--text-primary); font-size: 14px;">
              <i class="fas fa-book"></i> Nueva Asignatura (Opcional)
            </h4>
            <input type="text" id="regNuevaAsignatura" placeholder="Nombre de nueva asignatura..."
              style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); font-size: 13px; box-sizing: border-box;">
            <small style="color: var(--text-muted); font-size: 11px;">Si la asignatura no existe, escríbela aquí</small>
          </div>
        `;
      }

      // ========== CAMPOS PARA PADRE ==========
      if (rol === 'padre') {
        html += `
          <div style="background: var(--bg-secondary); border-radius: 12px; padding: 15px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 12px 0; color: var(--text-primary); font-size: 14px;">
              <i class="fas fa-info-circle"></i> Información Adicional
            </h4>
            <p style="color: var(--text-muted); font-size: 13px; margin: 0;">
              Los datos básicos son suficientes para registrar un padre. 
              Podrá vincularse con sus hijos posteriormente desde el panel de administración.
            </p>
          </div>
        `;
      }

      // ========== CAMPOS PARA ADMIN ==========
      if (rol === 'admin') {
        html += `
          <div style="background: var(--bg-secondary); border-radius: 12px; padding: 15px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 12px 0; color: var(--text-primary); font-size: 14px;">
              <i class="fas fa-shield-alt"></i> Privilegios de Administrador
            </h4>
            <p style="color: var(--text-muted); font-size: 13px; margin: 0;">
              Este usuario tendrá acceso completo al sistema, incluyendo configuración de escuela, 
              gestión de usuarios y acceso al panel de cerebro.
            </p>
          </div>
        `;
      }

      container.innerHTML = html;
      setupRegisterFormListeners(rol);
    }

    function setupRegisterFormListeners(rol) {
      // Verificar disponibilidad de nombre de usuario
      const usernameInput = document.getElementById('regNombreUsuario');
      if (usernameInput) {
        let debounceTimer;
        usernameInput.addEventListener('input', (e) => {
          clearTimeout(debounceTimer);
          const username = e.target.value.trim();
          const statusEl = document.getElementById('usernameStatus');
          
          if (username.length < 3) {
            statusEl.innerHTML = '<span style="color: var(--text-muted);">Mínimo 3 caracteres</span>';
            return;
          }
          
          debounceTimer = setTimeout(async () => {
            try {
              const res = await fetch(`/api/auth/check-username/${encodeURIComponent(username)}`);
              const data = await res.json();
              statusEl.innerHTML = data.available 
                ? '<span style="color: #4CAF50;">✓ Disponible</span>'
                : '<span style="color: #f44336;">✗ Ya está en uso</span>';
            } catch (err) {
              statusEl.innerHTML = '';
            }
          }, 500);
        });
      }

      if (rol === 'alumno') {
        // Función para actualizar el preview del nombre del grupo
        function actualizarPreviewGrupo() {
          const nivel = document.getElementById('regNivel')?.value || 'primaria';
          const grado = document.getElementById('regGrado')?.value || '1';
          const seccion = document.getElementById('regSeccion')?.value || 'A';
          const nivelCapitalizado = nivel.charAt(0).toUpperCase() + nivel.slice(1);
          const nombreGenerado = `${nivelCapitalizado} ${grado}° ${seccion}`;
          const previewEl = document.getElementById('nombreGrupoGenerado');
          if (previewEl) previewEl.textContent = nombreGenerado;
        }

        // Grupo select - mostrar/ocultar campos de nuevo grupo
        const grupoSelect = document.getElementById('regGrupoSelect');
        if (grupoSelect) {
          grupoSelect.addEventListener('change', (e) => {
            document.getElementById('nuevoGrupoFields').style.display = e.target.value === 'nuevo' ? 'block' : 'none';
          });
          // Mostrar por defecto si está seleccionado "nuevo"
          if (grupoSelect.value === 'nuevo') {
            document.getElementById('nuevoGrupoFields').style.display = 'block';
          }
        }

        // Listeners para actualizar el preview cuando cambia nivel, grado o sección
        ['regNivel', 'regGrado', 'regSeccion'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.addEventListener('change', actualizarPreviewGrupo);
        });

        // Tutor select
        const tutorSelect = document.getElementById('regTutorSelect');
        if (tutorSelect) {
          tutorSelect.addEventListener('change', (e) => {
            document.getElementById('nuevoTutorFields').style.display = e.target.value === 'nuevo' ? 'block' : 'none';
          });
        }

        // Autocomplete para buscar tutor
        setupAutocompleteRegister('regTutorSearch', 'tutorSuggestions', '/api/auth/padres/search', (item) => {
          document.getElementById('regTutorSelect').value = item.id_usuario;
          // Crear opción si no existe
          const select = document.getElementById('regTutorSelect');
          let option = select.querySelector(`option[value="${item.id_usuario}"]`);
          if (!option) {
            option = document.createElement('option');
            option.value = item.id_usuario;
            option.textContent = `${item.nombre_completo} (${item.email})`;
            select.appendChild(option);
          }
          select.value = item.id_usuario;
          document.getElementById('nuevoTutorFields').style.display = 'none';
        });

        // Autocomplete para maestro del grupo
        setupAutocompleteRegister('regMaestroGrupoSearch', 'maestroGrupoSuggestions', '/api/auth/maestros/search', (item) => {
          document.getElementById('regIdMaestroGrupo').value = item.id_usuario;
          document.getElementById('regMaestroGrupoSearch').value = item.nombre_completo;
        });
      }

      if (rol === 'maestro') {
        const grupoSelect = document.getElementById('regMaestroGrupoSelect');
        if (grupoSelect) {
          grupoSelect.addEventListener('change', (e) => {
            document.getElementById('asignaturasSeleccion').style.display = e.target.value ? 'block' : 'none';
          });
        }
      }
    }

    function setupAutocompleteRegister(inputId, suggestionsId, endpoint, onSelect) {
      const input = document.getElementById(inputId);
      const suggestions = document.getElementById(suggestionsId);
      if (!input || !suggestions) return;

      let debounceTimer;
      input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        
        if (query.length < 2) {
          suggestions.innerHTML = '';
          return;
        }
        
        debounceTimer = setTimeout(async () => {
          try {
            const res = await fetch(`${endpoint}?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            
            if (data.length === 0) {
              suggestions.innerHTML = '<div style="padding: 10px; color: var(--text-muted); font-size: 12px;">No se encontraron resultados</div>';
              return;
            }
            
            suggestions.innerHTML = data.map(item => `
              <div class="autocomplete-item" data-item='${JSON.stringify(item)}'
                style="padding: 10px; cursor: pointer; border-bottom: 1px solid var(--border-color);"
                onmouseover="this.style.background='var(--bg-hover)'" 
                onmouseout="this.style.background='transparent'">
                <div style="font-weight: 500; color: var(--text-primary);">${item.nombre_completo}</div>
                <div style="font-size: 11px; color: var(--text-muted);">${item.email || ''}</div>
              </div>
            `).join('');
            
            suggestions.querySelectorAll('.autocomplete-item').forEach(el => {
              el.addEventListener('click', () => {
                const item = JSON.parse(el.dataset.item);
                input.value = item.nombre_completo;
                suggestions.innerHTML = '';
                onSelect(item);
              });
            });
          } catch (err) {
            suggestions.innerHTML = '';
          }
        }, 300);
      });
    }

    function agregarGrupoMaestro() {
      const grupoSelect = document.getElementById('regMaestroGrupoSelect');
      const grupoId = grupoSelect.value;
      const grupoNombre = grupoSelect.options[grupoSelect.selectedIndex].text;
      
      if (!grupoId) {
        showToast('Selecciona un grupo primero', 'warning');
        return;
      }

      // Verificar si ya está agregado
      if (gruposSeleccionadosMaestro.find(g => g.id_grupo == grupoId)) {
        showToast('Este grupo ya está agregado', 'warning');
        return;
      }

      // Obtener asignaturas seleccionadas
      const asignaturas = [];
      document.querySelectorAll('.asignaturaCheck:checked').forEach(cb => {
        asignaturas.push(parseInt(cb.value));
      });

      gruposSeleccionadosMaestro.push({
        id_grupo: parseInt(grupoId),
        nombre_grupo: grupoNombre,
        asignaturas: asignaturas
      });

      renderGruposAgregados();
      
      // Limpiar selección
      grupoSelect.value = '';
      document.querySelectorAll('.asignaturaCheck').forEach(cb => cb.checked = false);
      document.getElementById('asignaturasSeleccion').style.display = 'none';
    }

    function renderGruposAgregados() {
      const container = document.getElementById('gruposAgregadosMaestro');
      if (gruposSeleccionadosMaestro.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); font-size: 12px; text-align: center;">No hay grupos asignados</p>';
        return;
      }

      container.innerHTML = gruposSeleccionadosMaestro.map((g, i) => {
        const asigNombres = g.asignaturas.map(aid => {
          const asig = asignaturasCache.find(a => a.id_asignatura == aid);
          return asig ? asig.nombre_asignatura : '';
        }).filter(n => n).join(', ');
        
        return `
          <div style="background: var(--bg-card); padding: 10px; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 500; color: var(--text-primary); font-size: 13px;">${g.nombre_grupo}</div>
              <div style="font-size: 11px; color: var(--text-muted);">${asigNombres || 'Sin asignaturas'}</div>
            </div>
            <button onclick="quitarGrupoMaestro(${i})" style="background: #f44336; color: white; border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer;">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;
      }).join('');
    }

    function quitarGrupoMaestro(index) {
      gruposSeleccionadosMaestro.splice(index, 1);
      renderGruposAgregados();
    }

    async function submitRegisterForm() {
      const rol = document.getElementById('registerRolSelect').value;
      const nombre_usuario = document.getElementById('regNombreUsuario')?.value.trim();
      const nombre_completo = document.getElementById('regNombreCompleto')?.value.trim();
      const email = document.getElementById('regEmail')?.value.trim();
      const password = document.getElementById('regPassword')?.value;

      // Validaciones básicas
      if (!nombre_completo || !nombre_usuario || !password) {
        showToast('Completa los campos obligatorios: Nombre, Usuario y Contraseña', 'error');
        return;
      }

      if (nombre_usuario.length < 3) {
        showToast('El nombre de usuario debe tener al menos 3 caracteres', 'error');
        return;
      }

      if (password.length < 6) {
        showToast('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
      }

      const payload = {
        id_escuela: datosUsuarioActual?.id_escuela || 1,
        nombre_usuario,
        nombre_completo,
        email: email || null,
        password,
        rol
      };

      // ===== DATOS ESPECÍFICOS DE ALUMNO =====
      if (rol === 'alumno') {
        const grupoSelect = document.getElementById('regGrupoSelect')?.value;

        if (grupoSelect === 'nuevo') {
          const nivel = document.getElementById('regNivel')?.value || 'primaria';
          const grado = document.getElementById('regGrado')?.value || '1';
          const seccion = document.getElementById('regSeccion')?.value || 'A';
          const idMaestro = document.getElementById('regIdMaestroGrupo')?.value;
          
          // Capitalizar primera letra del nivel
          const nivelCapitalizado = nivel.charAt(0).toUpperCase() + nivel.slice(1);
          // Construir nombre del grupo: "{Nivel} {grado}° {grupo}"
          const nombreGrupoGenerado = `${nivelCapitalizado} ${grado}° ${seccion}`;
          
          payload.nuevo_grupo = {
            nombre_grupo: nombreGrupoGenerado,
            grado: parseInt(grado),
            seccion: seccion,
            nivel: nivel,
            id_maestro: idMaestro ? parseInt(idMaestro) : null
          };
        } else if (grupoSelect) {
          payload.id_grupo = parseInt(grupoSelect);
        }

        // Tutor
        const tutorSelect = document.getElementById('regTutorSelect')?.value;
        if (tutorSelect === 'nuevo') {
          const tutorNombre = document.getElementById('regNuevoTutorNombre')?.value.trim();
          const tutorUsername = document.getElementById('regNuevoTutorUsername')?.value.trim();
          const tutorEmail = document.getElementById('regNuevoTutorEmail')?.value.trim();
          const tutorPassword = document.getElementById('regNuevoTutorPassword')?.value;
          const parentesco = document.getElementById('regParentesco')?.value;
          
          if (!tutorNombre || !tutorUsername || !tutorPassword) {
            showToast('Completa los datos del tutor (nombre, usuario y contraseña)', 'error');
            return;
          }
          
          payload.nuevo_tutor = {
            nombre_usuario: tutorUsername,
            nombre_completo: tutorNombre,
            email: tutorEmail || null,
            password: tutorPassword
          };
          payload.parentesco = parentesco;
        } else if (tutorSelect) {
          payload.id_tutor = parseInt(tutorSelect);
        }
      }

      // ===== DATOS ESPECÍFICOS DE MAESTRO =====
      if (rol === 'maestro') {
        if (gruposSeleccionadosMaestro.length > 0) {
          payload.grupos_asignados = gruposSeleccionadosMaestro.map(g => ({
            id_grupo: g.id_grupo,
            asignaturas: g.asignaturas
          }));
        }

        const nuevaAsignatura = document.getElementById('regNuevaAsignatura')?.value.trim();
        if (nuevaAsignatura) {
          payload.nuevas_asignaturas = [{ nombre_asignatura: nuevaAsignatura }];
        }
      }

      // Enviar registro
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
          showToast(data.message || 'Error al registrar usuario', 'error');
          return;
        }

        let mensaje = `¡${nombre_completo} registrado exitosamente!`;
        if (data.tutorId) {
          mensaje += ' También se registró el tutor.';
        }
        
        showToast(mensaje, 'success');
        closeModal('registerModal');
        renderRegisterForm();

      } catch (err) {
        console.error('Error al registrar:', err);
        showToast('Error de conexión al registrar', 'error');
      }
    }

    function setupAutocomplete(inputId, suggestionsId, endpoint, hiddenId, valueKey, displayKey, secondaryKey = null) {
      // Función legacy para compatibilidad
      setupAutocompleteRegister(inputId, suggestionsId, endpoint, (item) => {
        document.getElementById(inputId).value = item[displayKey];
        document.getElementById(hiddenId).value = item[valueKey];
      });
    }

    function changeProfilePhoto() {
      const fileInput = document.getElementById('photoFileInput');
      fileInput.click();
      
      // Manejar selección de archivo
      fileInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
          showToast('Por favor selecciona una imagen válida', 'error');
          return;
        }
        
        // Validar tamaño (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
          showToast('La imagen es muy grande (máx 5MB)', 'error');
          return;
        }
        
        // Mostrar preview mientras se sube
        const reader = new FileReader();
        reader.onload = function(event) {
          const preview = event.target.result;
          const container = document.getElementById('profilePhotoContainer');
          if (container) {
            container.innerHTML = `<img src="${preview}" alt="Foto de perfil" class="profile-photo-image">`;
          }
        };
        reader.readAsDataURL(file);
        
        // Subir archivo al servidor
        try {
          const formData = new FormData();
          formData.append('foto', file);
          
          const response = await fetch(`/api/usuarios/${idUsuarioActual}/upload-foto`, {
            method: 'POST',
            body: formData
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || data.message || 'Error al subir la foto');
          }
          
          // Actualizar datos del usuario en memoria
          datosUsuarioActual.foto_perfil = data.foto_perfil;
          
          // Actualizar sesión en localStorage
          if (localStorage.getItem('escolarfam_sesion')) {
            const s = JSON.parse(localStorage.getItem('escolarfam_sesion'));
            s.datos = datosUsuarioActual;
            localStorage.setItem('escolarfam_sesion', JSON.stringify(s));
          }
          
          showToast('Foto actualizada ✅', 'success');
        } catch (error) {
          console.error('Error al subir foto:', error);
          showToast(error.message || 'Error al subir la foto', 'error');
          // Revertir preview en caso de error
          const user = userData[currentRole];
          const container = document.getElementById('profilePhotoContainer');
          if (container) {
            const currentPhoto = (datosUsuarioActual && datosUsuarioActual.foto_perfil)
              ? `<img src="${datosUsuarioActual.foto_perfil}" alt="Foto de perfil" class="profile-photo-image">`
              : `<div class="profile-photo-emoji">${user.emoji}</div>`;
            container.innerHTML = currentPhoto;
          }
        }
        
        // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
        fileInput.value = '';
      }, { once: true });
    }

    async function approvePickup(notificationId, studentName, parentName, studentPhoto, personaSugerida, parentescoSugerido) {
      console.log('🔍 approvePickup called with:', {
        notificationId, studentName, parentName, studentPhoto, personaSugerida, parentescoSugerido
      });
      
      // Si NO hay persona alternativa sugerida, aprobar directo (asumimos padre)
      if (!personaSugerida) {
        console.log('📝 Aprobación directa (sin persona alternativa)');
        try {
          const response = await fetch(`/api/recogidas/${notificationId}/aprobar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_aprobador: idUsuarioActual })
          });
          if (response.ok) {
            showToast('Recogida aprobada ✅', 'success');
            const notifElement = document.querySelector(`.notification-item[data-id="${notificationId}"]`);
            if (notifElement) { notifElement.style.opacity = '0.5'; notifElement.style.pointerEvents = 'none'; setTimeout(() => notifElement.remove(), 400); }
            return;
          } else {
            const error = await response.json();
            showToast(error.error || 'Error al aprobar recogida', 'error');
            return;
          }
        } catch (e) {
          console.error('Error al aprobar recogida:', e);
          showToast('Error al aprobar recogida', 'error');
          return;
        }
      }

      // Si hay persona alternativa, pedir nombre y parentesco (prefill con sugerida)
      console.log('📋 Mostrando modal para persona alternativa');
      const modalHtml = `
        <div class="modal-overlay" id="approvalModal">
          <div class="modal-content modal-approval">
            <div class="modal-header">
              <h3>Aprobar Recogida</h3>
              <button onclick="closeApprovalModal()" class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
              ${studentPhoto ? `<img src="${studentPhoto}" alt="${studentName}" class="approval-student-photo">` : ''}
              <p><strong>Estudiante:</strong> ${studentName}</p>
              <p><strong>Solicitante:</strong> ${parentName}</p>
              <div class="form-group">
                <label for="nombreRecoge">¿Quién recoge al estudiante?</label>
                <input type="text" id="nombreRecoge" class="form-input" placeholder="Nombre completo" value="${personaSugerida || ''}" required>
                <small class="form-hint">Ingrese el nombre de la persona que recoge al estudiante</small>
              </div>
              <div class="form-group">
                <label for="parentescoRecoge">Parentesco</label>
                <input type="text" id="parentescoRecoge" class="form-input" placeholder="ej: tío, abuelo, tutor" value="${parentescoSugerido || ''}" required>
                <small class="form-hint">Relación de la persona con el estudiante</small>
              </div>
            </div>
            <div class="modal-footer">
              <button onclick="closeApprovalModal()" class="btn-secondary">Cancelar</button>
              <button onclick="confirmApproval(${notificationId})" class="btn-primary">Confirmar</button>
            </div>
          </div>
        </div>
      `;
      console.log('🏗️ Insertando modal HTML:', modalHtml.substring(0, 200) + '...');
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      console.log('✅ Modal insertado, buscando elemento...');
      const modalElement = document.getElementById('approvalModal');
      console.log('🔍 Modal element found:', modalElement);
      if (modalElement) {
        console.log('📏 Modal computed style:', getComputedStyle(modalElement).display);
      }
    }

    window.closeApprovalModal = function() {
      const modal = document.getElementById('approvalModal');
      if (modal) modal.remove();
    };

    window.confirmApproval = async function(notificationId) {
      const nombreRecoge = document.getElementById('nombreRecoge').value.trim();
      const parentescoRecoge = document.getElementById('parentescoRecoge').value.trim();
      
      if (!nombreRecoge) {
        showToast('Ingrese el nombre de quien recoge', 'error');
        return;
      }

      try {
        const response = await fetch(`/api/recogidas/${notificationId}/aprobar`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_aprobador: idUsuarioActual,
            nombre_recoge: nombreRecoge,
            parentesco_recoge: parentescoRecoge
          })
        });

        if (response.ok) {
          showToast('Recogida aprobada ✅', 'success');
          closeApprovalModal();
          
          // Remover la notificación de la UI
          const notifElement = document.querySelector(`.notification-item[data-id="${notificationId}"]`);
          if (notifElement) {
            notifElement.style.opacity = '0.5';
            notifElement.style.pointerEvents = 'none';
            setTimeout(() => notifElement.remove(), 500);
          }
        } else {
          const error = await response.json();
          showToast(error.error || 'Error al aprobar recogida', 'error');
        }
      } catch (error) {
        console.error('Error al aprobar recogida:', error);
        showToast('Error al aprobar recogida', 'error');
      }
    };

    async function rejectPickup(notificationId) {
      if (!confirm('¿Está seguro de rechazar esta solicitud de recogida?')) {
        return;
      }

      try {
        const response = await fetch(`/api/recogidas/${notificationId}/rechazar`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_aprobador: idUsuarioActual
          })
        });

        if (response.ok) {
          showToast('Recogida rechazada ❌', 'error');
          
          // Remover la notificación de la UI
          const notifElement = document.querySelector(`.notification-item[data-id="${notificationId}"]`);
          if (notifElement) {
            notifElement.style.opacity = '0.5';
            notifElement.style.pointerEvents = 'none';
            setTimeout(() => notifElement.remove(), 500);
          }
        } else {
          const error = await response.json();
          showToast(error.error || 'Error al rechazar recogida', 'error');
        }
      } catch (error) {
        console.error('Error al rechazar recogida:', error);
        showToast('Error al rechazar recogida', 'error');
      }
    }

    function showChildOptions(childName) {
      showToast(`Opciones para ${childName}`, 'info');
    }

    function sendPickupAlert(childName) {
      showToast(`✅ Alerta enviada: Has llegado por ${childName}`, 'success');
    }

    async function handlePickupAlert(child) {
      await enviarAlertaRecogida(child);
    }

    // Sistema de personas de confianza rápido
    window.setQuickPerson = async function(childId, personaId, childName, nombrePersona, parentesco) {
      try {
        // Verificar si ya existe solicitud pendiente
        const checkResponse = await fetch(`/api/recogidas/hijo/${childId}`);
        let solicitudExistente = null;
        
        if (checkResponse.ok) {
          const solicitudes = await checkResponse.json();
          solicitudExistente = solicitudes.find(s => s.estado === 'pendiente');
        }

        if (personaId === 'yo') {
          // Si selecciona "Yo", eliminar persona_recoge de solicitud existente o crear sin persona
          if (solicitudExistente) {
            const response = await fetch(`/api/recogidas/${solicitudExistente.id_solicitud}/actualizar-persona`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ persona_recoge: null, parentesco_recoge: null })
            });
            if (response.ok) {
              showToast('Tú recogerás a ' + childName, 'success');
              await renderPickupScreen().then(html => document.getElementById('mainContent').innerHTML = html);
            }
          }
        } else {
          // Seleccionó una persona de confianza
          if (solicitudExistente) {
            // Actualizar solicitud existente
            const response = await fetch(`/api/recogidas/${solicitudExistente.id_solicitud}/actualizar-persona`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                persona_recoge: nombrePersona,
                parentesco_recoge: parentesco
              })
            });
            if (response.ok) {
              showToast(`${nombrePersona} recogerá a ${childName}`, 'success');
              await renderPickupScreen().then(html => document.getElementById('mainContent').innerHTML = html);
            }
          } else {
            // Crear nueva solicitud
            const response = await fetch('/api/recogidas', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id_padre: idUsuarioActual,
                id_hijo: childId,
                id_escuela: 1,
                observaciones: `${nombrePersona} recogerá a ${childName}`,
                persona_recoge: nombrePersona,
                parentesco_recoge: parentesco
              })
            });
            if (response.ok) {
              showToast(`${nombrePersona} recogerá a ${childName}`, 'success');
              await renderPickupScreen().then(html => document.getElementById('mainContent').innerHTML = html);
            }
          }
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('Error al actualizar', 'error');
      }
    };

    window.openAddPersonModal = function() {
      const modalHtml = `
        <div class="modal show" id="addPersonModal" onclick="closeAddPersonModal()">
          <div class="modal-content modal-add-person" onclick="event.stopPropagation()">
            <div class="modal-header">
              <h3><i class="fas fa-user-plus"></i> Agregar Persona de Confianza</h3>
              <button onclick="closeAddPersonModal()" class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
              <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                Agrega una persona de confianza que pueda recoger a tus hijos. Esta información se guardará para uso futuro.
              </p>
              
              <div class="form-group">
                <label for="newPersonName"><i class="fas fa-user"></i> Nombre completo *</label>
                <input type="text" id="newPersonName" class="form-input" placeholder="Ej: María González López" required>
              </div>
              
              <div class="form-group">
                <label for="newPersonParentesco"><i class="fas fa-heart"></i> Parentesco *</label>
                <select id="newPersonParentesco" class="form-input" required>
                  <option value="">Seleccionar parentesco</option>
                  <option value="abuelo">Abuelo/Abuela</option>
                  <option value="tio">Tío/Tía</option>
                  <option value="primo">Primo/Prima</option>
                  <option value="padrino">Padrino/Madrina</option>
                  <option value="tutor">Tutor Legal</option>
                  <option value="cuidador">Cuidador/Niñera</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              
              <div class="form-group" id="parentescoOtroGroup" style="display: none;">
                <label for="newPersonParentescoOtro"><i class="fas fa-pencil-alt"></i> Especificar parentesco</label>
                <input type="text" id="newPersonParentescoOtro" class="form-input" placeholder="Ej: hermano, vecino, etc.">
              </div>
              
              <div class="form-group">
                <label for="newPersonTelefono"><i class="fas fa-phone"></i> Teléfono (opcional)</label>
                <input type="tel" id="newPersonTelefono" class="form-input" placeholder="555-1234-5678">
              </div>
              
              <div class="form-group">
                <label class="checkbox-label-modal">
                  <input type="checkbox" id="newPersonPredeterminada">
                  <span><i class="fas fa-star"></i> Usar como predeterminada para todos los hijos</span>
                </label>
                <small style="color: #999; font-size: 12px; margin-top: 5px; display: block;">
                  Si marcas esta opción, esta persona aparecerá seleccionada automáticamente
                </small>
              </div>
            </div>
            <div class="modal-footer">
              <button onclick="closeAddPersonModal()" class="btn-secondary">
                <i class="fas fa-times"></i> Cancelar
              </button>
              <button onclick="saveNewPerson()" class="btn-primary">
                <i class="fas fa-save"></i> Guardar Persona
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      
      // Agregar evento para mostrar/ocultar campo "otro" parentesco
      document.getElementById('newPersonParentesco').addEventListener('change', function() {
        const otroGroup = document.getElementById('parentescoOtroGroup');
        if (this.value === 'otro') {
          otroGroup.style.display = 'block';
          document.getElementById('newPersonParentescoOtro').required = true;
        } else {
          otroGroup.style.display = 'none';
          document.getElementById('newPersonParentescoOtro').required = false;
        }
      });
      
      // Focus en el primer campo
      setTimeout(() => {
        document.getElementById('newPersonName').focus();
      }, 100);
    };

    window.closeAddPersonModal = function() {
      const modal = document.getElementById('addPersonModal');
      if (modal) {
        modal.style.animation = 'modalSlideOut 0.2s ease-in forwards';
        setTimeout(() => modal.remove(), 200);
      }
    };

    window.saveNewPerson = async function() {
      const nombre = document.getElementById('newPersonName').value.trim();
      const parentescoSelect = document.getElementById('newPersonParentesco').value;
      const parentescoOtro = document.getElementById('newPersonParentescoOtro').value.trim();
      const telefono = document.getElementById('newPersonTelefono').value.trim();
      const predeterminada = document.getElementById('newPersonPredeterminada').checked;

      // Validaciones
      if (!nombre) {
        showToast('Por favor ingrese el nombre completo', 'error');
        document.getElementById('newPersonName').focus();
        return;
      }

      if (!parentescoSelect) {
        showToast('Por favor seleccione el parentesco', 'error');
        document.getElementById('newPersonParentesco').focus();
        return;
      }

      if (parentescoSelect === 'otro' && !parentescoOtro) {
        showToast('Por favor especifique el parentesco', 'error');
        document.getElementById('newPersonParentescoOtro').focus();
        return;
      }

      // Determinar el parentesco final
      const parentescoFinal = parentescoSelect === 'otro' ? parentescoOtro : parentescoSelect;

      try {
        const response = await fetch('/api/personas-confianza', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_padre: idUsuarioActual,
            nombre_completo: nombre,
            parentesco: parentescoFinal,
            telefono: telefono || null,
            predeterminada: predeterminada ? 1 : 0
          })
        });

        if (response.ok) {
          const result = await response.json();
          showToast(`✅ ${nombre} agregado como persona de confianza`, 'success');
          closeAddPersonModal();
          
          // Recargar la pantalla para mostrar la nueva persona
          const newHtml = await renderPickupScreen();
          document.getElementById('mainContent').innerHTML = newHtml;
        } else {
          const error = await response.json();
          showToast(error.error || 'Error al agregar persona', 'error');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión al guardar', 'error');
      }
    };

    // Funciones para persona alternativa (antiguo método, ahora legacy)
    window.toggleAlternatePerson = function(childId) {
      const checkbox = document.getElementById(`alternate-${childId}`);
      const form = document.getElementById(`alternate-form-${childId}`);
      
      if (checkbox.checked) {
        form.classList.remove('hidden');
        form.classList.add('show');
      } else {
        form.classList.remove('show');
        form.classList.add('hidden');
      }
    };

    window.saveAlternatePerson = async function(childId, childName) {
      const nombreInput = document.getElementById(`nombre-alternate-${childId}`);
      const parentescoInput = document.getElementById(`parentesco-alternate-${childId}`);
      
      const nombre = nombreInput.value.trim();
      const parentesco = parentescoInput.value.trim();
      
      if (!nombre) {
        showToast('Ingrese el nombre de quien recogerá', 'error');
        return;
      }
      
      if (!parentesco) {
        showToast('Ingrese el parentesco', 'error');
        return;
      }

      try {
        // Verificar si ya existe una solicitud pendiente
        const checkResponse = await fetch(`/api/recogidas/hijo/${childId}`);
        let solicitudExistente = null;
        
        if (checkResponse.ok) {
          const solicitudes = await checkResponse.json();
          solicitudExistente = solicitudes.find(s => s.estado === 'pendiente');
        }

        if (solicitudExistente) {
          // Actualizar solicitud existente
          const response = await fetch(`/api/recogidas/${solicitudExistente.id_solicitud}/actualizar-persona`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              persona_recoge: nombre,
              parentesco_recoge: parentesco
            })
          });

          if (response.ok) {
            showToast(`✅ Actualizado: ${nombre} recogerá a ${childName}`, 'success');
            nombreInput.value = '';
            parentescoInput.value = '';
          } else {
            const error = await response.json();
            showToast(error.error || 'Error al actualizar', 'error');
          }
        } else {
          // Crear nueva solicitud con persona alternativa
          const response = await fetch('/api/recogidas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id_padre: idUsuarioActual,
              id_hijo: childId,
              id_escuela: 1,
              observaciones: `${nombre} recogerá a ${childName}`,
              persona_recoge: nombre,
              parentesco_recoge: parentesco
            })
          });

          if (response.ok) {
            showToast(`✅ Registrado: ${nombre} recogerá a ${childName}`, 'success');
            nombreInput.value = '';
            parentescoInput.value = '';
          } else {
            const error = await response.json();
            showToast(error.error || 'Error al registrar', 'error');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('Error al procesar solicitud', 'error');
      }
    };

    function openChat(contactName) {
      showChatInterface(contactName);
    }

    // Variable para almacenar configuraciones cargadas
    let schoolConfig = {};

    // Cargar configuraciones al iniciar el panel
    async function loadSchoolConfig() {
      if (!datosUsuarioActual || !datosUsuarioActual.id_escuela) return;
      
      try {
        const response = await fetch(`/api/config/escuela/${datosUsuarioActual.id_escuela}`);
        if (response.ok) {
          schoolConfig = await response.json();
          applyConfigToToggles();
          loadSchoolLogo();
        }
      } catch (error) {
        console.error('Error al cargar configuraciones:', error);
      }
    }

    // Aplicar configuraciones a los toggles del panel
    function applyConfigToToggles() {
      document.querySelectorAll('.config-toggle[data-config]').forEach(toggle => {
        const configKey = toggle.getAttribute('data-config');
        if (schoolConfig.hasOwnProperty(configKey)) {
          if (schoolConfig[configKey]) {
            toggle.classList.add('active');
          } else {
            toggle.classList.remove('active');
          }
        }
      });
    }

    // Cargar logo de la escuela en la pantalla de login (desde caché si existe)
    function loadLoginScreenLogo() {
      try {
        // Solo cargar si hay sesión guardada en caché
        const sesionGuardada = localStorage.getItem('escolarfam_sesion');
        const logoGuardado = localStorage.getItem('escolarfam_logo');
        
        if (sesionGuardada && logoGuardado && logoGuardado.startsWith('/media/')) {
          const loginLogoIcon = document.getElementById('loginLogoIcon');
          if (loginLogoIcon) {
            loginLogoIcon.innerHTML = `<img src="${logoGuardado}?t=${Date.now()}" alt="Logo Escuela" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-graduation-cap\\'></i>'">`;
          }
        }
      } catch (error) {
        console.log('No se pudo cargar el logo desde caché');
      }
    }

    // Actualizar el logo en el botón central del nav
    function updateCenterButtonLogo() {
      const centerButton = document.getElementById('centerButton');
      if (centerButton && schoolConfig.logo_escuela && schoolConfig.logo_escuela.startsWith('/media/')) {
        centerButton.innerHTML = `<img src="${schoolConfig.logo_escuela}?t=${Date.now()}" alt="Logo" class="center-button-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"><i class="fas fa-id-card" style="display:none"></i>`;
      }
    }

    // Cargar logo de la escuela desde la ruta guardada (panel de config)
    function loadSchoolLogo() {
      const logoPreview = document.getElementById('schoolLogoPreview');
      if (logoPreview && schoolConfig.logo_escuela && schoolConfig.logo_escuela.startsWith('/media/')) {
        // Agregar timestamp para evitar caché
        logoPreview.innerHTML = `<img src="${schoolConfig.logo_escuela}?t=${Date.now()}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-school\\' style=\\'font-size: 60px; color: rgba(255,255,255,0.7);\\'></i>'">`;
      }
    }

    function toggleConfig(element) {
      element.classList.toggle('active');
      configChanged = true;
      
      const saveBtn = document.getElementById('saveConfigBtn');
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios Pendientes';
      }
    }

    async function saveConfiguration() {
      if (!datosUsuarioActual || !datosUsuarioActual.id_escuela) {
        showToast('Error: No se pudo identificar la escuela', 'error');
        return;
      }

      const saveBtn = document.getElementById('saveConfigBtn');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
      }

      try {
        // Recopilar todos los valores de los toggles
        const configData = {
          id_usuario: datosUsuarioActual.id_usuario
        };

        document.querySelectorAll('.config-toggle[data-config]').forEach(toggle => {
          const configKey = toggle.getAttribute('data-config');
          configData[configKey] = toggle.classList.contains('active');
        });

        const response = await fetch(`/api/config/escuela/${datosUsuarioActual.id_escuela}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(configData)
        });

        if (response.ok) {
          showToast('Configuración guardada correctamente ✅', 'success');
          configChanged = false;
          schoolConfig = { ...schoolConfig, ...configData };
          
          if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-check"></i> Guardado';
            saveBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            setTimeout(() => {
              saveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Configuración';
            }, 2000);
          }
        } else {
          const error = await response.json();
          throw new Error(error.error || 'Error al guardar');
        }
      } catch (error) {
        console.error('Error al guardar configuración:', error);
        showToast('Error al guardar la configuración', 'error');
        
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.innerHTML = '<i class="fas fa-save"></i> Reintentar Guardar';
        }
      }
    }

    // Previsualizar logo de la escuela
    window.previewSchoolLogo = function(input) {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Validar tamaño (máximo 2MB)
        if (file.size > 2 * 1024 * 1024) {
          showToast('La imagen no debe superar 2MB', 'error');
          return;
        }

        // Validar tipo
        if (!file.type.startsWith('image/')) {
          showToast('Solo se permiten archivos de imagen', 'error');
          return;
        }

        const reader = new FileReader();
        reader.onload = async function(e) {
          const logoPreview = document.getElementById('schoolLogoPreview');
          if (logoPreview) {
            logoPreview.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
          }

          // Guardar archivo en el servidor
          try {
            const response = await fetch(`/api/config/escuela/${datosUsuarioActual.id_escuela}/logo`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ logo_base64: e.target.result })
            });

            if (response.ok) {
              const result = await response.json();
              // Guardar la URL del archivo, no el base64
              schoolConfig.logo_escuela = result.url;
              // Actualizar la imagen con la URL del servidor
              if (logoPreview) {
                logoPreview.innerHTML = `<img src="${result.url}?t=${Date.now()}" style="width: 100%; height: 100%; object-fit: cover;">`;
              }
              // Actualizar también el botón central del nav
              updateCenterButtonLogo();
              showToast('Logo de la escuela actualizado ✅', 'success');
            } else {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Error al guardar el logo');
            }
          } catch (error) {
            console.error('Error al subir logo:', error);
            showToast(error.message || 'Error al guardar el logo', 'error');
            // Restaurar icono si falla
            if (logoPreview && !schoolConfig.logo_escuela) {
              logoPreview.innerHTML = `<i class="fas fa-school" style="font-size: 60px; color: rgba(255,255,255,0.7);"></i>`;
            }
          }
        };
        reader.readAsDataURL(file);
      }
    };

    // Quitar logo de la escuela
    window.removeSchoolLogo = async function() {
      if (!confirm('¿Estás seguro de eliminar el logo de la escuela?')) return;
      
      const logoPreview = document.getElementById('schoolLogoPreview');
      if (logoPreview) {
        logoPreview.innerHTML = `<i class="fas fa-school" style="font-size: 60px; color: rgba(255,255,255,0.7);"></i>`;
      }

      try {
        const response = await fetch(`/api/config/escuela/${datosUsuarioActual.id_escuela}/logo`, {
          method: 'DELETE'
        });

        if (response.ok) {
          schoolConfig.logo_escuela = '';
          // Restaurar icono en el botón central del nav
          const centerButton = document.getElementById('centerButton');
          if (centerButton) {
            centerButton.innerHTML = `<i class="fas fa-id-card"></i>`;
          }
          showToast('Logo eliminado', 'info');
        }
      } catch (error) {
        console.error('Error al eliminar logo:', error);
        showToast('Error al eliminar el logo', 'error');
      }
    };

    // Ver historial de logs
    window.viewActivityLogs = async function() {
      if (!datosUsuarioActual || !datosUsuarioActual.id_escuela) return;

      try {
        const response = await fetch(`/api/config/escuela/${datosUsuarioActual.id_escuela}/logs?limit=100`);
        const logs = await response.json();

        const logsHtml = logs.length === 0 
          ? '<p style="text-align: center; opacity: 0.7;">No hay registros de actividad</p>'
          : logs.map(log => {
              const fecha = new Date(log.fecha_accion).toLocaleString('es-MX');
              const iconClass = getLogIcon(log.accion);
              return `
                <div style="padding: 12px; margin-bottom: 8px; background: rgba(255,255,255,0.1); border-radius: 8px; border-left: 3px solid ${getLogColor(log.accion)};">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold;">
                      <i class="${iconClass}" style="margin-right: 8px; color: ${getLogColor(log.accion)};"></i>
                      ${log.accion}
                    </span>
                    <small style="opacity: 0.7;">${fecha}</small>
                  </div>
                  <div style="margin-top: 5px; font-size: 12px; opacity: 0.8;">
                    ${log.usuario_nombre ? `<i class="fas fa-user" style="margin-right: 5px;"></i>${log.usuario_nombre} (${log.usuario_rol})` : 'Sistema'}
                    ${log.tabla_afectada ? ` • <i class="fas fa-table" style="margin-right: 5px;"></i>${log.tabla_afectada}` : ''}
                  </div>
                </div>
              `;
            }).join('');

        // Mostrar modal con logs
        const modalContent = `
          <div style="max-height: 60vh; overflow-y: auto; padding: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h3 style="margin: 0;"><i class="fas fa-history"></i> Historial de Actividad</h3>
              <button onclick="clearOldLogs()" class="btn-secondary" style="padding: 8px 15px; background: rgba(255,107,107,0.2);">
                <i class="fas fa-trash"></i> Limpiar antiguos
              </button>
            </div>
            ${logsHtml}
          </div>
        `;

        // Usar modal existente o crear uno nuevo
        showCustomModal('Logs de Actividad', modalContent);

      } catch (error) {
        console.error('Error al cargar logs:', error);
        showToast('Error al cargar los logs', 'error');
      }
    };

    // Obtener icono según tipo de log
    function getLogIcon(accion) {
      if (accion.toLowerCase().includes('recogida')) return 'fas fa-car';
      if (accion.toLowerCase().includes('mensaje')) return 'fas fa-envelope';
      if (accion.toLowerCase().includes('login') || accion.toLowerCase().includes('acceso')) return 'fas fa-sign-in-alt';
      if (accion.toLowerCase().includes('config')) return 'fas fa-cog';
      if (accion.toLowerCase().includes('usuario')) return 'fas fa-user';
      return 'fas fa-info-circle';
    }

    // Obtener color según tipo de log
    function getLogColor(accion) {
      if (accion.toLowerCase().includes('recogida')) return '#4CAF50';
      if (accion.toLowerCase().includes('mensaje')) return '#2196F3';
      if (accion.toLowerCase().includes('login') || accion.toLowerCase().includes('acceso')) return '#FF9800';
      if (accion.toLowerCase().includes('config')) return '#9C27B0';
      if (accion.toLowerCase().includes('error')) return '#f44336';
      return '#667eea';
    }

    // Limpiar logs antiguos
    window.clearOldLogs = async function() {
      if (!confirm('¿Eliminar los logs con más de 30 días de antigüedad?')) return;

      try {
        const response = await fetch(`/api/config/escuela/${datosUsuarioActual.id_escuela}/logs`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dias_antiguedad: 30 })
        });

        if (response.ok) {
          const result = await response.json();
          showToast(`${result.registros_eliminados} logs eliminados`, 'success');
          viewActivityLogs(); // Recargar
        }
      } catch (error) {
        console.error('Error al limpiar logs:', error);
        showToast('Error al limpiar los logs', 'error');
      }
    };

    // Modal personalizado
    function showCustomModal(title, content) {
      // Verificar si ya existe un modal custom
      let modal = document.getElementById('customModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'customModal';
        modal.className = 'modal';
        modal.innerHTML = `
          <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
              <h3 id="customModalTitle"></h3>
              <button class="modal-close" onclick="closeCustomModal()">&times;</button>
            </div>
            <div id="customModalBody"></div>
          </div>
        `;
        document.body.appendChild(modal);
      }

      document.getElementById('customModalTitle').textContent = title;
      document.getElementById('customModalBody').innerHTML = content;
      modal.classList.add('show');
    }

    window.closeCustomModal = function() {
      const modal = document.getElementById('customModal');
      if (modal) modal.classList.remove('show');
    };

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
        button.addEventListener('click', async () => {
          const screen = button.getAttribute('data-screen');
          await showScreen(screen);
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

    // Variable global para el escáner QR
    let html5QrScanner = null;

    function showQRReader() {
      const mainContent = document.getElementById('mainContent');
      
      mainContent.innerHTML = `
        <div class="qr-reader-screen">
          <button class="back-button" onclick="stopQRScanner(); renderScreens();">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="qr-reader-container">
            <div class="screen-title">Lector de Códigos QR</div>
            <div id="qr-reader" style="width: 100%; max-width: 350px; margin: 20px auto;"></div>
            <div id="qr-status" style="color: #FFB347; margin: 15px 0; font-size: 14px;">
              <i class="fas fa-camera"></i> Iniciando cámara...
            </div>
            <div class="qr-actions">
              <button class="qr-btn" id="btnCambiarCamara" onclick="switchCamera()" style="display: none;">
                <i class="fas fa-sync-alt"></i> Cambiar Cámara
              </button>
              <button class="qr-btn" onclick="testQRScan()">
                <i class="fas fa-vial"></i> Probar
              </button>
            </div>
          </div>
        </div>
      `;

      // Agregar estilos para el lector QR
      if (!document.getElementById('qrReaderStyles')) {
        const qrStyles = document.createElement('style');
        qrStyles.id = 'qrReaderStyles';
        qrStyles.textContent = `
          .qr-reader-screen {
            height: 100%;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            padding-top: 60px;
          }

          .qr-reader-container {
            text-align: center;
            width: 100%;
            max-width: 400px;
          }

          #qr-reader {
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          }

          #qr-reader video {
            border-radius: 15px;
          }

          #qr-reader__scan_region {
            background: transparent !important;
          }

          #qr-reader__dashboard {
            padding: 10px !important;
          }

          #qr-reader__dashboard_section_csr button {
            background: #FFB347 !important;
            border: none !important;
            border-radius: 20px !important;
            padding: 10px 20px !important;
            color: white !important;
            font-weight: bold !important;
          }

          .qr-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 20px;
            flex-wrap: wrap;
          }

          .qr-btn {
            background: linear-gradient(135deg, #FFB347 0%, #FF9E2C 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(255,179,71,0.3);
          }

          .qr-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255,179,71,0.4);
          }

          .qr-btn:active {
            transform: translateY(0);
          }

          .qr-btn.secondary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
        `;
        document.head.appendChild(qrStyles);
      }

      // Iniciar el escáner QR
      startQRScanner();
    }

    async function startQRScanner() {
      const statusEl = document.getElementById('qr-status');
      
      try {
        // Verificar si html5QrCode está disponible
        if (typeof Html5Qrcode === 'undefined') {
          statusEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Librería QR no cargada. Usa el botón Probar.';
          return;
        }

        html5QrScanner = new Html5Qrcode("qr-reader");
        
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        };

        // Intentar con cámara trasera primero
        await html5QrScanner.start(
          { facingMode: "environment" },
          config,
          onQRCodeScanned,
          (errorMessage) => {
            // Ignorar errores de escaneo continuo
          }
        );

        statusEl.innerHTML = '<i class="fas fa-check-circle" style="color: #4CAF50;"></i> Cámara activa - Escanea un código QR';
        document.getElementById('btnCambiarCamara').style.display = 'inline-flex';

      } catch (err) {
        console.error('Error iniciando escáner:', err);
        
        // Intentar con cámara frontal si falla la trasera
        try {
          await html5QrScanner.start(
            { facingMode: "user" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            onQRCodeScanned,
            () => {}
          );
          statusEl.innerHTML = '<i class="fas fa-check-circle" style="color: #4CAF50;"></i> Cámara frontal activa';
          document.getElementById('btnCambiarCamara').style.display = 'inline-flex';
        } catch (err2) {
          statusEl.innerHTML = `<i class="fas fa-exclamation-triangle" style="color: #ff6b6b;"></i> No se pudo acceder a la cámara. Usa el botón Probar.`;
        }
      }
    }

    function onQRCodeScanned(decodedText, decodedResult) {
      // Vibrar si está disponible
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }

      // Reproducir sonido de éxito (opcional)
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleWw=');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch (e) {}

      // Detener el escáner
      stopQRScanner();

      showToast('¡Código QR escaneado! ✅', 'success');

      // Procesar el código QR
      setTimeout(() => {
        processQRData(decodedText);
      }, 500);
    }

    function processQRData(qrText) {
      try {
        // Intentar parsear como JSON
        const qrData = JSON.parse(qrText);
        
        if (qrData.id) {
          showScannedUserInfo(qrText);
        } else {
          showToast('Código QR no válido para EscolarFam', 'error');
          renderScreens();
        }
      } catch (e) {
        // Si no es JSON, verificar si es un ID numérico
        const idMatch = qrText.match(/\d+/);
        if (idMatch) {
          const qrData = JSON.stringify({ id: parseInt(idMatch[0]) });
          showScannedUserInfo(qrData);
        } else {
          showToast('Formato de código QR no reconocido', 'error');
          renderScreens();
        }
      }
    }

    async function switchCamera() {
      if (!html5QrScanner) return;

      const statusEl = document.getElementById('qr-status');
      statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cambiando cámara...';

      try {
        await html5QrScanner.stop();
        
        // Obtener cámaras disponibles
        const cameras = await Html5Qrcode.getCameras();
        
        if (cameras && cameras.length > 1) {
          // Alternar entre cámaras
          const currentCamera = html5QrScanner.getRunningTrackCameraCapabilities?.()?.deviceId;
          const nextCamera = cameras.find(c => c.id !== currentCamera) || cameras[0];
          
          await html5QrScanner.start(
            nextCamera.id,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            onQRCodeScanned,
            () => {}
          );
          statusEl.innerHTML = '<i class="fas fa-check-circle" style="color: #4CAF50;"></i> Cámara cambiada';
        } else {
          // Si solo hay una cámara, reiniciar
          await startQRScanner();
        }
      } catch (err) {
        console.error('Error cambiando cámara:', err);
        statusEl.innerHTML = '<i class="fas fa-exclamation-triangle" style="color: #ff6b6b;"></i> Error al cambiar cámara';
        await startQRScanner();
      }
    }

    function stopQRScanner() {
      if (html5QrScanner) {
        html5QrScanner.stop().catch(() => {});
        html5QrScanner = null;
      }
    }

    // Función de prueba para simular escaneo
    function testQRScan() {
      stopQRScanner();
      
      // Mostrar modal para ingresar ID de usuario a probar
      showDynamicModal(`
        <div style="padding: 20px; text-align: center;">
          <h3 style="margin-bottom: 20px; color: #333;">
            <i class="fas fa-vial"></i> Probar Escaneo QR
          </h3>
          <p style="color: #666; margin-bottom: 15px; font-size: 14px;">
            Ingresa el ID del usuario que deseas consultar:
          </p>
          <input type="number" id="testUserId" placeholder="ID de usuario" 
            style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 10px; font-size: 16px; margin-bottom: 20px;">
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button onclick="closeDynamicModal(); renderScreens();" 
              style="padding: 12px 24px; border: none; border-radius: 25px; background: #ddd; cursor: pointer;">
              Cancelar
            </button>
            <button onclick="executeTestScan()" 
              style="padding: 12px 24px; border: none; border-radius: 25px; background: linear-gradient(135deg, #FFB347, #FF9E2C); color: white; cursor: pointer; font-weight: bold;">
              <i class="fas fa-search"></i> Buscar
            </button>
          </div>
        </div>
      `);
    }

    window.executeTestScan = function() {
      const userId = document.getElementById('testUserId').value;
      if (!userId) {
        showToast('Ingresa un ID de usuario', 'warning');
        return;
      }
      
      closeDynamicModal();
      const qrData = JSON.stringify({ id: parseInt(userId) });
      showToast('Buscando usuario...', 'info');
      setTimeout(() => {
        showScannedUserInfo(qrData);
      }, 500);
    };

    async function showScannedUserInfo(qrDataString) {
      try {
        // Parsear los datos del QR
        const userData = JSON.parse(qrDataString);
        
        // Obtener información adicional del usuario desde la BD
        const response = await fetch(`/api/usuarios/${userData.id}`);
        if (!response.ok) throw new Error('Usuario no encontrado');
        
        const userInfo = await response.json();
        
        const modal = document.getElementById('friendsModal');
        const modalContent = modal.querySelector('.modal-content');
        
        // HTML para la foto
        const photoHTML = userInfo.foto_perfil 
          ? `<img src="${userInfo.foto_perfil}" alt="${userInfo.nombre_completo}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">`
          : `<div style="font-size: 50px;">👤</div>`;
        
        // Construir sección de relacionados según el rol
        let relatedSection = '';
        
        if (userInfo.rol === 'alumno') {
          // Obtener padres del alumno
          try {
            const padresResp = await fetch(`/api/usuarios/${userInfo.id_usuario}/padres`);
            if (padresResp.ok) {
              const padres = await padresResp.json();
              if (padres.length > 0) {
                relatedSection = `
                  <div class="qr-info-section">
                    <div class="qr-section-title">
                      <i class="fas fa-users"></i> Padres/Tutores
                    </div>
                    <div class="qr-related-list">
                      ${padres.map(padre => `
                        <div class="qr-related-item">
                          <div class="qr-related-emoji">${padre.foto_perfil ? `<img src="${padre.foto_perfil}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">` : '👤'}</div>
                          <div class="qr-related-info">
                            <div class="qr-related-name">${padre.nombre_completo}</div>
                            <div class="qr-related-role">${padre.parentesco || 'Tutor'}</div>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                `;
              }
            }
          } catch (error) {
            console.error('Error cargando padres:', error);
          }
        } else if (userInfo.rol === 'padre') {
          // Obtener hijos del padre
          try {
            const hijosResp = await fetch(`/api/usuarios/${userInfo.id_usuario}/hijos`);
            if (hijosResp.ok) {
              const hijos = await hijosResp.json();
              if (hijos.length > 0) {
                relatedSection = `
                  <div class="qr-info-section">
                    <div class="qr-section-title">
                      <i class="fas fa-child"></i> Hijos
                    </div>
                    <div class="qr-related-list">
                      ${hijos.map(hijo => `
                        <div class="qr-related-item">
                          <div class="qr-related-emoji">${hijo.foto_perfil ? `<img src="${hijo.foto_perfil}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">` : '👦'}</div>
                          <div class="qr-related-info">
                            <div class="qr-related-name">${hijo.nombre_completo}</div>
                            <div class="qr-related-role">Alumno - Grupo ${hijo.nombre_grupo || 'N/A'}</div>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                `;
              }
            }
          } catch (error) {
            console.error('Error cargando hijos:', error);
          }
        }
        
        // Variable para guardar los padres del alumno escaneado
        let padresDelAlumno = [];
        
        // Construir botones de acción según el rol del usuario actual y el escaneado
        let actionButtons = '';
        
        if (userInfo.rol === 'alumno') {
          // Obtener padres del alumno para poder enviarles mensaje
          try {
            const padresResp = await fetch(`/api/usuarios/${userInfo.id_usuario}/padres`);
            if (padresResp.ok) {
              padresDelAlumno = await padresResp.json();
            }
          } catch (e) {
            console.error('Error obteniendo padres:', e);
          }
          
          // 1. Botón de Mensaje al alumno
          actionButtons += `
            <button class="qr-action-btn message" onclick="closeModal('friendsModal'); openChatById(${userInfo.id_usuario}, '${userInfo.nombre_completo.replace(/'/g, "\\'")}')">
              <i class="fas fa-comment"></i> Enviar Mensaje
            </button>
          `;
          
          // 2. Botón de Asistencia (solo si es maestro o admin quien escanea)
          if (currentRole === 'maestro' || currentRole === 'admin') {
            actionButtons += `
              <button class="qr-action-btn attendance" onclick="registrarAsistenciaQR(${userInfo.id_usuario}, '${userInfo.nombre_completo.replace(/'/g, "\\'")}')">
                <i class="fas fa-clipboard-check"></i> Registrar Asistencia
              </button>
            `;
          }
          
          // 3. Botones para enviar mensaje a los padres
          if (padresDelAlumno.length > 0) {
            padresDelAlumno.forEach(padre => {
              actionButtons += `
                <button class="qr-action-btn message-parent" onclick="closeModal('friendsModal'); openChatById(${padre.id_usuario}, '${padre.nombre_completo.replace(/'/g, "\\'")}')">
                  <i class="fas fa-user-friends"></i> Mensaje a ${padre.parentesco || 'Tutor'}: ${padre.nombre_completo.split(' ')[0]}
                </button>
              `;
            });
          }
          
          // Alerta de enfermedad (solo maestro/admin)
          if (currentRole === 'admin' || currentRole === 'maestro') {
            actionButtons += `
              <button class="qr-action-btn alert-illness" onclick="sendIllnessAlert('${userInfo.nombre_completo}', ${userInfo.id_usuario})">
                <i class="fas fa-heartbeat"></i> Alerta de Enfermedad
              </button>
            `;
          }
          
        } else if (userInfo.rol === 'padre') {
          // Mensaje al padre
          actionButtons += `
            <button class="qr-action-btn message" onclick="closeModal('friendsModal'); openChatById(${userInfo.id_usuario}, '${userInfo.nombre_completo.replace(/'/g, "\\'")}')">
              <i class="fas fa-comment"></i> Enviar Mensaje
            </button>
          `;
        } else if (userInfo.rol === 'maestro') {
          // Mensaje al maestro
          actionButtons += `
            <button class="qr-action-btn message" onclick="closeModal('friendsModal'); openChatById(${userInfo.id_usuario}, '${userInfo.nombre_completo.replace(/'/g, "\\'")}')">
              <i class="fas fa-comment"></i> Enviar Mensaje
            </button>
          `;
        } else {
          // Otros roles
          actionButtons += `
            <button class="qr-action-btn message" onclick="closeModal('friendsModal'); openChatById(${userInfo.id_usuario}, '${userInfo.nombre_completo.replace(/'/g, "\\'")}')">
              <i class="fas fa-comment"></i> Enviar Mensaje
            </button>
          `;
        }
        
        // Agregar botón de agregar amigo (excepto para admin y si no es el mismo usuario)
        if (userInfo.id_usuario !== idUsuarioActual && userInfo.rol !== 'admin') {
          actionButtons += `
            <button class="qr-action-btn add-friend" onclick="addFriend(${userInfo.id_usuario}, '${userInfo.nombre_completo.replace(/'/g, "\\'")}')">
              <i class="fas fa-user-plus"></i> Agregar a Amigos
            </button>
          `;
        }
        
        modalContent.innerHTML = `
          <div class="modal-header">
            <div class="modal-title">
              <i class="fas fa-qrcode"></i> Información del Usuario
            </div>
            <button class="modal-close" onclick="closeModal('friendsModal')">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="info-content">
            <div class="info-photo">${photoHTML}</div>
            <div class="info-name">${userInfo.nombre_completo}</div>
            <div class="info-details">
              <div class="info-item">
                <span class="info-label">Rol:</span>
                <span class="info-value">${userInfo.rol.charAt(0).toUpperCase() + userInfo.rol.slice(1)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Asignación:</span>
                <span class="info-value">${userInfo.asignacion || 'N/A'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">${userInfo.email}</span>
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
      } catch (error) {
        console.error('Error al procesar QR:', error);
        showToast('Error al leer el código QR', 'error');
      }
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
      setTimeout(async () => {
        await showScreen('consultas');
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
      setTimeout(async () => {
        await showScreen('consultas');
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

    async function saveProfileChanges() {
      // Obtener valores del formulario
      const emailEl = document.getElementById('profileEmail');
      const currentPwdEl = document.getElementById('profileCurrentPassword');
      const newPwdEl = document.getElementById('profileNewPassword');

      if (!idUsuarioActual) {
        showToast('Usuario no identificado. Vuelve a iniciar sesión.', 'error');
        return;
      }

      const email = emailEl ? emailEl.value.trim() : '';
      const currentPassword = currentPwdEl ? currentPwdEl.value : '';
      const newPassword = newPwdEl ? newPwdEl.value : '';

      try {
        // 1) Actualizar correo si cambió
        if (email && datosUsuarioActual && email !== datosUsuarioActual.email) {
          const resp = await fetch(`/api/usuarios/${idUsuarioActual}/email`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });

          const data = await resp.json();
          if (!resp.ok) throw new Error(data.error || data.message || 'Error actualizando correo');

          // Actualizar sesión local
          datosUsuarioActual.email = email;
          if (localStorage.getItem('escolarfam_sesion')) {
            const s = JSON.parse(localStorage.getItem('escolarfam_sesion'));
            s.datos = datosUsuarioActual;
            localStorage.setItem('escolarfam_sesion', JSON.stringify(s));
          }
          showToast('Correo actualizado ✅', 'success');
        }

        // 2) Cambiar contraseña si el usuario suministró nueva contraseña
        if (newPassword) {
          if (!currentPassword) {
            showToast('Ingresa la contraseña actual para cambiar a una nueva', 'error');
            return;
          }

          const respPwd = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: idUsuarioActual, currentPassword, newPassword })
          });

          const pwdData = await respPwd.json();
          if (!respPwd.ok) throw new Error(pwdData.error || pwdData.message || 'Error cambiando contraseña');

          // Limpiar campos de contraseña
          if (currentPwdEl) currentPwdEl.value = '';
          if (newPwdEl) newPwdEl.value = '';
          showToast('Contraseña actualizada ✅', 'success');
        }

        // 3) Actualizar datos de la escuela si es admin
        if (currentRole === 'admin' || rolUsuarioActual === 'admin') {
          const schoolNameEl = document.getElementById('schoolName');
          const schoolAddressEl = document.getElementById('schoolAddress');
          const schoolPhoneEl = document.getElementById('schoolPhone');
          const schoolPostalCodeEl = document.getElementById('schoolPostalCode');
          const schoolWebsiteEl = document.getElementById('schoolWebsite');

          if (schoolNameEl && schoolAddressEl && schoolPhoneEl && schoolPostalCodeEl && schoolWebsiteEl) {
            const schoolData = {
              nombre_escuela: schoolNameEl.value.trim(),
              direccion: schoolAddressEl.value.trim(),
              telefono: schoolPhoneEl.value.trim(),
              codigo_postal: schoolPostalCodeEl.value.trim(),
              sitio_web: schoolWebsiteEl.value.trim(),
              activa: 1
            };

            if (schoolData.nombre_escuela) {
              const respSchool = await fetch(`/api/escuelas/${datosUsuarioActual.id_escuela}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(schoolData)
              });

              if (respSchool.ok) {
                showToast('Datos de la escuela actualizados ✅', 'success');
              } else {
                const schoolError = await respSchool.json();
                throw new Error(schoolError.error || 'Error al actualizar datos de la escuela');
              }
            }
          }
        }

        if (!newPassword && (!email || (datosUsuarioActual && email === datosUsuarioActual.email))) {
          showToast('Cambios guardados correctamente ✅', 'success');
        }
      } catch (error) {
        console.error('Error al guardar perfil:', error);
        showToast(error.message || 'Error al guardar perfil', 'error');
      }
    };

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

    // Modal dinámico para contenido HTML
    window.showDynamicModal = function(htmlContent) {
      // Remover modal existente si hay uno
      const existingModal = document.getElementById('dynamicModal');
      if (existingModal) existingModal.remove();
      
      // Crear nuevo modal
      const modalHTML = `
        <div id="dynamicModal" class="dynamic-modal-overlay" onclick="if(event.target === this) closeDynamicModal()">
          <div class="dynamic-modal-content">
            <button class="dynamic-modal-close" onclick="closeDynamicModal()">
              <i class="fas fa-times"></i>
            </button>
            ${htmlContent}
          </div>
        </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      
      // Animar entrada
      setTimeout(() => {
        document.getElementById('dynamicModal')?.classList.add('show');
      }, 10);
    };

    window.closeDynamicModal = function() {
      const modal = document.getElementById('dynamicModal');
      if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
      }
    };

    async function renderFriendsList() {
      const friendsList = document.getElementById('friendsList');
      
      if (!friendsList) return;
      
      // Mostrar loading
      friendsList.innerHTML = `
        <div style="text-align: center; padding: 30px; color: #999;">
          <i class="fas fa-spinner fa-spin" style="font-size: 24px;"></i>
          <p style="margin-top: 10px;">Cargando amigos...</p>
        </div>
      `;
      
      try {
        const response = await fetch(`/api/amigos/${idUsuarioActual}`);
        if (!response.ok) throw new Error('Error al cargar amigos');
        
        const amigos = await response.json();
        
        if (amigos.length === 0) {
          friendsList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #999;">
              <i class="fas fa-user-friends" style="font-size: 50px; color: #ddd; margin-bottom: 15px;"></i>
              <p style="font-size: 16px; margin-bottom: 10px;">No tienes amigos aún</p>
              <p style="font-size: 13px; color: #bbb;">Escanea el QR del gafete de alguien para agregarlo</p>
            </div>
          `;
          return;
        }
        
        // Determinar estado online (activo en últimos 5 minutos)
        const now = new Date();
        
        const friendsHTML = amigos.map(amigo => {
          const photoHTML = amigo.foto_perfil 
            ? `<img src="${amigo.foto_perfil}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">`
            : '<i class="fas fa-user"></i>';
          
          const lastAccess = amigo.ultimo_acceso ? new Date(amigo.ultimo_acceso) : null;
          const minutesSinceAccess = lastAccess ? Math.floor((now - lastAccess) / 60000) : Infinity;
          
          let status = 'offline';
          let statusColor = '#999';
          if (minutesSinceAccess < 5) {
            status = 'online';
            statusColor = '#4CAF50';
          } else if (minutesSinceAccess < 30) {
            status = 'away';
            statusColor = '#FF9800';
          }
          
          const rolLabel = {
            'admin': 'Administrador',
            'maestro': 'Maestro(a)',
            'padre': 'Padre/Madre',
            'alumno': 'Alumno(a)'
          }[amigo.rol] || amigo.rol;
          
          return `
            <div class="friend-item" onclick="openChatWithFriend(${amigo.id_usuario}, '${amigo.nombre_completo.replace(/'/g, "\\'")}')">
              <div class="friend-avatar">${photoHTML}</div>
              <div class="friend-info">
                <div class="friend-name">${amigo.nombre_completo}</div>
                <div class="friend-role">${rolLabel}</div>
              </div>
              <div class="friend-status" style="background: ${statusColor};"></div>
            </div>
          `;
        }).join('');

        friendsList.innerHTML = friendsHTML;
      } catch (error) {
        console.error('Error cargando amigos:', error);
        friendsList.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #ff6b6b;">
            <i class="fas fa-exclamation-circle" style="font-size: 40px; margin-bottom: 10px;"></i>
            <p>Error al cargar amigos</p>
          </div>
        `;
      }
    }

    // Función para abrir chat con amigo
    window.openChatWithFriend = function(userId, userName) {
      closeModal('friendsModal');
      openChatById(userId, userName);
    };

    // Función para agregar amigo desde el QR escaneado
    window.addFriend = async function(friendId, friendName) {
      try {
        const response = await fetch('/api/amigos/agregar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_usuario: idUsuarioActual,
            id_amigo: friendId
          })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          if (result.error && result.error.includes('ya son amigos')) {
            showToast(`Ya tienes a ${friendName} como amigo`, 'info');
          } else {
            throw new Error(result.error || 'Error al agregar amigo');
          }
          return;
        }
        
        showToast(`${friendName} agregado a tus amigos`, 'success');
        closeModal('friendsModal');
        
        // Actualizar lista de amigos si está visible
        if (document.getElementById('friendsList')) {
          renderFriendsList();
        }
      } catch (error) {
        console.error('Error al agregar amigo:', error);
        showToast('Error al agregar amigo: ' + error.message, 'error');
      }
    };

    // Función para registrar asistencia desde el QR escaneado
    window.registrarAsistenciaQR = async function(idAlumno, nombreAlumno) {
      showDynamicModal(`
        <div style="padding: 20px; text-align: center;">
          <h3 style="margin-bottom: 20px; color: #333;">
            <i class="fas fa-clipboard-check" style="color: #4CAF50;"></i> Registrar Asistencia
          </h3>
          <p style="color: #666; margin-bottom: 20px;">
            Alumno: <strong>${nombreAlumno}</strong>
          </p>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button onclick="confirmarAsistencia(${idAlumno}, 'presente', '${nombreAlumno.replace(/'/g, "\\'")}')" 
              style="padding: 15px; border: none; border-radius: 10px; background: #4CAF50; color: white; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
              <i class="fas fa-check-circle"></i> Presente
            </button>
            <button onclick="confirmarAsistencia(${idAlumno}, 'tarde', '${nombreAlumno.replace(/'/g, "\\'")}')" 
              style="padding: 15px; border: none; border-radius: 10px; background: #FF9800; color: white; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
              <i class="fas fa-clock"></i> Tarde
            </button>
            <button onclick="confirmarAsistencia(${idAlumno}, 'ausente', '${nombreAlumno.replace(/'/g, "\\'")}')" 
              style="padding: 15px; border: none; border-radius: 10px; background: #f44336; color: white; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
              <i class="fas fa-times-circle"></i> Ausente
            </button>
            <button onclick="confirmarAsistencia(${idAlumno}, 'justificado', '${nombreAlumno.replace(/'/g, "\\'")}')" 
              style="padding: 15px; border: none; border-radius: 10px; background: #2196F3; color: white; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
              <i class="fas fa-file-medical"></i> Justificado
            </button>
          </div>
          <button onclick="closeDynamicModal()" 
            style="margin-top: 15px; padding: 12px 30px; border: none; border-radius: 25px; background: #ddd; cursor: pointer;">
            Cancelar
          </button>
        </div>
      `);
    };

    window.confirmarAsistencia = async function(idAlumno, estado, nombreAlumno) {
      try {
        const response = await fetch('/api/asistencia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_alumno: idAlumno,
            id_maestro: idUsuarioActual,
            estado: estado,
            fecha: new Date().toISOString().split('T')[0]
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Error al registrar asistencia');
        }
        
        closeDynamicModal();
        closeModal('friendsModal');
        
        const estadoTexto = {
          'presente': 'Presente ✅',
          'tarde': 'Tarde ⏰',
          'ausente': 'Ausente ❌',
          'justificado': 'Justificado 📋'
        };
        
        showToast(`Asistencia de ${nombreAlumno}: ${estadoTexto[estado]}`, 'success');
      } catch (error) {
        console.error('Error registrando asistencia:', error);
        showToast('Error al registrar asistencia: ' + error.message, 'error');
      }
    };

    // Función para manejar cambios en el tipo de aviso
    window.handleAvisoTipoChange = function() {
      const tipo = document.getElementById('avisoTipo').value;
      const mensajePredefinidoDiv = document.getElementById('mensajePredefinido');
      const textoPredefinidoDiv = document.getElementById('textoPredefinido');
      
      const mensajesPredefinidos = {
        'llegar_tarde': 'Estimado/a maestro/a, le informo que llegaré tarde hoy por motivos de tráfico/transporte. Aproximadamente estaré llegando [HORA]. Gracias por su comprensión.',
        'enfermo': 'Buenos días, mi hijo/a no podrá asistir a clases hoy debido a que se encuentra enfermo/a. Estaré pendiente de las actividades del día para que no se atrase. Gracias.',
        'emergencia': 'Estimado/a maestro/a, debido a una emergencia familiar, necesito retirar a mi hijo/a de la escuela. Me pondré en contacto para las actividades pendientes.',
        'cita_medica': 'Buenos días, mi hijo/a tiene una cita médica hoy a las [HORA], por lo que llegará tarde/se retirará temprano. Adjunto comprobante si es necesario.',
        'tarea_pendiente': 'Estimado/a maestro/a, mi hijo/a no pudo completar la tarea de [MATERIA] debido a [MOTIVO]. ¿Sería posible una extensión o trabajo alternativo?',
        'material_faltante': 'Buenos días, mi hijo/a no trajo el material de [MATERIA] porque [MOTIVO]. Lo enviaré mañana sin falta.',
        'evento_familiar': 'Estimado/a maestro/a, mi hijo/a faltará el [FECHA] debido a un evento familiar importante. Estaré pendiente de las actividades del día.',
        'cambio_recogida': 'Buenos días, hoy una persona diferente recogerá a mi hijo/a. Los datos son: Nombre: [NOMBRE], Parentesco: [PARENTESCO], Documento: [ID].',
        'general': 'Estimado/a maestro/a, quería comunicarle lo siguiente sobre mi hijo/a...'
      };
      
      if (tipo && mensajesPredefinidos[tipo]) {
        textoPredefinidoDiv.textContent = mensajesPredefinidos[tipo];
        mensajePredefinidoDiv.style.display = 'block';
      } else {
        mensajePredefinidoDiv.style.display = 'none';
      }
    };
    
    // Función para usar mensaje predefinido
    window.usarMensajePredefinido = function() {
      const textoPredefinido = document.getElementById('textoPredefinido').textContent;
      const avisoTexto = document.getElementById('avisoTexto');
      avisoTexto.value = textoPredefinido;
      avisoTexto.focus();
    };

    // Función para reproducir sonido de notificación tipo timbre
    window.playNotificationSound = function() {
      return new Promise((resolve) => {
        try {
          // Crear contexto de audio
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          
          // Configuración del timbre calmado
          const duration = 0.7; // 700ms de duración
          const sampleRate = audioContext.sampleRate;
          const frameCount = duration * sampleRate;
          
          // Crear buffer de audio
          const audioBuffer = audioContext.createBuffer(1, frameCount, sampleRate);
          const channelData = audioBuffer.getChannelData(0);
          
          // Generar timbre suave tipo campana escolar
          for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            
            // Frecuencias armónicas para sonido de campana calmada (acorde mayor)
            const freq1 = 523.25; // Do5 (C5) - fundamental
            const freq2 = 659.25; // Mi5 (E5) - tercera mayor  
            const freq3 = 783.99; // Sol5 (G5) - quinta perfecta
            
            // Envolvente exponencial suave para efecto de campana que se desvanece
            const envelope = Math.exp(-t * 2.5);
            
            // Generar ondas sinusoidales armónicas
            const wave1 = Math.sin(2 * Math.PI * freq1 * t) * 0.5;
            const wave2 = Math.sin(2 * Math.PI * freq2 * t) * 0.3;  
            const wave3 = Math.sin(2 * Math.PI * freq3 * t) * 0.2;
            
            // Combinar ondas con envolvente
            channelData[i] = (wave1 + wave2 + wave3) * envelope * 0.4;
          }
          
          // Configurar y reproducir el sonido
          const source = audioContext.createBufferSource();
          const gainNode = audioContext.createGain();
          
          source.buffer = audioBuffer;
          source.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          // Control de volumen suave
          gainNode.gain.setValueAtTime(0.7, audioContext.currentTime);
          
          // Reproducir una sola vez
          source.start();
          
          // Resolver la promesa cuando termine el sonido
          setTimeout(resolve, duration * 1000);
          
        } catch (error) {
          console.log('Audio no disponible, continuando sin sonido de notificación');
          resolve(); // Resolver inmediatamente si hay error
        }
      });
    };

    // Función para reproducir aviso con texto a voz
    window.playPickupAnnouncement = async function(studentName, solicitudId) {
      try {
        // Verificar soporte de síntesis de voz
        if (!window.speechSynthesis) {
          showToast('Tu navegador no soporta síntesis de voz', 'error');
          return;
        }

        // Cancelar cualquier síntesis de voz en curso
        speechSynthesis.cancel();

        // Obtener información del alumno (grupo/grado)
        let grupoInfo = '';
        try {
          const response = await fetch(`/api/usuarios/${solicitudId}/info-recogida`);
          if (response.ok) {
            const data = await response.json();
            grupoInfo = data.nombre_grupo || '';
          }
        } catch (error) {
          console.log('No se pudo obtener información del grupo');
        }

        // Función para convertir grado numérico a palabra hablada
        const convertirGradoAVoz = (grupo) => {
          if (!grupo) return '';
          
          console.log('Grupo original:', grupo); // Debug
          
          const gradosMap = {
            '1': 'primero',
            '2': 'segundo', 
            '3': 'tercero',
            '4': 'cuarto',
            '5': 'quinto',
            '6': 'sexto'
          };
          
          // Buscar patrón como "1° A", "1°-A", "2-B", "3A", etc.
          const match = grupo.match(/(\d+)[°\s-]*([A-Za-z]+)/);
          if (match) {
            const [, grado, seccion] = match;
            console.log('Grado capturado:', grado, 'Sección:', seccion); // Debug
            const gradoEnPalabras = gradosMap[grado] || grado;
            const resultado = `${gradoEnPalabras} ${seccion}`;
            console.log('Resultado conversión:', resultado); // Debug
            return resultado;
          }
          
          console.log('No se encontró patrón, devolviendo grupo original'); // Debug
          return grupo;
        };

        // Crear mensaje de voz completo con emoción
        const grupoVoz = grupoInfo ? convertirGradoAVoz(grupoInfo) : '';
        const mensaje = grupoVoz 
          ? `¡${studentName}, de ${grupoVoz}!`
          : `¡${studentName}!`;
        
        // Configurar síntesis de voz con más emoción
        const utterance = new SpeechSynthesisUtterance(mensaje);
        utterance.lang = 'es-ES';
        utterance.rate = 0.8;    // Más lento para claridad
        utterance.pitch = 1.2;   // Más agudo para emoción
        utterance.volume = 1.0;  // Volumen máximo
        
        // Buscar voz femenina en español para más emoción
        const voices = speechSynthesis.getVoices();
        const spanishFemaleVoice = voices.find(voice => 
          voice.lang.startsWith('es') && voice.name.toLowerCase().includes('female')
        );
        const spanishVoice = spanishFemaleVoice || voices.find(voice => voice.lang.startsWith('es'));
        
        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }
        
        // Reproducir sonido de notificación primero
        await playNotificationSound();
        
        // Esperar un poco antes del anuncio del nombre
        setTimeout(() => {
          // Asegurar que no haya otra síntesis corriendo
          if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
          }
          // Reproducir una sola vez
          speechSynthesis.speak(utterance);
        }, 800);
        
        // Enviar también al cerebro del director
        await fetch('/api/avisos/reproducir', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: studentName,
            solicitudId: solicitudId,
            maestroId: idUsuarioActual,
            mensaje: mensaje,
            grupoInfo: grupoInfo
          })
        });
        
        showToast(`🔊 ${mensaje}`, 'info');
        
      } catch (error) {
        console.error('Error al reproducir aviso:', error);
        showToast('Error al reproducir aviso', 'error');
      }
    };

    // Funciones de burbujas interactivas
    function showBubbleOptions(person, options) {
      const overlay = document.getElementById('bubbleOverlay');
      const bubbleOptions = document.getElementById('bubbleOptions');
      
      // Mostrar foto o emoji en el centro
      const centerContent = person.foto_perfil 
        ? `<img src="${person.foto_perfil}" alt="${person.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
        : person.emoji;
      
      let optionsHTML = `<div class="bubble-center">${centerContent}</div>`;
      
      options.forEach((option, index) => {
        const personData = JSON.stringify(person).replace(/"/g, '&quot;');
        optionsHTML += `
          <button class="bubble-option" onclick='handleBubbleAction("${option.action}", ${personData})'>
            <i class="${option.icon}"></i>
            <span>${option.label}</span>
          </button>
        `;
      });
      
      bubbleOptions.innerHTML = optionsHTML;
      overlay.classList.add('show');
    }

    async function handleBubbleAction(action, person) {
      const overlay = document.getElementById('bubbleOverlay');
      overlay.classList.remove('show');
      
      switch(action) {
        case 'alert':
          // Enviar alerta de recogida al maestro
          await enviarAlertaRecogida(person);
          break;
        case 'edit':
          // Abrir edición de perfil del hijo
          await showEditProfile(person);
          break;
        case 'message':
          // Abrir chat con el hijo
          if (person.id) {
            await openChatById(person.id, person.name);
          } else {
            showChatInterface(person.name);
          }
          break;
        case 'aviso':
          // Mostrar modal para enviar aviso al hijo
          await mostrarModalAviso(person);
          break;
        case 'permission':
          showToast(`Solicitando permiso de salida`, 'info');
          break;
        case 'info':
          showInfoModal(person);
          break;
        case 'ticket':
          // Abrir modal para crear ticket al director
          showTicketModal(person);
          break;
      }
    }

    async function enviarAlertaRecogida(hijo) {
      if (!idUsuarioActual || !hijo.id) {
        showToast('Error: No se pudo identificar al usuario o al hijo', 'error');
        return;
      }

      try {
        const response = await fetch('/api/recogidas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_padre: idUsuarioActual,
            id_hijo: hijo.id,
            observaciones: `He llegado para recoger a ${hijo.name}`,
            id_escuela: idEscuelaActual || datosUsuarioActual?.id_escuela
          })
        });

        const data = await response.json();
        
        if (response.ok) {
          if (data.ya_existe) {
            showToast(`ℹ️ Ya existe una alerta pendiente para ${hijo.name}`, 'info');
          } else {
            showToast(`✅ Alerta enviada al maestro de ${hijo.name}`, 'success');
          }
        } else {
          throw new Error(data.message || 'Error al enviar la alerta');
        }
      } catch (error) {
        console.error('Error enviando alerta:', error);
        showToast(error.message || 'Error al enviar la alerta', 'error');
      }
    }

    async function mostrarModalAviso(hijo) {
      const modal = document.getElementById('friendsModal');
      const modalContent = modal.querySelector('.modal-content');
      
      // HTML para la foto del hijo
      const photoHTML = hijo.foto_perfil 
        ? `<img src="${hijo.foto_perfil}" alt="${hijo.name}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">`
        : `<div style="font-size: 50px;">${hijo.emoji || '👦'}</div>`;
      
      modalContent.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">
            <i class="fas fa-bell"></i> Enviar Aviso
          </div>
          <button class="modal-close" onclick="closeModal('friendsModal')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="info-content">
          <div class="info-photo">${photoHTML}</div>
          <div class="info-name">${hijo.name}</div>
          
          <div style="margin: 20px 0;">
            <label class="form-label">
              <i class="fas fa-bullhorn"></i> Mensaje del aviso
            </label>
            <textarea 
              id="avisoTexto" 
              class="form-input" 
              rows="4" 
              placeholder="Escribe aquí el aviso para ${hijo.name}..."
              style="resize: vertical; min-height: 100px; font-family: inherit;"
            ></textarea>
          </div>
          
          <div style="margin: 20px 0;">
            <label class="form-label">
              <i class="fas fa-tag"></i> Tipo de aviso
            </label>
            <select id="avisoTipo" class="form-input" onchange="handleAvisoTipoChange()">
              <option value="">Seleccionar tipo de aviso</option>
              <optgroup label="🚨 Avisos Urgentes">
                <option value="llegar_tarde">⏰ Voy a llegar tarde</option>
                <option value="enfermo">🤒 Alumno enfermo</option>
                <option value="emergencia">🚑 Emergencia familiar</option>
                <option value="cita_medica">🏥 Cita médica</option>
              </optgroup>
              <optgroup label="📋 Avisos Académicos">
                <option value="tarea_pendiente">📚 Tarea pendiente</option>
                <option value="material_faltante">📝 Material faltante</option>
                <option value="evento_familiar">👨‍👩‍👧‍👦 Evento familiar</option>
                <option value="cambio_recogida">🚗 Cambio en recogida</option>
              </optgroup>
              <optgroup label="💬 Otros">
                <option value="general">💬 General</option>
                <option value="personalizado">✏️ Personalizado</option>
              </optgroup>
            </select>
          </div>
          
          <div id="mensajePredefinido" style="margin: 15px 0; display: none;">
            <div class="predefined-message">
              <i class="fas fa-lightbulb"></i> 
              <strong>Mensaje sugerido:</strong>
              <div id="textoPredefinido" style="background: #f8f9fa; padding: 10px; border-radius: 8px; margin-top: 8px; font-style: italic;"></div>
              <button type="button" class="btn-use-predefined" onclick="usarMensajePredefinido()" style="margin-top: 8px; padding: 5px 10px; background: #28a745; color: white; border: none; border-radius: 5px; font-size: 12px;">
                <i class="fas fa-copy"></i> Usar este mensaje
              </button>
            </div>
          </div>
          
          <button class="save-button" onclick="enviarAvisoHijo(${hijo.id}, '${hijo.name.replace(/'/g, "\\'")}')">
            <i class="fas fa-paper-plane"></i> Enviar Aviso
          </button>
        </div>
      `;
      
      modal.classList.add('show');
    }

    async function enviarAvisoHijo(idHijo, nombreHijo) {
      const texto = document.getElementById('avisoTexto').value.trim();
      const tipo = document.getElementById('avisoTipo').value;
      
      if (!texto) {
        showToast('Por favor escribe un mensaje para el aviso', 'error');
        return;
      }
      
      if (!tipo) {
        showToast('Por favor selecciona el tipo de aviso', 'error');
        return;
      }
      
      try {
        // Enviar aviso usando el nuevo endpoint
        const response = await fetch('/api/avisos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_padre: idUsuarioActual,
            id_hijo: idHijo,
            tipo_aviso: tipo,
            mensaje: texto,
            id_escuela: idEscuelaActual || datosUsuarioActual?.id_escuela
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          showToast(`✅ Aviso enviado - Ticket #${result.ticketId} creado para dirección`, 'success');
          closeModal('friendsModal');
        } else {
          const error = await response.json();
          throw new Error(error.message || 'Error al enviar el aviso');
        }
      } catch (error) {
        console.error('Error enviando aviso:', error);
        showToast(error.message || 'Error al enviar el aviso', 'error');
      }
    }

    async function showEditProfile(person) {
      // Si person es un hijo (tiene ID), cargar sus datos reales
      let userData = person;
      
      if (person.id) {
        try {
          const response = await fetch(`/api/usuarios/${person.id}`);
          if (response.ok) {
            userData = await response.json();
          }
        } catch (error) {
          console.error('Error cargando datos del usuario:', error);
        }
      }

      const mainContent = document.getElementById('mainContent');
      
      // Usar los datos del hijo para renderizar
      const nombre = userData.nombre_completo || person.name;
      const emailValue = userData.email || '';
      const rolValue = userData.rol || 'alumno';
      const asignacionValue = userData.asignacion || person.group || 'N/A';
      const fotoValue = userData.foto_perfil || person.foto_perfil || null;
      
      // Generar HTML para la foto
      const photoHTML = fotoValue 
        ? `<img src="${fotoValue}" alt="Foto de perfil" class="profile-photo-image">`
        : `<div class="profile-photo-emoji">${person.emoji || '👦'}</div>`;

      mainContent.innerHTML = `
        <div class="screen-container">
          <div class="screen">
            <div class="profile-screen">
              <button class="back-button" onclick="showScreen('hijos')" style="position: fixed; top: 80px; left: 20px; z-index: 100;">
                <i class="fas fa-arrow-left"></i>
              </button>
              
              <div class="profile-photo-section">
                <div class="profile-photo-large" id="profilePhotoContainer" onclick="changeChildProfilePhoto(${person.id})">${photoHTML}</div>
                <div style="color: #FFB347; font-weight: bold;">Toca para cambiar foto</div>
                <input type="file" id="photoFileInput" accept="image/*" style="display: none;">
              </div>
              
              <div class="profile-form">
                <div class="config-title">Información Personal</div>
                <div class="form-group">
                  <label class="form-label">Nombre Completo</label>
                  <input type="text" class="form-input" id="childProfileName" value="${nombre}" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">Rol</label>
                  <input type="text" class="form-input" id="childProfileRole" value="${rolValue}" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">Asignación</label>
                  <input type="text" class="form-input" id="childProfileAssignment" value="${asignacionValue}" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">Correo Electrónico</label>
                  <input type="email" class="form-input" id="childProfileEmail" value="${emailValue}">
                </div>
                <div class="form-group">
                  <label class="form-label">Nueva Contraseña</label>
                  <input type="password" class="form-input" id="childProfileNewPassword" placeholder="Dejar vacío para mantener actual">
                </div>
                <div class="form-group">
                  <label class="form-label">Confirmar Nueva Contraseña</label>
                  <input type="password" class="form-input" id="childProfileConfirmPassword" placeholder="Confirmar contraseña">
                </div>
              </div>

              <button class="save-button" onclick="saveChildProfileChanges(${person.id})">
                <i class="fas fa-save"></i> Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      `;
    }

    async function changeChildProfilePhoto(idHijo) {
      const fileInput = document.getElementById('photoFileInput');
      fileInput.click();
      
      fileInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
          showToast('Por favor selecciona una imagen válida', 'error');
          return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
          showToast('La imagen es muy grande (máx 5MB)', 'error');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
          const preview = event.target.result;
          const container = document.getElementById('profilePhotoContainer');
          if (container) {
            container.innerHTML = `<img src="${preview}" alt="Foto de perfil" class="profile-photo-image">`;
          }
        };
        reader.readAsDataURL(file);
        
        try {
          const formData = new FormData();
          formData.append('foto', file);
          
          const response = await fetch(`/api/usuarios/${idHijo}/upload-foto`, {
            method: 'POST',
            body: formData
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || data.message || 'Error al subir la foto');
          }
          
          showToast('Foto actualizada ✅', 'success');
        } catch (error) {
          console.error('Error al subir foto:', error);
          showToast(error.message || 'Error al subir la foto', 'error');
        }
        
        fileInput.value = '';
      }, { once: true });
    }

    async function saveChildProfileChanges(idHijo) {
      const emailEl = document.getElementById('childProfileEmail');
      const newPwdEl = document.getElementById('childProfileNewPassword');
      const confirmPwdEl = document.getElementById('childProfileConfirmPassword');

      const email = emailEl ? emailEl.value.trim() : '';
      const newPassword = newPwdEl ? newPwdEl.value : '';
      const confirmPassword = confirmPwdEl ? confirmPwdEl.value : '';

      try {
        // Actualizar correo si cambió
        if (email) {
          const resp = await fetch(`/api/usuarios/${idHijo}/email`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });

          const data = await resp.json();
          if (!resp.ok) throw new Error(data.error || data.message || 'Error actualizando correo');
          showToast('Correo actualizado ✅', 'success');
        }

        // Cambiar contraseña si se proporcionó
        if (newPassword) {
          if (newPassword !== confirmPassword) {
            showToast('Las contraseñas no coinciden', 'error');
            return;
          }

          // Para hijos, el padre puede cambiar la contraseña directamente
          const respPwd = await fetch(`/api/usuarios/${idHijo}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              password: newPassword,
              update_password_only: true
            })
          });

          const pwdData = await respPwd.json();
          if (!respPwd.ok) throw new Error(pwdData.error || pwdData.message || 'Error cambiando contraseña');

          if (newPwdEl) newPwdEl.value = '';
          if (confirmPwdEl) confirmPwdEl.value = '';
          showToast('Contraseña actualizada ✅', 'success');
        }

        if (!newPassword && !email) {
          showToast('No hubo cambios', 'info');
        }
      } catch (error) {
        console.error('Error al guardar perfil:', error);
        showToast(error.message || 'Error al guardar perfil', 'error');
      }
    }

    // Variable global para el chat actual
    let currentChatUserId = null;
    let currentChatUserName = null;

    async function openChatById(userId, userName) {
      currentChatUserId = userId;
      currentChatUserName = userName;
      
      const mainContent = document.getElementById('mainContent');
      
      // Obtener datos del contacto
      let contactPhoto = '👤';
      let contactRole = '';
      try {
        const userResponse = await fetch(`/api/usuarios/${userId}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          contactRole = userData.rol || '';
          if (userData.foto_perfil) {
            contactPhoto = `<img src="${userData.foto_perfil}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">`;
          }
        }
      } catch (error) {
        console.error('Error cargando datos del contacto:', error);
      }
      
      // Cargar mensajes
      let messagesHTML = '';
      try {
        const response = await fetch(`/api/mensajes/${idUsuarioActual}/${userId}`);
        if (response.ok) {
          const mensajes = await response.json();
          
          if (mensajes.length > 0) {
            messagesHTML = mensajes.map(msg => {
              const type = msg.id_remitente === idUsuarioActual ? 'sent' : 'received';
              const time = new Date(msg.fecha_envio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
              const isTicketResponse = msg.tipo === 'ticket_respuesta';
              
              return `
                <div class="message ${type} ${isTicketResponse ? 'ticket-message' : ''}">
                  <div class="message-bubble">
                    ${isTicketResponse ? '<div class="ticket-msg-badge"><i class="fas fa-ticket-alt"></i> Respuesta de consulta</div>' : ''}
                    ${msg.contenido}
                    <div class="message-time">${time}</div>
                  </div>
                </div>
              `;
            }).join('');
          } else {
            messagesHTML = '<div style="text-align: center; padding: 20px; color: #999;">No hay mensajes aún. ¡Envía el primero!</div>';
          }
          
          // Marcar mensajes como leídos
          await fetch(`/api/mensajes/marcar-leidos/${userId}/${idUsuarioActual}`, { method: 'PUT' });
        }
      } catch (error) {
        console.error('Error cargando mensajes:', error);
        messagesHTML = '<div style="text-align: center; padding: 20px; color: #ff6b6b;">Error al cargar mensajes</div>';
      }

      // Si el contacto es admin, no mostrar input de mensaje
      const esConversacionConAdmin = contactRole === 'admin';
      const inputHTML = esConversacionConAdmin 
        ? `<div class="chat-input-disabled">
            <i class="fas fa-info-circle"></i>
            <span>No puedes responder mensajes del administrador</span>
          </div>`
        : `<div class="chat-input">
            <input type="text" placeholder="Escribe un mensaje..." id="messageInput" onkeypress="handleMessageKeyPress(event)">
            <button class="chat-send-btn" onclick="sendMessageToCurrentChat()">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>`;

      mainContent.innerHTML = `
        <div class="chat-interface">
          <div class="chat-header">
            <button class="back-button" onclick="showScreen('mensajes')" style="position: static; background: rgba(255,255,255,0.2); border-color: white; color: white;">
              <i class="fas fa-arrow-left"></i>
            </button>
            <div class="chat-avatar-large">${contactPhoto}</div>
            <div class="chat-info">
              <div class="chat-name-large">${userName}</div>
              <div class="chat-status">${esConversacionConAdmin ? 'Administrador' : 'En línea'}</div>
            </div>
          </div>
          <div class="chat-messages" id="chatMessages">
            ${messagesHTML}
          </div>
          ${inputHTML}
        </div>
      `;
      
      // Scroll al final
      setTimeout(() => {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
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

    function showInfoModal(person) {
      const modal = document.getElementById('friendsModal');
      const modalContent = modal.querySelector('.modal-content');
      
      // Si person es string (compatibilidad), buscar por nombre
      if (typeof person === 'string') {
        person = findPersonByName(person);
      }
      
      const fotoContent = person.foto ? 
        `<img src="${person.foto}" alt="${person.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
        person.emoji;
      
      const rolTexto = person.rol === 'admin' ? 'Director' : 
                       person.rol === 'maestro' ? 'Maestro' : 
                       person.subject || person.role || 'Usuario';
      
      modalContent.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">Información del Personal</div>
          <button class="modal-close" onclick="closeModal('friendsModal')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="info-content">
          <div class="info-photo">${fotoContent}</div>
          <div class="info-name">${person.name}</div>
          <div class="info-details">
            <div class="info-item">
              <span class="info-label">Rol:</span>
              <span class="info-value">${rolTexto}</span>
            </div>
            ${person.email ? `
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">${person.email}</span>
            </div>
            ` : ''}
            ${person.asignacion ? `
            <div class="info-item">
              <span class="info-label">Asignación:</span>
              <span class="info-value">${person.asignacion}</span>
            </div>
            ` : ''}
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

    function showTicketModal(director) {
      const modal = document.getElementById('friendsModal');
      const modalContent = modal.querySelector('.modal-content');
      
      const fotoContent = director.foto ? 
        `<img src="${director.foto}" alt="${director.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 50%;">` :
        `<div style="font-size: 40px;">${director.emoji}</div>`;
      
      modalContent.innerHTML = `
        <div class="modal-header">
          <div class="modal-title">Crear Ticket para Director</div>
          <button class="modal-close" onclick="closeModal('friendsModal')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div style="padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            ${fotoContent}
            <div style="margin-top: 10px; font-weight: bold;">${director.name}</div>
            <div style="color: #666; font-size: 12px;">Director</div>
          </div>
          
          <div class="form-group" style="margin-bottom: 15px;">
            <label for="ticketAsunto" style="display: block; margin-bottom: 5px; font-weight: bold;">Asunto:</label>
            <select id="ticketAsunto" class="form-input">
              <option value="">Seleccionar asunto...</option>
              <option value="academico">Asunto Académico</option>
              <option value="administrativo">Asunto Administrativo</option>
              <option value="disciplinario">Asunto Disciplinario</option>
              <option value="infraestructura">Infraestructura</option>
              <option value="personal">Personal Docente</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          
          <div class="form-group" style="margin-bottom: 15px;">
            <label for="ticketPrioridad" style="display: block; margin-bottom: 5px; font-weight: bold;">Prioridad:</label>
            <select id="ticketPrioridad" class="form-input">
              <option value="baja">Baja</option>
              <option value="media" selected>Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
          
          <div class="form-group" style="margin-bottom: 20px;">
            <label for="ticketDescripcion" style="display: block; margin-bottom: 5px; font-weight: bold;">Descripción:</label>
            <textarea id="ticketDescripcion" class="form-input" rows="4" placeholder="Describe detalladamente el asunto o problema..."></textarea>
          </div>
          
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button onclick="closeModal('friendsModal')" class="btn-secondary">
              Cancelar
            </button>
            <button onclick="enviarTicket(${director.id})" class="btn-primary">
              <i class="fas fa-paper-plane"></i> Enviar Ticket
            </button>
          </div>
        </div>
      `;
      
      modal.classList.add('show');
    }

    async function enviarTicket(directorId) {
      const asunto = document.getElementById('ticketAsunto').value;
      const prioridad = document.getElementById('ticketPrioridad').value;
      const descripcion = document.getElementById('ticketDescripcion').value.trim();
      
      if (!asunto) {
        showToast('Selecciona un asunto para el ticket', 'error');
        return;
      }
      
      if (!descripcion) {
        showToast('Ingresa una descripción del problema', 'error');
        return;
      }
      
      try {
        const response = await fetch('/api/usuarios/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_remitente: idUsuarioActual,
            id_destinatario: directorId,
            asunto,
            prioridad,
            descripcion
          })
        });
        
        if (response.ok) {
          showToast('Ticket enviado al director ✅', 'success');
          closeModal('friendsModal');
        } else {
          const error = await response.json();
          showToast(error.error || 'Error al enviar el ticket', 'error');
        }
      } catch (error) {
        console.error('Error al enviar ticket:', error);
        showToast('Error al enviar el ticket', 'error');
      }
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

    async function sendMessageToCurrentChat() {
      const input = document.getElementById('messageInput');
      const messagesContainer = document.getElementById('chatMessages');
      
      if (!input.value.trim() || !currentChatUserId) return;
      
      const contenido = input.value.trim();
      
      try {
        // Enviar mensaje a la BD
        const response = await fetch('/api/mensajes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_remitente: idUsuarioActual,
            id_destinatario: currentChatUserId,
            contenido: contenido,
            tipo: 'personal'
          })
        });
        
        if (response.ok) {
          // Agregar mensaje al DOM
          const now = new Date();
          const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
          
          const messageHTML = `
            <div class="message sent">
              <div class="message-bubble">
                ${contenido}
                <div class="message-time">${time}</div>
              </div>
            </div>
          `;
          
          messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
          input.value = '';
        } else {
          showToast('Error al enviar el mensaje', 'error');
        }
      } catch (error) {
        console.error('Error enviando mensaje:', error);
        showToast('Error al enviar el mensaje', 'error');
      }
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
        if (currentChatUserId) {
          sendMessageToCurrentChat();
        } else {
          sendMessage();
        }
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

    // Variables globales para el login - UNIFICADAS
    let isLoggedIn = false;

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

    

    function logout() {
      // Limpiar datos guardados
      localStorage.removeItem('escolarfam_sesion');
      
      // Resetear variables
      isLoggedIn = false;
      idUsuarioActual = null;
      rolUsuarioActual = null;
      datosUsuarioActual = null;
      
      // Mostrar pantalla de login
      document.getElementById('appContainer').style.display = 'none';
      document.getElementById('loginScreen').style.display = 'flex';
      
      // Limpiar formulario
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
      document.getElementById('rememberMe').checked = false;
      
      showToast('Sesión cerrada correctamente', 'info');
    }

    async function checkSavedLogin() {
      const savedSession = localStorage.getItem('escolarfam_sesion');
      if (savedSession) {
        try {
          const sesion = JSON.parse(savedSession);
          
          // Auto-login si el usuario eligió "No cerrar sesión"
          if (sesion.rememberMe) {
            idUsuarioActual = sesion.id;
            rolUsuarioActual = sesion.rol;
            datosUsuarioActual = sesion.datos;
            isLoggedIn = true;
            
            await mostrarAplicacion();
            showToast(`Bienvenido de nuevo, ${sesion.datos.nombre_completo}`, 'success');
            return true;
          }
        } catch (error) {
          localStorage.removeItem('escolarfam_sesion');
        }
      }
      return false;
    }

    function attachLoginListeners() {
      // Botón de tema en login
      document.getElementById('themeBtn').addEventListener('click', toggleTheme);
      
      // Botón de información
      document.getElementById('infoBtn').addEventListener('click', showInfoModal);
      
      // Formulario de login - Conectar con la BD
      document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nombre_usuario = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        try {
          const respuesta = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              nombre_usuario: nombre_usuario,
              password: password
            })
          });
      
          const datos = await respuesta.json();
      
          if (!respuesta.ok) {
            showToast(datos.message || 'Error en el login', 'error');
            return;
          }
      
          // Guardar datos del usuario logueado
          idUsuarioActual = datos.usuario.id_usuario;
          rolUsuarioActual = datos.usuario.rol;
          datosUsuarioActual = datos.usuario;
          isLoggedIn = true;
      
          // Guardar en localStorage para mantener sesión si lo requiere
          if (rememberMe) {
            localStorage.setItem('escolarfam_sesion', JSON.stringify({
              id: idUsuarioActual,
              rol: rolUsuarioActual,
              datos: datosUsuarioActual,
              rememberMe: true
            }));
          }
      
          // Mostrar la aplicación
          await mostrarAplicacion();
          showToast('¡Bienvenido ' + datos.usuario.nombre_completo + '!', 'success');
      
        } catch (error) {
          showToast('Error de conexión: ' + error.message, 'error');
          console.error('Error en login:', error);
        }
      });
      
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

    async function mostrarAplicacion() {
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('appContainer').style.display = 'flex';
      
      // Establecer el rol en el selector (convertir 'director' a 'admin')
      const rolMostrar = rolUsuarioActual === 'director' ? 'admin' : rolUsuarioActual;
      document.getElementById('roleSelector').value = rolMostrar;
      currentRole = rolMostrar;
      
      // Cargar configuración de la escuela para mostrar el logo
      if (datosUsuarioActual && datosUsuarioActual.id_escuela) {
        try {
          const configResponse = await fetch(`/api/config/escuela/${datosUsuarioActual.id_escuela}`);
          if (configResponse.ok) {
            schoolConfig = await configResponse.json();
            // Guardar logo en localStorage para uso en login futuro
            if (schoolConfig.logo_escuela) {
              localStorage.setItem('escolarfam_logo', schoolConfig.logo_escuela);
            }
          }
        } catch (error) {
          console.log('No se pudo cargar la configuración de la escuela');
        }
      }
      
      // Mostrar botón de registro solo si es admin
      showRegisterButton();
      
      // Renderizar la interfaz (ahora con el logo cargado)
      updateNavigation();
      await renderScreens();
      
      // Agregar listeners a los botones del header
      attachAppHeaderListeners();
    }
    // Al cargar la página, verificar si existe sesión
    window.addEventListener('DOMContentLoaded', () => {
      const sesionGuardada = localStorage.getItem('escolarfam_sesion');
      
      if (sesionGuardada) {
        const sesion = JSON.parse(sesionGuardada);
        idUsuarioActual = sesion.id;
        rolUsuarioActual = sesion.rol;
        datosUsuarioActual = sesion.datos;
        isLoggedIn = true;
        
        mostrarAplicacion();
      } else {
        // No hay sesión guardada, mostrar pantalla de login
        attachLoginListeners();
      }
    });

    function attachAppHeaderListeners() {
      document.getElementById('appThemeBtn').addEventListener('click', toggleTheme);
      
      document.getElementById('friendsBtn').addEventListener('click', () => {
        showModal('friendsModal');
      });
      
      document.getElementById('registerBtn').addEventListener('click', () => {
        renderRegisterForm();
        showModal('registerModal');
      });
      
      document.getElementById('logoutBtn').addEventListener('click', logout);
    }

    document.getElementById('roleSelector').addEventListener('change', (e) => {
      if (isLoggedIn) {
        currentRole = e.target.value;
        showRegisterButton();
        updateNavigation();
        renderScreens();
      }
    });

    // Inicializar la aplicación
    document.addEventListener('DOMContentLoaded', async () => {
      // Verificar si hay una sesión guardada
      if (!(await checkSavedLogin())) {
        // Si no hay sesión guardada, mostrar pantalla de login
        attachLoginListeners();
        // Cargar logo desde caché si existe
        loadLoginScreenLogo();
      }
      
      // Inicializar listener de avisos de voz para directores y maestros
      setTimeout(() => {
        if (window.initVoiceAnnouncementListener) {
          window.initVoiceAnnouncementListener();
        }
      }, 2000);

      // Listener para cambio de rol (solo si está logueado)
      document.getElementById('roleSelector').addEventListener('change', async (e) => {
        if (isLoggedIn) {
          currentRole = e.target.value;
          showRegisterButton();
          updateNavigation();
          await renderScreens();
        }
      });
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