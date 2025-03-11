import api from './api';
import { ApiResponse, Estado } from './types';

export const createEstado = (data: { NombreEstado: string }) => {
  return api.post<ApiResponse<Estado>>('estados/crear', data);
};

export const updateEstado = (data: {
  idEstado: number;
  NombreEstado: string;
}) => {
  return api.patch<ApiResponse<Estado>>('estados/modificar', data);
};

export const assignEstado = (data: {
  tipo: string;
  id: number;
  idEstado: number;
}) => {
  return api.patch<ApiResponse<null>>('estados/asignar-estado', data);
};

export const getAllEstados = () => {
  return api.get<ApiResponse<Estado[]>>('estados/');
};

export const getEstadoById = (id: number) => {
  return api.get<ApiResponse<Estado>>(`estados/${id}`);
};

export const deleteEstado = (id: number) => {
  return api.delete<ApiResponse<null>>(`estados/eliminar/${id}`);
};
