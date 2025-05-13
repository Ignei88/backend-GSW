import { text } from 'express';
import app from '../app.js';
import request from 'supertest';

describe('GET /ventas', () => {
    test('should return with a 200 status code (getVentasHoy)', async () => {
        const response = await request(app).get('/api/ventas/ventas/hoy').send();
        expect(response.status).toBe(200);
    });

    text('should return with a 200 status code (getHistorialVentas)', async () => {
        const response = await request(app).get('/api/ventas/ventas').send();
        expect(response.status).toBe(200);
    })

    text('should return with a 200 status code (getClientes)', async () => {
        const response = await request(app).get('/api/ventas/clientes');
        expect(response.status).toBe(200);
    })

    text('should return with a 200 status code (getMetodosPago)', async () =>{
        const response = await request(app).get('/api/ventas/metodos_pago').send();
        expect(response.status).toBe(200);
    })

    test('should return with a 200 status code (registrarVenta)', async () => {
        const response = await request(app).post('/api/ventas/ventas').send();
        expect(response.status).toBe(401);
    });

    
});
