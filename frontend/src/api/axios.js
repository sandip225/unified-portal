import axios from 'axios';

// Dynamic API base URL - works for localhost and EC2
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // Development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8002/api';
  }
  
  // Production - use nginx proxy path instead of direct port
  return `http://${hostname}/api`;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  console.log('Axios interceptor - URL:', config.url);
  
  // Check if it's an admin route
  if (config.url?.includes('/admin')) {
    const adminToken = localStorage.getItem('admin_token');
    console.log('Admin route detected, token exists:', !!adminToken);
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
      console.log('Authorization header set for admin route');
    }
  } else {
    const token = localStorage.getItem('token');
    console.log('Regular route, token exists:', !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set for regular route');
    }
  }
  
  console.log('Final headers:', config.headers);
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
