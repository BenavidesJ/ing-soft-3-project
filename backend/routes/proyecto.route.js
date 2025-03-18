import express from 'express';
import {
  assignTaskToProject,
  createCost,
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectsByStatus,
  updateProject,
} from '../controllers/proyecto.controller.js';
import { authenticate } from '../middlewares/authorization.js';

const router = express.Router();

// crear un proyecto
router.post('/crear', authenticate, createProject);
// crear un costo y asignarlo a un proyecto
router.post('/costo', authenticate, createCost);
// asignar una tarea a un proyecto
router.post('/asignar-tarea', assignTaskToProject);
// modificar un proyecto
router.patch('/modificar', authenticate, updateProject);
// obtener todos los proyectos
router.get('/', getAllProjects);
// obtener proyecto por estado
router.get('/estado/', getProjectsByStatus);
// obtener un proyecto por su ID
router.get('/:id', getProjectById);
// eliminar un proyecto (borrado lógico)
router.patch('/eliminar/:id', authenticate, deleteProject);

export default router;
