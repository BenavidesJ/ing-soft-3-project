import express from 'express';
import { createStatus } from '../controllers/estado.controller.js';

const router = express.Router();

// crear un estado
router.post('/crear', createStatus);
// modificar un estado
router.patch('/modificar', () => {});
// modificar estado de un proyecto
router.patch('/modificar-estado/:id', () => {});
// asignar estado a un proyecto o tarea
router.patch('/asignar-estado', () => {});
// obtener todos los estados
router.get('/', () => {});
// obtener un estado por su ID
router.get('/:id', () => {});
// eliminar un estado (borrado lógico)
router.patch('/eliminar/:id', () => {});

export default router;
