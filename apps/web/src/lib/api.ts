import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
});

api.interceptors.response.use(
  (r) => r,
  (e) => {
    return Promise.reject(e);
  },
);
