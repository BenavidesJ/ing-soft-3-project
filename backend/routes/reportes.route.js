import express from 'express';
import {
  reportAvancePorProyectos,
  reportFinancieroProyectos,
  reportAsignacionRecursos,
  reportCargaTrabajoPorMiembro,
  reportComparativoProyectos,
  reportTareasPendientesVencidas,
  reportProyectosPorEstado,
  reportActividadSistema,
  reportTareasPorFechaVencimiento,
  reportProyectosActivosVsInactivos,
  reportTareasActivosVsInactivos,
  reportUsuariosActivosVsInactivos,
} from '../controllers/reportes.controller.js';

const router = express.Router();

// Ruta 1: Reporte de Avance por Proyectos
router.get('/avance-proyectos', reportAvancePorProyectos);
// Ruta 2: Reporte Financiero de Proyectos
router.get('/financiero-proyectos', reportFinancieroProyectos);
// Ruta 3: Reporte de Asignación de Recursos
router.get('/asignacion-recursos', reportAsignacionRecursos);
// Ruta 4: Reporte de Carga de Trabajo por Miembro
router.get('/carga-trabajo-por-miembro', reportCargaTrabajoPorMiembro);
// Ruta 5: Reporte Comparativo: Proyectos Planificados vs. Ejecutados
router.get('/comparativo-proyectos', reportComparativoProyectos);
// Ruta 6: Reporte de Tareas Pendientes y Vencidas
router.get('/tareas-pendientes-vencidas', reportTareasPendientesVencidas);
// Ruta 8: Reporte de Proyectos por Estado
router.get('/proyectos-por-estado', reportProyectosPorEstado);
// Ruta 9: Reporte de Actividad en el Sistema
router.get('/actividad-sistema', reportActividadSistema);
// Ruta 10: Reporte de Tareas por Fecha de Vencimiento
router.get('/tareas-por-fecha-vencimiento', reportTareasPorFechaVencimiento);
// Ruta 11: Reporte proyectos activos vs inactivos
router.get('/proyectos', reportProyectosActivosVsInactivos);
// Ruta 12: Reporte tareas activos vs inactivos
router.get('/tareas', reportTareasActivosVsInactivos);
// Ruta 13: Reporte usuarios activos vs inactivos
router.get('/usuarios', reportUsuariosActivosVsInactivos);

export default router;
