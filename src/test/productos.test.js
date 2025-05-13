import app from '../app.js';
import request from 'supertest';
import { db } from '../db.js';

describe('GET /productos', () => {
 let testProductId;

 // Datos de prueba para crear y actualizar productos
 const newProduct = {
 nombre: 'Test Product',
 descripcion: 'This is a test product',
 precio: 10.99,
 stock: 50,
 id_categoria: 1 // Asegúrate de que esta categoría exista en tu DB de prueba
 };

 const updatedProduct = {
 nombre: 'Updated Test Product',
 descripcion: 'This product has been updated',
 precio: 15.50,
 stock: 100,
 id_categoria: 2 // Asegúrate de que esta categoría exista en tu DB de prueba
 };

 // Hook para crear un producto de prueba antes de las pruebas que lo necesitan
 beforeAll(async () => {
 try {
 const [result] = await db.query(
 'INSERT INTO productos (nombre, descripcion, precio, stock, id_categoria) VALUES (?, ?, ?, ?, ?)',
 [newProduct.nombre, newProduct.descripcion, newProduct.precio, newProduct.stock, newProduct.id_categoria]
 );
 testProductId = result.insertId;
 console.log(`Producto de prueba creado con ID: ${testProductId}`);
 } catch (error) {
 console.error('Error creating test product:', error);
 throw error; // Lanza el error para que la prueba falle si la creación inicial falla
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
 // Aumenta el timeout para el cierre de la conexión
 await new Promise(resolve => setTimeout(resolve, 500)); // Pequeña pausa
 if (db && typeof db.end === 'function') {
 try {
 await db.end();
 } catch (error) {
 console.error('Error al cerrar la conexión:', error);
 }
 }
 }, 10000); // 10 segundos de timeout para afterAll

    test('should return with a 200 status code (getProducts)', async () => {
        const response = await request(app).get('/api/productos/productos').send();
 expect(response.statusCode).toBe(200);
 expect(Array.isArray(response.body)).toBe(true); // Espera un array de productos
 });

 test('should return with a 200 status code and a product (getProduct)', async () => {
 // Asegúrate de que testProductId esté definido antes de esta prueba
 if (!testProductId) throw new Error('testProductId is not defined');

 const response = await request(app).get(`/api/productos/productos/${testProductId}`).send();
 expect(response.statusCode).toBe(200);
 expect(response.body).toHaveProperty('id_producto', testProductId);
 expect(response.body).toHaveProperty('nombre', newProduct.nombre); // Verifica que los datos coincidan con el producto creado
    });

 test('should return 404 for a non-existent product (getProduct)', async () => {
 const nonExistentId = 99999; // Un ID que sabes que no existe
 const response = await request(app).get(`/api/productos/productos/${nonExistentId}`).send();
 expect(response.statusCode).toBe(404); // O el código de estado que uses para "no encontrado"
 });

 test('should create a new product with status 201 (crearProductos)', async () => {
 const anotherNewProduct = { // Datos para otro producto de prueba
 nombre: 'Another Test Product',
 descripcion: 'Yet another test product',
 precio: 20.00,
 stock: 25,
 id_categoria: 1
 };
 const response = await request(app).post('/api/productos/productos').send(anotherNewProduct);
 expect(response.statusCode).toBe(201); // O 200, dependiendo de tu API
 expect(response.body).toHaveProperty('message', 'Producto creado exitosamente'); // O el mensaje esperado
 expect(response.body).toHaveProperty('productId'); // Espera que devuelva el ID del nuevo producto
    });
 test('should fail to create product with missing data (crearProductos)', async () => {
 const incompleteProduct = { nombre: 'Incomplete' };
 const response = await request(app).post('/api/productos/productos').send(incompleteProduct);
 expect(response.statusCode).toBe(400); // O el código de estado para datos inválidos
 expect(response.body).toHaveProperty('error', 'Faltan datos obligatorios'); // O el mensaje esperado
    })

 test('should update an existing product with status 200 (actualizarProductos)', async () => {
 // Asegúrate de que testProductId esté definido
 if (!testProductId) throw new Error('testProductId is not defined');

 const response = await request(app)
 .put(`/api/productos/productos/${testProductId}`)
 .send(updatedProduct);

 expect(response.statusCode).toBe(200);
 expect(response.body).toHaveProperty('message', 'Producto actualizado exitosamente'); // O el mensaje esperado
 });

 test('should return 404 when updating a non-existent product (actualizarProductos)', async () => {
 const nonExistentId = 99999;
 const response = await request(app)
 .put(`/api/productos/productos/${nonExistentId}`)
 .send(updatedProduct);
 expect(response.statusCode).toBe(404); // O el código para no encontrado
 });

 test('should delete an existing product with status 200 (eliminarProducto)', async () => {
 // Creamos un producto temporal para eliminar
 const tempProduct = {
 nombre: 'Temporary Product',
 descripcion: 'To be deleted',
 precio: 5.00,
 stock: 10,
 id_categoria: 1
 };
 const [result] = await db.query(
 'INSERT INTO productos (nombre, descripcion, precio, stock, id_categoria) VALUES (?, ?, ?, ?, ?)',
 [tempProduct.nombre, tempProduct.descripcion, tempProduct.precio, tempProduct.stock, tempProduct.id_categoria]
 );
 const tempProductId = result.insertId;

 const response = await request(app).delete(`/api/productos/productos/${tempProductId}`).send();
 expect(response.statusCode).toBe(200);
 expect(response.body).toHaveProperty('message', 'Producto eliminado exitosamente'); // O el mensaje esperado
 });

 test('should return 404 when deleting a non-existent product (eliminarProducto)', async () => {
 const nonExistentId = 99999;
 const response = await request(app).delete(`/api/productos/productos/${nonExistentId}`).send();
 expect(response.statusCode).toBe(404); // O el código para no encontrado
 });

 test('should return with a 200 status code for getCategorias', async () => {
 const response = await request(app).get('/api/productos/categorias').send();
 expect(response.statusCode).toBe(200);
 expect(Array.isArray(response.body)).toBe(true); // Espera un array de categorías
 });

});

// La conexión a la base de datos se cierra en el afterAll del describe block
/*
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
*/
//    })
//});

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