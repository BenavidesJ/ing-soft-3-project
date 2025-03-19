import axios from 'axios';
import { showToast } from './toastService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4040/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const storedData = localStorage.getItem('user');
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      const token = parsedData.data?.Access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error(
        'Error al parsear los datos de autenticación almacenados:',
        error
      );
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    if (method && method !== 'get') {
      const message = response.data?.message;
      if (message) {
        showToast(message, 'success');
      }
    }
    return response;
  },

  (error) => {
    let errorMessage = '';
    if (error.response) {
      errorMessage =
        error.response.data.message || 'Error en la respuesta del servidor.';
      showToast(errorMessage, 'danger');
    } else if (error.request) {
      errorMessage = 'No se recibió respuesta del servidor.';
      showToast(errorMessage, 'warning');
    } else {
      errorMessage = error.message;
      showToast(errorMessage, 'danger');
    }

    return Promise.reject(error);
  }
);

export default api;
