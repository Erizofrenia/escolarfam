import connection from "../config/database.js";

const sql = `ALTER TABLE usuarios ADD COLUMN asignacion VARCHAR(255) DEFAULT NULL`;

connection.query(sql, (err, results) => {
  if (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('✅ La columna asignacion ya existe en la tabla usuarios');
    } else {
      console.error('❌ Error:', err.message);
    }
  } else {
    console.log('✅ Columna asignacion agregada exitosamente a la tabla usuarios');
  }
  process.exit(0);
});
