import axios from 'axios';

// Create base Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 10000,
});

// Request Interceptor: Attach Auth Token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('watchlist_token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear invalid token
      const currentToken = localStorage.getItem('watchlist_token');
      if (currentToken) {
        localStorage.removeItem('watchlist_token');
        localStorage.removeItem('watchlist_user');
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
