import express from 'express';
import {
  assignTaskToProject,
  createCost,
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectsByStatus,
  getProjectsByUser,
  updateProject,
} from '../controllers/proyecto.controller.js';
import { authenticate } from '../middlewares/authorization.js';
import { checkWritePermission } from '../middlewares/checkWritePermission.js';

const router = express.Router();

// crear un proyecto
router.post('/crear', authenticate, checkWritePermission, createProject);
// crear un costo y asignarlo a un proyecto
router.post('/costo', authenticate, checkWritePermission, createCost);
// asignar una tarea a un proyecto
router.post('/asignar-tarea', assignTaskToProject);
// modificar un proyecto
router.patch('/modificar', authenticate, checkWritePermission, updateProject);
// obtener todos los proyectos
router.get('/', getAllProjects);
// obtener proyecto por estado
router.get('/estado/', getProjectsByStatus);
// obtener un proyecto por su ID
router.get('/:id', getProjectById);
// obtener los proyectos por usuario
router.get('/usuario/:id', getProjectsByUser);
// eliminar un proyecto (borrado lógico)
router.patch(
  '/eliminar/:id',
  authenticate,
  checkWritePermission,
  deleteProject
);

export default router;
