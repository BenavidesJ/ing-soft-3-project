import api from './api';
import { ApiResponse, Proyecto, Costo } from './types';

export const createProyecto = (data: {
  Nombre: string;
  Descripcion: string;
  Objetivo: string;
  FechaInicio: string;
  FechaFin?: string;
  Presupuesto: number;
  Estado: string;
}) => {
  return api.post<ApiResponse<{ idProyecto: number }>>('proyectos/crear', data);
};

export const createCosto = (data: {
  idProyecto: number;
  CostoTotal: number;
}) => {
  return api.post<ApiResponse<Costo>>('proyectos/costo', data);
};

export const assignTaskToProject = (data: {
  idProyecto: number;
  idTarea: number;
}) => {
  return api.post<ApiResponse<null>>('proyectos/asignar-tarea', data);
};

export const updateProyecto = (
  data: Partial<Proyecto> & { idProyecto: number }
) => {
  return api.patch<ApiResponse<null>>('proyectos/modificar', data);
};

export const getAllProyectos = () => {
  return api.get<ApiResponse<Proyecto[]>>('proyectos/');
};

export const getProyectosByStatus = (data: { NombreEstado: string }) => {
  return api.get<ApiResponse<Proyecto[]>>('proyectos/estado/', { data });
};

export const getProyectoById = (id: number) => {
  return api.get<ApiResponse<Proyecto>>(`proyectos/${id}`);
};

export const deleteProyecto = (id: number) => {
  return api.patch<ApiResponse<null>>(`proyectos/eliminar/${id}`);
};
