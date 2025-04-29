import { Router } from "express";
import { iniciarSession } from "../controllers/loginController.js";

const router = Router();

router.get('/login', iniciarSession);

export default router;