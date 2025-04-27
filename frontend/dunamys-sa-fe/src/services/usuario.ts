import api from './api';
import { ApiResponse, Usuario } from './types';

export const createUser = (data: {
  Nombre: string;
  Apellido1: string;
  Apellido2?: string;
  Correo: string;
  Contrasena: string;
}) => {
  return api.post<ApiResponse<Usuario>>('usuarios/crear', data);
};

export const updateUser = (data: {
  idUsuario: number;
  Nombre?: string;
  Apellido1?: string;
  Apellido2?: string;
  Correo?: string;
  Contrasena?: string;
  Activo?: boolean;
  Username?: string;
  Imagen?: string;
}) => {
  return api.patch<ApiResponse<null>>('usuarios/modificar', data);
};

export const getUsers = () => {
  return api.get<ApiResponse<Usuario[]>>('usuarios/');
};

export const getUserByID = (id: number) => {
  return api.get<ApiResponse<Usuario>>(`usuarios/${id}`);
};

export const deleteUser = (id: number) => {
  return api.patch<ApiResponse<null>>(`usuarios/eliminar/${id}`);
};

export const changePassword = (data: {
  idUsuario: number;
  currentPassword: string;
  newPassword: string;
}) => {
  return api.patch<ApiResponse<null>>('auth/cambiarPassword', data);
};
