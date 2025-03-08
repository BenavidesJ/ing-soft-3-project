import express from 'express';

const router = express.Router();

// crear una tarea
router.post('/crear', () => {});
// modificar una tarea
router.patch('/modificar', () => {});
// asignar tarea a miembro del equipo
router.patch('/asignar-miembro', () => {});
// obtener todas las tareas
router.get('/', () => {});
// obtener tareas por estado
router.get('/estado/:estado', () => {});
// obtener tareas de un proyecto
router.get('/proyecto/:id', () => {});
// obtener tareas que han sido asignadas a un miembro del equipo
router.get('/miembro/:id', () => {});
// obtener una tarea por su ID
router.get('/:id', () => {});
// eliminar una tarea (borrado lógico)
router.patch('/eliminar/:id', () => {});

export default router;
