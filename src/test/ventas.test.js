import { text } from 'express';
import app from '../app.js';
import request from 'supertest';

describe('GET /ventas', () => {
 test('should return with a 200 status code (getVentasHoy)', async () => {
        const response = await request(app).get('/api/ventas/ventas/hoy').send();
        expect(response.status).toBe(200);
 expect(Array.isArray(response.body)).toBe(true); // Assuming it returns an array
    });

 test('should return with a 200 status code (getHistorialVentas)', async () => {
        const response = await request(app).get('/api/ventas/ventas').send();
        expect(response.status).toBe(200);
 expect(Array.isArray(response.body)).toBe(true); // Assuming it returns an array
    })

 test('should return with a 200 status code (getClientes)', async () => {
        const response = await request(app).get('/api/ventas/clientes');
        expect(response.status).toBe(200);
 expect(Array.isArray(response.body)).toBe(true); // Assuming it returns an array
    })

 test('should return with a 200 status code (getMetodosPago)', async () =>{
        const response = await request(app).get('/api/ventas/metodos_pago').send();
        expect(response.status).toBe(200);
 expect(Array.isArray(response.body)).toBe(true); // Assuming it returns an array
    })
});

describe('POST /api/ventas/ventas (registrarVenta)', () => {
    const testSaleData = {
        id_cliente: 1, // Replace with a valid client ID from your database
        id_metodo_pago: 1, // Replace with a valid payment method ID
        total: 100.50,
        productos: [
            { id_producto: 1, cantidad: 2, precio_unitario: 25.00 }, // Replace with valid product data
            { id_producto: 2, cantidad: 1, precio_unitario: 50.50 },
        ]
    };

    // You might need a beforeAll hook here to ensure valid id_cliente and id_metodo_pago exist

    test('should return with a 200 status code (registrarVenta)', async () => {
        const response = await request(app)
            .post('/api/ventas/ventas')
            .send(testSaleData);

        // Expecting 201 Created or 200 OK based on your API implementation
        expect(response.status).toBe(201); 
        // Or expect(response.status).toBe(200);

        expect(response.body).toHaveProperty('message', 'Venta registrada exitosamente'); // Adjust message as per your API
        // You might also want to check for other properties in the response body,
        // like the newly created sale ID or details.
        // expect(response.body).toHaveProperty('id_venta');
    });

    test('should return with a 400 status code for invalid data', async () => {
        const response = await request(app).post('/api/ventas/ventas').send({}); // Sending empty data
        expect(response.status).toBe(400); // Assuming 400 for bad request/missing data
        expect(response.body).toHaveProperty('error'); // Assuming an error property in the response
    });

});
