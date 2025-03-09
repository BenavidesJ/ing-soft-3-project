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

const router = express.Router();

// crear recurso
router.post('/crear', createResource);
// editar recursos
router.patch('/modificar', updateResource);
// asignar recursos a una tarea
router.patch('/asignar', assignResourceToTask);
// obtener todos los recursos creados
router.get('/', getAllResources);
// obtener todos los recursos asignados a un proyecto
router.get('/proyecto/:id', getResourcesByProject);
// obtener todos los recursos asignados a una tarea
router.get('/tarea/:id', getResourcesByTask);
// eliminar un recurso
router.delete('/eliminar/:id', deleteResource);

export default router;
