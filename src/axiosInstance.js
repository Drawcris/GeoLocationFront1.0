import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7213',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
