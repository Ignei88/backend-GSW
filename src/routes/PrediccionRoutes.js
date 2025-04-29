import { Router } from "express";
import { productosMasVendidos, ventasAnoMes } from '../controllers/prediccionController.js';

const router = Router();

router.get('/productosMasVendidos', productosMasVendidos);
router.get('/ventasAnoMes', ventasAnoMes);

export default router; 