import { db } from '../db.js';

export const registrarVenta = async (req, res) => {
  console.log('Recibiendo solicitud para registrar venta:', req.body);

  const {
    id_cliente,
    id_usuario,
    id_metodo_pago,
    subtotal,
    impuestos,
    descuento,
    total,
  } = req.body;

  // Validamos y formateamos datos
  const ventaData = {
    id_cliente: id_cliente ? parseInt(id_cliente) : null,
    id_usuario: id_usuario ? parseInt(id_usuario) : 1,
    id_metodo_pago: id_metodo_pago ? parseInt(id_metodo_pago) : 1,
    subtotal: parseFloat(subtotal) || 0.00,
    impuestos: parseFloat(impuestos) || 0.00,
    descuento: parseFloat(descuento) || 0.00,
    total: parseFloat(total) || 0.00,
    estado: 'completada'
  };

  const SQL_VENTA = `
  INSERT INTO ventas 
  (id_cliente, id_usuario, id_metodo_pago, fecha_venta, subtotal, impuestos, descuento, estado) 
  VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)
`;


  const values = [
    ventaData.id_cliente,
    ventaData.id_usuario,
    ventaData.id_metodo_pago,
    ventaData.subtotal,
    ventaData.impuestos,
    ventaData.descuento,
    ventaData.estado
  ];

  try {
    const [ventaResult] = await db.query(SQL_VENTA, values);
    const id_venta = ventaResult.insertId;
    console.log('Venta registrada con ID:', id_venta);

    // En el futuro puedes insertar productos aquí en una tabla de detalle de venta

    res.status(201).json({
      id: id_venta,
      message: 'Venta registrada correctamente'
    });

  } catch (err) {
    console.error('Error al insertar venta:', err);
    res.status(500).json({ error: 'Error al registrar la venta: ' + err.message });
  }
};


export const getMetodosPago = async (req, res) => {
  console.log('Obteniendo métodos de pago');
  const SQL_QUERY = "SELECT * FROM metodos_pago WHERE activo = 1";

  try {
    const [result] = await db.query(SQL_QUERY);
    console.log('Métodos de pago encontrados:', result);
    res.json(result);
  } catch (err) {
    console.error('Error al consultar métodos de pago:', err);
    res.status(500).json({ error: 'Error al obtener métodos de pago' });
  }
};


export const getClientes = async (req, res) => {
  console.log('Obteniendo clientes');
  const SQL_QUERY = "SELECT id_cliente, nombre, apellido FROM clientes";

  try {
    const [result] = await db.query(SQL_QUERY);
    console.log('Clientes encontrados:', result.length);
    res.json(result);
  } catch (err) {
    console.error('Error al consultar clientes:', err);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};


export const getHistorialVentas = async (req, res) => {
  console.log('Obteniendo historial de ventas');
  const SQL_QUERY = "SELECT * FROM ventas ORDER BY fecha_venta DESC";

  try {
    const [result] = await db.query(SQL_QUERY);
    console.log('Ventas encontradas:', result.length);
    res.json(result);
  } catch (err) {
    console.error('Error al consultar ventas:', err);
    res.status(500).json({ error: 'Error al obtener historial de ventas' });
  }
};
export const getVentasHoy = async (req, res) => {
  console.log('Obteniendo ventas de hoy');
  const SQL_QUERY = `
    SELECT 
      v.id_usuario,
      COUNT(v.id_venta) AS ventas_realizadas,
      SUM(v.total) AS total_vendido
    FROM ventas v
    WHERE DATE(v.fecha_venta) = CURDATE()
    GROUP BY v.id_usuario
    ORDER BY total_vendido DESC
  `;
  
  let connection;
  try {
    connection = await db.getConnection(); // Obtener conexión explícita
    const [result] = await connection.query(SQL_QUERY);
    console.log('Ventas de hoy encontradas:', result.length);
    res.json(result);
  } catch (err) {
    console.error('Error al consultar ventas de hoy:', err);
    res.status(500).json({ error: 'Error al obtener ventas de hoy' });
  } finally {
    if (connection) {
      connection.release(); // Liberar conexión siempre
      console.log('Conexión liberada');
    }
  }
};