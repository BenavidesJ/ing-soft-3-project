import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4040/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
