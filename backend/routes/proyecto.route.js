import express from 'express';
import { createProject } from '../controllers/proyecto.controller.js';

const router = express.Router();

// crear un proyecto
router.post('/crear', createProject);
// crear un costo y asignarlo a un proyecto
router.post('/costo/:id', () => {});
// modificar un proyecto
router.patch('/modificar', () => {});
// modificar costo de un proyecto
router.patch('/modificar-costo/:id', () => {});
// asignar presupuesto a un proyecto
router.patch('/asignar-presupuesto', () => {});
// obtener todos los proyectos
router.get('/', () => {});
// obtener proyecto por estado
router.get('/estado/:estado', () => {});
// obtener un proyecto por su ID
router.get('/:id', () => {});
// eliminar un proyecto (borrado lógico)
router.patch('/eliminar/:id', () => {});

export default router;
