import express from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/usuario.controller.js';
import { authenticate } from '../middlewares/authorization.js';

const router = express.Router();

// crear un usuario
router.post('/crear', authenticate, createUser);
// modificar un usuario
router.patch('/modificar', authenticate, updateUser);
// modificar el perfil de un usuario
// router.patch('/modificar-perfil', () => {});
// obtener todos los usuarios
router.get('/', getUsers);
// obtener un usuario por su ID
router.get('/:id', getUserById);
// eliminar un usuario (borrado lógico)
router.patch('/eliminar/:id', authenticate, deleteUser);

export default router;
