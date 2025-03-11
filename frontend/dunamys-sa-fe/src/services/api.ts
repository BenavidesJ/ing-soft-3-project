import axios from 'axios';
import { showToast } from './toastService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4040/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  // Respuesta es exitosa
  (response) => response,
  // Error
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
