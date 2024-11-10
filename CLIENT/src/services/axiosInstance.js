import axios from 'axios';

// Create an Axios instance with the base URL of your API
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Optionally, add a response interceptor for error handling
axiosInstance.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // Handle errors globally (optional)
  return Promise.reject(error);
});

export default axiosInstance;
