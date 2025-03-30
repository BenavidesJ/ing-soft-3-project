import api from './api';
import { ApiResponse, Tarea } from './types';

export const createTarea = (data: {
  Nombre: string;
  Descripcion: string;
  FechaInicio: string;
  FechaFin?: string;
  Status: string;
}) => {
  return api.post<ApiResponse<Tarea>>('tareas/crear', data);
};

export const updateTarea = (data: Partial<Tarea> & { idTarea: number }) => {
  return api.patch<ApiResponse<null>>('tareas/modificar', data);
};

export const assignTareaToMember = (data: {
  idTarea: number;
  idUsuario: number;
}) => {
  return api.patch<ApiResponse<null>>('tareas/asignar-miembro', data);
};

export const getAllTareas = () => {
  return api.get<ApiResponse<Tarea[]>>('tareas/');
};

export const getAllTareasWithResources = () => {
  return api.get<ApiResponse<Tarea[]>>('tareas/resources/');
};

export const getTareasByStatus = (data: { NombreEstado: string }) => {
  return api.get<ApiResponse<Tarea[]>>('tareas/estado/', { data });
};

export const getTareasByProject = (idProyecto: number) => {
  return api.get<ApiResponse<Tarea[]>>(`tareas/proyecto/${idProyecto}`);
};

export const getTareasByMember = (idUsuario: number) => {
  return api.get<ApiResponse<Tarea[]>>(`tareas/miembro/${idUsuario}`);
};

export const getTareaById = (idTarea: number) => {
  return api.get<ApiResponse<Tarea>>(`tareas/${idTarea}`);
};

export const deleteTarea = (idTarea: number) => {
  return api.patch<ApiResponse<null>>(`tareas/eliminar/${idTarea}`);
};

export const getTaskByUser = (idTarea: number) => {
  return api.get<ApiResponse<any>>(`tareas/tarea/${idTarea}`);
};
