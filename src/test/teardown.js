module.exports = async () => {
  // Aquí puedes cerrar conexiones a bases de datos u otras limpiezas
  const { pool } = require('../db.js'); // Ajusta la ruta
  if (pool) await pool.end();
};