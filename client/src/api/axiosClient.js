import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.PROD ? '/griha-pravesam-tracker/api' : 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('griha_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;