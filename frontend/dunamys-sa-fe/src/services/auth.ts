import api from './api';

export interface RegisterData {
  Correo: string;
  Contrasena: string;
  Nombre: string;
  Apellido1: string;
  Apellido2?: string;
}

export type RestorePasswordInputData = Pick<RegisterData, 'Correo'>;

export const login = (credentials: { Correo: string; Contrasena: string }) => {
  return api.post('auth/login', credentials);
};

export const registro = (data: RegisterData) => {
  return api.post('auth/registro', data);
};

export const restaurarPassword = (data: RestorePasswordInputData) => {
  return api.post('auth/resetearPassword', data);
};
