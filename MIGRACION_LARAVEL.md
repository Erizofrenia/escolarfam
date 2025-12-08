# 📋 Plan de Migración: Node.js → Laravel

## 🎯 Objetivo
Migrar el backend de EscolarFam de Node.js/Express a Laravel para poder desplegarlo en un hosting compartido que soporte PHP/MySQL.

---

## 📁 Estructura Actual

### Backend Original (Legacy-Node/)
```
Legacy-Node/
├── server.js              # Punto de entrada Express
├── config/
│   └── database.js        # Conexión MySQL (mysql2)
├── routes/
│   ├── auth.js            # Autenticación y registro
│   ├── usuarios.js        # CRUD usuarios
│   ├── escuelas.js        # CRUD escuelas
│   ├── recogidas.js       # Sistema de recogidas
│   ├── mensajes.js        # Chat/mensajería
│   ├── notificaciones.js  # Sistema de notificaciones
│   ├── personasConfianza.js
│   ├── avisos.js          # Avisos escolares
│   ├── config.js          # Configuración de escuela
│   ├── consultas.js       # Consultas generales
│   ├── amigos.js          # Relaciones entre usuarios
│   └── asistencia.js      # Control de asistencia
└── models/
    ├── usuarios.js
    ├── escuela.js
    ├── mensajes.js
    ├── notificaciones.js
    ├── personasConfianza.js
    ├── solicitudesRecogida.js
    └── logs.js
```

### Frontend (se mantiene igual)
```
public/
├── app.js           # Lógica principal (~7900 líneas)
├── index.html       # SPA principal
├── styles.css       # Estilos
└── assets/          # Imágenes, iconos
```

---

## ✅ Checklist de Migración

### Fase 1: Configuración Inicial Laravel
- [ ] Crear proyecto Laravel: `composer create-project laravel/laravel .`
- [ ] Configurar `.env` con credenciales MySQL
- [ ] Configurar CORS para permitir requests del frontend
- [ ] Mover `public/` a `public/` de Laravel (o configurar rutas)

### Fase 2: Modelos Eloquent
Crear modelos para cada tabla:

| Tabla MySQL | Modelo Laravel | Archivo Node Original |
|-------------|---------------|----------------------|
| usuarios | User | models/usuarios.js |
| escuelas | Escuela | models/escuela.js |
| grupos | Grupo | - |
| asignaciones_grupos | AsignacionGrupo | - |
| relaciones_familiares | RelacionFamiliar | - |
| mensajes | Mensaje | models/mensajes.js |
| notificaciones | Notificacion | models/notificaciones.js |
| personas_confianza | PersonaConfianza | models/personasConfianza.js |
| solicitudes_recogida | SolicitudRecogida | models/solicitudesRecogida.js |
| logs | Log | models/logs.js |
| avisos | Aviso | - |
| asignaturas | Asignatura | - |
| maestro_asignaturas | MaestroAsignatura | - |
| asistencia | Asistencia | - |
| amigos | Amigo | - |

### Fase 3: Controladores
Crear controladores para cada módulo:

| Controller Laravel | Rutas Node Equivalentes | Endpoints |
|-------------------|------------------------|-----------|
| AuthController | routes/auth.js | `/api/auth/login`, `/api/auth/register` |
| UsuarioController | routes/usuarios.js | `/api/usuarios/*` |
| EscuelaController | routes/escuelas.js | `/api/escuelas/*` |
| RecogidaController | routes/recogidas.js | `/api/recogidas/*` |
| MensajeController | routes/mensajes.js | `/api/mensajes/*` |
| NotificacionController | routes/notificaciones.js | `/api/notificaciones/*` |
| PersonaConfianzaController | routes/personasConfianza.js | `/api/personas-confianza/*` |
| AvisoController | routes/avisos.js | `/api/avisos/*` |
| ConfigController | routes/config.js | `/api/config/*` |
| ConsultaController | routes/consultas.js | `/api/consultas/*` |
| AmigoController | routes/amigos.js | `/api/amigos/*` |
| AsistenciaController | routes/asistencia.js | `/api/asistencia/*` |

---

## 📍 Endpoints a Migrar

### Auth (`routes/auth.js` → `AuthController`)
```
POST /api/auth/register     → Registro completo (alumno/maestro/padre)
POST /api/auth/login        → Login con nombre_usuario y password
GET  /api/auth/verify-token → Verificar sesión
```

### Usuarios (`routes/usuarios.js` → `UsuarioController`)
```
GET    /api/usuarios                    → Todos los usuarios
GET    /api/usuarios/staff/directorio   → Directorio de maestros/admins
GET    /api/usuarios/:id                → Usuario por ID
POST   /api/usuarios                    → Crear usuario
PUT    /api/usuarios/:id                → Actualizar usuario
PATCH  /api/usuarios/:id/email          → Actualizar solo email
POST   /api/usuarios/:id/upload-foto    → Subir foto de perfil (multer)
GET    /api/usuarios/:id/hijos          → Hijos de un padre
GET    /api/usuarios/:id/padres         → Padres de un alumno
```

### Escuelas (`routes/escuelas.js` → `EscuelaController`)
```
GET    /api/escuelas        → Todas las escuelas
GET    /api/escuelas/:id    → Escuela por ID
POST   /api/escuelas        → Crear escuela
PUT    /api/escuelas/:id    → Actualizar escuela
DELETE /api/escuelas/:id    → Eliminar escuela
```

### Recogidas (`routes/recogidas.js` → `RecogidaController`)
```
POST   /api/recogidas                → Crear solicitud de recogida
GET    /api/recogidas/maestro/:id    → Recogidas para un maestro
GET    /api/recogidas/padre/:id      → Recogidas de un padre
PUT    /api/recogidas/:id/completar  → Marcar como completada
PUT    /api/recogidas/:id/cancelar   → Cancelar solicitud
```

### Mensajes (`routes/mensajes.js` → `MensajeController`)
```
GET  /api/mensajes/conversaciones/:idUsuario   → Conversaciones del usuario
GET  /api/mensajes/:idUsuario1/:idUsuario2     → Mensajes entre dos usuarios
POST /api/mensajes                             → Enviar mensaje
PUT  /api/mensajes/marcar-leidos/:rem/:dest    → Marcar como leídos
GET  /api/mensajes/no-leidos/:idUsuario        → Contador no leídos
```

### Notificaciones (`routes/notificaciones.js` → `NotificacionController`)
```
GET    /api/notificaciones/:idUsuario    → Notificaciones de usuario
POST   /api/notificaciones               → Crear notificación
PUT    /api/notificaciones/:id/leida     → Marcar como leída
DELETE /api/notificaciones/:id           → Eliminar notificación
```

### Personas de Confianza (`routes/personasConfianza.js` → `PersonaConfianzaController`)
```
GET    /api/personas-confianza/:idPadre     → Personas autorizadas
POST   /api/personas-confianza              → Agregar persona
DELETE /api/personas-confianza/:id          → Eliminar persona
```

### Avisos (`routes/avisos.js` → `AvisoController`)
```
GET  /api/avisos/escuela/:id    → Avisos de una escuela
POST /api/avisos                → Crear aviso
PUT  /api/avisos/:id            → Actualizar aviso
DELETE /api/avisos/:id          → Eliminar aviso
```

### Config (`routes/config.js` → `ConfigController`)
```
GET  /api/config/escuela/:id           → Configuración de escuela
PUT  /api/config/escuela/:id           → Actualizar configuración
POST /api/config/escuela/:id/logo      → Subir logo de escuela
```

### Consultas (`routes/consultas.js` → `ConsultaController`)
```
GET /api/consultas/grupos/:idEscuela           → Grupos de una escuela
GET /api/consultas/asignaturas/:idEscuela      → Asignaturas
GET /api/consultas/alumnos-grupo/:idGrupo      → Alumnos de un grupo
```

### Amigos (`routes/amigos.js` → `AmigoController`)
```
GET    /api/amigos/:idUsuario         → Lista de amigos
POST   /api/amigos/solicitud          → Enviar solicitud
PUT    /api/amigos/aceptar/:id        → Aceptar solicitud
DELETE /api/amigos/:id                → Eliminar amigo
```

### Asistencia (`routes/asistencia.js` → `AsistenciaController`)
```
GET  /api/asistencia/grupo/:idGrupo/fecha/:fecha   → Asistencia del día
POST /api/asistencia                               → Registrar asistencia
GET  /api/asistencia/alumno/:id/mes/:mes           → Historial alumno
```

---

## 🔐 Autenticación

### Node.js Actual
- Usa bcrypt para hashear passwords
- Sesión basada en localStorage (sin JWT)
- Verificación simple de credenciales

### Laravel Recomendado
- **Opción 1**: Laravel Sanctum (tokens API simples) ✅ Recomendado
- **Opción 2**: JWT con tymon/jwt-auth
- Mantener bcrypt para compatibilidad con passwords existentes

---

## 📦 Dependencias Laravel Necesarias

```bash
# Instalación base
composer require laravel/sanctum        # Autenticación API
composer require intervention/image     # Procesamiento de imágenes (fotos perfil)

# Configurar CORS (ya incluido en Laravel 7+)
# Editar config/cors.php
```

---

## 🗄️ Base de Datos

### NO se necesitan migraciones
La base de datos MySQL existente ya tiene todas las tablas. Solo hay que:
1. Configurar `.env` con las credenciales
2. Crear modelos Eloquent que mapeen a las tablas existentes

### Configuración .env ejemplo
```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=escolarfam
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
```

---

## 📂 Estructura Laravel Propuesta

```
escolarfam/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── AuthController.php
│   │       ├── UsuarioController.php
│   │       ├── EscuelaController.php
│   │       ├── RecogidaController.php
│   │       ├── MensajeController.php
│   │       ├── NotificacionController.php
│   │       ├── PersonaConfianzaController.php
│   │       ├── AvisoController.php
│   │       ├── ConfigController.php
│   │       ├── ConsultaController.php
│   │       ├── AmigoController.php
│   │       └── AsistenciaController.php
│   └── Models/
│       ├── User.php
│       ├── Escuela.php
│       ├── Grupo.php
│       ├── Mensaje.php
│       ├── Notificacion.php
│       ├── SolicitudRecogida.php
│       ├── PersonaConfianza.php
│       ├── Aviso.php
│       ├── Asignatura.php
│       ├── Asistencia.php
│       ├── Amigo.php
│       └── Log.php
├── routes/
│   └── api.php              # Todas las rutas API aquí
├── public/
│   ├── app.js               # Frontend (mover de public/)
│   ├── index.html
│   ├── styles.css
│   └── media/               # Carpeta de uploads
├── storage/
│   └── app/public/uploads/  # Fotos de perfil
└── .env
```

---

## ⏱️ Estimación de Tiempo

| Tarea | Tiempo Estimado |
|-------|----------------|
| Configuración Laravel + DB | 1-2 horas |
| Modelos Eloquent (12 modelos) | 2-3 horas |
| AuthController (login/register) | 2-3 horas |
| UsuarioController (CRUD + fotos) | 2-3 horas |
| RecogidaController (con notificaciones) | 2-3 horas |
| MensajeController (chat) | 1-2 horas |
| Otros Controllers (6) | 4-6 horas |
| Testing y debugging | 3-4 horas |
| **TOTAL** | **17-26 horas** |

---

## 🚀 Comandos para Iniciar

```bash
# 1. Instalar Laravel (en la carpeta raíz)
composer create-project laravel/laravel . --prefer-dist

# 2. Instalar Sanctum para autenticación API
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# 3. Configurar .env con base de datos

# 4. Generar key de aplicación
php artisan key:generate

# 5. Crear controladores
php artisan make:controller AuthController
php artisan make:controller UsuarioController --resource
php artisan make:controller EscuelaController --resource
# ... etc

# 6. Crear modelos
php artisan make:model Escuela
php artisan make:model Grupo
# ... etc (User ya existe)
```

---

## 📝 Notas Importantes

1. **Frontend sin cambios**: Solo actualizar `API_URL` en `app.js` si cambia el dominio
2. **Capacitor compatible**: La app móvil seguirá funcionando igual
3. **Passwords compatibles**: Laravel usa bcrypt por defecto (igual que Node)
4. **Subida de archivos**: Usar `Storage::disk('public')` para fotos
5. **CORS**: Configurar `config/cors.php` para permitir el dominio del frontend

---

## 🔗 Referencias

- [Legacy-Node/](./Legacy-Node/) - Código original Node.js para referencia
- [contexto/escolarfam.sql](./contexto/escolarfam.sql) - Esquema de base de datos
- [public/app.js](./public/app.js) - Frontend (endpoints que consume)

---

*Documento creado: $(Get-Date -Format "yyyy-MM-dd")*
*Proyecto: EscolarFam*
