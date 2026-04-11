import axios from 'axios';
import { toast } from 'react-toastify';

export const API_URL = 'http://localhost:8080';

const $api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});

$api.interceptors.request.use(
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

$api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
            toast.error('Cannot connect to backend server.', {
                position: "top-right",
                autoClose: 8000,
            });
        }
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            toast.error('Session expired. Please login again.');
            setTimeout(() => {
                window.location.href = '/auth';
            }, 1500);
        }
        return Promise.reject(error);
    }
);

export default $api;