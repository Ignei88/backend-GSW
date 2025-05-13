import bcrypt from 'bcryptjs';
import { db } from '../db.js';
const saltRounds = 10;

export const RegistrarUsuario = async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body;
        console.log(req.body);
        if (!nombre || !apellido || !email || !password) {
            return res.status(400).json({ error: 'Faltan datos de registro' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [result] = await db.query(
            'INSERT INTO usuarios (id_rol, nombre, apellido, email, contrasena) VALUES (?, ?, ?, ?, ?)', 
            [1, nombre, apellido, email, hashedPassword]
        );

        res.status(201).json({ 
            message: 'Usuario registrado exitosamente', 
            userId: result.insertId 
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const ConsultarUsuario = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM usuarios');
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const RegistrarEmpleado = async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body;
        
        if (!nombre || !apellido || !email || !password) {
            return res.status(400).json({ error: 'Faltan datos de registro' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [result] = await db.query(
            'INSERT INTO usuarios (id_rol, nombre, apellido, email, contrasena) VALUES (1, ?, ?, ?, ?)', 
            [2, nombre, apellido, email, hashedPassword]
        );

        res.status(201).json({ 
            message: 'Usuario registrado exitosamente', 
            userId: result.insertId 
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const EliminarEmpleado = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Se requiere el email del empleado" });
        }
        const [result] = await pool.query(
            'DELETE FROM empleados WHERE email = ?',
            [email]
          );
        if (!result) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }
        res.status(200).json({
            message: "Empleado eliminado exitosamente",
            empleado: result
        });
    } catch (error) {
        console.error("Error al eliminar empleado:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}