import express from 'express';
import {
  assignResourceToTask,
  createResource,
  deleteResource,
  getAllResources,
  getResourcesByProject,
  getResourcesByTask,
  updateResource,
} from '../controllers/recursos.controller.js';
import { authenticate } from '../middlewares/authorization.js';

const router = express.Router();

// crear recurso
router.post('/crear', authenticate, createResource);
// editar recursos
router.patch('/modificar', authenticate, updateResource);
// asignar recursos a una tarea
router.patch('/asignar', assignResourceToTask);
// obtener todos los recursos creados
router.get('/', getAllResources);
// obtener todos los recursos asignados a un proyecto
router.get('/proyecto/:id', getResourcesByProject);
// obtener todos los recursos asignados a una tarea
router.get('/tarea/:id', getResourcesByTask);
// eliminar un recurso
router.delete('/eliminar/:id', authenticate, deleteResource);

export default router;
