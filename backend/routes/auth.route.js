import express from 'express';
import {
  login,
  registro,
  resetearPassword,
} from '../controllers/auth.controller.js';

const router = express.Router();
// Inicio de Sesión
router.post('/login', login);
// Registro de Usuario
router.post('/registro', registro);
// Resetear Contraseña
router.post('/resetearPassword', resetearPassword);

export default router;
