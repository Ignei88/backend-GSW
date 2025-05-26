import { Router } from "express";
import { iniciarSession } from "../controllers/loginController.js";
import { ConsultarUsuarios, RegistrarEmpleado,RegistrarUsuario, EliminarEmpleado } from "../controllers/userController.js";

const router = Router();

router.get('/users', ConsultarUsuarios);
router.post('/users', RegistrarUsuario);
router.delete('/users',EliminarEmpleado);
router.post('/login', iniciarSession);

export default router;