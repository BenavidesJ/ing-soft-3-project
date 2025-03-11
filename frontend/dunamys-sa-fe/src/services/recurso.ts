import api from './api';
import { ApiResponse, Recurso } from './types';

export const createRecurso = (data: { Nombre: string }) => {
  return api.post<ApiResponse<Recurso>>('recursos/crear', data);
};

export const updateRecurso = (data: { idRecurso: number; Nombre: string }) => {
  return api.patch<ApiResponse<null>>('recursos/modificar', data);
};

export const assignRecursoToTask = (data: {
  idTarea: number;
  recursos: number[];
}) => {
  return api.patch<ApiResponse<null>>('recursos/asignar', data);
};

export const getAllRecursos = () => {
  return api.get<ApiResponse<Recurso[]>>('recursos/');
};

export const getRecursosByProject = (idProyecto: number) => {
  return api.get<ApiResponse<Recurso[]>>(`recursos/proyecto/${idProyecto}`);
};

export const getRecursosByTask = (idTarea: number) => {
  return api.get<ApiResponse<Recurso[]>>(`recursos/tarea/${idTarea}`);
};

export const deleteRecurso = (idRecurso: number) => {
  return api.delete<ApiResponse<null>>(`recursos/eliminar/${idRecurso}`);
};
