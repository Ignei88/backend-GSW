import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config()

export const db = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
})

db.getConnection((err, connection) => {
  if (err) throw err;
  connection.ping((pingErr) => {
    if (pingErr) console.error('Ping failed');
    else console.log('Database connected');
    connection.release();
  });
});
