import { db } from '../db.js';

export const getProduct = async (req, res) => {
  const { id } = req.params;
  console.log(`Buscando producto con ID: ${id}`);
  const SQL_QUERY = "SELECT * FROM productos WHERE id_producto = ?";

  try {
    const [result] = await db.query(SQL_QUERY, [id]);
    console.log('Resultado de la consulta:', result);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result[0]);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error al buscar el producto' });
  }
};

export const getProducts = async (req, res) => {

  const SQL_QUERY = "SELECT * FROM productos";

  try {
    const [result] = await db.query(SQL_QUERY);
    res.json(result);
  } catch (err) {
    console.error('Error en consulta de productos:', err);
    res.status(500).json({ error: 'Error al consultar productos' });
  }
};

export const getCategorias = async (req, res) => {
  console.log('Consultando categorías');
  const SQL_QUERY = "SELECT * FROM categorias";
  try {
    const [result] = await db.query(SQL_QUERY);
    res.json(result);
  } catch (err) {
    console.error('Error al consultar categorías:', err);
    res.status(500).json({ error: 'Error al consultar categorías' });
  }
};

export const crearProductos = async (req, res) => {
  const {
    id_categoria,
    codigo_barras,
    nombre_producto,
    descripcion,
    precio_compra,
    precio_venta
  } = req.body;

  // Validaciones básicas
  if (!id_categoria || !codigo_barras || !nombre_producto || !precio_compra || !precio_venta) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben ser completados' });
  }

  const SQL_QUERY = `
    INSERT INTO productos 
    (id_categoria, codigo_barras, nombre_producto, descripcion, precio_compra, precio_venta, activo) 
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `;

  try {
    const [result] = await db.query(SQL_QUERY, [
      id_categoria,
      codigo_barras,
      nombre_producto,
      descripcion,
      precio_compra,
      precio_venta
    ]);
    res.status(201).json({ id: result.insertId, message: 'Producto creado correctamente' });
  } catch (err) {
    console.error('Error al insertar producto:', err);
    res.status(500).json({ error: 'Error al guardar el producto' });
  }
};

export const actualizarProductos = async (req, res) => {
  console.log('Actualizando producto');
  const { id } = req.params;
  const {
    id_categoria,
    codigo_barras,
    nombre_producto,
    descripcion,
    precio_compra,
    precio_venta
  } = req.body;

  if (!id_categoria || !codigo_barras || !nombre_producto || !precio_compra || !precio_venta) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben ser completados' });
  }

  const SQL_QUERY = `
    UPDATE productos 
    SET id_categoria = ?, codigo_barras = ?, nombre_producto = ?, descripcion = ?, precio_compra = ?, precio_venta = ? 
    WHERE id_producto = ?
  `;

  try {
    const [result] = await db.query(SQL_QUERY, [
      id_categoria,
      codigo_barras,
      nombre_producto,
      descripcion,
      precio_compra,
      precio_venta,
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

export const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  const SQL_QUERY = "UPDATE productos SET activo = 0 WHERE id_producto = ?";

  try {
    const [result] = await db.query(SQL_QUERY, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

