import express from 'express';
import { db } from './db.js';
import UserRoutes from './routes/UserRoutes.js';
import LoginRoutes from './routes/LoginRoutes.js';
import PrediccionRoutes from './routes/PrediccionRoutes.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', UserRoutes);
app.use('/api/auth', LoginRoutes);
app.use('/api/prediccion', PrediccionRoutes);

app.listen(4000, () => {
  console.log('Server running on port 4000');
});