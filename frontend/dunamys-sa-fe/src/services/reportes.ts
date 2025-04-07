import api from './api';
import { ApiResponse } from './types';

export const getReportAvancePorProyectos = (filters?: {
  fechaInicio?: string;
  fechaFin?: string;
}) => {
  return api.get<ApiResponse<any>>('reportes/avance-proyectos', {
    params: filters,
  });
};

export const getReportFinancieroProyectos = () => {
  return api.get<ApiResponse<any>>('reportes/financiero-proyectos');
};

export const getReportAsignacionRecursos = () => {
  return api.get<ApiResponse<any>>('reportes/asignacion-recursos');
};

export const getReportCargaTrabajoPorMiembro = () => {
  return api.get<ApiResponse<any>>('reportes/carga-trabajo-por-miembro');
};

export const getReportComparativoProyectos = () => {
  return api.get<ApiResponse<any>>('reportes/comparativo-proyectos');
};

export const getReportTareasPendientesVencidas = () => {
  return api.get<ApiResponse<any>>('reportes/tareas-pendientes-vencidas');
};

export const getReportProyectosPorEstado = (estado?: string) => {
  return api.get<ApiResponse<any>>('reportes/proyectos-por-estado', {
    data: { estado },
  });
};

export const getReportActividadSistema = () => {
  return api.get<ApiResponse<any>>('reportes/actividad-sistema');
};

export const getReportTareasPorFechaVencimiento = () => {
  return api.get<ApiResponse<any>>('reportes/tareas-por-fecha-vencimiento');
};

export const getReportProyectosActivosVsInactivos = () => {
  return api.get<ApiResponse<any>>('reportes/proyectos');
};

export const getReportTareasActivosVsInactivos = () => {
  return api.get<ApiResponse<any>>('reportes/tareas');
};

export const getReportUsuariosActivosVsInactivos = () => {
  return api.get<ApiResponse<any>>('reportes/usuarios');
};
