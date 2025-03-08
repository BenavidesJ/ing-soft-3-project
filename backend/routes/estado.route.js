import express from 'express';

const router = express.Router();

// crear un estado
router.post('/crear');
// modificar un estado
router.patch('/modificar');
// modificar estado de un proyecto
router.patch('/modificar-estado/:id');
// asignar presupuesto a un proyecto
router.patch('/asignar-presupuesto');
// obtener todos los estados
router.get('/');
// obtener un estado por su ID
router.get('/:id');
// eliminar un estado (borrado lógico)
router.patch('/eliminar/:id');

export default router;
