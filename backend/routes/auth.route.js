import express from 'express';
import {
  assignPermissionToRole,
  assignRoleToUser,
  createPermission,
  createRole,
  getAllPermissions,
  getAllRoles,
  login,
  modifyRolePermission,
  modifyUserRole,
  registro,
  resetearPassword,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authorization.js';

const router = express.Router();
// Inicio de Sesión
router.post('/login', login);
// Registro de Usuario
router.post('/registro', registro);
// Resetear Contraseña
router.post('/resetearPassword', resetearPassword);
// crear rol
router.post('/rol', authenticate, createRole);
// crear permiso
router.post('/permiso', authenticate, createPermission);
// obtener roles
router.get('/roles', getAllRoles);
// obtener permisos
router.get('/permisos', getAllPermissions);
// asignar rol a usuario
router.post('/asignar-rol', authenticate, assignRoleToUser);
// asignar permiso a rol
router.post('/asignar-permiso', authenticate, assignPermissionToRole);
// modificar rol de usuario
router.patch('/modificar-rol', authenticate, modifyUserRole);
// modificar permiso de rol
router.patch('/modificar-permiso', authenticate, modifyRolePermission);

export default router;
