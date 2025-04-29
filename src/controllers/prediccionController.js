import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { db } from '../db.js'

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

//let modelo = null;

// Cargar modelo al iniciar
//(async () => {
//    console.log("Cargando modelo...");
//    const modeloPath = `file://${path.join(__dirname, '../modelo/model.json')}`;
//    modelo = await tf.loadLayersModel(modeloPath);
//    console.log("Modelo cargado exitosamente.");
//})();

export const productosMasVendidos = async (req, res) => {
    try {
      console.log("Productos vendidos")
      const [rows] = await db.query(`
        SELECT p.id_producto, p.nombre_producto, SUM(dv.cantidad) AS total_vendidos
        FROM detalle_venta dv
        INNER JOIN productos p ON dv.id_producto = p.id_producto
        GROUP BY p.id_producto, p.nombre_producto
        ORDER BY total_vendidos DESC
        LIMIT 10;
      `);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error al obtener productos más vendidos:', error);
      res.status(500).json({ error: 'Error al obtener productos más vendidos' });
    }
  };

  export const ventasAnoMes = async (req, res) => {
    try {
      console.log("Ventas historico")
      const [rows] = await db.query(`
        SELECT 
          YEAR(fecha_venta) AS anio,
          MONTH(fecha_venta) AS mes,
          COUNT(*) AS cantidad_ventas,
          SUM(subtotal) AS total_subtotal,
          SUM(impuestos) AS total_impuestos,
          SUM(descuento) AS total_descuentos,
          SUM(total) AS total_ventas
        FROM ventas
        WHERE estado = 'completada'
        GROUP BY anio, mes
        ORDER BY anio DESC, mes DESC;
      `);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error al obtener ventas por año y mes:', error);
      res.status(500).json({ error: 'Error al obtener ventas por año y mes' });
    }
  };
  

export const prediccionProductos = async (req, res) => {
//    try {
//        if (!modelo) {
//            return res.status(500).json({ error: "Modelo aún no está cargado." });
//        }

        // Extrae datos del body (ejemplo: precio, categoría, etc.)
//        const { precio_venta, mes, id_categoria, activo } = req.body;

        // Prepara el tensor de entrada
//        const inputTensor = tf.tensor2d([[precio_venta, mes, id_categoria, activo]]);  // Ajusta según tus features

        // Realiza predicción
//        const resultado = modelo.predict(inputTensor);
//        const prediccion = resultado.dataSync()[0];

//        res.json({ prediccion });
//    } catch (error) {
//        console.error("Error al predecir:", error);
//        res.status(500).json({ error: "Error al realizar la predicción." });
//    }
};

