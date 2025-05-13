import app from '../app.js';
import request from 'supertest';
import { db } from '../db.js';

describe('GET /productos', () => {
    test('should return with a 200 status code (getProducts)', async () => {
        const response = await request(app).get('/api/productos/productos').send();
        expect(response.statusCode).toBe(200); 
    });

    test('should return with a 200 status code (getProduct)', async () => {
        const response = await request(app).get('/api/productos/productos/:id').send();
        expect(response.statusCode).toBe(200);
    })

    test('should return with a 200 status code (crearProductos)', async () => {
        const response = await request(app).post('/api/productos/productos').send();
        expect(response.statusCode).toBe(200);
    });

    test('should return with a 200 status code (actualizarProductos)', async () => {
        const response = await request(app).put('/api/productos/productos/:id').send();
        expect(response.statusCode).toBe(200);
    })

    test('should return with a 200 status code (eliminarProducto)', async () => {
        const response = await request(app).delete('/api/productos/productos/:id').send();
        expect(response.statusCode).toBe(200);
    })
});

afterAll(async () => {
    // Aumenta el timeout para el cierre
    await new Promise(resolve => setTimeout(resolve, 500)); // Pequeña pausa
    if (db && typeof db.end === 'function') {
        try {
            await db.end();
        } catch (error) {
            console.error('Error al cerrar la conexión:', error);
        }
    }
}, 10000); // 10 segundos de timeout para afterAll