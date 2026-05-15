import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Handle 401 errors (e.g., redirect to login page)
    }
    return Promise.reject(error);
  }
);

export default api;
