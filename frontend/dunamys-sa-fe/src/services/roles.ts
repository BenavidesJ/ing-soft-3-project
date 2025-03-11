import api from './api';
import { ApiResponse, Rol, Permiso } from './types';

export const createRol = (data: { NombreRol: string }) => {
  return api.post<ApiResponse<Rol>>('auth/rol', data);
};

export const createPermiso = (data: { NombrePermiso: string }) => {
  return api.post<ApiResponse<Permiso>>('auth/permiso', data);
};

export const assignRolToUser = (data: { idUsuario: number; idRol: number }) => {
  return api.post<ApiResponse<null>>('auth/asignar-rol', data);
};

export const assignPermisoToRol = (data: {
  idRol: number;
  idPermiso: number;
}) => {
  return api.post<ApiResponse<null>>('auth/asignar-permiso', data);
};

export const modifyUserRol = (data: { idUsuario: number; roles: number[] }) => {
  return api.patch<ApiResponse<null>>('auth/modificar-rol', data);
};

export const modifyRolPermiso = (data: {
  idRol: number;
  permisos: number[];
}) => {
  return api.patch<ApiResponse<null>>('auth/modificar-permiso', data);
};
