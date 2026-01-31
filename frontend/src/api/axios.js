import axios from 'axios';

// Dynamically determine API base URL based on current protocol
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // If accessing via HTTPS, use HTTPS API
    if (protocol === 'https:') {
      return `https://${hostname}/api`;
    }
    // If accessing via HTTP, use HTTP API
    return `http://${hostname}/api`;
  }
  
  // Fallback for server-side rendering
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
