import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token to all requests if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('worklx_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401 Unauthorized errors to clear stale token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token only if on a protected route request failure
      const isAuthRoute = error.config.url.includes('/login') || error.config.url.includes('/register');
      if (!isAuthRoute) {
        localStorage.removeItem('worklx_token');
        localStorage.removeItem('worklx_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
