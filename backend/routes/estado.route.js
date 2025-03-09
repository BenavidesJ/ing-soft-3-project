import express from 'express';
import {
  assignStatus,
  createStatus,
  deleteStatus,
  getAllStatuses,
  getStatusById,
  updateStatus,
} from '../controllers/estado.controller.js';

const router = express.Router();

// crear un estado
router.post('/crear', createStatus);
// modificar un estado
router.patch('/modificar', updateStatus);
// asignar estado a un proyecto o tarea
router.patch('/asignar-estado', assignStatus);
// obtener todos los estados
router.get('/', getAllStatuses);
// obtener un estado por su ID
router.get('/:id', getStatusById);
// eliminar un estado
router.delete('/eliminar/:id', deleteStatus);

export default router;
