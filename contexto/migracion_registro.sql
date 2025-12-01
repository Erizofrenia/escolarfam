-- =====================================================
-- MIGRACIÓN: Sistema de Registro
-- Ejecutar en MySQL para agregar campos y tablas faltantes
-- =====================================================

-- 1. Agregar índice único para nombre_usuario (IMPORTANTE: evita duplicados)
-- Si ya tienes usuarios duplicados, necesitarás limpiarlos primero
ALTER TABLE usuarios ADD UNIQUE INDEX IF NOT EXISTS unique_username (nombre_usuario);

-- 2. Agregar campo nivel a la tabla grupos (si no existe)
ALTER TABLE grupos ADD COLUMN IF NOT EXISTS nivel ENUM('kinder', 'primaria', 'secundaria', 'preparatoria', 'universidad') DEFAULT 'primaria' AFTER seccion;

-- 3. Crear tabla de asignaturas (si no existe)
CREATE TABLE IF NOT EXISTS `asignaturas` (
  `id_asignatura` INT NOT NULL AUTO_INCREMENT,
  `id_escuela` INT NOT NULL DEFAULT 1,
  `nombre_asignatura` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NULL,
  `activa` TINYINT(1) DEFAULT 1,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_asignatura`),
  UNIQUE KEY `unique_asignatura_escuela` (`id_escuela`, `nombre_asignatura`),
  KEY `idx_escuela` (`id_escuela`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Si la tabla ya existe, agregar columna id_escuela
ALTER TABLE asignaturas ADD COLUMN IF NOT EXISTS id_escuela INT NOT NULL DEFAULT 1 AFTER id_asignatura;

-- 4. Crear tabla maestro_asignaturas (relación maestro-asignatura-grupo)
CREATE TABLE IF NOT EXISTS `maestro_asignaturas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_maestro` INT NOT NULL,
  `id_asignatura` INT NOT NULL,
  `id_grupo` INT NOT NULL,
  `ciclo_escolar` VARCHAR(20) DEFAULT '2024-2025',
  `fecha_asignacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_maestro_asignatura_grupo` (`id_maestro`, `id_asignatura`, `id_grupo`),
  KEY `idx_maestro` (`id_maestro`),
  KEY `idx_asignatura` (`id_asignatura`),
  KEY `idx_grupo` (`id_grupo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Insertar asignaturas de ejemplo (ignora si ya existen)
INSERT IGNORE INTO asignaturas (id_escuela, nombre_asignatura, descripcion) VALUES
(1, 'Matemáticas', 'Aritmética, álgebra, geometría y cálculo'),
(1, 'Español', 'Lengua y literatura española'),
(1, 'Ciencias Naturales', 'Biología, física y química básica'),
(1, 'Historia', 'Historia de México y universal'),
(1, 'Geografía', 'Geografía física y política'),
(1, 'Educación Física', 'Deportes y actividad física'),
(1, 'Inglés', 'Idioma inglés'),
(1, 'Artes', 'Música, dibujo y expresión artística'),
(1, 'Formación Cívica y Ética', 'Valores y ciudadanía'),
(1, 'Tecnología', 'Computación y tecnología');

-- 6. IMPORTANTE: Si tienes errores por duplicados en nombre_usuario, ejecuta esto primero:
-- SELECT nombre_usuario, COUNT(*) as total FROM usuarios GROUP BY nombre_usuario HAVING total > 1;
-- (esto te mostrará los usuarios duplicados para que los corrijas manualmente)

SELECT 'Migración completada exitosamente' as resultado;
