import express from 'express';
import {
  assignStatus,
  createStatus,
  deleteStatus,
  getAllStatuses,
  getStatusById,
  updateStatus,
} from '../controllers/estado.controller.js';
import { authenticate } from '../middlewares/authorization.js';

const router = express.Router();

// crear un estado
router.post('/crear', authenticate, createStatus);
// modificar un estado
router.patch('/modificar', authenticate, updateStatus);
// asignar estado a un proyecto o tarea
router.patch('/asignar-estado', assignStatus);
// obtener todos los estados
router.get('/', getAllStatuses);
// obtener un estado por su ID
router.get('/:id', getStatusById);
// eliminar un estado
router.delete('/eliminar/:id', authenticate, deleteStatus);

export default router;
