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
// eliminar un usuario (borrado lógico)
router.patch('/eliminar', deleteUser);
// obtener un usuario por su ID
router.get('/usuario/:id', getUserById);
// obtener todos los usuarios
router.get('/usuarios', getUsers);

export default router;
