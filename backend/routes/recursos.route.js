import express from 'express';

const router = express.Router();

// crear recurso
router.post('/crear', () => {});
// editar recursos
router.patch('/modificar', () => {});
// asignar recursos a una tarea
router.patch('/asignar', () => {});
// obtener todos los recursos creados
router.get('/', () => {});
// obtener todos los recursos asignados a un proyecto
router.get('/proyecto/:id', () => {});
// obtener todos los recursos asignados a una tarea
router.get('/tarea/:id', () => {});
// eliminar un recurso
router.delete('/eliminar/:id', () => {});

export default router;
