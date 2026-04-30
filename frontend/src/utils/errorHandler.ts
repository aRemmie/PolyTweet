import { toast } from 'react-toastify';

export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

export const handleApiError = (error: any): string => {
    let message = 'An unexpected error occurred';

    if (error.code === 'ERR_NETWORK') {
        message = 'Cannot connect to server.';
        toast.error(message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    } else if (error.response?.status === 401) {
        message = 'Unauthorized.';
        toast.error(message);
    } else if (error.response?.status === 400) {
        message = error.response?.data?.message || 'Bad request.';
        toast.warning(message);
    } else if (error.response?.status === 500) {
        message = 'Server error. Please try again later.';
        toast.error(message);
    } else if (error.message === 'Network Error') {
        message = 'Network error.';
        toast.error(message);
    } else {
        message = error.response?.data?.message || error.message || message;
        toast.error(message);
    }

    console.error('API Error:', error);
    return message;
};

export const setupGlobalErrorHandler = () => {
    const originalConsoleError = console.error;

    console.error = (...args) => {
        const errorString = args.join(' ');
        if (errorString.includes('Network Error') || errorString.includes('CORS')) {
            toast.error('Backend connection error.', {
                position: 'top-right',
                autoClose: false,
                closeOnClick: true,
                draggable: true,
            });
        }
        originalConsoleError.apply(console, args);
    };
};
