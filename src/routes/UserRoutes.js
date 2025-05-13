import { Router } from "express";
import { iniciarSession } from "../controllers/loginController.js";
import { ConsultarUsuario, RegistrarEmpleado,RegistrarUsuario, EliminarEmpleado } from "../controllers/userController.js";

const router = Router();

router.get('/users', ConsultarUsuario);
router.post('/users', RegistrarUsuario);
router.delete('/users',EliminarEmpleado);
router.get('/login', iniciarSession);

export default router;