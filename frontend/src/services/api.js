import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (formData) => {
    const data = new FormData();
    data.append('username', formData.username);
    data.append('password', formData.password);
    return api.post('/auth/login', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getCurrentUser: () => api.get('/auth/me'),
};

// Generation API calls
export const generationAPI = {
  generateContent: (generationData) => api.post('/generation/generate', generationData),
  getHistory: () => api.get('/generation/history'),
  getGeneration: (id) => api.get(`/generation/${id}`),
  updateGeneration: (id, updateData) => api.put(`/generation/${id}`, updateData),
  deleteGeneration: (id) => api.delete(`/generation/${id}`),
};

export default api;