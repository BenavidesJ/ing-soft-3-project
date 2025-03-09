import express from 'express';
import {
  assignPermissionToRole,
  assignRoleToUser,
  createPermission,
  createRole,
  login,
  modifyRolePermission,
  modifyUserRole,
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
router.post('/rol', createRole);
// crear permiso
router.post('/permiso', createPermission);
// asignar rol a usuario
router.post('/asignar-rol', assignRoleToUser);
// asignar permiso a rol
router.post('/asignar-permiso', assignPermissionToRole);
// modificar rol de usuario
router.patch('/modificar-rol', modifyUserRole);
// modificar permiso de rol
router.patch('/modificar-permiso', modifyRolePermission);

export default router;
