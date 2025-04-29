import { db } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const iniciarSession = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Email y contraseña son requeridos' 
            });
        }
        const emailStr = String(email).trim().toLowerCase();
        const passwordStr = String(password);
        const [users] = await db.query(
            'SELECT id_usuario, id_rol, email, contrasena FROM usuarios WHERE email = ?', 
            [emailStr]
        );
        if (!users || users.length === 0) {
            return res.status(401).json({ 
                success: false,
                error: 'Credenciales inválidas'
            });
        }
        const user = users[0];
        const isMatch = await bcrypt.compare(passwordStr, user.contrasena);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                error: 'Credenciales inválidas'
            });
        }
        const payload = {
            id: user.id_usuario,
            rol: user.id_rol,
            email: user.email
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            user: {
                id: user.id_usuario,
                id_rol: user.id_rol,
                email: user.email
            },
            token: token
        });
    } catch (error) {
        console.error('Error en iniciarSession:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error en el servidor',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};