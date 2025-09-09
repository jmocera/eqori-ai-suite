import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
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

// Auth API calls
export const authAPI = {
  register: async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },

  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Generation API calls
export const generationAPI = {
  generateContent: async (productData) => {
    const response = await api.post('/generate', productData);
    return response.data;
  },

  getGenerations: async (skip = 0, limit = 50) => {
    const response = await api.get(`/generations?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  getGeneration: async (id) => {
    const response = await api.get(`/generations/${id}`);
    return response.data;
  },

  updateGeneration: async (id, updates) => {
    const response = await api.put(`/generations/${id}`, updates);
    return response.data;
  },

  deleteGeneration: async (id) => {
    const response = await api.delete(`/generations/${id}`);
    return response.data;
  },
};

export default api;