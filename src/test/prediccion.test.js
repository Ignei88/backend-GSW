import app from '../app.js';
import request from 'supertest';

describe('GET /prediccion', () => {
    test('should return with a 200 status code', async () => {
        const response = await request(app).get('/api/prediccion/productosMasVendidos').send();
        expect(response.status).toBe(200);
    });


    test('should return with a 200 status code', async () => {
        const response = await request(app).get('/api/prediccion/ventasAnoMes').send();
        expect(response.status).toBe(200);
    })
});