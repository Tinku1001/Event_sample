import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFiles = async (files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  
  return api.post('/files/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 120000, // 2 minutes for file upload
  });
};

export const searchEvents = async (searchParams) => {
  return api.post('/events/search/', searchParams);
};

export const getStats = async () => {
  return api.get('/events/stats/');
};

export const getFiles = async () => {
  return api.get('/files/');
};

export default api;