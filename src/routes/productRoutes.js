import { Router } from "express";
import {
  getProduct,
  getProducts,
  getCategorias,
  crearProductos,
  actualizarProductos,
  eliminarProducto
} from "../controllers/productController.js";

const router = Router();

// Rutas de productos
router.get('/productos', getProducts);
router.get('/productos/:id', getProduct);
router.post('/productos', crearProductos);
router.put('/productos/:id', actualizarProductos);
router.delete('/productos/:id', eliminarProducto);

// Rutas de categorías
router.get('/categorias', getCategorias);

export default router;
