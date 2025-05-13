import express from 'express';
import cors from 'cors';
import { db } from './db.js';

import UserRoutes from './routes/UserRoutes.js';
import PrediccionRoutes from './routes/PrediccionRoutes.js';
import ProductRoutes from './routes/productRoutes.js';
import VentasRoutes from './routes/VentasRouter.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', UserRoutes);
app.use('/api/prediccion', PrediccionRoutes);
app.use('/api/productos', ProductRoutes);
app.use('/api/ventas', VentasRoutes);

export default app;
