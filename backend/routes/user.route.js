import express from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/usuario.controller.js';

const router = express.Router();

// crear un usuario
router.post('/crear', createUser);
// modificar un usuario
router.patch('/modificar', updateUser);
// modificar el perfil de un usuario
router.patch('/modificar-perfil');
// obtener todos los usuarios
router.get('/', getUsers);
// obtener un usuario por su ID
router.get('/:id', getUserById);
// eliminar un usuario (borrado lógico)
router.patch('/eliminar/:id', deleteUser);

export default router;
