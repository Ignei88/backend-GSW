import app from '../app.js';
import request from 'supertest';
import { db } from '../db.js';

describe('GET /productos', () => {
 let testProductId;

const newProduct = {
    nombre_producto: 'Test Product',
    descripcion: 'This is a test product',
    precio_venta: 10.99,
    precio_compra: 8.50,
    id_categoria: 13, // Asegúrate de que esta categoría exista en tu DB de prueba
    codigo_barras: '1234567890123',
    activo: 1
};

 const updatedProduct = {
    nombre_producto: 'Test update Product',
    descripcion: 'This is a update test product',
    precio_venta: 13.99,
    precio_compra: 4.50,
    id_categoria: 13, // Asegúrate de que esta categoría exista en tu DB de prueba
    codigo_barras: '1234567890124',
    activo: 1
 };
 
 // Hook para crear un producto de prueba antes de las pruebas que lo necesitan
 beforeAll(async () => {
    try {
      const [result] = await db.query(
         'INSERT INTO productos (nombre_producto, descripcion, precio_venta, precio_compra, id_categoria, codigo_barras, activo) VALUES (?, ?, ?, ?, ?, ?, ?)',
         [
            newProduct.nombre_producto,
            newProduct.descripcion,
            newProduct.precio_venta,
            newProduct.precio_compra,
            newProduct.id_categoria,
            newProduct.codigo_barras,
            newProduct.activo
         ]
      );
      testProductId = result.insertId;
      console.log(`Producto de prueba creado con ID: ${testProductId}`);
    } catch (error) {
      console.error('Error creating test product:', error);
      throw error;
    }
 });

 // Limpiar después de las pruebas
 afterAll(async () => {
    if (testProductId) {
      try {
         await db.query('DELETE FROM productos WHERE id_producto = ?', [testProductId]);
         console.log(`Producto de prueba con ID ${testProductId} eliminado.`);
      } catch (error) {
         console.error('Error deleting test product:', error);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    if (db && typeof db.end === 'function') {
      try {
         await db.end();
      } catch (error) {
         console.error('Error al cerrar la conexión:', error);
      }
    }
 }, 10000);

 test('should return with a 200 status code (getProducts)', async () => {
    const response = await request(app).get('/api/productos/productos').send();
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
 });

 test('should return with a 200 status code and a product (getProduct)', async () => {
    if (!testProductId) throw new Error('testProductId is not defined');
    const response = await request(app).get(`/api/productos/productos/${testProductId}`).send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id_producto', testProductId);
    expect(response.body).toHaveProperty('nombre_producto', newProduct.nombre_producto);
 });

 test('should return 404 for a non-existent product (getProduct)', async () => {
    const nonExistentId = 99999;
    const response = await request(app).get(`/api/productos/productos/${nonExistentId}`).send();
    expect(response.statusCode).toBe(404);
 });

 test('should create a new product with status 201 (crearProductos)', async () => {
    const anotherNewProduct = {
      nombre_producto: 'Another Test Product',
      descripcion: 'Yet another test product',
      precio_venta: 20.00,
      precio_compra: 15.00,
      id_categoria: 14,
      codigo_barras: '9999999999990',
      activo: 1
    };
    const response = await request(app).post('/api/productos/productos').send(anotherNewProduct);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Producto creado correctamente');
 });

 test('should fail to create product with missing data (crearProductos)', async () => {
    const incompleteProduct = { nombre_producto: 'Incomplete' };
    const response = await request(app).post('/api/productos/productos').send(incompleteProduct);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Todos los campos obligatorios deben ser completados');
 });

 test('should update an existing product with status 200 (actualizarProductos)', async () => {
    if (!testProductId) throw new Error('testProductId is not defined');
    const response = await request(app)
      .put(`/api/productos/productos/${testProductId}`)
      .send(updatedProduct);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Producto actualizado correctamente');
 });

 test('should return 404 when updating a non-existent product (actualizarProductos)', async () => {
    const nonExistentId = 99999;
    const response = await request(app)
      .put(`/api/productos/productos/${nonExistentId}`)
      .send(updatedProduct);
    expect(response.statusCode).toBe(404);
 });

 test('should delete an existing product with status 200 (eliminarProducto)', async () => {
    const tempProduct = {
      nombre_producto: 'Temporary Product',
      descripcion: 'To be deleted',
      precio_venta: 5.00,
      precio_compra: 3.00,
      id_categoria: 14,
      codigo_barras: '88888888888',
      activo: 1
    };
    const [result] = await db.query(
      'INSERT INTO productos (nombre_producto, descripcion, precio_venta, precio_compra, id_categoria, codigo_barras, activo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
         tempProduct.nombre_producto,
         tempProduct.descripcion,
         tempProduct.precio_venta,
         tempProduct.precio_compra,
         tempProduct.id_categoria,
         tempProduct.codigo_barras,
         tempProduct.activo
      ]
    );
    const tempProductId = result.insertId;

    const response = await request(app).delete(`/api/productos/productos/${tempProductId}`).send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Producto eliminado correctamente');
 });

 test('should return 404 when deleting a non-existent product (eliminarProducto)', async () => {
    const nonExistentId = 99999;
    const response = await request(app).delete(`/api/productos/productos/${nonExistentId}`).send();
    expect(response.statusCode).toBe(404);
 });

 test('should return with a 200 status code for getCategorias', async () => {
    const response = await request(app).get('/api/productos/categorias').send();
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
 });
 
});
