import express from 'express';
import {
  assignTaskToMember,
  createTask,
  deleteTask,
  getAllTasks,
  getAllTasksWithResources,
  getTaskById,
  getTasksByMember,
  getTasksByProject,
  getTasksByStatus,
  getUserByTask,
  updateTask,
} from '../controllers/tarea.controller.js';
import { authenticate } from '../middlewares/authorization.js';

const router = express.Router();

// crear una tarea
router.post('/crear', authenticate, createTask);
// modificar una tarea
router.patch('/modificar', authenticate, updateTask);
// asignar tarea a miembro del equipo
router.patch('/asignar-miembro', assignTaskToMember);
// obtener todas las tareas
router.get('/', getAllTasks);
// obtener todas las tareas con recursos
router.get('/resources/', getAllTasksWithResources);
// obtener tareas por estado
router.get('/estado/', getTasksByStatus);
// obtener tareas de un proyecto
router.get('/proyecto/:id', getTasksByProject);
// obtener tareas que han sido asignadas a un miembro del equipo
router.get('/miembro/:id', getTasksByMember);
// obtener el usuario asignado a una tarea
router.get('/tarea/:id', getUserByTask);
// obtener una tarea por su ID
router.get('/:id', getTaskById);
// eliminar una tarea (borrado lógico)
router.patch('/eliminar/:id', authenticate, deleteTask);

export default router;
