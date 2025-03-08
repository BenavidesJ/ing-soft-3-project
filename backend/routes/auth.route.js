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
// crear rol
router.post('/rol');
// crear permiso
router.post('/permiso');
// asignar rol a usuario
router.post('/rol');
// asignar permiso a rol
router.post('/asignar-permiso');
// modificar rol de usuario
router.patch('/modificar-rol');
// modificar permiso de rol
router.patch('/modificar-permiso');

export default router;
