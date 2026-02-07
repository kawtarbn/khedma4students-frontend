import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://khedma4students-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const studentId = localStorage.getItem('studentId');
    const employerId = localStorage.getItem('employerId');
    
    if (studentId) {
      config.headers['X-Student-ID'] = studentId;
    }
    if (employerId) {
      config.headers['X-Employer-ID'] = employerId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage on unauthorized
      localStorage.removeItem('studentId');
      localStorage.removeItem('employerId');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Student Services
export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  login: (credentials) => api.post('/login', credentials),
  getServices: (id) => api.get(`/students/${id}/services`),
  getApplications: (id) => api.get(`/students/${id}/applications`),
  getHiringRequests: (id) => api.get(`/hiring-requests/student/${id}`),
  forgotPassword: (email) => api.post('/forgot-password', email),
  verifyEmail: (data) => api.post('/verify-email', data),
  resendVerification: (data) => api.post('/resend-verification', data),
  getServiceApplications: (studentId) => api.get(`/students/${studentId}/service-applications`),
};

// Employer Services
export const employerAPI = {
  getAll: () => api.get('/employers'),
  getById: (id) => api.get(`/employers/${id}`),
  create: (data) => api.post('/employers', data),
  update: (id, data) => api.put(`/employers/${id}`, data),
  delete: (id) => api.delete(`/employers/${id}`),
  login: (credentials) => api.post('/employer-login', credentials),
  getJobs: (id) => api.get(`/employers/${id}/jobs`),
  getApplications: (id) => api.get(`/employers/${id}/applications`),
  getHiringRequests: (id) => api.get(`/hiring-requests/employer/${id}`),
  forgotPassword: (email) => api.post('/employer-forgot-password', email),
  verifyEmail: (data) => api.post('/employer-verify-email', data),
  resendVerification: (data) => api.post('/employer-resend-verification', data),
};

// Job Services
export const jobAPI = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

// Request Services
export const requestAPI = {
  getAll: () => api.get('/requests'),
  getById: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post('/requests', data),
  update: (id, data) => api.put(`/requests/${id}`, data),
  delete: (id) => api.delete(`/requests/${id}`),
};

// Service Services
export const serviceAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
};

// Review Services
export const reviewAPI = {
  getAll: () => api.get('/reviews'),
  create: (data) => api.post('/reviews', data),
};

// Success Stories Services
export const successStoryAPI = {
  getAll: () => api.get('/success-stories'),
};

// Application Services
export const applicationAPI = {
  getAll: () => api.get('/applications'),
  getById: (id) => api.get(`/applications/${id}`),
  create: (data) => api.post('/applications', data),
  update: (id, data) => api.put(`/applications/${id}`, data),
  delete: (id) => api.delete(`/applications/${id}`),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
};

// Contact Services
export const contactAPI = {
  create: (data) => api.post('/contact', data),
};

// Health check
export const healthCheck = () => api.get('/ping');

export default api;
