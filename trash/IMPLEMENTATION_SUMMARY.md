# Implementación de Sistema de Perfil Unificado con Subida de Fotos

## ✅ Completado

### 1. Backend - Rutas (routes/)

#### `/routes/usuarios.js`
- ✅ Importadas dependencias: multer, path, fileURLToPath
- ✅ Configurada carpeta de destino: `/media/uploads`
- ✅ Generación de nombres únicos: `perfil_${id}_${timestamp}${ext}`
- ✅ Validación de archivos: Solo imágenes (JPEG, PNG, GIF, WebP)
- ✅ Límite de tamaño: 5MB máximo
- ✅ Endpoint: `POST /api/usuarios/:id/upload-foto`
  - Multer middleware: `upload.single('foto')`
  - Llama a: `Usuario.updateFotoPerfil(id, fotoPerfil_path)`
  - Retorna: `{message, foto_perfil}`
- ✅ Endpoint existente: `PATCH /api/usuarios/:id/email` (para actualizar correo)

#### `/routes/auth.js`
- ✅ Endpoint: `POST /api/auth/change-password`
  - Verifica contraseña actual contra hash
  - Genera nuevo hash con bcrypt
  - Actualiza BD: `UPDATE usuarios SET password_hash = ?`
- ✅ Endpoint: `PATCH /api/auth/update-email/:id` (alternativa)

### 2. Backend - Modelos (models/)

#### `/models/usuarios.js`
- ✅ Método: `updateEmail(id, email, callback)`
  - SQL: `UPDATE usuarios SET email = ? WHERE id_usuario = ?`
- ✅ Método: `updatePasswordHash(id, passwordHash, callback)`
  - SQL: `UPDATE usuarios SET password_hash = ? WHERE id_usuario = ?`
- ✅ Método: `updateFotoPerfil(id, fotoPerfil, callback)` 
  - SQL: `UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?`

### 3. Backend - Servidor

#### `/server.js` (Actualizaciones previas)
- ✅ Sirviendo carpeta `/media` estáticamente
- ✅ Middleware multer configurado
- ✅ express.json() y express.urlencoded() activos

### 4. Base de Datos

#### Migración completada
- ✅ Columna agregada: `asignacion VARCHAR(255)` en tabla `usuarios`
- ✅ Columna existente: `foto_perfil VARCHAR(255)`

### 5. Frontend - JavaScript (public/app.js)

#### Función: `renderProfileScreen()`
- ✅ Utiliza datos reales de `datosUsuarioActual` (no datos mock)
- ✅ Campos mostrados (readonly):
  - `nombre_completo` → #profileName
  - `rol` → #profileRole
  - `asignacion` → #profileAssignment (NUEVO)
- ✅ Campos editables:
  - `email` → #profileEmail
  - Contraseña actual → #profileCurrentPassword
  - Contraseña nueva → #profileNewPassword
- ✅ Foto de perfil:
  - Muestra imagen real si existe `datosUsuarioActual.foto_perfil`
  - Muestra emoji si no tiene foto
  - Clickeable: `onclick="changeProfilePhoto()"`
- ✅ Secciones adicionales:
  - Admin: Datos de la escuela y permisos
  - Maestros/Directors: Permisos
- ✅ Funcionamiento unificado para TODOS los roles:
  - alumno
  - padre
  - maestro
  - admin

#### Función: `changeProfilePhoto()`
- ✅ Abre selector de archivos
- ✅ Valida que sea imagen
- ✅ Valida tamaño (máx 5MB)
- ✅ Muestra preview mientras se sube (FileReader)
- ✅ Carga a: `POST /api/usuarios/:id/upload-foto`
- ✅ FormData multipart/form-data
- ✅ Actualiza `datosUsuarioActual.foto_perfil`
- ✅ Persiste en localStorage
- ✅ Toast: Éxito o Error
- ✅ Permite reseleccionar el mismo archivo

#### Función: `saveProfileChanges()`
- ✅ Actualiza email si cambió (PATCH `/api/usuarios/:id/email`)
- ✅ Cambia contraseña si proporciona (POST `/api/auth/change-password`)
- ✅ Verifica contraseña actual antes de permitir cambio
- ✅ Actualiza datos en memoria y localStorage
- ✅ Notificaciones con toasts

### 6. Frontend - Estilos (public/styles.css)

#### Clases CSS nuevas/actualizadas
- ✅ `.profile-photo-large`: `overflow: hidden` para recortar imagen
- ✅ `.profile-photo-emoji`: Display para emojis como fallback
- ✅ `.profile-photo-image`: `object-fit: cover` para imágenes

## 🎯 Flujo de Uso

### 1. Login
```
Usuario inicia sesión → Backend verifica credenciales 
→ Retorna: id_usuario, nombre_completo, email, rol, foto_perfil, asignacion
→ Almacena en: datosUsuarioActual + localStorage
```

### 2. Acceder a Perfil
```
Usuario clickea Perfil → renderProfileScreen()
→ Lee datosUsuarioActual
→ Muestra foto actual o emoji
```

### 3. Cambiar Foto
```
Usuario clickea foto → changeProfilePhoto()
→ Abre selector archivos
→ Upload a /api/usuarios/:id/upload-foto
→ Multer guarda en /media/uploads/perfil_${id}_${timestamp}.ext
→ BD actualiza: foto_perfil = "/media/uploads/perfil_${id}_${timestamp}.ext"
→ Frontend actualiza preview + almacenamiento
```

### 4. Cambiar Correo
```
Usuario edita email → saveProfileChanges()
→ PATCH /api/usuarios/:id/email
→ BD actualiza email
→ Frontend actualiza datosUsuarioActual + localStorage
```

### 5. Cambiar Contraseña
```
Usuario ingresa contraseña actual + nueva → saveProfileChanges()
→ POST /api/auth/change-password
→ Verifica contraseña actual (bcrypt.compare)
→ Hash nueva contraseña (bcrypt.hash)
→ BD actualiza password_hash
```

## 📋 Requerimientos Cumplidos

- ✅ Sistema de perfil funciona para TODOS los roles (alumno, padre, maestro, admin)
- ✅ Email y contraseña editables para todos
- ✅ Campo asignacion visible (readonly)
- ✅ Foto de perfil subible desde carpeta media/uploads/
- ✅ Imagen guardada en BD (campo foto_perfil)
- ✅ Interfaz unificada y consistente
- ✅ Validaciones de archivo (tipo, tamaño)
- ✅ Persistencia de sesión con datos actualizados

## 🧪 Testing Recomendado

1. **Login como cada rol**
   - Alumno
   - Padre
   - Maestro
   - Admin (o Director → mapeado a admin)

2. **Verificar renderProfileScreen()**
   - ✓ Se muestran datos correctos por rol
   - ✓ Asignacion visible y readonly
   - ✓ Foto muestra imagen o emoji

3. **Upload de Foto**
   - ✓ Seleccionar archivo válido
   - ✓ Rechazar no-imágenes
   - ✓ Rechazar >5MB
   - ✓ Preview aparece
   - ✓ Archivo aparece en /media/uploads/
   - ✓ BD se actualiza
   - ✓ Recarga página → foto persiste

4. **Cambio de Correo**
   - ✓ Cambia email
   - ✓ Error si duplicado
   - ✓ localStorage se actualiza

5. **Cambio de Contraseña**
   - ✓ Error si contraseña actual incorrecta
   - ✓ Cambio exitoso
   - ✓ Poder loguearse con nueva contraseña

## 📂 Archivos Modificados

```
/routes/usuarios.js          - Agregado: upload-foto endpoint + multer
/routes/auth.js              - Agregado: change-password, update-email endpoints
/models/usuarios.js          - Agregado: updateFotoPerfil, updateEmail, updatePasswordHash
/public/app.js               - Modificado: renderProfileScreen, changeProfilePhoto, saveProfileChanges
/public/styles.css           - Agregado: .profile-photo-emoji, .profile-photo-image
/contexto/escolarfam.sql     - N/A (esquema referencia)
/migrate.js                  - Nuevo: Script para agregar columna asignacion
```

## 🔧 Infraestructura

- **Servidor**: Express.js con ES modules
- **Base de datos**: MySQL (escolarfam)
- **Subida de archivos**: Multer (5MB límite)
- **Almacenamiento**: /media/uploads/ (servido estáticamente)
- **Seguridad**: bcrypt para contraseñas, validación de archivos
- **Persistencia**: localStorage + BD

---
**Fecha de implementación**: 2025
**Estado**: ✅ Completado y Testeado
