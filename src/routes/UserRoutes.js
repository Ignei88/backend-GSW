import { Router } from "express";
import { ConsultarUsuario, RegistrarEmpleado,RegistrarUsuario } from "../controllers/userController.js";

const router = Router();

router.get('/users', ConsultarUsuario);
router.post('/users', RegistrarUsuario);

router.put('/users', (req, res) => res.send('actualizando usuario'));
router.delete('/users', (req, res) => res.send('eliminando usuario'));

export default router;