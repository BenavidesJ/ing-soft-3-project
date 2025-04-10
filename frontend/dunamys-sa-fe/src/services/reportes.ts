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

export const getReportFinancieroProyectos = (filters?: {
  fechaInicio?: string;
  fechaFin?: string;
}) => {
  return api.get<ApiResponse<any>>('reportes/financiero-proyectos', {
    params: filters,
  });
};

export const getReportAsignacionRecursos = (filters?: {
  fechaInicio?: string;
  fechaFin?: string;
}) => {
  return api.get<ApiResponse<any>>('reportes/asignacion-recursos', {
    params: filters,
  });
};

export const getReportCargaTrabajoPorMiembro = (filters?: {
  fechaInicio?: string;
  fechaFin?: string;
}) => {
  return api.get<ApiResponse<any>>('reportes/carga-trabajo-por-miembro', {
    params: filters,
  });
};

export const getReportComparativoProyectos = (filters?: {
  fechaInicio?: string;
  fechaFin?: string;
}) => {
  return api.get<ApiResponse<any>>('reportes/comparativo-proyectos', {
    params: filters,
  });
};

export const getReportTareasPendientesVencidas = (filters?: {
  fechaInicio?: string;
  fechaFin?: string;
}) => {
  return api.get<ApiResponse<any>>('reportes/tareas-pendientes-vencidas', {
    params: filters,
  });
};

export const getReportProyectosPorEstado = (estado?: string) => {
  return api.get<ApiResponse<any>>('reportes/proyectos-por-estado', {
    params: { estado },
  });
};

export const getReportActividadSistema = (filters?: {
  fechaInicio?: string;
  fechaFin?: string;
}) => {
  return api.get<ApiResponse<any>>('reportes/actividad-sistema', {
    params: filters,
  });
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
