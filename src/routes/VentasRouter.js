import { Router } from "express";
import { 
    registrarVenta, 
    getMetodosPago, 
    getClientes, 
    getHistorialVentas,
    getVentasHoy } from '../controllers/ventasController.js'

const router = Router()

router.post('/ventas', registrarVenta);
router.get('/metodos_pago', getMetodosPago);
router.get('/clientes', getClientes);
router.get('/ventas', getHistorialVentas);
router.get('/ventas/hoy',getVentasHoy);

export default router;