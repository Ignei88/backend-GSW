import request from 'supertest';
import app from '../app.js';
import { db } from '../db.js';
import bcrypt from 'bcryptjs';

// Datos de prueba
const testUser = {
  nombre: 'Test4',
  apellido: 'User4',
  email: 'test2@example.com',
  password: 'password123'
};

const testEmployee = {
  nombre: 'Test5',
  apellido: 'Employee5',
  email: 'employee3@example.com',
  password: 'password123'
};

let createdUserId = 0;

beforeAll(async () => {
  // Limpiar datos de prueba anteriores si existen
  await db.query('DELETE FROM usuarios WHERE email IN (?, ?)', 
    [testUser.email, testEmployee.email]);
    console.log("usuarios eliminados")
});

afterAll(async () => {
  // Limpiar después de las pruebas
  if (createdUserId > 0) {
    await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [createdUserId]);
  }
  await db.end();
});

describe('User Routes Tests', () => {
  describe('POST /api/users/users (RegistrarUsuario)', () => {
    test('should register a new user with status 201', async () => {
      const response = await request(app)
        .post('/api/users/users')
        .send(testUser);
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'Usuario registrado exitosamente');
      expect(response.body).toHaveProperty('userId');
      
      createdUserId = response.body.userId;
    });

    test('should fail with missing fields (status 400)', async () => {
      const response = await request(app)
        .post('/api/users/users')
        .send({ nombre: 'Incomplete' });
      
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'Faltan datos de registro');
  });

  describe('GET /api/users/users (ConsultarUsuario)', () => {
    test('should get all users with status 200', async () => {
      const response = await request(app)
        .get('/api/users/users');
      
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/users/login (iniciarSession)', () => {
  test('debería iniciar sesión con credenciales válidas', async () => {

    // Ahora iniciamos sesión (como es GET, usamos query)
    const response = await request(app)
      .get('/api/users/login')
      .query({
        'email': testUser.email,
        'password': testUser.password
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('success', true);
  });
});


    test('should fail with invalid credentials', async () => {
      const response = await request(app)
        .get('/api/users/login')
        .query({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.statusCode).toBe(500);
    });
  });

  describe('DELETE /api/users/users (EliminarEmpleado)', () => {
    test('should delete an employee with status 400', async () => {
      // Primero registramos un empleado para eliminar
      const registerResponse = await request(app)
        .post('/api/users/users')
        .send(testEmployee);
      
      const deleteResponse = await request(app)
        .delete('/api/users/users')
        .send({ email: testEmployee.email });
      
      expect(deleteResponse.statusCode).toBe(500);
      expect(deleteResponse.body).toHaveProperty('message', 'Empleado eliminado exitosamente');
    });

    test('should fail without employee ID (status 400)', async () => {
      const response = await request(app)
        .delete('/api/users/users')
        .send({});
      
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'Se requiere el email del empleado');
    });
  });

});