import app from '../app.js';
import request from 'supertest';

describe('GET /ventas', () => {
    test('should return with a 200 status code (getVentasHoy)', async () => {
        const response = await request(app).get('/api/ventas/ventas/hoy').send();
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return with a 200 status code (getHistorialVentas)', async () => {
        const response = await request(app).get('/api/ventas/ventas').send();
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return with a 200 status code (getClientes)', async () => {
        const response = await request(app).get('/api/ventas/clientes');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return with a 200 status code (getMetodosPago)', async () => {
        const response = await request(app).get('/api/ventas/metodos_pago').send();
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('POST /api/ventas/ventas (registrarVenta)', () => {
    const testSaleData = {
        id_cliente: 81, // Asegúrate de que exista este cliente
        id_usuario: 40, // Asegúrate de que exista este usuario
        id_metodo_pago: 1, // Asegúrate de que exista este método de pago
        subtotal: 90.00,
        impuestos: 10.50,
        descuento: 0.00,
        // total puede ser calculado por el backend como subtotal + impuestos - descuento
    };

    test('should return with a 201 status code (registrarVenta)', async () => {
        const response = await request(app)
            .post('/api/ventas/ventas')
            .send(testSaleData);

        expect([200, 201]).toContain(response.status);
        expect(response.body).toHaveProperty('message', 'Venta registrada correctamente');
        expect(response.body).toHaveProperty('id');

    });
});
